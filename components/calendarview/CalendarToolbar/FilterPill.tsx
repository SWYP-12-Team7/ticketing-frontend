/**
 * 선택된 필터 Pill 컴포넌트
 *
 * Figma 스펙 완전 준수:
 * - 레이블 + 값 2개 영역 구조
 * - Container: #FFF4EC 배경, 32px 높이, 24px border-radius
 * - 레이블: #F36012 텍스트, #FFF4EC 배경
 * - 값: #202937 텍스트, #FFFFFF 배경
 * - X 버튼: 16px, hover 효과
 *
 * @example
 * ```tsx
 * <FilterPill
 *   displayLabel="지역"
 *   value="부산"
 *   onRemove={() => console.log('removed')}
 * />
 * ```
 */

"use client";

import React, { memo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALENDAR_DESIGN_TOKENS as TOKENS } from "../constants/calendar.design-tokens";

interface FilterPillProps {
  /** 필터 레이블 (예: "지역", "팝업") */
  displayLabel: string;

  /** 필터 값 (예: "부산", "뷰티") */
  value: string;

  /** 제거 핸들러 */
  onRemove?: () => void;

  /** X 버튼 표시 여부 (기본: true) */
  showRemoveButton?: boolean;

  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 필터 Pill 컴포넌트 (메모이제이션)
 * - 불필요한 리렌더링 방지
 * - 성능 최적화
 */
export const FilterPill = memo(function FilterPill({
  displayLabel,
  value,
  onRemove,
  showRemoveButton = true,
  className,
}: FilterPillProps) {
  const tokens = TOKENS.filterPill;

  return (
    <div
      className={cn("calendar-filter-pill inline-flex items-center", className)}
      style={{
        padding: tokens.container.padding,
        gap: tokens.container.gap,
        height: tokens.container.height,
        background: tokens.container.background,
        borderRadius: tokens.container.borderRadius,
      }}
      role="listitem"
    >
      {/* 레이블 영역 (예: "지역") */}
      <div
        className="calendar-filter-pill__label flex items-center justify-center"
        style={{
          padding: tokens.label.padding,
          minWidth: tokens.label.minWidth,
          height: tokens.label.height,
          background: tokens.label.background,
          borderRadius: tokens.label.borderRadius,
          fontFamily: tokens.fonts.family,
          fontWeight: tokens.fonts.weight,
          fontSize: tokens.fonts.size,
          lineHeight: tokens.fonts.lineHeight,
          color: tokens.label.color,
        }}
      >
        {displayLabel}
      </div>

      {/* 값 영역 (예: "부산") */}
      <div
        className="calendar-filter-pill__value flex items-center justify-center"
        style={{
          padding: tokens.value.padding,
          minWidth: tokens.value.minWidth,
          height: tokens.value.height,
          background: tokens.value.background,
          borderRadius: tokens.value.borderRadius,
          fontFamily: tokens.fonts.family,
          fontWeight: tokens.fonts.weight,
          fontSize: tokens.fonts.size,
          lineHeight: tokens.fonts.lineHeight,
          color: tokens.value.color,
        }}
      >
        {value}
      </div>

      {/* X 버튼 */}
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "calendar-filter-pill__remove",
            "flex items-center justify-center",
            "transition-opacity hover:opacity-70 active:opacity-50",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          )}
          style={{
            width: tokens.removeButton.size,
            height: tokens.removeButton.size,
            color: tokens.removeButton.color,
          }}
          aria-label={`${displayLabel} ${value} 필터 제거`}
        >
          <X
            style={{
              width: tokens.removeButton.size,
              height: tokens.removeButton.size,
              strokeWidth: 2,
            }}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
});
