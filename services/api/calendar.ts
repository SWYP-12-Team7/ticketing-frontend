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
import type { Event } from "@/types/event";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { month, regionId, categories: _categories } = params;

  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateDummyCalendarData(month);
  }

  // ISO 문자열을 year, month로 분리
  const [yearStr, monthStr] = month.split("-");
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);

  // 백엔드 API 응답 타입 정의 (실제 응답 구조 반영)
  interface BackendCalendarDayItem {
    date: string; // "2026-02-04"
    exhibitionCount: number;
    popupCount: number;
  }

  interface BackendCalendarResponse {
    year: number;
    month: number;
    days: BackendCalendarDayItem[];
  }

  /**
   * ⚠️ 백엔드 API의 category 파라미터가 제대로 작동하지 않음
   * - category 파라미터 없음: 정상 동작 (79개)
   * - category 파라미터 있음: 항상 0개 반환
   * - 해결책: category 파라미터를 보내지 않고 전체 데이터 조회
   * - TODO: 백엔드 API 수정 후 아래 주석 해제
   */
  
  // const categoryParam = categories?.length
  //   ? categories
  //       .map((cat) => (cat === "exhibition" ? "EXHIBITION" : "POPUP"))
  //       .join(",")
  //   : undefined;

  // 실제 API 호출 (Swagger 기준)
  // ⚠️ category 파라미터 제외 (백엔드 버그로 인해)
  const res = await axiosInstance.get<BackendCalendarResponse>(
    "/curations/calendar",
    {
      params: {
        year,
        month: monthNum,
        region: regionId || undefined,
        // category: categoryParam,  // 백엔드 버그로 인해 주석 처리
      },
    }
  );

  // 응답 데이터 검증
  if (!res.data || !Array.isArray(res.data.days)) {
    throw new Error(
      `Invalid API response: expected { year, month, days: [] }, got ${JSON.stringify(res.data)}`
    );
  }

  // 백엔드 응답을 프론트엔드 타입으로 변환
  const days: CalendarDaySummary[] = res.data.days.map((item) => ({
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
 * - API: GET /curations/calendar/list
 * - 카테고리 필터링: exhibition → EXHIBITION, popup → POPUP
 *
 * @param params - 날짜 및 필터 파라미터
 * @returns 이벤트 목록 및 전체 개수
 *
 * @example
 * ```ts
 * // 기본 조회
 * const data = await getCalendarEventsByDate({
 *   date: '2026-02-08',
 * });
 *
 * // 카테고리 필터링
 * const filtered = await getCalendarEventsByDate({
 *   date: '2026-02-08',
 *   categories: ['exhibition', 'popup'],
 *   regionId: 'seoul-seongsu',
 * });
 * ```
 */
export async function getCalendarEventsByDate(
  params: CalendarEventsByDateParams
): Promise<CalendarEventListResponse> {
  const { date, regionId, categories } = params;
  
  // 백엔드 미지원 파라미터 (향후 확장을 위해 타입에는 존재)
  // - subcategories: 세부 카테고리 필터링
  // - sortBy: 정렬 기준
  // - page, size: 페이지네이션

  // ========== 더미 데이터 분기 ==========
  const USE_DUMMY_DATA = process.env.NEXT_PUBLIC_USE_CALENDAR_DUMMY === "true";

  if (USE_DUMMY_DATA) {
    const { generateEventsByDate } = await import(
      "@/lib/calendar-dummy-events"
    );
    await new Promise((resolve) => setTimeout(resolve, 300));

    let events = generateEventsByDate(date);

    // 카테고리 필터링
    if (categories?.length) {
      events = events.filter((event) => {
        const eventCategory =
          event.category === "전시" ? "exhibition" : "popup";
        return categories.includes(eventCategory);
      });
    }

    // 서브카테고리 필터링
    if (params.subcategories?.length) {
      events = events.filter(
        (event) =>
          event.subcategory && params.subcategories!.includes(event.subcategory)
      );
    }

    return {
      events,
      total: events.length,
      page: 1,
      totalPages: 1,
    };
  }

  // ========== 실제 API 호출 ==========

  /**
   * 백엔드 API 응답 타입 정의
   * - GET /curations/calendar/list
   */
  interface BackendEventItem {
    id: number;
    title: string;
    type: "EXHIBITION" | "POPUP";
    category: string[]; // ["패션", "뷰티"] 형태
    thumbnail: string;
    dateText: string; // "2026.02.08 ~ 2026.02.28"
    viewCount: number;
    likeCount: number;
  }

  interface BackendCalendarListResponse {
    items: BackendEventItem[];
  }

  /**
   * 카테고리 파라미터 변환
   * - FE: ["exhibition", "popup"] → BE: "EXHIBITION,POPUP"
   */
  const categoryParam = categories?.length
    ? categories
        .map((cat) => (cat === "exhibition" ? "EXHIBITION" : "POPUP"))
        .join(",")
    : undefined;

  // API 요청
  const response = await axiosInstance.get<BackendCalendarListResponse>(
    "/curations/calendar/list",
    {
      params: {
        date, // ISO Date: "2026-02-08"
        region: regionId || undefined, // Optional
        category: categoryParam, // Optional: "EXHIBITION,POPUP"
      },
    }
  );

  // 응답 검증
  if (!response.data || !Array.isArray(response.data.items)) {
    throw new Error(
      `[API Error] Invalid response structure. Expected { items: [] }, got: ${JSON.stringify(response.data)}`
    );
  }

  /**
   * 백엔드 응답 → 프론트엔드 Event 타입 변환
   */
  const events: Event[] = response.data.items.map((item) => ({
    // ID: number → string 변환
    id: item.id.toString(),

    // 제목
    title: item.title,

    // 카테고리: EXHIBITION → "전시", POPUP → "팝업"
    category: item.type === "EXHIBITION" ? "전시" : "팝업",

    // 서브카테고리: category 배열의 첫 번째 요소
    subcategory: item.category[0] || undefined,

    // 기간: dateText 그대로 사용
    period: item.dateText,

    // 이미지: thumbnail → imageUrl
    imageUrl: item.thumbnail,

    // 조회수/좋아요
    viewCount: item.viewCount,
    likeCount: item.likeCount,

    // 좋아요 여부: 기본값 false (향후 찜하기 API 연동 필요)
    isLiked: false,
  }));

  return {
    events,
    total: events.length,
    page: 1,
    totalPages: 1,
  };
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
  const { limit = 24, categories } = params;

  // 백엔드 미지원 파라미터 (향후 확장을 위해 타입에는 존재)
  // - regionId: 지역 필터링
  // - subcategories: 세부 카테고리 필터링
  // - sortBy: 정렬 기준 (현재 daily만 사용)
  // - page, size: 페이지네이션

  // ========== 더미 데이터 분기 ==========
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
    if (categories?.length) {
      events = events.filter((event) => {
        const eventCategory =
          event.category === "전시" ? "exhibition" : "popup";
        return categories.includes(eventCategory);
      });
    }

    // 서브카테고리 필터링
    if (params.subcategories?.length) {
      events = events.filter(
        (event) =>
          event.subcategory &&
          params.subcategories!.includes(event.subcategory)
      );
    }

    return {
      events,
      total: events.length,
      page: 1,
      totalPages: 1,
    };
  }

  // ========== 실제 API 호출 ==========

  /**
   * 백엔드 API 응답 타입 정의
   * - GET /main/popular
   */
  interface PopularEventItem {
    rank: number;
    id: number;
    title: string;
    thumbnail: string;
    address: string;
    period: string; // "2026-01-21 ~ 2026-02-12"
  }

  interface PopularEventsResponse {
    result: string;
    data: {
      exhibition: {
        daily: PopularEventItem[];
        weekly: PopularEventItem[];
        monthly: PopularEventItem[];
      };
      popup: {
        daily: PopularEventItem[];
        weekly: PopularEventItem[];
        monthly: PopularEventItem[];
      };
    };
  }

  // API 요청
  const response = await axiosInstance.get<PopularEventsResponse>(
    "/main/popular",
    {
      params: {
        limit, // 현재 백엔드는 고정 10개 반환, limit 파라미터 무시
      },
    }
  );

  // 응답 검증
  if (!response.data || response.data.result !== "SUCCESS") {
    throw new Error(
      `[API Error] Invalid response from /main/popular: ${JSON.stringify(response.data)}`
    );
  }

  /**
   * 카테고리별 이벤트 수집
   */
  const allEvents: Event[] = [];

  // 카테고리 필터링 여부 확인
  const shouldIncludeExhibition =
    !categories?.length || categories.includes("exhibition");
  const shouldIncludePopup =
    !categories?.length || categories.includes("popup");

  // 전시 이벤트 추가
  if (shouldIncludeExhibition) {
    const exhibitionEvents: Event[] = response.data.data.exhibition.daily.map(
      (item) => ({
        // ID: number → string 변환
        id: item.id.toString(),

        // 제목
        title: item.title,

        // 카테고리: 전시로 고정
        category: "전시",

        // 이미지: thumbnail → imageUrl
        imageUrl: item.thumbnail,

        // 기간: 그대로 사용
        period: item.period,

        // 지역: address → region
        region: item.address,

        // 조회수/좋아요: 백엔드에서 제공하지 않으므로 기본값 0
        viewCount: 0,
        likeCount: 0,

        // 좋아요 여부: 기본값 false
        isLiked: false,
      })
    );
    allEvents.push(...exhibitionEvents);
  }

  // 팝업 이벤트 추가
  if (shouldIncludePopup) {
    const popupEvents: Event[] = response.data.data.popup.daily.map(
      (item) => ({
        id: item.id.toString(),
        title: item.title,
        category: "팝업",
        imageUrl: item.thumbnail,
        period: item.period,
        region: item.address,
        viewCount: 0,
        likeCount: 0,
        isLiked: false,
      })
    );
    allEvents.push(...popupEvents);
  }

  // limit 적용 (상위 N개만)
  const limitedEvents = allEvents.slice(0, limit);

  return {
    events: limitedEvents,
    total: limitedEvents.length,
    page: 1,
    totalPages: 1,
  };
}
