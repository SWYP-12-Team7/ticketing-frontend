/**
 * 이벤트 정렬 선택 드롭다운 컴포넌트
 *
 * Figma 스펙 (2026-02-04):
 * - width: 116px, height: 39px
 * - padding: 10px 20px, gap: 10px
 * - border-radius: 99999px (pill 형태)
 * - font-size: 16px, line-height: 19px
 * - 인기순, 최신순, 마감임박순, 조회순 정렬
 */

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventSortOption } from "@/types/event";

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
    <div className="event-sort-selector relative">
      <label htmlFor="event-sort" className="sr-only">
        정렬 기준 선택
      </label>
      <div className="relative">
        <select
          id="event-sort"
          value={sortBy}
          onChange={handleChange}
          className={cn(
            "event-sort-selector__select",
            "appearance-none cursor-pointer",
            "transition-opacity hover:opacity-80",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          style={{
            width: "116px",
            height: "39px",
            padding: "10px 20px",
            paddingRight: "44px", // 화살표 공간 확보
            borderRadius: "99999px",
            fontFamily: "Pretendard Variable",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "19px",
            color: "#000000",
            border: "none",
            background: "#FFFFFF",
            boxSizing: "border-box",
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 화살표 아이콘 (Vector 1) */}
        <div
          className="absolute pointer-events-none flex flex-col items-center justify-center"
          style={{
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "14px",
            height: "19px",
            gap: "10px",
          }}
        >
          <svg
            width="14"
            height="6"
            viewBox="0 0 14 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <path
              d="M1 1L7 5L13 1"
              stroke="#2D2D2D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
