"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { isSameMonth, toIsoDateLocal } from "@/lib/calendar-date";
import type { CalendarCategory, IsoDate } from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "./calendar.query-state";
import { CALENDAR_CATEGORY_META, WEEKDAY_LABELS } from "./calendar.constants";

type CalendarMonthTableProps = Readonly<{
  visibleMonthDate: Date;
  gridDays: readonly Date[];
  activeCategories: CalendarCategoryActiveMap;
  countsByDate: ReadonlyMap<IsoDate, Record<CalendarCategory, number>>;
  selectedDate?: IsoDate | null;
  onDateClick?: (date: IsoDate) => void;
}>;

export function CalendarMonthTable({
  visibleMonthDate,
  gridDays,
  activeCategories,
  countsByDate,
  selectedDate,
  onDateClick,
}: CalendarMonthTableProps) {
  return (
    <div className="calendarGrid__container mt-3 overflow-hidden rounded-2xl bg-[#FFF6EC] p-4">
      <table className="calendarGrid__table w-full table-fixed border-separate border-spacing-3">
        <thead className="calendarGrid__thead">
          <tr className="calendarGrid__weekdayRow">
            {WEEKDAY_LABELS.map((label, idx) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  "calendarGrid__weekday py-2 text-center text-sm font-semibold text-black/70",
                  idx === 0 && "text-red-500"
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="calendarGrid__tbody">
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <tr key={weekIndex} className="calendarGrid__weekRow">
              {gridDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => {
                const inMonth = isSameMonth(day, visibleMonthDate);
                const iso = toIsoDateLocal(day);
                const counts = countsByDate.get(iso) ?? {
                  exhibition: 0,
                  popup: 0,
                };

                const showExhibition =
                  activeCategories.exhibition && counts.exhibition > 0;
                const showPopup = activeCategories.popup && counts.popup > 0;

                const isSelected = selectedDate === iso;
                const isClickable = inMonth;

                return (
                  <td key={iso} className="calendarDayCell__td align-top">
                    <div
                      className={cn(
                        "calendarDayCell__card h-full min-h-24 rounded-xl bg-white p-3 transition-all",
                        // 기본 border
                        isSelected
                          ? "border-[3px] border-[#FFD8B7] bg-[#FFF6EC]"
                          : inMonth
                            ? "border-2 border-[#FFF0E2]"
                            : "border-2 border-[#FFF0E2]/60 opacity-60",
                        // 클릭 가능 스타일
                        isClickable &&
                          "cursor-pointer hover:border-[#FFD8B7] hover:shadow-sm"
                      )}
                      onClick={() => {
                        if (isClickable && onDateClick) {
                          onDateClick(iso);
                        }
                      }}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onKeyDown={(e) => {
                        if (
                          isClickable &&
                          onDateClick &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          onDateClick(iso);
                        }
                      }}
                      aria-label={
                        inMonth
                          ? `${day.getDate()}일${isSelected ? " (선택됨)" : ""}`
                          : "해당 월이 아닌 날짜"
                      }
                    >
                      <div className="calendarDayCell__dateRow flex items-start justify-between">
                        <span className="calendarDayCell__dateNumber text-sm font-semibold text-black/60">
                          {inMonth ? day.getDate() : ""}
                        </span>
                      </div>

                      <div className="calendarDayCell__countList mt-2 flex flex-col gap-2">
                        {/* 전시회 pill - 항상 렌더링, 조건부 표시 */}
                        <div
                          className={cn(
                            "calendarDayCell__countPill flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold",
                            !showExhibition && "opacity-0 pointer-events-none"
                          )}
                          style={{
                            background:
                              CALENDAR_CATEGORY_META.exhibition
                                .pillBackgroundColor,
                            borderLeft: `6px solid ${CALENDAR_CATEGORY_META.exhibition.accentBorderColor}`,
                          }}
                        >
                          {CALENDAR_CATEGORY_META.exhibition.label}{" "}
                          {counts.exhibition}개
                        </div>

                        {/* 팝업 pill - 항상 렌더링, 조건부 표시 */}
                        <div
                          className={cn(
                            "calendarDayCell__countPill flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold",
                            !showPopup && "opacity-0 pointer-events-none"
                          )}
                          style={{
                            background:
                              CALENDAR_CATEGORY_META.popup.pillBackgroundColor,
                            borderLeft: `6px solid ${CALENDAR_CATEGORY_META.popup.accentBorderColor}`,
                          }}
                        >
                          {CALENDAR_CATEGORY_META.popup.label} {counts.popup}개
                        </div>
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
