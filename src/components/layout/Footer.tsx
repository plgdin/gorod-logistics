import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, ArrowUpRight } from 'lucide-react';
import { TARIFFS } from '../../data/tariffs';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <img src="/logo-cropped.png" alt="Gorod Logistics" className="h-16 w-auto object-contain object-left" />

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Public customs-bonded warehousing and integrated freight operations serving air cargo and sea freight consignments in Thiruvananthapuram, Kerala.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Thiruvananthapuram, Kerala, India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Customs-Bonded Facility Under Indian Customs Act 1962</span>
              </div>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Services Overview
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-white transition-colors">
                  Warehouse Facilities
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Company
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Published Tariffs */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">
              Published Tariffs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/tariffs/air-cargo"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Air Cargo Tariff</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  to="/tariffs/sea-cargo"
                  className="hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span>Sea Cargo Tariff</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </li>
              <li className="pt-2">
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-0.5">Tariff Validity</span>
                  Published rates effective from <strong>{TARIFFS.airCargo.effectiveDate}</strong>.
                </div>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-4 uppercase text-xs">
              Governance &amp; Terms
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Warehouse Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Phase 1: Public Web Portal
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Gorod Logistics. All rights reserved. Operating in Thiruvananthapuram, Kerala, India.
          </div>
          <div className="text-center md:text-right text-slate-400 max-w-xl">
            Tariffs published as per Public Bonded Warehouse Tariff documentation. GST and statutory officer fees extra.
          </div>
        </div>
      </div>
    </footer>
  );
};
