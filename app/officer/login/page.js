'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OfficerLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanPasscode = passcode.trim();

    if (!cleanPasscode) {
      setErrorMessage('অনুগ্রহ করে কর্মকর্তা পাসকোড লিখুন।');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/officer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanPasscode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/officer');
        router.refresh();
      } else {
        setErrorMessage(data.message || 'ভুল পাসকোড। অনুগ্রহ করে সঠিক পাসকোড দিন।');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMessage('সার্ভারের সাথে যোগাযোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center">
        {/* Officer Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#14532d] text-white flex items-center justify-center shadow-md shadow-[#14532d]/20 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14532d] mb-1">
          কর্মকর্তা প্রবেশ
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          ভূমি নিবন্ধন ও সেবা ব্যবস্থাপনা পোর্টাল
        </p>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-left">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="passcode-input" className="block text-sm font-semibold text-slate-700 mb-2">
                নিরাপত্তা পাসকোড
              </label>
              <input
                id="passcode-input"
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="পাসকোড দিন"
                className="w-full min-h-[50px] h-12 px-4 text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14532d] focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            {errorMessage && (
              <div className="px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>যাচাই হচ্ছে...</span>
                </>
              ) : (
                <span>প্রবেশ করুন</span>
              )}
            </button>
          </form>
        </div>

        {/* Back to Citizen Homepage */}
        <Link
          href="/"
          className="mt-6 text-sm font-medium text-slate-500 hover:text-[#14532d] transition-colors flex items-center gap-1.5"
        >
          <span>←</span>
          <span>নাগরিক হোমপেজে ফিরে যান</span>
        </Link>
      </div>
    </main>
  );
}
