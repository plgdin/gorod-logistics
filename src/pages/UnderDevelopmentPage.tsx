import React, { useState } from 'react';
import { Plane, Ship, ShieldCheck, FileText, X } from 'lucide-react';

export const UnderDevelopmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'none' | 'air' | 'sea'>('none');

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#191919] text-white flex flex-col justify-between selection:bg-[#852929] selection:text-white px-4 py-4 sm:px-6 sm:py-6 font-sans">
      {/* Top Bar with Status */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between text-xs text-[#C1C1C1]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#852929]" />
          <span className="font-semibold tracking-wide text-white/90">
            TRV1U001 &bull; Bond No: 2002591018
          </span>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#852929]/20 border border-[#852929]/50 px-3 py-1 rounded-full text-[11px] text-white font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#852929] animate-pulse"></span>
          <span>Under Development</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-auto">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Gorod Logistics"
          className="w-44 sm:w-56 h-auto object-contain transition-transform duration-300 hover:scale-105"
        />

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mt-1">
          Website Coming Soon
        </h1>

        {/* Tariff Selector Buttons */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'air' ? 'none' : 'air')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
              activeTab === 'air'
                ? 'bg-[#852929] text-white border-[#852929] shadow-lg shadow-[#852929]/30'
                : 'bg-[#191919] text-[#C1C1C1] border-white/20 hover:border-[#852929] hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4 text-white" />
            <span>Air Cargo Tariff</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'sea' ? 'none' : 'sea')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
              activeTab === 'sea'
                ? 'bg-[#852929] text-white border-[#852929] shadow-lg shadow-[#852929]/30'
                : 'bg-[#191919] text-[#C1C1C1] border-white/20 hover:border-[#852929] hover:text-white'
            }`}
          >
            <Ship className="w-4 h-4 text-white" />
            <span>Sea Cargo Tariff</span>
          </button>
        </div>

        {/* Tariff Table Display (Fits in viewport without page scroll) */}
        {activeTab !== 'none' && (
          <div className="w-full mt-4 bg-black/60 border border-white/15 rounded-xl p-3 sm:p-4 text-left shadow-2xl backdrop-blur-md animate-in fade-in duration-200">
            {/* Tariff Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#852929]" />
                <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  Public Bonded Warehouse Tariff ({activeTab === 'air' ? 'Air Cargo' : 'Sea Cargo'})
                </span>
                <span className="text-[10px] text-[#C1C1C1] bg-white/10 px-2 py-0.5 rounded">
                  w.e.f 01/05/2026
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('none')}
                className="text-[#C1C1C1] hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AIR CARGO TABLE */}
            {activeTab === 'air' && (
              <div className="overflow-x-auto text-[11px] sm:text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#C1C1C1] border-b border-white/10">
                      <th className="py-1 px-2">Description</th>
                      <th className="py-1 px-2">Min Rate / Consignment</th>
                      <th className="py-1 px-2">Rate Per Kg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/90">
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Bonding (per BE / SB)</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1,000/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1 / kg</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">De-Bonding (per BE / SB)</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1,000/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1 / kg</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Inward / Outward Handling</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1,000/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 4 / kg</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Part Delivery</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 500/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 2 / kg</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Storage Charges (Min 1 week)</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 1,000/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 4 / kg / week</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Insurance (Min 4 weeks)</td>
                      <td colSpan={2} className="py-1.5 px-2 text-[#C1C1C1]">
                        INR 0.20 Paise / 1,000 INR of Cargo Value (Assessable Value + Duty)
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C1C1C1]">
                  <span>*Special Cargo: +30% surcharge on calculated value</span>
                  <span>*GST &amp; statutory charges extra</span>
                </div>
              </div>
            )}

            {/* SEA CARGO TABLE */}
            {activeTab === 'sea' && (
              <div className="overflow-x-auto text-[11px] sm:text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[#C1C1C1] border-b border-white/10">
                      <th className="py-1 px-2">Description</th>
                      <th className="py-1 px-2">20' (TEU)</th>
                      <th className="py-1 px-2">40' (FEU)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/90">
                    <tr>
                      <td className="py-1.5 px-2 font-medium">
                        Covered Space (Min 4 wks &bull; 20ft: 20m², 40ft: 40m²)
                      </td>
                      <td colSpan={2} className="py-1.5 px-2 text-[#C1C1C1]">
                        INR 150 / Per Sq. Meter / Per week
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Inward / Outward: Manual</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 2,500/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 3,500/-</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Inward / Outward: Mechanical (3 MT FLT)</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 4,000/-</td>
                      <td className="py-1.5 px-2 text-[#C1C1C1]">INR 5,000/-</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Part Delivery Charges</td>
                      <td colSpan={2} className="py-1.5 px-2 text-[#C1C1C1]">
                        Manual: INR 500/- &bull; Mechanical (3 MT FLT): INR 750/-
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Documentation Charges</td>
                      <td colSpan={2} className="py-1.5 px-2 text-[#C1C1C1]">
                        INR 2,500/- per consignment
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2 font-medium">Insurance (Min 4 weeks)</td>
                      <td colSpan={2} className="py-1.5 px-2 text-[#C1C1C1]">
                        INR 0.20 Paise / 1,000 INR of Cargo Value (Assessable Value + Duty)
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#C1C1C1]">
                  <span>*Above 3 M.T: Crane charges applicable</span>
                  <span>*GST &amp; statutory charges extra</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-[11px] text-[#C1C1C1]/60 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-white/10 pt-3">
        <span>&copy; {new Date().getFullYear()} Gorod Logistics (Gorod International Agency Pvt Ltd)</span>
        <span>Directorate of Port, Valiyathura, Thiruvananthapuram &bull; 0471-3191914</span>
      </footer>
    </div>
  );
};
