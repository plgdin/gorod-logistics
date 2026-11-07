import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Search,
  RefreshCw,
  User,
  ChevronDown,
  ChevronUp,
  Check,
  Clock,
  Info,
} from 'lucide-react';
import { useAuth, UserRole, PRESET_USERS } from '../features/auth/AuthContext';
import { SOP_ROLES, SOPRole } from '../features/sop/sopData';
import { SEO } from '../components/ui/SEO';
import {
  createInwardJob,
  fetchDashboardJobs,
  issueNdc,
  notifyCustoms,
  recordWeighing,
  type DashboardJob,
} from '../lib/jobsApi';
import { checkSupabaseHealth, type DbHealth } from '../lib/supabase';

// Demo consignments used when the app is in Local Demo mode.
const INITIAL_JOBS: DashboardJob[] = [
  {
    id: 'job-001',
    customerId: '11111111-1111-1111-1111-111111110201',
    jobNumber: 'GL-JOB-2026-0089',
    customerName: 'Malabar Marine Exports Ltd',
    boeNumber: 'BOE-9081245',
    boeDate: '2026-05-12',
    bondNumber: '2002591018',
    cargoDesc: 'Cold Chain Industrial Compressor Units',
    packages: 24,
    declaredWeightKg: 4800,
    actualWeightKg: 4802.5,
    weightVarianceKg: 2.5,
    escalationTriggered: false,
    assignedBin: 'BAY-A-01',
    status: 'Binned & GRA Issued',
    ndcCleared: false,
  },
  {
    id: 'job-002',
    customerId: '11111111-1111-1111-1111-111111110202',
    jobNumber: 'GL-JOB-2026-0090',
    customerName: 'Travancore Spices & Herbs',
    boeNumber: 'BOE-9081299',
    boeDate: '2026-05-14',
    bondNumber: '2002591018',
    cargoDesc: 'Sterilized Cardamom Extract Drums',
    packages: 40,
    declaredWeightKg: 2000,
    actualWeightKg: 2008.2,
    weightVarianceKg: 8.2,
    escalationTriggered: true, // Triggered > +-5kg per SOP 4.1.8
    status: 'Weight Escalated',
    ndcCleared: false,
  },
  {
    id: 'job-003',
    customerId: '11111111-1111-1111-1111-111111110203',
    jobNumber: 'GL-JOB-2026-0085',
    customerName: 'Kerala High-Tech Solutions',
    boeNumber: 'BOE-9076510',
    boeDate: '2026-05-02',
    bondNumber: '2002591018',
    cargoDesc: 'Server Rack Enclosures & Networking Units',
    packages: 12,
    declaredWeightKg: 1450,
    actualWeightKg: 1450,
    weightVarianceKg: 0,
    escalationTriggered: false,
    assignedBin: 'BAY-B-01',
    status: 'NDC Cleared',
    ndcCleared: true,
    outpassNumber: 'GL-GP-2026-0034',
  },
];

