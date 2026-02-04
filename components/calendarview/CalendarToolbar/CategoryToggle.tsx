/**
 * 카테고리 토글 컴포넌트
 *
 * - 체크박스로 카테고리 활성화/비활성화
 * - 접근성 고려 (label, 포커스 스타일)
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { CalendarCategory } from "@/types/calendar";
import { CALENDAR_CATEGORY_META } from "../constants/calendar.constants";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

/**
 * CategoryToggle Props
 */
interface CategoryToggleProps {
  /** 카테고리 키 */
  category: CalendarCategory;
  /** 활성화 상태 */
  isActive: boolean;
  /** 토글 핸들러 */
  onToggle: () => void;
}

/**
 * 카테고리 토글 컴포넌트
 *
 * @example
 * ```tsx
 * <CategoryToggle
 *   category="exhibition"
 *   isActive={true}
 *   onToggle={() => handleToggle('exhibition')}
 * />
 * ```
 */
export function CategoryToggle({
  category,
  isActive,
  onToggle,
}: CategoryToggleProps) {
  const meta = CALENDAR_CATEGORY_META[category];

  return (
    <label
      className={cn(
        "category-toggle inline-flex shrink-0 items-center gap-2",
        CALENDAR_DESIGN_TOKENS.borderRadius.full,
        "bg-[#FFF0E2] px-3 py-2 text-sm font-semibold",
        "cursor-pointer",
        CALENDAR_DESIGN_TOKENS.transitions.colors,
        "hover:bg-[#FFE8D1]",
        "focus-within:ring-2 focus-within:ring-black/20 focus-within:ring-offset-1"
      )}
    >
      <input
        type="checkbox"
        className={cn(
          "category-toggle__checkbox h-4 w-4",
          "cursor-pointer",
          "rounded border-gray-300",
          "text-[#FF7A00]",
          "focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-0"
        )}
        checked={isActive}
        onChange={onToggle}
        aria-label={`${meta.label} ${isActive ? "활성화됨" : "비활성화됨"}`}
      />
      <span className="category-toggle__label">{meta.label}</span>
    </label>
  );
}
