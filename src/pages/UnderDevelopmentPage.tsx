import React from 'react';

export const UnderDevelopmentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#191919] text-white flex flex-col justify-between selection:bg-[#852929] selection:text-white px-6 py-12 font-sans">
      {/* Spacer to keep middle perfectly centered */}
      <div aria-hidden="true" className="h-6"></div>

      {/* Main Center Content */}
      <main className="max-w-3xl mx-auto w-full text-center flex flex-col items-center justify-center space-y-8 my-auto">
        {/* Large Centered Logo */}
        <div className="w-full flex justify-center">
          <img
            src="/logo-cropped.png"
            alt="Gorod Logistics"
            className="w-72 sm:w-96 md:w-[420px] max-w-[85vw] h-auto object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Website Coming Soon
        </h1>

        {/* Pill Status */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wide text-white/90 bg-[#852929]/30 border border-[#852929] px-5 py-2.5 rounded-full shadow-lg shadow-[#852929]/20">
            <span className="w-2.5 h-2.5 rounded-full bg-[#852929] animate-pulse"></span>
            <span>Under Development</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full text-center text-xs text-[#C1C1C1]/60 pt-6">
        &copy; {new Date().getFullYear()} Gorod Logistics. All rights reserved.
      </footer>
    </div>
  );
};
