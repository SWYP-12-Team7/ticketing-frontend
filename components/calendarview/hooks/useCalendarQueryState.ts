/**
 * 캘린더 뷰 URL 쿼리 스트링 상태 관리 커스텀 훅
 *
 * - URL 파라미터 파싱 및 검증
 * - 쿼리 스트링 업데이트 함수 제공
 * - 월 이동, 카테고리 토글, 지역 변경 등 모든 필터 액션 처리
 * - 브라우저 히스토리 관리 (replace 방식)
 */

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toIsoMonth, addMonths } from "@/lib/calendar-date";
import type {
  IsoMonth,
  PopupSubcategory,
  ExhibitionSubcategory,
} from "@/types/calendar";
import {
  parseRegionIdParam,
  parseCategoriesParam,
  serializeCategoriesParam,
  getSelectedCategories,
  parsePopupSubcategoryParam,
  parseExhibitionSubcategoryParam,
  type CalendarCategoryActiveMap,
} from "../utils/calendar.query-state";
import { toValidIsoMonth, isValidIsoMonth } from "../utils/calendar.validation";

/**
 * 캘린더 뷰의 URL 쿼리 스트링 상태를 관리하는 커스텀 훅
 *
 * @returns 현재 쿼리 상태 및 업데이트 함수들
 *
 * @example
 * ```tsx
 * function MyCalendar() {
 *   const {
 *     month,
 *     regionId,
 *     activeCategories,
 *     goToNextMonth,
 *     toggleCategory,
 *   } = useCalendarQueryState();
 *
 *   return (
 *     <div>
 *       <button onClick={goToNextMonth}>다음 달</button>
 *       <button onClick={() => toggleCategory('exhibition')}>
 *         전시회 토글
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalendarQueryState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 개별 파라미터 파싱 (메모이제이션 최적화)
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");
  const regionIdParam = searchParams.get("regionId");
  const categoriesParam = searchParams.get("categories");
  const popupSubcategoryParam = searchParams.get("popupSubcategory");
  const exhibitionSubcategoryParam = searchParams.get("exhibitionSubcategory");

  // 파싱된 값들 (각 파라미터만 의존성으로 설정)
  const month = useMemo(() => {
    if (monthParam && isValidIsoMonth(monthParam)) return monthParam;
    const yearNum = Number(yearParam);
    const monthNum = Number(monthParam);
    const derived = toValidIsoMonth(yearNum, monthNum);
    return derived ?? toIsoMonth(new Date());
  }, [monthParam, yearParam]);

  const regionId = useMemo(
    () => parseRegionIdParam(regionIdParam),
    [regionIdParam]
  );

  const activeCategories = useMemo(
    () => parseCategoriesParam(categoriesParam),
    [categoriesParam]
  );

  const selectedCategories = useMemo(
    () => getSelectedCategories(activeCategories),
    [activeCategories]
  );

  const popupSubcategory = useMemo(
    () => parsePopupSubcategoryParam(popupSubcategoryParam),
    [popupSubcategoryParam]
  );

  const exhibitionSubcategory = useMemo(
    () => parseExhibitionSubcategoryParam(exhibitionSubcategoryParam),
    [exhibitionSubcategoryParam]
  );

  /**
   * 쿼리 스트링 업데이트 (범용 함수)
   *
   * - 브라우저 히스토리에 replace 방식으로 업데이트
   * - 스크롤 위치 유지 (scroll: false)
   */
  const updateQuery = useCallback(
    (
      updates: Partial<{
        month: IsoMonth;
        regionId: string;
        categories: string | null;
        popupSubcategory: PopupSubcategory;
        exhibitionSubcategory: ExhibitionSubcategory;
      }>
    ) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (updates.month !== undefined) {
        const [yearStr, monthStr] = updates.month.split("-");
        const monthNum = Number(monthStr);
        newSearchParams.set("year", yearStr);
        newSearchParams.set("month", String(monthNum));
      }

      if (updates.regionId !== undefined) {
        newSearchParams.set("regionId", updates.regionId);
      }

      if (updates.popupSubcategory !== undefined) {
        newSearchParams.set("popupSubcategory", updates.popupSubcategory);
      }

      if (updates.exhibitionSubcategory !== undefined) {
        newSearchParams.set(
          "exhibitionSubcategory",
          updates.exhibitionSubcategory
        );
      }

      if (updates.categories === null) {
        newSearchParams.delete("categories");
      } else if (updates.categories !== undefined) {
        newSearchParams.set("categories", updates.categories);
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  /**
   * 현재 월의 Date 객체 생성 (헬퍼)
   */
  const getCurrentMonthDate = useCallback(() => {
    const [year, monthNum] = month.split("-").map(Number);
    return new Date(year, monthNum - 1, 1);
  }, [month]);

  /**
   * 이전 달로 이동
   */
  const goToPreviousMonth = useCallback(() => {
    const currentMonthDate = getCurrentMonthDate();
    const prevMonth = addMonths(currentMonthDate, -1);
    updateQuery({ month: toIsoMonth(prevMonth) });
  }, [getCurrentMonthDate, updateQuery]);

  /**
   * 다음 달로 이동
   */
  const goToNextMonth = useCallback(() => {
    const currentMonthDate = getCurrentMonthDate();
    const nextMonth = addMonths(currentMonthDate, 1);
    updateQuery({ month: toIsoMonth(nextMonth) });
  }, [getCurrentMonthDate, updateQuery]);

  /**
   * 카테고리 토글 (활성화/비활성화)
   */
  const toggleCategory = useCallback(
    (key: keyof CalendarCategoryActiveMap) => {
      const nextActiveCategories: CalendarCategoryActiveMap = {
        ...activeCategories,
        [key]: !activeCategories[key],
      };
      updateQuery({
        categories: serializeCategoriesParam(nextActiveCategories),
      });
    },
    [activeCategories, updateQuery]
  );

  /**
   * 지역 변경
   */
  const changeRegion = useCallback(
    (nextRegionId: string) => {
      updateQuery({ regionId: nextRegionId });
    },
    [updateQuery]
  );

  /**
   * 특정 월로 이동
   */
  const goToMonth = useCallback(
    (targetMonth: IsoMonth) => {
      updateQuery({ month: targetMonth });
    },
    [updateQuery]
  );

  /**
   * 팝업 서브카테고리 변경
   */
  const changePopupSubcategory = useCallback(
    (subcategory: PopupSubcategory) => {
      updateQuery({ popupSubcategory: subcategory });
    },
    [updateQuery]
  );

  /**
   * 전시 서브카테고리 변경
   */
  const changeExhibitionSubcategory = useCallback(
    (subcategory: ExhibitionSubcategory) => {
      updateQuery({ exhibitionSubcategory: subcategory });
    },
    [updateQuery]
  );

  /**
   * 모든 필터 초기화
   * - 현재 월로 이동
   * - 지역: "전체"
   * - 카테고리: 모두 활성화
   * - 서브카테고리: 모두 "all"
   */
  const resetFilters = useCallback(() => {
    updateQuery({
      month: toIsoMonth(new Date()),
      regionId: "all",
      categories: serializeCategoriesParam({
        exhibition: true,
        popup: true,
      }),
      popupSubcategory: "all",
      exhibitionSubcategory: "all",
    });
  }, [updateQuery]);

  return {
    // ===== 현재 상태 =====
    /** 현재 표시 중인 월 (YYYY-MM) */
    month,
    /** 선택된 지역 ID */
    regionId,
    /** 카테고리별 활성화 상태 */
    activeCategories,
    /** 활성화된 카테고리 목록 */
    selectedCategories,
    /** 팝업 서브카테고리 */
    popupSubcategory,
    /** 전시 서브카테고리 */
    exhibitionSubcategory,

    // ===== 액션 함수 =====
    /** 이전 달로 이동 */
    goToPreviousMonth,
    /** 다음 달로 이동 */
    goToNextMonth,
    /** 특정 월로 이동 */
    goToMonth,
    /** 카테고리 토글 */
    toggleCategory,
    /** 지역 변경 */
    changeRegion,
    /** 팝업 서브카테고리 변경 */
    changePopupSubcategory,
    /** 전시 서브카테고리 변경 */
    changeExhibitionSubcategory,
    /** 모든 필터 초기화 */
    resetFilters,
    /** 범용 쿼리 업데이트 함수 */
    updateQuery,
  };
}

/**
 * useCalendarQueryState 훅의 반환 타입
 */
export type CalendarQueryState = ReturnType<typeof useCalendarQueryState>;
