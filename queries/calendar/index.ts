/**
 * 캘린더 관련 React Query 훅 및 Query Key Factory
 *
 * @description
 * - 중앙집중식 Query Key 관리
 * - 캐시 무효화 편의성 제공
 * - 타입 안정성 보장
 * - 계층적 Query Key 구조
 *
 * @example
 * ```ts
 * // 특정 쿼리 무효화
 * queryClient.invalidateQueries({
 *   queryKey: calendarKeys.events.byDate('2026-02-08', '...filters')
 * });
 *
 * // 모든 이벤트 쿼리 무효화
 * queryClient.invalidateQueries({
 *   queryKey: calendarKeys.events.all()
 * });
 *
 * // 캘린더 관련 모든 쿼리 무효화
 * queryClient.invalidateQueries({
 *   queryKey: calendarKeys.all
 * });
 * ```
 */

// ===== Query Key Factory =====

/**
 * 캘린더 Query Key Factory
 *
 * @description
 * - 계층적 구조로 Query Key 관리
 * - 부분 무효화 지원 (예: events.all()로 모든 이벤트 쿼리 무효화)
 * - React Query의 계층적 무효화 패턴 활용
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys#query-key-factories
 */
export const calendarKeys = {
  /** 캘린더 관련 모든 쿼리의 루트 키 */
  all: ["calendar"] as const,

  /** 월별 요약 관련 Query Keys */
  monthSummary: {
    /** 월별 요약 모든 쿼리 */
    all: () => [...calendarKeys.all, "month-summary"] as const,

    /**
     * 특정 월의 요약 데이터 Query Key
     * @param month - YYYY-MM 형식
     * @param regionId - 지역 ID (옵셔널)
     * @param categories - 카테고리 CSV (옵셔널)
     */
    byMonth: (month: string, regionId?: string | null, categories?: string) =>
      [
        ...calendarKeys.monthSummary.all(),
        month,
        regionId ?? "",
        categories ?? "",
      ] as const,
  },

  /** 이벤트 목록 관련 Query Keys */
  events: {
    /** 이벤트 목록 모든 쿼리 */
    all: () => [...calendarKeys.all, "events"] as const,

    /**
     * 날짜별 이벤트 Query Key
     * @param date - YYYY-MM-DD 형식
     * @param filters - 필터 정보 (JSON 직렬화된 문자열)
     */
    byDate: (date: string, filters?: string) =>
      [
        ...calendarKeys.events.all(),
        "by-date",
        date,
        filters ?? "",
      ] as const,

    /**
     * 인기 이벤트 Query Key
     * @param limit - 조회할 개수
     * @param filters - 필터 정보 (JSON 직렬화된 문자열)
     */
    popular: (limit: number, filters?: string) =>
      [...calendarKeys.events.all(), "popular", limit, filters ?? ""] as const,
  },
} as const;

// ===== Exports =====

/**
 * 캘린더 관련 훅 export
 */
export { useCalendarMonthSummary } from "./useCalendarMonthSummary";
export { useCalendarEventsByDate } from "./useCalendarEventsByDate";
export { useCalendarPopularEvents } from "./useCalendarPopularEvents";

/**
 * 기존 queryKey 함수 re-export (하위 호환성)
 */
export { calendarMonthSummaryQueryKey } from "./useCalendarMonthSummary";
