import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Ship,
  Truck,
  FileText,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';

export const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Customs-Bonded Logistics &amp; Warehousing Services"
        description="Comprehensive bonded warehousing, air cargo, sea freight, cargo handling, and part-delivery services in Thiruvananthapuram, Kerala."
      />

      <PageHeader
        badge="Operations &amp; Solutions"
        title="Customs-Bonded Logistics &amp; Warehousing Services"
        description="Full-spectrum bonded storage and freight support for importers, customs brokers, and international freight forwarders in Thiruvananthapuram, Kerala."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services' },
        ]}
        action={
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <span>Request Service Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Service Classification Notice */}
        <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-blue-950">Service Classification &amp; Publication Status</div>
            <p className="leading-relaxed">
              Services marked with <span className="font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">CONFIRMED TARIFF</span> correspond directly to the published Public Bonded Warehouse Tariff schedules effective 1 May 2026. Services marked <span className="font-semibold text-slate-800 bg-slate-200 px-1.5 py-0.5 rounded">QUOTED ON REQUEST</span> require preliminary operational assessment before quotation.
            </p>
          </div>
        </div>

        {/* Confirmed Services Section */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1 block">
              Core Published Tariffs
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Confirmed Customs-Bonded Services
            </h2>
            <p className="text-sm text-slate-600">
              Directly backed by the official published tariff schedules (Effective 1 May 2026).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1: Air Cargo */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    CONFIRMED TARIFF
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Air Cargo Bonded Warehousing</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Consignment-based intake, secure holding, and clearance processing for international air freight shipments arriving via air cargo networks.
                </p>
                <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
                  <div>&bull; Bonding: ₹1/kg (Min ₹1,000)</div>
                  <div>&bull; De-bonding: ₹1/kg (Min ₹1,000)</div>
                  <div>&bull; Storage: ₹4/kg/week (Min ₹1,000; min 1 week)</div>
                  <div>&bull; Special Cargo: +30% surcharge</div>
                </div>
              </div>
              <Link
                to="/tariffs/air-cargo"
                className="pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Air Cargo Tariff &amp; Rates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 2: Sea Cargo */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg">
                    <Ship className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    CONFIRMED TARIFF
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Sea Cargo Covered Bonded Storage</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dedicated covered floor and bay allocations for FCL/LCL sea freight consignments. Square-metre billing designed for container unstuffing and storage.
                </p>
                <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
                  <div>&bull; Covered Storage: ₹150/m²/week (Min 4 weeks)</div>
                  <div>&bull; 20-Foot Allocation: Min 20 m²</div>
                  <div>&bull; 40-Foot Allocation: Min 40 m²</div>
                </div>
              </div>
              <Link
                to="/tariffs/sea-cargo"
                className="pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View Sea Cargo Tariff &amp; Rates <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 3: Material Handling */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    CONFIRMED TARIFF
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Inward &amp; Outward Cargo Handling</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Comprehensive offloading, staging, pallet positioning, and outward loading using 3 MT industrial forklifts or manual labour.
                </p>
                <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
                  <div>&bull; Air Handling: ₹4/kg (Min ₹1,000)</div>
                  <div>&bull; Sea 20ft: ₹4,000 (3 MT Forklift) / ₹2,500 manual</div>
                  <div>&bull; Sea 40ft: ₹5,000 (3 MT Forklift) / ₹3,500 manual</div>
                </div>
              </div>
              <Link
                to="/facilities"
                className="pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800"
              >
                Inspect Equipment &amp; Capabilities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Service 4: Part Delivery */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    CONFIRMED TARIFF
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Part Delivery Staging &amp; Handover</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Physical segregation of bonded consignments to facilitate partial customs clearances under Section 68 (ex-bond Bill of Entry).
                </p>
                <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
                  <div>&bull; Air Part Delivery: ₹2/kg (Min ₹500)</div>
                  <div>&bull; Sea Part Delivery: ₹500 manual / ₹750 mechanical</div>
                </div>
              </div>
              <Link
                to="/tariffs/air-cargo"
                className="pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Calculate Part Delivery Charges <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* On-Demand & Value-Added Services */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1 block">
              Quoted Upon Request
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Value-Added &amp; Transportation Services
            </h2>
            <p className="text-sm text-slate-600">
              Commercial services quoted individually on operational assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <Truck className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  QUOTED ON REQUEST
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">Bonded Transportation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated container trucking and sealed vehicle cartage from port/airport cargo complexes to our bonded facility in Thiruvananthapuram under customs transit permission.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <Layers className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  QUOTED ON REQUEST
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">Palletization &amp; Re-Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repacking, industrial strapping, shrink-wrapping, and wooden crating for fragile or export/domestic distribution staging.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-slate-700" />
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                  QUOTED ON REQUEST
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900">Customs Examination Assistance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staging cargo for customs appraisers, sample drawing, customs officer escorts, and customs overtime coordination.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Require Tailored Bonded Storage or Logistics?</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Our operations team in Thiruvananthapuram will review your consignment parameters and provide an itemised proforma quotation.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            Contact Operations Desk
          </Link>
        </div>
      </div>
    </>
  );
};
