import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Printer,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { SEO } from '../components/ui/SEO';
import { SOPDocumentTemplates } from '../features/sop/SOPDocumentTemplates';
import { SOPRemovalValidator } from '../features/sop/SOPRemovalValidator';
import { SOPWeightEscalationTool } from '../features/sop/SOPWeightEscalationTool';
import { CBW_DETAILS } from '../features/sop/sopData';
import {
  SOP_FULL_SECTIONS,
  type SOPBlock,
  type SOPFullSection,
  type SOPTextRun,
} from '../features/sop/sopFull';

type Tab = 'manual' | 'documents' | 'weight' | 'removal';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'manual', label: 'Full SOP Manual', icon: BookOpen },
  { id: 'documents', label: 'Forms & Registers', icon: FileText },
  { id: 'weight', label: '±5 kg Escalation', icon: Scale },
  { id: 'removal', label: 'Removal Validator', icon: ShieldCheck },
];

const Runs: React.FC<{ runs: SOPTextRun[] }> = ({ runs }) => (
  <>
    {runs.map((run, index) => {
      if (run.bold && run.italic) {
        return (
          <strong key={index} className="font-semibold text-white">
            <em>{run.text}</em>
          </strong>
        );
      }
      if (run.bold) {
        return (
          <strong key={index} className="font-semibold text-white">
            {run.text}
          </strong>
        );
      }
      if (run.italic) {
        return <em key={index}>{run.text}</em>;
      }
      return <React.Fragment key={index}>{run.text}</React.Fragment>;
    })}
  </>
);

