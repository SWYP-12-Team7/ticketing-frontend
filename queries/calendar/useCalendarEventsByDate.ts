/**
 * 특정 날짜의 이벤트 목록 조회 React Query 훅
 *
 * @description
 * - 사용자가 캘린더에서 특정 날짜를 클릭했을 때 사용
 * - 해당 날짜에 진행 중인 모든 이벤트 조회
 * - 필터링, 정렬 옵션 지원
 * - 자동 캐싱 및 백그라운드 업데이트
 *
 * @example
 * ```tsx
 * function CalendarEvents({ selectedDate }: { selectedDate: IsoDate }) {
 *   const { data, isLoading, isError } = useCalendarEventsByDate({
 *     date: selectedDate,
 *     categories: ['exhibition', 'popup'],
 *     sortBy: 'popular',
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   if (isError) return <Error />;
 *
 *   return (
 *     <div>
 *       {data.events.map(event => (
 *         <EventCard key={event.id} event={event} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */

import { useQuery } from "@tanstack/react-query";
import type { CalendarEventsByDateParams } from "@/types/calendar";
import { getCalendarEventsByDate } from "@/services/api/calendar";
import { calendarKeys } from "./index";

/**
 * useCalendarEventsByDate 훅 옵션
 */
interface UseCalendarEventsByDateOptions {
  /** 쿼리 활성화 여부 (false면 쿼리 실행 안 함) */
  enabled?: boolean;
  /** 데이터가 신선하다고 간주되는 시간 (ms) */
  staleTime?: number;
  /** 가비지 컬렉션 시간 (ms) */
  gcTime?: number;
}

/**
 * 특정 날짜의 이벤트 목록을 조회하는 React Query 훅
 *
 * @param params - 날짜 및 필터 파라미터
 * @param options - React Query 옵션
 * @returns 이벤트 목록 쿼리 결과
 *
 * @example
 * ```tsx
 * // 기본 사용
 * const { data } = useCalendarEventsByDate({
 *   date: '2026-02-08',
 * });
 *
 * // 필터링 적용
 * const { data } = useCalendarEventsByDate({
 *   date: '2026-02-08',
 *   categories: ['exhibition', 'popup'],
 *   regionId: 'seoul-seongsu',
 *   sortBy: 'popular',
 * });
 *
 * // 조건부 활성화
 * const { data } = useCalendarEventsByDate(
 *   { date: selectedDate },
 *   { enabled: !!selectedDate }
 * );
 * ```
 */
export function useCalendarEventsByDate(
  params: CalendarEventsByDateParams,
  options?: UseCalendarEventsByDateOptions
) {
  // 필터를 문자열로 직렬화 (Query Key용)
  const filtersKey = JSON.stringify({
    regionId: params.regionId,
    categories: params.categories,
    subcategories: params.subcategories,
    sortBy: params.sortBy,
    page: params.page,
    size: params.size,
  });

  return useQuery({
    queryKey: calendarKeys.events.byDate(params.date, filtersKey),
    queryFn: () => getCalendarEventsByDate(params),
    staleTime: options?.staleTime ?? 3 * 60_000, // 기본 3분
    gcTime: options?.gcTime ?? 10 * 60_000, // 기본 10분
    enabled: options?.enabled ?? true,
  });
}
