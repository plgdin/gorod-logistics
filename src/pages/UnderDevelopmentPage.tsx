import React from 'react';
import {
  ShieldCheck,
  Warehouse,
  Plane,
  Ship,
  Clock,
  Mail,
  MapPin,
  Calendar,
  Construction,
} from 'lucide-react';

export const UnderDevelopmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black tracking-wider text-lg shadow-sm">
              AL
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white block">
                ANKIT LOGISTICS
              </span>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                <span>Customs-Bonded Warehouse &bull; Thiruvananthapuram</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Site Under Construction</span>
          </div>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-700/60 text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6">
          <Construction className="w-4 h-4 text-amber-400" />
          <span>Platform Under Development &bull; Launching Soon</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Something Big is Arriving at{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
            Ankit Logistics
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We are building a modern digital customs-bonded warehouse portal. Our upcoming platform will feature transparent published tariffs for air and sea cargo, an instant consignment cost calculator, and streamlined bonded warehousing services in Thiruvananthapuram, Kerala.
        </p>

        {/* Core Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Warehouse className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Bonded Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customs-bonded covered warehousing operating under the Indian Customs Act 1962 (Sec. 57/58).
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center">
              <div className="flex gap-1">
                <Plane className="w-4 h-4" />
                <Ship className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-bold text-white text-sm">Air &amp; Sea Cargo Tariffs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transparent rate schedules effective 1 May 2026, including 3 MT forklift handling and container allocations.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Tariff Calculator Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive billing calculations enforcing consignment minimums and week-rounding rules.
            </p>
          </div>
        </div>

        {/* Urgent Contact & Operations Notice */}
        <div className="mt-12 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 text-left max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-sm text-white">Operations &amp; Cargo Inquiries</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
              Active Facility Desk
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Need immediate space reservation, into-bond paperwork assistance, or published tariff verification for cargo arriving in Kerala? Our operations team is available.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Thiruvananthapuram, Kerala, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Published Tariffs: Effective 1 May 2026</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="mailto:operations@ankitlogistics.in"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Operations Desk (operations@ankitlogistics.in)</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Ankit Logistics. All rights reserved. Customs-Bonded Warehousing in Thiruvananthapuram, Kerala, India.
        </div>
      </footer>
    </div>
  );
};
