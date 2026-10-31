import React, { useState } from 'react';
import { FileCheck, Shield, Lock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { REMOVAL_TYPES, RemovalTypeData } from './sopData';

export const SOPRemovalValidator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<RemovalTypeData['id']>('home_consumption');

  const currentData = REMOVAL_TYPES.find((item) => item.id === selectedType) || REMOVAL_TYPES[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#852929]/30 border border-[#852929]/60 text-red-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>SOP Section 4.2 &bull; Outward Cargo Release Protocol</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Statutory Removal &amp; Document Validator
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Examine mandatory statutory orders, document checklists, and OTL seal rules per clearance category.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          {REMOVAL_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedType === type.id
                  ? 'bg-[#852929] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type.id === 'home_consumption' && '1. Home Consumption'}
              {type.id === 're_export' && '2. Re-Export'}
              {type.id === 'warehouse_transfer' && '3. Warehouse Transfer'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Details */}
      <div className="mt-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Clearance Classification</div>
            <div className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{currentData.title}</span>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-red-950/40 border border-red-800/50 rounded-lg text-xs font-mono text-red-300">
            <strong>Statutory Authority:</strong> {currentData.legalBasis}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mandatory Documents */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-4">
              <FileCheck className="w-4 h-4 text-[#852929]" />
              <span>Mandatory Documentation Checklist</span>
            </h4>

            <ul className="space-y-3">
              {currentData.mandatoryDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customs Verifications & OTL */}
          <div className="space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Statutory Customs Verification Points</span>
              </h4>

              <ul className="space-y-2.5">
                {currentData.customsRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* OTL / Seal Requirement Callout */}
            <div className="bg-slate-950/90 border border-amber-900/40 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  One-Time-Lock (OTL) &amp; Sealing Mandate
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentData.sealOrOTLRequirement}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Universal Commercial Rule Alert */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white font-semibold">Strict Outpass Gate Lock (SOP 4.2.6 &bull; 4.2.8):</strong> Under no circumstances will Gorod Logistics issue an Outpass / Gate Pass until the Accounts Team verifies settlement of all warehousing, handling, and overtime charges, and issues the official <strong>No-Due Certificate (NDC)</strong> in ERP.
          </div>
        </div>
      </div>
    </div>
  );
};
