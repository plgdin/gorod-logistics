import React from 'react';
import { Link } from 'react-router-dom';
import {
  Warehouse,
  Truck,
  Camera,
  Layers,
  Boxes,
  Lock,
  FileCheck2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';

export const FacilitiesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Warehouse Facilities &amp; Equipment"
        description="Inspect Ankit Logistics customs-bonded warehouse infrastructure, covered bay storage, 3 MT forklift equipment, and cargo handling operations in Thiruvananthapuram."
      />

      <PageHeader
        badge="Infrastructure &amp; Assets"
        title="Customs-Bonded Warehouse Facilities"
        description="Covered storage bays, heavy-duty material handling equipment, and customs-controlled staging infrastructure located in Thiruvananthapuram, Kerala."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Facilities' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Verification Placeholder Callout */}
        <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">Facility Information Note:</span>
            Physical capabilities and equipment listed reflect published operational tariffs (including covered floor storage and 3 MT forklift material handling). Detailed architectural metrics (total covered square footage, bay ceiling clear heights, and electrical sub-station specs) will be updated upon final engineering verification.
          </div>
        </div>

        {/* Section 1: Storage Space & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Warehouse className="w-4 h-4" />
              <span>Covered Storage Space</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Weather-Protected Covered Bay Storage
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed specifically for containerized and palletized cargo requiring customs duty deferment. Floor space is demarcated for 20-foot (minimum 20 m²) and 40-foot (minimum 40 m²) container unstuffing and long-term staging.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <div>
                  <strong>Covered Warehouse Bays:</strong> High-grade industrial concrete flooring rated for heavy pallet stacks and container offload.
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <div>
                  <strong>Flexible Bay Demarcation:</strong> Custom square-metre allocation based on cargo dimensions and statutory customs segregation rules.
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                <div>
                  <strong>Ventilation &amp; Weatherproofing:</strong> Sealed roofing and drainage preventing water ingress during monsoon conditions.
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Total Facility Footprint:</span> [Exact square footage pending business verification]
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Storage Allocation Specifications
                </span>
                <span className="text-xs font-semibold text-blue-600">Tariff Standard</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">20ft Container Bay</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">20 m²</div>
                  <div className="text-[11px] text-slate-400 mt-1">Minimum chargeable area</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">40ft Container Bay</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">40 m²</div>
                  <div className="text-[11px] text-slate-400 mt-1">Minimum chargeable area</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">Covered Storage Tariff</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">₹150</div>
                  <div className="text-[11px] text-slate-400 mt-1">per m² per week</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500">Air Cargo Storage</div>
                  <div className="text-2xl font-black text-blue-600 mt-1">₹4</div>
                  <div className="text-[11px] text-slate-400 mt-1">per kg per week</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Material Handling Equipment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8 border-t border-slate-200">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <Truck className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-sm">3 MT Industrial Forklifts</h4>
                <p className="text-xs text-slate-600">
                  Heavy-capacity diesel and electric forklifts for pallet offloading, container stuffing, and high-bay racking.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <Layers className="w-8 h-8 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Hydraulic Pallet Trucks</h4>
                <p className="text-xs text-slate-600">
                  Hand pallet jacks and staging dollies for delicate internal movement and precise cargo positioning.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <Camera className="w-8 h-8 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Weighing &amp; Measurement</h4>
                <p className="text-xs text-slate-600">
                  Calibrated industrial floor scale staging for gross weight verification and customs declaration matching.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                <Boxes className="w-8 h-8 text-sky-600" />
                <h4 className="font-bold text-slate-900 text-sm">Heavy Crane Partner Network</h4>
                <p className="text-xs text-slate-600">
                  Over-dimensional project cargo and machinery handling exceeding 3 MT capacity arranged on request.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
              <Truck className="w-4 h-4" />
              <span>Handling Capabilities</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Mechanized Material Handling
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Equipped with 3 MT industrial forklifts and skilled material handling teams to ensure zero-damage transfer between container trailers, air freight dollies, and the bonded storage floor.
            </p>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Handling Rate Schedule:</span>
              <div>&bull; 20ft Container: ₹4,000 (3 MT Mechanical) / ₹2,500 (Manual)</div>
              <div>&bull; 40ft Container: ₹5,000 (3 MT Mechanical) / ₹3,500 (Manual)</div>
              <div>&bull; Air Consignments: ₹4 per kg (Min ₹1,000)</div>
            </div>
          </div>
        </div>

        {/* Section 3: Security & Customs Infrastructure */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 lg:p-12 space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block mb-2">
              Statutory Security
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Customs Custody &amp; Perimeter Protection
            </h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Operating under Section 57/58 of the Customs Act 1962 mandates stringent physical and documentary controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2.5">
              <Lock className="w-6 h-6 text-blue-400" />
              <h4 className="font-bold text-white text-base">Bonded Double-Lock Protocols</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dual custody mechanisms with customs officer lock and warehouse keeper access ensuring zero unauthorized release.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2.5">
              <FileCheck2 className="w-6 h-6 text-emerald-400" />
              <h4 className="font-bold text-white text-base">Customs Appraiser Bay</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Designated physical inspection area for cargo destuffing, visual inspection, sample drawing, and seal verification.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-xl space-y-2.5">
              <Camera className="w-6 h-6 text-amber-400" />
              <h4 className="font-bold text-white text-base">Surveillance &amp; Ledger Log</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                24/7 CCTV monitoring of entry gates and storage bays with statutory register archiving.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <span>Facility Address &amp; Coordinates: [Thiruvananthapuram, Kerala — Official Site Plan Available to Accredited Clients]</span>
            <Link to="/contact" className="text-blue-400 hover:text-white font-medium flex items-center gap-1">
              Schedule site inspection <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
