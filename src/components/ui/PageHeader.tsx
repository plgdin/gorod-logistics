import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  description: string;
  breadcrumbs?: { label: string; href?: string }[];
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  badge,
  title,
  description,
  breadcrumbs = [{ label: 'Home', href: '/' }],
  action,
}) => {
  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-200">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {badge && (
              <span className="inline-block px-3 py-1 bg-blue-900/60 text-blue-400 border border-blue-700/50 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
                {badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </div>
  );
};
