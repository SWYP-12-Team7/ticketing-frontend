/**
 * 캘린더 API 서비스
 *
 * - 월별 이벤트 요약 데이터 조회
 * - 날짜별 이벤트 목록 조회
 * - 인기 이벤트 목록 조회
 * - 더미 데이터 생성 (개발 환경)
 * - any 타입 완전 제거
 */

import axiosInstance from "@/services/axios";
import type {
  CalendarMonthSummaryParams,
  CalendarMonthSummaryResponse,
  CalendarDaySummary,
  CalendarEventsByDateParams,
  CalendarPopularEventsParams,
  CalendarEventListResponse,
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

/**
 * 특정 날짜의 이벤트 목록 조회
 *
 * @description
 * - 사용자가 캘린더에서 특정 날짜를 클릭했을 때 호출
 * - 해당 날짜에 진행 중인 모든 이벤트 조회
 * - 환경변수에 따라 더미 데이터 또는 실제 API 호출
 * - 카테고리, 지역, 정렬 옵션 지원
 *
 * @param params - 날짜 및 필터 파라미터
 * @returns 이벤트 목록 및 전체 개수
 *
 * @example
 * ```ts
 * const data = await getCalendarEventsByDate({
 *   date: '2026-02-08',
 *   categories: ['exhibition', 'popup'],
 *   sortBy: 'popular',
 * });
 * console.log(data.events); // 이벤트 목록
 * console.log(data.total);  // 전체 개수
 * ```
 */
export async function getCalendarEventsByDate(
  params: CalendarEventsByDateParams
): Promise<CalendarEventListResponse> {
  const {
    date,
    regionId,
    categories,
    subcategories,
    sortBy = "popular",
    page = 1,
    size = 24,
  } = params;

  // 개발 환경에서 더미 데이터 사용
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    // 더미 데이터 로드 (동적 import로 번들 크기 최적화)
    const { generateEventsByDate } = await import(
      "@/lib/calendar-dummy-events"
    );

    // API 호출 시뮬레이션 (300ms 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 300));

    let events = generateEventsByDate(date);

    // 카테고리 필터링
    if (categories && categories.length > 0) {
      events = events.filter((event) => {
        const eventCategory =
          event.category === "전시" ? "exhibition" : "popup";
        return categories.includes(eventCategory);
      });
    }

    // 서브카테고리 필터링
    if (subcategories && subcategories.length > 0) {
      events = events.filter(
        (event) => event.subcategory && subcategories.includes(event.subcategory)
      );
    }

    return {
      events,
      total: events.length,
      page: 1,
      totalPages: 1,
    };
  }

  // 실제 API 호출
  const res = await axiosInstance.get<CalendarEventListResponse>(
    "/calendar/events",
    {
      params: {
        date,
        regionId: regionId ?? undefined,
        categories: categories?.length ? categories.join(",") : undefined,
        subcategories: subcategories?.length
          ? subcategories.join(",")
          : undefined,
        sortBy,
        page,
        size,
      },
    }
  );

  return res.data;
}

/**
 * 인기 이벤트 목록 조회
 *
 * @description
 * - 날짜 선택이 없을 때 HOT EVENT 섹션에 표시할 인기 이벤트 조회
 * - 좋아요 수, 조회수 등을 기준으로 정렬된 이벤트 목록
 * - 환경변수에 따라 더미 데이터 또는 실제 API 호출
 * - 카테고리, 지역, 정렬 옵션 지원
 *
 * @param params - 필터 및 개수 파라미터
 * @returns 인기 이벤트 목록 및 전체 개수
 *
 * @example
 * ```ts
 * const data = await getCalendarPopularEvents({
 *   limit: 24,
 *   categories: ['exhibition', 'popup'],
 *   sortBy: 'popular',
 * });
 * console.log(data.events); // 인기 이벤트 목록 (최대 24개)
 * ```
 */
export async function getCalendarPopularEvents(
  params: CalendarPopularEventsParams = {}
): Promise<CalendarEventListResponse> {
  const {
    limit = 24,
    regionId,
    categories,
    subcategories,
    sortBy = "popular",
    page = 1,
    size,
  } = params;

  // 개발 환경에서 더미 데이터 사용
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    // 더미 데이터 로드 (동적 import)
    const { generatePopularEvents } = await import(
      "@/lib/calendar-dummy-events"
    );

    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 300));

    let events = generatePopularEvents(limit);

    // 카테고리 필터링
    if (categories && categories.length > 0) {
      events = events.filter((event) => {
        const eventCategory =
          event.category === "전시" ? "exhibition" : "popup";
        return categories.includes(eventCategory);
      });
    }

    // 서브카테고리 필터링
    if (subcategories && subcategories.length > 0) {
      events = events.filter(
        (event) => event.subcategory && subcategories.includes(event.subcategory)
      );
    }

    return {
      events,
      total: events.length,
      page: 1,
      totalPages: 1,
    };
  }

  // 실제 API 호출
  const res = await axiosInstance.get<CalendarEventListResponse>(
    "/calendar/popular",
    {
      params: {
        limit,
        regionId: regionId ?? undefined,
        categories: categories?.length ? categories.join(",") : undefined,
        subcategories: subcategories?.length
          ? subcategories.join(",")
          : undefined,
        sortBy,
        page,
        size: size ?? limit,
      },
    }
  );

  return res.data;
}
