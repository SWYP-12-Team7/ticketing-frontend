/**
 * 선택된 필터들을 표시하는 컴포넌트
 *
 * CalendarToolbar에서 사용
 * 각 필터를 pill 형태로 표시하고 제거 가능
 */

"use client";

import React from "react";
import { FilterPill } from "./FilterPill";
import { cn } from "@/lib/utils";

export interface DisplayFilter {
  /** 고유 ID (예: "region-seoul", "popup-fashion") */
  id: string;
  /** 표시 레이블 */
  label: string;
  /** 필터 타입 */
  type: "region" | "popup" | "exhibition" | "price" | "amenity";
  /** X 버튼 표시 여부 */
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

export function SelectedFilterPills({
  filters,
  onRemove,
  className,
}: SelectedFilterPillsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex items-center flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <FilterPill
          key={filter.id}
          label={filter.label}
          onRemove={() => onRemove(filter.id)}
          showRemoveButton={filter.showRemoveButton ?? true}
        />
      ))}
    </div>
  );
}
