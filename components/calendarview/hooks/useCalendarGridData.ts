/**
 * 캘린더 그리드 데이터 관리 커스텀 훅
 *
 * - API 데이터 fetching (React Query)
 * - 그리드 날짜 배열 생성
 * - 날짜별 카운트 맵 구성
 * - 로딩 및 에러 상태 관리
 */

import { useMemo } from "react";
import { buildMonthGrid, formatMonthTitle } from "@/lib/calendar-date";
import type {
  CalendarCategory,
  CalendarRegion,
  IsoDate,
  IsoMonth,
} from "@/types/calendar";
import { useCalendarMonthSummary } from "@/queries/calendar/useCalendarMonthSummary";

/**
 * Fallback 지역 목록 (API 실패 시 사용)
 */
const FALLBACK_REGIONS: readonly CalendarRegion[] = [
  { id: "all", label: "부산시 전체" },
] as const;

/**
 * 날짜별 카운트 맵 생성 (최적화된 조회를 위해 Map 사용)
 *
 * @param days - 날짜별 카운트 배열
 * @returns 날짜를 키로 하는 ReadonlyMap
 */
function buildCountsByDate(
  days: readonly { date: IsoDate; counts: Record<CalendarCategory, number> }[]
): ReadonlyMap<IsoDate, Record<CalendarCategory, number>> {
  const map = new Map<IsoDate, Record<CalendarCategory, number>>();
  for (const day of days) {
    map.set(day.date, day.counts);
  }
  return map;
}

/**
 * IsoMonth 문자열에서 Date 객체 생성
 *
 * @param isoMonth - YYYY-MM 형식 문자열
 * @returns 해당 월의 1일 Date 객체
 */
function getMonthDateFromIsoMonth(isoMonth: IsoMonth): Date {
  const [year, month] = isoMonth.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * useCalendarGridData 파라미터 타입
 */
interface UseCalendarGridDataParams {
  /** 표시할 월 (YYYY-MM) */
  month: IsoMonth;
  /** 선택된 지역 ID */
  regionId: string;
  /** 선택된 카테고리 목록 */
  selectedCategories: readonly CalendarCategory[];
}

/**
 * 캘린더 그리드 렌더링에 필요한 모든 데이터를 제공하는 커스텀 훅
 *
 * @param params - 월, 지역, 선택된 카테고리
 * @returns 그리드 렌더링에 필요한 모든 데이터
 *
 * @example
 * ```tsx
 * function CalendarGrid() {
 *   const {
 *     gridDays,
 *     countsByDate,
 *     isLoading,
 *   } = useCalendarGridData({
 *     month: '2025-02',
 *     regionId: 'all',
 *     selectedCategories: ['exhibition', 'popup'],
 *   });
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {gridDays.map(day => (
 *         <DayCell
 *           key={day.toString()}
 *           counts={countsByDate.get(toIsoDate(day))}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalendarGridData({
  month,
  regionId,
  selectedCategories,
}: UseCalendarGridDataParams) {
  // ===== API 데이터 조회 =====
  const { data, isLoading, isError, error } = useCalendarMonthSummary({
    month,
    regionId: regionId === "all" ? null : regionId,
    categories: selectedCategories,
  });

  // ===== 월 정보 계산 =====
  const visibleMonthDate = useMemo(
    () => getMonthDateFromIsoMonth(month),
    [month]
  );

  const monthTitle = useMemo(
    () => formatMonthTitle(visibleMonthDate),
    [visibleMonthDate]
  );

  // ===== 그리드 날짜 배열 생성 (6주 고정) =====
  const gridDays = useMemo(
    () => buildMonthGrid(visibleMonthDate),
    [visibleMonthDate]
  );

  // ===== 날짜별 카운트 맵 =====
  const countsByDate = useMemo(
    () => buildCountsByDate(data?.days ?? []),
    [data?.days]
  );

  // ===== 지역 목록 =====
  const regions = useMemo(
    () => (data?.regions?.length ? data.regions : FALLBACK_REGIONS),
    [data?.regions]
  );

  return {
    // ===== 월 정보 =====
    /** 현재 표시 중인 월의 Date 객체 */
    visibleMonthDate,
    /** 월 제목 (예: "February 2025") */
    monthTitle,
    /** 그리드에 표시할 날짜 배열 (42개 고정) */
    gridDays,

    // ===== 데이터 =====
    /** 지역 목록 */
    regions,
    /** 날짜별 이벤트 개수 맵 */
    countsByDate,

    // ===== 상태 =====
    /** 로딩 중 여부 */
    isLoading,
    /** 에러 발생 여부 */
    isError,
    /** 에러 객체 */
    error,
  };
}

/**
 * useCalendarGridData 훅의 반환 타입
 */
export type CalendarGridData = ReturnType<typeof useCalendarGridData>;
