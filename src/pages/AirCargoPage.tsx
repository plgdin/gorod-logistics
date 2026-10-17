import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  FileText,
  Clock,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { TARIFFS } from '../data/tariffs';
import { formatINR } from '../features/tariff-calculator/calculations';
import { AirCargoCalculator } from '../features/tariff-calculator/components/AirCargoCalculator';

export const AirCargoPage: React.FC = () => {
  const air = TARIFFS.airCargo;

  return (
    <>
      <SEO
        title="Public Bonded Warehouse Tariff — Air Cargo"
        description="Official published air cargo bonded warehouse tariff for Ankit Logistics in Thiruvananthapuram, Kerala. Per-kg rates, minimum consignment charges, and live calculator."
      />

      <PageHeader
        badge="Official Tariff Document"
        title="Public Bonded Warehouse Tariff (Air Cargo)"
        description={`Published rates effective ${air.effectiveDate} for customs-bonded air cargo warehousing and handling operations in Thiruvananthapuram, Kerala.`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tariffs', href: '/tariffs/air-cargo' },
          { label: 'Air Cargo' },
        ]}
        action={
          <div className="flex items-center gap-2 bg-slate-800 text-slate-300 px-4 py-2 rounded-lg text-xs border border-slate-700">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Effective Date: <strong>{air.effectiveDate}</strong></span>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Tariff Summary Card & Table */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <Plane className="w-6 h-6 text-blue-600" />
                Air Cargo Published Rate Schedule
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Source Document: <span className="font-semibold text-slate-700">{air.sourceDocument}</span>
              </p>
            </div>

            <a
              href="#calculator-section"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200"
            >
              <span>Jump to Live Calculator</span>
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
                    <th scope="col" className="px-6 py-4">Billing Rate</th>
                    <th scope="col" className="px-6 py-4">Consignment Minimum</th>
                    <th scope="col" className="px-6 py-4">Billing Basis / Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">Bonding</div>
                      <div className="text-xs text-slate-500">{air.rates.bonding.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">₹{air.rates.bonding.ratePerKg} per kg</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatINR(air.rates.bonding.minimumCharge)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per consignment intake</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">De-bonding</div>
                      <div className="text-xs text-slate-500">{air.rates.debonding.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">₹{air.rates.debonding.ratePerKg} per kg</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatINR(air.rates.debonding.minimumCharge)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per consignment release</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">Inward / Outward Handling</div>
                      <div className="text-xs text-slate-500">{air.rates.handling.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">₹{air.rates.handling.ratePerKg} per kg</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatINR(air.rates.handling.minimumCharge)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per consignment operation</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">Part Delivery</div>
                      <div className="text-xs text-slate-500">{air.rates.partDelivery.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">₹{air.rates.partDelivery.ratePerKg} per kg</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatINR(air.rates.partDelivery.minimumCharge)}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">Per partial dispatch</td>
                  </tr>

                  <tr className="hover:bg-slate-50/80 transition-colors bg-blue-50/30">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        Bonded Storage
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Key Item</span>
                      </div>
                      <div className="text-xs text-slate-500">{air.rates.storage.description}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-blue-700">₹{air.rates.storage.ratePerKgPerWeek} per kg / week</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{formatINR(air.rates.storage.minimumCharge)}</td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-medium">
                      Minimum 1 week; ceiling rounded to full weeks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
              <span>*All rates in Indian Rupees (INR). Statutory taxes and levies are charged extra.</span>
              <span className="font-medium text-slate-800">Effective Date: {air.effectiveDate}</span>
            </div>
          </div>
        </div>

        {/* Storage Billing Rules & Insurance Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Storage Billing Rule Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-blue-600 font-bold text-base">
              <Clock className="w-5 h-5" />
              <h3>Storage Billing Rules &amp; Week Rounding</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>1-Week Minimum:</strong> Consignments stored for any duration under 7 days are billed at the full 1-week storage rate.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Ceiling Rounding:</strong> Partial weeks are billed as a complete additional week. Per operational policy, <strong>8 days of storage is billed as 2 weeks</strong> (ceil(8/7) = 2).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Minimums:</strong> Consignment minimums (e.g. ₹1,000 for bonding and ₹1,000 for handling) apply individually to each service line item.
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
                Published Text: <strong>"{air.insuranceNote.publishedWording}"</strong>
              </div>
              <p className="text-xs leading-relaxed">
                <strong>Cargo Value Definition:</strong> Assessable Value + Applicable Customs Duty, with a minimum billing period of 4 weeks from the bond number date.
              </p>
              <div className="text-xs text-amber-800 bg-amber-100/60 p-2.5 rounded border border-amber-200">
                <strong>Operational Flag:</strong> The wording "0.20 Paise/1000 INR" contains unit denomination ambiguity. To protect clients from incorrect automated billing, insurance is computed manually upon enquiry verification.
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tariff Calculator Section */}
        <div id="calculator-section" className="space-y-6 pt-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1 block">
              Simulation Tool
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Interactive Air Cargo Tariff Calculator
            </h2>
            <p className="text-sm text-slate-600">
              Adjust consignment weight, duration, and required services to view itemised charges with enforced minimums.
            </p>
          </div>

          <AirCargoCalculator />
        </div>

        {/* Additional Charges & Terms Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3>Additional Charges &amp; Air Cargo Conditions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Special Cargo Surcharge (30%)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Special cargo—including high-value consignments, hazardous goods (IMDG/DGR), perishables, or temperature-monitored shipments—attracts an official <strong>30% surcharge</strong> on standard published rates.
              </p>

              <h4 className="font-semibold text-slate-800 pt-2">Customs Overtime &amp; Escorts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customs officer overtime fees, physical examination charges, and designated customs escorts for transit are billed at actuals directly to the importer/broker.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800">Local Transportation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cartage from airport cargo terminals to our bonded facility is quoted separately on a case-by-case basis depending on weight, dimensions, and handling requirements.
              </p>

              <h4 className="font-semibold text-slate-800 pt-2">Taxes &amp; Statutory Levies</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Goods and Services Tax (GST) is extra at prevailing government rates on all warehouse and handling services.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Need a formal proforma quote for customs filing?
            </span>
            <Link
              to="/contact?cargoType=air"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <span>Request Air Cargo Proforma</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
