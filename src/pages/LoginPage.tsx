import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { SEO } from '../components/ui/SEO';
import { CBW_DETAILS } from '../features/sop/sopData';

const AUTHORISED_POSTS: {
  title: string;
  sopRef: string;
  desc: string;
}[] = [
  {
    title: 'Warehouse Keeper',
    sopRef: '3.1 / 4.1.3',
    desc: 'Warehouse custody, Customs liaison, Space Certificate signing, ±5 kg escalation decisions and ICEGATE approvals.',
  },
  {
    title: 'Admin Team — Compliance',
    sopRef: '3.2 / 4.1.1',
    desc: 'Customer onboarding, BOE to Job creation, Customs email dispatch, GRA issuance and draft monthly returns.',
  },
  {
    title: 'Warehouse Manager — Ops',
    sopRef: '3.3 / 4.1.7',
    desc: 'Receipt tally, nine-point checklist, weight delta logging, barcode and bin storage, VAS Section 64 execution.',
  },
  {
    title: 'Security Team — Main Gate',
    sopRef: '3.4 / 4.1.11',
    desc: 'Inward and outward register logging, vehicle inspection, driver ID checks and Outpass gate-out control.',
  },
  {
    title: 'Accounts Team — Finance',
    sopRef: '3.5 / 4.2.6',
    desc: 'Tariff billing, dues clearance and No-Due Certificate generation unlocking Outpass creation.',
  },
  {
    title: 'Customs Bond Officer',
    sopRef: '3.6 / CBIC',
    desc: 'External oversight, receipt and removal notifications, OTL inspection supervision and discrepancy orders.',
  },
];

const BOND_REGISTER = [
  { label: 'Warehouse', value: CBW_DETAILS.warehouseCode },
  { label: 'Bond', value: CBW_DETAILS.bondNumber },
  { label: 'Port code', value: 'INTRV1' },
  { label: 'Jurisdiction', value: 'Thiruvananthapuram' },
];

export const LoginPage: React.FC = () => {
  const {
    login,
    isSupabaseConfigured,
    authMode,
    currentUser,
    error,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authMode === 'supabase' && currentUser) {
      navigate('/admin', { replace: true });
    }
  }, [authMode, currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);
    try {
      await login(emailInput, password);
      navigate('/admin');
    } catch {
      // The context exposes a user-friendly message via `error`.
    } finally {
      setSubmitting(false);
    }
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
              <span className="text-[#8a8a8a]">
                {CBW_DETAILS.warehouseCode} · Bond {CBW_DETAILS.bondNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-[10px] text-[#8a8a8a]">
            <span className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 ${
                  isSupabaseConfigured ? 'bg-white' : 'bg-[#852929]'
                }`}
              />
              {isSupabaseConfigured ? 'Directory configured' : 'Directory not configured'}
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
            Sign in with the staff account provisioned by the warehouse keeper. Your assigned
            post and statutory authority are loaded from your staff profile.
          </p>

          <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-12">
            <section aria-labelledby="post-label">
              <div className="flex items-baseline justify-between border-b border-white/15 pb-2">
                <h2 id="post-label" className="text-[11px] font-semibold text-white">
                  Authorised posts
                </h2>
                <span className="text-[10px] text-[#8a8a8a]">SOP Section 3</span>
              </div>

              <div className="divide-y divide-white/10">
                {AUTHORISED_POSTS.map((option, index) => (
                  <div
                    key={option.title}
                    className="grid grid-cols-[28px_minmax(0,1fr)_92px] items-start gap-x-4 px-2 py-2.5"
                  >
                    <span className="pt-0.5 text-[11px] tabular-nums text-[#8a8a8a]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-[#e8e8e8]">
                        {option.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-[#8a8a8a]">
                        {option.desc}
                      </span>
                    </span>
                    <span className="hidden pt-0.5 text-right text-[10px] tabular-nums text-[#8a8a8a] sm:block">
                      {option.sopRef}
                    </span>
                  </div>
                ))}
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
                    placeholder="name@gorodlogistics.com"
                    className="mt-1 w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-sm text-white caret-white placeholder:text-[#6f6f6f] focus:border-white focus:outline-none focus:ring-0"
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
                    className="mt-1 w-full border-0 border-b border-white/20 bg-transparent px-0 py-2.5 text-sm text-white caret-white placeholder:text-[#6f6f6f] focus:border-white focus:outline-none focus:ring-0"
                    required
                  />
                </div>

                {!isSupabaseConfigured && (
                  <div
                    role="alert"
                    className="border border-[#852929] bg-[#2a1414] px-3 py-2.5 text-[11px] leading-relaxed text-[#f0c9c9]"
                  >
                    The authentication directory is not configured. Set the Supabase URL and
                    anon key in the deployment environment before signing in.
                  </div>
                )}

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
                    disabled={submitting || !isSupabaseConfigured}
                    className="w-full bg-[#852929] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#9a3232] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Checking credentials…' : 'Sign in'}
                  </button>

                  <p className="text-[10px] leading-relaxed text-[#8a8a8a]">
                    Access is restricted to authorised Gorod Logistics staff and Customs
                    officers. Contact the warehouse keeper if you need an account.
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
