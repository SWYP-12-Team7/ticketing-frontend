"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Calendar } from "lucide-react";

interface FilterSectionProps {
  className?: string;
}

export function FilterSection({ className }: FilterSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        className
      )}
    >
      {/* 빠른 지도 탐색 */}
      <div className="rounded-xl border-[1.5px] border-[#FA7228] px-6.5 py-5.25">
        <h3 className="mb-2 text-sm font-bold">퀵 지도 탐색</h3>
        <p className="mb-1 text-xs text-muted-foreground">
          내 주변 핫 플레이스를
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          빠르게 지도에서 바로 확인하세요
        </p>
        <div className="flex flex-col gap-2">
          <button className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
            <span>전국</span>
            <ChevronDown className="size-4" />
          </button>
          <button className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
            <span>간단 필터</span>
            <ChevronDown className="size-4" />
          </button>
        </div>
        <button className="mt-3 w-full rounded-md bg-[#FA7228] py-2 text-sm font-medium text-white hover:bg-[#FA7228]/90">
          검색하기
        </button>
      </div>

      {/* 빠른 캘린더 탐색 */}
      <div className="rounded-xl border-[1.5px] border-[#FA7228] px-6.5 py-5.25">
        <h3 className="mb-2 text-sm font-bold">퀵 캘린더 탐색</h3>
        <p className="mb-1 text-xs text-muted-foreground">
          오늘 내일 혹은
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          다양한 원하는 날짜의 팝업을 검색
        </p>
        <div className="flex flex-col gap-2">
          <button className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
            <span>날짜 선택</span>
            <Calendar className="size-4" />
          </button>
          <button className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
            <span>간단 필터</span>
            <ChevronDown className="size-4" />
          </button>
        </div>
        <button className="mt-3 w-full rounded-md bg-[#FA7228] py-2 text-sm font-medium text-white hover:bg-[#FA7228]/90">
          검색하기
        </button>
      </div>
    </div>
  );
}
