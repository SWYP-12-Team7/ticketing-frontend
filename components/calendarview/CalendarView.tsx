"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  addMonths,
  buildMonthGrid,
  formatMonthTitle,
  toIsoMonth,
} from "@/lib/calendar-date";
import type {
  CalendarCategory,
  CalendarRegion,
  IsoDate,
} from "@/types/calendar";
import { useCalendarMonthSummary } from "@/queries/calendar/useCalendarMonthSummary";
import {
  getSelectedCategories,
  parseCategoriesParam,
  parseMonthParam,
  parseRegionIdParam,
  serializeCategoriesParam,
  type CalendarCategoryActiveMap,
} from "./calendar.query-state";
import { CalendarMonthNav } from "./CalendarMonthNav";
import { CalendarMonthTable } from "./CalendarMonthTable";
import { CalendarToolbar } from "./CalendarToolbar";
import { HotEventSection } from "./HotEventSection";

const FALLBACK_REGIONS: readonly CalendarRegion[] = [
  { id: "all", label: "부산시 전체" },
];

function buildCountsByDate(
  days: readonly { date: IsoDate; counts: Record<CalendarCategory, number> }[]
): Map<IsoDate, Record<CalendarCategory, number>> {
  const map = new Map<IsoDate, Record<CalendarCategory, number>>();
  for (const d of days) map.set(d.date, d.counts);
  return map;
}

function getMonthDateFromIsoMonth(month: string): Date {
  const [y, m] = month.split("-").map((v) => Number(v));
  return new Date(y, m - 1, 1);
}

interface CalendarViewProps {
  selectedDate?: IsoDate | null;
  onDateClick?: (date: IsoDate) => void;
}

export function CalendarView({ selectedDate, onDateClick }: CalendarViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const month = parseMonthParam(searchParams.get("month"));
  const regionId = parseRegionIdParam(searchParams.get("regionId"));
  const activeCategories = React.useMemo<CalendarCategoryActiveMap>(
    () => parseCategoriesParam(searchParams.get("categories")),
    [searchParams]
  );

  const visibleMonthDate = React.useMemo(
    () => getMonthDateFromIsoMonth(month),
    [month]
  );
  const monthTitle = React.useMemo(
    () => formatMonthTitle(visibleMonthDate),
    [visibleMonthDate]
  );
  const gridDays = React.useMemo(
    () => buildMonthGrid(visibleMonthDate),
    [visibleMonthDate]
  );

  const selectedCategories = React.useMemo(
    () => getSelectedCategories(activeCategories),
    [activeCategories]
  );

  const { data, isLoading, isError } = useCalendarMonthSummary({
    month,
    regionId: regionId === "all" ? null : regionId,
    categories: selectedCategories,
  });

  const regions = (
    data?.regions?.length ? data.regions : FALLBACK_REGIONS
  ) as readonly CalendarRegion[];
  const countsByDate = React.useMemo(
    () =>
      buildCountsByDate(
        (data?.days ?? []) as readonly {
          date: IsoDate;
          counts: Record<CalendarCategory, number>;
        }[]
      ),
    [data]
  );

  const updateQuery = React.useCallback(
    (
      next: Partial<{
        month: string;
        regionId: string;
        categories: string | null;
      }>
    ) => {
      const sp = new URLSearchParams(searchParams.toString());

      if (next.month) sp.set("month", next.month);
      if (typeof next.regionId === "string") sp.set("regionId", next.regionId);

      if (next.categories === null) sp.delete("categories");
      else if (typeof next.categories === "string")
        sp.set("categories", next.categories);

      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const onPrevMonth = () =>
    updateQuery({ month: toIsoMonth(addMonths(visibleMonthDate, -1)) });
  const onNextMonth = () =>
    updateQuery({ month: toIsoMonth(addMonths(visibleMonthDate, 1)) });

  const onToggleCategory = (key: keyof CalendarCategoryActiveMap) => {
    const next: CalendarCategoryActiveMap = {
      ...activeCategories,
      [key]: !activeCategories[key],
    };
    updateQuery({ categories: serializeCategoriesParam(next) });
  };

  const onChangeRegionId = (nextRegionId: string) =>
    updateQuery({ regionId: nextRegionId });

  const onReset = () => {
    updateQuery({
      month: toIsoMonth(new Date()),
      regionId: "all",
      categories: serializeCategoriesParam({ exhibition: true, popup: true }),
    });
  };

  return (
    <section aria-label="캘린더 뷰" className="calendarViewPage__section">
      <div className="calendarViewPage__container rounded-xl bg-[#FFFBF4] p-4">
        <CalendarToolbar
          regions={regions}
          regionId={regionId}
          activeCategories={activeCategories}
          onToggleCategory={onToggleCategory}
          onChangeRegionId={onChangeRegionId}
          onReset={onReset}
        />

        <CalendarMonthNav
          title={monthTitle}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />

        {(isError || isLoading) && (
          <div className="calendarViewPage__statusArea mt-3 rounded-lg bg-white p-3 text-sm">
            {isLoading && (
              <p className="calendarViewPage__statusText">
                캘린더 데이터를 불러오는 중…
              </p>
            )}
            {isError && (
              <p className="calendarViewPage__statusText">
                데이터를 불러오지 못했습니다. 백엔드 연결/API 경로를
                확인해주세요.
              </p>
            )}
          </div>
        )}

        <CalendarMonthTable
          visibleMonthDate={visibleMonthDate}
          gridDays={gridDays}
          activeCategories={activeCategories}
          countsByDate={countsByDate}
          selectedDate={selectedDate}
          onDateClick={onDateClick}
        />
      </div>

      {/* HOT EVENT 섹션 - activeCategories 전달 */}
      <HotEventSection
        className="mt-10"
        selectedDate={selectedDate}
        activeCategories={activeCategories}
      />
    </section>
  );
}
