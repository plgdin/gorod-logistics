import React, { useState } from 'react';
import { Plane, Ship, X, FileText, ExternalLink, Download } from 'lucide-react';

export const UnderDevelopmentPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'none' | 'air' | 'sea'>('none');
  const [modalTab, setModalTab] = useState<'rates' | 'terms' | 'pdf'>('rates');

  const openModal = (type: 'air' | 'sea') => {
    setActiveModal(type);
    setModalTab('rates'); // Default to showing the Table tab
  };

  const closeModal = () => {
    setActiveModal('none');
  };

  const pdfUrl =
    activeModal === 'air'
      ? '/tariffs/air-cargo-tariff.pdf'
      : '/tariffs/sea-cargo-tariff.pdf';

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#191919] text-white flex flex-col justify-between selection:bg-[#852929] selection:text-white px-4 py-4 sm:px-6 sm:py-6 font-sans relative">
      {/* Top Spacer */}
      <div aria-hidden="true" className="h-4"></div>

      {/* Main Center Content (scaled 125% for desktop) */}
      <main className="max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-auto text-center transform scale-100 sm:scale-110 md:scale-125 origin-center transition-transform duration-200">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Gorod Logistics"
          className="w-56 sm:w-72 md:w-80 h-auto object-contain transition-transform duration-300 hover:scale-105"
        />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4">
          Website Coming Soon
        </h1>

        {/* Action Buttons to Open Tariffs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => openModal('air')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-[#852929] hover:bg-[#6e2222] text-white border border-[#852929] shadow-lg shadow-[#852929]/30"
          >
            <Plane className="w-4 h-4" />
            <span>View Air Cargo Tariff</span>
          </button>

          <button
            type="button"
            onClick={() => openModal('sea')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-[#191919] hover:bg-black/80 text-white border border-white/20 hover:border-[#852929]"
          >
            <Ship className="w-4 h-4 text-[#852929]" />
            <span>View Sea Cargo Tariff</span>
          </button>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs sm:text-sm text-[#C1C1C1]/70 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4 pb-2">
        <span>&copy; {new Date().getFullYear()} Gorod Logistics (A Division of Gorod International Agency Pvt Ltd)</span>
        <span>Directorate of Port, Valiyathura, Thiruvananthapuram &bull; 0471-3191914</span>
      </footer>

      {/* MODAL DOCUMENT & PDF VIEWER */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-1.5 sm:p-4 md:p-6 animate-in fade-in duration-150">
          <div className="bg-[#191919] border border-white/20 rounded-xl sm:rounded-2xl w-[98vw] sm:w-[94vw] max-w-[1500px] h-[95vh] sm:h-[92vh] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="bg-black/80 border-b border-white/10 px-3 py-2.5 sm:px-6 sm:py-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2.5 bg-[#852929]/30 text-white rounded-lg border border-[#852929]/50">
                  {activeModal === 'air' ? <Plane className="w-4 h-4 sm:w-6 sm:h-6" /> : <Ship className="w-4 h-4 sm:w-6 sm:h-6" />}
                </div>
                <div>
                  <div className="text-xs sm:text-lg md:text-xl font-bold text-white uppercase tracking-wider">
                    Tariff ({activeModal === 'air' ? 'Air Cargo' : 'Sea Cargo'})
                  </div>
                  <div className="text-[10px] sm:text-sm text-[#C1C1C1]">w.e.f - 01/05/2026 &bull; TRV1U001</div>
                </div>
              </div>

              {/* Viewer Mode Tabs + Download */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className="inline-flex bg-black/60 p-0.5 sm:p-1 rounded-lg border border-white/10 text-xs sm:text-sm">
                  <button
                    type="button"
                    onClick={() => setModalTab('rates')}
                    className={`px-2.5 py-1 sm:px-5 sm:py-2 rounded text-[11px] sm:text-sm font-semibold transition-colors ${
                      modalTab === 'rates' ? 'bg-[#852929] text-white shadow' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('terms')}
                    className={`px-2.5 py-1 sm:px-5 sm:py-2 rounded text-[11px] sm:text-sm font-semibold transition-colors ${
                      modalTab === 'terms' ? 'bg-[#852929] text-white shadow' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    Terms
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('pdf')}
                    className={`px-2.5 py-1 sm:px-5 sm:py-2 rounded text-[11px] sm:text-sm font-semibold transition-colors flex items-center gap-1 sm:gap-2 ${
                      modalTab === 'pdf' ? 'bg-[#852929] text-white shadow' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>PDF</span>
                  </button>
                </div>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 sm:p-2.5 rounded-lg text-[#C1C1C1] hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
                  title="Open PDF / Download"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 sm:p-2.5 rounded-lg text-[#C1C1C1] hover:text-white hover:bg-white/15 transition-colors"
                  title="Close document"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-2.5 sm:p-6 md:p-8 overflow-y-auto no-scrollbar flex-1 flex flex-col text-xs sm:text-sm md:text-base">
              {/* TAB 1: EMBEDDED NATIVE PDF VIEWER */}
              {modalTab === 'pdf' && (
                <div className="flex-1 w-full flex flex-col min-h-[70vh]">
                  <iframe
                    src={pdfUrl}
                    title="Gorod Logistics Tariff PDF"
                    className="w-full flex-1 min-h-[70vh] rounded-xl border border-white/10 bg-white"
                  />
                  <div className="mt-2.5 flex items-center justify-between text-xs text-[#C1C1C1]">
                    <span>Official signed Public Bonded Warehouse Tariff document</span>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-[#852929] inline-flex items-center gap-1 font-medium"
                    >
                      <span>Open in full tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: STRUCTURED HTML RATE TABLE */}
              {modalTab === 'rates' && (
                <div className="space-y-3 sm:space-y-5">
                  <div className="p-3 sm:p-5 bg-black/50 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-5 text-xs sm:text-sm">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="Gorod Logistics" className="h-10 sm:h-14 w-auto" />
                      <div>
                        <span className="font-extrabold text-white text-xs sm:text-base block">GOROD LOGISTICS</span>
                        <span className="text-[#C1C1C1] text-[10px] sm:text-xs">A Division of Gorod International Agency Pvt Ltd</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-[10px] sm:text-xs text-[#C1C1C1] space-y-0.5">
                      <div><strong>BONDED WAREHOUSE:</strong> TRV1U001 &bull; <strong>BOND:</strong> 2002591018</div>
                      <div>Directorate of Port, Valiyathura, Thiruvananthapuram, 695008</div>
                      <div>business@gorod.agency &bull; 0471-3191914</div>
                    </div>
                  </div>

                  <div className="text-center py-1">
                    <h2 className="text-xs sm:text-lg md:text-xl font-extrabold uppercase tracking-wide text-white">
                      Public Bonded Warehouse Tariff ({activeModal === 'air' ? 'Air Cargo' : 'Sea Cargo'})
                    </h2>
                    <span className="text-[11px] sm:text-xs text-[#852929] font-bold inline-block">w.e.f - 01/05/2026</span>
                  </div>

                  {activeModal === 'air' ? (
                    <div className="border border-white/15 rounded-xl overflow-x-auto no-scrollbar bg-black/40">
                      <table className="w-full text-left text-xs sm:text-sm md:text-base border-collapse">
                        <thead className="bg-[#852929] text-white font-bold text-[11px] sm:text-xs md:text-sm">
                          <tr>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 w-7 sm:w-12 text-center border-r border-white/20">#</th>
                            <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/20">Description</th>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/20 whitespace-nowrap text-right sm:text-left">Min Rate (INR)</th>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 whitespace-nowrap text-right sm:text-left">Rate / Kg (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/90">
                          <tr className="bg-white/5 font-bold text-[11px] sm:text-xs uppercase tracking-wider text-[#C1C1C1]">
                            <td colSpan={4} className="py-1.5 px-2 sm:py-2 sm:px-4">General Cargo</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">1</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Bonding</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Charged per B/E / Shipping Bill</div>
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1000/-</td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1 / kg</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">2</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">De-Bonding</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Charged per B/E / Shipping Bill</div>
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1000/-</td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1 / kg</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">3</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">
                              Inward / Outward Handling
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1000/-</td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 4 / kg</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">4</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">
                              Part Delivery
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 500/-</td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 2 / kg</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">5</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Insurance</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">
                                &gt;Assessable Value + Customs duty (min 4 weeks from Bond date)
                              </div>
                            </td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-[#C1C1C1] text-center sm:text-left">
                              INR 0.20 Paise / 1000 INR of Cargo Value
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">6</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Storage Charges</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Per B/E or Shipping Bill &bull; Min 1 week</div>
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 1000</td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold whitespace-nowrap text-right sm:text-left">INR 4 / kg/wk</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">7</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">Value Added Services</td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[#C1C1C1] font-semibold text-center sm:text-left">As on Request</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">8</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">Bonded Transportation</td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[#C1C1C1] font-semibold text-center sm:text-left">As on Request</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-white/15 rounded-xl overflow-x-auto no-scrollbar bg-black/40">
                      <table className="w-full text-left text-xs sm:text-sm md:text-base border-collapse">
                        <thead className="bg-[#852929] text-white font-bold text-[11px] sm:text-xs md:text-sm">
                          <tr>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 w-7 sm:w-12 text-center border-r border-white/20">#</th>
                            <th className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/20">Description</th>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/20 whitespace-nowrap text-right sm:text-left">TEU (20')</th>
                            <th className="py-2.5 px-2 sm:py-3.5 sm:px-4 whitespace-nowrap text-right sm:text-left">FEU (40')</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/90">
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">1</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Bonded Storage</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Covered Space &bull; Upto 4 weeks</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1]">Min: 20ft (20sqm) / 40ft (40sqm)</div>
                            </td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-[#C1C1C1] text-center sm:text-left">
                              INR 150 / Sq.m / week <span className="text-[10px] sm:text-xs font-normal">(Min 4 weeks)</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">2</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Insurance</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">
                                &gt;Assessable Value + Customs duty (min 4 weeks from Bond date)
                              </div>
                            </td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-[#C1C1C1] text-center sm:text-left">
                              INR 0.20 Paise / 1000 INR of Cargo Value
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">3</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Inward / Outward</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Manual vs Mech (3 MT FLT)</div>
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 border-r border-white/10 font-mono font-bold text-right sm:text-left">
                              <div>INR 2500/- <span className="text-[10px] text-[#C1C1C1] font-normal">(Man)</span></div>
                              <div className="text-[#852929]">INR 4000/- <span className="text-[10px] font-normal">(Mech)</span></div>
                            </td>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-right sm:text-left">
                              <div>INR 3500/- <span className="text-[10px] text-[#C1C1C1] font-normal">(Man)</span></div>
                              <div className="text-[#852929]">INR 5000/- <span className="text-[10px] font-normal">(Mech)</span></div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">4</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Part Delivery</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Manual vs Mech</div>
                            </td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-center sm:text-left">
                              <span>INR 500/- (Manual)</span> &bull; <span className="text-[#852929]">INR 750/- (Mech)</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">5</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10">
                              <div className="font-semibold text-white">Documentation</div>
                              <div className="text-[10px] sm:text-xs text-[#C1C1C1] mt-0.5">&gt;Per Consignment</div>
                            </td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 font-mono font-bold text-center sm:text-left">INR 2500/-</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">6</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">Transportation</td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[#C1C1C1] font-semibold text-center sm:text-left">As on Request</td>
                          </tr>
                          <tr>
                            <td className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-center border-r border-white/10 font-bold text-[#C1C1C1]">7</td>
                            <td className="py-2.5 px-2.5 sm:py-3.5 sm:px-4 border-r border-white/10 font-semibold text-white">Value Added Services</td>
                            <td colSpan={2} className="py-2.5 px-2 sm:py-3.5 sm:px-4 text-[#C1C1C1] font-semibold text-center sm:text-left">As on Request</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="pt-2 text-xs sm:text-sm text-[#C1C1C1] space-y-1">
                    {activeModal === 'air' && (
                      <div className="text-white font-semibold">
                        *Special Cargo: +30% surcharge applies to final value
                      </div>
                    )}
                    <div className="text-[#852929] font-bold">
                      * GST and other statutory charges extra as applicable
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GENERAL TERMS (1 to 14) */}
              {modalTab === 'terms' && (
                <div className="space-y-4">
                  <div className="text-center py-2 border-b border-white/10 pb-3">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wide text-white">
                      General Terms and Conditions
                    </h2>
                    <span className="text-sm text-[#C1C1C1]">
                      Gorod Logistics &bull; Public Bonded Warehouse Regulations
                    </span>
                  </div>

                  <div className="space-y-3 text-sm sm:text-base text-[#C1C1C1] leading-relaxed">
                    {[
                      'Local transportation, additional handling, loading/unloading, and special service requirements shall be charged extra as applicable.',
                      'The above rates are subject to revision in the event of any increase in fuel prices, labour charges, insurance, statutory levies, handling equipment costs, or other operational expenses, on a pro-rata basis as per industry norms.',
                      'Rates are subject to change without prior notice.',
                      'The rates quoted above are based on normal cargo handling operations using standard equipment. Cargo requiring special handling such as heavy lift cargo, odd dimension cargo, hazardous cargo, open-top containers, machinery handling, crane operations, or additional equipment shall attract extra charges.',
                      'Volume discounts may be considered based on cargo volume, storage utilization, and overall business turnover.',
                      'Additional charges shall be applicable for special cargo services including dunnage, lashing, repacking, palletization, protective materials, and customized handling requirements.',
                      'Any Customs overtime charges, examination charges, escort charges, or statutory expenses arising during cargo operations shall be borne by the customer.',
                      'All payments shall be made in favour of GOROD INTERNATIONAL AGENCY PVT LTD. Payments may be made through cheque, DD, bank transfer, or approved digital payment methods.',
                      'It is presumed that all cargo stored, transported, or handled under Public Bonded Warehouse operations is adequately insured by the customer against risks during transportation, storage, handling, and Customs operations. The company shall not be responsible for any loss, damage, pilferage, deterioration, delay, or unforeseen incidents beyond its reasonable control.',
                      'In case insurance coverage is required through us, the same shall be arranged upon prior written request from the customer and charges shall be recovered additionally.',
                      'Prior to cargo entry into the bonded warehouse facility, all applicable warehouse charges, handling charges, transportation charges, and statutory dues shall be settled unless otherwise agreed in writing.',
                      'GST and other applicable government levies shall be charged extra at prevailing rates at the time of billing.',
                      'All charges mentioned in the quotation/tariff are in Indian Rupees (INR).',
                      'Services are subject to Customs regulations, bonded warehouse rules, and applicable laws governing bonded cargo operations in India.',
                    ].map((term, index) => (
                      <div key={index} className="flex items-start gap-3 bg-black/40 p-3.5 sm:p-4 rounded-xl border border-white/5">
                        <span className="font-bold text-[#852929] shrink-0 mt-0.5">{index + 1}.</span>
                        <span className="text-white/90">{term}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
