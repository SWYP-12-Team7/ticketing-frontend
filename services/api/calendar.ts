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
  IsoDate,
  CalendarRegion,
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
 * @description
 * - Swagger API: GET /curations/calendar
 * - 백엔드에서 날짜별 전시/팝업 개수 반환
 * - 프론트엔드에서 CalendarMonthSummaryResponse 형태로 변환
 *
 * @param params - 월, 지역, 카테고리 파라미터
 * @returns 월별 일자별 이벤트 개수 및 지역 목록
 *
 * @example
 * ```ts
 * const data = await getCalendarMonthSummary({
 *   month: '2026-02',
 *   regionId: 'seoul',
 *   categories: ['exhibition', 'popup']
 * });
 * ```
 */
export async function getCalendarMonthSummary(
  params: CalendarMonthSummaryParams
): Promise<CalendarMonthSummaryResponse> {
  const { month, regionId, categories } = params;

  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateDummyCalendarData(month);
  }

  // ISO 문자열을 year, month로 분리
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // 백엔드 API 응답 타입 정의
  interface BackendCalendarDayResponse {
    date: string; // "2026-02-04"
    exhibitionCount: number;
    popupCount: number;
  }

  // 실제 API 호출 (Swagger 기준)
  const res = await axiosInstance.get<BackendCalendarDayResponse[]>(
    "/curations/calendar",
    {
      params: {
        year,
        month: monthNum,
        region: regionId || undefined,
        category: categories?.join(",") || undefined,
      },
    }
  );

  // 백엔드 응답을 프론트엔드 타입으로 변환
  const days: CalendarDaySummary[] = res.data.map((item) => ({
    date: item.date as IsoDate,
    counts: {
      exhibition: item.exhibitionCount,
      popup: item.popupCount,
    },
  }));

  // 지역 목록 (백엔드 API에 없으므로 하드코딩)
  const regions: CalendarRegion[] = [
    { id: "all", label: "전체" },
    { id: "seoul", label: "서울" },
    { id: "busan", label: "부산" },
    { id: "incheon", label: "인천" },
    { id: "daegu", label: "대구" },
    { id: "gwangju", label: "광주" },
    { id: "daejeon", label: "대전" },
    { id: "ulsan", label: "울산" },
    { id: "sejong", label: "세종" },
    { id: "gyeonggi", label: "경기" },
    { id: "gangwon", label: "강원" },
    { id: "chungbuk", label: "충북" },
    { id: "chungnam", label: "충남" },
    { id: "jeonbuk", label: "전북" },
    { id: "jeonnam", label: "전남" },
    { id: "gyeongbuk", label: "경북" },
    { id: "gyeongnam", label: "경남" },
    { id: "jeju", label: "제주" },
  ];

  return {
    month,
    days,
    regions,
  };
}

/**
 * 특정 날짜의 이벤트 목록 조회
 *
 * @description
 * - 사용자가 캘린더에서 특정 날짜를 클릭했을 때 호출
 * - 해당 날짜에 진행 중인 모든 이벤트 조회
 * - ⚠️ Swagger에 해당 API 없음 (백엔드 개발 필요)
 * - 현재는 더미 데이터만 사용
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
    regionId: _regionId,
    categories,
    subcategories,
    sortBy: _sortBy = "popular",
    page: _page = 1,
    size: _size = 24,
  } = params;

  // 실제 API가 없으므로 더미 데이터 강제 사용
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA || true) {
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

  // TODO: 백엔드에 날짜별 이벤트 목록 API 추가 후 활성화
  throw new Error("날짜별 이벤트 목록 API가 아직 구현되지 않았습니다.");
}

/**
 * 인기 이벤트 목록 조회
 *
 * @description
 * - 날짜 선택이 없을 때 HOT EVENT 섹션에 표시할 인기 이벤트 조회
 * - 좋아요 수, 조회수 등을 기준으로 정렬된 이벤트 목록
 * - ⚠️ Swagger에 해당 API 없음 (백엔드 개발 필요)
 * - 현재는 더미 데이터만 사용
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
    regionId: _regionId,
    categories,
    subcategories,
    sortBy: _sortBy = "popular",
    page: _page = 1,
    size: _size,
  } = params;

  // 실제 API가 없으므로 더미 데이터 강제 사용
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA || true) {
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

  // TODO: 백엔드에 인기 이벤트 목록 API 추가 후 활성화
  throw new Error("인기 이벤트 목록 API가 아직 구현되지 않았습니다.");
}
