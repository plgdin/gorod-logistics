-- ==============================================================================
-- GOROD LOGISTICS — LOCAL / DEVELOPMENT DEMO SEED
--
-- DO NOT RUN THIS FILE IN PRODUCTION.
--
-- It creates six shared-password demo accounts and three demo consignments for
-- local development and training only. Production staff accounts must be
-- provisioned through Supabase Auth.
--
-- Prerequisites:
--   supabase_sop_schema.sql
--   supabase_live_setup.sql
--   supabase_production_hardening.sql
--
-- Demo login password for every account:  Gorod@2026
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- DEMO AUTH USERS
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- DEMO OPERATIONAL DATA
-- Fixed UUIDs keep this idempotent.
-- ------------------------------------------------------------------------------
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
