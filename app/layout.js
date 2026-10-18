import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata = {
  title: "জমি যাচাই | নিরাপদ জমি নিশ্চিতকরণ",
  description: "জমি কেনার আগে ১০ সেকেন্ডে জানুন নিরাপদ কি না - ডিজিটাল খতিয়ান ও দলিল যাচাই",
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
      <body className={`${notoSansBengali.className} min-h-screen bg-[#f8faf7] text-slate-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}
