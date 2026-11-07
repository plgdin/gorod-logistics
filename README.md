# Gorod Logistics — Public Website, Tariff System & CBW Operations Desk

Professional, production-quality public website, tariff calculation engine, and statutory Customs Bonded Warehouse operations desk for **Gorod Logistics**, a customs-bonded warehouse and cargo logistics provider operating in Thiruvananthapuram, Kerala, India.

---

## 1. Quick Start

### Prerequisites
- Node.js **22.12+** (recommended: current LTS)
- npm 9+

### Installation & Execution
```bash
# Install dependencies
npm install

# Run the test suite (18 tests across 4 files)
npm test

# Type-check only
npm run typecheck

# Launch local development server
npm run dev

# Compile production build
npm run build
```

---

## 2. Backend Go-Live (Supabase)

The operations desk (`/admin`) and SOP manual (`/sop`) are backed by Supabase. The production path has **no demo fallback**: if Supabase is not configured, or the signed-in account has no statutory profile role, the desk refuses to load or write records.

### 2.1 Environment
Put the project URL and **anon** key in `.env.local`:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### 2.2 Database migrations
Open the [SQL Editor](https://supabase.com/dashboard/project/_/sql/new) and run, in this order:

1. `supabase_sop_schema.sql`
2. `supabase_live_setup.sql`
3. `supabase_production_hardening.sql`

All three are idempotent and safe to re-run.

`supabase_production_hardening.sql` adds the role-checked RPCs, the extended `dashboard_jobs` view, role-scoped RLS policies, and the `audit_logs` trail. **The new action dialogs will not work until this file has been applied** — they will return a “Database functions are not installed” error.

### 2.3 Staff accounts
Provision real staff through Supabase Auth, then set each user's statutory `role` in `profiles`:

- `warehouse_keeper`
- `admin_compliance`
- `warehouse_manager`
- `security_team`
- `accounts_team`
- `customs_bond_officer`

That profile role is the authority used by both the UI and the database RLS policies/RPCs. There is no in-app role switcher.

> Security note: the anon key is safe to ship in the browser. Never put the
> `service_role` key in `VITE_*` variables. Direct writes to statutory tables are
> denied; every weighment, removal, NDC, outpass, gate-out, notification, and hold
> resolution goes through a role-checked RPC and writes an `audit_logs` row.

---

## 3. Demo / Test Accounts (Development Only)

`supabase_live_setup.sql` creates **no** demo users or consignments. Test accounts live in `supabase_demo_seed.sql`, which must **never** be run against production.

The current development project already has these accounts provisioned:

| Email | Role | Staff |
|---|---|---|
| `keeper@gorodlogistics.com` | `warehouse_keeper` | Rajesh Nair |
| `compliance@gorodlogistics.com` | `admin_compliance` | Anjali Menon |
| `operations@gorodlogistics.com` | `warehouse_manager` | Vikram Pillai |
| `security@gorodlogistics.com` | `security_team` | Suresh Kumar |
| `accounts@gorodlogistics.com` | `accounts_team` | Pooja Varma |
| `bond.officer@customs.gov.in` | `customs_bond_officer` | Superintendent K. Sharma |

**Password for every test account:** `Gorod@2026`

The seed also adds three sample consignments, including one active weight hold (`GL-JOB-2026-0090`, variance +8.20 kg) for testing the escalation flow.

To re-seed a development project:

```
supabase_demo_seed.sql
```

Sign out and sign in with a different account to test each role's authority.

---

## 4. Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 with custom enterprise design tokens
- **Routing**: React Router v7 (`createBrowserRouter`)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Database & Auth**: Supabase (`@supabase/supabase-js`)
- **Testing**: Vitest

---

## 5. CBW Operations Desk

The `/admin` desk implements the statutory workflow in `SOP GL-BWH-SOP-01` (Customs Act, 1962; Sec 57/58). UI actions are gated by profile role, and the database independently re-checks the role in each RPC.

| Step | Action | Authorised role |
|---|---|---|
| 1 | Register inward BOE (1:1 BOE-to-job) | `admin_compliance`, `warehouse_keeper` |
| 2 | Record weighment + nine-point pre-unloading checklist | `warehouse_manager`, `admin_compliance`, `warehouse_keeper` |
| 3 | Log Customs notification for a ±5 kg weight breach | `admin_compliance`, `warehouse_keeper` |
| 3 | Resolve weight hold with Customs disposition | `customs_bond_officer`, `warehouse_keeper` |
| 4 | Request outward removal with statutory documents | `admin_compliance`, `warehouse_keeper` |
| 5 | Issue No-Due Certificate (NDC) | `accounts_team` |
| 6 | Issue outpass (requires cleared NDC) | `warehouse_keeper`, `admin_compliance` |
| 7 | Record security gate-out (requires outpass) | `security_team` |

Removal types supported:

- **Home consumption (Sec 68)** — ex-bond BOE, OOC, duty payment challan
- **Re-export (Sec 69)** — shipping bill, LEO, Section 69 order, outward OTL
- **Warehouse transfer (Sec 67)** — Form A, destination warehouse, transfer permission, outward OTL

The statutory weight tolerance is read from `CBW_DETAILS.weightThresholdKg` (±5 kg).

---

## 6. Architecture & Project Layout

```
src/
├── app/
│   ├── App.tsx                   # Top-level application component
│   └── router.tsx                # Client-side router configuration
├── components/
│   ├── auth/
│   │   └── RequireAuth.tsx       # Authenticated-route guard
│   ├── layout/
│   │   ├── Header.tsx            # Wordmark, navigation, mobile drawer
│   │   ├── Footer.tsx            # Disclaimers, links, statutory notes
│   │   └── MainLayout.tsx        # Scroll-to-top & layout wrapper
│   └── ui/
│       ├── Modal.tsx             # Accessible dialog shell
│       ├── PageHeader.tsx        # Breadcrumb & title banner
│       └── SEO.tsx               # Reactive document title & meta tags
├── data/
│   └── tariffs.ts                # Authoritative tariff data config (1 May 2026)
├── features/
│   ├── auth/
│   │   └── AuthContext.tsx       # Supabase session + profile role
│   ├── cbw/
│   │   └── CBWDialogs.tsx        # Statutory action forms & validation
│   ├── sop/
│   │   ├── SOPDocumentTemplates.tsx
│   │   ├── SOPRemovalValidator.tsx
│   │   ├── SOPWeightEscalationTool.tsx
│   │   ├── sopData.ts            # SOP roles, constants & CBW details
│   │   └── sopFull.ts            # Full SOP manual content
│   └── tariff-calculator/
│       ├── calculations.ts       # Pure billing calculations & formatting
│       ├── calculations.test.ts  # Vitest unit tests
│       ├── types.ts              # Calculator inputs & line-item interfaces
│       └── components/
│           ├── AirCargoCalculator.tsx
│           └── SeaCargoCalculator.tsx
├── lib/
│   ├── format.ts                 # kg / currency / date formatters
│   ├── format.test.ts
│   ├── jobsApi.ts                # Dashboard view + role-checked RPC calls
│   ├── jobsApi.test.ts           # Status-derivation tests
│   └── supabase.ts               # Supabase client & health check
├── pages/
│   ├── HomePage.tsx              # Hero, services, tariffs preview, process
│   ├── AirCargoPage.tsx          # Air cargo tariff table, rules, calculator
│   ├── SeaCargoPage.tsx          # Sea cargo tariff table, covered space, calculator
│   ├── ServicesPage.tsx          # Confirmed vs on-request services
│   ├── FacilitiesPage.tsx        # Warehouse bay storage & 3 MT forklift specs
│   ├── AboutPage.tsx             # Operating philosophy & ERP roadmap
│   ├── ContactPage.tsx           # Validated consignment inquiry form
│   ├── LoginPage.tsx             # Supabase staff sign-in
│   ├── AdminDashboard.tsx        # CBW operations desk
│   ├── SOPPage.tsx               # SOP manual & print view
│   ├── SOPPage.render.test.tsx
│   ├── PrivacyPage.tsx           # Draft privacy policy
│   ├── TermsPage.tsx             # Draft terms & conditions
│   └── NotFoundPage.tsx          # 404 handler
├── styles/
│   └── globals.css               # Tailwind CSS v4 & custom tokens
├── types/
│   └── index.ts                  # Shared domain types
├── main.tsx                      # DOM entry point
└── vite-env.d.ts                 # Vite client types

supabase_sop_schema.sql            # Base schema
supabase_live_setup.sql            # Production go-live: RLS, profile trigger, view
supabase_production_hardening.sql  # Role-checked RPCs, audit trail, tightened RLS
supabase_demo_seed.sql             # Dev-only test accounts & sample consignments
```

---

## 7. Tariff Source of Truth (Effective 1 May 2026)

All rates derive directly from `src/data/tariffs.ts`:

### Air Cargo Rates
- **Bonding**: ₹1 / kg (Min ₹1,000 / consignment)
- **De-bonding**: ₹1 / kg (Min ₹1,000 / consignment)
- **Inward / outward handling**: ₹4 / kg (Min ₹1,000 / consignment)
- **Part delivery**: ₹2 / kg (Min ₹500 / consignment)
- **Storage**: ₹4 / kg / week (Min ₹1,000 / consignment; min duration 1 week)
- **Storage billing rule**: Ceiling rounding (`ceil(days / 7)` — e.g. 8 days = 2 chargeable weeks)
- **Special cargo surcharge**: +30% on base tariff (air cargo only)

### Sea Cargo Rates
- **Covered storage**: ₹150 / m² / week (Explicitly weekly; minimum 4 weeks)
- **20-foot container**: Minimum 20 m² area
- **40-foot container**: Minimum 40 m² area
- **Manual handling**: 20ft: ₹2,500 | 40ft: ₹3,500
- **Mechanical handling (3 MT forklift)**: 20ft: ₹4,000 | 40ft: ₹5,000
- **Part delivery**: Manual: ₹500 | Mechanical: ₹750
- **Documentation**: ₹2,500 / consignment

---

## 8. Troubleshooting

| Message | Cause | Fix |
|---|---|---|
| `Database setup is incomplete` | Base schema or go-live SQL missing | Run `supabase_sop_schema.sql`, then `supabase_live_setup.sql` |
| `Database functions are not installed` | Hardening migration missing | Run `supabase_production_hardening.sql` |
| `Your staff role is not authorised` | Profile role does not permit the action | Check `profiles.role` |
| `Your staff profile is not configured with a statutory role` | Auth user has no usable profile | Create/fix the `profiles` row |
| `Authentication is not configured` | Missing `VITE_SUPABASE_*` env vars | Set them and restart the dev server |
| `This Bill of Entry already has a job` | Duplicate BOE | Use the existing job; SOP 4.1.1 is 1:1 |

---

## 9. Outstanding Business Confirmations

The following items are preserved as flagged notes in code and UI, awaiting formal client confirmation:

1. **Insurance Rate Clarification**:
   - The published tariff documents specify *"INR 0.20 Paise/1000 INR of Cargo Value"* (Cargo value = Assessable Value + Duty, min 4 weeks).
   - This wording has denomination ambiguity (0.20 Rupees vs 0.20 Paise per ₹1,000).
   - **Resolution**: Excluded from automated calculation with clear notice until written clarification is received.
2. **Facility Technical Metrics**:
   - Exact gross square footage, ceiling heights, and physical site coordinates have placeholders marked for official site survey documentation.
3. **Backend Communication Dispatcher**:
   - Contact form inquiries log locally in session state with validation; Phase 2 will bind to an email dispatcher / CRM service.
4. **Draft Legal Documents**:
   - Terms and Privacy pages are marked as draft pending legal review.

---

## 10. Verification

Before shipping a change:

```bash
npm run typecheck   # TypeScript must be clean
npm test            # 18 tests across 4 files
npm run build       # tsc + production bundle
```

The CBW desk requires a live Supabase session; manual verification should cover each role in the authority matrix against a development project with `supabase_demo_seed.sql` applied.
