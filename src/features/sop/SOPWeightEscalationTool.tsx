import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Scale, ArrowRight, Mail, Camera, FileSpreadsheet } from 'lucide-react';
import { CBW_DETAILS } from './sopData';

export const SOPWeightEscalationTool: React.FC = () => {
  const [declaredWeight, setDeclaredWeight] = useState<string>('1000');
  const [actualWeight, setActualWeight] = useState<string>('1008');

  const declared = parseFloat(declaredWeight) || 0;
  const actual = parseFloat(actualWeight) || 0;
  const variance = actual - declared;
  const absVariance = Math.abs(variance);
  const exceedsThreshold = absVariance > CBW_DETAILS.weightThresholdKg;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
            <Scale className="w-3.5 h-3.5 text-red-400" />
            <span>SOP Section 4.1.8 &bull; Weight Verification Trigger</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Weight Discrepancy Escalation Simulator
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Test consignment weights to verify Gorod Logistics&apos; mandatory internal escalation protocol (±5 kg threshold).
          </p>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 shrink-0 text-right">
          <div className="text-xs text-slate-400 font-medium">Internal Threshold</div>
          <div className="text-lg font-black text-amber-400">
            &plusmn;{CBW_DETAILS.weightThresholdKg} kg
          </div>
          <div className="text-[10px] text-slate-500">Gorod Escalation Trigger</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Declared Reference Weight (BOE / Manifest)
          </label>
          <div className="relative">
            <input
              type="number"
              value={declaredWeight}
              onChange={(e) => setDeclaredWeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="e.g. 1000"
            />
            <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold uppercase">kg</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Actual Scale Weight (Warehouse Certified Scale)
          </label>
          <div className="relative">
            <input
              type="number"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
              placeholder="e.g. 1008"
            />
            <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold uppercase">kg</span>
          </div>
        </div>
      </div>

      {/* Variance Display Bar */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              exceedsThreshold
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {exceedsThreshold ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Computed Variance</div>
            <div className="text-lg font-mono font-black text-white">
              {variance > 0 ? `+${variance.toFixed(2)}` : variance.toFixed(2)} kg{' '}
              <span className="text-xs text-slate-400 font-normal">
                ({absVariance.toFixed(2)} kg delta)
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
              exceedsThreshold
                ? 'bg-red-900/60 text-red-300 border border-red-700 animate-pulse'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
            }`}
          >
            {exceedsThreshold ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ESCALATION MANDATORY</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WITHIN ACCEPTABLE TOLERANCE</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Action Protocol Feedback */}
      <div className="mt-6">
        {exceedsThreshold ? (
          <div className="bg-red-950/30 border border-red-900/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Statutory Protocol Activated: Discrepancy Exceeds &plusmn;5 kg</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The measured difference of <strong>{absVariance.toFixed(2)} kg</strong> triggers the Gorod Logistics internal escalation procedure under SOP Section 4.1.8. The following mandatory sequence is immediately initiated:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-lg border border-red-900/40">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>1. ERP Logging</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Operations records actual weight, declared weight, and discrepancy against the Job Number in real time.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-red-900/40">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>2. Internal Alert</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Warehouse Manager immediately alerts the Admin Compliance Team and Warehouse Keeper.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-red-900/40">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>3. Customs Email</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Admin emails the Customs Bond Officer with Job Number, weight difference, and photographic evidence.
                </p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-lg border border-red-900/40">
                <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>4. Onsite Inspection</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Consignment held in acceptance zone pending Customs inspection or re-weighing directions.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-amber-300/80 bg-amber-950/20 p-2.5 rounded border border-amber-800/30">
              <strong>Statutory Note:</strong> The &plusmn;5 kg threshold is Gorod Logistics&apos; internal trigger. Stricter thresholds specified by Customs or manifest discrepancies (shortages, excess packages) will take precedence.
            </div>
          </div>
        ) : (
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-emerald-400 font-semibold">Standard Intake Flow:</strong> The variance of {absVariance.toFixed(2)} kg is within tolerance (&le; &plusmn;5 kg). Cargo proceeds directly to 360&deg; photography, barcode generation, and bin allocation in ERP without mandatory escalation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
