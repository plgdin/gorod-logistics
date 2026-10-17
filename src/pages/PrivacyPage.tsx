import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { PageHeader } from '../components/ui/PageHeader';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Privacy Policy (Draft)"
        description="Privacy policy and data governance practices of Ankit Logistics customs-bonded warehousing operations."
      />

      <PageHeader
        badge="Legal &amp; Compliance"
        title="Privacy Policy"
        description="Data collection, corporate confidentiality, and customs record retention procedures."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-slate-700 text-sm leading-relaxed">
        {/* Draft Notice */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">DRAFT DOCUMENT NOTICE:</span>
            This privacy policy is a draft document published for website architectural compliance (Phase 1). It is subject to legal and corporate counsel review prior to binding commercial publication.
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">1. Information Collection</h2>
          <p>
            Ankit Logistics collects commercial information necessary to execute customs warehousing operations under the Customs Act 1962. This includes Importer-Exporter Codes (IEC), Bills of Entry details, consignee entity names, authorized customs broker contact details, cargo packing manifests, and assessable value declarations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">2. Statutory Customs Records Retention</h2>
          <p>
            Under Indian Customs regulations and CBIC public bonded warehousing guidelines, warehouse ledgers, into-bond registers, ex-bond release orders, and gate passes must be preserved for the mandatory statutory period mandated by law. Such records are subject to inspection by authorized customs officers and statutory auditors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">3. Information Confidentiality</h2>
          <p>
            We do not sell, license, or disclose proprietary cargo manifest details or commercial invoice values to third-party commercial entities, except where required by lawful order of Indian judicial or customs authorities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">4. Contact &amp; Governance</h2>
          <p>
            Inquiries regarding operational privacy and consignment records should be directed to the Ankit Logistics administrative desk in Thiruvananthapuram, Kerala.
          </p>
        </section>
      </div>
    </>
  );
};
