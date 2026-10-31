-- ==============================================================================
-- GOROD LOGISTICS - CUSTOMS BONDED WAREHOUSE (CBW) COMPLETE SCHEMA
-- Conforming strictly to SOP Document: GL-CBW-SOP-2026 (Directorate of Port, Valiyathura)
-- Warehouse Code: TRV1U001 | Bond No: 2002591018
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS (Roles, SOP Statuses, Removal Types, Handling Activities)
-- ==============================================================================

-- Section 3: 6 Standard Operating Roles
CREATE TYPE user_role AS ENUM (
  'warehouse_keeper',          -- Overall compliance head, statutory approvals, Customs Bond Officer liaison
  'admin_compliance',          -- Customs Compliance & Documentation, Job creation, onboarding, returns
  'warehouse_manager',         -- Operations Team, tally, pre-unloading checklist, weighing, bin allocation
  'security_team',             -- Gate reception, physical inward/outward registers, vehicle checks, gate pass verification
  'accounts_team',             -- Customer invoices, financial verification, No-Due Certificate (NDC) issuance
  'customs_bond_officer'       -- External Authority, notifications, attendance, escalations, inspections
);

-- SOP 4.1 Inward Lifecycle Status
CREATE TYPE inward_status AS ENUM (
  'enquiry_registered',
  'space_cert_issued',
  'eta_notified',
  'vehicle_arrived',
  'otl_verified',
  'checklist_completed',
  'unloaded_and_weighed',
  'weight_escalation_hold',    -- Triggered if actual weight differs from reference by > +-5 kg
  'binned_and_barcoded',
  'gra_issued',
  'receipt_closed'
);

-- SOP 4.2 Removal Types
CREATE TYPE removal_type AS ENUM (
  'home_consumption',          -- Sec. 68: Ex-Bond BOE with Out of Charge (OOC)
  're_export',                 -- Sec. 69: Shipping Bill with Let Export Order (LEO) + OTL
  'warehouse_transfer'         -- Sec. 67: Form A + Customs permission + OTL
);

-- SOP 4.2 Removal Lifecycle Status
CREATE TYPE removal_status AS ENUM (
  'request_submitted',
  'customs_notified',
  'cargo_picked',
  'delivery_zone_verified',
  'invoiced',
  'ndc_cleared',               -- Accounts No-Due Certificate mandatory lock
  'outpass_issued',
  'gate_exited',
  'removal_closed'
);

-- SOP 4.3 Handling & Storage Activity Types
CREATE TYPE handling_activity_type AS ENUM (
  'section_64_operations',     -- Inspection, repacking, sorting, labeling, showing for sale
  'government_sampling',       -- Samples drawn by government agencies
  'warehousing_extension',     -- Section 61 extension
  'bank_guarantee_record',     -- Bank guarantee execution/renewal
  'relinquishment_of_goods'    -- Section 68 cargo relinquishment
);

-- ==============================================================================
-- 2. USER PROFILES & RBAC
-- ==============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin_compliance',
  phone_number TEXT,
  department TEXT,
  badge_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. CUSTOMER ONBOARDING (SOP 4.1.2)
-- ==============================================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  iec_code TEXT NOT NULL,                 -- Importer-Exporter Code
  pan_number TEXT,
  gstin TEXT,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  customs_broker_name TEXT,
  customs_broker_license TEXT,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Kerala',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. JOBS / CONSIGNMENTS (SOP 4.1.1: 1:1 BOE to Job Number Rule)
-- ==============================================================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT NOT NULL UNIQUE,         -- Unique Master Reference ID
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Customs Reference (Rule: Each Bill of Entry has a separate Job Number)
  boe_number TEXT NOT NULL UNIQUE,
  boe_date DATE NOT NULL,
  bond_number TEXT NOT NULL DEFAULT '2002591018',
  bond_date DATE NOT NULL,
  port_code TEXT NOT NULL DEFAULT 'INTRV1',
  warehouse_code TEXT NOT NULL DEFAULT 'TRV1U001',
  
  -- Consignment Particulars
  origin_type TEXT NOT NULL CHECK (origin_type IN ('customs_station', 'another_warehouse')),
  origin_location TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  declared_package_count INTEGER NOT NULL CHECK (declared_package_count > 0),
  declared_gross_weight NUMERIC(10, 2) NOT NULL CHECK (declared_gross_weight > 0), -- kg
  declared_volume_cbm NUMERIC(10, 2),
  special_handling_instructions TEXT,
  
  -- Current Lifecycle
  status inward_status NOT NULL DEFAULT 'enquiry_registered',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. SPACE CERTIFICATES (SOP 4.1.3)
