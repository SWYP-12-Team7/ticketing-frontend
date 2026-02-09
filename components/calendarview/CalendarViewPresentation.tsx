/**
 * CalendarView Presentation 컴포넌트
 *
 * - UI 렌더링만 담당 (비즈니스 로직 없음)
 * - Props로 모든 데이터와 핸들러 수신
 * - 테스트 용이성 향상
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { IsoDate } from "@/types/calendar";
import type { CalendarQueryState } from "./hooks/useCalendarQueryState";
import type { CalendarGridData } from "./hooks/useCalendarGridData";
import type { EventSortOption } from "@/types/event";
import { CALENDAR_DESIGN_TOKENS } from "./constants/calendar.design-tokens";
import { CalendarMonthNav } from "./CalendarMonthNav";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarToolbar } from "./CalendarToolbar";
import { HotEventSection, EventSortSelector } from "./HotEventSection";
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
import { convertLocationFilterToAPIParams } from "@/utils/filterConverter";

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
   * Pill 클릭 상태 (전시/팝업 다중 선택 지원)
   */
  const [selectedPillCategories, setSelectedPillCategories] = useState<
    Set<"exhibition" | "popup">
  >(new Set());

  /**
   * 필터 사이드바 상태
   */
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterClosing, setIsFilterClosing] = useState(false);
  const [isFilterEntered, setIsFilterEntered] = useState(false);
  const [locationFilterState, setLocationFilterState] =
    useState<LocationEventFilterState>(INITIAL_FILTER_STATE);

  /** 필터 열림 시 enter 애니메이션 (다음 프레임에 visible 적용) */
  useEffect(() => {
    if (isFilterOpen && !isFilterClosing) {
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsFilterEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isFilterOpen, isFilterClosing]);

  /** 필터 닫기 핸들러 - exit 애니메이션 후 언마운트 */
  const handleCloseFilter = () => {
    setIsFilterClosing(true);
    setTimeout(() => {
      setIsFilterOpen(false);
      setIsFilterClosing(false);
    }, 300);
  };

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
    handleCloseFilter(); // 필터 적용 시 사이드바 닫기
  };

  /**
   * 필터 상태를 API 파라미터로 변환
   * - useMemo로 성능 최적화
   * - HotEventSection과 캘린더 그리드에서 사용
   */
  const apiFilterParams = useMemo(
    () => convertLocationFilterToAPIParams(locationFilterState),
    [locationFilterState]
  );

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
      title = "탐색 결과";
    }

    return { events: filteredEvents, title };
  }, [selectedDate, activeCategories]);

  /**
   * 페이지 최소 높이 동적 계산
   * - 이벤트 개수에 따라 HOT EVENT 그리드 높이 자동 조정
   * - Flexbox 레이아웃으로 변경되어 계산 로직 간소화
   */
  const pageMinHeight = useMemo(() => {
    const PADDING_TOP = 64; // Header 아래 여백
    const CALENDAR_HEIGHT = 772; // 캘린더 전체 높이
    const HOT_EVENT_HEADER_MARGIN = 80; // 캘린더 → HOT EVENT 헤더 간격
    const HOT_EVENT_HEADER_HEIGHT = 31;
    const HOT_EVENT_GRID_MARGIN = 58; // 헤더 → 그리드 간격
    const CARD_HEIGHT = 490;
    const ROW_GAP = 26;
    const COLUMNS = 6;
    const BOTTOM_PADDING = 100;
    const EMPTY_STATE_HEIGHT = 400;

    const eventCount = hotEventData.events.length;

    // 기본 높이 (캘린더 + 여백)
    let totalHeight =
      PADDING_TOP +
      CALENDAR_HEIGHT +
      HOT_EVENT_HEADER_MARGIN +
      HOT_EVENT_HEADER_HEIGHT +
      HOT_EVENT_GRID_MARGIN;

    // 이벤트가 없을 때 (빈 상태)
    if (eventCount === 0) {
      totalHeight += EMPTY_STATE_HEIGHT + BOTTOM_PADDING;
      return totalHeight;
    }

    // 행 개수 계산
    const rows = Math.ceil(eventCount / COLUMNS);

    // 그리드 총 높이: 카드 × 행 + 간격 × (행-1)
    const gridHeight = rows * CARD_HEIGHT + (rows - 1) * ROW_GAP;

    // 전체 높이
    totalHeight += gridHeight + BOTTOM_PADDING;

    return totalHeight;
  }, [hotEventData.events.length]);

  return (
    <section
      aria-label="캘린더 뷰"
      className="calendar-view-section flex flex-col items-center relative"
      style={{
        width: "100%",
        minHeight: `${pageMinHeight}px`,
        paddingTop: CALENDAR_DESIGN_TOKENS.spacing.page.topFromHeader,
        paddingLeft: CALENDAR_DESIGN_TOKENS.spacing.page.left,
        paddingRight: CALENDAR_DESIGN_TOKENS.spacing.page.left,
        background: CALENDAR_DESIGN_TOKENS.colors.page.background,
      }}
    >
      {/* 캘린더 컨테이너 (필터와 독립적으로 고정) */}
      <div
        className="calendar-view-container flex flex-col"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.container.width,
          height: CALENDAR_DESIGN_TOKENS.sizing.container.height,
          gap: CALENDAR_DESIGN_TOKENS.spacing.container.gap,
          padding: "0px",
          zIndex: 10,
          flexShrink: 0,
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
          onOpenFilter={() => {
            setIsFilterEntered(false);
            setIsFilterOpen(true);
          }}
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
            selectedPillCategories={selectedPillCategories}
            onDateClick={(date) => {
              // 날짜 변경 시 pill 선택 초기화
              if (date !== selectedDate) {
                setSelectedPillCategories(new Set());
              }
              onDateClick?.(date);
            }}
            onPillClick={(date, category) => {
              // Pill 토글 (다중 선택 지원)
              setSelectedPillCategories((prev) => {
                const next = new Set(prev);
                if (next.has(category)) {
                  next.delete(category); // 이미 선택됨 → 해제
                } else {
                  next.add(category); // 선택 안 됨 → 추가
                }
                return next;
              });
              
              // 날짜도 함께 선택
              if (date !== selectedDate) {
                onDateClick?.(date);
              }
            }}
          />
        )}
      </div>

      {/* 필터바 오버레이 (조건부 렌더링) - 캘린더와 독립적으로 우측에 고정 */}
      {(isFilterOpen || isFilterClosing) && (
        <>
          {/* Dimmed 오버레이 - 배경 어둡게 처리 (헤더 포함) */}
          <div
            role="presentation"
            aria-hidden="true"
            className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ease-out ${
              isFilterEntered && !isFilterClosing ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: 76 }}
            onClick={handleCloseFilter}
          />
          {/* 필터 사이드바 - 우측에서 슬라이드 */}
          <div
            className={`filter-sidebar-wrapper fixed top-0 right-0 h-screen transition-transform duration-300 ease-out ${
              isFilterEntered && !isFilterClosing
                ? "translate-x-0"
                : "translate-x-full"
            }`}
            style={{
              width: "512px",
              paddingTop: CALENDAR_DESIGN_TOKENS.sizing.filterSidebar.topOffset,
              zIndex: 77,
            }}
          >
            <LocationEventFilterSidebar
              isOpen={isFilterOpen}
              onClose={handleCloseFilter}
              filterState={locationFilterState}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              resultCount={calculateEventCount(locationFilterState)}
            />
          </div>
        </>
      )}

      {/* HOT EVENT 헤더: 제목 + 정렬 (Figma 간격: 캘린더 하단 + 80px = top: 1011px) */}
      <div
        className="flex items-center justify-between"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.container.width,
          height: "31px",
          marginTop: "80px",
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

      {/* HOT EVENT 섹션 (Figma 간격: 헤더 하단 + 58px = top: 1069px) */}
      <div
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.container.width,
          marginTop: "58px",
        }}
      >
        <HotEventSection
          selectedDate={selectedDate}
          activeCategories={activeCategories}
          sortBy={sortBy}
          selectedCategories={selectedPillCategories}
          apiFilterParams={apiFilterParams}
          locationFilterState={locationFilterState}
        />
      </div>
    </section>
  );
}
