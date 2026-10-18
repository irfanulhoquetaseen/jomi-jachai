export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mobile container */}
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center text-center z-10">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>মোবাইল-ফার্স্ট ভূমি তথ্য প্ল্যাটফর্ম</span>
        </div>

        {/* Main Logo / Icon */}
        <div className="mb-6 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-400/30">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Main Title - Large Bangla Text */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 mb-4 drop-shadow-sm">
          জমি যাচাই
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xs sm:max-w-sm mb-8 leading-relaxed font-normal">
          ডিজিটাল খতিয়ান, দাগ নম্বর এবং ভূমি রেকর্ড দ্রুত ও সহজে নিশ্চিত করুন
        </p>

        {/* Placeholder info card */}
        <div className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl text-left">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
            <span className="font-medium text-slate-300">সিস্টেম স্ট্যাটাস</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              রেডি
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 leading-relaxed">
            শীঘ্রই আসছে: QR কোড স্ক্যানার, খতিয়ান ভেরিফিকেশন এবং মাঠপর্যায়ের ভূমি কর্মকর্তা পোর্টাল।
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-xs text-slate-500">
          &copy; 2026 জমি যাচাই &bull; সর্বস্বত্ব সংরক্ষিত
        </footer>
      </div>
    </main>
  );
}
