'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper to convert English digits to Bangla numerals for display
function toBanglaDigits(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[Number(d)]);
}

export default function OfficerMutationPage() {
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingDeedNo, setApprovingDeedNo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load pending deeds on mount
  useEffect(() => {
    let ignore = false;
    fetch('/api/officer/mutation')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          if (data.success) {
            setDeeds(data.deeds || []);
          } else {
            setErrorMessage(data.message || 'তালিকা আনতে সমস্যা হয়েছে।');
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorMessage('সার্ভারের সাথে যোগাযোগ করা যায়নি।');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/officer/mutation');
      const data = await res.json();
      if (res.ok && data.success) {
        setDeeds(data.deeds || []);
      } else {
        setErrorMessage(data.message || 'তালিকা আনতে সমস্যা হয়েছে।');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে যোগাযোগ করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve Mutation
  const handleApprove = async (deedNo) => {
    setApprovingDeedNo(deedNo);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await fetch('/api/officer/mutation/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deed_no: deedNo }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(data.message || 'নামজারি সফলভাবে অনুমোদিত হয়েছে।');
        // Remove the row from the local state list
        setDeeds((prev) => prev.filter((d) => d.deed_no !== deedNo));
      } else {
        setErrorMessage(data.message || 'অনুমোদন করতে ব্যর্থ হয়েছে।');
      }
    } catch {
      setErrorMessage('অনুরোধ প্রক্রিয়া করতে সমস্যা হয়েছে।');
    } finally {
      setApprovingDeedNo(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] text-slate-800 px-4 py-8 md:py-12">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
          <div>
            <Link
              href="/officer"
              className="inline-flex items-center text-sm font-semibold text-[#14532d] hover:underline mb-1 cursor-pointer"
            >
              ← ড্যাশবোর্ডে ফিরুন
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532d] tracking-tight">
              নামজারি অনুমোদন (এসি ল্যান্ড)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              দলিল হস্তান্তরের পর খতিয়ান হালনাগাদ ও নামজারি সম্পন্ন করুন
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
          >
            {loading ? 'লোড হচ্ছে...' : 'তালিকা রিফ্রেশ করুন'}
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 shadow-xs">
            <span className="text-xl">✓</span>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {successMessage}
            </div>
            <button
              type="button"
              onClick={() => setSuccessMessage('')}
              className="text-emerald-700 hover:text-emerald-900 font-bold text-lg leading-none cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 shadow-xs">
            <span className="text-xl">⚠</span>
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {errorMessage}
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="text-red-700 hover:text-red-900 font-bold text-lg leading-none cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              ×
            </button>
          </div>
        )}

        {/* Deeds List Container */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#14532d] border-t-transparent rounded-full" />
            <p className="text-base text-slate-600 font-medium">
              অপেক্ষমাণ দলিলের তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : deeds.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 text-3xl flex items-center justify-center mb-4">
              ✓
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              কোনো অপেক্ষমাণ নামজারি নেই
            </h2>
            <p className="text-base text-slate-500 max-w-md leading-relaxed mb-6">
              বর্তমানে অনুমোদনের জন্য কোনো নতুন আবেদন জমা নেই। সকল সক্রিয় দলিলের নামজারি সম্পন্ন রয়েছে।
            </p>
            <Link
              href="/officer"
              className="inline-flex items-center justify-center px-6 min-h-[48px] bg-[#14532d] text-white font-bold rounded-xl hover:bg-[#124224] transition-all cursor-pointer shadow-sm"
            >
              ড্যাশবোর্ডে ফিরুন
            </Link>
          </div>
        ) : (
          /* List of Pending Deeds */
          <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-500 px-1">
              মোট অপেক্ষমাণ দলিল: {toBanglaDigits(deeds.length)} টি
            </div>

            {deeds.map((deed) => {
              const isApproving = approvingDeedNo === deed.deed_no;
              return (
                <div
                  key={deed.deed_no}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                >
                  {/* Deed Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-bold text-[#14532d] bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        {deed.deed_no}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                        নামজারি বাকি
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm pt-1">
                      <div>
                        <span className="text-slate-500">দাগ নম্বর: </span>
                        <span className="font-semibold text-slate-800">
                          {toBanglaDigits(deed.dag_no)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">জমির পরিমাণ: </span>
                        <span className="font-semibold text-slate-800">
                          {toBanglaDigits(deed.area)} শতক
                        </span>
                      </div>
                      <div className="sm:col-span-2 text-slate-700">
                        <span className="text-slate-500">মালিকানা হস্তান্তর: </span>
                        <span className="font-medium text-slate-800">{deed.seller}</span>
                        <span className="mx-2 text-emerald-700 font-bold">→</span>
                        <span className="font-bold text-[#14532d]">{deed.buyer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={`/result?q=${encodeURIComponent(deed.deed_no)}`}
                      className="inline-flex items-center justify-center min-h-[48px] px-4 rounded-xl border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer text-center"
                    >
                      যাচাই করে দেখুন ↗
                    </Link>

                    <button
                      type="button"
                      disabled={isApproving}
                      onClick={() => handleApprove(deed.deed_no)}
                      className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-xl bg-[#14532d] hover:bg-[#124224] text-white font-bold text-base transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isApproving ? 'অনুমোদন হচ্ছে...' : 'অনুমোদন করুন'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
