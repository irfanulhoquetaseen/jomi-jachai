import Link from 'next/link';

export const metadata = {
  title: 'পাতাটি পাওয়া যায়নি (৪০৪) | জমি যাচাই',
  description: 'দুঃখিত, অনুরোধকৃত পাতাটি খুঁজে পাওয়া যায়নি।',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8faf7] text-slate-800 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-3xl">
          🔍
        </div>

        <div className="space-y-2">
          <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider">
            ত্রুটি ৪০৪
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            পাতাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা বিদ্যমান নেই অথবা অন্য কোনো ঠিকানায় স্থানান্তরিত করা হয়েছে।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            মূল পাতায় ফিরুন
          </Link>

          <Link
            href="/officer"
            className="flex-1 min-h-[48px] h-12 border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-base font-semibold rounded-xl transition-all flex items-center justify-center cursor-pointer"
          >
            কর্মকর্তা পোর্টাল
          </Link>
        </div>
      </div>
    </main>
  );
}
