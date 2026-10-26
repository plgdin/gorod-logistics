import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    ['/', 'Home'],
    ['/services', 'Services'],
    ['/facilities', 'Facilities'],
    ['/about', 'About us'],
    ['/contact', 'Contact'],
  ] as const;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || open ? 'bg-white/95 shadow-[0_10px_30px_rgba(6,24,32,.08)] backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className={`flex h-[78px] items-center justify-between px-5 sm:px-9 lg:px-16 ${scrolled || open ? 'border-b border-[#006873]/10' : 'border-b border-white/15'}`}>
        <Link to="/" className="flex items-center gap-3" aria-label="Gorod Logistics home">
          <img src="/logo-cropped.png" alt="Gorod Logistics" className="h-11 w-auto drop-shadow-sm" />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 xl:gap-12 lg:flex" aria-label="Main navigation">
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `relative pb-1 text-[10px] font-bold uppercase tracking-[.18em] transition-colors ${scrolled ? 'text-[#0b232e] hover:text-[#006873]' : 'text-white hover:text-white'} ${isActive ? 'after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-6 after:-translate-x-1/2 after:bg-current' : ''}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact" className={`hidden items-center gap-2 rounded-full border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[.15em] transition-all sm:inline-flex ${scrolled ? 'border-[#0b232e] text-[#0b232e] hover:border-[#006873] hover:bg-[#006873] hover:text-white' : 'border-white/75 bg-white/10 text-white hover:bg-white hover:text-[#0b232e]'}`}>
          Enquire <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>

        <button onClick={() => setOpen(!open)} className={`rounded-full p-2 lg:hidden ${scrolled || open ? 'text-[#0b232e]' : 'text-white'}`} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && <nav className="border-b border-[#006873]/10 bg-white px-5 py-5 lg:hidden" aria-label="Mobile navigation">
        <div className="flex flex-col gap-1">
          {nav.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-bold text-[#0b232e] hover:bg-[#e6f4f6]">{label}</NavLink>)}
          <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-[#006873] px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">Enquire now</Link>
        </div>
      </nav>}
    </header>
  );
};
