/**
 * 캘린더 그리드 컴포넌트
 *
 * Figma 스펙 완전 반영:
 * - 외곽 박스: 1278px × 661px, border-radius: 12px
 * - 요일 헤더: 절대 위치 (Frame 8~14)
 * - 내부 그리드: 1252px × 593px (Group 1430105621)
 * - 셀 간격: 15px (수평) × 7px (수직)
 * - 5행 × 7열 그리드
 */

import React from "react";
import type { CalendarGridProps } from "../types";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import { CALENDAR_LAYOUT, WEEKDAY_LABELS } from "../constants/calendar.layout";
import { CalendarWeekRow } from "./CalendarWeekRow";

/**
 * 캘린더 그리드 컴포넌트
 */
export function CalendarGrid({
  visibleMonthDate,
  gridDays,
  activeCategories,
  countsByDate,
  selectedDate,
  selectedEvent,
  onDateClick,
  onPillClick,
}: CalendarGridProps) {
  // Figma 스펙: 각 요일 헤더의 절대 위치
  const weekdayPositions = [
    { label: "SUN", left: "70px", width: "54px" },
    { label: "MON", left: "249px", width: "59px" },
    { label: "TUE", left: "432px", width: "53px" },
    { label: "WED", left: "610px", width: "58px" },
    { label: "THUR", left: "786px", width: "65px" },
    { label: "FRI", left: "976px", width: "45px" },
    { label: "SAT", left: "1157px", width: "51px" },
  ];

  return (
    <div
      className="calendar-grid-box relative"
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.gridBox.width,
        height: CALENDAR_DESIGN_TOKENS.sizing.gridBox.height,
        borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.gridBox,
      }}
    >
      {/* 요일 헤더 (절대 위치 - Figma Frame 8~14) */}
      {weekdayPositions.map((weekday, idx) => (
        <div
          key={weekday.label}
          className="calendar-grid__weekday absolute flex items-center justify-center"
          style={{
            left: weekday.left,
            top: "13px",
            width: weekday.width,
            height: CALENDAR_DESIGN_TOKENS.sizing.weekdayHeader.height,
            padding: "8px 10px",
            gap: "10px",
            borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.weekdayHeader,
            fontFamily: CALENDAR_DESIGN_TOKENS.fonts.weekdayHeader.family,
            fontSize: CALENDAR_DESIGN_TOKENS.fonts.weekdayHeader.size,
            fontWeight: CALENDAR_DESIGN_TOKENS.fonts.weekdayHeader.weight,
            lineHeight: CALENDAR_DESIGN_TOKENS.fonts.weekdayHeader.lineHeight,
            color:
              idx === CALENDAR_LAYOUT.SUNDAY_INDEX
                ? CALENDAR_DESIGN_TOKENS.colors.weekday.sunday
                : CALENDAR_DESIGN_TOKENS.colors.weekday.default,
          }}
        >
          {weekday.label}
        </div>
      ))}

      {/* 날짜 그리드 (Group 1430105621) */}
      <div
        className="calendar-grid__inner absolute"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.gridInner.width,
          height: CALENDAR_DESIGN_TOKENS.sizing.gridInner.height,
          left: CALENDAR_DESIGN_TOKENS.sizing.gridInner.left,
          top: CALENDAR_DESIGN_TOKENS.sizing.gridInner.top,
        }}
      >
        <table
          className="calendar-grid__table w-full table-fixed border-separate"
          style={{
            borderSpacing: `${CALENDAR_DESIGN_TOKENS.spacing.grid.cellGapX} ${CALENDAR_DESIGN_TOKENS.spacing.grid.cellGapY}`,
          }}
        >
          <tbody className="calendar-grid__tbody">
            {Array.from({ length: CALENDAR_LAYOUT.WEEKS_PER_MONTH }).map(
              (_, weekIndex) => {
                const startIdx = weekIndex * CALENDAR_LAYOUT.DAYS_PER_WEEK;
                const endIdx = startIdx + CALENDAR_LAYOUT.DAYS_PER_WEEK;
                const weekDays = gridDays.slice(startIdx, endIdx);

                return (
                  <CalendarWeekRow
                    key={weekIndex}
                    weekDays={weekDays}
                    visibleMonthDate={visibleMonthDate}
                    activeCategories={activeCategories}
                    countsByDate={countsByDate}
                    selectedDate={selectedDate}
                    selectedEvent={selectedEvent}
                    onDateClick={onDateClick}
                    onPillClick={onPillClick}
                  />
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
