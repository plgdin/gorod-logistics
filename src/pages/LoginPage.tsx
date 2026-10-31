import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  FileCheck2,
  Boxes,
  Shield,
  Receipt,
  Scale,
} from 'lucide-react';
import { useAuth, PRESET_USERS, UserRole } from '../features/auth/AuthContext';
import { SEO } from '../components/ui/SEO';

const ROLE_CARDS: {
  role: UserRole;
  title: string;
  sopRef: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    role: 'warehouse_keeper',
    title: 'Warehouse Keeper',
    sopRef: 'SOP 3.1 & 4.1.3',
    desc: 'Overall warehouse custody, Customs liaison, Space Certificate signing, ±5 kg escalation decisions, ICEGATE approvals.',
    icon: ShieldCheck,
    color: 'from-red-900/60 to-red-950/80 border-red-800 text-red-300',
  },
  {
    role: 'admin_compliance',
    title: 'Admin Team (Compliance)',
    sopRef: 'SOP 3.2 & 4.1.1',
    desc: 'Customer onboarding, 1:1 BOE to Job creation, Customs email dispatch, GRA issuance, draft monthly returns.',
    icon: FileCheck2,
    color: 'from-blue-900/60 to-blue-950/80 border-blue-800 text-blue-300',
  },
  {
    role: 'warehouse_manager',
    title: 'Warehouse Manager (Ops)',
    sopRef: 'SOP 3.3 & 4.1.7',
    desc: 'Receipt tally, 9-point checklist, weight delta logging, barcode/bin storage, VAS Section 64 execution.',
    icon: Boxes,
    color: 'from-amber-900/60 to-amber-950/80 border-amber-800 text-amber-300',
  },
  {
    role: 'security_team',
    title: 'Security Team (Main Gate)',
    sopRef: 'SOP 3.4 & 4.1.11',
    desc: 'Physical inward & outward register logging, vehicle inspection, driver ID checks, Outpass gate-out exit control.',
    icon: Shield,
    color: 'from-emerald-900/60 to-emerald-950/80 border-emerald-800 text-emerald-300',
  },
  {
    role: 'accounts_team',
    title: 'Accounts Team (Finance)',
    sopRef: 'SOP 3.5 & 4.2.6',
    desc: 'Tariff billing, dues clearance, mandatory No-Due Certificate (NDC) generation unlocking Outpass creation.',
    icon: Receipt,
    color: 'from-purple-900/60 to-purple-950/80 border-purple-800 text-purple-300',
  },
  {
    role: 'customs_bond_officer',
    title: 'Customs Bond Officer',
    sopRef: 'SOP 3.6 & Statutory CBIC',
    desc: 'External oversight, receipt/removal notifications, OTL inspection supervision, discrepancy orders.',
    icon: Scale,
    color: 'from-slate-800/80 to-slate-900/90 border-slate-700 text-slate-200',
  },
];

export const LoginPage: React.FC = () => {
  const { login, switchRole, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('warehouse_keeper');
  const [emailInput, setEmailInput] = useState<string>(PRESET_USERS.warehouse_keeper.email);
  const [password, setPassword] = useState<string>('••••••••••••');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmailInput(PRESET_USERS[role].email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(emailInput, selectedRole);
    navigate('/admin');
  };

  const handleDirectDemoAccess = (role: UserRole) => {
    switchRole(role);
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <SEO
        title="Customs Bonded Portal Login | Gorod Logistics"
        description="Statutory role-based authentication portal for Gorod Logistics Customs Bonded Warehouse (TRV1U001)."
      />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700/60 text-red-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Customs Bonded Warehouse Portal &bull; TRV1U001 &bull; Bond: 2002591018</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Role-Based Statutory Access
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Select your assigned statutory department according to SOP Section 3. Every operation in the warehouse is role-segregated and audited.
          </p>
          <div className="text-xs text-slate-500">
            Database Status:{' '}
            {isSupabaseConnected ? (
              <span className="text-emerald-400 font-semibold">Supabase Connected (Live)</span>
            ) : (
              <span className="text-amber-400 font-semibold">Ready for Supabase Credentials (Running in Local SOP Demo Mode)</span>
            )}
          </div>
        </div>

        {/* Role Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedRole === card.role;
            return (
              <div
                key={card.role}
                onClick={() => handleRoleSelect(card.role)}
                className={`relative rounded-xl border p-5 cursor-pointer transition-all bg-gradient-to-b ${card.color} ${
                  isSelected ? 'ring-2 ring-red-500 scale-[1.02] shadow-xl' : 'opacity-85 hover:opacity-100 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 border border-white/10 text-slate-300">
                    {card.sopRef}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5">
                  <h3 className="font-bold text-base text-white">{card.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-[180px]">
                    {PRESET_USERS[card.role].email}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectDemoAccess(card.role);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded transition-colors"
                  >
                    <span>Instant Login</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Credentials Form Box */}
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <Lock className="w-5 h-5 text-red-400" />
            <div>
              <div className="font-bold text-sm text-white">Sign In to SOP Operations Desk</div>
              <div className="text-xs text-slate-400">Authenticated role: <strong className="text-white">{PRESET_USERS[selectedRole].full_name}</strong></div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Assigned Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Passcode / Secret</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#852929] hover:bg-[#6b2020] text-white font-bold text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Authenticate as {PRESET_USERS[selectedRole].full_name}</span>
            </button>
          </form>

          <div className="text-[11px] text-slate-500 text-center">
            Statutory CBIC Notice: Unauthorized entry into Customs Bonded Warehouse records is punishable under Section 132/135 of the Customs Act 1962.
          </div>
        </div>
      </div>
    </div>
  );
};
