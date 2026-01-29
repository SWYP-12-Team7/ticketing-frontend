"use client";

import * as React from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { CalendarRegion } from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "./calendar.query-state";

type CalendarToolbarProps = Readonly<{
  regions: readonly CalendarRegion[];
  regionId: string;
  activeCategories: CalendarCategoryActiveMap;
  onToggleCategory: (key: keyof CalendarCategoryActiveMap) => void;
  onChangeRegionId: (regionId: string) => void;
  onReset: () => void;
}>;

export function CalendarToolbar({
  regions,
  regionId,
  activeCategories,
  onToggleCategory,
  onChangeRegionId,
  onReset,
}: CalendarToolbarProps) {
  return (
    <header className="calendarToolbar__container flex w-full items-center gap-3 rounded-xl border border-black/20 bg-white px-4 py-3">
      <div className="calendarToolbar__leading flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="calendarToolbar__iconButton inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="필터 옵션"
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>

        <label className="calendarToolbar__categoryToggle inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FFF0E2] px-3 py-2 text-sm font-semibold">
          <input
            type="checkbox"
            className="calendarToolbar__checkbox h-4 w-4"
            checked={activeCategories.popup}
            onChange={() => onToggleCategory("popup")}
          />
          <span className="calendarToolbar__categoryLabel">팝업</span>
        </label>

        <label className="calendarToolbar__categoryToggle inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FFF0E2] px-3 py-2 text-sm font-semibold">
          <input
            type="checkbox"
            className="calendarToolbar__checkbox h-4 w-4"
            checked={activeCategories.exhibition}
            onChange={() => onToggleCategory("exhibition")}
          />
          <span className="calendarToolbar__categoryLabel">전시</span>
        </label>

        <div className="calendarToolbar__regionSelect inline-flex min-w-0 items-center gap-2 rounded-full bg-[#FFF0E2] px-3 py-2 text-sm font-semibold">
          <span className="calendarToolbar__regionLabel shrink-0 text-[#FF7A00]">
            지역
          </span>
          <select
            className="calendarToolbar__regionSelectControl min-w-0 bg-transparent text-sm font-semibold outline-none"
            value={regionId}
            onChange={(e) => onChangeRegionId(e.target.value)}
            aria-label="지역 선택"
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="calendarToolbar__spacer flex-1" />

      <button
        type="button"
        onClick={onReset}
        className="calendarToolbar__resetButton inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        aria-label="필터 초기화"
      >
        <RotateCcw className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  );
}
