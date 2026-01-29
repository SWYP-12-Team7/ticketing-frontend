import axiosInstance from "@/services/axios";
import type {
  CalendarMonthSummaryParams,
  CalendarMonthSummaryResponse,
  CalendarDaySummary,
} from "@/types/calendar";

// 개발용 더미 데이터 생성 함수
function generateDummyCalendarData(
  month: string
): CalendarMonthSummaryResponse {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const days: CalendarDaySummary[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    // 날짜별로 랜덤한 개수 생성 (더 현실적으로)
    const exhibitionCount = Math.floor(Math.random() * 20) + 5; // 5~24개
    const popupCount = Math.floor(Math.random() * 15) + 3; // 3~17개

    days.push({
      date: date as any,
      counts: {
        exhibition: exhibitionCount,
        popup: popupCount,
      },
    });
  }

  return {
    month: month as any,
    days,
    regions: [
      { id: "all", label: "부산시 전체" },
      { id: "haeundae", label: "해운대구" },
      { id: "busanjin", label: "부산진구" },
      { id: "dongnae", label: "동래구" },
      { id: "suyeong", label: "수영구" },
      { id: "saha", label: "사하구" },
    ],
  };
}

export async function getCalendarMonthSummary(
  params: CalendarMonthSummaryParams
): Promise<CalendarMonthSummaryResponse> {
  const { month, regionId, categories } = params;

  // 개발 환경에서는 더미 데이터 사용 (백엔드 API 개발 전)
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    // API 호출을 시뮬레이션하기 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateDummyCalendarData(month);
  }

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
