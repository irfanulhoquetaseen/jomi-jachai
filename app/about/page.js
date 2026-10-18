import Link from 'next/link';

export const metadata = {
  title: 'আমাদের সম্পর্কে | জমি যাচাই',
  description: 'জমি যাচাই প্ল্যাটফর্মের লক্ষ্য, ৪টি সহজ ধাপে যাচাই পদ্ধতি এবং ভূমি নিরাপত্তা সম্পর্কে জানুন।',
};

export default function AboutPage() {
  const steps = [
    {
      num: '১',
      title: 'দলিল বা দাগ নম্বর অনুসন্ধান',
      desc: 'নাগরিকরা জমি ক্রয়ের পূর্বে সংশ্লিষ্ট দলিলের নম্বর (যেমন: DEED-1001) অথবা খতিয়ানের দাগ নম্বর দিয়ে কয়েক সেকেন্ডেই অনুসন্ধান করতে পারেন। দলিলের কিউআর কোড স্ক্যান করেও অনুসন্ধান করা সম্ভব।',
      icon: '🔎',
    },
    {
      num: '২',
      title: 'ক্রিপ্টোগ্রাফিক হ্যাশ সততা যাচাই',
      desc: 'প্রতিটি দলিলের তথ্য (দলিল নম্বর, দাগ, বিক্রেতা, ক্রেতা, জমির পরিমাণ, তারিখ এবং পূর্ববর্তী দলিলের লিঙ্ক) নিয়ে SHA-256 ডিজিটাল হ্যাশ গঠিত হয়। দলিলের কোনো তথ্যে ১ অক্ষরের পরিবর্তন হলেও তাৎক্ষণিকভাবে জালিয়াতি ধরা পড়ে।',
      icon: '🔐',
    },
    {
      num: '৩',
      title: '৭-স্তরের স্বয়ংক্রিয় নিরাপত্তা নিরীক্ষা',
      desc: 'ডাটাবেসের সাথে মিলিয়ে সিস্টেম একই সাথে যাচাই করে: একই জমি একাধিক বিক্রির চেষ্টা (দ্বৈত বিক্রয়), খতিয়ানভুক্ত মূল মালিকের সাথে মিল, অনুমোদিত সীমার বেশি জমি বিক্রি, নামজারি স্ট্যাটাস, সরকারি খাস জমি কি না, এবং ব্যাংক ঋণ বা মামলার অবস্থা।',
      icon: '🛡️',
    },
    {
      num: '৪',
      title: 'সহজ ট্রাফিক লাইট সিদ্ধান্ত',
      desc: 'জটিল কোনো আইনি ভাষা ছাড়াই সরাসরি ৩ রঙে সিদ্ধান্ত প্রকাশ করা হয়: সবুজ (নিরাপদ জমি), হলুদ (সতর্কতা ও আরও যাচাই প্রয়োজন), অথবা লাল (ঝুঁকিপূর্ণ—জমি কেনা থেকে বিরত থাকুন)।',
      icon: '🚦',
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8faf7] text-slate-800 px-4 py-8 sm:py-12">
      <div className="w-full max-w-3xl mx-auto space-y-8">

        {/* Back Link & Header */}
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-[#14532d] hover:underline mb-1 cursor-pointer"
          >
            ← মূল পাতায় ফিরুন
          </Link>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14532d] tracking-tight">
            জমি যাচাই সম্পর্কে
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            ভূমি প্রতারণা রোধে ক্রিপ্টোগ্রাফিক ডেটা সুরক্ষা ও তাৎক্ষণিক নাগরিক যাচাই ব্যবস্থা।
          </p>
        </div>

        {/* The Problem Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-bold text-slate-900">
              মূল সমস্যা: জমি কিনতে গিয়ে মানুষ কেন প্রতারিত হয়?
            </h2>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            বাংলাদেশে জমি কেনাবেচায় সাধারণ নাগরিকরা সবচেয়ে বেশি ক্ষতিগ্রস্ত হন তথ্যের অস্বচ্ছতার কারণে। অসৎ চক্র প্রায়ই ভুয়া মালিক সাজিয়ে জমি বিক্রি করে, একই দাগের জমি একাধিক ব্যক্তির কাছে রেজিস্ট্রি করে, ব্যাংকে বন্ধকী জমি গোপন রাখে, কিংবা সরকারি খাস জমি নিরীহ ক্রেতার কাছে বিক্রি করে দেয়। ক্রয়ের আগে তাৎক্ষণিক নির্ভরযোগ্য যাচাইয়ের সুযোগ না থাকায় কোটি কোটি টাকার প্রতারণা ও দীর্ঘমেয়াদী দেওয়ানি মামলা তৈরি হয়।
          </p>
        </section>

        {/* 4 Simple Steps Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 px-1">
            পদ্ধতি: যেভাবে ৪টি সহজ ধাপে সিস্টেম কাজ করে
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-emerald-50 text-[#14532d] font-bold text-sm flex items-center justify-center border border-emerald-100">
                      {step.num}
                    </span>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dummy Data Disclaimer */}
        <section className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 text-base font-bold text-amber-900">
            <span>ℹ️</span>
            <span>নকল ডেমো ডেটা সংক্রান্ত স্পষ্টীকরণ</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-900/90">
            এই প্ল্যাটফর্মটি একটি গবেষণামূলক ও ডেমো প্রজেক্ট। এতে প্রদর্শিত সকল ব্যক্তি, খতিয়ান, দাগ নম্বর, দলিল নম্বর ও ভৌগোলিক তথ্য শতভাগ কাল্পনিক ও প্রতীকী। কোনো প্রকৃত নাগরিকের জাতীয় পরিচয়পত্র (এনআইডি), ব্যক্তিস্বার্থ বা বাস্তব সরকারি সার্ভারের সংবেদনশীল তথ্য এখানে ব্যবহার বা স্ক্র্যাপ করা হয়নি।
          </p>
        </section>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 min-h-[48px] h-12 bg-[#14532d] hover:bg-[#124224] active:scale-[0.99] text-white text-base font-bold rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            নিজে যাচাই করে দেখুন
          </Link>
          <Link
            href="/officer"
            className="flex-1 min-h-[48px] h-12 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-base font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer"
          >
            কর্মকর্তা পোর্টাল
          </Link>
        </div>

      </div>
    </main>
  );
}