const BlockView: React.FC<{ block: SOPBlock }> = ({ block }) => {
  if (block.kind === 'paragraph') {
    return (
      <p className="text-sm leading-relaxed text-slate-300">
        <Runs runs={block.runs} />
      </p>
    );
  }

  if (block.kind === 'list') {
    const items = block.items.map((runs, index) => (
      <li key={index} className="pl-1">
        <Runs runs={runs} />
      </li>
    ));
    return block.ordered ? (
      <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300 marker:text-red-400">
        {items}
      </ol>
    ) : (
      <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300 marker:text-red-400">
        {items}
      </ul>
    );
  }

  const header = block.hasHeader ? block.rows[0] : null;
  const body = block.hasHeader ? block.rows.slice(1) : block.rows;

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full border-collapse text-left text-xs">
        {header && (
          <thead>
            <tr className="bg-slate-900 text-[11px] uppercase tracking-wider text-slate-300">
              {header.map((cell, index) => (
                <th key={index} className="px-3 py-2 font-semibold">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-800">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 align-top leading-relaxed text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const sectionSpacing: Record<SOPFullSection['level'], string> = {
  1: 'mt-12 border-t border-slate-800 pt-8',
  2: 'mt-10',
  3: 'mt-8',
  4: 'mt-6',
};

const headingClass: Record<SOPFullSection['level'], string> = {
  1: 'text-2xl font-black tracking-tight text-white',
  2: 'text-xl font-extrabold tracking-tight text-white',
  3: 'text-base font-bold text-red-300',
  4: 'text-[13px] font-bold uppercase tracking-wider text-slate-300',
};

const SectionView: React.FC<{ section: SOPFullSection }> = ({ section }) => {
  const Heading = (section.level === 1 ? 'h2' : section.level === 2 ? 'h3' : 'h4') as
    | 'h2'
    | 'h3'
    | 'h4';

  return (
    <section id={section.id} className={`scroll-mt-24 ${sectionSpacing[section.level]}`}>
      <Heading className={headingClass[section.level]}>
        {section.number && (
          <span className="mr-2 font-mono text-sm font-bold text-[#c0392b]">
            {section.number}
          </span>
        )}
        {section.title}
      </Heading>

      <div
        className={`mt-3 space-y-3 ${
          section.level >= 3 ? 'border-l-2 border-slate-800 pl-4 sm:pl-5' : ''
        }`}
      >
        {section.blocks.map((block, index) => (
          <BlockView key={index} block={block} />
        ))}
      </div>
    </section>
  );
};

const tocSections = SOP_FULL_SECTIONS.filter((section) => section.level <= 3);

const tocIndent: Record<number, string> = {
  1: 'pl-2 font-semibold text-slate-200',
  2: 'pl-4 text-slate-400',
  3: 'pl-7 text-slate-500',
};

const ContentsNav: React.FC = () => (
  <nav className="space-y-0.5">
    {tocSections.map((section) => (
      <a
        key={section.id}
        href={`#${section.id}`}
        className={`block truncate rounded px-2 py-1 text-[11px] leading-snug transition-colors hover:bg-slate-800 hover:text-white ${tocIndent[section.level]}`}
        title={`${section.number} ${section.title}`.trim()}
      >
        {section.number && <span className="mr-1 font-mono text-[#c0392b]">{section.number}</span>}
        {section.title}
      </a>
    ))}
  </nav>
);

export const SOPPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('manual');

  const handlePrint = () => {
    setActiveTab('manual');
    window.setTimeout(() => window.print(), 60);
  };

  return (
    <div id="top" className="sop-document min-h-screen bg-slate-950 text-slate-100 font-sans">
      <SEO
        title="SOP Manual | Gorod Logistics CBW"
        description="Complete Standard Operating Procedure for the Gorod Logistics customs bonded warehouse, TRV1U001."
      />

      <header className="sop-print-hide sticky top-0 z-30 border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <div>
              <div className="text-sm font-extrabold tracking-wider text-white">SOP MANUAL</div>
              <div className="font-mono text-[10px] text-red-400">
                {CBW_DETAILS.warehouseCode} &bull; Bond {CBW_DETAILS.bondNumber}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/sop/GL-BWH-SOP-01.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </a>
            <a
              href="/sop/GL-BWH-SOP-01.docx"
              download
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">DOCX</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="sop-print-hide rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Standard Operating Procedure</h1>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">
                Complete clause-level text, §1&ndash;§4.4, generated from{' '}
                <span className="font-mono text-slate-300">GL-BWH-SOP-01.docx</span>. Receipt, storage,
                handling, removal, statutory documentation and ICEGATE returns at {CBW_DETAILS.location}.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                {SOP_FULL_SECTIONS.length} sections &bull; {tocSections.length} indexed headings
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#852929] px-4 py-2 text-xs font-bold text-white hover:bg-[#6b2020]"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        <div className="sop-print-hide flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#852929] text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'manual' && (
          <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
            <aside className="sop-print-hide hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-3">
                <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Contents
                </div>
                <ContentsNav />
              </div>
            </aside>

            <div className="sop-print-body min-w-0">
              <div className="sop-print-only mb-8 border-b-2 border-[#852929] pb-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#852929]">
                  Gorod Logistics — Customs Bonded Warehouse
                </div>
                <h1 className="mt-1 text-2xl font-black text-black">
                  Standard Operating Procedure
                </h1>
                <div className="mt-1 font-mono text-[11px] text-black">
                  GL-BWH-SOP-01 &bull; Warehouse {CBW_DETAILS.warehouseCode} &bull; Bond{' '}
                  {CBW_DETAILS.bondNumber} &bull; {CBW_DETAILS.location}
                </div>
              </div>

              <details className="sop-print-hide mb-6 rounded-xl border border-slate-800 bg-slate-900 p-3 lg:hidden">
                <summary className="cursor-pointer text-xs font-bold text-slate-300">
                  Contents ({tocSections.length} sections)
                </summary>
                <div className="mt-2">
                  <ContentsNav />
                </div>
              </details>

              {SOP_FULL_SECTIONS.map((section) => (
                <SectionView key={section.id} section={section} />
              ))}

              <div className="sop-print-hide mt-12 border-t border-slate-800 pt-6 text-center">
                <a
                  href="#top"
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Back to top
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && <SOPDocumentTemplates />}
        {activeTab === 'weight' && <SOPWeightEscalationTool />}
        {activeTab === 'removal' && <SOPRemovalValidator />}
      </main>
    </div>
  );
};
