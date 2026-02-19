/**
 * CalendarView 컨테이너 컴포넌트
 *
 * - 비즈니스 로직 및 상태 관리
 * - Custom Hooks 조합
 * - Presentation 컴포넌트에 데이터 전달
 *
 * Container/Presentation 패턴 적용으로:
 * - 관심사 분리 (Separation of Concerns)
 * - 테스트 용이성 향상
 * - 재사용성 증가
 */

"use client";

import React, { useState, useMemo } from "react";
import type { CalendarViewProps } from "./types";
import { useCalendarQueryState } from "./hooks/useCalendarQueryState";
import { useCalendarGridData } from "./hooks/useCalendarGridData";
import { CalendarViewPresentation } from "./CalendarViewPresentation";
import {
  INITIAL_FILTER_STATE,
  type LocationEventFilterState,
} from "@/components/common/LocationEventFilter";
import { convertLocationFilterToAPIParams } from "@/utils/filterConverter";
import type { CalendarCategory } from "@/types/calendar";

/**
 * CalendarView 컨테이너 컴포넌트
 *
 * - URL 쿼리 상태 관리
 * - 필터 상태 관리 (locationFilterState)
 * - API 데이터 fetching
 * - Presentation 컴포넌트에 props 전달
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   const [selectedDate, setSelectedDate] = useState<IsoDate | null>(null);
 *
 *   return (
 *     <CalendarView
 *       selectedDate={selectedDate}
 *       onDateClick={setSelectedDate}
 *     />
 *   );
 * }
 * ```
 */
export function CalendarView({ selectedDate, onDateClick }: CalendarViewProps) {
  // URL 쿼리 상태 관리
  const queryState = useCalendarQueryState();

  // 필터 상태 관리 (컨테이너에서 중앙 관리)
  const [locationFilterState, setLocationFilterState] =
    useState<LocationEventFilterState>(INITIAL_FILTER_STATE);

  /**
   * locationFilterState에서 선택된 카테고리 추출
   * - 사이드바 필터를 캘린더 pill에 반영
   * - "all"이 아닌 경우에만 해당 카테고리 포함
   */
  const selectedCategories = useMemo(() => {
    const categories: CalendarCategory[] = [];
    
    // 팝업 카테고리가 "all"이 아니면 추가
    if (
      locationFilterState.popupCategories.length > 0 &&
      !locationFilterState.popupCategories.includes("all")
    ) {
      categories.push("popup");
    }
    
    // 전시 카테고리가 "all"이 아니면 추가
    if (
      locationFilterState.exhibitionCategories.length > 0 &&
      !locationFilterState.exhibitionCategories.includes("all")
    ) {
      categories.push("exhibition");
    }
    
    // 둘 다 "all"이거나 선택 안 됨 → 전체 조회 (빈 배열 = 백엔드가 전체로 해석)
    return categories;
  }, [locationFilterState]);

  // 그리드 데이터 조회 (서브카테고리 필터 시 날짜별 카운트 반영)
  const apiFilterParams = useMemo(
    () => convertLocationFilterToAPIParams(locationFilterState),
    [locationFilterState]
  );
  const firstRegion = locationFilterState.regions[0];
  const gridData = useCalendarGridData({
    month: queryState.month,
    regionId: firstRegion === "all" ? "all" : firstRegion || "all",
    selectedCategories: selectedCategories,
    apiFilterParams,
  });

  // Presentation 컴포넌트에 모든 데이터 전달
  return (
    <CalendarViewPresentation
      queryState={queryState}
      gridData={gridData}
      selectedDate={selectedDate}
      onDateClick={onDateClick}
      locationFilterState={locationFilterState}
      onFilterChange={setLocationFilterState}
    />
  );
}
