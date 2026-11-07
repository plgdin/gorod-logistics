import { supabase } from './supabase';
import { CBW_DETAILS } from '../features/sop/sopData';

export type JobStatus =
  | 'Enquiry'
  | 'Space Cert Issued'
  | 'Vehicle Arrived'
  | 'Inspection Passed'
  | 'Weight Escalated'
  | 'Binned & GRA Issued'
  | 'Removal Requested'
  | 'NDC Cleared'
  | 'Outpass Issued'
  | 'Gate Out Closed';

export type RemovalType = 'home_consumption' | 're_export' | 'warehouse_transfer';

export interface DashboardJob {
  id: string;
  customerId: string;
  jobNumber: string;
  customerName: string;
  boeNumber: string;
  boeDate: string;
  bondNumber: string;
  cargoDesc: string;
  packages: number;
  declaredWeightKg: number;

  receiptId?: string;
  actualWeightKg?: number;
  actualPackageCount?: number;
  weightVarianceKg?: number;
  escalationTriggered: boolean;
  escalationNotifiedAt?: string;
  escalationResolved: boolean;
  vehicleRegistration?: string;
  driverName?: string;
  otlNumber?: string;
  cargoConditionNotes?: string;

  assignedBin?: string;
  status: JobStatus;
  ndcCleared: boolean;

  removalId?: string;
  removalNumber?: string;
  removalStatus?: string;
  removalType?: RemovalType;
  ndcNumber?: string;
  paymentCleared?: boolean;
  invoiceNumber?: string;
  invoiceAmount?: number;
  requestedPackageCount?: number;
  requestedWeightKg?: number;
  requestedEtd?: string;
  outpassNumber?: string;
}

interface DashboardJobRow {
  id: string;
  customer_id: string;
  job_number: string;
  customer_name: string;
  boe_number: string;
  boe_date: string;
  bond_number: string;
  cargo_description: string;
  packages: number;
  declared_weight_kg: number;
  job_status: string;

  receipt_id: string | null;
  actual_weight_kg: number | null;
  actual_package_count: number | null;
  weight_variance_kg: number | null;
  escalation_triggered: boolean;
  weight_escalation_customs_email_sent: string | null;
  weight_escalation_resolved: boolean | null;
  vehicle_registration: string | null;
  driver_name: string | null;
  otl_number: string | null;
  cargo_condition_notes: string | null;

  ndc_cleared: boolean;
  outpass_number: string | null;
  removal_status: string | null;

  removal_id: string | null;
  removal_number: string | null;
  removal_type: RemovalType | null;
  ndc_number: string | null;
  payment_cleared: boolean | null;
  invoice_number: string | null;
  invoice_amount: number | null;
  requested_package_count: number | null;
  requested_weight_kg: number | null;
  requested_etd: string | null;

  assigned_bin: string | null;
  created_at: string;
}

export interface JobStatusFields {
  jobStatus: string;
  escalationTriggered: boolean;
  escalationResolved: boolean;
  removalStatus?: string | null;
  outpassNumber?: string | null;
  ndcNumber?: string | null;
  removalId?: string | null;
}

export function deriveJobStatus(fields: JobStatusFields): JobStatus {
  const removalClosed =
    fields.removalStatus === 'gate_exited' ||
    fields.removalStatus === 'removal_closed';

  if (fields.escalationTriggered && !fields.escalationResolved) {
    return 'Weight Escalated';
  }
  if (removalClosed) {
    return 'Gate Out Closed';
  }
  if (fields.outpassNumber) {
    return 'Outpass Issued';
  }
  if (fields.ndcNumber) {
    return 'NDC Cleared';
  }
  if (fields.removalId) {
    return 'Removal Requested';
  }

  switch (fields.jobStatus) {
    case 'space_cert_issued':
    case 'eta_notified':
      return 'Space Cert Issued';
    case 'vehicle_arrived':
      return 'Vehicle Arrived';
    case 'otl_verified':
    case 'checklist_completed':
    case 'unloaded_and_weighed':
      return 'Inspection Passed';
    case 'weight_escalation_hold':
      return 'Weight Escalated';
    case 'binned_and_barcoded':
    case 'gra_issued':
    case 'receipt_closed':
      return 'Binned & GRA Issued';
    default:
      return 'Enquiry';
  }
}

