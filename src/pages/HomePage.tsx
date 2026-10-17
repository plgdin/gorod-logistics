import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plane,
  Ship,
  Warehouse,
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Layers,
  Truck,
  Building2,
  Lock,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { TariffCalculatorWidget } from '../features/tariff-calculator/components/TariffCalculatorWidget';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Customs Bonded Warehouse &amp; Cargo Freight Solutions"
        description="Ankit Logistics provides premier public customs-bonded warehousing, air cargo, and sea freight handling in Thiruvananthapuram, Kerala. Official transparent tariffs and calculator."
      />

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Customs-Bonded Warehouse &bull; Thiruvananthapuram</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Precision Logistics.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
                  Customs-Bonded Security.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                Ankit Logistics operates public bonded warehousing and specialized freight handling in Thiruvananthapuram, Kerala. Defer customs duties, stage international cargo, and streamline air and sea consignment logistics with verified, transparent published tariffs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#tariffs-preview"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Explore Our Tariffs</span>
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Key Trust Pillars */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-slate-200 text-sm">Sec. 57/58 Compliant</div>
                  <div className="text-slate-400 mt-0.5">Indian Customs Act</div>
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-sm">Air &amp; Sea Cargo</div>
                  <div className="text-slate-400 mt-0.5">Dual-modal staging</div>
                </div>
                <div>
                  <div className="font-bold text-slate-200 text-sm">Effective 1 May 2026</div>
                  <div className="text-slate-400 mt-0.5">Published transparent rates</div>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-blue-400" />
                    <span className="font-bold text-sm text-white">Facility Operational Overview</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    Active Operations
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3.5">
                    <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0">
                      <Plane className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-200">Air Cargo Staging</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Bonding from ₹1/kg, Handling ₹4/kg, Storage ₹4/kg/week. Consignment minimums enforced.
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3.5">
                    <div className="p-2 bg-sky-600/20 text-sky-400 rounded-lg shrink-0">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-200">Covered Sea Freight Storage</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        ₹150/m²/week with minimum 4-week billing. 20ft (min 20m²) and 40ft (min 40m²) container allocations.
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3.5">
                    <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-slate-200">Customs Custody &amp; Part Deliveries</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Partial clearances permitted under customs supervision. Manual &amp; mechanical handling options.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/40 rounded-lg border border-blue-900/40 text-xs text-blue-300 flex items-center justify-between">
                  <span>Location: Thiruvananthapuram, Kerala</span>
                  <Link to="/about" className="font-semibold text-blue-400 hover:text-white flex items-center gap-1">
                    About facility <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Integrated Customs-Bonded Services
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Designed for importers, customs brokers (CBs), and freight forwarders requiring secure custody and flexible customs de-bonding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Air Cargo */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Air Cargo Warehousing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fast consignment bonding, de-bonding, and storage for international air freight. Weekly storage billing with transparent per-kilogram rates.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; Storage: ₹4/kg/week (Min ₹1,000)</div>
                  <div>&bull; Inward/Outward Handling: ₹4/kg</div>
                </div>
              </div>
              <Link
                to="/tariffs/air-cargo"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Air Tariff &amp; Rules <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Sea Cargo */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
                  <Ship className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Sea Freight Covered Storage</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Covered bonded space for 20ft and 40ft container cargo. Dedicated bay allocation calculated by square metre with a 4-week minimum billing period.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; Covered Storage: ₹150/m²/week</div>
                  <div>&bull; Container Allocation: Min 20m² (20ft) / 40m² (40ft)</div>
                </div>
              </div>
              <Link
                to="/tariffs/sea-cargo"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View Sea Tariff &amp; Rules <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Mechanical Cargo Handling */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Cargo Handling &amp; Equipment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Manual labour and heavy-duty 3 MT mechanical forklift operations for inward offloading, staging, pallet positioning, and outward loading.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; 20ft Mechanical: ₹4,000 / Manual: ₹2,500</div>
                  <div>&bull; 40ft Mechanical: ₹5,000 / Manual: ₹3,500</div>
                </div>
              </div>
              <Link
                to="/facilities"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                Inspect Equipment &amp; Facility <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 4: Part Delivery */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Part-Delivery Clearance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Clear goods in batches against successive Bill of Entry (ex-bond) filings while keeping remaining consignments safely under customs bond.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; Air Part Delivery: ₹2/kg (Min ₹500)</div>
                  <div>&bull; Sea Part Delivery: ₹500 manual / ₹750 mechanical</div>
                </div>
              </div>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Learn About Part Deliveries <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 5: Customs Documentation */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Documentation &amp; Compliance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rigorous bonded ledger maintenance, customs into-bond and ex-bond register entries, and official consignment certification.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; Sea Consignment Doc: ₹2,500 fixed</div>
                  <div>&bull; Standard statutory register maintenance</div>
                </div>
              </div>
              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                View Regulatory Procedures <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 6: Value-Added on Request */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center mb-5">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Value-Added &amp; Transport</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bonded trucking from airport and port terminals, palletization, shrink-wrapping, and heavy crane handling available on commercial request.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-700 font-semibold space-y-1">
                  <div>&bull; Quoted individually on request</div>
                  <div>&bull; Tailored handling for special cargo</div>
                </div>
              </div>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-blue-600"
              >
                Inquire for Rates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Tariff Preview Cards Section */}
      <section id="tariffs-preview" className="py-20 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Published Bonded Warehouse Tariffs
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Official rates effective <strong>1 May 2026</strong>. No hidden markups. Enforced minimums and billing rules clearly documented.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Air Cargo Tariff Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider">
                Effective 1 May 2026
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Air Cargo Bonded Tariff</h3>
                    <p className="text-xs text-slate-500">Per-Kilogram &amp; Consignment Minimum Rates</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Bonding Formalities</span>
                    <span className="font-bold text-slate-900">₹1 / kg <span className="text-xs font-normal text-slate-500">(Min ₹1,000)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">De-bonding Formalities</span>
                    <span className="font-bold text-slate-900">₹1 / kg <span className="text-xs font-normal text-slate-500">(Min ₹1,000)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Inward / Outward Handling</span>
                    <span className="font-bold text-slate-900">₹4 / kg <span className="text-xs font-normal text-slate-500">(Min ₹1,000)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Part Delivery Handling</span>
                    <span className="font-bold text-slate-900">₹2 / kg <span className="text-xs font-normal text-slate-500">(Min ₹500)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Bonded Storage</span>
                    <span className="font-bold text-slate-900">₹4 / kg / week <span className="text-xs font-normal text-slate-500">(Min ₹1,000)</span></span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Storage Period Policy:</div>
                  <div>Minimum chargeable storage is 1 week. 8 days is billed as 2 weeks (ceiling rounding).</div>
                  <div className="text-amber-800 font-medium pt-1">
                    *Special cargo (valuable / hazardous) attracts a 30% surcharge.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <Link
                  to="/tariffs/air-cargo"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <span>Open Air Tariff &amp; Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Sea Cargo Tariff Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-900 text-white text-[11px] font-bold px-4 py-1 rounded-bl-lg uppercase tracking-wider">
                Effective 1 May 2026
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100">
                    <Ship className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Sea Cargo Bonded Tariff</h3>
                    <p className="text-xs text-slate-500">Covered Area (₹150/m²/wk) &amp; Container Handling</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Covered Storage</span>
                    <span className="font-bold text-slate-900">₹150 / m² / week <span className="text-xs font-normal text-slate-500">(Min 4 weeks)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">20ft Container Minimum Area</span>
                    <span className="font-bold text-slate-900">20 m² <span className="text-xs font-normal text-slate-500">(Required min)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">40ft Container Minimum Area</span>
                    <span className="font-bold text-slate-900">40 m² <span className="text-xs font-normal text-slate-500">(Required min)</span></span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Handling (20ft Container)</span>
                    <span className="font-bold text-slate-900">₹4,000 <span className="text-xs font-normal text-slate-500">(3 MT Forklift)</span> / ₹2,500 manual</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Handling (40ft Container)</span>
                    <span className="font-bold text-slate-900">₹5,000 <span className="text-xs font-normal text-slate-500">(3 MT Forklift)</span> / ₹3,500 manual</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
                    <span className="text-slate-600 font-medium">Bond Documentation</span>
                    <span className="font-bold text-slate-900">₹2,500 / consignment</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-800">Storage Billing Policy:</div>
                  <div>Published unit is explicitly per square metre per week with a mandatory 4-week minimum.</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <Link
                  to="/tariffs/sea-cargo"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <span>Open Sea Tariff &amp; Calculator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Embed */}
          <div className="pt-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Interactive Consignment Cost Estimator
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Simulate your warehouse charges instantly with our rules engine before submitting paperwork.
              </p>
            </div>

            <TariffCalculatorWidget />
          </div>
        </div>
      </section>

      {/* Clear Quotation & Enquiry Process */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2 block">
              Workflow Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Customs Bonding &amp; Clearance Process
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              From initial enquiry to physical intake and duty-deferred release, our standardized 4-step workflow ensures full compliance with Indian Customs guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 text-sm shadow">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Tariff &amp; Space Enquiry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit cargo weight, volume, container size, and anticipated storage duration via our calculator or enquiry desk.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 text-sm shadow">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Customs Filing &amp; Bond</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verification of Into-Bond Bill of Entry, Section 59 bond execution, and space availability certification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 text-sm shadow">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Intake &amp; Bonded Custody</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Physical cargo receipt, mechanical or manual handling, tally verification, and allocation to designated covered warehouse bay.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center mb-4 text-sm shadow">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Ex-Bond / Part Clearance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Duty payment by importer, Ex-Bond Bill of Entry (Sec. 68), customs gate pass issuance, and outward dispatch handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Highlight Section */}
      <section className="py-20 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                Warehouse Infrastructure
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Engineered for Safe, Bonded Cargo Staging
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Our facility in Thiruvananthapuram provides covered bonded storage with heavy load-bearing flooring, 3 MT forklift material handling, secure perimeters, and designated inspection bays for customs officers and appraisers.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    Dedicated covered floor storage zoned for 20-foot and 40-foot container unstuffing.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    Mechanical material handling utilizing 3 MT industrial forklifts and trained operators.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">
                    Round-the-clock physical security, access control, and bonded cargo registers.
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/facilities"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
                >
                  <span>Explore Facility Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <Warehouse className="w-8 h-8 text-blue-400" />
                  <div className="font-bold text-white text-base">Covered Bay Storage</div>
                  <div className="text-xs text-slate-400">Weather-protected storage with demarcated consignment zones.</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <Truck className="w-8 h-8 text-sky-400" />
                  <div className="font-bold text-white text-base">3 MT Forklift Operations</div>
                  <div className="text-xs text-slate-400">Mechanized pallet lifting, container un-stuffing, and heavy handling.</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <FileCheck2 className="w-8 h-8 text-emerald-400" />
                  <div className="font-bold text-white text-base">Customs Examination Bay</div>
                  <div className="text-xs text-slate-400">Clean physical staging for customs officers and cargo sampling.</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                  <Lock className="w-8 h-8 text-amber-400" />
                  <div className="font-bold text-white text-base">Bonded Ledger Controls</div>
                  <div className="text-xs text-slate-400">Strict statutory inventory tracking and dual-custody verification.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Enquiry Banner */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Stage Your Cargo Under Customs Bond?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-base">
            Contact our operations team in Thiruvananthapuram for space reservations, customs bonding documentation, or customized logistics tariffs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-lg bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm transition-colors shadow-md"
            >
              Submit Storage Enquiry
            </Link>
            <Link
              to="/tariffs/air-cargo"
              className="px-6 py-3.5 rounded-lg bg-blue-800 hover:bg-blue-900 text-white font-semibold text-sm transition-colors border border-blue-400/30"
            >
              Check Tariff Schedules
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
