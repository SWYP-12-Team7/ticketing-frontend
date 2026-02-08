/**
 * 서브카테고리 선택 드롭다운
 *
 * Figma 스펙:
 * - 팝업/전시 서브카테고리 선택
 * - background: #FFF4EC
 * - 내부: label(주황) + dropdown(흰 배경)
 * - border-radius: 24px
 * - padding: 4px, gap: 6px
 * - height: 32px
 *
 * @remarks
 * HeaderSideBar의 메뉴 구조와 동기화된 서브카테고리 옵션 제공
 */

import React from "react";
import { cn } from "@/lib/utils";
import type {
  CalendarCategory,
  PopupSubcategory,
  ExhibitionSubcategory,
} from "@/types/calendar";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import {
  POPUP_SUBCATEGORY_OPTIONS,
  EXHIBITION_SUBCATEGORY_OPTIONS,
} from "../constants/calendar.subcategories";

interface SubcategorySelectorProps {
  /** 카테고리 (팝업/전시) */
  category: CalendarCategory;
  /** 현재 선택된 서브카테고리 */
  selectedSubcategory: PopupSubcategory | ExhibitionSubcategory;
  /** 서브카테고리 변경 핸들러 */
  onSubcategoryChange: (
    subcategory: PopupSubcategory | ExhibitionSubcategory
  ) => void;
  /** 활성화 상태 (카테고리가 선택되었을 때만 활성화) */
  isEnabled: boolean;
}

/**
 * 서브카테고리 선택 드롭다운
 *
 * @example
 * ```tsx
 * <SubcategorySelector
 *   category="popup"
 *   selectedSubcategory="beauty"
 *   onSubcategoryChange={handleChange}
 *   isEnabled={true}
 * />
 * ```
 */
export function SubcategorySelector({
  category,
  selectedSubcategory,
  onSubcategoryChange,
  isEnabled,
}: SubcategorySelectorProps) {
  const options =
    category === "popup"
      ? POPUP_SUBCATEGORY_OPTIONS
      : EXHIBITION_SUBCATEGORY_OPTIONS;

  const label = category === "popup" ? "팝업" : "전시";

  const _selectedOption = options.find(
    (opt) => opt.value === selectedSubcategory
  );

  return (
    <div
      className={cn(
        "subcategory-selector",
        "flex items-center gap-[6px] p-1 rounded-[24px]",
        !isEnabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        backgroundColor: CALENDAR_DESIGN_TOKENS.colors.filter.background,
        height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterItemHeight,
      }}
    >
      {/* 레이블 (주황색) */}
      <div
        className={cn(
          "subcategory-selector__label",
          "flex items-center justify-center px-[6px] py-1 rounded-[24px] h-[30px]"
        )}
        style={{
          backgroundColor: CALENDAR_DESIGN_TOKENS.colors.filter.background,
          fontFamily: CALENDAR_DESIGN_TOKENS.fonts.filter.family,
          fontSize: CALENDAR_DESIGN_TOKENS.fonts.filter.size,
          fontWeight: CALENDAR_DESIGN_TOKENS.fonts.filter.weight,
          lineHeight: CALENDAR_DESIGN_TOKENS.fonts.filter.lineHeight,
          color: CALENDAR_DESIGN_TOKENS.colors.filter.labelText,
        }}
      >
        {label}
      </div>

      {/* 드롭다운 */}
      <div
        className={cn(
          "subcategory-selector__dropdown",
          "flex items-center justify-center px-[10px] py-[2px] rounded-[24px] h-[26px]"
        )}
        style={{
          backgroundColor: CALENDAR_DESIGN_TOKENS.colors.filter.valueBackground,
        }}
      >
        <select
          className={cn(
            "subcategory-selector__select",
            "bg-transparent outline-none cursor-pointer min-w-0"
          )}
          style={{
            fontFamily: CALENDAR_DESIGN_TOKENS.fonts.filter.family,
            fontSize: CALENDAR_DESIGN_TOKENS.fonts.filter.size,
            fontWeight: CALENDAR_DESIGN_TOKENS.fonts.filter.weight,
            lineHeight: CALENDAR_DESIGN_TOKENS.fonts.filter.lineHeight,
            color: CALENDAR_DESIGN_TOKENS.colors.filter.valueText,
          }}
          value={selectedSubcategory}
          onChange={(e) =>
            onSubcategoryChange(
              e.target.value as PopupSubcategory | ExhibitionSubcategory
            )
          }
          disabled={!isEnabled}
          aria-label={`${label} 서브카테고리 선택`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
