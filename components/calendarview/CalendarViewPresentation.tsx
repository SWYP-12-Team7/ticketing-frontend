/**
 * CalendarView Presentation 컴포넌트
 *
 * - UI 렌더링만 담당 (비즈니스 로직 없음)
 * - Props로 모든 데이터와 핸들러 수신
 * - 테스트 용이성 향상
 */

"use client";

import React from "react";
import type { IsoDate } from "@/types/calendar";
import type { CalendarQueryState } from "./hooks/useCalendarQueryState";
import type { CalendarGridData } from "./hooks/useCalendarGridData";
import { CALENDAR_DESIGN_TOKENS } from "./constants/calendar.design-tokens";
import { CalendarMonthNav } from "./CalendarMonthNav";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarToolbar } from "./CalendarToolbar";

/**
 * CalendarViewPresentation Props
 */
interface CalendarViewPresentationProps {
  /** 쿼리 상태 및 액션 함수 */
  queryState: CalendarQueryState;
  /** 그리드 데이터 및 상태 */
  gridData: CalendarGridData;
  /** 선택된 날짜 */
  selectedDate?: IsoDate | null;
  /** 날짜 클릭 핸들러 */
  onDateClick?: (date: IsoDate) => void;
}

/**
 * CalendarView Presentation 컴포넌트
 *
 * Figma 스펙:
 * - 페이지: 1440px, left: 80px, top: 140px
 * - 캘린더: 1280px × 791px, flex-column, gap: 10px
 * - Order: MonthNav → Toolbar → Grid
 */
export function CalendarViewPresentation({
  queryState,
  gridData,
  selectedDate,
  onDateClick,
}: CalendarViewPresentationProps) {
  const {
    regionId,
    activeCategories,
    popupSubcategory,
    exhibitionSubcategory,
    goToPreviousMonth,
    goToNextMonth,
    toggleCategory,
    changeRegion,
    changePopupSubcategory,
    changeExhibitionSubcategory,
    resetFilters,
  } = queryState;

  const {
    monthTitle,
    visibleMonthDate,
    gridDays,
    regions,
    countsByDate,
    isLoading,
    isError,
  } = gridData;

  return (
    <section
      aria-label="캘린더 뷰"
      className="calendar-view-section relative"
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.page.width,
        background: CALENDAR_DESIGN_TOKENS.colors.page.background,
      }}
    >
      {/* 캘린더 컨테이너 (left: 80px, top: 140px) */}
      <div
        className="calendar-view-container absolute flex flex-col"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.container.width,
          height: CALENDAR_DESIGN_TOKENS.sizing.container.height,
          left: CALENDAR_DESIGN_TOKENS.spacing.page.left,
          top: CALENDAR_DESIGN_TOKENS.spacing.page.topFromHeader,
          gap: CALENDAR_DESIGN_TOKENS.spacing.container.gap,
          padding: "0px",
        }}
      >
        {/* Order 0: 월 네비게이션 */}
        <CalendarMonthNav
          title={monthTitle}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        {/* Order 1: 필터바 */}
        <CalendarToolbar
          regions={regions}
          filterState={{
            region: regionId,
            popup: {
              enabled: activeCategories.popup,
              subcategory: popupSubcategory,
            },
            exhibition: {
              enabled: activeCategories.exhibition,
              subcategory: exhibitionSubcategory,
            },
          }}
          onChangeRegion={changeRegion}
          onChangePopupSubcategory={changePopupSubcategory}
          onChangeExhibitionSubcategory={changeExhibitionSubcategory}
          onTogglePopup={() => toggleCategory("popup")}
          onToggleExhibition={() => toggleCategory("exhibition")}
          onReset={resetFilters}
        />

        {/* Order 2: 캘린더 그리드 */}
        {(isError || isLoading) && (
          <div className="calendar-view-status p-4 rounded-lg bg-white text-sm">
            {isLoading && <p>캘린더 데이터를 불러오는 중…</p>}
            {isError && (
              <p className="text-red-500">데이터를 불러오지 못했습니다.</p>
            )}
          </div>
        )}

        {!isLoading && !isError && (
          <CalendarGrid
            visibleMonthDate={visibleMonthDate}
            gridDays={gridDays}
            activeCategories={activeCategories}
            countsByDate={countsByDate}
            selectedDate={selectedDate}
            selectedEvent={null}
            onDateClick={onDateClick}
            onPillClick={(date, category) => {
              console.log("Pill clicked:", date, category);
            }}
          />
        )}
      </div>

      {/* HOT EVENT 섹션 (나중에 연결) */}
      {/* <HotEventSection ... /> */}
    </section>
  );
}
