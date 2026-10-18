'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function toBanglaDigits(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[0-9]/g, (d) => banglaDigits[+d]);
}

// Loading Skeleton Component
function ResultSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4 animate-pulse">
      {/* Top Card Skeleton */}
      <div className="w-full h-44 bg-slate-200 rounded-2xl" />

      {/* Summary Skeleton */}
      <div className="w-full h-32 bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-3">
        <div className="w-1/2 h-5 bg-slate-200 rounded-md" />
        <div className="w-3/4 h-4 bg-slate-100 rounded-md" />
        <div className="w-2/3 h-4 bg-slate-100 rounded-md" />
      </div>

      {/* Checks Skeleton */}
      <div className="flex flex-col gap-3 mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-full h-20 bg-white rounded-2xl p-4 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="w-1/3 h-4 bg-slate-200 rounded-md" />
              <div className="w-2/3 h-3 bg-slate-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q');

  const [state, setState] = useState(() => ({
    loading: Boolean(q),
    data: null,
    errorMessage: q ? '' : 'কোনো দাগ বা দলিল নম্বর দেওয়া হয়নি।',
  }));

  useEffect(() => {
    if (!q) return;

    let isMounted = true;

    fetch(`/api/verify?q=${encodeURIComponent(q)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!isMounted) return;

        if (json.found) {
          setState({ loading: false, data: json, errorMessage: '' });
        } else {
          setState({
            loading: false,
            data: null,
            errorMessage: json.message || 'কোনো তথ্য পাওয়া যায়নি।',
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Fetch error:', err);
        setState({
          loading: false,
          data: null,
          errorMessage: 'তথ্য যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        });
      });

    return () => {
      isMounted = false;
    };
  }, [q]);

  if (state.loading) {
    return <ResultSkeleton />;
  }

  // Error / Not Found State
  if (state.errorMessage || !state.data) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        <div className="w-full bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            তথ্য পাওয়া যায়নি
          </h2>
          <p className="text-base text-slate-600 mb-6 leading-relaxed">
            {state.errorMessage || 'আপনার অনুসন্ধানকৃত দাগ বা দলিল নম্বরের কোনো রেকর্ড পাওয়া যায়নি।'}
          </p>
          <Link
            href="/"
            className="w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] text-white text-base font-bold rounded-xl transition-all flex items-center justify-center"
          >
            আবার খুঁজুন
          </Link>
        </div>
      </div>
    );
  }

  const { data } = state;

  // Verdict configurations
  const verdictConfig = {
    green: {
      cardBg: 'bg-[#f0fdf4]',
      cardBorder: 'border-[#bbf7d0]',
      textColor: 'text-[#16a34a]',
      icon: (
        <svg className="w-16 h-16 text-[#16a34a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    yellow: {
      cardBg: 'bg-[#fffbeb]',
      cardBorder: 'border-[#fde68a]',
      textColor: 'text-[#f59e0b]',
      icon: (
        <svg className="w-16 h-16 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    red: {
      cardBg: 'bg-[#fef2f2]',
      cardBorder: 'border-[#fecaca]',
      textColor: 'text-[#dc2626]',
      icon: (
        <svg className="w-16 h-16 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const currentTheme = verdictConfig[data.verdict] || verdictConfig.yellow;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-4">
      {/* 1. Top Verdict Card */}
      <div
        className={`w-full rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center transition-all ${currentTheme.cardBg} ${currentTheme.cardBorder}`}
      >
        <div className="mb-2">{currentTheme.icon}</div>
        <h1 className={`text-3xl font-extrabold tracking-tight mb-1 ${currentTheme.textColor}`}>
          {data.verdictTitle}
        </h1>
        <p className="text-sm font-medium text-slate-600">
          ৭টি নিরাপত্তা ও মালিকানা সূচকের ভিত্তিতে যাচাইকৃত
        </p>
      </div>

      {/* 2. Summary Line Card */}
      <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-2.5">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          জমির সংক্ষিপ্ত বিবরণ
        </h2>

        <div className="flex items-center justify-between text-base border-b border-slate-100 pb-2">
          <span className="text-slate-500 font-medium">দলিল ও দাগ নম্বর:</span>
          <span className="font-bold text-slate-800">
            {data.deed?.deed_no} (দাগ {toBanglaDigits(data.deed?.dag_no)})
          </span>
        </div>

        <div className="flex items-center justify-between text-base border-b border-slate-100 pb-2">
          <span className="text-slate-500 font-medium">হস্তান্তর:</span>
          <span className="font-semibold text-slate-800 text-right">
            {data.deed?.seller} <span className="text-slate-400">→</span> {data.deed?.buyer}
          </span>
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-slate-500 font-medium">জমির পরিমাণ:</span>
          <span className="font-bold text-[#14532d]">
            {toBanglaDigits(data.deed?.area)} শতক
            {data.mouza ? ` (${data.mouza})` : ''}
          </span>
        </div>
      </div>

      {/* 3. Each Check as a Card */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider px-1">
          যাচাইয়ের বিস্তারিত ফলাফল
        </h2>

        {data.checks?.map((check) => {
          let badgeIcon = '✅';
          let borderClass = 'border-slate-100';
          let reasonClass = 'text-slate-600';

          if (check.status === 'warn') {
            badgeIcon = '⚠️';
            borderClass = 'border-amber-200 bg-amber-50/30';
            reasonClass = 'text-amber-800 font-medium';
          } else if (check.status === 'fail') {
            badgeIcon = '❌';
            borderClass = 'border-rose-200 bg-rose-50/30';
            reasonClass = 'text-rose-800 font-medium';
          } else {
            badgeIcon = '✅';
            borderClass = 'border-emerald-100 bg-white';
            reasonClass = 'text-slate-600';
          }

          return (
            <div
              key={check.id}
              className={`w-full bg-white rounded-2xl p-4 border shadow-xs flex items-start gap-3 transition-colors ${borderClass}`}
            >
              <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                {badgeIcon}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-bold text-slate-800">
                  {check.title}
                </span>
                <span className={`text-sm leading-relaxed ${reasonClass}`}>
                  {check.reason}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Actions & Disclaimer */}
      <div className="flex flex-col gap-3 mt-2 mb-8">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-lg font-bold rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer"
        >
          আবার যাচাই করুন
        </button>

        <p className="text-xs text-slate-500 text-center leading-relaxed px-3">
          এটি একটি সহায়ক টুল। চূড়ান্ত সিদ্ধান্তের আগে সরকারি অফিসে নিশ্চিত হোন।
        </p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-start px-4 py-6 sm:py-10">
      <Suspense fallback={<ResultSkeleton />}>
        <ResultView />
      </Suspense>
    </main>
  );
}
