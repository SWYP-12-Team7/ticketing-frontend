/**
 * 캘린더 필터바 컴포넌트
 *
 * Figma 스펙 완전 반영:
 * - 필터 아이콘 (24px, 클릭 시 사이드바 열기)
 * - 선택된 필터 pills 표시 (주황색, X 버튼으로 제거)
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
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import { SelectedFilterPills, type DisplayFilter } from "./SelectedFilterPills";

/**
 * CalendarToolbar Props
 */
type CalendarToolbarProps = Readonly<{
  /** 선택된 필터 pills */
  selectedFilters: DisplayFilter[];
  /** 필터 제거 핸들러 */
  onRemoveFilter: (filterId: string) => void;
  /** 필터 사이드바 열기 핸들러 */
  onOpenFilter: () => void;
  /** 필터 초기화 핸들러 */
  onReset: () => void;
}>;

/**
 * 캘린더 필터바 컴포넌트
 *
 * @example
 * ```tsx
 * <CalendarToolbar
 *   selectedFilters={selectedFilterPills}
 *   onRemoveFilter={handleRemoveFilter}
 *   onOpenFilter={() => setIsFilterOpen(true)}
 *   onReset={handleResetFilters}
 * />
 * ```
 */
export function CalendarToolbar({
  selectedFilters,
  onRemoveFilter,
  onOpenFilter,
  onReset,
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

      {/* 선택된 필터 pills */}
      <SelectedFilterPills
        filters={selectedFilters}
        onRemove={onRemoveFilter}
      />

      {/* 리셋 버튼 (항상 우측 고정) */}
      <button
        type="button"
        onClick={onReset}
        className={cn(
          "calendar-toolbar__reset-button",
          "flex items-center justify-center shrink-0 ml-auto",
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
