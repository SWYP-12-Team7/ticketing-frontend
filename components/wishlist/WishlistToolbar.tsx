"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WISHLIST_SORT_OPTIONS,
  WISHLIST_REGION_FILTERS,
  WISHLIST_ARIA_LABELS,
} from "./wishlist.constants";
import type {
  WishlistSortOption,
  WishlistRegionFilter,
} from "@/types/wishlist";

interface WishlistToolbarProps {
  /** 현재 정렬 옵션 */
  sortOption: WishlistSortOption;
  /** 선택된 지역 필터 */
  selectedRegions: Set<WishlistRegionFilter>;
  /** 정렬 옵션 변경 핸들러 */
  onSortChange: (option: WishlistSortOption) => void;
  /** 지역 필터 토글 핸들러 */
  onRegionToggle: (region: WishlistRegionFilter) => void;
  /** 필터 초기화 핸들러 */
  onClearFilters: () => void;
}

/**
 * 찜 목록 툴바 컴포넌트
 * - 정렬 옵션 선택
 * - 지역 필터 (다중 선택)
 * - 필터 초기화
 *
 * 성능 최적화:
 * - memo를 사용하여 불필요한 리렌더링 방지
 * - 이벤트 핸들러는 부모에서 useCallback으로 메모이제이션
 */
export const WishlistToolbar = memo(function WishlistToolbar({
  sortOption,
  selectedRegions,
  onSortChange,
  onRegionToggle,
  onClearFilters,
}: WishlistToolbarProps) {
  const hasActiveFilters = selectedRegions.size > 0;

  return (
    <section
      className="wishlistToolbar mb-8 space-y-4"
      aria-label="정렬 및 필터 도구"
    >
      {/* 정렬 옵션 & 필터 초기화 */}
      <div className="wishlistToolbar__sortRow flex flex-wrap items-center justify-between gap-3">
        {/* 정렬 버튼 그룹 */}
        <div
          className="wishlistToolbar__sortOptions flex flex-wrap items-center gap-2"
          role="group"
          aria-label="정렬 옵션"
        >
          {WISHLIST_SORT_OPTIONS.map((option) => {
            const isSelected = sortOption === option.value;
            return (
              <Button
                key={option.value}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "wishlistToolbar__sortButton",
                  isSelected && "pointer-events-none"
                )}
                aria-pressed={isSelected}
                aria-label={WISHLIST_ARIA_LABELS.SORT_BUTTON(option.label)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="wishlistToolbar__clearButton text-caption-medium-bold text-primary hover:text-primary/80"
            aria-label={WISHLIST_ARIA_LABELS.CLEAR_FILTERS}
          >
            필터 초기화
          </Button>
        )}
      </div>

      {/* 지역 필터 */}
      <div
        className="wishlistToolbar__regionFilters flex flex-wrap items-center gap-2"
        role="group"
        aria-label="지역 필터"
      >
        {WISHLIST_REGION_FILTERS.map((region) => {
          const isSelected = selectedRegions.has(region.value);
          return (
            <button
              key={region.value}
              type="button"
              onClick={() => onRegionToggle(region.value)}
              className={cn(
                "wishlistToolbar__regionButton group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption-medium transition-all",
                isSelected
                  ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
              aria-pressed={isSelected}
              aria-label={WISHLIST_ARIA_LABELS.REGION_FILTER_BUTTON(
                region.label,
                isSelected
              )}
            >
              <span className="wishlistToolbar__regionLabel">
                {region.label}
              </span>
              {isSelected && (
                <X
                  className="wishlistToolbar__regionRemoveIcon size-3 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
});
