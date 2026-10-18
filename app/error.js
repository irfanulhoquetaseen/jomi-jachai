'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log error securely on client console without leaking sensitive data
    console.error('Application runtime error:', error?.message || error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f8faf7] text-slate-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-3xl">
          ⚠️
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            একটি অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            অনুরোধটি সম্পন্ন করার সময় একটি কারিগরি ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা কিছুক্ষণ পর প্রবেশ করুন।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>

          <Link
            href="/"
            className="flex-1 min-h-[48px] h-12 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-base font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            মূল পাতায় ফিরুন
          </Link>
        </div>
      </div>
    </main>
  );
}
