import React, { useState } from 'react';
import { Plane, Ship } from 'lucide-react';
import { AirCargoCalculator } from './AirCargoCalculator';
import { SeaCargoCalculator } from './SeaCargoCalculator';

export const TariffCalculatorWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'air' | 'sea'>('air');

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-xl shadow-inner border border-slate-300/60">
          <button
            type="button"
            onClick={() => setActiveTab('air')}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'air'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Air Cargo Tariff</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sea')}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'sea'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>Sea Cargo Tariff</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'air' ? <AirCargoCalculator /> : <SeaCargoCalculator />}
      </div>
    </div>
  );
};
