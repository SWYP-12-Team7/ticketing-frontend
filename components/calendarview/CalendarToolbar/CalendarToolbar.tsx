/**
 * 캘린더 필터 툴바 컴포넌트 (새로운 스펙)
 *
 * Figma 스펙 (2026-02-16):
 * - 고정 6개 버튼: [초기화] [지역] [팝업스토어] [전시] [행사진행] [필터 아이콘]
 * - 상태에 따른 색상 변경 (활성화/비활성화)
 * - 읽기 전용 표시 (필터 사이드바에서 선택된 상태만 표시)
 *
 * @example
 * ```tsx
 * <CalendarToolbar
 *   locationFilterState={locationFilterState}
 *   onOpenFilter={() => setIsFilterOpen(true)}
 *   onReset={handleResetFilters}
 * />
 * ```
 */

"use client";

import { useMemo } from "react";
import Image from "next/image";
import type { LocationEventFilterState } from "@/components/common/LocationEventFilter";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";
import { FilterStatusButton } from "./FilterStatusButton";
import { ResetButton } from "./ResetButton";

/**
 * CalendarToolbar Props
 */
interface CalendarToolbarProps {
  /** 필터 상태 */
  locationFilterState: LocationEventFilterState;

  /** 필터 사이드바 열기 핸들러 */
  onOpenFilter: () => void;

  /** 필터 초기화 핸들러 */
  onReset: () => void;
}

/**
 * 캘린더 필터 툴바 컴포넌트
 *
 * - 고정 6개 버튼 표시
 * - 필터 상태에 따라 버튼 색상 자동 변경
 * - 성능 최적화: useMemo로 상태 계산
 */
export function CalendarToolbar({
  locationFilterState,
  onOpenFilter,
  onReset,
}: CalendarToolbarProps) {
  const tokens = CALENDAR_DESIGN_TOKENS.filterToolbar;

  /**
   * 지역 필터 활성화 여부
   * - "all" 포함 또는 빈 배열 → 비활성화
   * - 특정 지역 선택 → 활성화
   */
  const isRegionActive = useMemo(
    () =>
      !locationFilterState.regions.includes("all") &&
      locationFilterState.regions.length > 0,
    [locationFilterState.regions]
  );

  /**
   * 팝업스토어 필터 활성화 여부
   */
  const isPopupActive = useMemo(
    () =>
      !locationFilterState.popupCategories.includes("all") &&
      locationFilterState.popupCategories.length > 0,
    [locationFilterState.popupCategories]
  );

  /**
   * 전시 필터 활성화 여부
   */
  const isExhibitionActive = useMemo(
    () =>
      !locationFilterState.exhibitionCategories.includes("all") &&
      locationFilterState.exhibitionCategories.length > 0,
    [locationFilterState.exhibitionCategories]
  );

  /**
   * 행사진행 필터 활성화 여부
   * - "전체"가 아닌 다른 상태가 선택되면 활성화
   */
  const isStatusActive = useMemo(
    () =>
      locationFilterState.eventStatus.ongoing ||
      locationFilterState.eventStatus.upcoming ||
      locationFilterState.eventStatus.ended,
    [locationFilterState.eventStatus]
  );

  /**
   * 모든 필터가 "전체" 상태인지 확인
   * 
   * "전체" 상태의 정의 (INITIAL_FILTER_STATE와 동일):
   * - 지역: ["all"]
   * - 팝업: ["all"]
   * - 전시: ["all"]
   * - 가격: 선택 없음 (free: false, paid: false)
   * - 편의: 선택 없음 (parking: false, petFriendly: false)
   * - 기간: 선택 없음 (null)
   * - 상태: 선택 없음 (ongoing/upcoming/ended 모두 false)
   * 
   * 모든 필터가 "전체"일 때 → 필터 버튼들 숨김
   * 하나라도 "전체"가 아닐 때 → 필터 버튼들 표시
   */
  const isAllFiltersDefault = useMemo(() => {
    const state = locationFilterState;
    
    return (
      // 지역: ["all"]만 있어야 함
      state.regions.length === 1 &&
      state.regions[0] === "all" &&
      
      // 팝업: ["all"]만 있어야 함
      state.popupCategories.length === 1 &&
      state.popupCategories[0] === "all" &&
      
      // 전시: ["all"]만 있어야 함
      state.exhibitionCategories.length === 1 &&
      state.exhibitionCategories[0] === "all" &&
      
      // 가격: 선택 없음
      !state.price.free &&
      !state.price.paid &&
      
      // 편의사항: 선택 없음
      !state.amenities.parking &&
      !state.amenities.petFriendly &&
      
      // 기간: 선택 없음
      !state.dateRange.startDate &&
      !state.dateRange.endDate &&
      
      // 행사진행: 선택 없음
      !state.eventStatus.ongoing &&
      !state.eventStatus.upcoming &&
      !state.eventStatus.ended
    );
  }, [locationFilterState]);

  return (
    <header
      className="calendar-toolbar flex items-center justify-between"
      style={{
        width: CALENDAR_DESIGN_TOKENS.sizing.toolbar.width,
        height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.height,
        padding: CALENDAR_DESIGN_TOKENS.spacing.toolbar.padding,
      }}
      role="toolbar"
      aria-label="캘린더 필터 툴바"
    >
      {/* 좌측: 고정 버튼들 - 모든 필터가 "전체" 상태일 때는 숨김 */}
      {!isAllFiltersDefault && (
        <div
          className="calendar-toolbar__buttons flex items-center"
          style={{ gap: tokens.container.gap }}
        >
          {/* 초기화 버튼 */}
          <ResetButton onReset={onReset} />

          {/* 지역 필터 상태 */}
          <FilterStatusButton label="지역" isActive={isRegionActive} />

          {/* 팝업스토어 필터 상태 */}
          <FilterStatusButton label="팝업스토어" isActive={isPopupActive} />

          {/* 전시 필터 상태 */}
          <FilterStatusButton label="전시" isActive={isExhibitionActive} />

          {/* 행사진행 필터 상태 */}
          <FilterStatusButton label="행사진행" isActive={isStatusActive} />
        </div>
      )}

      {/* 우측: 필터 아이콘 - ml-auto로 항상 오른쪽 고정 */}
      <button
        type="button"
        onClick={onOpenFilter}
        className="calendar-toolbar__filter-icon flex items-center justify-center shrink-0 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ml-auto"
        style={{
          width: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterIconSize,
          height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterIconSize,
        }}
        aria-label="필터 사이드바 열기"
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
