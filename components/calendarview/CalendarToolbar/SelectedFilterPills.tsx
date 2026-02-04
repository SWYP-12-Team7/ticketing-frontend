/**
 * 선택된 필터들을 표시하는 컴포넌트
 *
 * CalendarToolbar에서 사용
 * 각 필터를 pill 형태로 표시하고 제거 가능
 *
 * Figma 스펙:
 * - 레이블 + 값 2개 영역 구조
 * - 레이블: 주황색 텍스트 + 연한 주황 배경
 * - 값: 검정 텍스트 + 흰색 배경
 * - X 버튼: 제거 기능
 */

"use client";

import React from "react";
import { FilterPill } from "./FilterPill";
import { cn } from "@/lib/utils";

/**
 * 표시용 필터 데이터 타입
 */
export interface DisplayFilter {
  /** 고유 ID (예: "region-busan", "popup-fashion") */
  id: string;

  /** 필터 레이블 (예: "지역", "팝업", "전시") */
  displayLabel: string;

  /** 필터 값 (예: "부산", "뷰티", "현대미술") */
  value: string;

  /** 필터 타입 */
  type: "region" | "popup" | "exhibition" | "price" | "amenity";

  /** X 버튼 표시 여부 (기본: true) */
  showRemoveButton?: boolean;
}

interface SelectedFilterPillsProps {
  /** 선택된 필터 목록 */
  filters: DisplayFilter[];

  /** 필터 제거 핸들러 */
  onRemove: (filterId: string) => void;

  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 선택된 필터 Pills 컴포넌트
 *
 * @example
 * ```tsx
 * <SelectedFilterPills
 *   filters={[
 *     { id: "region-1", displayLabel: "지역", value: "부산", type: "region" },
 *     { id: "popup-1", displayLabel: "팝업", value: "뷰티", type: "popup" },
 *   ]}
 *   onRemove={handleRemove}
 * />
 * ```
 */
export function SelectedFilterPills({
  filters,
  onRemove,
  className,
}: SelectedFilterPillsProps) {
  // 필터가 없으면 아무것도 렌더링하지 않음
  if (filters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex items-center flex-wrap gap-2", className)}
      role="list"
      aria-label="선택된 필터 목록"
    >
      {filters.map((filter) => (
        <FilterPill
          key={filter.id}
          displayLabel={filter.displayLabel}
          value={filter.value}
          onRemove={() => onRemove(filter.id)}
          showRemoveButton={filter.showRemoveButton ?? true}
        />
      ))}
    </div>
  );
}