function mapStatus(row: DashboardJobRow): JobStatus {
  return deriveJobStatus({
    jobStatus: row.job_status,
    escalationTriggered: Boolean(row.escalation_triggered),
    escalationResolved: Boolean(row.weight_escalation_resolved),
    removalStatus: row.removal_status,
    outpassNumber: row.outpass_number,
    ndcNumber: row.ndc_number,
    removalId: row.removal_id,
  });
}

function mapRow(row: DashboardJobRow): DashboardJob {
  return {
    id: row.id,
    customerId: row.customer_id,
    jobNumber: row.job_number,
    customerName: row.customer_name,
    boeNumber: row.boe_number,
    boeDate: row.boe_date,
    bondNumber: row.bond_number,
    cargoDesc: row.cargo_description,
    packages: row.packages,
    declaredWeightKg: Number(row.declared_weight_kg),

    receiptId: row.receipt_id || undefined,
    actualWeightKg:
      row.actual_weight_kg === null ? undefined : Number(row.actual_weight_kg),
    actualPackageCount:
      row.actual_package_count === null ? undefined : Number(row.actual_package_count),
    weightVarianceKg:
      row.weight_variance_kg === null ? undefined : Number(row.weight_variance_kg),
    escalationTriggered: Boolean(row.escalation_triggered),
    escalationNotifiedAt: row.weight_escalation_customs_email_sent || undefined,
    escalationResolved: Boolean(row.weight_escalation_resolved),
    vehicleRegistration: row.vehicle_registration || undefined,
    driverName: row.driver_name || undefined,
    otlNumber: row.otl_number || undefined,
    cargoConditionNotes: row.cargo_condition_notes || undefined,

    assignedBin: row.assigned_bin || undefined,
    status: mapStatus(row),
    ndcCleared: Boolean(row.ndc_cleared),

    removalId: row.removal_id || undefined,
    removalNumber: row.removal_number || undefined,
    removalStatus: row.removal_status || undefined,
    removalType: row.removal_type || undefined,
    ndcNumber: row.ndc_number || undefined,
    paymentCleared: row.payment_cleared ?? undefined,
    invoiceNumber: row.invoice_number || undefined,
    invoiceAmount:
      row.invoice_amount === null ? undefined : Number(row.invoice_amount),
    requestedPackageCount:
      row.requested_package_count === null
        ? undefined
        : Number(row.requested_package_count),
    requestedWeightKg:
      row.requested_weight_kg === null ? undefined : Number(row.requested_weight_kg),
    requestedEtd: row.requested_etd || undefined,
    outpassNumber: row.outpass_number || undefined,
  };
}

function friendlyError(
  message: string,
  fallback: string,
  code?: string
): Error {
  if (
    message.includes('does not exist') ||
    message.includes('schema cache') ||
    message.includes('Could not find the table')
  ) {
    return new Error(
      'Database setup is incomplete. Run supabase_live_setup.sql and supabase_production_hardening.sql in the Supabase SQL Editor, then refresh.'
    );
  }
  if (message.includes('row-level security')) {
    return new Error(
      'Your staff role is not authorised for this action. Contact the warehouse keeper.'
    );
  }
  if (
    code === 'PGRST202' ||
    message.includes('Could not find the function') ||
    message.includes('function public.')
  ) {
    return new Error(
      'Database functions are not installed. Run supabase_production_hardening.sql in the Supabase SQL Editor, then refresh.'
    );
  }
  if (code === '23505') {
    if (message.includes('boe_number')) {
      return new Error(
        'This Bill of Entry already has a job. SOP 4.1.1 requires exactly one job per BOE.'
      );
    }
    return new Error('A record with this reference already exists.');
  }
  return new Error(message || fallback);
}

function errorFrom(
  error: { message: string; code?: string } | null,
  fallback: string
): Error | null {
  if (!error) return null;
  return friendlyError(error.message, fallback, error.code);
}

