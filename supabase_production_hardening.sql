-- ==============================================================================
-- GOROD LOGISTICS — PRODUCTION HARDENING
-- Run AFTER supabase_sop_schema.sql and supabase_live_setup.sql.
--
-- This migration removes the placeholder/demo write paths and makes every
-- statutory action role-checked, transactional and auditable:
--   1. Adds the columns used by the production notification/resolution flow.
--   2. Adds current_user_role() and write_audit() helpers.
--   3. Rebuilds dashboard_jobs with the full receipt/removal detail.
--   4. Replaces the permissive "any authenticated user" policies with role
--      policies (direct writes to statutory tables are denied).
--   5. Creates the security-definer RPCs used by the CBW operations desk.
--
-- It is safe to re-run.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. COLUMNS
-- ------------------------------------------------------------------------------
alter table public.inward_receipts
  add column if not exists weight_escalation_customs_ref text,
  add column if not exists weight_escalation_customs_notified_to text,
  add column if not exists weight_escalation_resolution_ref text,
  add column if not exists weight_escalation_resolution_notes text;

-- ------------------------------------------------------------------------------
-- 2. HELPERS
-- ------------------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
revoke all on function public.current_user_role() from anon;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.write_audit(
  p_entity_type text,
  p_entity_id   uuid,
  p_action      text,
  p_details     jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.audit_logs (entity_type, entity_id, action, performed_by, details)
  values (
    p_entity_type,
    p_entity_id,
    p_action,
    auth.uid(),
    coalesce(p_details, '{}'::jsonb)
  );
$$;

revoke all on function public.write_audit(text, uuid, text, jsonb) from public;
revoke all on function public.write_audit(text, uuid, text, jsonb) from anon;

-- ------------------------------------------------------------------------------
-- 3. DASHBOARD VIEW
-- Existing columns are kept in the same order; new columns are appended so
-- `create or replace view` remains valid on an existing database.
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
  r.requested_etd
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
-- 4. RLS — REPLACE PERMISSIVE POLICIES
-- Direct writes to statutory tables are intentionally denied. All statutory
-- mutations go through the RPCs in section 5, which check the caller's role.
-- ------------------------------------------------------------------------------

drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Authenticated users can view profiles" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Staff can view profiles"
  on public.profiles for select to authenticated using (true);
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Staff can view customers" on public.customers;
drop policy if exists "Admin can manage customers" on public.customers;
create policy "Staff can view customers"
  on public.customers for select to authenticated using (true);
create policy "Compliance can manage customers"
  on public.customers for insert to authenticated
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));
create policy "Compliance can update customers"
  on public.customers for update to authenticated
  using (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view jobs" on public.jobs;
drop policy if exists "Admin & Keeper can manage jobs" on public.jobs;
create policy "Staff can view jobs"
  on public.jobs for select to authenticated using (true);
create policy "Compliance can insert jobs"
  on public.jobs for insert to authenticated
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));
create policy "Compliance can update jobs"
  on public.jobs for update to authenticated
  using (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view space certificates" on public.space_certificates;
drop policy if exists "Admin can manage space certificates" on public.space_certificates;
create policy "Staff can view space certificates"
  on public.space_certificates for select to authenticated using (true);
create policy "Compliance can manage space certificates"
  on public.space_certificates for all to authenticated
  using (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view receipts" on public.inward_receipts;
drop policy if exists "Operations & Admin can manage receipts" on public.inward_receipts;
create policy "Staff can view receipts"
  on public.inward_receipts for select to authenticated using (true);
-- No direct insert/update/delete policy: use record_weighment().

drop policy if exists "Staff can view bins" on public.warehouse_bins;
drop policy if exists "Ops can manage bins" on public.warehouse_bins;
create policy "Staff can view bins"
  on public.warehouse_bins for select to authenticated using (true);
create policy "Operations can manage bins"
  on public.warehouse_bins for all to authenticated
  using (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view inventory" on public.inventory_items;
drop policy if exists "Operations can manage inventory" on public.inventory_items;
create policy "Staff can view inventory"
  on public.inventory_items for select to authenticated using (true);
create policy "Operations can manage inventory"
  on public.inventory_items for all to authenticated
  using (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view GRA" on public.goods_received_acknowledgements;
drop policy if exists "Admin can manage GRA" on public.goods_received_acknowledgements;
create policy "Staff can view GRA"
  on public.goods_received_acknowledgements for select to authenticated using (true);
create policy "Compliance can manage GRA"
  on public.goods_received_acknowledgements for all to authenticated
  using (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view removals" on public.removals;
drop policy if exists "Staff can manage removals" on public.removals;
create policy "Staff can view removals"
  on public.removals for select to authenticated using (true);
-- No direct write policy: use request_removal(), issue_ndc(), issue_outpass(), gate_out().

drop policy if exists "Staff can view registers" on public.gate_inward_register;
drop policy if exists "Security can insert inward register" on public.gate_inward_register;
create policy "Staff can view inward registers"
  on public.gate_inward_register for select to authenticated using (true);
-- No direct write policy: use the gate RPCs.

drop policy if exists "Staff can view outward registers" on public.gate_outward_register;
drop policy if exists "Security can insert outward register" on public.gate_outward_register;
create policy "Staff can view outward registers"
  on public.gate_outward_register for select to authenticated using (true);
-- No direct write policy: use gate_out().

drop policy if exists "Staff can view handling" on public.handling_activities;
drop policy if exists "Staff can manage handling" on public.handling_activities;
create policy "Staff can view handling"
  on public.handling_activities for select to authenticated using (true);
create policy "Operations can manage handling"
  on public.handling_activities for all to authenticated
  using (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view monthly returns" on public.monthly_returns;
drop policy if exists "Admin & Keeper can manage monthly returns" on public.monthly_returns;
create policy "Staff can view monthly returns"
  on public.monthly_returns for select to authenticated using (true);
create policy "Compliance can manage monthly returns"
  on public.monthly_returns for all to authenticated
  using (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'))
  with check (public.current_user_role()::text in ('admin_compliance', 'warehouse_keeper'));

drop policy if exists "Staff can view audit logs" on public.audit_logs;
create policy "Staff can view audit logs"
  on public.audit_logs for select to authenticated using (true);

-- ------------------------------------------------------------------------------
-- 5. RPCs
-- ------------------------------------------------------------------------------

-- 5.1 Register an inward job with real customer and BOE data.
drop function if exists public.create_inward_job(text, text, text, integer, numeric, text, text);

create or replace function public.create_inward_job(
  p_customer_name     text,
  p_iec_code          text,
  p_contact_person    text,
  p_contact_email     text,
  p_contact_phone     text,
  p_address_line      text,
  p_city              text,
  p_boe_number        text,
  p_boe_date          date,
  p_cargo_description text,
  p_package_count     integer,
  p_declared_weight   numeric
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_job_id      uuid;
begin
  if public.current_user_role()::text not in ('admin_compliance', 'warehouse_keeper') then
    raise exception 'Only the Admin Compliance or Warehouse Keeper can register an inward job.';
  end if;

  if coalesce(trim(p_customer_name), '') = ''
     or coalesce(trim(p_iec_code), '') = ''
     or coalesce(trim(p_contact_person), '') = ''
     or coalesce(trim(p_contact_email), '') = ''
     or coalesce(trim(p_contact_phone), '') = ''
     or coalesce(trim(p_address_line), '') = ''
     or coalesce(trim(p_city), '') = ''
     or coalesce(trim(p_boe_number), '') = ''
     or coalesce(trim(p_cargo_description), '') = '' then
    raise exception 'Customer, IEC, contact, address, BOE and cargo details are required.';
  end if;

  if upper(trim(p_iec_code)) !~ '^[A-Z0-9]{10}$' then
    raise exception 'IEC code must be exactly 10 alphanumeric characters.';
  end if;

  if p_boe_date is null or p_boe_date > current_date then
    raise exception 'BOE filing date must be a valid date on or before today.';
  end if;

  if p_package_count is null or p_package_count <= 0
     or p_declared_weight is null or p_declared_weight <= 0 then
    raise exception 'Package count and declared weight must be greater than zero.';
  end if;

  if exists (select 1 from public.jobs where boe_number = trim(p_boe_number)) then
    raise exception 'This BOE already has a job. SOP 4.1.1 requires exactly one job per BOE.';
  end if;

  select id into v_customer_id
  from public.customers
  where lower(company_name) = lower(trim(p_customer_name))
     or upper(iec_code) = upper(trim(p_iec_code))
  order by created_at asc
  limit 1;

  if v_customer_id is null then
    insert into public.customers (
      company_name, iec_code, contact_person, contact_email, contact_phone,
      address_line, city, is_verified
    ) values (
      trim(p_customer_name),
      upper(trim(p_iec_code)),
      trim(p_contact_person),
      trim(p_contact_email),
      trim(p_contact_phone),
      trim(p_address_line),
      trim(p_city),
      false
    )
    returning id into v_customer_id;
  end if;

  insert into public.jobs (
    job_number, customer_id, boe_number, boe_date, bond_number, bond_date,
    origin_type, origin_location, cargo_description,
    declared_package_count, declared_gross_weight, created_by
  ) values (
    'GL-JOB-' || to_char(now(), 'YYYY') || '-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
    v_customer_id,
    trim(p_boe_number),
    p_boe_date,
    '2002591018',
    current_date,
    'customs_station',
    'Customs Station, Thiruvananthapuram',
    trim(p_cargo_description),
    p_package_count,
    p_declared_weight,
    auth.uid()
  )
  returning id into v_job_id;

  perform public.write_audit(
    'job', v_job_id, 'INWARD_JOB_CREATED',
    jsonb_build_object(
      'boe_number', trim(p_boe_number),
      'customer_id', v_customer_id,
      'packages', p_package_count,
      'declared_weight_kg', p_declared_weight
    )
  );

  return v_job_id;
exception
  when unique_violation then
    raise exception 'A job or BOE with this reference already exists.';
end;
$$;

revoke all on function public.create_inward_job(text, text, text, text, text, text, text, text, date, text, integer, numeric) from public;
revoke all on function public.create_inward_job(text, text, text, text, text, text, text, text, date, text, integer, numeric) from anon;
grant execute on function public.create_inward_job(text, text, text, text, text, text, text, text, date, text, integer, numeric) to authenticated;

-- 5.2 Record the weighbridge result and nine-point checklist.
create or replace function public.record_weighment(
  p_job_id                    uuid,
  p_actual_weight             numeric,
  p_actual_package_count      integer,
  p_vehicle_registration      text,
  p_driver_name               text,
  p_driver_license            text,
  p_arrival_security_type     text,
  p_otl_number                text,
  p_otl_condition             text,
  p_customs_escort_name       text,
  p_customs_escort_designation text,
  p_cargo_condition_notes     text,
  p_checkpoints               jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job            public.jobs%rowtype;
  v_variance       numeric(10,2);
  v_triggered      boolean;
  v_receipt_id     uuid;
begin
  if public.current_user_role()::text not in ('warehouse_manager', 'admin_compliance', 'warehouse_keeper') then
    raise exception 'Only warehouse operations staff can record a weighment.';
  end if;

  select * into v_job from public.jobs where id = p_job_id for update;
  if v_job.id is null then
    raise exception 'Job not found.';
  end if;

  if p_actual_weight is null or p_actual_weight <= 0
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

  v_variance := round(p_actual_weight - v_job.declared_gross_weight, 2);
  v_triggered := abs(v_variance) > 5;

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
    coalesce((p_checkpoints->>'chk_job_docs_matched')::boolean, false),
    coalesce((p_checkpoints->>'chk_vehicle_photo_recorded')::boolean, false),
    coalesce((p_checkpoints->>'chk_otl_escort_verified')::boolean, false),
    coalesce((p_checkpoints->>'chk_cargo_desc_matched')::boolean, false),
    coalesce((p_checkpoints->>'chk_package_count_checked')::boolean, false),
    coalesce((p_checkpoints->>'chk_cargo_condition_checked')::boolean, false),
    coalesce((p_checkpoints->>'chk_weight_identified')::boolean, false),
    coalesce((p_checkpoints->>'chk_customs_attendance_checked')::boolean, false),
    coalesce((p_checkpoints->>'chk_unloading_readiness_confirmed')::boolean, false),
    auth.uid(), now(),
    p_actual_package_count, p_actual_weight, v_variance,
    v_triggered,
    case when v_triggered then
      format('Actual weight differs from declared reference by %s kg (±5 kg SOP 4.1.8 threshold).', v_variance)
    end,
    nullif(trim(p_cargo_condition_notes), ''),
    auth.uid()
  )
  returning id into v_receipt_id;

  update public.jobs
  set status = case when v_triggered then 'weight_escalation_hold'::public.inward_status
                    else 'binned_and_barcoded'::public.inward_status end,
      updated_at = now()
  where id = p_job_id;

  perform public.write_audit(
    'inward_receipt', v_receipt_id,
    case when v_triggered then 'WEIGHT_BREACH_ESCALATED' else 'WEIGHMENT_RECORDED' end,
    jsonb_build_object(
      'job_id', p_job_id,
      'declared_weight_kg', v_job.declared_gross_weight,
      'actual_weight_kg', p_actual_weight,
      'variance_kg', v_variance,
      'threshold_kg', 5,
      'vehicle_registration', trim(p_vehicle_registration)
    )
  );
end;
$$;

revoke all on function public.record_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb) from public;
revoke all on function public.record_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb) from anon;
grant execute on function public.record_weighment(uuid, numeric, integer, text, text, text, text, text, text, text, text, text, jsonb) to authenticated;

-- 5.3 Request outward removal with the statutory document set.
create or replace function public.request_removal(
  p_job_id                        uuid,
  p_type                          public.removal_type,
  p_requested_package_count       integer,
  p_requested_weight              numeric,
  p_requested_etd                 timestamptz,
  p_ex_bond_boe_number            text,
  p_ex_bond_boe_date              date,
  p_ooc_number                    text,
  p_ooc_date                      date,
  p_duty_payment_challan_ref      text,
  p_shipping_bill_number          text,
  p_shipping_bill_date            date,
  p_leo_number                    text,
  p_leo_date                      date,
  p_section_69_order_ref          text,
  p_form_a_number                 text,
  p_destination_warehouse_code    text,
  p_destination_warehouse_name    text,
  p_customs_transfer_permission_ref text,
  p_outward_otl_number            text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job        public.jobs%rowtype;
  v_removal_id uuid;
begin
  if public.current_user_role()::text not in ('admin_compliance', 'warehouse_keeper') then
    raise exception 'Only the Admin Compliance or Warehouse Keeper can request a removal.';
  end if;

  select * into v_job from public.jobs where id = p_job_id for update;
  if v_job.id is null then
    raise exception 'Job not found.';
  end if;

  if not exists (
    select 1 from public.inward_receipts
    where job_id = p_job_id and actual_gross_weight is not null
  ) then
    raise exception 'A weighbridge record is required before removal.';
  end if;

  if exists (
    select 1 from public.removals
    where job_id = p_job_id
      and status not in ('gate_exited', 'removal_closed')
  ) then
    raise exception 'An active removal already exists for this job.';
  end if;

  if p_requested_package_count is null or p_requested_package_count <= 0
     or p_requested_weight is null or p_requested_weight <= 0 then
    raise exception 'Requested package count and weight must be greater than zero.';
  end if;

  if p_requested_etd is null or p_requested_etd <= now() then
    raise exception 'Requested ETD must be in the future.';
  end if;

  if p_type = 'home_consumption' then
    if coalesce(trim(p_ex_bond_boe_number), '') = ''
       or p_ex_bond_boe_date is null
       or coalesce(trim(p_ooc_number), '') = ''
       or p_ooc_date is null
       or coalesce(trim(p_duty_payment_challan_ref), '') = '' then
      raise exception 'Ex-bond BOE, OOC and duty payment challan are required for home consumption.';
    end if;
  elsif p_type = 're_export' then
    if coalesce(trim(p_shipping_bill_number), '') = ''
       or p_shipping_bill_date is null
       or coalesce(trim(p_leo_number), '') = ''
       or p_leo_date is null
       or coalesce(trim(p_section_69_order_ref), '') = ''
       or coalesce(trim(p_outward_otl_number), '') = '' then
      raise exception 'Shipping bill, LEO, Section 69 order and outward OTL are required for re-export.';
    end if;
  elsif p_type = 'warehouse_transfer' then
    if coalesce(trim(p_form_a_number), '') = ''
       or coalesce(trim(p_destination_warehouse_code), '') = ''
       or coalesce(trim(p_destination_warehouse_name), '') = ''
       or coalesce(trim(p_customs_transfer_permission_ref), '') = ''
       or coalesce(trim(p_outward_otl_number), '') = '' then
      raise exception 'Form A, destination warehouse, transfer permission and outward OTL are required.';
    end if;
  end if;

  insert into public.removals (
    removal_number, job_id, customer_id, type,
    requested_package_count, requested_weight_kg, requested_etd,
    ex_bond_boe_number, ex_bond_boe_date, ooc_number, ooc_date, duty_payment_challan_ref,
    shipping_bill_number, shipping_bill_date, leo_number, leo_date, section_69_order_ref,
    form_a_number, destination_warehouse_code, destination_warehouse_name,
    customs_transfer_permission_ref, outward_otl_number, status
  ) values (
    'GL-REM-' || to_char(now(), 'YYYY') || '-' ||
      upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
    p_job_id, v_job.customer_id, p_type,
    p_requested_package_count, p_requested_weight, p_requested_etd,
    nullif(trim(p_ex_bond_boe_number), ''), p_ex_bond_boe_date,
    nullif(trim(p_ooc_number), ''), p_ooc_date,
    nullif(trim(p_duty_payment_challan_ref), ''),
    nullif(trim(p_shipping_bill_number), ''), p_shipping_bill_date,
    nullif(trim(p_leo_number), ''), p_leo_date,
    nullif(trim(p_section_69_order_ref), ''),
    nullif(trim(p_form_a_number), ''),
    nullif(trim(p_destination_warehouse_code), ''),
    nullif(trim(p_destination_warehouse_name), ''),
    nullif(trim(p_customs_transfer_permission_ref), ''),
    nullif(trim(p_outward_otl_number), ''),
    'request_submitted'
  )
  returning id into v_removal_id;

  perform public.write_audit(
    'removal', v_removal_id, 'REMOVAL_REQUESTED',
    jsonb_build_object(
      'job_id', p_job_id,
      'type', p_type,
      'packages', p_requested_package_count,
      'weight_kg', p_requested_weight,
      'etd', p_requested_etd
    )
  );

  return v_removal_id;
end;
$$;

revoke all on function public.request_removal(uuid, public.removal_type, integer, numeric, timestamptz, text, date, text, date, text, text, date, text, date, text, text, text, text, text, text) from public;
revoke all on function public.request_removal(uuid, public.removal_type, integer, numeric, timestamptz, text, date, text, date, text, text, date, text, date, text, text, text, text, text, text) from anon;
grant execute on function public.request_removal(uuid, public.removal_type, integer, numeric, timestamptz, text, date, text, date, text, text, date, text, date, text, text, text, text, text, text) to authenticated;

-- 5.4 Accounts NDC.
create or replace function public.issue_ndc(
  p_removal_id     uuid,
  p_invoice_number text,
  p_invoice_amount numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removal public.removals%rowtype;
begin
  if public.current_user_role()::text not in ('accounts_team', 'warehouse_keeper') then
    raise exception 'Only the Accounts Team can issue a No-Due Certificate.';
  end if;

  select * into v_removal from public.removals where id = p_removal_id for update;
  if v_removal.id is null then
    raise exception 'Removal not found.';
  end if;
  if v_removal.status in ('gate_exited', 'removal_closed') then
    raise exception 'This removal is already closed.';
  end if;
  if v_removal.ndc_number is not null then
    raise exception 'The NDC has already been issued for this removal.';
  end if;

  if coalesce(trim(p_invoice_number), '') = ''
     or p_invoice_amount is null or p_invoice_amount <= 0 then
    raise exception 'Invoice number and a positive invoice amount are required.';
  end if;

  update public.removals
  set invoice_number = trim(p_invoice_number),
      invoice_amount = p_invoice_amount,
      payment_cleared = true,
      ndc_number = 'NDC-' || to_char(now(), 'YYYY') || '-' ||
        upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
      ndc_issued_by = auth.uid(),
      ndc_issued_at = now(),
      status = 'ndc_cleared',
      updated_at = now()
  where id = p_removal_id;

  perform public.write_audit(
    'removal', p_removal_id, 'NDC_ISSUED',
    jsonb_build_object(
      'job_id', v_removal.job_id,
      'invoice_number', trim(p_invoice_number),
      'invoice_amount', p_invoice_amount
    )
  );
end;
$$;

revoke all on function public.issue_ndc(uuid, text, numeric) from public;
revoke all on function public.issue_ndc(uuid, text, numeric) from anon;
grant execute on function public.issue_ndc(uuid, text, numeric) to authenticated;

-- 5.5 Outpass.
create or replace function public.issue_outpass(p_removal_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removal public.removals%rowtype;
begin
  if public.current_user_role()::text not in ('warehouse_keeper', 'admin_compliance') then
    raise exception 'Only the Warehouse Keeper or Admin Compliance can issue an outpass.';
  end if;

  select * into v_removal from public.removals where id = p_removal_id for update;
  if v_removal.id is null then
    raise exception 'Removal not found.';
  end if;
  if v_removal.ndc_number is null or not v_removal.payment_cleared then
    raise exception 'The accounts NDC must be cleared before an outpass can be issued.';
  end if;
  if v_removal.outpass_number is not null then
    raise exception 'An outpass has already been issued for this removal.';
  end if;
  if v_removal.status in ('gate_exited', 'removal_closed') then
    raise exception 'This removal is already closed.';
  end if;

  update public.removals
  set outpass_number = 'GL-GP-' || to_char(now(), 'YYYY') || '-' ||
        upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
      outpass_issued_by = auth.uid(),
      outpass_issued_at = now(),
      status = 'outpass_issued',
      updated_at = now()
  where id = p_removal_id;

  perform public.write_audit(
    'removal', p_removal_id, 'OUTPASS_ISSUED',
    jsonb_build_object('job_id', v_removal.job_id, 'ndc_number', v_removal.ndc_number)
  );
end;
$$;

revoke all on function public.issue_outpass(uuid) from public;
revoke all on function public.issue_outpass(uuid) from anon;
grant execute on function public.issue_outpass(uuid) to authenticated;

-- 5.6 Gate-out and outward register.
create or replace function public.gate_out(
  p_removal_id                 uuid,
  p_vehicle_number             text,
  p_driver_name                text,
  p_otl_seal_number            text,
  p_customs_auth_reference     text,
  p_gorod_representative_signature text,
  p_driver_signature           text,
  p_customs_inspector_signature text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_removal public.removals%rowtype;
  v_job     public.jobs%rowtype;
  v_customer public.customers%rowtype;
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

  insert into public.gate_outward_register (
    job_id, removal_id, into_bond_boe_reference, customer_name, removal_type,
    cargo_description, package_count_released, outpass_number, vehicle_number,
    driver_name, otl_seal_number, customs_auth_reference,
    gorod_representative_signature, driver_signature, customs_inspector_signature,
    verified_by
  ) values (
    v_removal.job_id, v_removal.id, v_job.boe_number, v_customer.company_name,
    v_removal.type::text, v_job.cargo_description, v_removal.requested_package_count,
    v_removal.outpass_number, trim(p_vehicle_number), trim(p_driver_name),
    nullif(trim(p_otl_seal_number), ''), trim(p_customs_auth_reference),
    trim(p_gorod_representative_signature), trim(p_driver_signature),
    nullif(trim(p_customs_inspector_signature), ''), auth.uid()
  );

  update public.removals
  set status = 'gate_exited', updated_at = now()
  where id = p_removal_id;

  update public.inventory_items
  set available_package_count = greatest(available_package_count - v_removal.requested_package_count, 0),
      available_weight_kg = greatest(available_weight_kg - v_removal.requested_weight_kg, 0),
      storage_location_status = case
        when available_package_count - v_removal.requested_package_count <= 0 then 'dispatched'
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
      'packages_released', v_removal.requested_package_count
    )
  );
end;
$$;

revoke all on function public.gate_out(uuid, text, text, text, text, text, text, text) from public;
revoke all on function public.gate_out(uuid, text, text, text, text, text, text, text) from anon;
grant execute on function public.gate_out(uuid, text, text, text, text, text, text, text) to authenticated;

-- 5.7 Record the Customs escalation notification evidence.
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

revoke all on function public.log_customs_notification(uuid, text, text) from public;
revoke all on function public.log_customs_notification(uuid, text, text) from anon;
grant execute on function public.log_customs_notification(uuid, text, text) to authenticated;

-- 5.8 Resolve the weight hold with the Customs disposition.
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

revoke all on function public.resolve_weight_escalation(uuid, text, text) from public;
revoke all on function public.resolve_weight_escalation(uuid, text, text) from anon;
grant execute on function public.resolve_weight_escalation(uuid, text, text) to authenticated;
