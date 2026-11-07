import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, PRESET_USERS, UserRole } from '../features/auth/AuthContext';
import { SEO } from '../components/ui/SEO';

const ROLE_OPTIONS: {
  role: UserRole;
  title: string;
  sopRef: string;
  desc: string;
}[] = [
  {
    role: 'warehouse_keeper',
    title: 'Warehouse Keeper',
    sopRef: '3.1 / 4.1.3',
    desc: 'Warehouse custody, Customs liaison, Space Certificate signing, ±5 kg escalation decisions and ICEGATE approvals.',
  },
  {
    role: 'admin_compliance',
    title: 'Admin Team — Compliance',
    sopRef: '3.2 / 4.1.1',
    desc: 'Customer onboarding, BOE to Job creation, Customs email dispatch, GRA issuance and draft monthly returns.',
  },
  {
    role: 'warehouse_manager',
    title: 'Warehouse Manager — Ops',
    sopRef: '3.3 / 4.1.7',
    desc: 'Receipt tally, nine-point checklist, weight delta logging, barcode and bin storage, VAS Section 64 execution.',
  },
  {
    role: 'security_team',
    title: 'Security Team — Main Gate',
    sopRef: '3.4 / 4.1.11',
    desc: 'Inward and outward register logging, vehicle inspection, driver ID checks and Outpass gate-out control.',
  },
  {
    role: 'accounts_team',
    title: 'Accounts Team — Finance',
    sopRef: '3.5 / 4.2.6',
    desc: 'Tariff billing, dues clearance and No-Due Certificate generation unlocking Outpass creation.',
  },
  {
    role: 'customs_bond_officer',
    title: 'Customs Bond Officer',
    sopRef: '3.6 / CBIC',
    desc: 'External oversight, receipt and removal notifications, OTL inspection supervision and discrepancy orders.',
  },
];

const BOND_REGISTER = [
  { label: 'Warehouse', value: 'TRV1U001' },
  { label: 'Bond', value: '2002591018' },
  { label: 'Port code', value: 'INTRV1' },
  { label: 'Jurisdiction', value: 'Thiruvananthapuram' },
  { label: 'Bond officer', value: 'Supt. K. Sharma' },
];

