'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Helper to convert English digits to Bangla numerals for display
function toBanglaDigits(num) {
  if (num === null || num === undefined) return '';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[Number(d)]);
}

const SAFE_DEEDS_LIST = [
  { id: 'DEED-1001', label: 'DEED-1001 (দাগ ১০১ - আব্দুল করিম → রফিকুল ইসলাম)' },
  { id: 'DEED-1002', label: 'DEED-1002 (দাগ ১০২ - নাসির উদ্দিন → সুমি আক্তার)' },
  { id: 'DEED-1003', label: 'DEED-1003 (দাগ ১০৩ - কাল্পনিক বিক্রেতা আনোয়ার → মোঃ রহিম)' },
];

export default function OfficerDemoPage() {
  const [selectedDeedNo, setSelectedDeedNo] = useState('DEED-1001');
  const [deedData, setDeedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' | 'error'
  const [lastActionDeedNo, setLastActionDeedNo] = useState('');

  // Fetch current details of selected deed
  useEffect(() => {
    let ignore = false;
    fetch('/api/officer/demo/info')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success && data.deeds) {
          const found = data.deeds.find((d) => d.deed_no === selectedDeedNo);
          setDeedData(found || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedDeedNo]);

  const refreshDeedInfo = async (deedNo) => {
    try {
      const res = await fetch('/api/officer/demo/info');
      const data = await res.json();
      if (res.ok && data.success && data.deeds) {
        const found = data.deeds.find((d) => d.deed_no === deedNo);
        setDeedData(found || null);
      }
    } catch {
      // ignore
    }
  };

  // Handle Tamper Action
  const handleTamper = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/officer/demo/tamper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deed_no: selectedDeedNo }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
        setMessageType('success');
        setLastActionDeedNo(selectedDeedNo);
        await refreshDeedInfo(selectedDeedNo);
      } else {
        setMessage(data.message || 'দলিল পরিবর্তন করতে ব্যর্থ হয়েছে।');
        setMessageType('error');
      }
    } catch {
      setMessage('সার্ভারের সাথে যোগাযোগ করা যায়নি।');
      setMessageType('error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Restore Action
  const handleRestore = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/officer/demo/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deed_no: selectedDeedNo }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(data.message);
        setMessageType('success');
        setLastActionDeedNo(selectedDeedNo);
        await refreshDeedInfo(selectedDeedNo);
      } else {
        setMessage(data.message || 'দলিল পূর্বাবস্থায় ফেরাতে ব্যর্থ হয়েছে।');
        setMessageType('error');
      }
    } catch {
      setMessage('সার্ভারের সাথে যোগাযোগ করা যায়নি।');
      setMessageType('error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] text-slate-800 px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl mx-auto space-y-6">

        {/* Back Link & Title */}
        <div>
          <Link
            href="/officer"
            className="inline-flex items-center text-sm font-semibold text-[#14532d] hover:underline mb-2 cursor-pointer"
          >
            ← ড্যাশবোর্ডে ফিরুন
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ডেমো: দলিল জাল করে দেখুন
          </h1>
        </div>

        {/* Note at top in Bangla */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 shadow-xs flex items-start gap-3.5">
          <span className="text-2xl leading-none">💡</span>
          <p className="text-base font-semibold leading-relaxed">
            এটি শুধু দেখানোর জন্য: দলিলের তথ্য চুপচাপ বদলালে সিস্টেম কীভাবে ধরে ফেলে।
          </p>
        </div>

        {/* Main Interactive Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">

          {/* Safe Deed Selection Dropdown */}
          <div className="space-y-2">
            <label
              htmlFor="deed-select"
              className="block text-base font-bold text-slate-700"
            >
              নিরাপদ ডেমো দলিল নির্বাচন করুন:
            </label>
            <div className="relative">
              <select
                id="deed-select"
                value={selectedDeedNo}
                onChange={(e) => {
                  setSelectedDeedNo(e.target.value);
                  setMessage('');
                }}
                disabled={actionLoading}
                className="w-full min-h-[48px] h-12 px-4 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-900 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#14532d] transition-all cursor-pointer"
              >
                {SAFE_DEEDS_LIST.map((deed) => (
                  <option key={deed.id} value={deed.id}>
                    {deed.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500">
              * শুধুমাত্র এই ৩টি পরীক্ষামূলক দলিলে জালকরণ পরীক্ষা করা যাবে।
            </p>
          </div>

          {/* Current Deed Status Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
              <span className="text-slate-600 font-medium">নির্বাচিত দলিল:</span>
              <span className="font-mono font-bold text-[#14532d] text-base">
                {selectedDeedNo}
              </span>
            </div>

            {loading ? (
              <div className="py-3 text-center text-slate-500">তথ্য লোড হচ্ছে...</div>
            ) : deedData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-500">দাগ নম্বর: </span>
                  <span className="font-semibold text-slate-800">
                    {toBanglaDigits(deedData.dag_no)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">বর্তমান জমির পরিমাণ: </span>
                  <span className="font-bold text-slate-900 text-base">
                    {toBanglaDigits(deedData.area)} শতক
                  </span>
                </div>
                <div className="sm:col-span-2 text-slate-700">
                  <span className="text-slate-500">মালিকানা: </span>
                  <span className="font-medium text-slate-800">{deedData.seller}</span>
                  <span className="mx-1.5 text-emerald-700 font-bold">→</span>
                  <span className="font-semibold text-[#14532d]">{deedData.buyer}</span>
                </div>
                {deedData.original_area !== null && deedData.original_area !== undefined && (
                  <div className="sm:col-span-2 pt-1 text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    ⚠ এই দলিলের জমির পরিমাণ পরিবর্তিত (মূল পরিমাণ ছিল: {toBanglaDigits(deedData.original_area)} শতক)
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Button 1: Tamper */}
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleTamper}
              className="w-full min-h-[48px] h-12 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-base transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              <span>
                {actionLoading ? 'পরিবর্তন হচ্ছে...' : 'দলিলের জমির পরিমাণ চুপচাপ বদলান'}
              </span>
            </button>

            {/* Button 2: Restore */}
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleRestore}
              className="w-full min-h-[48px] h-12 px-5 rounded-xl bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-bold text-base transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>↺</span>
              <span>
                {actionLoading ? 'পূর্বাবস্থায় নেওয়া হচ্ছে...' : 'আগের অবস্থায় ফিরুন'}
              </span>
            </button>
          </div>

        </div>

        {/* Message and Verification Card */}
        {message && (
          <div
            className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
              messageType === 'success'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-red-50/70 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none">
                {messageType === 'success' ? '✓' : '⚠'}
              </span>
              <div className="flex-1 text-base font-semibold leading-relaxed">
                {message}
              </div>
            </div>

            {/* "যাচাই করে দেখুন" button */}
            {lastActionDeedNo && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href={`/result?q=${encodeURIComponent(lastActionDeedNo)}`}
                  className="w-full sm:w-auto flex-1 min-h-[48px] h-12 px-6 rounded-xl bg-[#14532d] hover:bg-[#124224] text-white font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔍</span>
                  <span>যাচাই করে দেখুন</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="w-full sm:w-auto min-h-[48px] h-12 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                >
                  বার্তাটি সরান
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
