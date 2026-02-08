/**
 * 캘린더 그리드 주(Week) 행 컴포넌트
 *
 * - 7개의 날짜 셀을 포함하는 행
 * - CalendarDayCell을 렌더링
 */

import React from "react";
import { toIsoDateLocal } from "@/lib/calendar-date";
import type { CalendarWeekRowProps } from "../types";
import { CalendarDayCell } from "./CalendarDayCell";

/**
 * 캘린더 주 행 컴포넌트
 */
function CalendarWeekRowComponent({
  weekDays,
  visibleMonthDate,
  activeCategories,
  countsByDate,
  selectedDate,
  selectedPillCategories,
  onDateClick,
  onPillClick,
}: CalendarWeekRowProps) {
  return (
    <tr className="calendar-week-row">
      {weekDays.map((day) => {
        const iso = toIsoDateLocal(day);
        const counts = countsByDate.get(iso) ?? {
          exhibition: 0,
          popup: 0,
        };

        return (
          <CalendarDayCell
            key={iso}
            day={day}
            visibleMonthDate={visibleMonthDate}
            activeCategories={activeCategories}
            counts={counts}
            selectedDate={selectedDate}
            selectedPillCategories={selectedPillCategories}
            onDateClick={onDateClick}
            onPillClick={onPillClick}
          />
        );
      })}
    </tr>
  );
}

/**
 * React.memo로 최적화된 CalendarWeekRow
 */
export const CalendarWeekRow = React.memo(CalendarWeekRowComponent);
