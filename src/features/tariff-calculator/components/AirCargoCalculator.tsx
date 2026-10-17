import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  Info,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { TARIFFS } from '../../../data/tariffs';
import { calculateAirCargoTariff, formatINR } from '../calculations';
import { AirCargoCalculationInput } from '../types';

interface AirCargoCalculatorProps {
  className?: string;
}

export const AirCargoCalculator: React.FC<AirCargoCalculatorProps> = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState<AirCargoCalculationInput>({
    weightKg: 500,
    durationUnit: 'days',
    durationValue: 8,
    includeBonding: true,
    includeDebonding: true,
    includeHandling: true,
    includePartDelivery: false,
    isSpecialCargo: false,
  });

  const calculation = useMemo(() => {
    return calculateAirCargoTariff(input);
  }, [input]);

  const handleReset = () => {
    setInput({
      weightKg: 500,
      durationUnit: 'days',
      durationValue: 8,
      includeBonding: true,
      includeDebonding: true,
      includeHandling: true,
      includePartDelivery: false,
      isSpecialCargo: false,
    });
  };

  const handleRequestQuote = () => {
    const params = new URLSearchParams({
      cargoType: 'air',
      weight: input.weightKg.toString(),
      duration: `${input.durationValue} ${input.durationUnit}`,
      special: input.isSpecialCargo ? 'yes' : 'no',
      estimate: calculation.totalEstimated.toString(),
    });
    navigate(`/contact?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
            <Plane className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white tracking-tight">Air Cargo Tariff Estimator</h3>
            <p className="text-xs text-slate-400">
              Published Tariff: {TARIFFS.airCargo.effectiveDate} &bull; Per-kg &amp; Minimum Consignment Rates
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-800"
          title="Reset to default example"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weight Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="air-weight" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Chargeable Consignment Weight (kg)
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">Min: 1 kg</span>
            </div>
            <div className="relative">
              <input
                id="air-weight"
                type="number"
                min="1"
                step="1"
                value={input.weightKg || ''}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setInput((prev) => ({ ...prev, weightKg: isNaN(val) ? 0 : Math.max(0, val) }));
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                placeholder="e.g. 500"
              />
              <span className="absolute right-4 top-2.5 text-sm font-semibold text-slate-400 pointer-events-none">
                KG
              </span>
            </div>
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs text-slate-400 self-center">Presets:</span>
              {[100, 250, 500, 1000, 2500].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, weightKg: preset }))}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    input.weightKg === preset
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-medium'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.toLocaleString()} kg
                </button>
              ))}
            </div>
          </div>

          {/* Storage Duration Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="air-duration" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Storage Duration
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">Ceiling rounded to full weeks</span>
            </div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-7">
                <input
                  id="air-duration"
                  type="number"
                  min="1"
                  step="1"
                  value={input.durationValue || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setInput((prev) => ({ ...prev, durationValue: isNaN(val) ? 0 : Math.max(0, val) }));
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="e.g. 8"
                />
              </div>
              <div className="col-span-5">
                <select
                  value={input.durationUnit}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      durationUnit: e.target.value as 'days' | 'weeks',
                    }))
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            </div>

            {/* Billing Rule Explanatory Banner */}
            <div className="mt-2.5 flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span>Billing Period: </span>
                <strong className="text-slate-900">
                  {calculation.chargeableWeeks} {calculation.chargeableWeeks === 1 ? 'Week' : 'Weeks'}
                </strong>{' '}
                {input.durationUnit === 'days' && (
                  <span className="text-slate-500">
                    ({input.durationValue} days = ceil({input.durationValue}/7) = {calculation.chargeableWeeks} billable weeks per tariff rules)
                  </span>
                )}
                {input.durationUnit === 'weeks' && calculation.chargeableWeeks === 1 && input.durationValue < 1 && (
                  <span className="text-slate-500">(Minimum chargeable period is 1 week)</span>
                )}
              </div>
            </div>
          </div>

          {/* Service Checkboxes */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Operational Services Required
            </span>

            <div className="space-y-2.5">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.includeBonding}
                  onChange={(e) => setInput((p) => ({ ...p, includeBonding: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-medium text-slate-800">
                    <span>Bonding Formalities</span>
                    <span className="text-xs font-semibold text-slate-600">₹1/kg (Min ₹1,000)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Customs intake and bonding into warehouse custody.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.includeHandling}
                  onChange={(e) => setInput((p) => ({ ...p, includeHandling: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-medium text-slate-800">
                    <span>Inward &amp; Outward Cargo Handling</span>
                    <span className="text-xs font-semibold text-slate-600">₹4/kg (Min ₹1,000)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Physical loading, offloading, and staging operations.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.includeDebonding}
                  onChange={(e) => setInput((p) => ({ ...p, includeDebonding: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-medium text-slate-800">
                    <span>De-Bonding Formalities</span>
                    <span className="text-xs font-semibold text-slate-600">₹1/kg (Min ₹1,000)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Customs release processing and ex-bond verification.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.includePartDelivery}
                  onChange={(e) => setInput((p) => ({ ...p, includePartDelivery: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-medium text-slate-800">
                    <span>Part Delivery Operation</span>
                    <span className="text-xs font-semibold text-slate-600">₹2/kg (Min ₹500)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Consignment segregation for partial ex-bond releases.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.isSpecialCargo}
                  onChange={(e) => setInput((p) => ({ ...p, isSpecialCargo: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-semibold text-amber-900">
                    <span className="flex items-center gap-1.5">
                      Special Cargo Class
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold rounded">
                        +30% Surcharge
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-amber-800/80 mt-0.5">
                    High-value cargo, hazardous goods (IMDG/DGR), perishables, or temperature-monitored shipments.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Calculation Breakdown & Output Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Itemised Cost Breakdown
              </span>
              <span className="text-xs font-medium text-slate-500">INR (₹)</span>
            </div>

            {calculation.lineItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                Enter consignment weight to view itemised charges.
              </div>
            ) : (
              <div className="space-y-3">
                {calculation.lineItems.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-sm py-1.5 border-b border-slate-100 last:border-none">
                    <div className="pr-2">
                      <div className="font-medium text-slate-800 flex items-center gap-1.5">
                        {item.name}
                        {item.isMinimumApplied && (
                          <span
                            className="inline-block text-[10px] bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.2 rounded"
                            title={`Calculated amount was below published minimum (${formatINR(item.minimumCharge || 0)}). Minimum applied.`}
                          >
                            Min Applied
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{item.unitRateDisplay}</div>
                    </div>
                    <div className="font-semibold text-slate-900 text-right shrink-0">
                      {formatINR(item.calculatedAmount)}
                    </div>
                  </div>
                ))}

                {/* Subtotal */}
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-semibold text-slate-700">
                  <span>Subtotal (Base Tariff)</span>
                  <span>{formatINR(calculation.subtotal)}</span>
                </div>

                {calculation.specialCargoSurcharge > 0 && (
                  <div className="flex justify-between items-center text-sm font-semibold text-amber-700">
                    <span>Special Cargo Surcharge (30%)</span>
                    <span>+{formatINR(calculation.specialCargoSurcharge)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Total Highlight */}
            <div className="mt-5 p-4 bg-slate-900 text-white rounded-lg">
              <div className="text-xs uppercase font-medium text-slate-400 tracking-wider">
                Estimated Warehouse Charges
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {formatINR(calculation.totalEstimated)}
                </span>
                <span className="text-xs text-slate-400">Excl. statutory taxes</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Indicative estimate based on published May 2026 tariff</span>
              </div>
            </div>
          </div>

          {/* Insurance Flag Alert */}
          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              Insurance Rate Notice: Confirmation Required
            </div>
            <p className="text-amber-800/90 leading-relaxed">
              Published tariff states: <em>"{TARIFFS.airCargo.insuranceNote.publishedWording}"</em> (Cargo Value = Assessable Value + Customs Duty, min 4 weeks). Excluded from automatic total until official unit denomination is verified.
            </p>
          </div>

          {/* CTA Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRequestQuote}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <span>Request Official Air Cargo Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Direct connection to our customs bonded logistics team in Thiruvananthapuram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