export async function fetchDashboardJobs(): Promise<DashboardJob[]> {
  const { data, error } = await supabase
    .from('dashboard_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  const mappedError = errorFrom(error, 'Could not load jobs.');
  if (mappedError) throw mappedError;

  return ((data ?? []) as DashboardJobRow[]).map(mapRow);
}

export interface CreateJobInput {
  customerName: string;
  iecCode: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  addressLine: string;
  city: string;
  boeNumber: string;
  boeDate: string;
  cargoDesc: string;
  packages: number;
  declaredWeightKg: number;
}

export async function createInwardJob(input: CreateJobInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_inward_job', {
    p_customer_name: input.customerName.trim(),
    p_iec_code: input.iecCode.trim().toUpperCase(),
    p_contact_person: input.contactPerson.trim(),
    p_contact_email: input.contactEmail.trim(),
    p_contact_phone: input.contactPhone.trim(),
    p_address_line: input.addressLine.trim(),
    p_city: input.city.trim(),
    p_boe_number: input.boeNumber.trim(),
    p_boe_date: input.boeDate,
    p_cargo_description: input.cargoDesc.trim(),
    p_package_count: Number(input.packages),
    p_declared_weight: Number(input.declaredWeightKg),
  });

  const mappedError = errorFrom(error, 'Could not create the job.');
  if (mappedError) throw mappedError;

  return data as string;
}

export interface WeighmentInput {
  jobId: string;
  actualWeightKg: number;
  actualPackageCount: number;
  vehicleRegistration: string;
  driverName: string;
  driverLicense?: string;
  arrivalSecurityType: 'otl' | 'customs_escort';
  otlNumber?: string;
  otlCondition?: 'intact' | 'broken' | 'tampered' | 'missing' | 'inconsistent';
  customsEscortName?: string;
  customsEscortDesignation?: string;
  cargoConditionNotes?: string;
  checkpoints: {
    chk_job_docs_matched: boolean;
    chk_vehicle_photo_recorded: boolean;
    chk_otl_escort_verified: boolean;
    chk_cargo_desc_matched: boolean;
    chk_package_count_checked: boolean;
    chk_cargo_condition_checked: boolean;
    chk_weight_identified: boolean;
    chk_customs_attendance_checked: boolean;
    chk_unloading_readiness_confirmed: boolean;
  };
}

export async function recordWeighment(input: WeighmentInput): Promise<void> {
  const { error } = await supabase.rpc('record_weighment', {
    p_job_id: input.jobId,
    p_actual_weight: input.actualWeightKg,
    p_actual_package_count: input.actualPackageCount,
    p_vehicle_registration: input.vehicleRegistration.trim(),
    p_driver_name: input.driverName.trim(),
    p_driver_license: input.driverLicense?.trim() || null,
    p_arrival_security_type: input.arrivalSecurityType,
    p_otl_number: input.otlNumber?.trim() || null,
    p_otl_condition: input.otlCondition || null,
    p_customs_escort_name: input.customsEscortName?.trim() || null,
    p_customs_escort_designation: input.customsEscortDesignation?.trim() || null,
    p_cargo_condition_notes: input.cargoConditionNotes?.trim() || null,
    p_checkpoints: input.checkpoints,
  });

  const mappedError = errorFrom(error, 'Could not record the weighment.');
  if (mappedError) throw mappedError;
}

export interface RemovalRequestInput {
  jobId: string;
  type: RemovalType;
  requestedPackageCount: number;
  requestedWeightKg: number;
  requestedEtd: string;

  exBondBoeNumber?: string;
  exBondBoeDate?: string;
  oocNumber?: string;
  oocDate?: string;
  dutyPaymentChallanRef?: string;

  shippingBillNumber?: string;
  shippingBillDate?: string;
  leoNumber?: string;
  leoDate?: string;
  section69OrderRef?: string;

  formANumber?: string;
  destinationWarehouseCode?: string;
  destinationWarehouseName?: string;
  customsTransferPermissionRef?: string;

  outwardOtlNumber?: string;
}