export const LoginPage: React.FC = () => {
  const {
    login,
    enterDemoMode,
    isSupabaseConfigured,
    authMode,
    currentUser,
    error,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('warehouse_keeper');
  const [emailInput, setEmailInput] = useState<string>(PRESET_USERS.warehouse_keeper.email);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authMode === 'supabase' && currentUser) {
      navigate('/admin', { replace: true });
    }
  }, [authMode, currentUser, navigate]);

  const selectedUser = PRESET_USERS[selectedRole];
  const selectedOption = ROLE_OPTIONS.find((option) => option.role === selectedRole)!;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmailInput(PRESET_USERS[role].email);
    clearError();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      await login(emailInput, password, selectedRole);
      navigate('/admin');
    } catch {
      // The context exposes a user-friendly message via `error`.
    } finally {
      setSubmitting(false);
    }
  };

  const handleDirectDemoAccess = (role: UserRole) => {
    enterDemoMode(role);
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#191919] font-sans text-white selection:bg-[#852929] selection:text-white">
      <SEO
        title="Customs Bonded Portal Login | Gorod Logistics"
        description="Statutory role-based authentication portal for Gorod Logistics Customs Bonded Warehouse (TRV1U001)."
      />

      <header className="border-t-2 border-[#852929] border-b border-b-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <img src="/logo-tint.png" alt="Gorod Logistics" className="h-9 w-auto object-contain" />
            <span className="h-7 w-px bg-white/15" />
            <div className="text-[11px] leading-relaxed text-[#c1c1c1]">
              Customs Bonded Warehouse
              <br />
              <span className="text-[#8a8a8a]">TRV1U001 · Bond 2002591018</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[10px] text-[#8a8a8a]">
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 ${
                  isSupabaseConfigured ? 'bg-white' : 'bg-[#852929]'
                }`}
              />
              {isSupabaseConfigured ? 'Directory configured' : 'Local demo only'}
            </span>
            <Link
              to="/"
              className="hidden text-[#c1c1c1] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white sm:inline"
            >
              Public site
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="order-2 border-b border-white/10 px-5 py-8 sm:px-8 lg:order-1 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <h2 className="text-[11px] font-semibold text-white">Bond register</h2>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 lg:block lg:space-y-4">
            {BOND_REGISTER.map((item) => (
              <div key={item.label} className="border-t border-white/10 pt-2">
                <dt className="text-[10px] text-[#8a8a8a]">{item.label}</dt>
                <dd className="mt-0.5 text-[13px] tabular-nums text-white">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="text-[10px] text-[#8a8a8a]">Statutory basis</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[#c1c1c1]">
              Customs Act, 1962
              <br />
              SOP GL-BWH-SOP-01
            </p>
          </div>

          <p className="mt-8 hidden text-[10px] leading-relaxed text-[#8a8a8a] lg:block">
            Directorate of Port, Valiyathura
            <br />
            Thiruvananthapuram, Kerala 695008
          </p>
        </aside>

        <main className="order-1 px-5 py-8 sm:px-8 lg:order-2 lg:px-12 lg:py-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-5">
            <h1 className="text-[28px] font-bold tracking-tight text-white">Sign in</h1>
            <span className="text-[10px] tabular-nums text-[#8a8a8a]">SOP GL-BWH-SOP-01</span>
          </div>

          <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-[#c1c1c1]">
            Select your assigned post. Credentials are checked against the bonded-warehouse
            directory.
          </p>

          <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
            <section aria-labelledby="post-label">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-2">
                <h2 id="post-label" className="text-[11px] font-semibold text-white">
                  Assigned post
                </h2>
                <span className="text-[10px] text-[#8a8a8a]">SOP Section 3</span>
              </div>

              <div role="radiogroup" aria-labelledby="post-label">
                {ROLE_OPTIONS.map((option, index) => {
                  const active = selectedRole === option.role;
                  const officer = PRESET_USERS[option.role];
                  return (
                    <label
                      key={option.role}
                      className={`grid cursor-pointer grid-cols-[28px_minmax(0,1fr)] items-center gap-x-4 border-b border-white/10 px-2 py-2.5 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-white sm:grid-cols-[28px_minmax(0,1fr)_92px] ${
                        active ? 'bg-[#852929]' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="statutory-post"
                        value={option.role}
                        checked={active}
                        onChange={() => handleRoleSelect(option.role)}
                        className="sr-only"
                      />
                      <span
                        className={`text-[11px] tabular-nums ${
                          active ? 'text-white/85' : 'text-[#8a8a8a]'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block truncate text-[13px] font-semibold ${
                            active ? 'text-white' : 'text-[#e8e8e8]'
                          }`}
                        >
                          {option.title}
                        </span>
                        <span
                          className={`block truncate text-[10px] ${
                            active ? 'text-white/85' : 'text-[#8a8a8a]'
                          }`}
                        >
                          {officer.full_name} · {officer.badge_number}
                        </span>
                      </span>
                      <span
                        className={`hidden text-right text-[10px] tabular-nums sm:block ${
                          active ? 'text-white/85' : 'text-[#8a8a8a]'
                        }`}
                      >
                        {option.sopRef}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4">
                <p className="text-[10px] text-[#8a8a8a]">Selected post</p>
                <p className="mt-1 text-[12px] text-[#e8e8e8]">
                  {selectedUser.full_name} · {selectedUser.badge_number}
                </p>
                <p className="mt-0.5 text-[11px] text-[#8a8a8a]">{selectedUser.department}</p>
                <p className="mt-2 max-w-[62ch] text-[11px] leading-relaxed text-[#c1c1c1]">
                  {selectedOption.desc}
                </p>
              </div>
            </section>

            <section
              aria-labelledby="credentials-label"
              className="xl:border-l xl:border-white/10 xl:pl-12"
            >
              <div className="flex items-baseline justify-between border-b border-white/15 pb-2">
                <h2 id="credentials-label" className="text-[11px] font-semibold text-white">
                  Credentials
                </h2>
                <span className="text-[10px] text-[#8a8a8a]">Badge holder</span>
              </div>

              <form onSubmit={handleLogin} className="mt-5 space-y-5">
                <div>
                  <label htmlFor="assigned-email" className="block text-[10px] text-[#8a8a8a]">
                    Assigned email
                  </label>
                  <input
                    id="assigned-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (error) clearError();
                    }}
                    autoComplete="username"
                    className="mt-1 w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-sm text-white caret-white placeholder:text-[#8a8a8a] focus:border-white focus:outline-none focus:ring-0"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="assigned-password" className="text-[10px] text-[#8a8a8a]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-[10px] text-[#c1c1c1] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    id="assigned-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) clearError();
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your passcode"
                    className="mt-1 w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-sm text-white caret-white placeholder:text-[#8a8a8a] focus:border-white focus:outline-none focus:ring-0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPassword('Gorod@2026');
                      clearError();
                    }}
                    className="mt-2 text-[10px] text-[#8a8a8a] underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#c1c1c1] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    Use the demo password
                  </button>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="border border-[#852929] bg-[#2a1414] px-3 py-2.5 text-[11px] leading-relaxed text-[#f0c9c9]"
                  >
                    {error}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#852929] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#9a3232] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Checking credentials…' : 'Sign in'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectDemoAccess(selectedRole)}
                    disabled={submitting}
                    className="w-full border border-white/15 px-5 py-2.5 text-[11px] font-semibold text-[#c1c1c1] transition-colors hover:border-white/30 hover:text-white focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Use a local demo session
                  </button>

                  <p className="text-[10px] leading-relaxed text-[#8a8a8a]">
                    Local demo runs in this browser only. No records are written to the database.
                  </p>
                </div>
              </form>
            </section>
          </div>
        </main>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-4 text-[10px] leading-relaxed text-[#8a8a8a] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>
            Authorised personnel only. Unauthorised access to Customs bonded records is punishable
            under Sections 132 and 135, Customs Act 1962.
          </p>
          <div className="flex items-center gap-4">
            <span>Directorate of Port, Valiyathura</span>
            <Link
              to="/"
              className="text-[#c1c1c1] underline decoration-white/25 underline-offset-4 transition-colors hover:text-white sm:hidden"
            >
              Public site
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
