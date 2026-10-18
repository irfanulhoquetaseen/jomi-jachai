import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-bengali",
  display: "swap",
});

export const metadata = {
  title: "জমি যাচাই",
  description: "মোবাইল-ফার্স্ট বাংলা ডিজিটাল ভূমি যাচাই ও ভেরিফিকেশন সিস্টেম",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#090d16",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={notoSansBengali.variable}>
      <body className={`${notoSansBengali.className} antialiased min-h-screen bg-[#090d16] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
