import React, { useState } from 'react';
import { Plane, Ship, ShieldCheck, X, FileText, ExternalLink, Download } from 'lucide-react';

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
      {/* Top Header */}
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

      {/* Main Center Content */}
      <main className="max-w-3xl mx-auto w-full flex flex-col items-center justify-center my-auto text-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Gorod Logistics"
          className="w-56 sm:w-72 md:w-80 h-auto object-contain transition-transform duration-300 hover:scale-105"
        />

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4">
          Website Coming Soon
        </h1>

        <p className="text-xs sm:text-sm text-[#C1C1C1] mt-2">
          Public Customs-Bonded Warehouse Tariffs (w.e.f 01/05/2026)
        </p>

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
      <footer className="max-w-5xl mx-auto w-full text-center text-[11px] text-[#C1C1C1]/60 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-white/10 pt-3">
        <span>&copy; {new Date().getFullYear()} Gorod Logistics (A Division of Gorod International Agency Pvt Ltd)</span>
        <span>Directorate of Port, Valiyathura, Thiruvananthapuram &bull; 0471-3191914</span>
      </footer>

      {/* MODAL DOCUMENT & PDF VIEWER */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-[#191919] border border-white/20 rounded-xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-left">
            {/* Modal Header */}
            <div className="bg-black/70 border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-[#852929]/30 text-white rounded border border-[#852929]/50">
                  {activeModal === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Public Bonded Warehouse Tariff ({activeModal === 'air' ? 'Air Cargo' : 'Sea Cargo'})
                  </div>
                  <div className="text-[10px] text-[#C1C1C1]">w.e.f - 01/05/2026 &bull; TRV1U001</div>
                </div>
              </div>

              {/* Viewer Mode Tabs + Download */}
              <div className="flex items-center gap-2">
                <div className="inline-flex bg-black/50 p-0.5 rounded border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setModalTab('rates')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                      modalTab === 'rates' ? 'bg-[#852929] text-white' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('terms')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                      modalTab === 'terms' ? 'bg-[#852929] text-white' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    Terms (1-14)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('pdf')}
                    className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                      modalTab === 'pdf' ? 'bg-[#852929] text-white' : 'text-[#C1C1C1] hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official PDF</span>
                  </button>
                </div>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 rounded-lg text-[#C1C1C1] hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
                  title="Open PDF / Download"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-[#C1C1C1] hover:text-white hover:bg-white/15 transition-colors ml-1"
                  title="Close document"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-3 sm:p-5 overflow-y-auto flex-1 flex flex-col text-xs">
              {/* TAB 1: EMBEDDED NATIVE PDF VIEWER */}
              {modalTab === 'pdf' && (
                <div className="flex-1 w-full flex flex-col min-h-[68vh]">
                  <iframe
                    src={pdfUrl}
                    title="Gorod Logistics Tariff PDF"
                    className="w-full flex-1 min-h-[68vh] rounded-lg border border-white/10 bg-white"
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#C1C1C1]">
                    <span>Official signed Public Bonded Warehouse Tariff document (Pages 1 &amp; 2)</span>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:text-[#852929] inline-flex items-center gap-1 font-medium"
                    >
                      <span>Open in full tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: STRUCTURED HTML RATE TABLE */}
              {modalTab === 'rates' && (
                <div className="space-y-3">
                  <div className="p-3 bg-black/40 rounded-lg border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="Gorod Logistics" className="h-9 w-auto" />
                      <div>
                        <span className="font-extrabold text-white text-xs block">GOROD LOGISTICS</span>
                        <span className="text-[#C1C1C1] text-[10px]">A Division of Gorod International Agency Pvt Ltd</span>
                      </div>
                    </div>

                    <div className="text-right sm:text-right text-[10px] text-[#C1C1C1] space-y-0.5">
                      <div><strong>BONDED WAREHOUSE CODE:</strong> TRV1U001 &bull; <strong>BOND NO:</strong> 2002591018</div>
                      <div>Directorate of Port, Valiyathura, Thiruvananthapuram, 695008</div>
                      <div>business@gorod.agency &bull; 0471-3191914</div>
                    </div>
                  </div>

                  <div className="text-center py-1">
                    <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
                      Public Bonded Warehouse Tariff ({activeModal === 'air' ? 'Air Cargo' : 'Sea Cargo'})
                    </h2>
                    <span className="text-[11px] text-[#852929] font-bold">w.e.f - 01/05/2026</span>
                  </div>

                  {activeModal === 'air' ? (
                    <div className="border border-white/15 rounded-lg overflow-hidden bg-black/30">
                      <table className="w-full text-left text-[11px] sm:text-xs">
                        <thead className="bg-[#852929] text-white font-bold text-[11px]">
                          <tr>
                            <th className="py-2 px-3 w-8 text-center border-r border-white/20">#</th>
                            <th className="py-2 px-3 border-r border-white/20">Description</th>
                            <th className="py-2 px-3 border-r border-white/20">Min Rate Per Consignment (INR)</th>
                            <th className="py-2 px-3">Rate Per Kg (INR)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/90">
                          <tr className="bg-white/5 font-bold text-[10px] text-[#C1C1C1]">
                            <td colSpan={4} className="py-1 px-3 uppercase tracking-wider">General Cargo</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">1</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Bonding</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Charged per Bill of Entry / Shipping Bill</div>
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">INR 1000/-</td>
                            <td className="py-2 px-3 font-mono">INR 1 per kg</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">2</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">De-Bonding</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Charged per Bill of Entry / Shipping Bill</div>
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">INR 1000/-</td>
                            <td className="py-2 px-3 font-mono">INR 1 per kg</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">3</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">
                              Inward Handling / Outward Handling
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">INR 1000/-</td>
                            <td className="py-2 px-3 font-mono">INR 4 per kg</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">4</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">
                              Part Delivery
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">INR 500/-</td>
                            <td className="py-2 px-3 font-mono">INR 2 per kg</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">5</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Insurance</div>
                              <div className="text-[10px] text-[#C1C1C1]">
                                &gt;Value = Assessable Value + Customs duty will be billed as per transaction (minimum 4 weeks from Bond No. date)
                              </div>
                            </td>
                            <td colSpan={2} className="py-2 px-3 font-mono text-[#C1C1C1]">
                              INR 0.20 Paise/1000 INR of Cargo Value
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">6</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Storage Charges</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Charged per Bill of Entry / Shipping Bill</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Minimum 1 week</div>
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">INR 1000</td>
                            <td className="py-2 px-3 font-mono">INR 4 per kg per week</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">7</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">Value Added Services</td>
                            <td colSpan={2} className="py-2 px-3 text-[#C1C1C1]">As on Request</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">8</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">Bonded Transportation</td>
                            <td colSpan={2} className="py-2 px-3 text-[#C1C1C1]">As on Request</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="border border-white/15 rounded-lg overflow-hidden bg-black/30">
                      <table className="w-full text-left text-[11px] sm:text-xs">
                        <thead className="bg-[#852929] text-white font-bold text-[11px]">
                          <tr>
                            <th className="py-2 px-3 w-8 text-center border-r border-white/20">#</th>
                            <th className="py-2 px-3 border-r border-white/20">Description</th>
                            <th className="py-2 px-3 border-r border-white/20">Rate for TEU's (20')</th>
                            <th className="py-2 px-3">Rate for FEU's (40')</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-white/90">
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">1</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Bonded Storage Charges</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Covered Space</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Charges upto 4 weeks</div>
                              <div className="text-[10px] text-[#C1C1C1]">Min Booking for 20 ft - 20sqm</div>
                              <div className="text-[10px] text-[#C1C1C1]">Min Booking for 40 ft - 40sqm</div>
                            </td>
                            <td colSpan={2} className="py-2 px-3 font-mono text-[#C1C1C1]">
                              INR 150 /Per Sq. Meter/ Per week <br />
                              <span className="text-[10px]">(Minimum 4 weeks)</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">2</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Insurance</div>
                              <div className="text-[10px] text-[#C1C1C1]">
                                &gt;Value = Assessable Value + Customs duty will be billed as per transaction (minimum 4 weeks from Bond No. date)
                              </div>
                            </td>
                            <td colSpan={2} className="py-2 px-3 font-mono text-[#C1C1C1]">
                              INR 0.20 Paise/1000 INR of Cargo Value
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">3</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Inward Handling / Outward Handling</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Manual</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Mechanical (3 M.T FLT)</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Above 3 M.T - Crane charges will be applicable</div>
                            </td>
                            <td className="py-2 px-3 border-r border-white/10 font-mono">
                              <div>INR 2500/-</div>
                              <div className="text-[#852929]">INR 4000/-</div>
                            </td>
                            <td className="py-2 px-3 font-mono">
                              <div>INR 3500/-</div>
                              <div className="text-[#852929]">INR 5000/-</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">4</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Part Delivery Charges</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Manual</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Mechanical (3 M.T FLT)</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Above 3 M.T - Crane charges will be applicable</div>
                            </td>
                            <td colSpan={2} className="py-2 px-3 font-mono">
                              <div>INR 500/- (Manual)</div>
                              <div className="text-[#852929]">INR 750/- (Mechanical)</div>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">5</td>
                            <td className="py-2 px-3 border-r border-white/10">
                              <div className="font-semibold text-white">Documentation Charges</div>
                              <div className="text-[10px] text-[#C1C1C1]">&gt;Per Consignment</div>
                            </td>
                            <td colSpan={2} className="py-2 px-3 font-mono">INR 2500/-</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">6</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">Bonded Transportation Charges</td>
                            <td colSpan={2} className="py-2 px-3 text-[#C1C1C1]">As on Request</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-center border-r border-white/10 font-bold text-[#C1C1C1]">7</td>
                            <td className="py-2 px-3 border-r border-white/10 font-semibold text-white">Value Added Services</td>
                            <td colSpan={2} className="py-2 px-3 text-[#C1C1C1]">As on Request</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-[#C1C1C1] space-y-1">
                    {activeModal === 'air' && (
                      <div className="text-white font-semibold">
                        *Special Cargo: An additional 30% surcharge applies to the final calculated value
                      </div>
                    )}
                    <div className="text-[#852929] font-bold">
                      * GST and other statutory charges will be extra as applicable
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GENERAL TERMS (1 to 14) */}
              {modalTab === 'terms' && (
                <div className="space-y-3">
                  <div className="text-center py-1 border-b border-white/10 pb-2">
                    <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
                      General Terms and Conditions
                    </h2>
                    <span className="text-[10px] text-[#C1C1C1]">
                      Gorod Logistics &bull; Public Bonded Warehouse Regulations
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-[#C1C1C1] leading-relaxed">
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
                      <div key={index} className="flex items-start gap-2 bg-black/30 p-2 rounded border border-white/5">
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
