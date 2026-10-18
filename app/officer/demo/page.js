import Link from 'next/link';

export default function OfficerDemoPage() {
  return (
    <main className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-3xl mb-4">
          🔬
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-1">
          ডেমো: দলিল জাল করে দেখুন
        </h1>
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm font-semibold my-4">
          শীঘ্রই আসছে
        </div>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          এই ইন্টারেক্টিভ ল্যাবে দলিলের যেকোনো তথ্য পরিবর্তন করে সিস্টেম কীভাবে তাৎক্ষণিকভাবে ক্রিপ্টোগ্রাফিক হ্যাশ অমিল শনাক্ত করে তা প্রদর্শন করা যাবে।
        </p>
        <Link
          href="/officer"
          className="w-full min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] text-white text-base font-bold rounded-xl transition-all flex items-center justify-center cursor-pointer"
        >
          ড্যাশবোর্ডে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
