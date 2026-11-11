-- ==============================================================================
-- GOROD LOGISTICS — REAL-TIME BLUETOOTH WEIGHING SCALE INTEGRATION
-- Run AFTER supabase_sop_schema.sql, supabase_live_setup.sql, and
-- supabase_production_hardening.sql.
--
-- Safe to re-run (idempotent).
-- Implements:
--   - weighing_devices (registered scale / HC-05 bridge stations)
--   - weighing_settings (auditable ±5 kg default threshold configuration)
--   - weighing_measurements (immutable inward/outward/reweigh telemetry ledger)
--   - weighing_exceptions (SOP 4.1.8 & 4.2.5 discrepancy workflow)
--   - Outward delivery-zone verification columns on removals (SOP 4.2.5)
--   - Updated dashboard_jobs view & role-checked SECURITY DEFINER RPCs
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENUMS & EXTENSIONS TO EXISTING TABLES
-- ------------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'weighing_direction') then
    create type public.weighing_direction as enum ('inward', 'outward');
  end if;

  if not exists (select 1 from pg_type where typname = 'measurement_purpose') then
    create type public.measurement_purpose as enum ('initial', 'reweigh', 'verification', 'correction');
  end if;

  if not exists (select 1 from pg_type where typname = 'stability_source_type') then
    create type public.stability_source_type as enum ('DEVICE', 'SOFTWARE', 'MANUAL');
  end if;

  if not exists (select 1 from pg_type where typname = 'weighing_exception_status') then
    create type public.weighing_exception_status as enum (
      'WITHIN_THRESHOLD',
      'DISCREPANCY',
      'UNDER_REVIEW',
      'CUSTOMS_NOTIFIED',
      'AWAITING_INSTRUCTIONS',
      'RESOLVED',
      'CLOSED'
    );
  end if;
end;
$$;

alter table public.removals
  add column if not exists picked_condition_notes text,
  add column if not exists delivery_zone_weight_variance_kg numeric(10, 3),
  add column if not exists picked_photos_urls text[] default '{}';

-- ------------------------------------------------------------------------------
-- 2. WEIGHING DEVICES & CONFIGURABLE THRESHOLD SETTINGS
-- ------------------------------------------------------------------------------

