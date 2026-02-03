/**
 * 캘린더 API 서비스
 *
 * - 월별 이벤트 요약 데이터 조회
 * - 더미 데이터 생성 (개발 환경)
 * - any 타입 완전 제거
 */

import axiosInstance from "@/services/axios";
import type {
  CalendarMonthSummaryParams,
  CalendarMonthSummaryResponse,
  CalendarDaySummary,
  IsoMonth,
} from "@/types/calendar";
import { toValidIsoDate } from "@/components/calendarview/utils/calendar.validation";

/**
 * 개발용 더미 데이터 생성 함수
 *
 * - any 타입 사용 없이 안전하게 IsoDate/IsoMonth 생성
 * - 검증된 타입만 반환
 *
 * @param month - IsoMonth 형식 문자열
 * @returns 더미 캘린더 데이터
 */
function generateDummyCalendarData(
  month: IsoMonth
): CalendarMonthSummaryResponse {
  const [year, monthNum] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();

  const days: CalendarDaySummary[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // 안전하게 IsoDate 생성 (any 없음)
    const isoDate = toValidIsoDate(year, monthNum, day);

    // 검증 실패 시 스킵
    if (!isoDate) continue;

    // 날짜별로 랜덤한 개수 생성 (더 현실적으로)
    const exhibitionCount = Math.floor(Math.random() * 20) + 5; // 5~24개
    const popupCount = Math.floor(Math.random() * 15) + 3; // 3~17개

    days.push({
      date: isoDate,
      counts: {
        exhibition: exhibitionCount,
        popup: popupCount,
      },
    });
  }

  return {
    month,
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

/**
 * 캘린더 월별 요약 데이터 조회
 *
 * - 환경변수에 따라 더미 데이터 또는 실제 API 호출
 * - 타입 안정성 보장
 *
 * @param params - 월, 지역, 카테고리 파라미터
 * @returns 월별 일자별 이벤트 개수 및 지역 목록
 *
 * @example
 * ```ts
 * const data = await getCalendarMonthSummary({
 *   month: '2025-02',
 *   regionId: 'haeundae',
 *   categories: ['exhibition', 'popup']
 * });
 * ```
 */
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

  // 실제 API 호출
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