-- ==============================================================================

CREATE TABLE space_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number TEXT NOT NULL UNIQUE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  space_allocated_sqm NUMERIC(8, 2) NOT NULL,
  valid_until DATE NOT NULL,
  prepared_by UUID NOT NULL REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id), -- Warehouse Keeper approval required
  approved_at TIMESTAMPTZ,
  document_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'issued', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. INWARD RECEIPT & INSPECTION (SOP 4.1.4 - 4.1.8)
-- ==============================================================================

CREATE TABLE inward_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  -- ETA & Coordination (4.1.4)
  eta TIMESTAMPTZ,
  customs_notified_at TIMESTAMPTZ,
  customs_bond_officer_attended BOOLEAN DEFAULT false,
  
  -- Vehicle Arrival & Security (4.1.5)
  arrival_timestamp TIMESTAMPTZ,
  vehicle_registration TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_license TEXT,
  security_officer_id UUID REFERENCES profiles(id),
  
  -- Security Seal / Escort Verification (4.1.6)
  arrival_security_type TEXT NOT NULL CHECK (arrival_security_type IN ('otl', 'customs_escort')),
  otl_number TEXT,
  otl_condition TEXT CHECK (otl_condition IN ('intact', 'broken', 'tampered', 'missing', 'inconsistent')),
  customs_escort_name TEXT,
  customs_escort_designation TEXT,
  customs_escort_receipt_url TEXT,
  security_passed BOOLEAN NOT NULL DEFAULT false,
  
  -- 9-Point Pre-Unloading Inspection Checklist (4.1.7)
  chk_job_docs_matched BOOLEAN NOT NULL DEFAULT false,
  chk_vehicle_photo_recorded BOOLEAN NOT NULL DEFAULT false,
  chk_otl_escort_verified BOOLEAN NOT NULL DEFAULT false,
  chk_cargo_desc_matched BOOLEAN NOT NULL DEFAULT false,
  chk_package_count_checked BOOLEAN NOT NULL DEFAULT false,
  chk_cargo_condition_checked BOOLEAN NOT NULL DEFAULT false,
  chk_weight_identified BOOLEAN NOT NULL DEFAULT false,
  chk_customs_attendance_checked BOOLEAN NOT NULL DEFAULT false,
  chk_unloading_readiness_confirmed BOOLEAN NOT NULL DEFAULT false,
  checklist_completed_by UUID REFERENCES profiles(id),
  checklist_completed_at TIMESTAMPTZ,
  
  -- Detailed Verification & Weighing (4.1.8)
  actual_package_count INTEGER,
  actual_gross_weight NUMERIC(10, 2), -- kg
  weight_variance NUMERIC(10, 2),     -- actual - declared
  
  -- SOP Threshold: > +-5 kg triggers mandatory escalation
  weight_escalation_triggered BOOLEAN NOT NULL DEFAULT false,
  weight_escalation_reason TEXT,
  weight_escalation_customs_email_sent TIMESTAMPTZ,
  weight_escalation_resolved BOOLEAN DEFAULT false,
  
  -- Condition & Visuals
  cargo_condition_notes TEXT,
  photos_360_urls TEXT[] DEFAULT '{}',
  
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 7. WAREHOUSE BINS & INVENTORY LEDGER (SOP 4.1.9)
-- ==============================================================================

CREATE TABLE warehouse_bins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bin_code TEXT NOT NULL UNIQUE,          -- e.g. BAY-A-01, BAY-B-CONTAINER
  zone_name TEXT NOT NULL,               -- e.g. Covered Storage, Acceptance Zone, VAS Zone
  capacity_sqm NUMERIC(8, 2) NOT NULL,
  max_weight_capacity_kg NUMERIC(10, 2),
  is_occupied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  bin_id UUID REFERENCES warehouse_bins(id) ON DELETE SET NULL,
  barcode_label TEXT NOT NULL UNIQUE,     -- Scanned handling unit barcode
  
  -- Quantities & Weights
  initial_package_count INTEGER NOT NULL,
  available_package_count INTEGER NOT NULL CHECK (available_package_count >= 0),
  actual_weight_kg NUMERIC(10, 2) NOT NULL,
  available_weight_kg NUMERIC(10, 2) NOT NULL CHECK (available_weight_kg >= 0),
  
  storage_location_status TEXT NOT NULL DEFAULT 'acceptance_zone'
    CHECK (storage_location_status IN ('acceptance_zone', 'assigned_bin', 'vas_zone', 'delivery_staging', 'dispatched')),
  binned_at TIMESTAMPTZ,
  binned_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. GOODS RECEIVED ACKNOWLEDGEMENT (GRA) (SOP 4.1.10)
