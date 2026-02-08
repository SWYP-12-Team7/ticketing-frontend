/**
 * 인기 이벤트 목록 조회 React Query 훅
 *
 * @description
 * - 날짜 선택이 없을 때 HOT EVENT 섹션에 표시할 인기 이벤트 조회
 * - 좋아요 수, 조회수 등을 기준으로 정렬된 이벤트 목록
 * - 필터링, 정렬 옵션 지원
 * - 자동 캐싱 및 백그라운드 업데이트
 *
 * @example
 * ```tsx
 * function HotEvents() {
 *   const { data, isLoading } = useCalendarPopularEvents({
 *     limit: 24,
 *     categories: ['exhibition', 'popup'],
 *     sortBy: 'popular',
 *   });
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div className="grid grid-cols-6 gap-6">
 *       {data.events.map(event => (
 *         <EventCard key={event.id} event={event} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useQuery } from "@tanstack/react-query";
import type { CalendarPopularEventsParams } from "@/types/calendar";
import { getCalendarPopularEvents } from "@/services/api/calendar";
import { calendarKeys } from "./index";

/**
 * useCalendarPopularEvents 훅 옵션
 */
interface UseCalendarPopularEventsOptions {
  /** 쿼리 활성화 여부 (false면 쿼리 실행 안 함) */
  enabled?: boolean;
  /** 데이터가 신선하다고 간주되는 시간 (ms) */
  staleTime?: number;
  /** 가비지 컬렉션 시간 (ms) */
  gcTime?: number;
}

/**
 * 인기 이벤트 목록을 조회하는 React Query 훅
 *
 * @param params - 필터 및 개수 파라미터 (기본값: {})
 * @param options - React Query 옵션
 * @returns 인기 이벤트 쿼리 결과
 *
 * @example
 * ```tsx
 * // 기본 사용 (24개 조회)
 * const { data } = useCalendarPopularEvents();
 *
 * // 개수 지정
 * const { data } = useCalendarPopularEvents({
 *   limit: 12,
 * });
 *
 * // 필터링 적용
 * const { data } = useCalendarPopularEvents({
 *   limit: 24,
 *   categories: ['exhibition'],
 *   regionId: 'seoul-gangnam',
 *   sortBy: 'views',
 * });
 *
 * // 조건부 활성화 (날짜 선택 안 됐을 때만)
 * const { data } = useCalendarPopularEvents(
 *   { limit: 24 },
 *   { enabled: !selectedDate }
 * );
 * ```
 */
export function useCalendarPopularEvents(
  params: CalendarPopularEventsParams = {},
  options?: UseCalendarPopularEventsOptions
) {
  const {
    limit = 24,
    regionId,
    categories,
    subcategories,
    sortBy = "popular",
    page,
    size,
  } = params;

  // 필터를 문자열로 직렬화 (Query Key용)
  const filtersKey = JSON.stringify({
    regionId,
    categories,
    subcategories,
    sortBy,
    page,
    size,
  });

  return useQuery({
    queryKey: calendarKeys.events.popular(limit, filtersKey),
    queryFn: () => getCalendarPopularEvents(params),
    staleTime: options?.staleTime ?? 5 * 60_000, // 기본 5분 (인기 이벤트는 더 길게)
    gcTime: options?.gcTime ?? 15 * 60_000, // 기본 15분
    enabled: options?.enabled ?? true,
  });
}
