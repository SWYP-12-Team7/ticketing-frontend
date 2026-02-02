import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Providers from "./providers";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "와르르",
  description: "SWYP 7th Team front",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
