import axiosInstance from "@/services/axios";
import type {
  CalendarMonthSummaryParams,
  CalendarMonthSummaryResponse,
} from "@/types/calendar";

export async function getCalendarMonthSummary(
  params: CalendarMonthSummaryParams
): Promise<CalendarMonthSummaryResponse> {
  const { month, regionId, categories } = params;

  const res = await axiosInstance.get<CalendarMonthSummaryResponse>(
    "/calendar/month-summary",
    {
      params: {
        month,
        regionId: regionId ?? undefined,
        categories: categories?.length ? categories.join(",") : undefined,
      },
    }
  );

  return res.data;
}
