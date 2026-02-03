/**
 * CalendarView Presentation 컴포넌트
 *
 * - UI 렌더링만 담당 (비즈니스 로직 없음)
 * - Props로 모든 데이터와 핸들러 수신
 * - 테스트 용이성 향상
 */

"use client";

import React, { useMemo, useState } from "react";
import type { IsoDate } from "@/types/calendar";
import type { CalendarQueryState } from "./hooks/useCalendarQueryState";
import type { CalendarGridData } from "./hooks/useCalendarGridData";
import type { EventSortOption } from "@/types/event";
import { CALENDAR_DESIGN_TOKENS } from "./constants/calendar.design-tokens";
import { CalendarMonthNav } from "./CalendarMonthNav";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarToolbar } from "./CalendarToolbar";
import { HotEventSection, EventSortSelector } from "./HotEventSection";
import { formatDateKorean } from "./utils/calendar.formatters";
import {
  generateEventsByDate,
  generatePopularEvents,
} from "@/lib/calendar-dummy-events";
import {
  LocationEventFilterSidebar,
  INITIAL_FILTER_STATE,
  type LocationEventFilterState,
} from "@/components/common/LocationEventFilter";
import {
  convertFiltersToDisplayPills,
  removeFilterFromState,
} from "@/components/common/LocationEventFilter/utils";
import { calculateEventCount } from "@/utils/filterEventCounter";

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
    regionId: _regionId,
    activeCategories,
    popupSubcategory: _popupSubcategory,
    exhibitionSubcategory: _exhibitionSubcategory,
    goToPreviousMonth,
    goToNextMonth,
    toggleCategory: _toggleCategory,
    changeRegion: _changeRegion,
    changePopupSubcategory: _changePopupSubcategory,
    changeExhibitionSubcategory: _changeExhibitionSubcategory,
    resetFilters: _resetFilters,
  } = queryState;

  const {
    monthTitle,
    visibleMonthDate,
    gridDays,
    regions: _regions,
    countsByDate,
    isLoading,
    isError,
  } = gridData;

  /**
   * 이벤트 정렬 상태
   */
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");

  /**
   * 필터 사이드바 상태
   */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationFilterState, setLocationFilterState] =
    useState<LocationEventFilterState>(INITIAL_FILTER_STATE);

  /**
   * 선택된 필터를 display pills로 변환
   */
  const selectedFilterPills = useMemo(
    () => convertFiltersToDisplayPills(locationFilterState),
    [locationFilterState]
  );

  /**
   * 필터 제거 핸들러
   */
  const handleRemoveFilter = (filterId: string) => {
    const newState = removeFilterFromState(locationFilterState, filterId);
    setLocationFilterState(newState);
  };

  /**
   * 필터 리셋 핸들러
   */
  const handleResetFilters = () => {
    setLocationFilterState(INITIAL_FILTER_STATE);
  };

  /**
   * 필터 적용 핸들러
   */
  const handleApplyFilters = (filters: LocationEventFilterState) => {
    setLocationFilterState(filters);
    // TODO: 필터 상태를 URL 쿼리 파라미터로 변환하여 적용
    console.log("Applied filters:", filters);
  };

  /**
   * HOT EVENT 이벤트 목록 계산 (제목 + 높이 계산용)
   */
  const hotEventData = useMemo(() => {
    // 카테고리 모두 체크 해제
    if (!activeCategories.exhibition && !activeCategories.popup) {
      return { events: [], title: "HOT EVENT" };
    }

    // 이벤트 목록 가져오기
    const allEvents = selectedDate
      ? generateEventsByDate(selectedDate)
      : generatePopularEvents(24);

    // 카테고리 필터링
    const filteredEvents = allEvents.filter((event) => {
      if (event.category === "전시" && !activeCategories.exhibition) {
        return false;
      }
      if (event.category === "팝업" && !activeCategories.popup) {
        return false;
      }
      return true;
    });

    // 제목 계산
    let title = "HOT EVENT";
    if (selectedDate) {
      const categoryLabel =
        activeCategories.exhibition && !activeCategories.popup
          ? "전시"
          : !activeCategories.exhibition && activeCategories.popup
            ? "팝업"
            : "이벤트";
      const dateStr = formatDateKorean(selectedDate);
      title = `${dateStr} ${categoryLabel} ${filteredEvents.length}개`;
    }

    return { events: filteredEvents, title };
  }, [selectedDate, activeCategories]);

  /**
   * 페이지 최소 높이 동적 계산
   * - 이벤트 개수에 따라 HOT EVENT 그리드 높이 자동 조정
   */
  const pageMinHeight = useMemo(() => {
    const _CALENDAR_TOP = 140;
    const _CALENDAR_HEIGHT = 791;
    const _HOT_EVENT_HEADER_TOP = 1011;
    const HOT_EVENT_GRID_TOP = 1069;
    const CARD_HEIGHT = 490;
    const ROW_GAP = 26;
    const COLUMNS = 6;
    const BOTTOM_MARGIN = 100;
    const EMPTY_STATE_HEIGHT = 400; // 빈 상태 최소 높이

    const eventCount = hotEventData.events.length;

    // 이벤트가 없을 때 (빈 상태)
    if (eventCount === 0) {
      return HOT_EVENT_GRID_TOP + EMPTY_STATE_HEIGHT + BOTTOM_MARGIN;
    }

    // 행 개수 계산
    const rows = Math.ceil(eventCount / COLUMNS);

    // 그리드 총 높이: 카드 × 행 + 간격 × (행-1)
    const gridHeight = rows * CARD_HEIGHT + (rows - 1) * ROW_GAP;

    // 전체 높이
    return HOT_EVENT_GRID_TOP + gridHeight + BOTTOM_MARGIN;
  }, [hotEventData.events.length]);

  return (
    <section
      aria-label="캘린더 뷰"
      className="calendar-view-section relative"
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.page.width,
        minHeight: `${pageMinHeight}px`,
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
          zIndex: 10,
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
          selectedFilters={selectedFilterPills}
          onRemoveFilter={handleRemoveFilter}
          onOpenFilter={() => setIsFilterOpen(true)}
          onReset={handleResetFilters}
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

      {/* HOT EVENT 헤더: 제목 + 정렬 (Figma: absolute, left: 80px, top: 1011px) */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          left: "80px",
          top: "1011px",
          width: "1278px",
          height: "31px",
          zIndex: 6,
        }}
      >
        <h2
          id="hot-event-heading"
          style={{
            fontFamily: "Pretendard Variable",
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "128%",
            letterSpacing: "-0.025em",
            color: "#111928",
          }}
        >
          {hotEventData.title}
        </h2>

        {/* 정렬 드롭다운 */}
        <EventSortSelector sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      {/* HOT EVENT 섹션 (Figma: absolute, left: 81px, top: 1069px) */}
      <HotEventSection
        selectedDate={selectedDate}
        activeCategories={activeCategories}
        sortBy={sortBy}
      />

      {/* 지역/행사 필터 사이드바 */}
      <LocationEventFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterState={locationFilterState}
        onApply={handleApplyFilters}
        resultCount={calculateEventCount(locationFilterState)}
      />
    </section>
  );
}
