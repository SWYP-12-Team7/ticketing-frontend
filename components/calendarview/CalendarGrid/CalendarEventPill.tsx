/**
 * 클릭 가능한 캘린더 이벤트 Pill 컴포넌트
 *
 * Figma 스펙:
 * - 전시/팝업 카테고리 표시
 * - 개별 클릭 가능 (버튼)
 * - 선택 상태 시각화 (동그라미 채우기)
 * - width: 150px, height: 30px
 * - padding: 6px 10px, gap: 6px
 * - border-radius: 7px
 *
 * @remarks
 * B안 구현: 각 pill을 개별적으로 클릭 가능 (전시만/팝업만 선택)
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { CalendarCategory } from "@/types/calendar";
import { CALENDAR_CATEGORY_META } from "../constants/calendar.constants";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

interface CalendarEventPillProps {
  /** 카테고리 (전시/팝업) */
  category: CalendarCategory;
  /** 이벤트 개수 */
  count: number;
  /** 선택 상태 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: (e: React.MouseEvent) => void;
}

/**
 * 캘린더 이벤트 Pill 버튼
 *
 * @example
 * ```tsx
 * <CalendarEventPill
 *   category="exhibition"
 *   count={60}
 *   isSelected={true}
 *   onClick={handlePillClick}
 * />
 * ```
 */
export function CalendarEventPill({
  category,
  count,
  isSelected,
  onClick,
}: CalendarEventPillProps) {
  const meta = CALENDAR_CATEGORY_META[category];
  const pillColors = CALENDAR_DESIGN_TOKENS.colors.pill[category];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "calendar-event-pill",
        "flex items-center",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        isSelected && "focus-visible:ring-offset-2"
      )}
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.pill.width,
        height: CALENDAR_DESIGN_TOKENS.sizing.pill.height,
        padding: CALENDAR_DESIGN_TOKENS.spacing.pill.padding,
        gap: CALENDAR_DESIGN_TOKENS.spacing.pill.gap,
        borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.pill,
      }}
      aria-label={`${meta.label} ${count}개${isSelected ? ", 선택됨" : ""}`}
      aria-pressed={isSelected}
    >
      {/* 동그라미 아이콘 */}
      <span
        className="calendar-event-pill__icon shrink-0 rounded-full"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.pill.iconSize,
          height: CALENDAR_DESIGN_TOKENS.sizing.pill.iconSize,
          backgroundColor: isSelected ? pillColors.background : "transparent",
          borderColor: pillColors.border,
          borderWidth: isSelected
            ? "0px"
            : CALENDAR_DESIGN_TOKENS.borders.pillDefault,
          borderStyle: "solid",
        }}
        aria-hidden="true"
      />

      {/* 카테고리 레이블 */}
      <span
        className="calendar-event-pill__label shrink-0"
        style={{
          fontFamily: CALENDAR_DESIGN_TOKENS.fonts.pill.family,
          fontSize: CALENDAR_DESIGN_TOKENS.fonts.pill.size,
          fontWeight: CALENDAR_DESIGN_TOKENS.fonts.pill.weight,
          lineHeight: CALENDAR_DESIGN_TOKENS.fonts.pill.lineHeight,
          letterSpacing: CALENDAR_DESIGN_TOKENS.fonts.pill.letterSpacing,
          color: pillColors.text,
        }}
      >
        {meta.label}
      </span>

      {/* 개수 (flex-grow로 오른쪽 정렬) */}
      <span className="calendar-event-pill__spacer flex-1" />

      <span
        className="calendar-event-pill__count shrink-0"
        style={{
          fontFamily: CALENDAR_DESIGN_TOKENS.fonts.pill.family,
          fontSize: CALENDAR_DESIGN_TOKENS.fonts.pill.size,
          fontWeight: CALENDAR_DESIGN_TOKENS.fonts.pill.weight,
          lineHeight: CALENDAR_DESIGN_TOKENS.fonts.pill.lineHeight,
          letterSpacing: CALENDAR_DESIGN_TOKENS.fonts.pill.letterSpacing,
          color: pillColors.textCount,
        }}
      >
        {count}
      </span>
    </button>
  );
}
