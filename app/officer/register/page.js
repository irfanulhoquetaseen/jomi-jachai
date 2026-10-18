'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfficerRegisterPage() {
  const [formData, setFormData] = useState({
    deed_no: 'DEED-1010',
    dag_no: '',
    seller: '',
    buyer: '',
    area: '',
    deed_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationResult, setRegistrationResult] = useState(null);

  // Initialize date on client mount and fetch suggested next deed number
  useEffect(() => {
    fetch('/api/officer/next-deed')
      .then((res) => res.json())
      .then((data) => {
        setFormData((prev) => ({
          ...prev,
          deed_no: data.nextDeedNo || prev.deed_no,
          deed_date: new Date().toISOString().split('T')[0],
        }));
      })
      .catch((err) => {
        console.error('Failed fetching next deed:', err);
        setFormData((prev) => ({
          ...prev,
          deed_date: new Date().toISOString().split('T')[0],
        }));
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/officer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRegistrationResult(data);
      } else {
        setErrorMessage(data.message || 'দলিল নিবন্ধন ব্যর্থ হয়েছে।');
      }
    } catch (err) {
      console.error('Submit registration error:', err);
      setErrorMessage('সার্ভারের সাথে যোগাযোগ করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRegistrationResult(null);
    setErrorMessage('');
    fetch('/api/officer/next-deed')
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          deed_no: data.nextDeedNo || 'DEED-1010',
          dag_no: '',
          seller: '',
          buyer: '',
          area: '',
          deed_date: new Date().toISOString().split('T')[0],
        });
      })
      .catch(() => {
        setFormData({
          deed_no: 'DEED-1010',
          dag_no: '',
          seller: '',
          buyer: '',
          area: '',
          deed_date: new Date().toISOString().split('T')[0],
        });
      });
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-start px-4 py-6 sm:py-10">
      <div className="w-full max-w-md mx-auto flex flex-col">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/officer"
            className="text-sm font-semibold text-slate-600 hover:text-[#14532d] flex items-center gap-1 transition-colors"
          >
            <span>←</span>
            <span>ড্যাশবোর্ডে ফিরুন</span>
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-[#14532d] font-semibold">
            কর্মকর্তা পোর্টাল
          </span>
        </div>

        {/* Header */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532d]">
            নতুন দলিল নিবন্ধন
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            ডিজিটাল ক্রিপ্টোগ্রাফিক হ্যাশসহ নতুন বিক্রয় দলিল রেকর্ড করুন
          </p>
        </div>

        {/* If Registered Successfully: Show Success Card with QR Code */}
        {registrationResult ? (
          <div className="w-full bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-emerald-200 flex flex-col items-center text-center animate-fade-in">
            {/* Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center text-3xl mb-3 shadow-inner">
              ✓
            </div>

            <h2 className="text-2xl font-extrabold text-[#14532d] mb-1">
              দলিল সফলভাবে নিবন্ধিত হয়েছে!
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              ব্লকচেইন হ্যাশ তৈরি এবং ডিজিটাল ডেটাবেসে সংরক্ষিত হয়েছে
            </p>

            {/* QR Code Presentation */}
            <div className="w-full bg-[#f8faf7] p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                দলিলের ডিজিটাল কিউআর কোড
              </span>
              <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={registrationResult.qrDataUrl}
                  alt={`QR Code for ${registrationResult.deed?.deed_no}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                এই কিউআর কোড স্ক্যান করে নাগরিকরা সরাসরি দলিলের বৈধতা যাচাই করতে পারবেন।
              </p>
            </div>

            {/* Registered Details Summary */}
            <div className="w-full bg-slate-50 rounded-xl p-4 mb-6 text-left text-sm flex flex-col gap-2 border border-slate-100">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">দলিল নম্বর:</span>
                <span className="font-bold text-slate-800">{registrationResult.deed?.deed_no}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">দাগ নম্বর:</span>
                <span className="font-bold text-slate-800">{registrationResult.deed?.dag_no}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">বিক্রেতা:</span>
                <span className="font-semibold text-slate-800">{registrationResult.deed?.seller}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">ক্রেতা:</span>
                <span className="font-semibold text-slate-800">{registrationResult.deed?.buyer}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">জমির পরিমাণ:</span>
                <span className="font-bold text-[#14532d]">{registrationResult.deed?.area} শতক</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-slate-500 text-xs">ডিজিটাল হ্যাশ (SHA-256):</span>
                <span className="font-mono text-xs text-slate-700 break-all select-all mt-0.5">
                  {registrationResult.deed?.hash}
                </span>
              </div>
            </div>

            {/* Actions: Download QR & Verify */}
            <div className="w-full flex flex-col gap-3">
              <a
                href={registrationResult.qrDataUrl}
                download={`QR-${registrationResult.deed?.deed_no}.png`}
                className="w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📥</span>
                <span>QR ডাউনলোড করুন</span>
              </a>

              <Link
                href={`/result?q=${encodeURIComponent(registrationResult.deed?.deed_no)}`}
                className="w-full min-h-[48px] h-12 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[#14532d] text-base font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔍</span>
                <span>যাচাই করে দেখুন</span>
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="mt-1 w-full min-h-[44px] text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
              >
                + আরেকটি দলিল নিবন্ধন করুন
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="w-full bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 text-left">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Deed Number */}
              <div>
                <label htmlFor="deed_no" className="block text-sm font-bold text-slate-700 mb-1.5">
                  দলিল নম্বর (স্বয়ংক্রিয়)
                </label>
                <input
                  id="deed_no"
                  name="deed_no"
                  type="text"
                  required
                  value={formData.deed_no}
                  onChange={handleChange}
                  placeholder="যেমন: DEED-1010"
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all font-mono font-semibold"
                />
              </div>

              {/* Dag Number */}
              <div>
                <label htmlFor="dag_no" className="block text-sm font-bold text-slate-700 mb-1.5">
                  দাগ নম্বর (খতিয়ানে থাকা আবশ্যক)
                </label>
                <input
                  id="dag_no"
                  name="dag_no"
                  type="text"
                  required
                  value={formData.dag_no}
                  onChange={handleChange}
                  placeholder="যেমন: 101 বা ১০১"
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all"
                />
              </div>

              {/* Seller Name */}
              <div>
                <label htmlFor="seller" className="block text-sm font-bold text-slate-700 mb-1.5">
                  বিক্রেতার নাম
                </label>
                <input
                  id="seller"
                  name="seller"
                  type="text"
                  required
                  value={formData.seller}
                  onChange={handleChange}
                  placeholder="জমির বর্তমান মালিকের নাম"
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all"
                />
              </div>

              {/* Buyer Name */}
              <div>
                <label htmlFor="buyer" className="block text-sm font-bold text-slate-700 mb-1.5">
                  ক্রেতার নাম
                </label>
                <input
                  id="buyer"
                  name="buyer"
                  type="text"
                  required
                  value={formData.buyer}
                  onChange={handleChange}
                  placeholder="জমি ক্রয়কারীর নাম"
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all"
                />
              </div>

              {/* Area in Shatak */}
              <div>
                <label htmlFor="area" className="block text-sm font-bold text-slate-700 mb-1.5">
                  বিক্রিত জমির পরিমাণ (শতক)
                </label>
                <input
                  id="area"
                  name="area"
                  type="text"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="যেমন: 10 বা ১০"
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all"
                />
              </div>

              {/* Deed Registration Date */}
              <div>
                <label htmlFor="deed_date" className="block text-sm font-bold text-slate-700 mb-1.5">
                  দলিল নিবন্ধনের তারিখ
                </label>
                <input
                  id="deed_date"
                  name="deed_date"
                  type="date"
                  required
                  value={formData.deed_date}
                  onChange={handleChange}
                  className="w-full min-h-[48px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all"
                />
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="px-3.5 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>নিবন্ধন সম্পন্ন হচ্ছে...</span>
                  </>
                ) : (
                  <span>দলিল সংরক্ষণ ও হ্যাশ তৈরি করুন</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
