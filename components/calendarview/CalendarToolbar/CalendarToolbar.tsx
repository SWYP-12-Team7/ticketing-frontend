/**
 * 캘린더 필터바 컴포넌트
 *
 * Figma 스펙 완전 반영 (2026-02-04):
 * - width: 1278px, height: 60px
 * - padding: 8px 10px, gap: 11px, border-radius: 12px
 * - 레이아웃: Pills (좌측, flex-grow: 1) → 리셋 버튼 (우측) → 필터 아이콘 (우측)
 * - Pills 영역: 가로 스크롤 지원
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
  // 필터가 있는지 체크 (초기화 버튼 활성화 여부)
  const hasFilters = selectedFilters.length > 0;
  const resetStyle = hasFilters 
    ? CALENDAR_DESIGN_TOKENS.filterPill.reset.enabled
    : CALENDAR_DESIGN_TOKENS.filterPill.reset.disabled;

  return (
    <header
      className={cn(
        "calendar-toolbar__container flex items-center"
      )}
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.toolbar.width,
        height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.height,
        padding: CALENDAR_DESIGN_TOKENS.spacing.toolbar.padding,
        gap: CALENDAR_DESIGN_TOKENS.spacing.toolbar.gap,
      }}
    >
      {/* single row scrollable - Pills 컨테이너 (flex-grow: 1, align-items: flex-start) */}
      <div
        className="calendar-toolbar__pills-wrapper grow flex items-start"
        style={{
          minWidth: 0, // flex 아이템이 줄어들 수 있게 함
          flexShrink: 1,
        }}
      >
        <SelectedFilterPills
          filters={selectedFilters}
          onRemove={onRemoveFilter}
          onFilterClick={onOpenFilter}
        />
      </div>

      {/* 리셋 버튼 (order: 1, 우측 고정) - Figma 스펙: 비활성화/활성화 상태 */}
      <button
        type="button"
        onClick={onReset}
        disabled={!hasFilters}
        className={cn(
          "calendar-toolbar__reset-button",
          "flex items-center justify-center shrink-0",
          "transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
          hasFilters ? "hover:opacity-80 active:scale-95 cursor-pointer" : "cursor-not-allowed"
        )}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: CALENDAR_DESIGN_TOKENS.borderRadius.reset,
          background: resetStyle.background,
          border: resetStyle.border,
        }}
        aria-label="필터 초기화"
        title={hasFilters ? "필터 초기화" : "선택된 필터가 없습니다"}
      >
        <RotateCcw
          className="shrink-0"
          style={{
            width: "24px",
            height: "24px",
            color: resetStyle.iconColor,
            strokeWidth: CALENDAR_DESIGN_TOKENS.borders.arrow,
          }}
          aria-hidden="true"
        />
      </button>

      {/* 필터 아이콘 (order: 2, 우측 고정) */}
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
    </header>
  );
}
