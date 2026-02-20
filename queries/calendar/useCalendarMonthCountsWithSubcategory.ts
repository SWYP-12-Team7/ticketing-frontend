/**
 * 서브카테고리 필터 적용 시 월별 날짜별 카운트 조회
 *
 * - 월별 요약 API는 서브카테고리를 지원하지 않으므로,
 *   각 날짜별로 이벤트 목록 API를 호출해 필터링된 개수를 집계
 * - 탐색 결과와 동일한 필터(regionId, categories, subcategories) 사용
 */

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import type { CalendarCategory, IsoDate, IsoMonth } from "@/types/calendar";
import type { CalendarEventFilterParams } from "@/types/calendar";
import { getCalendarEventsByDate } from "@/services/api/calendar";
import { getIsoDatesInMonth } from "@/lib/calendar-date";
import { calendarKeys } from "./index";

interface UseCalendarMonthCountsWithSubcategoryParams {
  month: IsoMonth;
  apiFilterParams: CalendarEventFilterParams;
}

interface UseCalendarMonthCountsWithSubcategoryOptions {
  /** false면 쿼리 미실행 (서브카테고리 필터 없을 때 사용) */
  enabled?: boolean;
}

function buildCountsFromEvents(
  events: { category: string }[]
): Record<CalendarCategory, number> {
  let exhibition = 0;
  let popup = 0;
  for (const e of events) {
    if (e.category === "전시") exhibition += 1;
    else if (e.category === "팝업") popup += 1;
  }
  return { exhibition, popup };
}

/**
 * 서브카테고리 필터가 있을 때 해당 월의 날짜별 전시/팝업 개수를 반환
 *
 * @param params.month - YYYY-MM
 * @param params.apiFilterParams - regionId, categories, subcategories 포함
 */
export function useCalendarMonthCountsWithSubcategory(
  params: UseCalendarMonthCountsWithSubcategoryParams,
  options?: UseCalendarMonthCountsWithSubcategoryOptions
) {
  const { month, apiFilterParams } = params;
  const enabled = options?.enabled ?? true;

  const datesInMonth = useMemo(() => getIsoDatesInMonth(month), [month]);

  const filtersKey = useMemo(
    () =>
      JSON.stringify({
        regionId: apiFilterParams.regionId,
        categories: apiFilterParams.categories,
        subcategories: apiFilterParams.subcategories,
      }),
    [
      apiFilterParams.regionId,
      apiFilterParams.categories,
      apiFilterParams.subcategories,
    ]
  );

  const queries = useQueries({
    queries: datesInMonth.map((date) => ({
      queryKey: calendarKeys.events.byDate(date, filtersKey),
      queryFn: () =>
        getCalendarEventsByDate({
          date,
          regionId: apiFilterParams.regionId,
          categories: apiFilterParams.categories,
          subcategories: apiFilterParams.subcategories,
        }),
      staleTime: 2 * 60_000,
      enabled,
    })),
  });

  const countsByDate = useMemo(() => {
    const map = new Map<IsoDate, Record<CalendarCategory, number>>();
    datesInMonth.forEach((date, i) => {
      const res = queries[i]?.data;
      const counts = res
        ? buildCountsFromEvents(res.events)
        : { exhibition: 0, popup: 0 };
      map.set(date, counts);
    });
    return map;
  }, [datesInMonth, queries]);

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return { countsByDate, isLoading, isError };
}
