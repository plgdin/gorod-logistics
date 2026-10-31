import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { CBW_DETAILS } from './sopData';

export const SOPDocumentTemplates: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'space_cert' | 'gra' | 'outpass' | 'registers'>('space_cert');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#852929]/30 border border-[#852929]/60 text-red-300 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>SOP Compliance Formats &bull; Official Document Standards</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Statutory Document Format Previews
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Official operational documents generated and archived in Gorod Logistics ERP in accordance with the SOP.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('space_cert')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'space_cert' ? 'bg-[#852929] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Space Certificate
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gra')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gra' ? 'bg-[#852929] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Goods Received (GRA)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('outpass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'outpass' ? 'bg-[#852929] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Outpass / Gate Pass
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('registers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'registers' ? 'bg-[#852929] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gate Registers
          </button>
        </div>
      </div>

      {/* Document Canvas Display */}
      <div className="mt-6">
        {/* 1. SPACE CERTIFICATE */}
        {activeTab === 'space_cert' && (
          <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto font-sans relative shadow-2xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Gorod Logistics" className="h-10 sm:h-12 w-auto" />
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-wider uppercase">GOROD LOGISTICS</h4>
                  <p className="text-[11px] text-slate-400">{CBW_DETAILS.parentCompany}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-center sm:text-right space-y-0.5">
                <div><strong>Warehouse Code:</strong> {CBW_DETAILS.warehouseCode}</div>
                <div><strong>Customs Bond No:</strong> {CBW_DETAILS.bondNumber}</div>
                <div className="text-[10px] text-slate-500">{CBW_DETAILS.location}</div>
              </div>
            </div>

            <div className="text-center py-6">
              <h5 className="text-lg font-black tracking-wider text-white uppercase underline decoration-[#852929] decoration-2 underline-offset-8">
                SPACE AVAILABILITY CERTIFICATE
              </h5>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                Ref No: GL-SC/2026/0492 &bull; Date: {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
              <p>
                This is to certify that M/s. <strong>[Importer / Customer Name]</strong> has requested bonded storage space for the under-mentioned consignment at our Public Customs-Bonded Warehouse located at Directorate of Port, Valiyathura, Thiruvananthapuram.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-900/80 rounded-lg border border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block uppercase">BOE / Job Ref</span>
                  <span className="text-white font-bold">JOB-2026-TRV-089</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Declared Volume</span>
                  <span className="text-white font-bold">40 Sq. Meters (FEU)</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Commodity</span>
                  <span className="text-white font-bold">Industrial Machinery Parts</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Validity</span>
                  <span className="text-emerald-400 font-bold">30 Days from Issuance</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                *Statutory Caveat (SOP 4.1.3): This certificate confirms physical warehouse capacity only. It does not substitute or waive any statutory Customs clearance, transit bond, or permission under the Customs Act 1962.
              </p>
            </div>

            {/* Signature Area */}
            <div className="flex justify-between items-end pt-8 mt-6 border-t border-slate-800 text-xs">
              <div>
                <div className="text-[11px] text-slate-400">Prepared By: Admin Team</div>
                <div className="text-[10px] text-slate-500">Gorod Logistics ERP System</div>
              </div>
              <div className="text-right">
                <div className="w-36 h-12 border-b border-slate-700 flex items-center justify-center text-[11px] text-slate-500 italic">
                  [Official Seal &amp; Sign]
                </div>
                <div className="text-xs font-bold text-white mt-1">Warehouse Keeper</div>
                <div className="text-[10px] text-slate-400">Gorod Logistics (TRV1U001)</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. GOODS RECEIVED ACKNOWLEDGEMENT (GRA) */}
        {activeTab === 'gra' && (
          <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto font-sans relative shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Gorod Logistics" className="h-10 sm:h-12 w-auto" />
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-wider uppercase">GOROD LOGISTICS</h4>
                  <p className="text-[11px] text-slate-400">{CBW_DETAILS.parentCompany}</p>
                </div>
              </div>
              <div className="text-xs text-slate-400 text-center sm:text-right space-y-0.5">
                <div><strong>Warehouse Code:</strong> {CBW_DETAILS.warehouseCode}</div>
                <div><strong>Customs Bond No:</strong> {CBW_DETAILS.bondNumber}</div>
              </div>
            </div>

            <div className="text-center py-5">
              <h5 className="text-lg font-black tracking-wider text-white uppercase underline decoration-[#852929] decoration-2 underline-offset-8">
                GOODS RECEIVED ACKNOWLEDGEMENT (GRA)
              </h5>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                GRA No: GL-GRA/2026/0142 &bull; Issued under SOP Section 4.1.10
              </div>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-slate-300 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 border-r border-slate-800">Job Reference</th>
                    <th className="p-2.5 border-r border-slate-800">Into-Bond BOE #</th>
                    <th className="p-2.5 border-r border-slate-800">Package Count</th>
                    <th className="p-2.5 border-r border-slate-800">Actual Weight</th>
                    <th className="p-2.5 border-r border-slate-800">OTL Seal Condition</th>
                    <th className="p-2.5">Assigned Bin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-slate-200 text-xs">
                  <tr>
                    <td className="p-2.5 border-r border-slate-800 font-bold text-white">JOB-2026-TRV-089</td>
                    <td className="p-2.5 border-r border-slate-800">BOE-9482104 / 22-04-2026</td>
                    <td className="p-2.5 border-r border-slate-800">42 Wooden Crates</td>
                    <td className="p-2.5 border-r border-slate-800">2,450.50 KG</td>
                    <td className="p-2.5 border-r border-slate-800 text-emerald-400 font-bold">INTACT (OTL-849102)</td>
                    <td className="p-2.5 font-bold text-amber-400">BAY-B / RACK-04</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] text-slate-300">
              <strong>Verified Condition:</strong> Cargo inspected and tallies 100% with transport manifest. No package damage, moisture, or leakage observed. Photographic evidence uploaded to ERP. Emailed to Jurisdictional Customs Bond Officer.
            </div>

            <div className="flex justify-between items-end pt-6 mt-6 border-t border-slate-800 text-xs">
              <div>
                <div className="text-[11px] text-slate-400">Operations Verification: Passed</div>
                <div className="text-[10px] text-slate-500">Tally Supervisor &bull; Gorod Logistics</div>
              </div>
              <div className="text-right">
                <div className="w-36 h-10 border-b border-slate-700 flex items-center justify-center text-[10px] text-slate-500 italic">
                  [Gorod Official Seal]
                </div>
                <div className="text-xs font-bold text-white mt-1">Authorized Signatory</div>
                <div className="text-[10px] text-slate-400">Admin Compliance &bull; TRV1U001</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. OUTPASS / GATE PASS */}
        {activeTab === 'outpass' && (
          <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto font-sans relative shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Gorod Logistics" className="h-10 sm:h-12 w-auto" />
                <div>
                  <h4 className="font-extrabold text-white text-base tracking-wider uppercase">GOROD LOGISTICS</h4>
                  <p className="text-[11px] text-slate-400">{CBW_DETAILS.parentCompany}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-red-900/60 border border-red-700 text-red-200 text-xs font-black uppercase rounded">
                  AUTHORIZED RELEASE OUTPASS
                </div>
              </div>
            </div>

            <div className="text-center py-5">
              <h5 className="text-lg font-black tracking-wider text-white uppercase underline decoration-[#852929] decoration-2 underline-offset-8">
                CUSTOMS-BONDED CARGO OUTPASS / GATE PASS
              </h5>
              <div className="text-xs text-slate-400 mt-2 font-mono">
                Outpass ID: GL-OUT/2026/0284 &bull; SOP Section 4.2.8
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Consignment Particulars</div>
                <div><strong>Job Number:</strong> JOB-2026-TRV-089</div>
                <div><strong>Original Into-Bond BOE:</strong> 9482104</div>
                <div><strong>Removal Classification:</strong> Home Consumption (Sec 68)</div>
                <div><strong>Released Packages:</strong> 42 Wooden Crates (2,450.50 KG)</div>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Statutory &amp; Financial Clearances</div>
                <div><strong>Out of Charge (OOC) #:</strong> OOC-2026-094182</div>
                <div><strong>Duty &amp; Interest Paid:</strong> Verified in ICES</div>
                <div className="text-emerald-400"><strong>No-Due Certificate (NDC):</strong> NDC-8491 (Settled)</div>
                <div><strong>Transport Vehicle:</strong> KL-01-CZ-4912</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-red-950/20 border border-red-900/40 rounded text-[11px] text-slate-300">
              <strong>Security Gate Notice:</strong> Security Team will verify this Outpass against physical vehicle registration, driver license, and cargo package tally before stamping the physical outward register.
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800 text-[11px] text-center">
              <div>
                <div className="text-slate-500 italic mb-1">[Verified]</div>
                <strong className="text-slate-300 block">Accounts Clearance</strong>
                <span className="text-slate-500 text-[10px]">No-Due Confirmed</span>
              </div>
              <div>
                <div className="text-slate-500 italic mb-1">[Inspected]</div>
                <strong className="text-slate-300 block">Warehouse Operations</strong>
                <span className="text-slate-500 text-[10px]">Tally &amp; Photos Complete</span>
              </div>
              <div>
                <div className="text-slate-500 italic mb-1">[Approved]</div>
                <strong className="text-slate-300 block">Admin Compliance</strong>
                <span className="text-slate-500 text-[10px]">Authorized Release</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. GATE REGISTERS SCHEMA */}
        {activeTab === 'registers' && (
          <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-6 sm:p-8 max-w-4xl mx-auto font-sans relative shadow-2xl">
            <h5 className="text-base font-bold text-white uppercase tracking-wider mb-2">
              Physical Gate Registers Schema (SOP Section 4.1.11 &amp; 4.2.9)
            </h5>
            <p className="text-xs text-slate-400 mb-6">
              Maintained permanently at Security Gate as legal and statutory offline backup to ERP transactions.
            </p>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">
                  1. Inward Register Mandatory Data Fields
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    'Date & Time of Arrival',
                    'Gorod Job Number',
                    'BOE / Transfer Ref',
                    'Vehicle Registration #',
                    'Driver Details & Phone',
                    'OTL # / Escort Ref',
                    'Package Count Received',
                    'Status / Discrepancy Note',
                    'Gorod Rep Signature',
                    'Transport Driver Sign',
                    'Customs Inspector Sign',
                    'Gate Entry Sequence #',
                  ].map((field, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[11px]">
                      &bull; {field}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-red-400 uppercase tracking-wide mb-2">
                  2. Outward Register Mandatory Data Fields
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {[
                    'Date & Time of Gate-Out',
                    'Gorod Job Number',
                    'Into-Bond BOE Reference',
                    'Customer / Importer Name',
                    'Removal Type (Sec 67/68/69)',
                    'Cargo Qty / Package Count',
                    'Outpass / Gate Pass #',
                    'Vehicle Reg & Driver ID',
                    'OTL Seal # (if applicable)',
                    'Customs Authorization Ref',
                    'Responsible Gorod Sign',
                    'Driver & Customs Sign',
                  ].map((field, idx) => (
                    <div key={idx} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300 text-[11px]">
                      &bull; {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
