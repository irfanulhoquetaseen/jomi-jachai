import { Noto_Sans_Bengali } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata = {
  title: {
    default: "জমি যাচাই | ল্যান্ডটেক ২০২৬",
    template: "%s | জমি যাচাই",
  },
  description: "জমি কেনার আগে ১০ সেকেন্ডে জানুন নিরাপদ কি না - ডিজিটাল খতিয়ান ও দলিল যাচাই",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏡</text></svg>',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#14532d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className={`${notoSansBengali.className} min-h-screen flex flex-col bg-[#f8faf7] text-slate-800 antialiased`}>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="w-full py-5 text-center text-xs text-slate-400 border-t border-slate-200/50 mt-auto bg-[#f8faf7]">
          <div className="max-w-xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>ল্যান্ডটেক ২০২৬ | সম্পূর্ণ নকল ডেটা দিয়ে তৈরি ডেমো</span>
            <span>&bull;</span>
            <Link href="/about" className="text-[#14532d] hover:underline font-medium">
              আমাদের সম্পর্কে
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
