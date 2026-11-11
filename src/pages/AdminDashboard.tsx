import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  LogOut,
  PlusCircle,
  RefreshCw,
  Search,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { CBW_DETAILS, SOP_ROLES, SOPRole } from '../features/sop/sopData';
import { SEO } from '../components/ui/SEO';
import {
  fetchDashboardJobs,
  fetchWeighingThresholdKg,
  type DashboardJob,
  type JobStatus,
} from '../lib/jobsApi';
import { checkSupabaseHealth, type DbHealth } from '../lib/supabase';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatKg,
  formatSignedKg,
} from '../lib/format';
import {
  CustomsNoticeDialog,
  GateOutDialog,
  NdcDialog,
  NewJobDialog,
  OutpassDialog,
  OutwardWeighmentDialog,
  RemovalDialog,
  ResolveHoldDialog,
  ReweighDialog,
  WeighmentDialog,
} from '../features/cbw/CBWDialogs';
import { JobWeighingHistory } from '../features/weighing/JobWeighingHistory';
import { WeighingReportsTab } from '../features/weighing/WeighingReportsTab';

type ActiveTab =
  | 'all_jobs'
  | 'awaiting'
  | 'holds'
  | 'removals'
  | 'outpass'
  | 'weighing_reports'
  | 'roles';

type DialogState =
  | { kind: 'new_job' }
  | { kind: 'weighment'; job: DashboardJob }
  | { kind: 'reweigh'; job: DashboardJob }
  | { kind: 'outward_weigh'; job: DashboardJob }
  | { kind: 'removal'; job: DashboardJob }
  | { kind: 'ndc'; job: DashboardJob }
  | { kind: 'outpass'; job: DashboardJob }
  | { kind: 'gate_out'; job: DashboardJob }
  | { kind: 'customs_notice'; job: DashboardJob }
  | { kind: 'resolve_hold'; job: DashboardJob };

type ActionTone = 'amber' | 'navy' | 'crimson' | 'emerald' | 'slate';

const TONE_CLASSES: Record<ActionTone, string> = {
  amber: 'bg-amber-700 text-white hover:bg-amber-800',
  navy: 'bg-[#0c323b] text-white hover:bg-[#154652]',
  crimson: 'bg-[#852929] text-white hover:bg-[#6e2222]',
  emerald: 'bg-emerald-700 text-white hover:bg-emerald-800',
  slate: 'border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200',
};

const ActionButton: React.FC<{
  label: string;
  tone?: ActionTone;
  onClick: () => void;
}> = ({ label, tone = 'slate', onClick }) => (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${TONE_CLASSES[tone]}`}
  >
    {label}
  </button>
);

const StatusBadge: React.FC<{ status: JobStatus }> = ({ status }) => {
  let className = 'border-slate-200 bg-slate-100 text-slate-700';
  let icon: React.ReactNode = null;

  if (status === 'Weight Escalated') {
    className = 'border-amber-300 bg-amber-50 text-amber-800';
    icon = <AlertTriangle className="h-3 w-3 text-amber-600" />;
  } else if (status === 'Gate Out Closed') {
    className = 'border-emerald-300 bg-emerald-50 text-emerald-800';
    icon = <CheckCircle2 className="h-3 w-3 text-emerald-600" />;
  } else if (status === 'Outpass Issued') {
    className = 'border-blue-300 bg-blue-50 text-blue-800';
    icon = <FileText className="h-3 w-3 text-blue-600" />;
  } else if (status === 'NDC Cleared') {
    className = 'border-emerald-300 bg-emerald-50 text-emerald-800';
    icon = <CheckCircle2 className="h-3 w-3 text-emerald-600" />;
  } else if (status === 'Removal Requested') {
    className = 'border-indigo-200 bg-indigo-50 text-indigo-800';
    icon = <Clock className="h-3 w-3 text-indigo-600" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11px] font-medium ${className}`}
    >
      {icon}
      <span>{status}</span>
    </span>
  );
};

