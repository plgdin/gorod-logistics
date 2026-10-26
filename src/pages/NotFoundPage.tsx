import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Plane, Ship } from 'lucide-react';
import { SEO } from '../components/ui/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Page Not Found (404)"
        description="The requested page could not be found on Gorod Logistics web portal."
      />

      <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Error 404 &bull; Missing Route
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              The logistics link or document you requested does not exist or has been relocated.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/tariffs/air-cargo"
                className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plane className="w-3.5 h-3.5 text-blue-600" />
                <span>Air Tariff</span>
              </Link>

              <Link
                to="/tariffs/sea-cargo"
                className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Ship className="w-3.5 h-3.5 text-sky-600" />
                <span>Sea Tariff</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
