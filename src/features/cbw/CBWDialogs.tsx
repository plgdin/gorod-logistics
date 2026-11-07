import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { CBW_DETAILS } from '../sop/sopData';
import {
  createInwardJob,
  gateOut,
  issueNdc,
  issueOutpass,
  logCustomsNotification,
  recordWeighment,
  requestRemoval,
  resolveWeightEscalation,
  type DashboardJob,
  type RemovalType,
} from '../../lib/jobsApi';
import {
  formatCurrency,
  formatDateTime,
  formatKg,
  toDateTimeLocalValue,
} from '../../lib/format';

const inputClass =
  'w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100';
const labelClass = 'mb-1 block text-xs font-medium text-slate-700';
const primaryButtonClass =
  'inline-flex items-center justify-center rounded bg-[#852929] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#6e2222] disabled:cursor-not-allowed disabled:opacity-60';
const secondaryButtonClass =
  'inline-flex items-center justify-center rounded border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100';

const DialogError: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded border border-red-300 bg-red-50 px-3 py-2 text-[11px] leading-relaxed text-red-900"
    >
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
      <span>{message}</span>
    </div>
  );
};

const DialogNotice: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-start gap-2 rounded border border-emerald-300 bg-emerald-50 px-3 py-2 text-[11px] leading-relaxed text-emerald-900">
    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
    <span>{message}</span>
  </div>
);

const FormActions: React.FC<{
  busy: boolean;
  busyLabel: string;
  submitLabel: string;
  onCancel: () => void;
  disabled?: boolean;
}> = ({ busy, busyLabel, submitLabel, onCancel, disabled }) => (
  <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
    <button type="button" className={secondaryButtonClass} onClick={onCancel}>
      Cancel
    </button>
    <button type="submit" className={primaryButtonClass} disabled={busy || disabled}>
      {busy ? busyLabel : submitLabel}
    </button>
  </div>
);

