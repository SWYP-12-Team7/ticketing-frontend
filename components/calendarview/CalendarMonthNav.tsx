"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALENDAR_DESIGN_TOKENS } from "./constants/calendar.design-tokens";

type CalendarMonthNavProps = Readonly<{
  title: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}>;

/**
 * 캘린더 월 네비게이션
 *
 * Figma 스펙 (Frame 1707488909):
 * - width: 1280px, height: 31px
 * - justify-content: space-between
 * - padding: 0px, gap: 10px
 * - 화살표: 24px × 24px, border: 1.5px solid #000000
 * - 제목: width 784px, Pretendard Variable 24px
 */
export function CalendarMonthNav({
  title,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthNavProps) {
  return (
    <nav
      aria-label="월 이동"
      className="calendar-month-nav flex items-center justify-between"
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.monthNav.width,
        height: CALENDAR_DESIGN_TOKENS.sizing.monthNav.height,
        padding: "0px",
        gap: "10px",
      }}
    >
      {/* 왼쪽 화살표 (checkbox-item/icon/arrow-left) */}
      <button
        type="button"
        onClick={onPrevMonth}
        className={cn(
          "calendar-month-nav__arrow flex items-center justify-center shrink-0",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        )}
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.monthNav.arrowSize,
          height: CALENDAR_DESIGN_TOKENS.sizing.monthNav.arrowSize,
        }}
        aria-label="이전 달"
      >
        <ChevronLeft
          style={{
            width: "100%",
            height: "100%",
            strokeWidth: CALENDAR_DESIGN_TOKENS.borders.arrow,
            color: CALENDAR_DESIGN_TOKENS.colors.monthNav.arrow,
          }}
          aria-hidden="true"
        />
      </button>

      {/* 월 제목 (January 2026) */}
      <h2
        className="calendar-month-nav__title text-center shrink-0"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.monthNav.titleWidth,
          height: CALENDAR_DESIGN_TOKENS.sizing.monthNav.height,
          fontFamily: CALENDAR_DESIGN_TOKENS.fonts.monthTitle.family,
          fontSize: CALENDAR_DESIGN_TOKENS.fonts.monthTitle.size,
          fontWeight: CALENDAR_DESIGN_TOKENS.fonts.monthTitle.weight,
          lineHeight: CALENDAR_DESIGN_TOKENS.fonts.monthTitle.lineHeight,
          letterSpacing: CALENDAR_DESIGN_TOKENS.fonts.monthTitle.letterSpacing,
          color: CALENDAR_DESIGN_TOKENS.colors.monthNav.title,
        }}
      >
        {title}
      </h2>

      {/* 오른쪽 화살표 (checkbox-item/icon/arrow-right) */}
      <button
        type="button"
        onClick={onNextMonth}
        className={cn(
          "calendar-month-nav__arrow flex items-center justify-center shrink-0",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        )}
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.monthNav.arrowSize,
          height: CALENDAR_DESIGN_TOKENS.sizing.monthNav.arrowSize,
        }}
        aria-label="다음 달"
      >
        <ChevronRight
          style={{
            width: "100%",
            height: "100%",
            strokeWidth: CALENDAR_DESIGN_TOKENS.borders.arrow,
            color: CALENDAR_DESIGN_TOKENS.colors.monthNav.arrow,
          }}
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}
