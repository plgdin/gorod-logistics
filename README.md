# Ankit Logistics — Public Website & Tariff System (Phase 1)

Professional, production-quality public website and tariff calculation engine for **Ankit Logistics**, a customs-bonded warehouse and cargo logistics provider operating in Thiruvananthapuram, Kerala, India.

---

## 1. Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# Install dependencies
npm install

# Run unit tests (7 passing tests covering billing calculations)
npm test

# Launch local development server
npm run dev

# Compile production build
npm run build
```

---

## 2. Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom enterprise design tokens
- **Routing**: React Router v7 (`createBrowserRouter`)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Testing**: Vitest unit test suite

---

## 3. Architecture & Project Layout

```
src/
├── app/
│   ├── App.tsx                   # Top-level application component
│   └── router.tsx                # Client-side router configuration
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Wordmark, navigation, mobile drawer
│   │   ├── Footer.tsx            # Disclaimers, links, statutory notes
│   │   └── MainLayout.tsx        # Scroll-to-top & layout wrapper
│   └── ui/
│       ├── PageHeader.tsx        # Breadcrumb & title banner
│       └── SEO.tsx               # Reactive document title & meta tags
├── data/
│   └── tariffs.ts                # Authoritative tariff data config (1 May 2026)
├── features/
│   └── tariff-calculator/
│       ├── calculations.ts       # Pure billing calculations & formatting
│       ├── calculations.test.ts  # Vitest unit tests (ceiling, minimums, etc.)
│       ├── types.ts              # Calculator inputs & line-item interfaces
│       └── components/
│           ├── AirCargoCalculator.tsx
│           ├── SeaCargoCalculator.tsx
│           └── TariffCalculatorWidget.tsx
├── pages/
│   ├── HomePage.tsx              # Hero, services, tariffs preview, process
│   ├── AirCargoPage.tsx          # Air cargo tariff table, rules, calculator
│   ├── SeaCargoPage.tsx          # Sea cargo tariff table, covered space, calculator
│   ├── ServicesPage.tsx          # Confirmed vs on-request services
│   ├── FacilitiesPage.tsx        # Warehouse bay storage & 3 MT forklift specs
│   ├── AboutPage.tsx             # Operating philosophy & ERP roadmap
│   ├── ContactPage.tsx           # Validated consignment inquiry form
│   ├── PrivacyPage.tsx           # Draft privacy policy
│   ├── TermsPage.tsx             # Draft terms & conditions
│   └── NotFoundPage.tsx          # 404 handler
├── styles/
│   └── globals.css               # Tailwind CSS v4 & custom tokens
├── types/
│   └── index.ts                  # Shared domain types
├── main.tsx                      # DOM entry point
└── vite-env.d.ts                 # Vite client types
```

---

## 4. Tariff Source of Truth (Effective 1 May 2026)

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

## 5. Outstanding Business Confirmations

The following items are preserved as flagged notes in code and UI, awaiting formal client confirmation:

1. **Insurance Rate Clarification**:
   - The published tariff documents specify *"INR 0.20 Paise/1000 INR of Cargo Value"* (Cargo value = Assessable Value + Duty, min 4 weeks).
   - This wording has denomination ambiguity (0.20 Rupees vs 0.20 Paise per ₹1,000).
   - **Resolution**: Excluded from automated calculation with clear notice until written clarification is received.
2. **Facility Technical Metrics**:
   - Exact gross square footage, ceiling heights, and physical site coordinates have placeholders marked for official site survey documentation.
3. **Backend Communication Dispatcher**:
   - Contact form inquiries in Phase 1 log locally in session state with validation; Phase 2 will bind to an email dispatcher / CRM service.
4. **Draft Legal Documents**:
   - Terms and Privacy pages are marked as draft pending legal review.
