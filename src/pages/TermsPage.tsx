import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { TARIFFS } from '../data/tariffs';

export const TermsPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Warehouse Terms &amp; Conditions (Draft)"
        description="Statutory terms and conditions governing customs-bonded storage and handling operations at Ankit Logistics."
      />

      <PageHeader
        badge="Governance &amp; Bylaws"
        title="Warehouse Terms &amp; Conditions"
        description="Operational terms, statutory statutory disclaimers, and billing rules governing bonded storage agreements."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Draft Notice */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">DRAFT DOCUMENT NOTICE:</span>
            The operational terms below reflect the published Public Bonded Warehouse Tariff schedules effective 1 May 2026. Official contractual master service agreements (MSAs) executed with importers take precedence.
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            General Warehouse Operating Conditions
          </h2>
          <div className="space-y-3">
            {TARIFFS.generalTerms.map((term, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-slate-400 text-xs mt-0.5">0{index + 1}.</span>
                <span className="text-slate-800 text-sm leading-relaxed">{term}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Customs Act Jurisdiction</h2>
          <p>
            All goods deposited in Ankit Logistics bonded premises remain under the joint custody of the Customs authorities and the warehouse keeper pursuant to the Customs Act 1962 and relevant Central Board of Indirect Taxes and Customs (CBIC) notifications. Handover, sampling, destuffing, and release require appropriate customs orders.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Insurance &amp; Liability Exclusions</h2>
          <p>
            The published tariff includes an insurance reference ("INR 0.20 Paise/1000 INR of Cargo Value") that is subject to business denomination confirmation. Consignees are required to verify insurance coverage with their marine underwriters or obtain formal written confirmation from Ankit Logistics prior to consignment deposition.
          </p>
        </section>
      </div>
    </>
  );
};
