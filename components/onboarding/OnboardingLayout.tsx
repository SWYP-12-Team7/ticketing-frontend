"use client";

import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  step: 1 | 2;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onSkip?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export function OnboardingLayout({
  step,
  title,
  subtitle,
  children,
  onSkip,
  onNext,
  isNextDisabled = false,
  nextLabel = "계속하기",
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <header className="px-6 pt-10 pb-6">
        <h1 className="py-2.5 text-display-small font-semibold leading-[128%] tracking-[-0.025em] text-black">
          와르르가 내 맞춤 행사를{" "}
          <span className="text-orange">스위프</span>
          님에게 추천하기 위해 필요한 과정이에요!
        </h1>
        <p className="py-2.5 text-2xl  leading-[150%] tracking-[-0.025em] ">
          <span className="font-semibold text-orange">STEP {step}</span>{" "}
          <span className="font-medium text-black">{subtitle}</span>
        </p>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 px-6 pb-32 overflow-y-auto">
        {children}
      </main>

      {/* 하단 버튼 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 py-3 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            건너뛰기
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled}
            className={cn(
              "flex-[2] py-3 rounded-full font-medium transition-colors",
              isNextDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange text-white hover:bg-orange/90"
            )}
          >
            {nextLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}
