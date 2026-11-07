-- ==============================================================================
-- GOROD LOGISTICS — PRODUCTION GO-LIVE SETUP
-- Run this in the Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Then run supabase_production_hardening.sql.
--
-- It is safe to re-run. It will:
--   1. Add the RLS policies that are missing from supabase_sop_schema.sql.
--   2. Auto-create a profile whenever an auth user is created.
--   3. Create the dashboard_jobs view used by the React app.
--   4. Add the production role-checked RPCs and audit trail
--      (supabase_production_hardening.sql).
--
-- This file deliberately creates NO demo users and NO demo consignments.
-- Provision real staff accounts through Supabase Auth, or use
-- supabase_demo_seed.sql in a local development project only.
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
-- 4. PRODUCTION RPCs
-- The create_inward_job(), record_weighment(), request_removal(), issue_ndc(),
-- issue_outpass(), gate_out(), log_customs_notification() and
-- resolve_weight_escalation() functions are defined in
-- supabase_production_hardening.sql. Run that file next.
-- ==============================================================================

-- ==============================================================================
-- 5. NO DEMO AUTH USERS
-- This go-live file does not create shared-password accounts. Provision real
-- staff through Supabase Auth (Dashboard -> Authentication -> Users) or your
-- identity provider. For local development only, run supabase_demo_seed.sql.
-- ==============================================================================

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
