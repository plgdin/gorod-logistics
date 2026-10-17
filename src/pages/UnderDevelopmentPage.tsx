import React from 'react';

export const UnderDevelopmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#191919] text-white flex flex-col justify-between selection:bg-[#852929] selection:text-white px-6 py-10 font-sans">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo-tint.png"
            alt="Gorod Logistics Logo"
            className="h-10 w-auto object-contain"
          />
        </div>
        <span className="text-xs tracking-wider uppercase text-[#C1C1C1] border border-[#852929]/50 px-3 py-1 rounded-full">
          Under Development
        </span>
      </header>

      {/* Main Center Content */}
      <main className="max-w-2xl mx-auto w-full text-center my-auto space-y-6">
        <div className="flex justify-center mb-6">
          <img
            src="/logo-tint.png"
            alt="Gorod Logistics"
            className="h-24 sm:h-28 w-auto object-contain"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Website Coming Soon
        </h1>

        <p className="text-base sm:text-lg text-[#C1C1C1] leading-relaxed max-w-xl mx-auto font-normal">
          We are currently preparing our official digital presence. Our new platform will be available soon.
        </p>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-white/80 bg-[#852929]/30 border border-[#852929] px-4 py-2 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#852929] animate-pulse"></span>
            <span>Site Under Construction</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-[#C1C1C1]/70 border-t border-white/10 pt-6">
        &copy; {new Date().getFullYear()} Gorod Logistics. All rights reserved.
      </footer>
    </div>
  );
};
