/**
 * 캘린더 필터바 컴포넌트
 *
 * Figma 스펙 완전 반영:
 * - 필터 아이콘 (24px)
 * - 지역 선택 드롭다운
 * - 팝업 서브카테고리 드롭다운
 * - 전시 서브카테고리 드롭다운
 * - 리셋 버튼 (40px, rounded-22px)
 * - height: 60px
 * - padding: 8px 10px
 * - gap: 11px
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import Image from "next/image";
import type {
  CalendarRegion,
  CalendarFilterState,
  PopupSubcategory,
  ExhibitionSubcategory,
} from "@/types/calendar";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import { RegionSelector } from "./RegionSelector";
import { SubcategorySelector } from "./SubcategorySelector";

/**
 * CalendarToolbar Props
 */
type CalendarToolbarProps = Readonly<{
  /** 지역 목록 */
  regions: readonly CalendarRegion[];
  /** 필터 상태 */
  filterState: CalendarFilterState;
  /** 지역 변경 핸들러 */
  onChangeRegion: (regionId: string) => void;
  /** 팝업 서브카테고리 변경 핸들러 */
  onChangePopupSubcategory: (subcategory: PopupSubcategory) => void;
  /** 전시 서브카테고리 변경 핸들러 */
  onChangeExhibitionSubcategory: (subcategory: ExhibitionSubcategory) => void;
  /** 팝업 활성화/비활성화 핸들러 */
  onTogglePopup: () => void;
  /** 전시 활성화/비활성화 핸들러 */
  onToggleExhibition: () => void;
  /** 필터 초기화 핸들러 */
  onReset: () => void;
  /** 필터 사이드바 열기 핸들러 */
  onOpenFilter: () => void;
}>;

/**
 * 캘린더 필터바 컴포넌트
 *
 * @example
 * ```tsx
 * <CalendarToolbar
 *   regions={regions}
 *   filterState={filterState}
 *   onChangeRegion={handleRegionChange}
 *   onChangePopupSubcategory={handlePopupSubcategoryChange}
 *   onChangeExhibitionSubcategory={handleExhibitionSubcategoryChange}
 *   onTogglePopup={handleTogglePopup}
 *   onToggleExhibition={handleToggleExhibition}
 *   onReset={handleReset}
 * />
 * ```
 */
export function CalendarToolbar({
  regions,
  filterState,
  onChangeRegion,
  onChangePopupSubcategory,
  onChangeExhibitionSubcategory,
  onTogglePopup,
  onToggleExhibition,
  onReset,
  onOpenFilter,
}: CalendarToolbarProps) {
  return (
    <header
      className={cn(
        "calendar-toolbar__container flex w-full items-center rounded-[12px]"
      )}
      style={{
        height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.height,
        padding: CALENDAR_DESIGN_TOKENS.spacing.toolbar.padding,
        gap: CALENDAR_DESIGN_TOKENS.spacing.toolbar.gap,
      }}
    >
      {/* 필터 아이콘 */}
      <button
        type="button"
        onClick={onOpenFilter}
        className="calendar-toolbar__icon flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterIconSize,
          height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterIconSize,
        }}
        aria-label="필터 열기"
        title="필터 열기"
      >
        <Image
          src="/images/searchResult/IC_Fillter.svg"
          alt=""
          width={24}
          height={24}
        />
      </button>

      {/* 필터 아이템들 */}
      <div className="calendar-toolbar__filters flex items-center gap-[10px] flex-1">
        {/* 지역 선택 드롭다운 */}
        <RegionSelector
          regions={regions}
          selectedRegionId={filterState.region}
          onRegionChange={onChangeRegion}
        />

        {/* 팝업 서브카테고리 선택 */}
        <SubcategorySelector
          category="popup"
          selectedSubcategory={filterState.popup.subcategory}
          onSubcategoryChange={(sub) =>
            onChangePopupSubcategory(sub as PopupSubcategory)
          }
          isEnabled={filterState.popup.enabled}
        />

        {/* 전시 서브카테고리 선택 */}
        <SubcategorySelector
          category="exhibition"
          selectedSubcategory={filterState.exhibition.subcategory}
          onSubcategoryChange={(sub) =>
            onChangeExhibitionSubcategory(sub as ExhibitionSubcategory)
          }
          isEnabled={filterState.exhibition.enabled}
        />
      </div>

      {/* 리셋 버튼 */}
      <button
        type="button"
        onClick={onReset}
        className={cn(
          "calendar-toolbar__reset-button",
          "flex items-center justify-center shrink-0",
          "hover:opacity-80 active:scale-95",
          "transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        )}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.reset,
        }}
        aria-label="필터 초기화"
        title="필터 초기화"
      >
        <RotateCcw
          className="shrink-0"
          style={{
            width: "20px",
            height: "20px",
            color: CALENDAR_DESIGN_TOKENS.colors.filter.icon,
            strokeWidth: CALENDAR_DESIGN_TOKENS.borders.arrow,
          }}
          aria-hidden="true"
        />
      </button>
    </header>
  );
}
