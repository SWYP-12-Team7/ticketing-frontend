import type { Event } from "./event";

export type CalendarCategory = "popup" | "exhibition";

export type IsoDate = `${number}-${string}-${string}`; // "YYYY-MM-DD"
export type IsoMonth = `${number}-${string}`; // "YYYY-MM"

/**
 * 팝업스토어 서브카테고리
 * HeaderSideBar 메뉴와 동기화
 */
export type PopupSubcategory =
  | "all"
  | "fashion"
  | "beauty"
  | "fnb"
  | "character"
  | "tech"
  | "lifestyle"
  | "furniture";

/**
 * 전시 서브카테고리
 * HeaderSideBar 메뉴와 동기화
 */
export type ExhibitionSubcategory =
  | "all"
  | "art"
  | "photo"
  | "design"
  | "sculpture"
  | "media"
  | "craft"
  | "history";

/**
 * 캘린더 필터 상태
 * 필터바에서 사용하는 전체 필터 상태
 */
export type CalendarFilterState = {
  region: string;
  popup: {
    enabled: boolean;
    subcategory: PopupSubcategory;
  };
  exhibition: {
    enabled: boolean;
    subcategory: ExhibitionSubcategory;
  };
};

/**
 * 선택된 캘린더 이벤트 (Pill 클릭)
 * null이면 선택 없음
 */
export type SelectedCalendarEvent = {
  date: IsoDate;
  category: CalendarCategory;
  subcategory: PopupSubcategory | ExhibitionSubcategory;
} | null;

export type CalendarDaySummary = Readonly<{
  date: IsoDate;
  counts: Record<CalendarCategory, number>;
}>;

export type CalendarRegion = Readonly<{ id: string; label: string }>;

export type CalendarMonthSummaryResponse = Readonly<{
  month: IsoMonth;
  days: readonly CalendarDaySummary[];
  regions: readonly CalendarRegion[];
}>;

export type CalendarMonthSummaryParams = Readonly<{
  month: IsoMonth;
  regionId?: string | null;
  categories?: readonly CalendarCategory[];
}>;

// ===== 캘린더 이벤트 API 관련 타입 =====

/**
 * 캘린더 이벤트 필터 파라미터
 *
 * @description
 * - API 요청 시 공통으로 사용되는 필터 파라미터
 * - 날짜별 이벤트, 인기 이벤트 조회 시 활용
 *
 * @example
 * ```ts
 * const filterParams: CalendarEventFilterParams = {
 *   regionId: 'seoul-seongsu',
 *   categories: ['exhibition', 'popup'],
 *   sortBy: 'popular',
 * };
 * ```
 */
export interface CalendarEventFilterParams {
  /** 지역 ID (선택적) */
  regionId?: string | null;

  /** 카테고리 목록 (선택적) */
  categories?: readonly CalendarCategory[];

  /** 서브카테고리 목록 (선택적) */
  subcategories?: readonly string[];

  /** 정렬 옵션 (기본값: 'popular') */
  sortBy?: "popular" | "latest" | "deadline" | "views";

  /** 페이지 번호 (무한 스크롤 또는 페이지네이션용) */
  page?: number;

  /** 페이지 크기 (한 페이지당 아이템 개수) */
  size?: number;
}

/**
 * 특정 날짜의 이벤트 목록 조회 파라미터
 *
 * @description
 * - 사용자가 캘린더에서 특정 날짜를 클릭했을 때 사용
 * - 해당 날짜에 진행 중인 모든 이벤트 조회
 *
 * @example
 * ```ts
 * const params: CalendarEventsByDateParams = {
 *   date: '2026-02-08',
 *   categories: ['exhibition', 'popup'],
 *   sortBy: 'popular',
 * };
 * ```
 */
export interface CalendarEventsByDateParams extends CalendarEventFilterParams {
  /** 조회할 날짜 (YYYY-MM-DD 형식) */
  date: IsoDate;
}

/**
 * 인기 이벤트 조회 파라미터
 *
 * @description
 * - 날짜 선택이 없을 때 HOT EVENT 섹션에 표시할 인기 이벤트 조회
 * - 좋아요 수, 조회수 등을 기준으로 정렬된 이벤트 목록
 *
 * @example
 * ```ts
 * const params: CalendarPopularEventsParams = {
 *   limit: 24,
 *   categories: ['exhibition'],
 *   sortBy: 'popular',
 * };
 * ```
 */
export interface CalendarPopularEventsParams
  extends CalendarEventFilterParams {
  /** 조회할 개수 (기본값: 24) */
  limit?: number;
}

/**
 * 이벤트 목록 API 응답
 *
 * @description
 * - 날짜별 이벤트, 인기 이벤트 API의 공통 응답 타입
 * - Event 타입은 types/event.ts에서 import하여 재사용
 * - 타입 일관성 및 유지보수성 향상
 *
 * @example
 * ```ts
 * const response: CalendarEventListResponse = {
 *   events: [...],
 *   total: 156,
 *   page: 1,
 *   totalPages: 7,
 * };
 * ```
 */
export interface CalendarEventListResponse {
  /** 이벤트 목록 (types/event.ts의 Event 타입 사용) */
  events: Event[];

  /** 전체 이벤트 개수 */
  total: number;

  /** 현재 페이지 번호 (페이지네이션 사용 시) */
  page?: number;

  /** 전체 페이지 수 (페이지네이션 사용 시) */
  totalPages?: number;
}