type ActiveTab = 'all_jobs' | 'inward' | 'removals' | 'ndc' | 'roles';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    logout,
    isSupabaseConfigured,
    authMode,
    session,
  } = useAuth();
  const navigate = useNavigate();

  const isLive = authMode === 'supabase' && Boolean(session);

  const [jobs, setJobs] = useState<DashboardJob[]>(isLive ? [] : INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('all_jobs');
  const [loadingJobs, setLoadingJobs] = useState<boolean>(isLive);
  const [dbHealth, setDbHealth] = useState<DbHealth | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);
  const [expandedJobId, setExpandedJobId] = useState<string | null>('job-002');

  // Form State for Quick Job Creation (SOP 4.1.1 Rule: 1 BOE = 1 Job Number)
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newBoe, setNewBoe] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPackages, setNewPackages] = useState<number>(10);
  const [newDeclaredWeight, setNewDeclaredWeight] = useState<number>(1000);
  const [newIec, setNewIec] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  const ensureUserId = (): string => {
    if (!currentUser) {
      throw new Error('You must be signed in to write to the database.');
    }
    return currentUser.id;
  };

  const loadLiveJobs = useCallback(async () => {
    if (!isLive) return;
    setLoadingJobs(true);
    setSyncError(null);
    try {
      const [rows, health] = await Promise.all([
        fetchDashboardJobs(),
        checkSupabaseHealth(),
      ]);
      setJobs(rows);
      setDbHealth(health);
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Could not sync with Supabase.');
    } finally {
      setLoadingJobs(false);
    }
  }, [isLive]);

  useEffect(() => {
    void loadLiveJobs();
  }, [loadLiveJobs]);

  const resetJobForm = () => {
    setShowNewJobModal(false);
    setNewCustomer('');
    setNewBoe('');
    setNewDesc('');
    setNewIec('');
    setNewContactEmail('');
  };

  // Quick Action for Weight Delta Testing (SOP 4.1.8)
  const handleSimulateWeighing = async (jobId: string, actualWeight: number) => {
    const job = jobs.find((entry) => entry.id === jobId);
    if (!job) return;

    if (isLive) {
      setBusyJobId(jobId);
      setSyncError(null);
      try {
        await recordWeighing(job, actualWeight, ensureUserId());
        await loadLiveJobs();
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : 'Could not record the weighing.');
      } finally {
        setBusyJobId(null);
      }
      return;
    }

    setJobs((prev) =>
      prev.map((entry) => {
        if (entry.id === jobId) {
          const delta = Number((actualWeight - entry.declaredWeightKg).toFixed(2));
          const triggered = Math.abs(delta) > 5;
          return {
            ...entry,
            actualWeightKg: actualWeight,
            weightVarianceKg: delta,
            escalationTriggered: triggered,
            status: triggered ? 'Weight Escalated' : 'Binned & GRA Issued',
          };
        }
        return entry;
      })
    );
  };

  // Quick Action for Accounts NDC Clearance (SOP 4.2.6)
  const handleIssueNDC = async (jobId: string) => {
    const job = jobs.find((entry) => entry.id === jobId);
    if (!job) return;

    if (isLive) {
      setBusyJobId(jobId);
      setSyncError(null);
      try {
        await issueNdc(job, ensureUserId());
        await loadLiveJobs();
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : 'Could not issue the NDC.');
      } finally {
        setBusyJobId(null);
      }
      return;
    }

    setJobs((prev) =>
      prev.map((entry) => {
        if (entry.id === jobId) {
          return {
            ...entry,
            ndcCleared: true,
            status: 'NDC Cleared',
            outpassNumber: `GL-GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return entry;
      })
    );
  };

  const handleNotifyCustoms = async (jobId: string) => {
    if (!isLive) return;
    setBusyJobId(jobId);
    setSyncError(null);
    try {
      await notifyCustoms(jobId);
      await loadLiveJobs();
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Could not record the notification.');
    } finally {
      setBusyJobId(null);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncError(null);

    if (isLive) {
      setCreatingJob(true);
      try {
        await createInwardJob({
          customerName: newCustomer,
          boeNumber: newBoe,
          cargoDesc: newDesc,
          packages: Number(newPackages),
          declaredWeightKg: Number(newDeclaredWeight),
          iecCode: newIec,
          contactEmail: newContactEmail,
        });
        await loadLiveJobs();
        resetJobForm();
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : 'Could not create the job.');
      } finally {
        setCreatingJob(false);
      }
      return;
    }

    const newSeq = jobs.length + 91;
    const created: DashboardJob = {
      id: `job-${Date.now()}`,
      customerId: `demo-customer-${Date.now()}`,
      jobNumber: `GL-JOB-2026-00${newSeq}`,
      customerName: newCustomer || 'Global Importers Corp',
      boeNumber: newBoe || `BOE-908${Math.floor(1000 + Math.random() * 9000)}`,
      boeDate: new Date().toISOString().split('T')[0],
      bondNumber: '2002591018',
      cargoDesc: newDesc || 'General Bonded Consignment',
      packages: Number(newPackages),
      declaredWeightKg: Number(newDeclaredWeight),
      escalationTriggered: false,
      ndcCleared: false,
      status: 'Space Cert Issued',
    };
    setJobs([created, ...jobs]);
    resetJobForm();
  };

  const roleMeta = SOP_ROLES.find((r: SOPRole) => r.id === currentRole) || SOP_ROLES[0];

  // Tab Filtering Logic
  const filteredJobs = jobs.filter((job) => {
    // Search Term Filter
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        job.jobNumber.toLowerCase().includes(q) ||
        job.boeNumber.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.cargoDesc.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Active Tab Filter
    if (activeTab === 'inward') {
      return job.escalationTriggered || !job.actualWeightKg || job.status.includes('Binned');
    }
    if (activeTab === 'removals') {
      return job.ndcCleared || Boolean(job.outpassNumber);
    }
    if (activeTab === 'ndc') {
      return !job.ndcCleared;
    }
    return true;
  });

  const escalationCount = jobs.filter((j) => j.escalationTriggered).length;
  const ndcClearedCount = jobs.filter((j) => j.ndcCleared).length;
  const pendingNdcCount = jobs.length - ndcClearedCount;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-slate-200">
      <SEO
        title="Operations Desk | Gorod Logistics CBW TRV1U001"
        description="Statutory Customs Bonded Warehouse operations desk and compliance ledger under the Indian Customs Act 1962."
      />

      {/* Top Station Navigation Bar */}
      <header className="bg-[#0c1e28] text-white border-b border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Warehouse Brand & Station Credentials */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="Gorod Logistics"
                className="h-8 w-auto object-contain bg-white/5 rounded p-0.5 border border-white/10"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wide text-white">GOROD LOGISTICS</span>
                  <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-medium">
                    CBW TRV1U001
                  </span>
                </div>
                <span className="text-[11px] block text-slate-400 font-mono tracking-tight">
                  Bond: 2002591018 &bull; Valiyathura Port Desk, Thiruvananthapuram
                </span>
              </div>
            </Link>
          </div>

          {/* Operational Environment & Station Officer Controls */}
          <div className="flex items-center gap-3">
            {/* Mode Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700/60 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbHealth?.ok ? 'bg-emerald-400' : isLive ? 'bg-amber-400' : 'bg-slate-400'
                }`}
              />
              <span className="text-slate-300 font-medium text-[11px]">
                {isLive ? 'PostgreSQL RLS' : 'Local Demo Ledger'}
              </span>
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-md px-3 py-1.5 text-xs">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  Station Officer
                </span>
                <select
                  value={currentRole || 'warehouse_keeper'}
                  onChange={(e) => switchRole(e.target.value as UserRole)}
                  className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {Object.entries(PRESET_USERS).map(([roleKey, u]) => (
                    <option key={roleKey} value={roleKey} className="bg-slate-900 text-white">
                      {u.full_name} ({u.role.replace('_', ' ').toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Officer Details & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-slate-200">{currentUser?.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{currentUser?.badge_number}</div>
              </div>
              <button
                onClick={() => {
                  void logout();
                  navigate('/login');
                }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Sign Out of Station"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Operational Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error Notification Bar */}
        {syncError && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-xs text-red-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{syncError}</span>
            </div>
            <button
              type="button"
              onClick={() => void loadLiveJobs()}
              className="shrink-0 rounded bg-red-100 px-3 py-1 font-semibold text-red-800 border border-red-300 hover:bg-red-200"
            >
              Retry Database Sync
            </button>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isSupabaseConfigured && !isLive && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/80 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Station Operating in Local Demo Mode.</strong> Changes are recorded in browser cache only.{' '}
                <Link to="/login" className="font-semibold underline hover:text-amber-950">
                  Sign in with authorized staff account
                </Link>{' '}
                to commit to live PostgreSQL tables.
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-amber-800">SOP Phase 1</span>
          </div>
        )}

        {/* Statutory Governance & Station Header Bar */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0c323b]" />
                  Indian Customs Act 1962 &bull; Sec 57/58
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Statutory Custody: <strong className="text-slate-800">{roleMeta.title}</strong>
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {currentUser?.department || 'Warehouse Governance & Compliance Desk'}
              </h1>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                {roleMeta.summary}
              </p>
            </div>

            {/* Primary Station Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/sop"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Open 21-Page SOP Manual</span>
              </Link>

              {(currentRole === 'admin_compliance' || currentRole === 'warehouse_keeper') && (
                <button
                  onClick={() => setShowNewJobModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#852929] hover:bg-[#6e2222] text-xs font-semibold text-white transition-all shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Inward BOE (SOP 4.1.1)</span>
                </button>
              )}
            </div>
          </div>

          {/* Statutory Duties Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {roleMeta.keyResponsibilities.slice(0, 4).map((resp: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">{resp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Integrated Operational Metrics Ribbon */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-2 sm:grid-cols-4">
          {/* Active Consignments */}
          <div
            onClick={() => setActiveTab('all_jobs')}
            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Consignments
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {jobs.length}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                1:1 BOE Enforced
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">SOP 4.1.1 Statutory Ratio</div>
          </div>

          {/* Weighbridge Escalations */}
          <div
            onClick={() => setActiveTab('inward')}
            className={`p-4 cursor-pointer transition-colors ${
              escalationCount > 0 ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Weight Discrepancies (±5 kg)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold font-mono tabular-nums ${
                  escalationCount > 0 ? 'text-amber-800' : 'text-slate-900'
                }`}
              >
                {escalationCount}
              </span>
              <span
                className={`text-[11px] font-medium px-1.5 py-0.5 rounded border font-mono ${
                  escalationCount > 0
                    ? 'text-amber-800 bg-amber-100 border-amber-300'
                    : 'text-slate-600 bg-slate-100 border-slate-200'
                }`}
              >
                {escalationCount > 0 ? 'SOP 4.1.8 Hold Active' : 'All Within Tolerance'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Requires Bond Officer Notice</div>
          </div>

          {/* Accounts NDC Clearances */}
          <div
            onClick={() => setActiveTab('ndc')}
            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Accounts NDC Desk
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {ndcClearedCount}
                <span className="text-sm font-normal text-slate-400">/{jobs.length}</span>
              </span>
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
                {ndcClearedCount} Gatepass Unlocked
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{pendingNdcCount} pending clearance</div>
          </div>

          {/* Database Health & Sync */}
          <div className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Database Telemetry
              </span>
              <button
                type="button"
                onClick={() => void loadLiveJobs()}
                disabled={!isLive || loadingJobs}
                title={isLive ? 'Refresh from PostgreSQL' : 'Sign in to enable live database sync'}
                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingJobs ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="mt-1">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    dbHealth?.ok ? 'bg-emerald-500' : isLive ? 'bg-amber-500' : 'bg-slate-400'
                  }`}
                />
                <span>{dbHealth ? dbHealth.message : isLive ? 'Connecting…' : 'Local Demo Cache'}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isLive ? 'dashboard_jobs &bull; authenticated RLS' : 'Changes held in browser memory'}
              </div>
            </div>
          </div>
        </section>

        {/* Tab Controls & Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all_jobs', label: 'All Consignments', count: jobs.length },
              {
                id: 'inward',
                label: 'Inward & ±5 kg Verification',
                badge: escalationCount > 0 ? `${escalationCount} Alert` : undefined,
                badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
              },
              { id: 'ndc', label: 'Accounts NDC Desk', count: pendingNdcCount },
              { id: 'removals', label: 'Outward Removals & Outpass', count: ndcClearedCount },
              { id: 'roles', label: 'Role Authority Matrix (SOP Sec 3)' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${
                        isSelected ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold' : tab.badgeColor
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Job, BOE, Consignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Master Consignment Table View */}
        {activeTab !== 'roles' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-semibold tracking-wider">
                    <th className="py-3 px-4">Job Reference</th>
                    <th className="py-3 px-4">Bill of Entry (BOE)</th>
                    <th className="py-3 px-4">Consignee</th>
                    <th className="py-3 px-4">Cargo & Storage Bay</th>
                    <th className="py-3 px-4">Weighbridge (±5 kg)</th>
                    <th className="py-3 px-4">Customs Status</th>
                    <th className="py-3 px-4 text-right">Statutory Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingJobs && (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-500 text-xs">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
                          <span>Synchronizing live jobs from PostgreSQL…</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loadingJobs && jobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-500 text-xs">
                        No consignments recorded in database yet. Register an inward BOE to begin.
                      </td>
                    </tr>
                  )}

                  {!loadingJobs && jobs.length > 0 && filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center text-slate-500 text-xs">
                        No consignments match the active filters or search query &ldquo;{searchTerm}&rdquo;.
                      </td>
                    </tr>
                  )}

                  {filteredJobs.map((job) => {
                    const isExpanded = expandedJobId === job.id;
                    const deltaBreach =
                      job.weightVarianceKg !== undefined && Math.abs(job.weightVarianceKg) > 5;

                    return (
                      <React.Fragment key={job.id}>
                        <tr
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isExpanded ? 'bg-slate-50/50' : ''
                          }`}
                        >
                          {/* Job Reference */}
                          <td className="py-3.5 px-4 align-top">
                            <button
                              type="button"
                              onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                              className="font-mono font-bold text-slate-900 hover:text-[#0c323b] text-left flex items-center gap-1 group cursor-pointer"
                            >
                              <span>{job.jobNumber}</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Bond: 2002591018 &bull; TRV1U001
                            </div>
                          </td>

                          {/* Bill of Entry */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-mono font-semibold text-slate-800">{job.boeNumber}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">Date: {job.boeDate}</div>
                          </td>

                          {/* Consignee */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-semibold text-slate-900">{job.customerName}</div>
                            <div className="text-[10px] text-slate-500">Into-Bond Custody</div>
                          </td>

                          {/* Cargo Particulars */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="text-slate-800 max-w-[220px] truncate" title={job.cargoDesc}>
                              {job.cargoDesc}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {job.packages} pkgs &bull;{' '}
                              <span className="font-medium text-slate-700">
                                Bin: {job.assignedBin || 'Pending Allocation'}
                              </span>
                            </div>
                          </td>

                          {/* Declared vs Scale Weight (SOP 4.1.8) */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="font-mono text-[11px] text-slate-600">
                              Declared:{' '}
                              <span className="font-semibold text-slate-900">
                                {job.declaredWeightKg.toLocaleString()} kg
                              </span>
                            </div>
                            {job.actualWeightKg !== undefined ? (
                              <div className="font-mono text-[11px] mt-0.5 flex items-center gap-1.5">
                                <span>
                                  Scale: <strong>{job.actualWeightKg.toLocaleString()} kg</strong>
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                                    deltaBreach
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  }`}
                                >
                                  {job.weightVarianceKg! > 0
                                    ? `+${job.weightVarianceKg}`
                                    : job.weightVarianceKg}{' '}
                                  kg {deltaBreach ? 'BREACH' : 'OK'}
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5">
                                <Clock className="w-3 h-3" /> Awaiting scale check
                              </span>
                            )}
                          </td>

                          {/* SOP Status */}
                          <td className="py-3.5 px-4 align-top">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                                job.escalationTriggered
                                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                                  : job.ndcCleared
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {job.escalationTriggered && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                              {job.ndcCleared && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              <span>{job.status}</span>
                            </span>
                            {job.outpassNumber && (
                              <div className="text-[10px] font-mono text-emerald-800 mt-1 font-medium">
                                Outpass: {job.outpassNumber}
                              </div>
                            )}
                          </td>

                          {/* Role Specific Actions */}
                          <td className="py-3.5 px-4 text-right align-top space-y-1">
                            {/* Warehouse Manager Action */}
                            {currentRole === 'warehouse_manager' && !job.actualWeightKg && (
                              <button
                                onClick={() => void handleSimulateWeighing(job.id, job.declaredWeightKg + 6.5)}
                                disabled={busyJobId === job.id}
                                className="px-3 py-1.5 rounded bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-semibold text-xs transition-colors shadow-xs ml-auto block"
                              >
                                {busyJobId === job.id ? 'Recording…' : 'Record Scale (+6.5 kg Breach)'}
                              </button>
                            )}

                            {/* Accounts Team Action */}
                            {currentRole === 'accounts_team' && !job.ndcCleared && (
                              <button
                                onClick={() => void handleIssueNDC(job.id)}
                                disabled={busyJobId === job.id}
                                className="px-3 py-1.5 rounded bg-[#0c323b] hover:bg-[#1a4a55] disabled:opacity-60 text-white font-semibold text-xs transition-colors shadow-xs ml-auto block"
                              >
                                {busyJobId === job.id ? 'Issuing…' : 'Issue Accounts NDC'}
                              </button>
                            )}

                            {/* Warehouse Keeper / Compliance Officer Action */}
                            {(currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance') &&
                              job.escalationTriggered && (
                                <button
                                  onClick={() => void handleNotifyCustoms(job.id)}
                                  disabled={!isLive || busyJobId === job.id}
                                  title={
                                    isLive
                                      ? 'Dispatch statutory notification to Jurisdictional Customs'
                                      : 'Sign in with Supabase account to persist notification'
                                  }
                                  className="px-3 py-1.5 rounded bg-[#852929] hover:bg-[#6e2222] disabled:opacity-60 text-white font-semibold text-xs transition-colors shadow-xs ml-auto block"
                                >
                                  {busyJobId === job.id ? 'Notifying…' : 'Notify Customs Bond Officer'}
                                </button>
                              )}

                            {/* Details Toggle Button */}
                            <button
                              onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline ml-auto block cursor-pointer"
                            >
                              {isExpanded ? 'Hide Details' : 'View Inspection'}
                            </button>
                          </td>
                        </tr>

                        {/* Inline Expandable Inspection Drawer */}
                        {isExpanded && (
                          <tr className="bg-slate-50/70 border-b border-slate-200">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="bg-white border border-slate-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                {/* Column 1: Consignment Legal Basis */}
                                <div>
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Statutory Mandate & Custody
                                  </div>
                                  <dl className="space-y-1.5 text-slate-600">
                                    <div className="flex justify-between">
                                      <dt className="text-slate-500">Into-Bond BOE:</dt>
                                      <dd className="font-mono font-semibold text-slate-900">{job.boeNumber}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-slate-500">BOE Filing Date:</dt>
                                      <dd className="font-mono text-slate-800">{job.boeDate}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-slate-500">Customs Bond No:</dt>
                                      <dd className="font-mono text-slate-800">{job.bondNumber}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                      <dt className="text-slate-500">Assigned Storage Bay:</dt>
                                      <dd className="font-semibold text-slate-900">{job.assignedBin || 'Pending'}</dd>
                                    </div>
                                  </dl>
                                </div>

                                {/* Column 2: Weighbridge Scale Verification */}
                                <div>
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Weighbridge Protocol (SOP 4.1.8)
                                  </div>
                                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
                                    <div className="flex justify-between">
                                      <span>Declared Manifest Weight:</span>
                                      <strong className="font-mono">{job.declaredWeightKg} kg</strong>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Scale Scale Weight:</span>
                                      <strong className="font-mono">
                                        {job.actualWeightKg !== undefined ? `${job.actualWeightKg} kg` : 'Pending'}
                                      </strong>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-1 mt-1 font-semibold">
                                      <span>Delta Variance:</span>
                                      <span
                                        className={
                                          deltaBreach
                                            ? 'text-red-700 font-mono'
                                            : 'text-emerald-700 font-mono'
                                        }
                                      >
                                        {job.weightVarianceKg !== undefined
                                          ? `${job.weightVarianceKg > 0 ? '+' : ''}${job.weightVarianceKg} kg`
                                          : '—'}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 pt-1">
                                      Statutory Threshold: &plusmn;5 kg. Delta &gt; 5 kg places shipment on
                                      mandatory statutory hold.
                                    </div>
                                  </div>
                                </div>

                                {/* Column 3: Outward & NDC Readiness */}
                                <div>
                                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Outward Removal Status (SOP 4.2.6)
                                  </div>
                                  <ul className="space-y-1.5 text-slate-700">
                                    <li className="flex items-center gap-1.5">
                                      {job.actualWeightKg ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      )}
                                      <span>Physical Weighbridge Scale Verified</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      {job.ndcCleared ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                      <span>Accounts No Dues Certificate (NDC)</span>
                                    </li>
                                    <li className="flex items-center gap-1.5">
                                      {job.outpassNumber ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                      )}
                                      <span>
                                        Security Gate Outpass:{' '}
                                        <span className="font-mono font-semibold">
                                          {job.outpassNumber || 'Locked'}
                                        </span>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Authority Matrix View (SOP Section 3) */}
        {activeTab === 'roles' && (
          <section className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Customs Bonded Warehouse — Role Authority & Escalation Matrix (SOP Section 3)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Statutory organogram establishing statutory custody, operational roles, and mandatory Customs
                liaison protocols under the Indian Customs Act 1962.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SOP_ROLES.map((role: SOPRole) => {
                const isCurrentRole = role.id === currentRole;
                return (
                  <div
                    key={role.id}
                    className={`bg-white border rounded-xl p-5 space-y-3.5 shadow-sm transition-all ${
                      isCurrentRole
                        ? 'border-[#0c323b] ring-1 ring-[#0c323b]/20 bg-slate-50/40'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        SOP Section 3
                      </span>
                      {isCurrentRole && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0c323b] text-white">
                          Current Role
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{role.title}</h3>
                      <div className="text-[11px] text-slate-500 font-medium">{role.department}</div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{role.summary}</p>
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Mandatory SOP Duties:
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        {role.keyResponsibilities.map((resp: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-bold">&bull;</span>
                            <span className="text-[11px] leading-snug">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-500 font-mono border-t border-slate-100">
                      Escalation Authority: <strong className="text-slate-800">{role.escalationRole}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* New Inward Job Registration Modal (SOP 4.1.1) */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#852929]" />
                <h2 className="text-base font-bold text-slate-900">
                  Register Inward Consignment (SOP 4.1.1)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
              <strong className="text-slate-900">Customs Statutory Rule (SOP 4.1.1):</strong> Each Bill of Entry
              (BOE) must have a separate, unique Job Number. Single-consignment accounting strictly enforced.
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Customer / Importer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cochin Marine Exports Ltd"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Into-Bond BOE Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="BOE-9081234"
                    value={newBoe}
                    onChange={(e) => setNewBoe(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Package Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPackages}
                    onChange={(e) => setNewPackages(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Cargo Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Chain Compressor Units"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Declared Gross Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newDeclaredWeight}
                  onChange={(e) => setNewDeclaredWeight(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">IEC Code (optional)</label>
                  <input
                    type="text"
                    placeholder="IEC0801001234"
                    value={newIec}
                    onChange={(e) => setNewIec(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Contact Email (optional)</label>
                  <input
                    type="email"
                    placeholder="ops@importer.in"
                    value={newContactEmail}
                    onChange={(e) => setNewContactEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500">
                {isLive
                  ? 'Writes directly to PostgreSQL through create_inward_job() RPC.'
                  : 'Local Demo mode: record will persist in browser session only.'}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 rounded-md bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingJob}
                  className="px-4 py-2 rounded-md bg-[#852929] hover:bg-[#6e2222] disabled:opacity-60 text-white font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {creatingJob ? 'Registering…' : 'Open Job Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
