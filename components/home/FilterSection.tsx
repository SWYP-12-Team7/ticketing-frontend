"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface FilterSectionProps {
  className?: string;
}

export function FilterSection({ className }: FilterSectionProps) {
  return (
    <div
      className={cn(
        "flex h-[642px] flex-col justify-between rounded-xl border border-[#FA7228] px-[20px] py-[24px]",
        className
      )}
    >
      {/* 콘텐츠 영역 */}
      <div />

      {/* 하단 버튼 */}
      <button className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-orange px-[12px] py-[12px] text-[16px] font-medium leading-[140%] text-white">
        탐색하기
        <ChevronRight className="size-[24px]" />
      </button>
    </div>
  );
}
