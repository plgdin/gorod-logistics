import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ship,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Boxes,
} from 'lucide-react';
import { TARIFFS } from '../../../data/tariffs';
import { calculateSeaCargoTariff, formatINR } from '../calculations';
import { SeaCargoCalculationInput } from '../types';
import { ContainerSize } from '../../../types';

interface SeaCargoCalculatorProps {
  className?: string;
}

export const SeaCargoCalculator: React.FC<SeaCargoCalculatorProps> = () => {
  const navigate = useNavigate();

  const [input, setInput] = useState<SeaCargoCalculationInput>({
    containerSize: '20ft',
    areaSqMeters: 20,
    durationWeeks: 4,
    handlingType: 'mechanical',
    includePartDelivery: false,
    partDeliveryHandlingType: 'mechanical',
    includeDocumentation: true,
  });

  const calculation = useMemo(() => {
    return calculateSeaCargoTariff(input);
  }, [input]);

  const handleContainerChange = (size: ContainerSize) => {
    const minArea = TARIFFS.seaCargo.rates.containerMinimums[size].areaSqMeters;
    setInput((prev) => ({
      ...prev,
      containerSize: size,
      // If previous area was at previous min, adjust to new container min
      areaSqMeters: Math.max(minArea, prev.areaSqMeters < minArea ? minArea : prev.areaSqMeters),
    }));
  };

  const handleReset = () => {
    setInput({
      containerSize: '20ft',
      areaSqMeters: 20,
      durationWeeks: 4,
      handlingType: 'mechanical',
      includePartDelivery: false,
      partDeliveryHandlingType: 'mechanical',
      includeDocumentation: true,
    });
  };

  const handleRequestQuote = () => {
    const params = new URLSearchParams({
      cargoType: 'sea',
      container: input.containerSize,
      area: calculation.chargeableAreaSqMeters.toString(),
      duration: `${calculation.chargeableDurationWeeks} wks`,
      handling: input.handlingType,
      estimate: calculation.totalEstimated.toString(),
    });
    navigate(`/contact?${params.toString()}`);
  };

  const currentMinArea = TARIFFS.seaCargo.rates.containerMinimums[input.containerSize].areaSqMeters;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-600/20 text-sky-400 rounded-lg border border-sky-500/30">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white tracking-tight">Sea Cargo Tariff Estimator</h3>
            <p className="text-xs text-slate-400">
              Published Tariff: {TARIFFS.seaCargo.effectiveDate} &bull; Covered Storage (₹150/m²/wk) &amp; Handling Rates
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
          {/* Container Size Selector */}
          <div>
            <label className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              Container Specification
              <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleContainerChange('20ft')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  input.containerSize === '20ft'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">20-Foot Container</span>
                  <Boxes className={`w-4 h-4 ${input.containerSize === '20ft' ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Min. Required Area: <strong className="text-slate-800 font-semibold">20 m²</strong>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleContainerChange('40ft')}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  input.containerSize === '40ft'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">40-Foot Container</span>
                  <Boxes className={`w-4 h-4 ${input.containerSize === '40ft' ? 'text-blue-600' : 'text-slate-400'}`} />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Min. Required Area: <strong className="text-slate-800 font-semibold">40 m²</strong>
                </div>
              </button>
            </div>
          </div>

          {/* Area & Duration Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Storage Area Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="sea-area" className="text-sm font-semibold text-slate-800">
                  Storage Area (m²)
                </label>
                <span className="text-xs text-slate-500">Min: {currentMinArea} m²</span>
              </div>
              <div className="relative">
                <input
                  id="sea-area"
                  type="number"
                  min={currentMinArea}
                  step="1"
                  value={input.areaSqMeters || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setInput((prev) => ({ ...prev, areaSqMeters: isNaN(val) ? 0 : Math.max(0, val) }));
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder={`Min ${currentMinArea}`}
                />
                <span className="absolute right-4 top-2.5 text-sm font-semibold text-slate-400 pointer-events-none">
                  m²
                </span>
              </div>
              {input.areaSqMeters < currentMinArea && input.areaSqMeters > 0 && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Tariff enforces minimum {currentMinArea} m² for {input.containerSize} container.
                </p>
              )}
            </div>

            {/* Storage Duration Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="sea-duration" className="text-sm font-semibold text-slate-800">
                  Storage Duration (Weeks)
                </label>
                <span className="text-xs text-slate-500">Min: 4 weeks</span>
              </div>
              <div className="relative">
                <input
                  id="sea-duration"
                  type="number"
                  min="4"
                  step="1"
                  value={input.durationWeeks || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setInput((prev) => ({ ...prev, durationWeeks: isNaN(val) ? 0 : Math.max(0, val) }));
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  placeholder="Min 4"
                />
                <span className="absolute right-4 top-2.5 text-sm font-semibold text-slate-400 pointer-events-none">
                  WEEKS
                </span>
              </div>
              {input.durationWeeks < 4 && input.durationWeeks > 0 && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Mandatory minimum storage period is 4 weeks.
                </p>
              )}
            </div>
          </div>

          {/* Handling Method Selection */}
          <div>
            <label className="text-sm font-semibold text-slate-800 mb-2 block">
              Inward &amp; Outward Handling Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  input.handlingType === 'mechanical'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="handling"
                    checked={input.handlingType === 'mechanical'}
                    onChange={() => setInput((p) => ({ ...p, handlingType: 'mechanical' }))}
                    className="mt-1 h-4 w-4 text-blue-600 border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-sm">Mechanical Handling (3 MT Forklift)</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {input.containerSize === '20ft' ? '₹4,000 fixed' : '₹5,000 fixed'}
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  input.handlingType === 'manual'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="handling"
                    checked={input.handlingType === 'manual'}
                    onChange={() => setInput((p) => ({ ...p, handlingType: 'manual' }))}
                    className="mt-1 h-4 w-4 text-blue-600 border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-sm">Manual Cargo Handling</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {input.containerSize === '20ft' ? '₹2,500 fixed' : '₹3,500 fixed'}
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Optional Services */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Additional Bonded Services
            </span>

            <div className="space-y-2.5">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={input.includeDocumentation}
                  onChange={(e) => setInput((p) => ({ ...p, includeDocumentation: e.target.checked }))}
                  className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="flex justify-between items-center font-medium text-slate-800">
                    <span>Bonded Documentation</span>
                    <span className="text-xs font-semibold text-slate-600">₹2,500 / consignment</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customs bond registration, warehouse ledger entries, and regulatory filing.
                  </p>
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
                    <span className="text-xs font-semibold text-slate-600">
                      {input.partDeliveryHandlingType === 'mechanical' ? '₹750 (Mech)' : '₹500 (Manual)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Physical sorting and staging for partial unstuffing clearance.
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

            <div className="space-y-3">
              {calculation.lineItems.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between text-sm py-1.5 border-b border-slate-100 last:border-none">
                  <div className="pr-2">
                    <div className="font-medium text-slate-800 flex items-center gap-1.5">
                      {item.name}
                      {item.isMinimumApplied && (
                        <span className="inline-block text-[10px] bg-sky-100 text-sky-800 font-semibold px-1.5 py-0.2 rounded">
                          Minimum Enforced
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
            </div>

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
                <span>Computed per published May 2026 sea cargo tariff</span>
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
              Published tariff states: <em>"{TARIFFS.seaCargo.insuranceNote.publishedWording}"</em> (Cargo Value = Assessable Value + Customs Duty, min 4 weeks). Excluded from automatic total until official unit denomination is verified.
            </p>
          </div>

          {/* CTA Actions */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRequestQuote}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors shadow-sm focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
            >
              <span>Request Official Sea Cargo Quotation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Immediate assistance for ICD/Port cargo staging in Thiruvananthapuram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