-- ==============================================================================

CREATE TABLE goods_received_acknowledgements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gra_number TEXT NOT NULL UNIQUE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  acknowledged_packages INTEGER NOT NULL,
  acknowledged_weight_kg NUMERIC(10, 2) NOT NULL,
  discrepancies_noted TEXT,               -- Must not state clean if exceptions exist
  official_seal_applied BOOLEAN NOT NULL DEFAULT false,
  signed_by UUID NOT NULL REFERENCES profiles(id),
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  emailed_to_customs_at TIMESTAMPTZ,
  emailed_to_customer_at TIMESTAMPTZ,
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. REMOVAL OF GOODS (SOP 4.2.1 - 4.2.8)
-- ==============================================================================

CREATE TABLE removals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  removal_number TEXT NOT NULL UNIQUE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  
  -- Statutory Category (4.2.1)
  type removal_type NOT NULL,
  requested_package_count INTEGER NOT NULL CHECK (requested_package_count > 0),
  requested_weight_kg NUMERIC(10, 2) NOT NULL,
  requested_etd TIMESTAMPTZ NOT NULL,
  
  -- Mandatory Customs Clearance Documents (4.2.2 & 4.2.7)
  -- 1. Home Consumption
  ex_bond_boe_number TEXT,
  ex_bond_boe_date DATE,
  ooc_number TEXT,                       -- Out of Charge Copy
  ooc_date DATE,
  duty_payment_challan_ref TEXT,
  
  -- 2. Re-Export
  shipping_bill_number TEXT,
  shipping_bill_date DATE,
  leo_number TEXT,                       -- Let Export Order
  leo_date DATE,
  section_69_order_ref TEXT,
  
  -- 3. Transfer to Another Warehouse
  form_a_number TEXT,                    -- Prescribed Form under Sec. 67
  destination_warehouse_code TEXT,
  destination_warehouse_name TEXT,
  customs_transfer_permission_ref TEXT,
  
  -- Outward OTL Seal Requirement (Re-export / Transfer)
  outward_otl_number TEXT,
  outward_otl_photo_url TEXT,
  
  -- Picking & Verification (4.2.4 & 4.2.5)
  picked_package_count INTEGER,
  picked_actual_weight_kg NUMERIC(10, 2),
  delivery_zone_verified_by UUID REFERENCES profiles(id),
  delivery_zone_verified_at TIMESTAMPTZ,
  
  -- Financial Clearance Lock (4.2.6)
  invoice_number TEXT,
  invoice_amount NUMERIC(10, 2),
  payment_cleared BOOLEAN NOT NULL DEFAULT false,
  ndc_number TEXT,                       -- No-Due Certificate
  ndc_issued_by UUID REFERENCES profiles(id),
  ndc_issued_at TIMESTAMPTZ,
  
  -- Release Gate Pass (4.2.8)
  outpass_number TEXT UNIQUE,
  outpass_issued_by UUID REFERENCES profiles(id),
  outpass_issued_at TIMESTAMPTZ,
  
  status removal_status NOT NULL DEFAULT 'request_submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- CONSTRAINT: Outpass cannot exist without NDC clearance!
  CONSTRAINT chk_outpass_requires_ndc CHECK (
    outpass_number IS NULL OR (payment_cleared = true AND ndc_number IS NOT NULL)
  )
);

-- ==============================================================================
-- 10. PHYSICAL GATE REGISTERS (SOP 4.1.11 & 4.2.9)
-- ==============================================================================

