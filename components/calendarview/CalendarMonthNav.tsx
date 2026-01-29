"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarMonthNavProps = Readonly<{
  title: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}>;

export function CalendarMonthNav({
  title,
  onPrevMonth,
  onNextMonth,
}: CalendarMonthNavProps) {
  return (
    <nav
      aria-label="월 이동"
      className="calendarMonthNav__container mt-4 flex items-center justify-between px-2"
    >
      <button
        type="button"
        onClick={onPrevMonth}
        className="calendarMonthNav__arrowButton inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        aria-label="이전 달"
      >
        <ChevronLeft className="h-7 w-7" aria-hidden="true" />
      </button>

      <h2 className="calendarMonthNav__title text-base font-semibold text-black/80">
        {title}
      </h2>

      <button
        type="button"
        onClick={onNextMonth}
        className="calendarMonthNav__arrowButton inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        aria-label="다음 달"
      >
        <ChevronRight className="h-7 w-7" aria-hidden="true" />
      </button>
    </nav>
  );
}