export async function requestRemoval(input: RemovalRequestInput): Promise<void> {
  const { error } = await supabase.rpc('request_removal', {
    p_job_id: input.jobId,
    p_type: input.type,
    p_requested_package_count: input.requestedPackageCount,
    p_requested_weight: input.requestedWeightKg,
    p_requested_etd: input.requestedEtd,
    p_ex_bond_boe_number: input.exBondBoeNumber?.trim() || null,
    p_ex_bond_boe_date: input.exBondBoeDate || null,
    p_ooc_number: input.oocNumber?.trim() || null,
    p_ooc_date: input.oocDate || null,
    p_duty_payment_challan_ref: input.dutyPaymentChallanRef?.trim() || null,
    p_shipping_bill_number: input.shippingBillNumber?.trim() || null,
    p_shipping_bill_date: input.shippingBillDate || null,
    p_leo_number: input.leoNumber?.trim() || null,
    p_leo_date: input.leoDate || null,
    p_section_69_order_ref: input.section69OrderRef?.trim() || null,
    p_form_a_number: input.formANumber?.trim() || null,
    p_destination_warehouse_code: input.destinationWarehouseCode?.trim() || null,
    p_destination_warehouse_name: input.destinationWarehouseName?.trim() || null,
    p_customs_transfer_permission_ref: input.customsTransferPermissionRef?.trim() || null,
    p_outward_otl_number: input.outwardOtlNumber?.trim() || null,
  });

  const mappedError = errorFrom(error, 'Could not request the removal.');
  if (mappedError) throw mappedError;
}

export interface IssueNdcInput {
  removalId: string;
  invoiceNumber: string;
  invoiceAmount: number;
}

export async function issueNdc(input: IssueNdcInput): Promise<void> {
  const { error } = await supabase.rpc('issue_ndc', {
    p_removal_id: input.removalId,
    p_invoice_number: input.invoiceNumber.trim(),
    p_invoice_amount: input.invoiceAmount,
  });

  const mappedError = errorFrom(error, 'Could not issue the NDC.');
  if (mappedError) throw mappedError;
}

export async function issueOutpass(removalId: string): Promise<void> {
  const { error } = await supabase.rpc('issue_outpass', {
    p_removal_id: removalId,
  });

  const mappedError = errorFrom(error, 'Could not issue the outpass.');
  if (mappedError) throw mappedError;
}

export interface GateOutInput {
  removalId: string;
  vehicleNumber: string;
  driverName: string;
  otlSealNumber?: string;
  customsAuthReference: string;
  gorodRepresentativeSignature: string;
  driverSignature: string;
  customsInspectorSignature?: string;
}

export async function gateOut(input: GateOutInput): Promise<void> {
  const { error } = await supabase.rpc('gate_out', {
    p_removal_id: input.removalId,
    p_vehicle_number: input.vehicleNumber.trim(),
    p_driver_name: input.driverName.trim(),
    p_otl_seal_number: input.otlSealNumber?.trim() || null,
    p_customs_auth_reference: input.customsAuthReference.trim(),
    p_gorod_representative_signature: input.gorodRepresentativeSignature.trim(),
    p_driver_signature: input.driverSignature.trim(),
    p_customs_inspector_signature:
      input.customsInspectorSignature?.trim() || null,
  });

  const mappedError = errorFrom(error, 'Could not record the gate-out.');
  if (mappedError) throw mappedError;
}

export interface CustomsNotificationInput {
  receiptId: string;
  reference: string;
  notifiedTo: string;
}

export async function logCustomsNotification(
  input: CustomsNotificationInput
): Promise<void> {
  const { error } = await supabase.rpc('log_customs_notification', {
    p_receipt_id: input.receiptId,
    p_reference: input.reference.trim(),
    p_notified_to: input.notifiedTo.trim(),
  });

  const mappedError = errorFrom(error, 'Could not record the Customs notification.');
  if (mappedError) throw mappedError;
}

export interface ResolveEscalationInput {
  receiptId: string;
  resolutionReference: string;
  notes?: string;
}

export async function resolveWeightEscalation(
  input: ResolveEscalationInput
): Promise<void> {
  const { error } = await supabase.rpc('resolve_weight_escalation', {
    p_receipt_id: input.receiptId,
    p_resolution_reference: input.resolutionReference.trim(),
    p_notes: input.notes?.trim() || null,
  });

  const mappedError = errorFrom(error, 'Could not resolve the weight hold.');
  if (mappedError) throw mappedError;
}

export const WEIGHT_THRESHOLD_KG = CBW_DETAILS.weightThresholdKg;
