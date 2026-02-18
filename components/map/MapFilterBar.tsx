"use client";

import { RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/components/search/FilterSidebar";

const POPUP_CATEGORIES = [
  "패션", "뷰티", "F&B", "캐릭터",
  "테크", "라이프스타일", "가구/인테리어",
];
const EXHIBITION_CATEGORIES = [
  "현대미술", "사진", "디자인", "일러스트",
  "회화", "조각", "설치미술",
];

interface MapFilterBarProps {
  filters: FilterState;
  onChipClick: (section: string) => void;
  onReset: () => void;
}

export function MapFilterBar({
  filters,
  onChipClick,
  onReset,
}: MapFilterBarProps) {
  const hasRegion = filters.regions.length > 0;
  const hasPopup =
    filters.type === "POPUP" ||
    filters.categories.some((c) =>
      POPUP_CATEGORIES.includes(c)
    );
  const hasExhibition =
    filters.type === "EXHIBITION" ||
    filters.categories.some((c) =>
      EXHIBITION_CATEGORIES.includes(c)
    );
  const hasCategory = hasPopup || hasExhibition;
  const hasAnyFilter =
    hasRegion ||
    hasCategory ||
    !!filters.startDate ||
    !!filters.endDate;

  const regionLabel =
    filters.regions.length === 1
      ? filters.regions[0]
      : filters.regions.length > 1
        ? `지역 ${filters.regions.length}`
        : "지역";

  return (
    <div
      className={cn(
        "absolute top-4 left-4 right-4 z-10",
        "flex items-center gap-2",
        "overflow-x-auto scrollbar-hide"
      )}
    >
      {/* 초기화 */}
      <button
        type="button"
        onClick={onReset}
        disabled={!hasAnyFilter}
        className={cn(
          "flex shrink-0 items-center gap-1",
          "rounded-full border px-3 py-1.5",
          "text-sm font-medium shadow-sm transition-colors",
          hasAnyFilter
            ? "border-orange bg-white text-orange"
            : "border-border bg-white/90 text-muted-foreground"
        )}
      >
        <RotateCcw className="size-3.5" />
        초기화
      </button>

      {/* 카테고리 */}
      <button
        type="button"
        onClick={() => onChipClick("category")}
        className={cn(
          "flex shrink-0 items-center gap-1",
          "rounded-full border px-3 py-1.5",
          "text-sm font-medium shadow-sm transition-colors",
          hasCategory
            ? "border-orange bg-orange text-white"
            : "border-border bg-white/90 text-foreground"
        )}
      >
        카테고리
        <ChevronDown className="size-3.5" />
      </button>

      {/* 지역 */}
      <button
        type="button"
        onClick={() => onChipClick("region")}
        className={cn(
          "flex shrink-0 items-center gap-1",
          "rounded-full border px-3 py-1.5",
          "text-sm font-medium shadow-sm transition-colors",
          hasRegion
            ? "border-orange bg-orange text-white"
            : "border-border bg-white/90 text-foreground"
        )}
      >
        {regionLabel}
        <ChevronDown className="size-3.5" />
      </button>

      {/* 팝업스토어 */}
      <button
        type="button"
        onClick={() => onChipClick("popup")}
        className={cn(
          "flex shrink-0 items-center gap-1",
          "rounded-full border px-3 py-1.5",
          "text-sm font-medium shadow-sm transition-colors",
          hasPopup
            ? "border-orange bg-orange text-white"
            : "border-border bg-white/90 text-foreground"
        )}
      >
        팝업스토어
        <ChevronDown className="size-3.5" />
      </button>

      {/* 전시 */}
      <button
        type="button"
        onClick={() => onChipClick("exhibition")}
        className={cn(
          "flex shrink-0 items-center gap-1",
          "rounded-full border px-3 py-1.5",
          "text-sm font-medium shadow-sm transition-colors",
          hasExhibition
            ? "border-orange bg-orange text-white"
            : "border-border bg-white/90 text-foreground"
        )}
      >
        전시
        <ChevronDown className="size-3.5" />
      </button>
    </div>
  );
}