export const AdminDashboard: React.FC = () => {
  const { currentUser, currentRole, logout, authMode, session, isSupabaseConfigured } =
    useAuth();
  const navigate = useNavigate();

  const isLive = authMode === 'supabase' && Boolean(session) && isSupabaseConfigured;

  const [jobs, setJobs] = useState<DashboardJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all_jobs');
  const [loadingJobs, setLoadingJobs] = useState<boolean>(isLive);
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<DashboardJob | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [thresholdKg, setThresholdKg] = useState<number>(CBW_DETAILS.weightThresholdKg);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const loadLiveJobs = useCallback(async () => {
    if (!isLive) {
      setJobs([]);
      setLoadingJobs(false);
      return;
    }

    setLoadingJobs(true);
    setSyncError(null);
    try {
      const [rows, health, configuredThreshold] = await Promise.all([
        fetchDashboardJobs(),
        checkSupabaseHealth(),
        fetchWeighingThresholdKg(),
      ]);
      setJobs(rows);
      setDbHealth(health);
      setThresholdKg(configuredThreshold);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Could not sync with Supabase.');
    } finally {
      setLoadingJobs(false);
    }
  }, [isLive]);

  useEffect(() => {
    void loadLiveJobs();
  }, [loadLiveJobs]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!selectedJob) return;
    const fresh = jobs.find((job) => job.id === selectedJob.id);
    if (fresh) setSelectedJob(fresh);
    // Only react to the job list refreshing, not to selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  useEffect(() => {
    if (!selectedJob) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedJob(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedJob]);

  const handleSaved = useCallback(
    async (message: string) => {
      setDialog(null);
      setNotice(message);
      await loadLiveJobs();
    },
    [loadLiveJobs]
  );

  const roleMeta: SOPRole | undefined =
    SOP_ROLES.find((role) => role.id === currentRole) ||
    SOP_ROLES.find((role) => role.id === 'warehouse_keeper');

  const canRegister = currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance';
  const canWeigh =
    currentRole === 'warehouse_manager' ||
    currentRole === 'admin_compliance' ||
    currentRole === 'warehouse_keeper';
  const canNotify = currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance';
  const canResolve = currentRole === 'warehouse_keeper' || currentRole === 'customs_bond_officer';
  const canRequestRemoval =
    currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance';
  const canIssueNdc = currentRole === 'accounts_team';
  const canIssueOutpass =
    currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance';
  const canGateOut = currentRole === 'security_team';

  const awaitingCount = jobs.filter((job) => job.actualWeightKg == null).length;
  const holdCount = jobs.filter(
    (job) => job.escalationTriggered && !job.escalationResolved
  ).length;
  const removalPendingCount = jobs.filter(
    (job) =>
      job.actualWeightKg != null &&
      !job.escalationTriggered &&
      !job.ndcNumber &&
      !job.outpassNumber
  ).length;
  const outpassCount = jobs.filter(
    (job) => Boolean(job.ndcNumber) || Boolean(job.outpassNumber)
  ).length;
  const activeEscalationJob = jobs.find(
    (job) => job.escalationTriggered && !job.escalationResolved
  );

  const filteredJobs = jobs.filter((job) => {
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matches =
        job.jobNumber.toLowerCase().includes(query) ||
        job.boeNumber.toLowerCase().includes(query) ||
        job.customerName.toLowerCase().includes(query) ||
        job.cargoDesc.toLowerCase().includes(query) ||
        (job.removalNumber || '').toLowerCase().includes(query) ||
        (job.outpassNumber || '').toLowerCase().includes(query);
      if (!matches) return false;
    }

    if (activeTab === 'awaiting') return job.actualWeightKg == null;
    if (activeTab === 'holds') return job.escalationTriggered && !job.escalationResolved;
    if (activeTab === 'removals') {
      return (
        job.actualWeightKg != null &&
        !job.escalationTriggered &&
        !job.ndcNumber &&
        !job.outpassNumber
      );
    }
    if (activeTab === 'outpass') return Boolean(job.ndcNumber) || Boolean(job.outpassNumber);
    return true;
  });

  const tabs: Array<{
    id: ActiveTab;
    label: string;
    count?: number;
    alert?: boolean;
  }> = [
    { id: 'all_jobs', label: 'All Consignments', count: jobs.length },
    {
      id: 'awaiting',
      label: 'Awaiting Weighment',
      count: awaitingCount,
    },
    {
      id: 'holds',
      label: 'Weight Holds',
      count: holdCount,
      alert: holdCount > 0,
    },
    { id: 'removals', label: 'Removal / NDC', count: removalPendingCount },
    { id: 'outpass', label: 'Outpass / Gate Out', count: outpassCount },
    { id: 'weighing_reports', label: 'Weighing Audit' },
    { id: 'roles', label: 'Role Authority Matrix (SOP Sec 3)' },
  ];

  const rowActions = (job: DashboardJob): Array<{
    label: string;
    tone: ActionTone;
    onClick: () => void;
  }> => {
    const actions: Array<{ label: string; tone: ActionTone; onClick: () => void }> = [];

    if (canWeigh && job.actualWeightKg == null) {
      actions.push({
        label: 'Record Weighment',
        tone: 'amber',
        onClick: () => setDialog({ kind: 'weighment', job }),
      });
    }
    if (
      canWeigh &&
      job.actualWeightKg != null &&
      job.receiptId &&
      job.removalStatus !== 'gate_exited' &&
      job.removalStatus !== 'removal_closed'
    ) {
      actions.push({
        label: 'Reweigh',
        tone: 'slate',
        onClick: () => setDialog({ kind: 'reweigh', job }),
      });
    }
    if (
      canWeigh &&
      job.removalId &&
      job.removalStatus !== 'gate_exited' &&
      job.removalStatus !== 'removal_closed'
    ) {
      actions.push({
        label: job.deliveryZoneVerifiedAt ? 'Reweigh Delivery' : 'Weigh Delivery',
        tone: 'amber',
        onClick: () => setDialog({ kind: 'outward_weigh', job }),
      });
    }
    if (canNotify && job.escalationTriggered && !job.escalationResolved && !job.escalationNotifiedAt) {
      actions.push({
        label: 'Log Customs Notice',
        tone: 'crimson',
        onClick: () => setDialog({ kind: 'customs_notice', job }),
      });
    }
    if (canResolve && job.escalationTriggered && !job.escalationResolved) {
      actions.push({
        label: 'Resolve Hold',
        tone: 'emerald',
        onClick: () => setDialog({ kind: 'resolve_hold', job }),
      });
    }
    if (
      canRequestRemoval &&
      job.actualWeightKg != null &&
      !job.escalationTriggered &&
      !job.removalId
    ) {
      actions.push({
        label: 'Request Removal',
        tone: 'navy',
        onClick: () => setDialog({ kind: 'removal', job }),
      });
    }
    if (canIssueNdc && job.removalId && !job.ndcNumber) {
      actions.push({
        label: 'Issue NDC',
        tone: 'navy',
        onClick: () => setDialog({ kind: 'ndc', job }),
      });
    }
    if (canIssueOutpass && job.ndcNumber && !job.outpassNumber) {
      actions.push({
        label: 'Issue Outpass',
        tone: 'crimson',
        onClick: () => setDialog({ kind: 'outpass', job }),
      });
    }
    if (
      canGateOut &&
      job.outpassNumber &&
      job.removalStatus !== 'gate_exited' &&
      job.removalStatus !== 'removal_closed'
    ) {
      actions.push({
        label: 'Gate Out',
        tone: 'emerald',
        onClick: () => setDialog({ kind: 'gate_out', job }),
      });
    }

    return actions;
  };

  const renderStatusDetail = (job: DashboardJob) => {
    if (job.outpassNumber) {
      return (
        <div className="mt-0.5 font-mono text-[10px] font-medium text-blue-800">
          Outpass: {job.outpassNumber}
        </div>
      );
    }
    if (job.removalNumber) {
      return (
        <div className="mt-0.5 font-mono text-[10px] text-slate-500">
          Removal: {job.removalNumber}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 antialiased selection:bg-slate-200">
      <SEO
        title="Customs Consignment Operations | Gorod Logistics CBW TRV1U001"
        description="Statutory Customs Bonded Warehouse operations desk and compliance ledger under the Indian Customs Act 1962."
      />

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-[#0c1e28] text-white shadow-xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Gorod Logistics"
                className="h-7 w-auto rounded border border-white/10 bg-white/5 object-contain p-0.5"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-wide text-white">GOROD LOGISTICS</span>
                <span className="hidden items-center rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-300 sm:inline-flex">
                  CBW {CBW_DETAILS.warehouseCode}
                </span>
                <span className="hidden text-xs text-slate-400 md:inline">&bull;</span>
                <span className="hidden font-mono text-[11px] text-slate-400 md:inline">
                  Valiyathura Port Desk
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden items-center gap-1.5 rounded border px-2 py-1 text-[11px] sm:flex ${
                !isSupabaseConfigured
                  ? 'border-red-400/40 bg-red-950/40 text-red-200'
                  : dbHealth?.ok
                    ? 'border-emerald-400/30 bg-emerald-950/40 text-emerald-200'
                    : 'border-amber-400/30 bg-amber-950/40 text-amber-200'
              }`}
              title={dbHealth?.detail || dbHealth?.message}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  !isSupabaseConfigured
                    ? 'bg-red-400'
                    : dbHealth?.ok
                      ? 'bg-emerald-400'
                      : 'bg-amber-400'
                }`}
              />
              {!isSupabaseConfigured
                ? 'Database not configured'
                : dbHealth
                  ? dbHealth.message
                  : 'Checking database…'}
            </div>

            <div className="hidden items-center gap-2 border-l border-slate-800 pl-3 sm:flex">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-200">
                  {currentUser?.full_name || 'Staff'}
                </div>
                <div className="font-mono text-[10px] text-slate-400">
                  {currentUser?.badge_number || '—'} · {roleMeta?.title || 'Unassigned'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                void logout();
                navigate('/login');
              }}
              className="rounded p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-4 px-4 py-5 sm:px-6 lg:px-8">
        {!isSupabaseConfigured && (
          <div className="flex items-start gap-2.5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <strong>Authentication and database are not configured.</strong> Set
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the deployment environment. The
              operations desk will not accept records until the backend is connected.
            </div>
          </div>
        )}

        {syncError && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{syncError}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadLiveJobs()}
              className="rounded border border-red-300 bg-red-100 px-2.5 py-1 font-semibold text-red-800 hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div className="flex items-center justify-between gap-3 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{notice}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="rounded p-0.5 text-emerald-700 hover:bg-emerald-100"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 pb-1 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Consignment Ledger &amp; Statutory Holds
              </h1>
              <span className="rounded bg-slate-200/80 px-2 py-0.5 font-mono text-[11px] font-medium text-slate-700">
                Bond: {CBW_DETAILS.bondNumber}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Indian Customs Act 1962 (Sec 57 &bull; 58) &bull; Active Custody:{' '}
              <strong className="text-slate-800">{roleMeta?.title || 'Unassigned'}</strong> (
              {currentUser?.full_name || '—'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/sop"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>SOP Manual</span>
            </Link>

            {canRegister && (
              <button
                type="button"
                onClick={() => setDialog({ kind: 'new_job' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#852929] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#6e2222]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Register Inward BOE (SOP 4.1.1)</span>
              </button>
            )}
          </div>
        </div>

        {holdCount > 0 && activeEscalationJob && (
          <div className="flex flex-col justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3.5 shadow-2xs md:flex-row md:items-center">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <div className="text-xs font-bold text-amber-900">
                  {holdCount} statutory hold{holdCount === 1 ? '' : 's'} active
                  {activeEscalationJob
                    ? ` · ${activeEscalationJob.jobNumber} variance ${formatSignedKg(
                        activeEscalationJob.weightVarianceKg
                      )}`
                    : ''}
                </div>
                <div className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                  Gross weight variance exceeds the statutory threshold of ±
                  {CBW_DETAILS.weightThresholdKg} kg (SOP 4.1.8). Custody movement is frozen
                  until the jurisdictional Customs Bond Officer records a disposition.
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedJob(activeEscalationJob)}
                className="rounded border border-amber-300 bg-white px-3 py-1 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100"
              >
                Inspect Variance
              </button>
              {canNotify && !activeEscalationJob.escalationNotifiedAt && (
                <button
                  type="button"
                  onClick={() => setDialog({ kind: 'customs_notice', job: activeEscalationJob })}
                  className="rounded bg-[#852929] px-3 py-1 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#6e2222]"
                >
                  Log Customs Notice
                </button>
              )}
              {canResolve && (
                <button
                  type="button"
                  onClick={() => setDialog({ kind: 'resolve_hold', job: activeEscalationJob })}
                  className="rounded bg-emerald-700 px-3 py-1 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-800"
                >
                  Resolve Hold
                </button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 bg-slate-50/60 px-4 py-2.5 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-1">
              {tabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded px-3 py-1 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-transparent text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                    {tab.alert && (
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'border border-amber-300 bg-amber-100 text-amber-900'
                        }`}
                      >
                        Hold
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by job, BOE, consignee…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded border border-slate-300 bg-white py-1 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {activeTab !== 'roles' && activeTab !== 'weighing_reports' && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    <th className="px-4 py-2.5 font-semibold">Job / Reference</th>
                    <th className="px-4 py-2.5 font-semibold">Bill of Entry</th>
                    <th className="px-4 py-2.5 font-semibold">Consignee</th>
                    <th className="px-4 py-2.5 font-semibold">Cargo Particulars &amp; Bay</th>
                    <th className="px-4 py-2.5 font-semibold">Gross Weight (Scale vs Manifest)</th>
                    <th className="px-4 py-2.5 font-semibold">Statutory Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingJobs && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-500">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />
                          <span>Loading live consignments…</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loadingJobs && jobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-500">
                        No consignments are registered yet. Use{' '}
                        <strong className="text-slate-700">Register Inward BOE</strong> to open the
                        first job.
                      </td>
                    </tr>
                  )}

                  {!loadingJobs && jobs.length > 0 && filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-500">
                        No consignments match {searchTerm ? `“${searchTerm}”` : 'this filter'}.
                      </td>
                    </tr>
                  )}

                  {filteredJobs.map((job) => {
                    const deltaBreach =
                      job.weightVarianceKg !== undefined &&
                      Math.abs(job.weightVarianceKg) > thresholdKg;
                    const actions = rowActions(job);

                    return (
                      <tr
                        key={job.id}
                        tabIndex={0}
                        onClick={() => setSelectedJob(job)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedJob(job);
                          }
                        }}
                        className="group cursor-pointer transition-colors hover:bg-slate-50/80 focus:bg-slate-50 focus:outline-none"
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900 group-hover:text-[#0c323b]">
                            <span>{job.jobNumber}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                          <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                            Bond: {job.bondNumber} &bull; {CBW_DETAILS.warehouseCode}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top font-mono">
                          <div className="font-medium text-slate-800">{job.boeNumber}</div>
                          <div className="mt-0.5 font-sans text-[10px] text-slate-500">
                            Date: {formatDate(job.boeDate)}
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-slate-900">{job.customerName}</div>
                          <div className="text-[10px] text-slate-500">Into-Bond Custody</div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div
                            className="max-w-[200px] truncate text-slate-800"
                            title={job.cargoDesc}
                          >
                            {job.cargoDesc}
                          </div>
                          <div className="mt-0.5 text-[10px] text-slate-500">
                            {job.packages} pkgs &bull;{' '}
                            <span className="font-medium text-slate-700">
                              Bay: {job.assignedBin || 'Pending allocation'}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="font-mono text-[11px] text-slate-600">
                            Declared:{' '}
                            <span className="font-medium text-slate-900">
                              {formatKg(job.declaredWeightKg)}
                            </span>
                          </div>
                          {job.actualWeightKg != null ? (
                            <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[11px]">
                              <span>
                                Scale: <strong>{formatKg(job.actualWeightKg)}</strong>
                              </span>
                              <span
                                className={`rounded border px-1.5 py-0.2 text-[10px] font-bold ${
                                  deltaBreach
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {formatSignedKg(job.weightVarianceKg)}
                                {deltaBreach ? ' BREACH' : ' OK'}
                              </span>
                            </div>
                          ) : (
                            <span className="mt-0.5 inline-flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                              <Clock className="h-3 w-3" /> Awaiting weigh scale
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 align-top">
                          <StatusBadge status={job.status} />
                          {renderStatusDetail(job)}
                        </td>

                        <td
                          className="px-4 py-3 text-right align-top"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {actions.map((action) => (
                              <ActionButton
                                key={action.label}
                                label={action.label}
                                tone={action.tone}
                                onClick={action.onClick}
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => setSelectedJob(job)}
                              className="rounded border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
                            >
                              Inspect
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'weighing_reports' && (
            <WeighingReportsTab
              jobs={jobs}
              thresholdKg={thresholdKg}
              canConfigureThreshold={currentRole === 'warehouse_keeper'}
              onThresholdUpdated={(next) => {
                setThresholdKg(next);
                setNotice(`Weighing discrepancy threshold updated to ±${next} kg.`);
              }}
            />
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4 p-5">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-sm font-bold text-slate-900">
                  Customs Bonded Warehouse — Role Authority &amp; Escalation Protocol (SOP
                  Section 3)
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Statutory organogram establishing custody, physical weighbridge governance, and
                  Customs escalation paths.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SOP_ROLES.map((role) => {
                  const isCurrentRole = role.id === currentRole;
                  return (
                    <div
                      key={role.id}
                      className={`space-y-2.5 rounded-lg border p-4 ${
                        isCurrentRole
                          ? 'border-[#0c323b] bg-slate-50/70 ring-1 ring-[#0c323b]/20'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                          SOP Sec 3
                        </span>
                        {isCurrentRole && (
                          <span className="rounded bg-[#0c323b] px-2 py-0.5 text-[10px] font-semibold text-white">
                            Active Officer
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{role.title}</h3>
                        <div className="text-[11px] text-slate-500">{role.department}</div>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{role.summary}</p>
                      <div className="border-t border-slate-100 pt-2">
                        <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-700">
                          Mandatory Duties:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {role.keyResponsibilities.slice(0, 3).map((responsibility, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-slate-400">&bull;</span>
                              <span className="text-[11px] leading-snug">{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
                        Escalation Authority:{' '}
                        <strong className="text-slate-800">{role.escalationRole}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedJob && (
        <div className="fixed inset-0 z-40 flex justify-end overflow-hidden bg-slate-900/40 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="inspection-title"
            className="flex h-full w-full max-w-xl flex-col justify-between border-l border-slate-300 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="inspection-title"
                    className="font-mono text-base font-bold text-slate-900"
                  >
                    {selectedJob.jobNumber}
                  </h2>
                  <StatusBadge status={selectedJob.status} />
                </div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Consignment Inspection &amp; Statutory Compliance Record
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="cursor-pointer rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                aria-label="Close inspection drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customs Manifest &amp; Custody
                </h3>
                <div className="grid grid-cols-2 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  <div>
                    <span className="block text-[11px] text-slate-500">Importer / Consignee</span>
                    <strong className="text-xs text-slate-900">{selectedJob.customerName}</strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">Into-Bond BOE Number</span>
                    <strong className="font-mono text-xs text-slate-900">
                      {selectedJob.boeNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">BOE Filing Date</span>
                    <span className="font-mono text-slate-800">
                      {formatDate(selectedJob.boeDate)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">Customs Bond Number</span>
                    <span className="font-mono text-slate-800">{selectedJob.bondNumber}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[11px] text-slate-500">Cargo Particulars</span>
                    <span className="font-medium text-slate-800">
                      {selectedJob.cargoDesc} ({selectedJob.packages} packages)
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">Storage Bay Allocation</span>
                    <span className="font-semibold text-slate-900">
                      {selectedJob.assignedBin || 'Pending allocation'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-500">Vehicle / Driver</span>
                    <span className="font-mono text-slate-800">
                      {selectedJob.vehicleRegistration || '—'} / {selectedJob.driverName || '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Weighbridge Protocol (SOP 4.1.8)
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500">
                    Internal Threshold: ±{thresholdKg} kg
                  </span>
                </div>
                <div className="space-y-2 rounded-md border border-slate-200 bg-white p-3.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Declared Manifest Gross Weight:</span>
                    <strong className="font-mono text-xs text-slate-900">
                      {formatKg(selectedJob.declaredWeightKg)}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Actual Weighbridge Scale Weight:</span>
                    <strong className="font-mono text-xs text-slate-900">
                      {selectedJob.actualWeightKg != null
                        ? formatKg(selectedJob.actualWeightKg)
                        : 'Pending check'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold">
                    <span>Scale Delta Variance:</span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-xs ${
                        selectedJob.weightVarianceKg !== undefined &&
                        Math.abs(selectedJob.weightVarianceKg) > thresholdKg
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {formatSignedKg(selectedJob.weightVarianceKg)}
                    </span>
                  </div>

                  {selectedJob.escalationTriggered && (
                    <div className="rounded border border-red-200 bg-red-50 p-2.5 text-[11px] leading-relaxed text-red-900">
                      <strong>SOP 4.1.8 statutory breach:</strong> delta variance exceeds the
                      allowable ±{CBW_DETAILS.weightThresholdKg} kg.
                      {selectedJob.escalationResolved ? (
                        <span className="mt-1 block font-semibold text-emerald-800">
                          Hold resolved by Customs disposition.
                        </span>
                      ) : selectedJob.escalationNotifiedAt ? (
                        <span className="mt-1 block">
                          Customs notification logged{' '}
                          {formatDateTime(selectedJob.escalationNotifiedAt)}. Awaiting
                          disposition.
                        </span>
                      ) : (
                        <span className="mt-1 block">
                          Customs notification has not yet been logged.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customs &amp; Outpass Protocol (SOP 4.2.6)
                </h3>
                <div className="divide-y divide-slate-100 rounded-md border border-slate-200 text-slate-700">
                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                      {selectedJob.actualWeightKg != null ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-600" />
                      )}
                      <span>1. Physical Weighbridge Verification</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      {selectedJob.actualWeightKg != null ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                      {selectedJob.removalId ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-400" />
                      )}
                      <span>2. Removal Request &amp; Statutory Documents</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      {selectedJob.removalNumber || 'Not requested'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                      {selectedJob.ndcNumber ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-400" />
                      )}
                      <span>3. Accounts No Dues Certificate (NDC)</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      {selectedJob.ndcNumber || (selectedJob.removalId ? 'Pending payment' : '—')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5">
                    <div className="flex items-center gap-2">
                      {selectedJob.outpassNumber ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-slate-400" />
                      )}
                      <span>4. Gatepass Authorization</span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-emerald-800">
                      {selectedJob.outpassNumber || 'Locked'}
                    </span>
                  </div>
                </div>
              </div>

              {selectedJob.removalId && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Removal Record
                  </h3>
                  <div className="grid grid-cols-2 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700">
                    <div>
                      <span className="block text-[11px] text-slate-500">Removal number</span>
                      <span className="font-mono text-slate-900">
                        {selectedJob.removalNumber || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Removal type</span>
                      <span className="text-slate-900">
                        {selectedJob.removalType?.replace(/_/g, ' ') || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Requested ETD</span>
                      <span className="font-mono text-slate-900">
                        {formatDateTime(selectedJob.requestedEtd)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Requested weight</span>
                      <span className="font-mono text-slate-900">
                        {formatKg(selectedJob.requestedWeightKg)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Invoice</span>
                      <span className="font-mono text-slate-900">
                        {selectedJob.invoiceNumber || '—'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Invoice amount</span>
                      <span className="font-mono text-slate-900">
                        {formatCurrency(selectedJob.invoiceAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Delivery-zone verified weight</span>
                      <span className="font-mono text-slate-900">
                        {selectedJob.pickedActualWeightKg != null
                          ? `${formatKg(selectedJob.pickedActualWeightKg)} (${selectedJob.pickedPackageCount ?? '—'} pkgs)`
                          : 'Pending delivery weighing'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px] text-slate-500">Delivery-zone variance</span>
                      <span className="font-mono text-slate-900">
                        {selectedJob.deliveryZoneWeightVarianceKg != null
                          ? formatSignedKg(selectedJob.deliveryZoneWeightVarianceKg)
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <JobWeighingHistory
                jobId={selectedJob.id}
                refreshKey={historyRefreshKey}
                canReviewException={
                  currentRole === 'warehouse_keeper' ||
                  currentRole === 'admin_compliance' ||
                  currentRole === 'warehouse_manager'
                }
                canResolveException={
                  currentRole === 'warehouse_keeper' ||
                  currentRole === 'customs_bond_officer'
                }
                onUpdated={(message) => {
                  void handleSaved(message);
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 p-4">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="rounded border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                Close
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {rowActions(selectedJob).map((action) => (
                  <ActionButton
                    key={action.label}
                    label={action.label}
                    tone={action.tone}
                    onClick={action.onClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <NewJobDialog
        open={dialog?.kind === 'new_job'}
        onClose={() => setDialog(null)}
        onSaved={handleSaved}
      />

      {dialog?.kind === 'weighment' && (
        <WeighmentDialog
          open
          job={dialog.job}
          thresholdKg={thresholdKg}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'reweigh' && (
        <ReweighDialog
          open
          job={dialog.job}
          thresholdKg={thresholdKg}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'outward_weigh' && (
        <OutwardWeighmentDialog
          open
          job={dialog.job}
          thresholdKg={thresholdKg}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'removal' && (
        <RemovalDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'ndc' && (
        <NdcDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'outpass' && (
        <OutpassDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'gate_out' && (
        <GateOutDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'customs_notice' && (
        <CustomsNoticeDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
      {dialog?.kind === 'resolve_hold' && (
        <ResolveHoldDialog
          open
          job={dialog.job}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};
