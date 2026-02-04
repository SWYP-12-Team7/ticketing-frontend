/**
 * 이벤트 정렬 선택 드롭다운 컴포넌트
 *
 * - 인기순, 최신순, 마감임박순, 조회순 정렬
 * - 접근성 고려 (label, aria-label)
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { EventSortOption } from "@/types/event";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

/**
 * 정렬 옵션 설정
 */
const SORT_OPTIONS: readonly {
  value: EventSortOption;
  label: string;
}[] = [
  { value: "popular", label: "인기순" },
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감임박순" },
  { value: "views", label: "조회순" },
] as const;

/**
 * EventSortSelector Props
 */
interface EventSortSelectorProps {
  /** 현재 선택된 정렬 옵션 */
  sortBy: EventSortOption;
  /** 정렬 변경 핸들러 */
  onSortChange: (sortBy: EventSortOption) => void;
}

/**
 * 이벤트 정렬 선택 드롭다운
 *
 * @example
 * ```tsx
 * <EventSortSelector
 *   sortBy="popular"
 *   onSortChange={setSortBy}
 * />
 * ```
 */
export function EventSortSelector({
  sortBy,
  onSortChange,
}: EventSortSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as EventSortOption);
  };

  return (
    <div className="event-sort-selector">
      <label htmlFor="event-sort" className="sr-only">
        정렬 기준 선택
      </label>
      <select
        id="event-sort"
        value={sortBy}
        onChange={handleChange}
        className={cn(
          "event-sort-selector__select",
          CALENDAR_DESIGN_TOKENS.borderRadius.small,
          "border border-border bg-background",
          "px-4 py-2 text-sm font-medium text-foreground",
          CALENDAR_DESIGN_TOKENS.transitions.colors,
          "hover:bg-muted",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "cursor-pointer"
        )}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