function errorText(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface JobDialogProps extends DialogProps {
  job: DashboardJob;
}

// ---------------------------------------------------------------------------
// New inward job
// ---------------------------------------------------------------------------

const todayIso = () => new Date().toISOString().slice(0, 10);

export const NewJobDialog: React.FC<DialogProps> = ({ open, onClose, onSaved }) => {
  const [form, setForm] = useState({
    customerName: '',
    iecCode: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    addressLine: '',
    city: 'Thiruvananthapuram',
    boeNumber: '',
    boeDate: todayIso(),
    cargoDesc: '',
    packages: '1',
    declaredWeightKg: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const packages = Number(form.packages);
    const weight = Number(form.declaredWeightKg);
    if (!/^[A-Za-z0-9]{10}$/.test(form.iecCode.trim())) {
      setError('IEC code must be exactly 10 alphanumeric characters.');
      return;
    }
    if (!form.boeDate) {
      setError('BOE filing date is required.');
      return;
    }
    if (!Number.isFinite(packages) || packages <= 0) {
      setError('Package count must be greater than zero.');
      return;
    }
    if (!Number.isFinite(weight) || weight <= 0) {
      setError('Declared gross weight must be greater than zero.');
      return;
    }

    setBusy(true);
    try {
      await createInwardJob({
        customerName: form.customerName,
        iecCode: form.iecCode,
        contactPerson: form.contactPerson,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        addressLine: form.addressLine,
        city: form.city,
        boeNumber: form.boeNumber,
        boeDate: form.boeDate,
        cargoDesc: form.cargoDesc,
        packages,
        declaredWeightKg: weight,
      });
      onSaved('Inward job registered. The 1:1 BOE-to-job record is now open.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not create the job.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register inward consignment"
      description="SOP 4.1.1 — each Bill of Entry maps to exactly one job number."
      width="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-700">
          <strong className="text-slate-900">Statutory rule:</strong> customer and IEC details are
          recorded against the consignment. Do not open a second job for an existing BOE.
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="new-customer">
              Customer / importer name <span className="text-red-500">*</span>
            </label>
            <input
              id="new-customer"
              className={inputClass}
              required
              value={form.customerName}
              onChange={(e) => update('customerName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-iec">
              IEC code <span className="text-red-500">*</span>
            </label>
            <input
              id="new-iec"
              className={`${inputClass} font-mono uppercase`}
              required
              maxLength={10}
              value={form.iecCode}
              onChange={(e) => update('iecCode', e.target.value)}
              placeholder="IEC0801001234"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-contact-person">
              Contact person <span className="text-red-500">*</span>
            </label>
            <input
              id="new-contact-person"
              className={inputClass}
              required
              value={form.contactPerson}
              onChange={(e) => update('contactPerson', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-contact-email">
              Contact email <span className="text-red-500">*</span>
            </label>
            <input
              id="new-contact-email"
              type="email"
              className={inputClass}
              required
              value={form.contactEmail}
              onChange={(e) => update('contactEmail', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-contact-phone">
              Contact phone <span className="text-red-500">*</span>
            </label>
            <input
              id="new-contact-phone"
              className={inputClass}
              required
              value={form.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-city">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="new-city"
              className={inputClass}
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-address">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              id="new-address"
              className={inputClass}
              required
              value={form.addressLine}
              onChange={(e) => update('addressLine', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-boe">
              Into-bond BOE number <span className="text-red-500">*</span>
            </label>
            <input
              id="new-boe"
              className={`${inputClass} font-mono`}
              required
              value={form.boeNumber}
              onChange={(e) => update('boeNumber', e.target.value)}
              placeholder="BOE-9081234"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-boe-date">
              BOE filing date <span className="text-red-500">*</span>
            </label>
            <input
              id="new-boe-date"
              type="date"
              className={inputClass}
              required
              value={form.boeDate}
              onChange={(e) => update('boeDate', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="new-cargo">
              Cargo description <span className="text-red-500">*</span>
            </label>
            <input
              id="new-cargo"
              className={inputClass}
              required
              value={form.cargoDesc}
              onChange={(e) => update('cargoDesc', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-packages">
              Declared package count <span className="text-red-500">*</span>
            </label>
            <input
              id="new-packages"
              type="number"
              min={1}
              className={inputClass}
              required
              value={form.packages}
              onChange={(e) => update('packages', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="new-weight">
              Declared gross weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="new-weight"
              type="number"
              min={0.01}
              step="0.01"
              className={`${inputClass} font-mono`}
              required
              value={form.declaredWeightKg}
              onChange={(e) => update('declaredWeightKg', e.target.value)}
            />
          </div>
        </div>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Registering…"
          submitLabel="Open job record"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Weighment
// ---------------------------------------------------------------------------

const CHECKPOINT_LABELS: Array<{
  key: keyof Checkpoints;
  label: string;
}> = [
  { key: 'chk_job_docs_matched', label: 'Job documents matched' },
  { key: 'chk_vehicle_photo_recorded', label: 'Vehicle photo recorded' },
  { key: 'chk_otl_escort_verified', label: 'OTL / Customs escort verified' },
  { key: 'chk_cargo_desc_matched', label: 'Cargo description matched' },
  { key: 'chk_package_count_checked', label: 'Package count checked' },
  { key: 'chk_cargo_condition_checked', label: 'Cargo condition checked' },
  { key: 'chk_weight_identified', label: 'Weight identified on scale' },
  { key: 'chk_customs_attendance_checked', label: 'Customs attendance checked' },
  { key: 'chk_unloading_readiness_confirmed', label: 'Unloading readiness confirmed' },
];

type Checkpoints = {
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

const EMPTY_CHECKPOINTS: Checkpoints = {
  chk_job_docs_matched: false,
  chk_vehicle_photo_recorded: false,
  chk_otl_escort_verified: false,
  chk_cargo_desc_matched: false,
  chk_package_count_checked: false,
  chk_cargo_condition_checked: false,
  chk_weight_identified: false,
  chk_customs_attendance_checked: false,
  chk_unloading_readiness_confirmed: false,
};

export const WeighmentDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [actualWeight, setActualWeight] = useState('');
  const [actualPackages, setActualPackages] = useState(String(job.packages));
  const [vehicleRegistration, setVehicleRegistration] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [securityType, setSecurityType] = useState<'otl' | 'customs_escort'>('otl');
  const [otlNumber, setOtlNumber] = useState('');
  const [otlCondition, setOtlCondition] = useState<
    'intact' | 'broken' | 'tampered' | 'missing' | 'inconsistent'
  >('intact');
  const [escortName, setEscortName] = useState('');
  const [escortDesignation, setEscortDesignation] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [checkpoints, setCheckpoints] = useState<Checkpoints>({ ...EMPTY_CHECKPOINTS });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCheckpoint = (key: keyof Checkpoints) =>
    setCheckpoints((previous) => ({ ...previous, [key]: !previous[key] }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const weight = Number(actualWeight);
    const packages = Number(actualPackages);
    if (!Number.isFinite(weight) || weight <= 0) {
      setError('Enter the actual weighbridge weight in kilograms.');
      return;
    }
    if (!Number.isFinite(packages) || packages <= 0) {
      setError('Actual package count must be greater than zero.');
      return;
    }
    if (!vehicleRegistration.trim() || !driverName.trim()) {
      setError('Vehicle registration and driver name are required.');
      return;
    }
    if (securityType === 'otl') {
      if (!otlNumber.trim()) {
        setError('OTL number is required for an OTL arrival.');
        return;
      }
      if (otlCondition !== 'intact') {
        setError('A non-intact OTL must be escalated to Customs before weighment.');
        return;
      }
    } else if (!escortName.trim() || !escortDesignation.trim()) {
      setError('Customs escort name and designation are required.');
      return;
    }
    if (!Object.values(checkpoints).every(Boolean)) {
      setError('Complete all nine pre-unloading checks before recording the weighment.');
      return;
    }

    setBusy(true);
    try {
      await recordWeighment({
        jobId: job.id,
        actualWeightKg: weight,
        actualPackageCount: packages,
        vehicleRegistration,
        driverName,
        driverLicense,
        arrivalSecurityType: securityType,
        otlNumber: securityType === 'otl' ? otlNumber : undefined,
        otlCondition: securityType === 'otl' ? otlCondition : undefined,
        customsEscortName: securityType === 'customs_escort' ? escortName : undefined,
        customsEscortDesignation:
          securityType === 'customs_escort' ? escortDesignation : undefined,
        cargoConditionNotes: conditionNotes,
        checkpoints,
      });
      onSaved('Weighment recorded on the inward receipt.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not record the weighment.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record weighbridge weighment"
      description={`SOP 4.1.7–4.1.8 — declared weight ${formatKg(
        job.declaredWeightKg
      )}; statutory tolerance ±${CBW_DETAILS.weightThresholdKg} kg.`}
      width="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="weigh-actual">
              Actual gross weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="weigh-actual"
              type="number"
              min={0.01}
              step="0.01"
              className={`${inputClass} font-mono`}
              required
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="weigh-packages">
              Actual package count <span className="text-red-500">*</span>
            </label>
            <input
              id="weigh-packages"
              type="number"
              min={1}
              className={inputClass}
              required
              value={actualPackages}
              onChange={(e) => setActualPackages(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="weigh-vehicle">
              Vehicle registration <span className="text-red-500">*</span>
            </label>
            <input
              id="weigh-vehicle"
              className={`${inputClass} font-mono uppercase`}
              required
              value={vehicleRegistration}
              onChange={(e) => setVehicleRegistration(e.target.value)}
              placeholder="KL-01-AB-1234"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="weigh-driver">
              Driver name <span className="text-red-500">*</span>
            </label>
            <input
              id="weigh-driver"
              className={inputClass}
              required
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="weigh-license">
              Driver licence (optional)
            </label>
            <input
              id="weigh-license"
              className={inputClass}
              value={driverLicense}
              onChange={(e) => setDriverLicense(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="weigh-security">
              Arrival security <span className="text-red-500">*</span>
            </label>
            <select
              id="weigh-security"
              className={inputClass}
              value={securityType}
              onChange={(e) =>
                setSecurityType(e.target.value as 'otl' | 'customs_escort')
              }
            >
              <option value="otl">OTL seal</option>
              <option value="customs_escort">Customs escort</option>
            </select>
          </div>

          {securityType === 'otl' ? (
            <>
              <div>
                <label className={labelClass} htmlFor="weigh-otl">
                  OTL number <span className="text-red-500">*</span>
                </label>
                <input
                  id="weigh-otl"
                  className={`${inputClass} font-mono`}
                  required
                  value={otlNumber}
                  onChange={(e) => setOtlNumber(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="weigh-otl-condition">
                  OTL condition <span className="text-red-500">*</span>
                </label>
                <select
                  id="weigh-otl-condition"
                  className={inputClass}
                  value={otlCondition}
                  onChange={(e) =>
                    setOtlCondition(
                      e.target.value as
                        | 'intact'
                        | 'broken'
                        | 'tampered'
                        | 'missing'
                        | 'inconsistent'
                    )
                  }
                >
                  <option value="intact">Intact</option>
                  <option value="broken">Broken</option>
                  <option value="tampered">Tampered</option>
                  <option value="missing">Missing</option>
                  <option value="inconsistent">Inconsistent</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelClass} htmlFor="weigh-escort-name">
                  Escort name <span className="text-red-500">*</span>
                </label>
                <input
                  id="weigh-escort-name"
                  className={inputClass}
                  required
                  value={escortName}
                  onChange={(e) => setEscortName(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="weigh-escort-designation">
                  Escort designation <span className="text-red-500">*</span>
                </label>
                <input
                  id="weigh-escort-designation"
                  className={inputClass}
                  required
                  value={escortDesignation}
                  onChange={(e) => setEscortDesignation(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="weigh-notes">
              Cargo condition notes (optional)
            </label>
            <textarea
              id="weigh-notes"
              className={inputClass}
              rows={2}
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
            />
          </div>
        </div>

        <fieldset className="rounded border border-slate-200 p-3">
          <legend className="px-1 text-[11px] font-semibold text-slate-700">
            Nine-point pre-unloading checklist <span className="text-red-500">*</span>
          </legend>
          <div className="mt-1 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {CHECKPOINT_LABELS.map((checkpoint) => (
              <label
                key={checkpoint.key}
                className="flex items-start gap-2 text-[11px] text-slate-700"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300"
                  checked={checkpoints[checkpoint.key]}
                  onChange={() => toggleCheckpoint(checkpoint.key)}
                />
                <span>{checkpoint.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Recording…"
          submitLabel="Record weighment"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Removal request
// ---------------------------------------------------------------------------

export const RemovalDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [type, setType] = useState<RemovalType>('home_consumption');
  const [packages, setPackages] = useState(
    String(job.actualPackageCount ?? job.packages)
  );
  const [weight, setWeight] = useState(
    String(job.actualWeightKg ?? job.declaredWeightKg)
  );
  const [etd, setEtd] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(10, 0, 0, 0);
    return toDateTimeLocalValue(date);
  });

  const [exBondBoeNumber, setExBondBoeNumber] = useState('');
  const [exBondBoeDate, setExBondBoeDate] = useState(todayIso());
  const [oocNumber, setOocNumber] = useState('');
  const [oocDate, setOocDate] = useState(todayIso());
  const [dutyChallan, setDutyChallan] = useState('');

  const [shippingBillNumber, setShippingBillNumber] = useState('');
  const [shippingBillDate, setShippingBillDate] = useState(todayIso());
  const [leoNumber, setLeoNumber] = useState('');
  const [leoDate, setLeoDate] = useState(todayIso());
  const [section69Ref, setSection69Ref] = useState('');

  const [formANumber, setFormANumber] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [transferPermission, setTransferPermission] = useState('');

  const [outwardOtl, setOutwardOtl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const packageCount = Number(packages);
    const weightKg = Number(weight);
    const etdDate = new Date(etd);
    if (!Number.isFinite(packageCount) || packageCount <= 0) {
      setError('Requested package count must be greater than zero.');
      return;
    }
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      setError('Requested weight must be greater than zero.');
      return;
    }
    if (Number.isNaN(etdDate.getTime()) || etdDate.getTime() <= Date.now()) {
      setError('Requested ETD must be in the future.');
      return;
    }

    if (type === 'home_consumption') {
      if (!exBondBoeNumber.trim() || !oocNumber.trim() || !dutyChallan.trim()) {
        setError('Ex-bond BOE, OOC number and duty payment challan are required.');
        return;
      }
    }
    if (type === 're_export') {
      if (
        !shippingBillNumber.trim() ||
        !leoNumber.trim() ||
        !section69Ref.trim() ||
        !outwardOtl.trim()
      ) {
        setError('Shipping bill, LEO, Section 69 order and outward OTL are required.');
        return;
      }
    }
    if (type === 'warehouse_transfer') {
      if (
        !formANumber.trim() ||
        !destinationCode.trim() ||
        !destinationName.trim() ||
        !transferPermission.trim() ||
        !outwardOtl.trim()
      ) {
        setError(
          'Form A, destination warehouse details, transfer permission and outward OTL are required.'
        );
        return;
      }
    }

    setBusy(true);
    try {
      await requestRemoval({
        jobId: job.id,
        type,
        requestedPackageCount: packageCount,
        requestedWeightKg: weightKg,
        requestedEtd: etdDate.toISOString(),
        exBondBoeNumber: type === 'home_consumption' ? exBondBoeNumber : undefined,
        exBondBoeDate: type === 'home_consumption' ? exBondBoeDate : undefined,
        oocNumber: type === 'home_consumption' ? oocNumber : undefined,
        oocDate: type === 'home_consumption' ? oocDate : undefined,
        dutyPaymentChallanRef: type === 'home_consumption' ? dutyChallan : undefined,
        shippingBillNumber: type === 're_export' ? shippingBillNumber : undefined,
        shippingBillDate: type === 're_export' ? shippingBillDate : undefined,
        leoNumber: type === 're_export' ? leoNumber : undefined,
        leoDate: type === 're_export' ? leoDate : undefined,
        section69OrderRef: type === 're_export' ? section69Ref : undefined,
        formANumber: type === 'warehouse_transfer' ? formANumber : undefined,
        destinationWarehouseCode:
          type === 'warehouse_transfer' ? destinationCode : undefined,
        destinationWarehouseName:
          type === 'warehouse_transfer' ? destinationName : undefined,
        customsTransferPermissionRef:
          type === 'warehouse_transfer' ? transferPermission : undefined,
        outwardOtlNumber:
          type === 're_export' || type === 'warehouse_transfer'
            ? outwardOtl
            : undefined,
      });
      onSaved('Removal request recorded with the statutory documents.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not request the removal.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request outward removal"
      description="SOP 4.2.1–4.2.3 — the removal cannot be released until the accounts NDC and outpass are issued."
      width="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="removal-type">
              Removal type <span className="text-red-500">*</span>
            </label>
            <select
              id="removal-type"
              className={inputClass}
              value={type}
              onChange={(e) => setType(e.target.value as RemovalType)}
            >
              <option value="home_consumption">Home consumption (Sec 68)</option>
              <option value="re_export">Re-export (Sec 69)</option>
              <option value="warehouse_transfer">Warehouse transfer (Sec 67)</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="removal-etd">
              Requested ETD <span className="text-red-500">*</span>
            </label>
            <input
              id="removal-etd"
              type="datetime-local"
              className={inputClass}
              required
              value={etd}
              onChange={(e) => setEtd(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="removal-packages">
              Requested packages <span className="text-red-500">*</span>
            </label>
            <input
              id="removal-packages"
              type="number"
              min={1}
              className={inputClass}
              required
              value={packages}
              onChange={(e) => setPackages(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="removal-weight">
              Requested weight (kg) <span className="text-red-500">*</span>
            </label>
            <input
              id="removal-weight"
              type="number"
              min={0.01}
              step="0.01"
              className={`${inputClass} font-mono`}
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {type === 'home_consumption' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="removal-exbond">
                Ex-bond BOE number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-exbond"
                className={`${inputClass} font-mono`}
                required
                value={exBondBoeNumber}
                onChange={(e) => setExBondBoeNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-exbond-date">
                Ex-bond BOE date <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-exbond-date"
                type="date"
                className={inputClass}
                required
                value={exBondBoeDate}
                onChange={(e) => setExBondBoeDate(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-ooc">
                OOC number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-ooc"
                className={`${inputClass} font-mono`}
                required
                value={oocNumber}
                onChange={(e) => setOocNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-ooc-date">
                OOC date <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-ooc-date"
                type="date"
                className={inputClass}
                required
                value={oocDate}
                onChange={(e) => setOocDate(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="removal-challan">
                Duty payment challan reference <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-challan"
                className={`${inputClass} font-mono`}
                required
                value={dutyChallan}
                onChange={(e) => setDutyChallan(e.target.value)}
              />
            </div>
          </div>
        )}

        {type === 're_export' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="removal-sb">
                Shipping bill number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-sb"
                className={`${inputClass} font-mono`}
                required
                value={shippingBillNumber}
                onChange={(e) => setShippingBillNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-sb-date">
                Shipping bill date <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-sb-date"
                type="date"
                className={inputClass}
                required
                value={shippingBillDate}
                onChange={(e) => setShippingBillDate(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-leo">
                LEO number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-leo"
                className={`${inputClass} font-mono`}
                required
                value={leoNumber}
                onChange={(e) => setLeoNumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-leo-date">
                LEO date <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-leo-date"
                type="date"
                className={inputClass}
                required
                value={leoDate}
                onChange={(e) => setLeoDate(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-s69">
                Section 69 order reference <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-s69"
                className={`${inputClass} font-mono`}
                required
                value={section69Ref}
                onChange={(e) => setSection69Ref(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-otl-export">
                Outward OTL number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-otl-export"
                className={`${inputClass} font-mono`}
                required
                value={outwardOtl}
                onChange={(e) => setOutwardOtl(e.target.value)}
              />
            </div>
          </div>
        )}

        {type === 'warehouse_transfer' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="removal-forma">
                Form A number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-forma"
                className={`${inputClass} font-mono`}
                required
                value={formANumber}
                onChange={(e) => setFormANumber(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-dest-code">
                Destination warehouse code <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-dest-code"
                className={`${inputClass} font-mono uppercase`}
                required
                value={destinationCode}
                onChange={(e) => setDestinationCode(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-dest-name">
                Destination warehouse name <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-dest-name"
                className={inputClass}
                required
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="removal-transfer-permission">
                Customs transfer permission <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-transfer-permission"
                className={`${inputClass} font-mono`}
                required
                value={transferPermission}
                onChange={(e) => setTransferPermission(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="removal-otl-transfer">
                Outward OTL number <span className="text-red-500">*</span>
              </label>
              <input
                id="removal-otl-transfer"
                className={`${inputClass} font-mono`}
                required
                value={outwardOtl}
                onChange={(e) => setOutwardOtl(e.target.value)}
              />
            </div>
          </div>
        )}

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Submitting…"
          submitLabel="Submit removal request"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// NDC
// ---------------------------------------------------------------------------

export const NdcDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!job.removalId) {
      setError('No removal request is linked to this job.');
      return;
    }
    const amount = Number(invoiceAmount);
    if (!invoiceNumber.trim()) {
      setError('Invoice number is required.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Invoice amount must be greater than zero.');
      return;
    }
    if (!paymentVerified) {
      setError('Confirm that the payment has been received and verified.');
      return;
    }

    setBusy(true);
    try {
      await issueNdc({
        removalId: job.removalId,
        invoiceNumber,
        invoiceAmount: amount,
      });
      onSaved('No-Due Certificate issued. The outpass can now be released.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not issue the NDC.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Issue No-Due Certificate"
      description={`SOP 4.2.6 — accounts clearance for ${job.removalNumber || 'the removal'} (${formatKg(
        job.requestedWeightKg
      )}).`}
      width="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <DialogNotice
          message="The NDC is issued only after the commercial invoice is raised and the payment is received and reconciled."
        />
        <div>
          <label className={labelClass} htmlFor="ndc-invoice">
            Invoice number <span className="text-red-500">*</span>
          </label>
          <input
            id="ndc-invoice"
            className={`${inputClass} font-mono`}
            required
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="ndc-amount">
            Invoice amount (INR) <span className="text-red-500">*</span>
          </label>
          <input
            id="ndc-amount"
            type="number"
            min={0.01}
            step="0.01"
            className={`${inputClass} font-mono`}
            required
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(e.target.value)}
          />
        </div>
        <label className="flex items-start gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300"
            checked={paymentVerified}
            onChange={(e) => setPaymentVerified(e.target.checked)}
          />
          <span>
            I confirm the customer payment has been received, reconciled and the invoice amount
            is correct.
          </span>
        </label>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Issuing NDC…"
          submitLabel="Issue NDC"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Outpass
// ---------------------------------------------------------------------------

export const OutpassDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!job.removalId) {
      setError('No removal request is linked to this job.');
      return;
    }
    setBusy(true);
    try {
      await issueOutpass(job.removalId);
      onSaved('Outpass issued. Security can now record the gate-out.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not issue the outpass.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Issue outpass gate pass"
      description="SOP 4.2.8 — the outpass unlocks physical release of the consignment."
      width="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3 rounded border border-slate-200 bg-slate-50 p-3">
          <div>
            <span className="text-[11px] text-slate-500">Removal</span>
            <div className="font-mono font-medium text-slate-900">
              {job.removalNumber || '—'}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500">NDC</span>
            <div className="font-mono font-medium text-slate-900">{job.ndcNumber || '—'}</div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500">Invoice</span>
            <div className="font-mono font-medium text-slate-900">
              {job.invoiceNumber || '—'} · {formatCurrency(job.invoiceAmount)}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500">Requested weight</span>
            <div className="font-mono font-medium text-slate-900">
              {formatKg(job.requestedWeightKg)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Confirm the original Customs documents and the physical cargo are present before
            issuing the gate pass.
          </span>
        </div>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Issuing outpass…"
          submitLabel="Issue outpass"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Gate out
// ---------------------------------------------------------------------------

export const GateOutDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [otlSeal, setOtlSeal] = useState('');
  const [customsAuthReference, setCustomsAuthReference] = useState('');
  const [gorodSignature, setGorodSignature] = useState('');
  const [driverSignature, setDriverSignature] = useState('');
  const [customsSignature, setCustomsSignature] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!job.removalId) {
      setError('No removal request is linked to this job.');
      return;
    }
    if (!vehicleNumber.trim() || !driverName.trim()) {
      setError('Vehicle registration and driver name are required.');
      return;
    }
    if (!customsAuthReference.trim()) {
      setError('Customs authorisation reference is required.');
      return;
    }
    if (!gorodSignature.trim() || !driverSignature.trim()) {
      setError('Both Gorod and driver signatures must be recorded.');
      return;
    }
    if (
      (job.removalType === 're_export' || job.removalType === 'warehouse_transfer') &&
      !otlSeal.trim()
    ) {
      setError('An outward OTL seal number is mandatory for this removal type.');
      return;
    }

    setBusy(true);
    try {
      await gateOut({
        removalId: job.removalId,
        vehicleNumber,
        driverName,
        otlSealNumber: otlSeal,
        customsAuthReference,
        gorodRepresentativeSignature: gorodSignature,
        driverSignature,
        customsInspectorSignature: customsSignature,
      });
      onSaved('Gate-out recorded. The removal is now closed.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not record the gate-out.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record gate-out"
      description="SOP 4.2.9 — security verifies the outpass and writes the outward gate register."
      width="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <DialogNotice
          message={`Outpass ${job.outpassNumber || '—'} verified. Record the physical vehicle, driver and Customs authorisation details.`}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="gate-vehicle">
              Vehicle registration <span className="text-red-500">*</span>
            </label>
            <input
              id="gate-vehicle"
              className={`${inputClass} font-mono uppercase`}
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="gate-driver">
              Driver name <span className="text-red-500">*</span>
            </label>
            <input
              id="gate-driver"
              className={inputClass}
              required
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="gate-otl">
              Outward OTL seal number
              {(job.removalType === 're_export' ||
                job.removalType === 'warehouse_transfer') && (
                <span className="text-red-500"> *</span>
              )}
            </label>
            <input
              id="gate-otl"
              className={`${inputClass} font-mono`}
              value={otlSeal}
              onChange={(e) => setOtlSeal(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="gate-customs-auth">
              Customs authorisation reference <span className="text-red-500">*</span>
            </label>
            <input
              id="gate-customs-auth"
              className={`${inputClass} font-mono`}
              required
              value={customsAuthReference}
              onChange={(e) => setCustomsAuthReference(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="gate-gorod-sign">
              Gorod representative signature <span className="text-red-500">*</span>
            </label>
            <input
              id="gate-gorod-sign"
              className={inputClass}
              required
              value={gorodSignature}
              onChange={(e) => setGorodSignature(e.target.value)}
              placeholder="Name of authorised signatory"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="gate-driver-sign">
              Driver signature <span className="text-red-500">*</span>
            </label>
            <input
              id="gate-driver-sign"
              className={inputClass}
              required
              value={driverSignature}
              onChange={(e) => setDriverSignature(e.target.value)}
              placeholder="Driver name"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="gate-customs-sign">
              Customs inspector signature (if present)
            </label>
            <input
              id="gate-customs-sign"
              className={inputClass}
              value={customsSignature}
              onChange={(e) => setCustomsSignature(e.target.value)}
            />
          </div>
        </div>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Recording gate-out…"
          submitLabel="Record gate-out"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Customs notification
// ---------------------------------------------------------------------------

export const CustomsNoticeDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [notifiedTo, setNotifiedTo] = useState('');
  const [reference, setReference] = useState('');
  const [sentConfirmed, setSentConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!job.receiptId) {
      setError('No inward receipt is linked to this job.');
      return;
    }
    if (!notifiedTo.trim() || !reference.trim()) {
      setError('Recipient and notification reference are required.');
      return;
    }
    if (!sentConfirmed) {
      setError('Confirm that the official notification has been sent.');
      return;
    }

    setBusy(true);
    try {
      await logCustomsNotification({
        receiptId: job.receiptId,
        reference,
        notifiedTo,
      });
      onSaved('Customs notification recorded against the escalation.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not record the notification.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log Customs notification"
      description={`SOP 4.1.8 — ${job.jobNumber} is on statutory hold with a ${formatKg(
        job.weightVarianceKg
      )} variance.`}
      width="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div className="flex items-start gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-900">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Send the notification through the official Customs channel first. This form records
            the dispatch evidence; it does not send the email itself.
          </span>
        </div>
        <div>
          <label className={labelClass} htmlFor="notice-to">
            Notified officer / email <span className="text-red-500">*</span>
          </label>
          <input
            id="notice-to"
            className={inputClass}
            required
            value={notifiedTo}
            onChange={(e) => setNotifiedTo(e.target.value)}
            placeholder="bond.officer@customs.gov.in"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="notice-ref">
            Notification reference <span className="text-red-500">*</span>
          </label>
          <input
            id="notice-ref"
            className={`${inputClass} font-mono`}
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Email subject / dispatch reference"
          />
        </div>
        <label className="flex items-start gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300"
            checked={sentConfirmed}
            onChange={(e) => setSentConfirmed(e.target.checked)}
          />
          <span>I confirm the official notification was dispatched to the Customs Bond Officer.</span>
        </label>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Recording…"
          submitLabel="Record notification"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Resolve hold
// ---------------------------------------------------------------------------

export const ResolveHoldDialog: React.FC<JobDialogProps> = ({
  open,
  job,
  onClose,
  onSaved,
}) => {
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!job.receiptId) {
      setError('No inward receipt is linked to this job.');
      return;
    }
    if (!reference.trim()) {
      setError('Resolution reference is required.');
      return;
    }

    setBusy(true);
    try {
      await resolveWeightEscalation({
        receiptId: job.receiptId,
        resolutionReference: reference,
        notes,
      });
      onSaved('Weight hold resolved and the job returned to normal custody.');
    } catch (submitError) {
      setError(errorText(submitError, 'Could not resolve the hold.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resolve weight escalation"
      description={`SOP 4.1.8 — record the Customs disposition for ${job.jobNumber}.`}
      width="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        {job.escalationNotifiedAt && (
          <DialogNotice
            message={`Customs notification logged ${formatDateTime(
              job.escalationNotifiedAt
            )}.`}
          />
        )}
        <div>
          <label className={labelClass} htmlFor="resolve-ref">
            Customs resolution / order reference <span className="text-red-500">*</span>
          </label>
          <input
            id="resolve-ref"
            className={`${inputClass} font-mono`}
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="resolve-notes">
            Disposition notes (optional)
          </label>
          <textarea
            id="resolve-notes"
            className={inputClass}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <DialogError message={error} />
        <FormActions
          busy={busy}
          busyLabel="Resolving…"
          submitLabel="Resolve hold"
          onCancel={onClose}
        />
      </form>
    </Modal>
  );
};
