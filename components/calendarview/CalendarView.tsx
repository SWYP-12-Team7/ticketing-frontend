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

import React from "react";
import type { CalendarViewProps } from "./types";
import { useCalendarQueryState } from "./hooks/useCalendarQueryState";
import { useCalendarGridData } from "./hooks/useCalendarGridData";
import { CalendarViewPresentation } from "./CalendarViewPresentation";

/**
 * CalendarView 컨테이너 컴포넌트
 *
 * - URL 쿼리 상태 관리
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

  // 그리드 데이터 조회
  const gridData = useCalendarGridData({
    month: queryState.month,
    regionId: queryState.regionId,
    selectedCategories: queryState.selectedCategories,
  });

  // Presentation 컴포넌트에 모든 데이터 전달
  return (
    <CalendarViewPresentation
      queryState={queryState}
      gridData={gridData}
      selectedDate={selectedDate}
      onDateClick={onDateClick}
    />
  );
}
