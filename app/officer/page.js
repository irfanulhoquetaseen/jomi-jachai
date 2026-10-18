'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OfficerDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/officer/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      router.push('/officer/login');
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-start px-4 py-8 sm:py-12">
      <div className="w-full max-w-md mx-auto flex flex-col">
        {/* Top Header with Logout */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#14532d] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🏛️
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#14532d]">
                কর্মকর্তা ড্যাশবোর্ড
              </h1>
              <p className="text-xs text-slate-500">
                ভূমি সেবা ও নিবন্ধন ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>লগআউট</span>
          </button>
        </div>

        {/* 3 Main Action Cards */}
        <div className="flex flex-col gap-4">
          {/* Action 1: Register New Deed */}
          <Link
            href="/officer/register"
            className="group w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532d] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                📝
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-slate-800 group-hover:text-[#14532d] transition-colors">
                  নতুন দলিল নিবন্ধন
                </span>
                <span className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                  ডিজিটাল হ্যাশ ও কিউআর কোডসহ নতুন দলিল সংরক্ষণ
                </span>
              </div>
            </div>
            <span className="text-xl text-slate-400 group-hover:text-[#14532d] group-hover:translate-x-1 transition-all pl-2 shrink-0">
              →
            </span>
          </Link>

          {/* Action 2: Mutation Approval */}
          <Link
            href="/officer/mutation"
            className="group w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#14532d] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                ⚖️
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-slate-800 group-hover:text-[#14532d] transition-colors">
                  নামজারি অনুমোদন (এসি ল্যান্ড)
                </span>
                <span className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                  নামজারি আবেদন যাচাই ও খতিয়ান মালিকানা হালনাগাদ
                </span>
              </div>
            </div>
            <span className="text-xl text-slate-400 group-hover:text-[#14532d] group-hover:translate-x-1 transition-all pl-2 shrink-0">
              →
            </span>
          </Link>

          {/* Action 3: Demo Tampering */}
          <Link
            href="/officer/demo"
            className="group w-full bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shrink-0">
                🔬
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                  ডেমো: দলিল জাল করে দেখুন
                </span>
                <span className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                  দলিলের তথ্য অদলবদল করে হ্যাশ অমিল পরীক্ষা
                </span>
              </div>
            </div>
            <span className="text-xl text-slate-400 group-hover:text-amber-800 group-hover:translate-x-1 transition-all pl-2 shrink-0">
              →
            </span>
          </Link>
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-[#14532d] transition-colors"
          >
            ← নাগরিক সেবা পোর্টাল দেখুন
          </Link>
        </div>
      </div>
    </main>
  );
}
