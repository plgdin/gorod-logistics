import React from 'react';
import { Link } from 'react-router-dom';
import {
  Ship,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Boxes,
  Truck,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { TARIFFS } from '../data/tariffs';
import { formatINR } from '../features/tariff-calculator/calculations';
import { SeaCargoCalculator } from '../features/tariff-calculator/components/SeaCargoCalculator';

export const SeaCargoPage: React.FC = () => {
  const sea = TARIFFS.seaCargo;

  return (
    <>
      <SEO
        title="Public Bonded Warehouse Tariff — Sea Cargo"
        description="Official published sea freight bonded warehouse tariff for Gorod Logistics in Thiruvananthapuram, Kerala. ₹150/m²/wk covered storage, container minimums, and live calculator."
      />

      <PageHeader
        badge="Official Tariff Document"
        title="Public Bonded Warehouse Tariff (Sea Cargo)"
        description={`Published rates effective ${sea.effectiveDate} for covered bonded warehouse storage and handling in Thiruvananthapuram, Kerala.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tariffs', href: '/tariffs/sea-cargo' },
          { label: 'Sea Cargo' },
        ]}
        action={
          <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs border border-slate-700">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Effective Date: <strong>{sea.effectiveDate}</strong></span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Tariff Summary Card & Table */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Ship className="w-6 h-6 text-sky-600" />
                Sea Cargo Published Rate Schedule
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Source Document: <span className="font-semibold text-slate-700">{sea.sourceDocument}</span>
              </p>
            </div>

            <a
              href="#calculator-section"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800 bg-sky-50 px-4 py-2 rounded-lg border border-sky-200"
            >
              <span>Jump to Sea Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Structured Tariff Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Service Description</th>
                    <th scope="col" className="px-6 py-4">Published Unit Rate</th>
                    <th scope="col" className="px-6 py-4">Minimum Booking Parameter</th>
                    <th scope="col" className="px-6 py-4">Equipment / Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors bg-sky-50/30">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        Covered Storage
                        <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">Core Tariff</span>
                      </div>
                      <div className="text-xs text-slate-500">{sea.rates.coveredStorage.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-sky-700">₹{sea.rates.coveredStorage.ratePerSqMeterPerWeek} / m² / week</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">Minimum 4 weeks</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Weather-protected bonded floor space</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">20-Foot Container Space Allocation</div>
                      <div className="text-xs text-slate-500">{sea.rates.containerMinimums['20ft'].description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">₹150 / m² / week</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Min 20 m² area</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Standard TEU staging bay</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">40-Foot Container Space Allocation</div>
                      <div className="text-xs text-slate-500">{sea.rates.containerMinimums['40ft'].description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">₹150 / m² / week</td>
                    <td className="px-6 py-4 font-bold text-slate-900">Min 40 m² area</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Standard FEU staging bay</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">20-Foot Container Handling</div>
                      <div className="text-xs text-slate-500">Inward offloading and outward loading</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                      <div>Manual: {formatINR(sea.rates.handling['20ft'].manual)}</div>
                      <div className="text-sky-700">Mechanical: {formatINR(sea.rates.handling['20ft'].mechanical)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per 20-foot consignment</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{sea.rates.handling.equipmentDescription}</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">40-Foot Container Handling</div>
                      <div className="text-xs text-slate-500">Inward offloading and outward loading</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                      <div>Manual: {formatINR(sea.rates.handling['40ft'].manual)}</div>
                      <div className="text-sky-700">Mechanical: {formatINR(sea.rates.handling['40ft'].mechanical)}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per 40-foot consignment</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{sea.rates.handling.equipmentDescription}</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">Part Delivery</div>
                      <div className="text-xs text-slate-500">{sea.rates.partDelivery.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                      Manual: {formatINR(sea.rates.partDelivery.manual)} / Mechanical: {formatINR(sea.rates.partDelivery.mechanical)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per partial dispatch</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Physical unstuffing and segregation</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">Documentation</div>
                      <div className="text-xs text-slate-500">{sea.rates.documentation.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{formatINR(sea.rates.documentation.ratePerConsignment)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per consignment</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Customs register and compliance ledger</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <span>*All rates in Indian Rupees (INR). GST and statutory officer expenses extra.</span>
              <span className="font-medium text-slate-800">Effective Date: {sea.effectiveDate}</span>
            </div>
          </div>
        </div>

        {/* Sea Cargo Operational Policies & Insurance Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Storage Billing Rule Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-sky-700 font-bold text-base">
              <Boxes className="w-5 h-5" />
              <h3>Covered Storage Billing Parameters</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Explicit Weekly Basis:</strong> The source tariff explicitly publishes covered storage at <strong>₹150 per square metre per week</strong> (not monthly).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>4-Week Minimum:</strong> A mandatory minimum billing duration of 4 weeks applies to all sea cargo storage agreements.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Area Floors:</strong> 20-foot containers require a minimum chargeable area of <strong>20 m²</strong>; 40-foot containers require a minimum of <strong>40 m²</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Insurance Flag Alert Card */}
          <div className="bg-amber-50/70 rounded-xl border border-amber-300 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-amber-900 font-bold text-base">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h3>Insurance Clause &bull; Business Confirmation Note</h3>
            </div>
            <div className="text-sm text-amber-900/90 space-y-2.5">
              <div className="p-3 bg-white/80 rounded border border-amber-200 font-mono text-xs text-amber-950">
                Published Text: <strong>"{sea.insuranceNote.publishedWording}"</strong>
              </div>
              <p className="text-xs leading-relaxed">
                <strong>Cargo Value:</strong> Assessable Value + Applicable Customs Duty, with a minimum 4-week billing period from the bond number date.
              </p>
              <div className="text-xs text-amber-800 bg-amber-100/60 p-2.5 rounded border border-amber-200">
                <strong>Operational Flag:</strong> Tariff text denomination is flagged for business confirmation. Excluded from automated estimates until official clarity is verified in writing.
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sea Cargo Calculator */}
        <div id="calculator-section" className="space-y-6 pt-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700 mb-1 block">
              Simulation Tool
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Interactive Sea Cargo Tariff Calculator
            </h2>
            <p className="text-sm text-slate-600">
              Configure container size, storage area, weeks, and handling options to preview cost calculations.
            </p>
          </div>

          <SeaCargoCalculator />
        </div>

        {/* On-Demand & Value-Added Services */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
            <Truck className="w-5 h-5 text-sky-600" />
            <h3>Value-Added &amp; Bonded Transportation Services (Quoted on Request)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Port &amp; ICD Drayage</h4>
              <p className="text-xs text-slate-600">
                Bonded container trailer transit from seaports or inland container depots directly to bonded custody.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Heavy Crane Operations</h4>
              <p className="text-xs text-slate-600">
                Heavy project cargo lifting beyond standard 3 MT forklift capacity arranged with certified mobile cranes.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Palletization &amp; Crating</h4>
              <p className="text-xs text-slate-600">
                Wooden crating, ISPM-15 heat treatment certification, strapping, and protective shrink-wrapping.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-1">Customs Examination</h4>
              <p className="text-xs text-slate-600">
                Facilitation of physical inspection, sampling, sealing, and appraising officer attendance.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Need dedicated bay reservation for 20ft/40ft containers?
            </span>
            <Link
              to="/contact?cargoType=sea"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <span>Request Sea Cargo Proforma</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
