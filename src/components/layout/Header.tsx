import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Plane,
  Ship,
  ShieldCheck,
  ChevronDown,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tariffsDropdownOpen, setTariffsDropdownOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-semibold transition-colors rounded-md ${
      isActive
        ? 'text-blue-600 bg-blue-50/70'
        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">
              Customs-Bonded Warehouse &bull; Thiruvananthapuram, Kerala
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Published Tariff Effective 1 May 2026
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/tariffs/air-cargo"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Air Tariff
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Link
              to="/tariffs/sea-cargo"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Sea Tariff
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Link
              to="/contact"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Enquiries
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Typographic Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black tracking-wider text-lg shadow-sm group-hover:bg-blue-600 transition-colors">
              AL
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-950 font-sans">
                  ANKIT LOGISTICS
                </span>
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Customs-Bonded Warehouse</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>

            {/* Tariffs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setTariffsDropdownOpen(true)}
              onMouseLeave={() => setTariffsDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors rounded-md"
              >
                <span>Tariffs</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {tariffsDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to="/tariffs/air-cargo"
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Plane className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Air Cargo Tariff</div>
                      <div className="text-xs text-slate-500">Per-kg storage &amp; bonding rates</div>
                    </div>
                  </Link>

                  <Link
                    to="/tariffs/sea-cargo"
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <Ship className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Sea Cargo Tariff</div>
                      <div className="text-xs text-slate-500">20ft / 40ft container &amp; m² rates</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/facilities" className={navLinkClass}>
              Facilities
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/tariffs/air-cargo"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Tariff Calculator</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Home
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Services
          </NavLink>
          <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Published Tariffs
          </div>
          <NavLink
            to="/tariffs/air-cargo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50 pl-5"
          >
            <Plane className="w-4 h-4 text-blue-600" />
            Air Cargo Tariff
          </NavLink>
          <NavLink
            to="/tariffs/sea-cargo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50 pl-5"
          >
            <Ship className="w-4 h-4 text-sky-600" />
            Sea Cargo Tariff
          </NavLink>
          <NavLink
            to="/facilities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Facilities
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50"
          >
            Contact &amp; Enquiries
          </NavLink>

          <div className="pt-4 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm shadow"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
