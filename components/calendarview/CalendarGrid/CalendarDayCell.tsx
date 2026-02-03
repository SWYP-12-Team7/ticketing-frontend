/**
 * 캘린더 그리드 개별 날짜 셀 컴포넌트
 *
 * Figma 스펙 완전 반영:
 * - 고정 크기: 166px × 113px
 * - CalendarEventPill 컴포넌트 사용 (개별 클릭 가능)
 * - 전월/익월: #F9FAFB 배경, 테두리 없음, 날짜/pill 없음
 * - "+N개 더보기" 표시
 * - 선택 상태 시각화
 * - 접근성 (ARIA 속성, role, tabIndex)
 */

import React from "react";
import { cn } from "@/lib/utils";
import { isSameMonth, toIsoDateLocal } from "@/lib/calendar-date";
import type { CalendarDayCellProps } from "../types";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import { CALENDAR_LAYOUT } from "../constants/calendar.layout";
import { CalendarEventPill } from "./CalendarEventPill";

/**
 * 캘린더 날짜 셀 컴포넌트
 *
 * React.memo로 최적화하여 불필요한 리렌더링 방지
 */
function CalendarDayCellComponent({
  day,
  visibleMonthDate,
  activeCategories,
  counts,
  selectedDate,
  selectedEvent,
  onDateClick,
  onPillClick,
}: CalendarDayCellProps) {
  const inMonth = isSameMonth(day, visibleMonthDate);
  const iso = toIsoDateLocal(day);
  const isSunday = day.getDay() === CALENDAR_LAYOUT.SUNDAY_INDEX;

  const isDateSelected = selectedDate === iso;
  const showExhibition =
    inMonth && activeCategories.exhibition && counts.exhibition > 0;
  const showPopup = inMonth && activeCategories.popup && counts.popup > 0;

  // Pill 선택 상태 확인
  const isExhibitionPillSelected =
    selectedEvent?.date === iso && selectedEvent?.category === "exhibition";
  const isPopupPillSelected =
    selectedEvent?.date === iso && selectedEvent?.category === "popup";

  // 표시할 pill 개수 계산
  const visiblePills = [
    showExhibition
      ? { category: "exhibition" as const, count: counts.exhibition }
      : null,
    showPopup ? { category: "popup" as const, count: counts.popup } : null,
  ].filter(
    (p): p is { category: "exhibition" | "popup"; count: number } => p !== null
  );

  const hasMorePills = visiblePills.length > CALENDAR_LAYOUT.MAX_VISIBLE_PILLS;
  const displayPills = visiblePills.slice(0, CALENDAR_LAYOUT.MAX_VISIBLE_PILLS);
  const hiddenCount = hasMorePills
    ? visiblePills.length - CALENDAR_LAYOUT.MAX_VISIBLE_PILLS
    : 0;

  // 전월/익월 날짜는 간단한 회색 박스만
  if (!inMonth) {
    return (
      <td className="calendar-day-cell__wrapper align-top">
        <div
          className="calendar-day-cell__content--out-of-month relative"
          style={{
            width: CALENDAR_DESIGN_TOKENS.sizing.cell.width,
            height: CALENDAR_DESIGN_TOKENS.sizing.cell.height,
            backgroundColor: CALENDAR_DESIGN_TOKENS.colors.cell.outOfMonth,
            borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.cell,
          }}
          aria-hidden="true"
        >
          {/* 날짜 번호 영역만 (빈 상태) */}
          <div
            className="absolute"
            style={{
              width: CALENDAR_DESIGN_TOKENS.sizing.dateNumber.width,
              height: CALENDAR_DESIGN_TOKENS.sizing.dateNumber.height,
              left: CALENDAR_DESIGN_TOKENS.spacing.cell.datePosition,
              top: CALENDAR_DESIGN_TOKENS.spacing.cell.datePosition,
              borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.dateNumber,
            }}
          />
        </div>
      </td>
    );
  }

  // 현재 월 날짜
  return (
    <td className="calendar-day-cell__wrapper align-top">
      <div
        className="calendar-day-cell__content relative cursor-pointer"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.cell.width,
          height: CALENDAR_DESIGN_TOKENS.sizing.cell.height,
          backgroundColor: isDateSelected
            ? CALENDAR_DESIGN_TOKENS.colors.cell.selected
            : CALENDAR_DESIGN_TOKENS.colors.cell.current,
          borderWidth: isDateSelected
            ? CALENDAR_DESIGN_TOKENS.borders.cellSelected
            : CALENDAR_DESIGN_TOKENS.borders.cellDefault,
          borderStyle: "solid",
          borderColor: isDateSelected
            ? CALENDAR_DESIGN_TOKENS.colors.border.selected
            : CALENDAR_DESIGN_TOKENS.colors.border.default,
          borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.cell,
        }}
        onClick={() => onDateClick?.(iso)}
        role="button"
        tabIndex={0}
        aria-label={`${day.getDate()}일${isDateSelected ? ", 선택됨" : ""}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onDateClick?.(iso);
          }
        }}
      >
        {/* 날짜 번호 */}
        <div
          className="calendar-day-cell__date-number absolute flex items-center justify-center"
          style={{
            width: CALENDAR_DESIGN_TOKENS.sizing.dateNumber.width,
            height: CALENDAR_DESIGN_TOKENS.sizing.dateNumber.height,
            left: CALENDAR_DESIGN_TOKENS.spacing.cell.datePosition,
            top: CALENDAR_DESIGN_TOKENS.spacing.cell.datePosition,
            borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.dateNumber,
            fontFamily: CALENDAR_DESIGN_TOKENS.fonts.dateNumber.family,
            fontSize: CALENDAR_DESIGN_TOKENS.fonts.dateNumber.size,
            fontWeight: CALENDAR_DESIGN_TOKENS.fonts.dateNumber.weight,
            lineHeight: CALENDAR_DESIGN_TOKENS.fonts.dateNumber.lineHeight,
            color: isSunday
              ? CALENDAR_DESIGN_TOKENS.colors.text.sunday
              : CALENDAR_DESIGN_TOKENS.colors.text.date,
          }}
        >
          {day.getDate()}
        </div>

        {/* 전시 Pill (1번째) */}
        {displayPills[0]?.category === "exhibition" && (
          <div
            className="absolute"
            style={{
              left: CALENDAR_DESIGN_TOKENS.spacing.cell.pillLeft,
              top: CALENDAR_DESIGN_TOKENS.spacing.cell.pillTop,
            }}
          >
            <CalendarEventPill
              category="exhibition"
              count={counts.exhibition}
              isSelected={isExhibitionPillSelected}
              onClick={(e) => {
                e.stopPropagation();
                onPillClick?.(iso, "exhibition");
              }}
            />
          </div>
        )}

        {/* 팝업 Pill (2번째 또는 1번째) */}
        {displayPills.find((p) => p?.category === "popup") && (
          <div
            className="absolute"
            style={{
              left: CALENDAR_DESIGN_TOKENS.spacing.cell.pillLeft,
              top:
                displayPills[0]?.category === "exhibition"
                  ? CALENDAR_DESIGN_TOKENS.spacing.cell.pillTopSecond
                  : CALENDAR_DESIGN_TOKENS.spacing.cell.pillTop,
            }}
          >
            <CalendarEventPill
              category="popup"
              count={counts.popup}
              isSelected={isPopupPillSelected}
              onClick={(e) => {
                e.stopPropagation();
                onPillClick?.(iso, "popup");
              }}
            />
          </div>
        )}

        {/* +N개 더보기 */}
        {hasMorePills && (
          <div
            className="absolute text-xs text-gray-500"
            style={{
              left: CALENDAR_DESIGN_TOKENS.spacing.cell.pillLeft,
              bottom: "8px",
              fontFamily: CALENDAR_DESIGN_TOKENS.fonts.pill.family,
            }}
          >
            +{hiddenCount}개 더보기
          </div>
        )}
      </div>
    </td>
  );
}

/**
 * React.memo로 최적화된 CalendarDayCell
 *
 * props가 변경되지 않으면 리렌더링 방지
 * 성능 향상 (특히 35개 셀 렌더링 시)
 */
export const CalendarDayCell = React.memo(CalendarDayCellComponent);
