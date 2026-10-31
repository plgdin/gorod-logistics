import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Search,
} from 'lucide-react';
import { useAuth, UserRole, PRESET_USERS } from '../features/auth/AuthContext';
import { SOP_ROLES, SOPRole } from '../features/sop/sopData';
import { SEO } from '../components/ui/SEO';

// Initial Mock Consignments Strictly conforming to SOP 4.1 & 4.2
interface JobRecord {
  id: string;
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
  escalationTriggered?: boolean;
  assignedBin?: string;
  status:
    | 'Enquiry'
    | 'Space Cert Issued'
    | 'Vehicle Arrived'
    | 'Inspection Passed'
    | 'Weight Escalated'
    | 'Binned & GRA Issued'
    | 'Removal Requested'
    | 'NDC Cleared'
    | 'Gate Out Closed';
  ndcCleared?: boolean;
  outpassNumber?: string;
}

const INITIAL_JOBS: JobRecord[] = [
  {
    id: 'job-001',
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
    escalationTriggered: true, // Triggered > +-5kg
    status: 'Weight Escalated',
    ndcCleared: false,
  },
  {
    id: 'job-003',
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

export const AdminDashboard: React.FC = () => {
  const { currentUser, currentRole, switchRole, logout, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobRecord[]>(INITIAL_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all_jobs' | 'inward' | 'removals' | 'ndc' | 'registers' | 'roles'>('all_jobs');

  // Form State for Quick Job Creation (SOP 4.1.1 Rule: 1 BOE = 1 Job Number)
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('');
  const [newBoe, setNewBoe] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPackages, setNewPackages] = useState<number>(10);
  const [newDeclaredWeight, setNewDeclaredWeight] = useState<number>(1000);

  // Quick Action for Weight Delta Testing (SOP 4.1.8)
  const handleSimulateWeighing = (jobId: string, actualWeight: number) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const delta = Number((actualWeight - j.declaredWeightKg).toFixed(2));
          const triggered = Math.abs(delta) > 5;
          return {
            ...j,
            actualWeightKg: actualWeight,
            weightVarianceKg: delta,
            escalationTriggered: triggered,
            status: triggered ? 'Weight Escalated' : 'Binned & GRA Issued',
          };
        }
        return j;
      })
    );
  };

  // Quick Action for Accounts NDC Clearance (SOP 4.2.6)
  const handleIssueNDC = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            ndcCleared: true,
            status: 'NDC Cleared',
            outpassNumber: `GL-GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          };
        }
        return j;
      })
    );
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newSeq = jobs.length + 91;
    const created: JobRecord = {
      id: `job-${Date.now()}`,
      jobNumber: `GL-JOB-2026-00${newSeq}`,
      customerName: newCustomer || 'Global Importers Corp',
      boeNumber: newBoe || `BOE-908${Math.floor(1000 + Math.random() * 9000)}`,
      boeDate: new Date().toISOString().split('T')[0],
      bondNumber: '2002591018',
      cargoDesc: newDesc || 'General Bonded Consignment',
      packages: Number(newPackages),
      declaredWeightKg: Number(newDeclaredWeight),
      status: 'Space Cert Issued',
    };
    setJobs([created, ...jobs]);
    setShowNewJobModal(false);
    setNewCustomer('');
    setNewBoe('');
    setNewDesc('');
  };

  const roleMeta = SOP_ROLES.find((r: SOPRole) => r.id === currentRole) || SOP_ROLES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SEO
        title="Operations Dashboard | Gorod Logistics CBW"
        description="Comprehensive Customs Bonded Warehouse operations and statutory compliance dashboard."
      />

      {/* Top Bar Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Gorod Logistics" className="h-8 w-auto object-contain" />
              <div className="hidden sm:block">
                <span className="font-extrabold text-sm tracking-wider text-white">GOROD LOGISTICS</span>
                <span className="text-[10px] block text-red-400 font-mono -mt-1">CBW TRV1U001 &bull; ERP DESK</span>
              </div>
            </Link>
          </div>

          {/* Role Quick Switcher */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Switch Role:</span>
              <select
                value={currentRole || 'warehouse_keeper'}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                {Object.entries(PRESET_USERS).map(([roleKey, u]) => (
                  <option key={roleKey} value={roleKey} className="bg-slate-900 text-white">
                    {u.full_name} ({u.role.replace('_', ' ').toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-xs font-bold text-white">{currentUser?.full_name}</div>
                <div className="text-[10px] text-red-400 font-mono">{currentUser?.badge_number}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Role Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Statutory Authority: {roleMeta.title}</span>
              </div>
              <h1 className="text-2xl font-black text-white">{currentUser?.department}</h1>
              <p className="text-xs text-slate-400 max-w-2xl">{roleMeta.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/sop"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                <span>Open 21-Page SOP Manual</span>
              </Link>

              {(currentRole === 'admin_compliance' || currentRole === 'warehouse_keeper') && (
                <button
                  onClick={() => setShowNewJobModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#852929] hover:bg-[#6b2020] text-xs font-bold text-white transition-all shadow-md shadow-red-950/40"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Register Inward BOE (SOP 4.1.1)</span>
                </button>
              )}
            </div>
          </div>

          {/* Role Key Responsibilities Pills */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {roleMeta.keyResponsibilities.slice(0, 4).map((resp: string, i: number) => (
              <div key={i} className="flex items-center gap-2 text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Total Active Jobs</span>
            <span className="text-2xl font-black text-white">{jobs.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-1">1:1 BOE Ratio Enforced</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">±5 kg Weight Escalations</span>
            <span className="text-2xl font-black text-amber-400">
              {jobs.filter((j) => j.escalationTriggered).length}
            </span>
            <span className="text-[10px] text-amber-300 block mt-1">SOP 4.1.8 Hold Active</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Accounts NDC Clearances</span>
            <span className="text-2xl font-black text-purple-400">
              {jobs.filter((j) => j.ndcCleared).length}
            </span>
            <span className="text-[10px] text-purple-300 block mt-1">Gate Pass Unlocked</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-xs text-slate-400 block">Database Sync</span>
            <span className="text-sm font-bold text-white block mt-1">
              {isSupabaseConnected ? 'PostgreSQL Active' : 'Local Mock Cache'}
            </span>
            <span className="text-[10px] text-slate-500 block">schema: supabase_sop_schema.sql</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all_jobs', label: 'All Jobs & Consignments' },
              { id: 'inward', label: 'Inward & ±5 kg Verification' },
              { id: 'removals', label: 'Outward Removals & Outpass' },
              { id: 'ndc', label: 'Accounts NDC Desk' },
              { id: 'roles', label: 'Role Authority Matrix' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#852929] text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Job, BOE, Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Main Job Master Table */}
        {activeTab !== 'roles' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 font-semibold">Job / Reference</th>
                    <th className="py-3 px-4 font-semibold">Bill of Entry (BOE)</th>
                    <th className="py-3 px-4 font-semibold">Consignee</th>
                    <th className="py-3 px-4 font-semibold">Cargo Particulars</th>
                    <th className="py-3 px-4 font-semibold">Declared vs Scale Wt</th>
                    <th className="py-3 px-4 font-semibold">SOP Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {jobs
                    .filter((j) =>
                      searchTerm
                        ? j.jobNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.boeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          j.customerName.toLowerCase().includes(searchTerm.toLowerCase())
                        : true
                    )
                    .map((job) => (
                      <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white font-mono">{job.jobNumber}</div>
                          <div className="text-[10px] text-slate-500">TRV1U001 &bull; Bond: 2002591018</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200 font-mono">{job.boeNumber}</div>
                          <div className="text-[10px] text-slate-400">Date: {job.boeDate}</div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {job.customerName}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 max-w-[200px] truncate">{job.cargoDesc}</div>
                          <div className="text-[10px] text-slate-500">{job.packages} pkgs &bull; Bin: {job.assignedBin || 'Pending'}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono text-slate-300">
                            Declared: <span className="text-white font-semibold">{job.declaredWeightKg} kg</span>
                          </div>
                          {job.actualWeightKg !== undefined ? (
                            <div className="font-mono text-[11px]">
                              Actual: <span className="text-white font-bold">{job.actualWeightKg} kg</span>{' '}
                              <span
                                className={`font-bold ${
                                  Math.abs(job.weightVarianceKg || 0) > 5 ? 'text-red-400' : 'text-emerald-400'
                                }`}
                              >
                                ({job.weightVarianceKg! > 0 ? `+${job.weightVarianceKg}` : job.weightVarianceKg} kg)
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-400">Awaiting scale check</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                              job.escalationTriggered
                                ? 'bg-red-950/80 border-red-700 text-red-300'
                                : job.ndcCleared
                                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                                : 'bg-blue-950/80 border-blue-700 text-blue-300'
                            }`}
                          >
                            {job.escalationTriggered && <AlertTriangle className="w-3 h-3 text-red-400" />}
                            {job.ndcCleared && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            <span>{job.status}</span>
                          </span>
                          {job.outpassNumber && (
                            <div className="text-[10px] font-mono text-emerald-400 mt-1">
                              Gatepass: {job.outpassNumber}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-y-1">
                          {/* Warehouse Manager / Ops actions */}
                          {currentRole === 'warehouse_manager' && !job.actualWeightKg && (
                            <button
                              onClick={() => handleSimulateWeighing(job.id, job.declaredWeightKg + 6.5)}
                              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] block ml-auto"
                            >
                              Simulate Weigh Scale (+6.5 kg Breach)
                            </button>
                          )}

                          {/* Accounts Team actions */}
                          {currentRole === 'accounts_team' && !job.ndcCleared && (
                            <button
                              onClick={() => handleIssueNDC(job.id)}
                              className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] block ml-auto"
                            >
                              Issue NDC (Clear Dues)
                            </button>
                          )}

                          {/* Warehouse Keeper / Admin actions */}
                          {(currentRole === 'warehouse_keeper' || currentRole === 'admin_compliance') && job.escalationTriggered && (
                            <div className="text-[11px] text-red-400 font-semibold">
                              Notify Customs Bond Officer
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Matrix View */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOP_ROLES.map((role: SOPRole) => (
              <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-300">
                    SOP Section 3
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Escalation: {role.escalationRole}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{role.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{role.summary}</p>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 block">Mandatory SOP Duties:</span>
                  <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                    {role.keyResponsibilities.map((resp: string, i: number) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Job Registration Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-400" />
                <h2 className="text-base font-bold text-white">Register Inward Job (SOP 4.1.1)</h2>
              </div>
              <button
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-xs text-red-300">
              <strong>Job Creation Rule:</strong> Each Bill of Entry (BOE) must have a separate unique Job Number.
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer / Importer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cochin Marine Exports Ltd"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Into-Bond BOE Number</label>
                  <input
                    type="text"
                    required
                    placeholder="BOE-9081234"
                    value={newBoe}
                    onChange={(e) => setNewBoe(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Package Count</label>
                  <input
                    type="number"
                    required
                    value={newPackages}
                    onChange={(e) => setNewPackages(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cargo Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical Diagnostics Sensors"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Declared Gross Weight (kg)</label>
                <input
                  type="number"
                  required
                  value={newDeclaredWeight}
                  onChange={(e) => setNewDeclaredWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#852929] hover:bg-[#6b2020] text-white font-bold"
                >
                  Open Job Reference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
