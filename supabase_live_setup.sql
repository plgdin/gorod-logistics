-- ==============================================================================
-- GOROD LOGISTICS — GO-LIVE SETUP
-- Run this ONCE in the Supabase Dashboard -> SQL Editor -> New query -> Run.
--
-- It is safe to re-run. It will:
--   1. Add the RLS policies that are missing from supabase_sop_schema.sql.
--   2. Auto-create a profile whenever an auth user is created.
--   3. Create the dashboard_jobs view used by the React app.
--   4. Create the create_inward_job() RPC used by the "Register Inward BOE" form.
--   5. Create six confirmed demo login accounts (password: Gorod@2026).
--   6. Seed demo customers, jobs, receipts, inventory and one cleared removal.
--
-- Project: https://evdllzjurrhmtmfhsfsd.supabase.co
-- ==============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ==============================================================================
-- 1. MISSING RLS POLICIES
-- supabase_sop_schema.sql enabled RLS on these tables but never added a policy,
-- so they were invisible to every authenticated user (including service staff).
-- ==============================================================================

drop policy if exists "Staff can view bins" on public.warehouse_bins;
create policy "Staff can view bins"
  on public.warehouse_bins for select to authenticated using (true);

drop policy if exists "Ops can manage bins" on public.warehouse_bins;
create policy "Ops can manage bins"
  on public.warehouse_bins for all to authenticated using (true) with check (true);

drop policy if exists "Staff can view space certificates" on public.space_certificates;
create policy "Staff can view space certificates"
  on public.space_certificates for select to authenticated using (true);

drop policy if exists "Admin can manage space certificates" on public.space_certificates;
create policy "Admin can manage space certificates"
  on public.space_certificates for all to authenticated using (true) with check (true);

drop policy if exists "Staff can view GRA" on public.goods_received_acknowledgements;
create policy "Staff can view GRA"
  on public.goods_received_acknowledgements for select to authenticated using (true);

drop policy if exists "Admin can manage GRA" on public.goods_received_acknowledgements;
create policy "Admin can manage GRA"
  on public.goods_received_acknowledgements for all to authenticated using (true) with check (true);

-- A signed-in user is allowed to create their own profile if the trigger below
-- has not already done it.
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

-- ==============================================================================
-- 2. AUTO-CREATE PROFILE ON SIGN-UP
-- Without this, auth.users and profiles drift apart and every FK to profiles
-- (created_by, verified_by, ndc_issued_by, ...) fails.
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role public.user_role;
begin
  v_role := case
    when new.raw_user_meta_data->>'role' in (
      'warehouse_keeper', 'admin_compliance', 'warehouse_manager',
      'security_team', 'accounts_team', 'customs_bond_officer'
    ) then (new.raw_user_meta_data->>'role')::public.user_role
    else 'admin_compliance'::public.user_role
  end;

  insert into public.profiles (id, email, full_name, role, department, badge_number)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(new.email, '@', 1)),
    v_role,
    coalesce(new.raw_user_meta_data->>'department', 'Customs Documentation & ICEGATE Desk'),
    coalesce(new.raw_user_meta_data->>'badge_number', 'GL-STAFF')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 3. DASHBOARD VIEW
-- One row per job, already joined to the customer, latest weighing, latest
-- removal and assigned bin. security_invoker keeps RLS in force.
-- ==============================================================================

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
  j.created_at
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

-- ==============================================================================
-- 4. CREATE JOB RPC
-- The UI only asks for customer name, BOE, cargo, packages and weight. This
-- function fills the other NOT NULL columns with safe operational defaults,
-- reuses the customer when the name already exists, and returns the job id.
-- ==============================================================================

