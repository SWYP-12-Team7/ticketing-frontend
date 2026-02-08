/**
 * 선택된 필터들을 표시하는 컴포넌트 (그룹화 지원)
 *
 * CalendarToolbar에서 사용
 * 각 필터를 그룹화된 pill 형태로 표시하고 제거 가능
 *
 * Figma 스펙 (2026-02-04):
 * - single row scrollable: 가로 스크롤 지원
 * - gap: 8px, height: 32px
 * - flex-wrap: nowrap (줄바꿈 금지)
 * - overflow-x: auto (가로 스크롤)
 * - 그룹화: [지역 울산 부산] [팝업 뷰티] [전시 설치미술]
 */

"use client";

import React from "react";
import { FilterPill } from "./FilterPill";
import { cn } from "@/lib/utils";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import type { DisplayFilter } from "@/components/common/LocationEventFilter/utils";

export type { DisplayFilter };

interface SelectedFilterPillsProps {
  /** 선택된 필터 목록 */
  filters: DisplayFilter[];

  /** 필터 제거 핸들러 */
  onRemove: (filterId: string) => void;

  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 선택된 필터 Pills 컴포넌트 (그룹화 지원)
 *
 * @example
 * ```tsx
 * <SelectedFilterPills
 *   filters={[
 *     { id: "region-group", displayLabel: "지역", values: ["울산", "부산"], type: "region" },
 *     { id: "popup-group", displayLabel: "팝업", values: ["뷰티"], type: "popup" },
 *     { id: "all", displayLabel: "전체", values: [], type: "all" },
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
  const tokens = CALENDAR_DESIGN_TOKENS.filterPill.scrollContainer;

  return (
    <div
      className={cn(
        "flex items-start overflow-x-auto",
        // 스크롤바 스타일링 (선택사항)
        "[&::-webkit-scrollbar]:h-1",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-gray-300",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:hover:bg-gray-400",
        className
      )}
      style={{
        gap: tokens.gap,
        height: tokens.height,
        flexWrap: "nowrap", // 줄바꿈 금지
        flexShrink: 1, // 줄어들 수 있음
        minWidth: 0, // flex 아이템이 줄어들 수 있게 함
      }}
      role="list"
      aria-label="선택된 필터 목록"
    >
      {filters.length === 0 ? (
        // 빈 상태: 레이아웃 유지를 위한 투명 플레이스홀더
        <div
          style={{ width: "1px", height: tokens.height, visibility: "hidden" }}
          aria-hidden="true"
        />
      ) : (
        filters.map((filter) => (
          <FilterPill
            key={filter.id}
            displayLabel={filter.displayLabel}
            values={filter.values}
            onRemove={() => onRemove(filter.id)}
            showRemoveButton={filter.showRemoveButton ?? true}
          />
        ))
      )}
    </div>
  );
}