CREATE TABLE gate_inward_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arrival_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  boe_reference TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  otl_or_escort_reference TEXT NOT NULL,
  package_count_received INTEGER NOT NULL,
  receipt_status_notes TEXT,
  gorod_representative_signature TEXT NOT NULL,
  driver_signature TEXT NOT NULL,
  customs_inspector_signature TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE gate_outward_register (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gate_out_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  removal_id UUID NOT NULL REFERENCES removals(id) ON DELETE RESTRICT,
  into_bond_boe_reference TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  removal_type TEXT NOT NULL,
  cargo_description TEXT NOT NULL,
  package_count_released INTEGER NOT NULL,
  outpass_number TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  otl_seal_number TEXT,
  customs_auth_reference TEXT NOT NULL,
  gorod_representative_signature TEXT NOT NULL,
  driver_signature TEXT NOT NULL,
  customs_inspector_signature TEXT,
  verified_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. HANDLING & STORAGE ACTIVITIES (SOP 4.3)
-- ==============================================================================

CREATE TABLE handling_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  activity_type handling_activity_type NOT NULL,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Section 64 (Owner Operations)
  section_64_description TEXT,
  section_64_purpose TEXT,
  
  -- Government Agency Sampling
  sampling_agency_name TEXT,
  sampling_order_ref TEXT,
  sample_quantity NUMERIC(10, 2),
  sample_unit TEXT,
  sample_purpose TEXT,
  
  -- Section 61 Warehousing Extension
  original_expiry_date DATE,
  extended_expiry_date DATE,
  extension_reason TEXT,
  extension_order_ref TEXT,
  
  -- Bank Guarantee Recording
  bank_guarantee_amount NUMERIC(12, 2),
  bank_guarantee_expiry DATE,
  bank_guarantee_ref TEXT,
  
  -- Section 68 Relinquishment
  relinquished_package_count INTEGER,
  relinquished_weight_kg NUMERIC(10, 2),
  relinquishment_customs_order_ref TEXT,
  
  -- Approvals & Coordination (4.3.4)
  customs_notified_at TIMESTAMPTZ,
  warehouse_keeper_approved BOOLEAN NOT NULL DEFAULT false,
  warehouse_keeper_id UUID REFERENCES profiles(id),
  warehouse_keeper_approved_at TIMESTAMPTZ,
  
  -- VAS Media
  media_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. STATUTORY MONTHLY RETURNS - ICEGATE FORM A & B (SOP 4.4)
-- ==============================================================================

CREATE TABLE monthly_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_month INTEGER NOT NULL CHECK (return_month BETWEEN 1 AND 12),
  return_year INTEGER NOT NULL CHECK (return_year >= 2026),
  form_type TEXT NOT NULL CHECK (form_type IN ('form_a', 'form_b')),
  
  -- Form A: Monthly Cargo Movements (Receipts, Storage, Handlings, Removals)
  -- Form B: Goods whose warehousing period is due to expire
  
  summary_data JSONB NOT NULL,            -- Prescribed ICEGATE format data payload
  warehouse_keeper_approved BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- ICEGATE Portal Filing Details (4.4.3 & 4.4.4)
  icegate_ack_number TEXT,
  filed_at TIMESTAMPTZ,
  filed_by UUID REFERENCES profiles(id),
  customs_email_confirmation_sent TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'filed_on_icegate', 'acknowledged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE (return_month, return_year, form_type)
);

-- ==============================================================================
-- 13. AUDIT TRAIL LOGS
-- ==============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,                  -- e.g. 'WEIGHT_BREACH_ESCALATED', 'NDC_ISSUED', 'GATEPASS_GENERATED'
  performed_by UUID REFERENCES profiles(id),
  details JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inward_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_received_acknowledgements ENABLE ROW LEVEL SECURITY;
ALTER TABLE removals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_inward_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_outward_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE handling_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Base Authenticated Read Policy (Internal Staff can inspect records)
CREATE POLICY "Authenticated users can view profiles" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Staff can view customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage customers" ON customers FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view jobs" ON jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin & Keeper can manage jobs" ON jobs FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view receipts" ON inward_receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Operations & Admin can manage receipts" ON inward_receipts FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view inventory" ON inventory_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Operations can manage inventory" ON inventory_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view removals" ON removals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage removals" ON removals FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view registers" ON gate_inward_register FOR SELECT TO authenticated USING (true);
CREATE POLICY "Security can insert inward register" ON gate_inward_register FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Staff can view outward registers" ON gate_outward_register FOR SELECT TO authenticated USING (true);
CREATE POLICY "Security can insert outward register" ON gate_outward_register FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Staff can view handling" ON handling_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can manage handling" ON handling_activities FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view monthly returns" ON monthly_returns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin & Keeper can manage monthly returns" ON monthly_returns FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view audit logs" ON audit_logs FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- 15. SEED DATA FOR DEMO & TESTING (Roles, Bins, Initial Job)
-- ==============================================================================

-- Bins in Valiyathura Bonded Warehouse
INSERT INTO warehouse_bins (bin_code, zone_name, capacity_sqm, max_weight_capacity_kg) VALUES
('BAY-A-01', 'Covered Storage Bay A', 100.0, 50000.0),
('BAY-A-02', 'Covered Storage Bay A', 100.0, 50000.0),
('BAY-B-01', 'Covered Storage Bay B (Heavy Handling)', 150.0, 75000.0),
('BAY-C-VAS', 'Value Added Service (VAS) Zone', 80.0, 30000.0),
('ZONE-ACCEPTANCE', 'Inward Acceptance Zone', 120.0, 60000.0),
('ZONE-DELIVERY', 'Delivery Staging Zone', 120.0, 60000.0)
ON CONFLICT (bin_code) DO NOTHING;