create or replace function public.create_inward_job(
  p_customer_name      text,
  p_boe_number         text,
  p_cargo_description  text,
  p_package_count      integer,
  p_declared_weight    numeric,
  p_iec_code           text default null,
  p_contact_email      text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_job_id      uuid;
  v_stamp       text := to_char(now(), 'YYYYMMDDHH24MISS');
begin
  if auth.uid() is null then
    raise exception 'Authentication required to create a job';
  end if;

  if coalesce(trim(p_customer_name), '') = ''
     or coalesce(trim(p_boe_number), '') = ''
     or coalesce(trim(p_cargo_description), '') = '' then
    raise exception 'Customer, BOE number and cargo description are required';
  end if;

  if p_package_count is null or p_package_count <= 0
     or p_declared_weight is null or p_declared_weight <= 0 then
    raise exception 'Package count and declared weight must be greater than zero';
  end if;

  select id into v_customer_id
  from public.customers
  where lower(company_name) = lower(trim(p_customer_name))
  order by created_at asc
  limit 1;

  if v_customer_id is null then
    insert into public.customers (
      company_name, iec_code, contact_person, contact_email, contact_phone,
      address_line, city
    ) values (
      trim(p_customer_name),
      coalesce(nullif(trim(p_iec_code), ''), 'PENDING-' || v_stamp),
      trim(p_customer_name),
      coalesce(nullif(trim(p_contact_email), ''), 'operations@gorodlogistics.com'),
      '0471-3191914',
      'Directorate of Port, Valiyathura',
      'Thiruvananthapuram'
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
    current_date,
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

  return v_job_id;
end;
$$;

revoke all on function public.create_inward_job(text, text, text, integer, numeric, text, text) from public;
revoke all on function public.create_inward_job(text, text, text, integer, numeric, text, text) from anon;
grant execute on function public.create_inward_job(text, text, text, integer, numeric, text, text) to authenticated;

-- ==============================================================================
-- 5. DEMO AUTH USERS
-- Six confirmed email accounts, one per SOP role.
-- Login password for every account:  Gorod@2026
-- ==============================================================================

do $$
declare
  r     record;
  v_uid uuid;
begin
  for r in
    select * from (values
      ('keeper@gorodlogistics.com',     'Rajesh Nair',         'warehouse_keeper',     'GL-WK-001',    'Warehouse Governance & Compliance'),
      ('compliance@gorodlogistics.com', 'Anjali Menon',        'admin_compliance',     'GL-ADM-002',   'Customs Documentation & ICEGATE Desk'),
      ('operations@gorodlogistics.com', 'Vikram Pillai',       'warehouse_manager',    'GL-OPS-003',   'Material Handling & Inventory Operations'),
      ('security@gorodlogistics.com',   'Suresh Kumar',        'security_team',        'GL-SEC-004',   'Main Gate & Physical Registers'),
      ('accounts@gorodlogistics.com',   'Pooja Varma',         'accounts_team',        'GL-ACC-005',   'Billing & Financial Clearance (NDC)'),
      ('bond.officer@customs.gov.in',   'Superintendent K. Sharma', 'customs_bond_officer', 'CUS-TRV-BOND-18', 'Jurisdictional Customs Authority')
    ) as t(email, full_name, role, badge_number, department)
  loop
    select id into v_uid from auth.users where email = r.email limit 1;

    if v_uid is null then
      v_uid := gen_random_uuid();

      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, created_at, updated_at,
        raw_app_meta_data, raw_user_meta_data,
        confirmation_token, recovery_token,
        email_change_token_new, email_change
      ) values (
        '00000000-0000-0000-0000-000000000000',
        v_uid,
        'authenticated',
        'authenticated',
        r.email,
        extensions.crypt('Gorod@2026', extensions.gen_salt('bf')),
        now(), now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'full_name',    r.full_name,
          'role',         r.role,
          'department',   r.department,
          'badge_number', r.badge_number
        ),
        '', '', '', ''
      );

      insert into auth.identities (
        user_id, identity_data, provider, provider_id,
        last_sign_in_at, created_at, updated_at
      ) values (
        v_uid,
        jsonb_build_object('sub', v_uid::text, 'email', r.email),
        'email',
        v_uid::text,
        now(), now(), now()
      )
      on conflict (provider_id, provider) do nothing;
    else
      -- Keep the documented demo password valid on re-runs.
      update auth.users
      set encrypted_password = extensions.crypt('Gorod@2026', extensions.gen_salt('bf')),
          email_confirmed_at = coalesce(email_confirmed_at, now()),
          updated_at         = now()
      where id = v_uid;
    end if;

    insert into public.profiles (id, email, full_name, role, department, badge_number)
    values (
      v_uid, r.email, r.full_name, r.role::public.user_role, r.department, r.badge_number
    )
    on conflict (id) do update
      set email        = excluded.email,
          full_name    = excluded.full_name,
          role         = excluded.role,
          department   = excluded.department,
          badge_number = excluded.badge_number,
          updated_at   = now();
  end loop;
end;
$$;

-- ==============================================================================
-- 6. DEMO OPERATIONAL DATA
-- Fixed UUIDs keep this idempotent.
-- ==============================================================================

insert into public.customers (id, company_name, iec_code, pan_number, gstin, contact_person, contact_email, contact_phone, address_line, city, state, is_verified) values
  ('11111111-1111-1111-1111-111111110201', 'Malabar Marine Exports Ltd',  'IEC0801001234', 'AABCM1234C', '32AABCM1234C1Z5', 'Arun Kumar',  'arun@malabarmarine.in',  '9847012345', 'Kowdiar',    'Thiruvananthapuram', 'Kerala', true),
  ('11111111-1111-1111-1111-111111110202', 'Travancore Spices & Herbs',   'IEC0801005678', 'AABCT5678D', '32AABCT5678D1Z8', 'Meera Nair',  'meera@travancorespices.in', '9847056789', 'Chalai',  'Thiruvananthapuram', 'Kerala', true),
  ('11111111-1111-1111-1111-111111110203', 'Kerala High-Tech Solutions',  'IEC0801009012', 'AABCK9012E', '32AABCK9012E1Z2', 'David Thomas', 'david@keralahitech.in',  '9847090123', 'Technopark', 'Thiruvananthapuram', 'Kerala', true)
