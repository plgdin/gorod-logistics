import { supabase } from './supabase';

export type JobStatus =
  | 'Enquiry'
  | 'Space Cert Issued'
  | 'Vehicle Arrived'
  | 'Inspection Passed'
  | 'Weight Escalated'
  | 'Binned & GRA Issued'
  | 'Removal Requested'
  | 'NDC Cleared'
  | 'Gate Out Closed';

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
  actualWeightKg?: number;
  weightVarianceKg?: number;
  escalationTriggered: boolean;
  assignedBin?: string;
  status: JobStatus;
  ndcCleared: boolean;
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
  actual_weight_kg: number | null;
  weight_variance_kg: number | null;
  escalation_triggered: boolean;
  ndc_cleared: boolean;
  outpass_number: string | null;
  removal_status: string | null;
  assigned_bin: string | null;
}

function mapStatus(row: DashboardJobRow): JobStatus {
  if (row.removal_status === 'gate_exited' || row.removal_status === 'removal_closed') {
    return 'Gate Out Closed';
  }
  if (row.ndc_cleared || row.removal_status === 'ndc_cleared') {
    return 'NDC Cleared';
  }
  if (row.escalation_triggered || row.job_status === 'weight_escalation_hold') {
    return 'Weight Escalated';
  }

  switch (row.job_status) {
    case 'space_cert_issued':
    case 'eta_notified':
      return 'Space Cert Issued';
    case 'vehicle_arrived':
      return 'Vehicle Arrived';
    case 'otl_verified':
    case 'checklist_completed':
    case 'unloaded_and_weighed':
      return 'Inspection Passed';
    case 'binned_and_barcoded':
    case 'gra_issued':
    case 'receipt_closed':
      return 'Binned & GRA Issued';
    default:
      return 'Enquiry';
  }
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
    actualWeightKg:
      row.actual_weight_kg === null ? undefined : Number(row.actual_weight_kg),
    weightVarianceKg:
      row.weight_variance_kg === null ? undefined : Number(row.weight_variance_kg),
    escalationTriggered: Boolean(row.escalation_triggered),
    assignedBin: row.assigned_bin || undefined,
    status: mapStatus(row),
    ndcCleared: Boolean(row.ndc_cleared),
    outpassNumber: row.outpass_number || undefined,
  };
}

function friendlyError(message: string, fallback: string): Error {
  if (
    message.includes('does not exist') ||
    message.includes('schema cache') ||
    message.includes('Could not find the table')
  ) {
    return new Error(
      'Database setup is incomplete. Run supabase_live_setup.sql in the Supabase SQL Editor, then refresh.'
    );
  }
  if (message.includes('row-level security')) {
    return new Error(
      'The database blocked this action. Sign in with a seeded account (run supabase_live_setup.sql) or use Local Demo mode.'
    );
  }
  return new Error(message || fallback);
}

export async function fetchDashboardJobs(): Promise<DashboardJob[]> {
  const { data, error } = await supabase
    .from('dashboard_jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw friendlyError(error.message, 'Could not load jobs.');
  }

  return ((data ?? []) as DashboardJobRow[]).map(mapRow);
}

export interface CreateJobInput {
  customerName: string;
  boeNumber: string;
  cargoDesc: string;
  packages: number;
  declaredWeightKg: number;
  iecCode?: string;
  contactEmail?: string;
}

export async function createInwardJob(input: CreateJobInput): Promise<string> {
  const { data, error } = await supabase.rpc('create_inward_job', {
    p_customer_name: input.customerName,
    p_boe_number: input.boeNumber,
    p_cargo_description: input.cargoDesc,
    p_package_count: input.packages,
    p_declared_weight: input.declaredWeightKg,
    p_iec_code: input.iecCode || null,
    p_contact_email: input.contactEmail || null,
  });

  if (error) {
    throw friendlyError(error.message, 'Could not create the job.');
  }

  return data as string;
}

const checkpoints = {
  chk_job_docs_matched: true,
  chk_vehicle_photo_recorded: true,
  chk_otl_escort_verified: true,
  chk_cargo_desc_matched: true,
  chk_package_count_checked: true,
  chk_cargo_condition_checked: true,
  chk_weight_identified: true,
  chk_customs_attendance_checked: true,
  chk_unloading_readiness_confirmed: true,
};

export async function recordWeighing(
  job: Pick<DashboardJob, 'id' | 'declaredWeightKg' | 'packages'>,
  actualWeightKg: number,
  userId: string
): Promise<void> {
  const variance = Number((actualWeightKg - job.declaredWeightKg).toFixed(2));
  const triggered = Math.abs(variance) > 5;

  const { error } = await supabase.from('inward_receipts').insert({
    job_id: job.id,
    vehicle_registration: 'KL-01-DEMO-01',
    driver_name: 'Operations Weighing Desk',
    arrival_security_type: 'otl',
    otl_number: `OTL-DEMO-${Date.now()}`,
    otl_condition: 'intact',
    security_passed: true,
    actual_package_count: job.packages,
    actual_gross_weight: actualWeightKg,
    weight_variance: variance,
    weight_escalation_triggered: triggered,
    weight_escalation_reason: triggered
      ? `Actual weight differs from declared reference by ${variance} kg (±5 kg SOP 4.1.8 threshold).`
      : null,
    ...checkpoints,
    verified_by: userId,
  });

  if (error) {
    throw friendlyError(error.message, 'Could not record the weighing.');
  }

  const { error: jobError } = await supabase
    .from('jobs')
    .update({ status: triggered ? 'weight_escalation_hold' : 'binned_and_barcoded' })
    .eq('id', job.id);

  if (jobError) {
    throw friendlyError(jobError.message, 'Weighing saved but the job status did not update.');
  }
}

function reference(prefix: string): string {
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${suffix}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function issueNdc(job: DashboardJob, userId: string): Promise<void> {
  const weight = job.actualWeightKg ?? job.declaredWeightKg;

  const { error } = await supabase.from('removals').insert({
    removal_number: reference('GL-REM'),
    job_id: job.id,
    customer_id: job.customerId,
    type: 'home_consumption',
    requested_package_count: job.packages,
    requested_weight_kg: weight,
    requested_etd: new Date().toISOString(),
    ex_bond_boe_number: `EX-${job.boeNumber}`,
    ex_bond_boe_date: today(),
    ooc_number: reference('OOC'),
    ooc_date: today(),
    duty_payment_challan_ref: reference('CHL'),
    invoice_number: reference('INV'),
    invoice_amount: Math.round(weight * 12 + 2500),
    payment_cleared: true,
    ndc_number: reference('NDC'),
    ndc_issued_by: userId,
    ndc_issued_at: new Date().toISOString(),
    outpass_number: reference('GL-GP'),
    outpass_issued_by: userId,
    outpass_issued_at: new Date().toISOString(),
    status: 'outpass_issued',
  });

  if (error) {
    throw friendlyError(error.message, 'Could not issue the NDC / outpass.');
  }
}

export async function notifyCustoms(jobId: string): Promise<void> {
  const { error } = await supabase
    .from('inward_receipts')
    .update({ weight_escalation_customs_email_sent: new Date().toISOString() })
    .eq('job_id', jobId)
    .eq('weight_escalation_triggered', true);

  if (error) {
    throw friendlyError(error.message, 'Could not record the Customs notification.');
  }
}
