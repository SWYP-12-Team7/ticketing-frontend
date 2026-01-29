"use client";

import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToTopProps {
  className?: string;
  showAfter?: number; // 이 스크롤 위치 이후에 버튼 표시 (기본 200px)
}

export function ScrollToTop({ className, showAfter = 200 }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full border border-border bg-white shadow-lg transition-all hover:bg-muted",
        className
      )}
      aria-label="맨 위로 이동"
    >
      <ChevronUp className="size-6" />
    </button>
  );
}