on conflict (id) do nothing;

insert into public.jobs (id, job_number, customer_id, boe_number, boe_date, bond_number, bond_date, port_code, warehouse_code, origin_type, origin_location, cargo_description, declared_package_count, declared_gross_weight, status) values
  ('11111111-1111-1111-1111-111111110101', 'GL-JOB-2026-0089', '11111111-1111-1111-1111-111111110201', 'BOE-9081245', '2026-05-12', '2002591018', '2026-05-01', 'INTRV1', 'TRV1U001', 'customs_station', 'Customs Station, Thiruvananthapuram', 'Cold Chain Industrial Compressor Units', 24, 4800, 'binned_and_barcoded'),
  ('11111111-1111-1111-1111-111111110102', 'GL-JOB-2026-0090', '11111111-1111-1111-1111-111111110202', 'BOE-9081299', '2026-05-14', '2002591018', '2026-05-01', 'INTRV1', 'TRV1U001', 'customs_station', 'Customs Station, Thiruvananthapuram', 'Sterilized Cardamom Extract Drums',      40, 2000, 'weight_escalation_hold'),
  ('11111111-1111-1111-1111-111111110103', 'GL-JOB-2026-0085', '11111111-1111-1111-1111-111111110203', 'BOE-9076510', '2026-05-02', '2002591018', '2026-05-01', 'INTRV1', 'TRV1U001', 'customs_station', 'Customs Station, Thiruvananthapuram', 'Server Rack Enclosures & Networking Units', 12, 1450, 'receipt_closed')
on conflict (id) do nothing;

insert into public.inward_receipts (id, job_id, vehicle_registration, driver_name, arrival_security_type, otl_number, otl_condition, security_passed, actual_package_count, actual_gross_weight, weight_variance, weight_escalation_triggered, weight_escalation_reason, chk_job_docs_matched, chk_vehicle_photo_recorded, chk_otl_escort_verified, chk_cargo_desc_matched, chk_package_count_checked, chk_cargo_condition_checked, chk_weight_identified, chk_customs_attendance_checked, chk_unloading_readiness_confirmed) values
  ('11111111-1111-1111-1111-111111110301', '11111111-1111-1111-1111-111111110101', 'KL-01-AB-1234', 'Ramesh', 'otl', 'OTL-TRV-77120', 'intact', true, 24, 4802.50, 2.50, false, null, true, true, true, true, true, true, true, true, true),
  ('11111111-1111-1111-1111-111111110302', '11111111-1111-1111-1111-111111110102', 'KL-01-CD-5678', 'Suresh', 'otl', 'OTL-TRV-77135', 'intact', true, 40, 2008.20, 8.20, true, 'Actual weight exceeds declared reference by 8.20 kg (> ±5 kg SOP threshold). Customs Bond Officer notified.', true, true, true, true, true, true, true, true, true)
on conflict (id) do nothing;

insert into public.inventory_items (id, job_id, bin_id, barcode_label, initial_package_count, available_package_count, actual_weight_kg, available_weight_kg, storage_location_status, binned_at) values
  ('11111111-1111-1111-1111-111111110501', '11111111-1111-1111-1111-111111110101', (select id from public.warehouse_bins where bin_code = 'BAY-A-01' limit 1), 'GL-BC-2026-0089', 24, 24, 4802.50, 4802.50, 'assigned_bin', now())
on conflict (id) do nothing;

insert into public.removals (id, removal_number, job_id, customer_id, type, requested_package_count, requested_weight_kg, requested_etd, ex_bond_boe_number, ex_bond_boe_date, ooc_number, ooc_date, duty_payment_challan_ref, invoice_number, invoice_amount, payment_cleared, ndc_number, ndc_issued_at, outpass_number, outpass_issued_at, status) values
  ('11111111-1111-1111-1111-111111110401', 'GL-REM-2026-0034', '11111111-1111-1111-1111-111111110103', '11111111-1111-1111-1111-111111110203', 'home_consumption', 12, 1450, '2026-05-20T10:00:00+05:30', 'BOE-9076510', '2026-05-02', 'OOC-2026-4471', '2026-05-18', 'CHL-2026-8890', 'INV-2026-0034', 18500, true, 'NDC-2026-0034', now(), 'GL-GP-2026-0034', now(), 'outpass_issued')
on conflict (id) do nothing;

-- ==============================================================================
-- 7. VERIFY
-- ==============================================================================

select
  (select count(*) from public.profiles)      as profiles,
  (select count(*) from public.customers)     as customers,
  (select count(*) from public.jobs)          as jobs,
  (select count(*) from public.inward_receipts) as receipts,
  (select count(*) from public.removals)      as removals,
  (select count(*) from auth.users)           as auth_users;
