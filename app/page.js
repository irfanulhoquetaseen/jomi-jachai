'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QrScannerModal from '@/components/QrScannerModal';

const demoCases = [
  { dag: '101', label: 'নিরাপদ জমি', tag: '১০১', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
  { dag: '102', label: 'আরেকটি নিরাপদ জমি', tag: '১০২', color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800' },
  { dag: '103', label: 'নামে পার্থক্য', tag: '১০৩', color: 'border-amber-200 bg-amber-50/70 text-amber-800' },
  { dag: '104', label: 'বন্ধক', tag: '১০৪', color: 'border-amber-200 bg-amber-50/70 text-amber-800' },
  { dag: '105', label: 'দুইবার বিক্রি', tag: '১০৫', color: 'border-rose-200 bg-rose-50/70 text-rose-800' },
  { dag: '106', label: 'মালিক নন', tag: '১০৬', color: 'border-rose-200 bg-rose-50/70 text-rose-800' },
  { dag: '107', label: 'বেশি জমি', tag: '১০৭', color: 'border-rose-200 bg-rose-50/70 text-rose-800' },
  { dag: '108', label: 'বদলানো দলিল', tag: '১০৮', color: 'border-rose-200 bg-rose-50/70 text-rose-800' },
  { dag: '109', label: 'খাস জমি', tag: '১০৯', color: 'border-rose-200 bg-rose-50/70 text-rose-800' },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setInfoMessage('অনুগ্রহ করে একটি দাগ নম্বর বা দলিল নম্বর লিখুন।');
      return;
    }
    setInfoMessage('');
    router.push(`/result?q=${encodeURIComponent(trimmed)}`);
  };

  const handleChipClick = (dag) => {
    router.push(`/result?q=${encodeURIComponent(dag)}`);
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-start px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Brand Icon & Header */}
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#14532d] text-white shadow-md shadow-[#14532d]/20">
          <svg
            className="w-9 h-9"
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

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14532d] tracking-tight mb-2">
          জমি যাচাই
        </h1>

        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xs sm:max-w-sm leading-relaxed">
          জমি কেনার আগে ১০ সেকেন্ডে জানুন নিরাপদ কি না
        </p>

        {/* Search Card */}
        <div className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 mb-6 text-left">
          <form onSubmit={handleSearch} className="flex flex-col gap-3">
            <label htmlFor="search-input" className="text-base font-semibold text-slate-800">
              জমির তথ্য দিন
            </label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (infoMessage) setInfoMessage('');
                }}
                placeholder="দাগ নম্বর বা দলিল নম্বর লিখুন"
                className="w-full min-h-[52px] h-13 px-4 text-slate-800 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {infoMessage && (
              <div className="px-3 py-2 rounded-lg bg-emerald-50 text-[#14532d] text-sm font-medium flex items-center gap-2 animate-fade-in">
                <span>💡</span>
                <span>{infoMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-1 w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-lg font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>যাচাই করুন</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-slate-100" />
            <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium">অথবা</span>
          </div>

          {/* QR Scan Button */}
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            className="w-full min-h-[48px] h-12 bg-emerald-50 hover:bg-emerald-100/80 active:scale-[0.99] border border-emerald-200 text-[#14532d] text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>QR স্ক্যান করুন</span>
          </button>
        </div>

        {/* Demo Cases Section */}
        <div className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 text-left">
          <h2 className="text-base font-bold text-slate-800 mb-1">
            নমুনা দেখুন
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            নিচের যেকোনো নমুনায় ট্যাপ করে সরাসরি ফলাফল দেখুন:
          </p>

          <div className="flex flex-wrap gap-2">
            {demoCases.map((item) => (
              <button
                key={item.dag}
                type="button"
                onClick={() => handleChipClick(item.dag)}
                className={`min-h-[48px] px-3.5 py-2 rounded-xl border text-sm font-medium transition-all hover:shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer ${item.color}`}
              >
                <span>{item.label}</span>
                <span className="opacity-70 text-xs">({item.tag})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subtle Footer */}
        <footer className="mt-8 text-xs text-slate-400 text-center pb-6">
          ভূমি সেবা ডিজিটালাইজেশন সহায়তা &bull; ২০২৬
        </footer>
      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </main>
  );
}
