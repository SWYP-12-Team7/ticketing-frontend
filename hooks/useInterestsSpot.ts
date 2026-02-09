/**
 * useInterestsSpot Hook
 *
 * @description
 * - 취향 저격 신규 스팟 섹션의 비즈니스 로직 관리
 * - 칩 선택 상태 및 필터링 로직
 * - Mock 데이터 또는 실제 API 데이터 처리
 */

"use client";

import { useState, useMemo } from "react";
import type { Event } from "@/types/event";
import { INTERESTS_CHIP_LABELS } from "@/components/interests/constants";

/**
 * 취향 저격 신규 스팟 훅
 *
 * @param events - 외부에서 전달받은 이벤트 (API 데이터)
 * @returns 칩 선택 상태, 필터링된 이벤트, 핸들러 함수
 *
 * @example
 * ```tsx
 * const { selectedChip, filteredEvents, handleChipClick } = useInterestsSpot();
 * ```
 */
export function useInterestsSpot(events?: Event[]) {
  const [selectedChipIndex, setSelectedChipIndex] = useState(0);

  // 선택된 칩에 따른 필터링 (메모이제이션)
  const filteredEvents = useMemo(() => {
    // ✅ API 데이터 사용 (Mock 제거)
    const sourceEvents = events ?? [];
    const selectedLabel = INTERESTS_CHIP_LABELS[selectedChipIndex];

    // 전체 데이터에서 서브카테고리로 필터링
    return sourceEvents.filter(
      (event) => event.subcategory === selectedLabel
    );
  }, [selectedChipIndex, events]); // ✅ events를 직접 의존성으로 사용

  /**
   * 칩 클릭 핸들러
   */
  const handleChipClick = (index: number) => {
    setSelectedChipIndex(index);
  };

  return {
    selectedChipIndex,
    selectedLabel: INTERESTS_CHIP_LABELS[selectedChipIndex],
    filteredEvents,
    handleChipClick,
    chipLabels: INTERESTS_CHIP_LABELS,
  };
}
