import React from 'react';
import { ArrowDownRight, ArrowUpRight, Boxes, Clock3, Container, ShieldCheck, ShipWheel, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/ui/SEO';

const capabilities = [
  { icon: Container, number: '01', title: 'Bonded warehousing', text: 'Secure customs-bonded space for cargo awaiting clearance.' },
  { icon: ShipWheel, number: '02', title: 'Sea freight', text: 'Container receiving, handling and covered storage.' },
  { icon: Truck, number: '03', title: 'Cargo movement', text: 'Coordinated inland transfers and last-mile handover.' },
];

export const HomePage: React.FC = () => (
  <>
    <SEO title="Gorod Logistics | Freight, bonded warehousing and cargo care" description="Gorod Logistics delivers bonded warehousing, freight handling and cargo movement from Thiruvananthapuram." />
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#0c323b] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,23,28,.78),rgba(4,33,39,.38),rgba(4,33,39,.72)),url('https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,18,22,.33),transparent_55%,rgba(2,18,22,.65))]" />
      <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <div className="max-w-4xl">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[.24em] text-[#b7e3e8]">Gorod International Agency Pvt Ltd</p>
          <h1 className="max-w-4xl font-[Outfit] text-5xl font-extrabold leading-[.94] tracking-[-.055em] sm:text-7xl lg:text-[94px]">Cargo moves.<br /><em className="font-semibold text-[#8ed2d6]">Business flows.</em></h1>
          <div className="mt-9 flex flex-col gap-7 border-t border-white/25 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-6 text-white/85 sm:text-base">A clear, capable partner for customs-bonded warehousing, freight handling and cargo movement in Kerala.</p>
            <Link to="/contact" className="group inline-flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/80 text-center text-xs font-bold uppercase tracking-[.14em] transition hover:border-[#8ed2d6] hover:bg-[#006873] sm:h-36 sm:w-36">Start an<br />enquiry <ArrowDownRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-y-1 group-hover:translate-x-1" /></Link>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-end">
        <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#006873]">Gorod Logistics</p><h2 className="font-[Outfit] text-4xl font-extrabold leading-[1.03] tracking-[-.045em] text-[#0c1e28] sm:text-5xl">More than a warehouse.<br /><em className="font-semibold text-[#006873]">A smoother route.</em></h2></div>
        <p className="max-w-xl text-base leading-7 text-[#4b5862]">From receiving international cargo to customs clearance and onward movement, our people keep each step visible, compliant and under control.</p>
      </div>
      <div className="mx-auto mt-16 grid max-w-[1320px] border-t border-[#006873]/20 md:grid-cols-3">
        {capabilities.map(({ icon: Icon, number, title, text }) => <article key={number} className="group border-b border-[#006873]/20 py-9 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><div className="mb-12 flex items-start justify-between text-[#006873]"><Icon className="h-8 w-8 stroke-[1.3]" /><span className="text-xs font-bold tracking-widest">{number}</span></div><h3 className="font-[Outfit] text-2xl font-bold tracking-[-.03em] text-[#0c1e28]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-[#64727b]">{text}</p><Link to="/services" className="mt-7 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#006873]">Explore service <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link></article>)}
      </div>
    </section>

    <section className="bg-[#eaf5f6] px-5 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div className="relative min-h-[360px] overflow-hidden rounded-[3px] bg-[#0c323b]"><div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(0,47,57,.15),rgba(0,21,26,.56)),url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" /><div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 border-t border-white/35 pt-4 text-xs text-white"><Boxes className="h-5 w-5" /> Customs-bonded public warehouse · TRV1U001</div></div><div><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#006873]">Built for control</p><h2 className="font-[Outfit] text-4xl font-extrabold leading-[1.05] tracking-[-.045em] text-[#0c1e28]">Your cargo.<br /><em className="font-semibold text-[#006873]">Always accounted for.</em></h2><div className="mt-8 space-y-5 border-t border-[#006873]/20 pt-6">{[[ShieldCheck,'Customs-ready','Secure bonded custody and documentation.'],[Clock3,'Clear updates','One team, clear status at each stage.']].map(([Icon,title,text]) => { const I = Icon as React.ElementType; return <div key={title as string} className="flex gap-4"><I className="mt-1 h-5 w-5 shrink-0 text-[#006873]"/><div><h3 className="font-bold text-[#0c1e28]">{title as string}</h3><p className="mt-1 text-sm leading-6 text-[#60717b]">{text as string}</p></div></div> })}</div><Link to="/facilities" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#006873] px-6 py-3 text-[10px] font-bold uppercase tracking-[.15em] text-white transition hover:bg-[#0c323b]">View our facility <ArrowUpRight className="h-4 w-4" /></Link></div></div></section>

    <section className="bg-[#0c1e28] px-5 py-20 text-white sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-12 md:flex-row md:items-end"><div><p className="mb-4 text-[10px] font-bold uppercase tracking-[.2em] text-[#8ed2d6]">Let’s move forward</p><h2 className="font-[Outfit] text-4xl font-extrabold leading-[1.02] tracking-[-.045em] sm:text-6xl">Talk to our<br /><em className="font-semibold text-[#8ed2d6]">logistics team.</em></h2></div><Link to="/contact" className="group inline-flex items-center gap-3 border-b border-white pb-3 text-xs font-bold uppercase tracking-[.16em]">Send an enquiry <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link></div></section>
  </>
);