create table if not exists public.weighing_devices (
  id uuid primary key default uuid_generate_v4(),
  device_code text not null unique,
  device_name text not null,
  indicator_model text not null default 'Casio Electronic Indicator',
  bluetooth_module text not null default 'HC-05 SPP',
  last_com_port text,
  baud_rate integer not null default 9600,
  is_active boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.weighing_devices (device_code, device_name, indicator_model, bluetooth_module, baud_rate)
values ('GL-SCALE-01', 'Warehouse Acceptance & Delivery Scale', 'Casio Electronic Indicator', 'HC-05 Bluetooth SPP', 9600)
on conflict (device_code) do nothing;

create table if not exists public.weighing_settings (
  id integer primary key default 1 check (id = 1),
  weight_threshold_kg numeric(8, 3) not null default 5.000 check (weight_threshold_kg > 0),
  updated_by uuid references public.profiles(id),
  update_reason text,
  updated_at timestamptz not null default now()
);

insert into public.weighing_settings (id, weight_threshold_kg, update_reason)
values (1, 5.000, 'SOP GL-BWH-SOP-01 Section 4.1.8 default internal escalation trigger (±5 kg)')
on conflict (id) do nothing;

-- ------------------------------------------------------------------------------
-- 3. IMMUTABLE WEIGHING MEASUREMENTS LEDGER (PHASE 7 & 8)
-- ------------------------------------------------------------------------------

create table if not exists public.weighing_measurements (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete restrict,
  inward_receipt_id uuid references public.inward_receipts(id) on delete restrict,
  removal_id uuid references public.removals(id) on delete restrict,
  device_id uuid references public.weighing_devices(id) on delete set null,
  direction public.weighing_direction not null,
  purpose public.measurement_purpose not null default 'initial',

  -- Measurements (kg canonical + original unit & raw packet preserved)
  measured_weight numeric(12, 4) not null,
  measured_unit text not null default 'kg',
  weight_kg numeric(12, 4) not null,
  reference_weight_kg numeric(12, 4) not null,
  variance_kg numeric(12, 4) not null,
  threshold_kg numeric(8, 3) not null default 5.000,
  discrepancy_status text not null check (discrepancy_status in ('WITHIN_THRESHOLD', 'DISCREPANCY')),

  -- Telemetry provenance
  raw_packet text,
  com_port text,
  stability_source public.stability_source_type not null default 'DEVICE',
  is_stable boolean not null default true,
  is_simulated boolean not null default false check (is_simulated = false),
  bridge_session_id text,

  -- Immutable correction chain
  supersedes_measurement_id uuid references public.weighing_measurements(id),
  correction_reason text,
  notes text,

  captured_by uuid not null references public.profiles(id),
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint chk_measurement_transaction check (
    (direction = 'inward' and inward_receipt_id is not null)
    or (direction = 'outward' and removal_id is not null)
  )
);

create index if not exists idx_weighing_measurements_job_id
  on public.weighing_measurements (job_id, captured_at desc);

create index if not exists idx_weighing_measurements_removal_id
  on public.weighing_measurements (removal_id, captured_at desc);

-- ------------------------------------------------------------------------------
-- 4. WEIGHING DISCREPANCY EXCEPTIONS (PHASE 9)
-- ------------------------------------------------------------------------------

create table if not exists public.weighing_exceptions (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references public.jobs(id) on delete restrict,
  boe_number text not null,
  direction public.weighing_direction not null,
  inward_receipt_id uuid references public.inward_receipts(id) on delete restrict,
  removal_id uuid references public.removals(id) on delete restrict,
  measurement_id uuid not null references public.weighing_measurements(id) on delete restrict,

  reference_weight_kg numeric(12, 4) not null,
  actual_weight_kg numeric(12, 4) not null,
  difference_kg numeric(12, 4) not null,
  threshold_kg numeric(8, 3) not null default 5.000,
  unit text not null default 'kg',

  status public.weighing_exception_status not null default 'DISCREPANCY',
  customs_notified_to text,
  customs_email_ref text,
  customs_notified_at timestamptz,
  resolution_ref text,
  resolution_notes text,
  supporting_evidence_urls text[] default '{}',

  created_by uuid not null references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  resolved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_weighing_exceptions_job_id
  on public.weighing_exceptions (job_id, created_at desc);

-- ------------------------------------------------------------------------------
-- 5. RLS POLICIES (NO DIRECT WRITES; READ-ONLY FOR AUTHENTICATED STAFF)
-- ------------------------------------------------------------------------------

alter table public.weighing_devices enable row level security;
alter table public.weighing_settings enable row level security;
alter table public.weighing_measurements enable row level security;
alter table public.weighing_exceptions enable row level security;

drop policy if exists "Staff can view weighing devices" on public.weighing_devices;
create policy "Staff can view weighing devices"
  on public.weighing_devices for select to authenticated using (true);

drop policy if exists "Staff can view weighing settings" on public.weighing_settings;
create policy "Staff can view weighing settings"
  on public.weighing_settings for select to authenticated using (true);

drop policy if exists "Staff can view weighing measurements" on public.weighing_measurements;
create policy "Staff can view weighing measurements"
  on public.weighing_measurements for select to authenticated using (true);

drop policy if exists "Staff can view weighing exceptions" on public.weighing_exceptions;
create policy "Staff can view weighing exceptions"
  on public.weighing_exceptions for select to authenticated using (true);

-- ------------------------------------------------------------------------------
-- 6. UPDATED DASHBOARD VIEW (APPENDS NEW COLUMNS AT END)
-- ------------------------------------------------------------------------------

create or replace view public.dashboard_jobs
with (security_invoker = true)
as
select
  j.id,
  j.job_number,
  j.customer_id,
  c.company_name                                    as customer_name,
  j.boe_number,
  j.boe_date,
  j.bond_number,
  j.cargo_description,
  j.declared_package_count                          as packages,
  j.declared_gross_weight                           as declared_weight_kg,
  j.status::text                                    as job_status,
  ir.actual_gross_weight                            as actual_weight_kg,
  ir.weight_variance                                as weight_variance_kg,
  coalesce(ir.weight_escalation_triggered, false)    as escalation_triggered,
  (r.ndc_number is not null)                        as ndc_cleared,
  r.outpass_number,
  r.status::text                                    as removal_status,
  inv.bin_code                                      as assigned_bin,
  j.created_at,
  ir.id                                             as receipt_id,
  ir.actual_package_count,
  ir.vehicle_registration,
  ir.driver_name,
  ir.otl_number,
  ir.cargo_condition_notes,
  ir.weight_escalation_customs_email_sent,
  ir.weight_escalation_resolved,
  ir.weight_escalation_customs_ref,
  ir.weight_escalation_resolution_ref,
  r.id                                              as removal_id,
  r.removal_number,
  r.type::text                                      as removal_type,
  r.ndc_number,
  r.payment_cleared,
  r.invoice_number,
  r.invoice_amount,
  r.requested_package_count,
  r.requested_weight_kg,
  r.requested_etd,
  r.picked_package_count,
  r.picked_actual_weight_kg,
  r.delivery_zone_verified_at,
  r.delivery_zone_weight_variance_kg,
  (select count(*)::integer from public.weighing_measurements wm where wm.job_id = j.id) as measurement_count,
  (select we.status::text from public.weighing_exceptions we where we.job_id = j.id order by we.created_at desc limit 1) as active_exception_status
from public.jobs j
join public.customers c on c.id = j.customer_id
left join lateral (
  select *
  from public.inward_receipts ir
  where ir.job_id = j.id
  order by ir.created_at desc
  limit 1
) ir on true
left join lateral (
  select *
  from public.removals r
  where r.job_id = j.id
  order by r.created_at desc
  limit 1
) r on true
left join lateral (
  select b.bin_code
  from public.inventory_items ii
  join public.warehouse_bins b on b.id = ii.bin_id
  where ii.job_id = j.id
  order by ii.created_at desc
  limit 1
) inv on true;

grant select on public.dashboard_jobs to authenticated;

-- ------------------------------------------------------------------------------
-- 7. ROLE-CHECKED SECURITY DEFINER RPCs
-- ------------------------------------------------------------------------------

-- 7.1 Update configurable threshold (Warehouse Keeper only, audited)
create or replace function public.update_weighing_threshold(
  p_threshold_kg numeric,
  p_reason       text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prev numeric(8, 3);
begin
  if public.current_user_role()::text <> 'warehouse_keeper' then
    raise exception 'Only the Warehouse Keeper can update the weighing discrepancy threshold.';
  end if;

  if p_threshold_kg is null or p_threshold_kg <= 0 or p_threshold_kg > 100 then
    raise exception 'Threshold must be between 0.001 and 100 kg.';
  end if;

  if coalesce(trim(p_reason), '') = '' then
    raise exception 'A statutory or operational reason is required to change the threshold.';
  end if;

  select weight_threshold_kg into v_prev from public.weighing_settings where id = 1;

  update public.weighing_settings
  set weight_threshold_kg = round(p_threshold_kg, 3),
      updated_by = auth.uid(),
      update_reason = trim(p_reason),
      updated_at = now()
  where id = 1;

  perform public.write_audit(
    'weighing_settings',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'THRESHOLD_UPDATED',
    jsonb_build_object(
      'previous_threshold_kg', v_prev,
      'new_threshold_kg', round(p_threshold_kg, 3),
      'reason', trim(p_reason)
    )
  );
end;
$$;

revoke all on function public.update_weighing_threshold(numeric, text) from public;
revoke all on function public.update_weighing_threshold(numeric, text) from anon;
grant execute on function public.update_weighing_threshold(numeric, text) to authenticated;

-- 7.2 Inward weighment with full Bluetooth scale telemetry + immutable measurement + exception
create or replace function public.record_inward_scale_weighment(
  p_job_id                     uuid,
  p_actual_weight_kg           numeric,
  p_actual_package_count       integer,
  p_vehicle_registration       text,
  p_driver_name                text,
  p_driver_license             text,
  p_arrival_security_type      text,
  p_otl_number                 text,
  p_otl_condition              text,
  p_customs_escort_name        text,
  p_customs_escort_designation text,
  p_cargo_condition_notes      text,
  p_checkpoints                jsonb,
  p_device_code                text default 'GL-SCALE-01',
  p_com_port                   text default null,
  p_raw_packet                 text default null,
  p_measured_weight            numeric default null,
  p_measured_unit              text default 'kg',
  p_stability_source           public.stability_source_type default 'DEVICE',
  p_is_stable                  boolean default true,
  p_is_simulated               boolean default false,
  p_bridge_session_id          text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job            public.jobs%rowtype;
  v_threshold      numeric(8, 3);
  v_variance       numeric(12, 4);
  v_triggered      boolean;
  v_receipt_id     uuid;
  v_device_id      uuid;
  v_measurement_id uuid;
begin
  if public.current_user_role()::text not in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper') then
    raise exception 'Only warehouse operations staff can record a weighment.';
  end if;

  if coalesce(p_is_simulated, false) then
    raise exception 'Simulated scale readings cannot be saved to production warehouse records.';
  end if;

  select * into v_job from public.jobs where id = p_job_id for update;
  if v_job.id is null then
    raise exception 'Job not found.';
  end if;

  if p_actual_weight_kg is null or p_actual_weight_kg <= 0
     or p_actual_package_count is null or p_actual_package_count <= 0 then
    raise exception 'Actual weight and package count must be greater than zero.';
  end if;

  if coalesce(trim(p_vehicle_registration), '') = ''
     or coalesce(trim(p_driver_name), '') = '' then
    raise exception 'Vehicle registration and driver name are required.';
  end if;

  if p_arrival_security_type not in ('otl', 'customs_escort') then
    raise exception 'Arrival security must be OTL or customs escort.';
  end if;

  if p_arrival_security_type = 'otl' then
    if coalesce(trim(p_otl_number), '') = '' then
      raise exception 'OTL number is required for an OTL arrival.';
    end if;
    if p_otl_condition is distinct from 'intact' then
      raise exception 'A non-intact OTL must be escalated to Customs before weighment.';
    end if;
  else
    if coalesce(trim(p_customs_escort_name), '') = ''
       or coalesce(trim(p_customs_escort_designation), '') = '' then
      raise exception 'Customs escort name and designation are required.';
    end if;
  end if;

  if not (
    coalesce((p_checkpoints->>'chk_job_docs_matched')::boolean, false)
    and coalesce((p_checkpoints->>'chk_vehicle_photo_recorded')::boolean, false)
    and coalesce((p_checkpoints->>'chk_otl_escort_verified')::boolean, false)
    and coalesce((p_checkpoints->>'chk_cargo_desc_matched')::boolean, false)
    and coalesce((p_checkpoints->>'chk_package_count_checked')::boolean, false)
    and coalesce((p_checkpoints->>'chk_cargo_condition_checked')::boolean, false)
    and coalesce((p_checkpoints->>'chk_weight_identified')::boolean, false)
    and coalesce((p_checkpoints->>'chk_customs_attendance_checked')::boolean, false)
    and coalesce((p_checkpoints->>'chk_unloading_readiness_confirmed')::boolean, false)
  ) then
    raise exception 'All nine pre-unloading checks must be completed before weighment.';
  end if;

  select coalesce((select weight_threshold_kg from public.weighing_settings where id = 1), 5.000)
  into v_threshold;

  v_variance := round(p_actual_weight_kg - v_job.declared_gross_weight, 4);
  v_triggered := abs(v_variance) > v_threshold;

  select id into v_device_id
  from public.weighing_devices
  where device_code = coalesce(nullif(trim(p_device_code), ''), 'GL-SCALE-01')
  limit 1;

  if v_device_id is not null then
    update public.weighing_devices
    set last_com_port = coalesce(nullif(trim(p_com_port), ''), last_com_port),
        last_seen_at = now()
    where id = v_device_id;
  end if;

  insert into public.inward_receipts (
    job_id, arrival_timestamp, vehicle_registration, driver_name, driver_license,
    arrival_security_type, otl_number, otl_condition,
    customs_escort_name, customs_escort_designation, security_passed,
    chk_job_docs_matched, chk_vehicle_photo_recorded, chk_otl_escort_verified,
    chk_cargo_desc_matched, chk_package_count_checked, chk_cargo_condition_checked,
    chk_weight_identified, chk_customs_attendance_checked,
    chk_unloading_readiness_confirmed, checklist_completed_by, checklist_completed_at,
    actual_package_count, actual_gross_weight, weight_variance,
    weight_escalation_triggered, weight_escalation_reason, cargo_condition_notes,
    verified_by
  ) values (
    p_job_id, now(), trim(p_vehicle_registration), trim(p_driver_name),
    nullif(trim(p_driver_license), ''), p_arrival_security_type,
    case when p_arrival_security_type = 'otl' then nullif(trim(p_otl_number), '') end,
    case when p_arrival_security_type = 'otl' then p_otl_condition end,
    case when p_arrival_security_type = 'customs_escort' then nullif(trim(p_customs_escort_name), '') end,
    case when p_arrival_security_type = 'customs_escort' then nullif(trim(p_customs_escort_designation), '') end,
    true,
    true, true, true, true, true, true, true, true, true,
    auth.uid(), now(),
    p_actual_package_count, round(p_actual_weight_kg, 2), round(v_variance, 2),
    v_triggered,
    case when v_triggered then
      format('Actual weight differs from declared reference by %s kg (±%s kg SOP 4.1.8 threshold).', round(v_variance, 2), v_threshold)
    end,
    nullif(trim(p_cargo_condition_notes), ''),
    auth.uid()
  )
  returning id into v_receipt_id;

  insert into public.weighing_measurements (
    job_id, inward_receipt_id, device_id, direction, purpose,
    measured_weight, measured_unit, weight_kg, reference_weight_kg,
    variance_kg, threshold_kg, discrepancy_status,
    raw_packet, com_port, stability_source, is_stable, is_simulated,
    bridge_session_id, notes, captured_by
  ) values (
    p_job_id, v_receipt_id, v_device_id, 'inward', 'initial',
    coalesce(p_measured_weight, p_actual_weight_kg),
    coalesce(nullif(trim(p_measured_unit), ''), 'kg'),
    p_actual_weight_kg,
    v_job.declared_gross_weight,
    v_variance,
    v_threshold,
    case when v_triggered then 'DISCREPANCY' else 'WITHIN_THRESHOLD' end,
    nullif(trim(p_raw_packet), ''),
    nullif(trim(p_com_port), ''),
    coalesce(p_stability_source, 'DEVICE'),
    coalesce(p_is_stable, true),
    false,
    nullif(trim(p_bridge_session_id), ''),
    nullif(trim(p_cargo_condition_notes), ''),
    auth.uid()
  )
  returning id into v_measurement_id;

  if v_triggered then
    insert into public.weighing_exceptions (
      job_id, boe_number, direction, inward_receipt_id, measurement_id,
      reference_weight_kg, actual_weight_kg, difference_kg, threshold_kg, unit,
      status, created_by
    ) values (
      p_job_id, v_job.boe_number, 'inward', v_receipt_id, v_measurement_id,
      v_job.declared_gross_weight, p_actual_weight_kg, v_variance, v_threshold, 'kg',
      'DISCREPANCY', auth.uid()
    );
  end if;

  -- Preserve SOP: only advance to unloaded_and_weighed or weight_escalation_hold;
  -- receipt closure requires GRA/binning/documents.
  update public.jobs
  set status = case
        when v_triggered then 'weight_escalation_hold'::public.inward_status
        else 'unloaded_and_weighed'::public.inward_status
      end,
      updated_at = now()
  where id = p_job_id;

  perform public.write_audit(
    'weighing_measurement', v_measurement_id,
    case when v_triggered then 'WEIGHT_BREACH_ESCALATED' else 'WEIGHMENT_RECORDED' end,
    jsonb_build_object(
      'job_id', p_job_id,
      'receipt_id', v_receipt_id,
      'declared_weight_kg', v_job.declared_gross_weight,
      'actual_weight_kg', p_actual_weight_kg,
      'variance_kg', v_variance,
      'threshold_kg', v_threshold,
      'stability_source', p_stability_source,
      'com_port', p_com_port
    )
  );

  return v_measurement_id;
end;
$$;

revoke all on function public.record_inward_scale_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from public;
revoke all on function public.record_inward_scale_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from anon;
grant execute on function public.record_inward_scale_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) to authenticated;

-- 7.3 Inward Reweighing / Verification / Correction (never overwrites historical measurements)
create or replace function public.record_inward_reweighment(
  p_job_id            uuid,
  p_receipt_id        uuid,
  p_actual_weight_kg  numeric,
  p_purpose           public.measurement_purpose default 'reweigh',
  p_reason            text default null,
  p_device_code       text default 'GL-SCALE-01',
  p_com_port          text default null,
  p_raw_packet        text default null,
  p_measured_weight   numeric default null,
  p_measured_unit     text default 'kg',
  p_stability_source  public.stability_source_type default 'DEVICE',
  p_is_stable         boolean default true,
  p_is_simulated      boolean default false,
  p_bridge_session_id text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job            public.jobs%rowtype;
  v_receipt        public.inward_receipts%rowtype;
  v_prev_id        uuid;
  v_device_id      uuid;
  v_threshold      numeric(8, 3);
  v_variance       numeric(12, 4);
  v_triggered      boolean;
  v_measurement_id uuid;
begin
  if public.current_user_role()::text not in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper') then
    raise exception 'Only authorised warehouse staff can record a reweighment.';
  end if;

  if coalesce(p_is_simulated, false) then
    raise exception 'Simulated scale readings cannot be saved to production warehouse records.';
  end if;

  if p_purpose = 'correction' and coalesce(trim(p_reason), '') = '' then
    raise exception 'A correction reason is mandatory when recording a corrected measurement.';
  end if;

  select * into v_job from public.jobs where id = p_job_id for update;
  select * into v_receipt from public.inward_receipts where id = p_receipt_id and job_id = p_job_id for update;
  if v_job.id is null or v_receipt.id is null then
    raise exception 'Job or inward receipt not found.';
  end if;

  if p_actual_weight_kg is null or p_actual_weight_kg <= 0 then
    raise exception 'Actual weight must be greater than zero.';
  end if;

  select id into v_prev_id
  from public.weighing_measurements
  where job_id = p_job_id and direction = 'inward'
  order by captured_at desc
  limit 1;

  select id into v_device_id
  from public.weighing_devices
  where device_code = coalesce(nullif(trim(p_device_code), ''), 'GL-SCALE-01')
  limit 1;

  select coalesce((select weight_threshold_kg from public.weighing_settings where id = 1), 5.000)
  into v_threshold;

  v_variance := round(p_actual_weight_kg - v_job.declared_gross_weight, 4);
  v_triggered := abs(v_variance) > v_threshold;

  insert into public.weighing_measurements (
    job_id, inward_receipt_id, device_id, direction, purpose,
    measured_weight, measured_unit, weight_kg, reference_weight_kg,
    variance_kg, threshold_kg, discrepancy_status,
    raw_packet, com_port, stability_source, is_stable, is_simulated,
    bridge_session_id, supersedes_measurement_id, correction_reason, notes, captured_by
  ) values (
    p_job_id, p_receipt_id, v_device_id, 'inward', p_purpose,
    coalesce(p_measured_weight, p_actual_weight_kg),
    coalesce(nullif(trim(p_measured_unit), ''), 'kg'),
    p_actual_weight_kg,
    v_job.declared_gross_weight,
    v_variance,
    v_threshold,
    case when v_triggered then 'DISCREPANCY' else 'WITHIN_THRESHOLD' end,
    nullif(trim(p_raw_packet), ''),
    nullif(trim(p_com_port), ''),
    coalesce(p_stability_source, 'DEVICE'),
    coalesce(p_is_stable, true),
    false,
    nullif(trim(p_bridge_session_id), ''),
    v_prev_id,
    nullif(trim(p_reason), ''),
    nullif(trim(p_reason), ''),
    auth.uid()
  )
  returning id into v_measurement_id;

  update public.inward_receipts
  set actual_gross_weight = round(p_actual_weight_kg, 2),
      weight_variance = round(v_variance, 2),
      weight_escalation_triggered = (weight_escalation_triggered or v_triggered),
      updated_at = now()
  where id = p_receipt_id;

  if v_triggered then
    insert into public.weighing_exceptions (
      job_id, boe_number, direction, inward_receipt_id, measurement_id,
      reference_weight_kg, actual_weight_kg, difference_kg, threshold_kg, unit,
      status, created_by
    ) values (
      p_job_id, v_job.boe_number, 'inward', p_receipt_id, v_measurement_id,
      v_job.declared_gross_weight, p_actual_weight_kg, v_variance, v_threshold, 'kg',
      'DISCREPANCY', auth.uid()
    );

    update public.jobs
    set status = 'weight_escalation_hold'::public.inward_status,
        updated_at = now()
    where id = p_job_id;
  end if;

  perform public.write_audit(
    'weighing_measurement', v_measurement_id, 'INWARD_REWEIGH_RECORDED',
    jsonb_build_object(
      'job_id', p_job_id,
      'purpose', p_purpose,
      'actual_weight_kg', p_actual_weight_kg,
      'variance_kg', v_variance,
      'supersedes_measurement_id', v_prev_id,
      'reason', p_reason
    )
  );

  return v_measurement_id;
end;
$$;

revoke all on function public.record_inward_reweighment(uuid, uuid, numeric, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from public;
revoke all on function public.record_inward_reweighment(uuid, uuid, numeric, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from anon;
grant execute on function public.record_inward_reweighment(uuid, uuid, numeric, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) to authenticated;

-- 7.4 Outward Delivery Zone Verification & Weighing (SOP 4.2.5)
-- Never bypasses NDC, Outpass, Customs clearance, or Security gate-out.
create or replace function public.record_outward_weighment(
  p_removal_id            uuid,
  p_picked_package_count  integer,
  p_picked_actual_weight_kg numeric,
  p_condition_notes       text default null,
  p_purpose               public.measurement_purpose default 'initial',
  p_reason                text default null,
  p_device_code           text default 'GL-SCALE-01',
  p_com_port              text default null,
  p_raw_packet            text default null,
  p_measured_weight       numeric default null,
  p_measured_unit         text default 'kg',
  p_stability_source      public.stability_source_type default 'DEVICE',
  p_is_stable             boolean default true,
  p_is_simulated          boolean default false,
  p_bridge_session_id     text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removal        public.removals%rowtype;
  v_job            public.jobs%rowtype;
  v_device_id      uuid;
  v_prev_id        uuid;
  v_threshold      numeric(8, 3);
  v_variance       numeric(12, 4);
  v_triggered      boolean;
  v_measurement_id uuid;
begin
  if public.current_user_role()::text not in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper') then
    raise exception 'Only warehouse operations staff can record outward delivery-zone weighing.';
  end if;

  if coalesce(p_is_simulated, false) then
    raise exception 'Simulated scale readings cannot be saved to production warehouse records.';
  end if;

  select * into v_removal from public.removals where id = p_removal_id for update;
  if v_removal.id is null then
    raise exception 'Removal transaction not found.';
  end if;

  if v_removal.status in ('gate_exited', 'removal_closed') then
    raise exception 'Cannot weigh cargo after gate-out or closure.';
  end if;

  select * into v_job from public.jobs where id = v_removal.job_id;
  if v_job.id is null then
    raise exception 'Linked job not found.';
  end if;

  if p_picked_actual_weight_kg is null or p_picked_actual_weight_kg <= 0
     or p_picked_package_count is null or p_picked_package_count <= 0 then
    raise exception 'Picked package count and actual weight must be greater than zero.';
  end if;

  select id into v_prev_id
  from public.weighing_measurements
  where removal_id = p_removal_id and direction = 'outward'
  order by captured_at desc
  limit 1;

  select id into v_device_id
  from public.weighing_devices
  where device_code = coalesce(nullif(trim(p_device_code), ''), 'GL-SCALE-01')
  limit 1;

  select coalesce((select weight_threshold_kg from public.weighing_settings where id = 1), 5.000)
  into v_threshold;

  v_variance := round(p_picked_actual_weight_kg - v_removal.requested_weight_kg, 4);
  v_triggered := abs(v_variance) > v_threshold;

  insert into public.weighing_measurements (
    job_id, removal_id, device_id, direction, purpose,
    measured_weight, measured_unit, weight_kg, reference_weight_kg,
    variance_kg, threshold_kg, discrepancy_status,
    raw_packet, com_port, stability_source, is_stable, is_simulated,
    bridge_session_id, supersedes_measurement_id, correction_reason, notes, captured_by
  ) values (
    v_removal.job_id, p_removal_id, v_device_id, 'outward', p_purpose,
    coalesce(p_measured_weight, p_picked_actual_weight_kg),
    coalesce(nullif(trim(p_measured_unit), ''), 'kg'),
    p_picked_actual_weight_kg,
    v_removal.requested_weight_kg,
    v_variance,
    v_threshold,
    case when v_triggered then 'DISCREPANCY' else 'WITHIN_THRESHOLD' end,
    nullif(trim(p_raw_packet), ''),
    nullif(trim(p_com_port), ''),
    coalesce(p_stability_source, 'DEVICE'),
    coalesce(p_is_stable, true),
    false,
    nullif(trim(p_bridge_session_id), ''),
    v_prev_id,
    nullif(trim(p_reason), ''),
    nullif(trim(p_condition_notes), ''),
    auth.uid()
  )
  returning id into v_measurement_id;

  if v_triggered then
    insert into public.weighing_exceptions (
      job_id, boe_number, direction, removal_id, measurement_id,
      reference_weight_kg, actual_weight_kg, difference_kg, threshold_kg, unit,
      status, created_by
    ) values (
      v_removal.job_id, v_job.boe_number, 'outward', p_removal_id, v_measurement_id,
      v_removal.requested_weight_kg, p_picked_actual_weight_kg, v_variance, v_threshold, 'kg',
      'DISCREPANCY', auth.uid()
    );
  end if;

  update public.removals
  set picked_package_count = p_picked_package_count,
      picked_actual_weight_kg = round(p_picked_actual_weight_kg, 2),
      delivery_zone_weight_variance_kg = round(v_variance, 3),
      picked_condition_notes = nullif(trim(p_condition_notes), ''),
      delivery_zone_verified_by = auth.uid(),
      delivery_zone_verified_at = now(),
      status = case
        when status in ('request_submitted', 'customs_notified', 'cargo_picked')
          then 'delivery_zone_verified'::public.removal_status
        else status
      end,
      updated_at = now()
  where id = p_removal_id;

  perform public.write_audit(
    'removal', p_removal_id, 'OUTWARD_WEIGHMENT_RECORDED',
    jsonb_build_object(
      'job_id', v_removal.job_id,
      'measurement_id', v_measurement_id,
      'requested_weight_kg', v_removal.requested_weight_kg,
      'picked_actual_weight_kg', p_picked_actual_weight_kg,
      'variance_kg', v_variance,
      'picked_package_count', p_picked_package_count,
      'stability_source', p_stability_source
    )
  );

  return v_measurement_id;
end;
$$;

revoke all on function public.record_outward_weighment(uuid, integer, numeric, text, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from public;
revoke all on function public.record_outward_weighment(uuid, integer, numeric, text, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) from anon;
grant execute on function public.record_outward_weighment(uuid, integer, numeric, text, public.measurement_purpose, text, text, text, text, numeric, text, public.stability_source_type, boolean, boolean, text) to authenticated;

-- 7.5 Update gate_out to deduct verified picked weight/packages when available
create or replace function public.gate_out(
  p_removal_id                  uuid,
  p_vehicle_number              text,
  p_driver_name                 text,
  p_otl_seal_number             text,
  p_customs_auth_reference      text,
  p_gorod_representative_signature text,
  p_driver_signature            text,
  p_customs_inspector_signature text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removal          public.removals%rowtype;
  v_job              public.jobs%rowtype;
  v_customer         public.customers%rowtype;
  v_release_packages integer;
  v_release_weight   numeric(10, 2);
begin
  if public.current_user_role()::text not in ('security_team', 'warehouse_keeper') then
    raise exception 'Only the Security Team can record a gate-out.';
  end if;

  select * into v_removal from public.removals where id = p_removal_id for update;
  if v_removal.id is null then
    raise exception 'Removal not found.';
  end if;
  if v_removal.outpass_number is null or v_removal.status <> 'outpass_issued' then
    raise exception 'A valid outpass is required before gate-out.';
  end if;
  if v_removal.status in ('gate_exited', 'removal_closed') then
    raise exception 'This removal has already exited the gate.';
  end if;

  if coalesce(trim(p_vehicle_number), '') = ''
     or coalesce(trim(p_driver_name), '') = ''
     or coalesce(trim(p_customs_auth_reference), '') = ''
     or coalesce(trim(p_gorod_representative_signature), '') = ''
     or coalesce(trim(p_driver_signature), '') = '' then
    raise exception 'Vehicle, driver, Customs authorisation and signatures are required.';
  end if;

  if v_removal.type in ('re_export', 'warehouse_transfer')
     and coalesce(trim(p_otl_seal_number), '') = '' then
    raise exception 'An outward OTL seal number is required for this removal type.';
  end if;

  select * into v_job from public.jobs where id = v_removal.job_id;
  select * into v_customer from public.customers where id = v_removal.customer_id;

  v_release_packages := coalesce(v_removal.picked_package_count, v_removal.requested_package_count);
  v_release_weight := coalesce(v_removal.picked_actual_weight_kg, v_removal.requested_weight_kg);

  insert into public.gate_outward_register (
    job_id, removal_id, into_bond_boe_reference, customer_name, removal_type,
    cargo_description, package_count_released, outpass_number, vehicle_number,
    driver_name, otl_seal_number, customs_auth_reference,
    gorod_representative_signature, driver_signature, customs_inspector_signature,
    verified_by
  ) values (
    v_removal.job_id, v_removal.id, v_job.boe_number, v_customer.company_name,
    v_removal.type::text, v_job.cargo_description, v_release_packages,
    v_removal.outpass_number, trim(p_vehicle_number), trim(p_driver_name),
    nullif(trim(p_otl_seal_number), ''), trim(p_customs_auth_reference),
    trim(p_gorod_representative_signature), trim(p_driver_signature),
    nullif(trim(p_customs_inspector_signature), ''), auth.uid()
  );

  update public.removals
  set status = 'gate_exited', updated_at = now()
  where id = p_removal_id;

  update public.inventory_items
  set available_package_count = greatest(available_package_count - v_release_packages, 0),
      available_weight_kg = greatest(available_weight_kg - v_release_weight, 0),
      storage_location_status = case
        when available_package_count - v_release_packages <= 0 then 'dispatched'
        else storage_location_status
      end,
      updated_at = now()
  where job_id = v_removal.job_id;

  perform public.write_audit(
    'removal', p_removal_id, 'GATE_OUT_RECORDED',
    jsonb_build_object(
      'job_id', v_removal.job_id,
      'outpass_number', v_removal.outpass_number,
      'vehicle_number', trim(p_vehicle_number),
      'packages_released', v_release_packages,
      'weight_released_kg', v_release_weight
    )
  );
end;
$$;

-- 7.6 Discrepancy Exception Workflow Transition RPC (Phase 9)
create or replace function public.update_weighing_exception_status(
  p_exception_id      uuid,
  p_status            public.weighing_exception_status,
  p_customs_to        text default null,
  p_customs_ref       text default null,
  p_resolution_ref    text default null,
  p_resolution_notes  text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exc  public.weighing_exceptions%rowtype;
  v_role text;
begin
  v_role := public.current_user_role()::text;
  select * into v_exc from public.weighing_exceptions where id = p_exception_id for update;
  if v_exc.id is null then
    raise exception 'Weighing exception not found.';
  end if;

  if p_status in ('UNDER_REVIEW', 'CUSTOMS_NOTIFIED', 'AWAITING_INSTRUCTIONS') then
    if v_role not in ('admin_compliance', 'warehouse_keeper', 'warehouse_manager') then
      raise exception 'Your role is not authorised to update exception review status.';
    end if;
  elsif p_status in ('RESOLVED', 'CLOSED') then
    if v_role not in ('warehouse_keeper', 'customs_bond_officer') then
      raise exception 'Only the Warehouse Keeper or Customs Bond Officer can resolve or close an exception.';
    end if;
    if coalesce(trim(p_resolution_ref), '') = '' then
      raise exception 'Resolution reference is required.';
    end if;
  end if;

  update public.weighing_exceptions
  set status = p_status,
      customs_notified_to = coalesce(nullif(trim(p_customs_to), ''), customs_notified_to),
      customs_email_ref = coalesce(nullif(trim(p_customs_ref), ''), customs_email_ref),
      customs_notified_at = case
        when p_status = 'CUSTOMS_NOTIFIED' then coalesce(customs_notified_at, now())
        else customs_notified_at
      end,
      resolution_ref = coalesce(nullif(trim(p_resolution_ref), ''), resolution_ref),
      resolution_notes = coalesce(nullif(trim(p_resolution_notes), ''), resolution_notes),
      reviewed_by = case when p_status = 'UNDER_REVIEW' then auth.uid() else reviewed_by end,
      resolved_by = case when p_status in ('RESOLVED', 'CLOSED') then auth.uid() else resolved_by end,
      updated_at = now()
  where id = p_exception_id;

  perform public.write_audit(
    'weighing_exception', p_exception_id, 'EXCEPTION_STATUS_UPDATED',
    jsonb_build_object(
      'job_id', v_exc.job_id,
      'previous_status', v_exc.status,
      'new_status', p_status,
      'customs_ref', p_customs_ref,
      'resolution_ref', p_resolution_ref
    )
  );
end;
$$;

revoke all on function public.update_weighing_exception_status(uuid, public.weighing_exception_status, text, text, text, text) from public;
revoke all on function public.update_weighing_exception_status(uuid, public.weighing_exception_status, text, text, text, text) from anon;
grant execute on function public.update_weighing_exception_status(uuid, public.weighing_exception_status, text, text, text, text) to authenticated;

-- 7.7 Sync log_customs_notification & resolve_weight_escalation with weighing_exceptions
create or replace function public.log_customs_notification(
  p_receipt_id  uuid,
  p_reference   text,
  p_notified_to text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_receipt public.inward_receipts%rowtype;
begin
  if public.current_user_role()::text not in ('admin_compliance', 'warehouse_keeper') then
    raise exception 'Only the Admin Compliance or Warehouse Keeper can log a Customs notification.';
  end if;

  select * into v_receipt from public.inward_receipts where id = p_receipt_id for update;
  if v_receipt.id is null then
    raise exception 'Inward receipt not found.';
  end if;
  if not v_receipt.weight_escalation_triggered then
    raise exception 'This receipt is not on a weight escalation hold.';
  end if;
  if v_receipt.weight_escalation_resolved then
    raise exception 'This weight hold is already resolved.';
  end if;

  if coalesce(trim(p_reference), '') = ''
     or coalesce(trim(p_notified_to), '') = '' then
    raise exception 'Notification reference and recipient are required.';
  end if;

  update public.inward_receipts
  set weight_escalation_customs_email_sent = now(),
      weight_escalation_customs_ref = trim(p_reference),
      weight_escalation_customs_notified_to = trim(p_notified_to),
      updated_at = now()
  where id = p_receipt_id;

  update public.weighing_exceptions
  set status = 'CUSTOMS_NOTIFIED',
      customs_email_ref = trim(p_reference),
      customs_notified_to = trim(p_notified_to),
      customs_notified_at = now(),
      updated_at = now()
  where inward_receipt_id = p_receipt_id
    and status in ('DISCREPANCY', 'UNDER_REVIEW');

  perform public.write_audit(
    'inward_receipt', p_receipt_id, 'CUSTOMS_ESCALATION_NOTIFIED',
    jsonb_build_object(
      'job_id', v_receipt.job_id,
      'reference', trim(p_reference),
      'notified_to', trim(p_notified_to)
    )
  );
end;
$$;

create or replace function public.resolve_weight_escalation(
  p_receipt_id           uuid,
  p_resolution_reference text,
  p_notes                text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_receipt public.inward_receipts%rowtype;
begin
  if public.current_user_role()::text not in ('customs_bond_officer', 'warehouse_keeper') then
    raise exception 'Only the Customs Bond Officer or Warehouse Keeper can resolve a weight hold.';
  end if;

  select * into v_receipt from public.inward_receipts where id = p_receipt_id for update;
  if v_receipt.id is null then
    raise exception 'Inward receipt not found.';
  end if;
  if not v_receipt.weight_escalation_triggered then
    raise exception 'This receipt is not on a weight escalation hold.';
  end if;
  if v_receipt.weight_escalation_resolved then
    raise exception 'This weight hold is already resolved.';
  end if;

  if coalesce(trim(p_resolution_reference), '') = '' then
    raise exception 'The Customs resolution reference is required.';
  end if;

  update public.inward_receipts
  set weight_escalation_resolved = true,
      weight_escalation_resolution_ref = trim(p_resolution_reference),
      weight_escalation_resolution_notes = nullif(trim(p_notes), ''),
      updated_at = now()
  where id = p_receipt_id;

  update public.weighing_exceptions
  set status = 'RESOLVED',
      resolution_ref = trim(p_resolution_reference),
      resolution_notes = nullif(trim(p_notes), ''),
      resolved_by = auth.uid(),
      updated_at = now()
  where inward_receipt_id = p_receipt_id
    and status not in ('RESOLVED', 'CLOSED');

  update public.jobs
  set status = 'binned_and_barcoded', updated_at = now()
  where id = v_receipt.job_id
    and status = 'weight_escalation_hold';

  perform public.write_audit(
    'inward_receipt', p_receipt_id, 'WEIGHT_ESCALATION_RESOLVED',
    jsonb_build_object(
      'job_id', v_receipt.job_id,
      'resolution_reference', trim(p_resolution_reference),
      'notes', nullif(trim(p_notes), '')
    )
  );
end;
$$;
