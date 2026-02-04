import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

// ===== 폰트 설정 =====

/**
 * Inter - 캘린더 날짜 숫자용
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Roboto - 캘린더 Pill 텍스트용
 */
const roboto = Roboto({
  weight: ["500"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "와르르",
  description: "SWYP 7th Team front",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        {/* Pretendard Variable - CDN */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="font-pretendard">
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-[1280px] flex-col border-1">
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <main className="flex-1 px-[80px]">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
