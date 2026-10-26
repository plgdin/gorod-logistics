import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Scale,
  Target,
  ArrowRight,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { TARIFFS } from '../data/tariffs';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEO
        title="About Gorod Logistics — Customs Bonded Freight &amp; Warehousing"
        description="Learn about Gorod Logistics, public customs-bonded warehousing and air/sea freight logistics provider operating in Thiruvananthapuram, Kerala, India."
      />

      <PageHeader
        badge="Company Overview"
        title="About Gorod Logistics"
        description="Dedicated public customs-bonded warehousing and multi-modal cargo handling operations based in Thiruvananthapuram, Kerala."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Mission & Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
              Operational Focus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Transparent, High-Integrity Customs-Bonded Warehousing in Kerala
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              <strong>Gorod Logistics</strong> operates as a public customs-bonded warehouse in Thiruvananthapuram, Kerala, established to serve the evolving logistical requirements of Indian importers, customs brokers, and international freight partners.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              By maintaining published, transparent tariffs for both air cargo and sea freight consignments, we provide commercial predictability to trading enterprises—allowing importers to defer customs duty payments legitimately until consignments are cleared for domestic manufacturing or distribution.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dual Air &amp; Sea cargo warehousing capabilities</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Strict statutory compliance under Indian Customs Act</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Flexible part-delivery and batch de-bonding support</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Transparent public tariffs with zero unannounced fees</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  AL
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">GOROD LOGISTICS</h3>
                  <p className="text-xs text-slate-400">Public Customs-Bonded Operator</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-slate-300 divide-y divide-slate-800">
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Jurisdiction</span>
                  <span className="font-semibold text-white">Thiruvananthapuram, Kerala, India</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Tariff Effective Date</span>
                  <span className="font-semibold text-emerald-400">{TARIFFS.airCargo.effectiveDate}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Statutory Framework</span>
                  <span className="font-semibold text-white">Customs Act 1962 &bull; Sec. 57/58</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-slate-400">Platform Stage</span>
                  <span className="font-semibold text-blue-400">Phase 1 (Public Website &amp; Tariffs)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <Info className="w-4 h-4 text-blue-400 inline mr-1 mb-0.5" />
                Detailed corporate registration details and historical milestones will be supplemented following formal business documentation approvals.
              </div>
            </div>
          </div>
        </div>

        {/* Operating Philosophy & Principles */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1 block">
              Our Principles
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Operational Standards
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Three pillars that guide our warehouse supervision and daily customs handling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Regulatory Integrity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full adherence to the statutory guidelines prescribed by the Central Board of Indirect Taxes and Customs (CBIC) and local customs commissionerates.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Commercial Transparency</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every consignment rate, minimum charge, and duration calculation is explicitly published. We eliminate unexpected auxiliary fees.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Operational Precision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Safe mechanical lifting with 3 MT forklifts, carefully demarcated container bays, and accurate part-delivery handovers.
              </p>
            </div>
          </div>
        </div>

        {/* Future ERP Platform Architecture Preview */}
        <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-1">
              Technology Roadmap
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Future ERP Platform Architecture (Phase 2 &amp; Beyond)
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              This public website represents <strong>Phase 1</strong> of Gorod Logistics' digital ecosystem. Our engineering architecture is designed for future modular integration of full-lifecycle warehouse operations without refactoring core components:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Client Portal &amp; Auth</div>
              <p className="text-slate-500">Self-service space booking, digital proforma generation, and consignment ledger download.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Inventory &amp; Bin Allocation</div>
              <p className="text-slate-500">Rack-level inventory tracking, QR label generation, and batch expiry monitoring.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Customs Gate Passes</div>
              <p className="text-slate-500">Digital verification of ex-bond BOE, weighing-scale validation, and gate pass issuance.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Operations Checklists</div>
              <p className="text-slate-500">Mobile checklists for inward tallies, damage logging, and customs inspection sign-offs.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-xl gap-4">
          <div>
            <div className="font-bold text-base text-white">Ready to discuss your storage requirements?</div>
            <div className="text-xs text-slate-400">Our logistics team in Thiruvananthapuram is available for consultation.</div>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};
