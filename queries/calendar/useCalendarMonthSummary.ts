import { useQuery } from "@tanstack/react-query";
import type { CalendarMonthSummaryParams } from "@/types/calendar";
import { getCalendarMonthSummary } from "@/services/api/calendar";

export function calendarMonthSummaryQueryKey(
  params: CalendarMonthSummaryParams
) {
  const categoriesKey = params.categories?.join(",") ?? "";
  return [
    "calendar",
    "month-summary",
    params.month,
    params.regionId ?? "",
    categoriesKey,
  ] as const;
}

export function useCalendarMonthSummary(params: CalendarMonthSummaryParams) {
  return useQuery({
    queryKey: calendarMonthSummaryQueryKey(params),
    queryFn: () => getCalendarMonthSummary(params),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}
