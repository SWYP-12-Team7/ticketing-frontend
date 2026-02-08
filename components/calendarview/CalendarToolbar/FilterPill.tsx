/**
 * 선택된 필터 Pill 컴포넌트 (그룹화 지원)
 *
 * Figma 스펙 완전 준수 (2026-02-04):
 * - 외부 chip: padding 0px 16px, gap 4px, height 32px, border 1px solid #F36012, border-radius 100px
 * - 레이블: 텍스트만 표시, font-size 14px, color #F36012
 * - 값 (내부 chips): padding 0px 8px, height 24px, background #FFFFFF, border-radius 100px, font-size 12px, 값 chip별 X 버튼
 * - X 버튼: 16px, color #F36012
 */

"use client";

import React, { memo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALENDAR_DESIGN_TOKENS as TOKENS } from "../constants/calendar.design-tokens";
import type { DisplayFilterValue } from "@/components/common/LocationEventFilter/utils";

interface FilterPillProps {
  /** 필터 레이블 (예: "지역", "팝업", "전체") */
  displayLabel: string;

  /** 필터 값 배열 (label + id, 값 chip별 X 버튼) */
  values: DisplayFilterValue[];

  /** 그룹 전체 제거 핸들러 */
  onRemove?: () => void;

  /** 그룹 X 버튼 표시 여부 (기본: true) */
  showRemoveButton?: boolean;

  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 필터 Pill 컴포넌트 (메모이제이션)
 * - 불필요한 리렌더링 방지
 * - 성능 최적화
 * - 그룹화 지원 (여러 값 렌더링)
 */
export const FilterPill = memo(function FilterPill({
  displayLabel,
  values,
  onRemove,
  showRemoveButton = true,
  className,
}: FilterPillProps) {
  const tokens = TOKENS.filterPill;

  return (
    <div
      className={cn(
        "calendar-filter-pill inline-flex items-center justify-center",
        className
      )}
      style={{
        boxSizing: "border-box",
        padding: tokens.container.padding,
        gap: tokens.container.gap,
        minWidth: tokens.container.minWidth,
        height: tokens.container.height,
        background: tokens.container.background,
        border: tokens.container.border,
        borderRadius: tokens.container.borderRadius,
        flexShrink: 0, // 줄어들지 않음
      }}
      role="listitem"
    >
      {/* 레이블 텍스트 (예: "지역", "팝업", "전체") */}
      <span
        className="calendar-filter-pill__label"
        style={{
          fontFamily: tokens.label.fontFamily,
          fontWeight: tokens.label.fontWeight,
          fontSize: tokens.label.fontSize,
          lineHeight: tokens.label.lineHeight,
          color: tokens.label.color,
          whiteSpace: "nowrap",
        }}
      >
        {displayLabel}
      </span>

      {/* 값 chips (여러 개 가능, Figma: padding 0 8px, height 24px, #FFFFFF) */}
      {values.map((value) => (
        <div
          key={value.id}
          className="calendar-filter-pill__value flex items-center justify-center"
          style={{
            padding: tokens.value.padding,
            minWidth: tokens.value.minWidth,
            height: tokens.value.height,
            background: tokens.value.background,
            borderRadius: tokens.value.borderRadius,
            fontFamily: tokens.value.fontFamily,
            fontWeight: tokens.value.fontWeight,
            fontSize: tokens.value.fontSize,
            lineHeight: tokens.value.lineHeight,
            color: tokens.value.color,
            whiteSpace: "nowrap",
          }}
        >
          {value.label}
        </div>
      ))}

      {/* 그룹 전체 X 버튼 */}
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "calendar-filter-pill__remove",
            "flex items-center justify-center shrink-0",
            "transition-opacity hover:opacity-70 active:opacity-50",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
          )}
          style={{
            width: tokens.removeButton.size,
            height: tokens.removeButton.size,
            color: tokens.removeButton.color,
          }}
          aria-label={`${displayLabel} ${values.map((v) => v.label).join(", ")} 필터 제거`}
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
