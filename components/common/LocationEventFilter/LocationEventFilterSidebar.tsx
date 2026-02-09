/**
 * 지역/행사 필터 사이드바 (2026-02-10 Figma 스펙)
 *
 * 캘린더뷰와 지도뷰에서 사용 가능
 *
 * Features:
 * - 지역 선택 (다중 선택 pill 버튼)
 * - 카테고리 선택 - 팝업스토어 (다중 선택 pill)
 * - 카테고리 선택 - 전시 (다중 선택 pill)
 * - 기간 선택 (캘린더 위젯)
 * - 행사 진행 상태 (체크박스 18px)
 * - 가격 필터 (무료/유료 체크박스)
 * - 편의사항 필터 (주차가능/반려견 동반 체크박스)
 * - 선택된 항목 표시 (작은 chip with X)
 *
 * Figma 스펙 (2026-02-10):
 * - Width: 512px
 * - Height: 1492px (선택 시) / 1372px (기본)
 * - Padding: 24px 80px 32px 32px
 * - 내부 컨테이너: 378px × 1268px
 * - Border-radius: 12px 16px 16px 12px
 * - Box-shadow: -6px 0px 25px rgba(0, 0, 0, 0.1)
 * - Scrollbar: 6px width, #F7F7F7 track, #D3D5DC thumb
 * - 버튼: 초기화 (비활성 회색) + N개 행사 검색 (오렌지)
 *
 * @example
 * ```tsx
 * // 캘린더뷰에서 사용
 * <LocationEventFilterSidebar
 *   isOpen={isFilterOpen}
 *   onClose={() => setIsFilterOpen(false)}
 *   filterState={filterState}
 *   onApply={handleApplyFilters}
 *   onReset={handleResetFilters}
 *   resultCount={eventCount}
 * />
 * ```
 */

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionSection } from "./AccordionSection";
import { PillButtonGroup } from "./PillButtonGroup";
import { CheckboxGroup } from "./CheckboxGroup";
import { DateRangeCalendar } from "./DateRangeCalendar";
import { EventStatusCheckboxGroup } from "./EventStatusCheckboxGroup";
import { SelectedItemChip } from "./SelectedItemChip";
import type { LocationEventFilterState } from "./types";
import {
  REGIONS,
  POPUP_CATEGORIES,
  EXHIBITION_CATEGORIES,
  PRICE_OPTIONS,
  AMENITY_OPTIONS,
  EVENT_STATUS_OPTIONS,
  INITIAL_FILTER_STATE,
} from "./constants";
import { calculateEventCount } from "@/utils/filterEventCounter";

interface LocationEventFilterSidebarProps {
  /** 사이드바 열림 상태 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /** 현재 필터 상태 */
  filterState: LocationEventFilterState;
  /** 필터 적용 핸들러 */
  onApply: (filters: LocationEventFilterState) => void;
  /** 필터 초기화 핸들러 */
  onReset: () => void;
  /** 검색 결과 개수 */
  resultCount: number;
}

export function LocationEventFilterSidebar({
  isOpen,
  onClose,
  filterState,
  onApply,
  onReset,
  resultCount,
}: LocationEventFilterSidebarProps) {
  // 로컬 필터 상태 (적용 전까지 임시 저장)
  const [localFilters, setLocalFilters] =
    useState<LocationEventFilterState>(filterState);

  // 실시간 이벤트 개수
  const [calculatedCount, setCalculatedCount] = useState(resultCount);

  // filterState가 변경되면 로컬 상태 동기화
  useEffect(() => {
    setLocalFilters(filterState);
  }, [filterState]);

  // 필터 변경 시 실시간 개수 계산
  useEffect(() => {
    const count = calculateEventCount(localFilters);
    setCalculatedCount(count);
  }, [localFilters]);

  // Accordion 확장 상태
  const [expandedSections, setExpandedSections] = useState({
    region: true,
    category: true,
    period: true,
    eventStatus: true,
    price: true,
    amenity: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // 지역 변경
  const handleRegionsChange = (regions: string[]) => {
    setLocalFilters((prev) => ({ ...prev, regions }));
  };

  // 팝업 카테고리 변경
  const handlePopupCategoriesChange = (popupCategories: string[]) => {
    setLocalFilters((prev) => ({ ...prev, popupCategories }));
  };

  // 전시 카테고리 변경
  const handleExhibitionCategoriesChange = (exhibitionCategories: string[]) => {
    setLocalFilters((prev) => ({ ...prev, exhibitionCategories }));
  };

  // 기간 변경
  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setLocalFilters((prev) => ({
      ...prev,
      dateRange: { startDate, endDate },
    }));
  };

  // 행사 진행 상태 변경
  const handleEventStatusChange = (id: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      eventStatus: {
        ...prev.eventStatus,
        [id]: checked,
      },
    }));
  };

  // 가격 체크박스 변경
  const handlePriceChange = (id: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [id]: checked,
      },
    }));
  };

  // 편의사항 체크박스 변경
  const handleAmenityChange = (id: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [id]: checked,
      },
    }));
  };

  // 선택된 항목 chip 목록 생성
  const selectedItems = useMemo(() => {
    const items: Array<{ id: string; label: string; category: string }> = [];

    // 지역
    if (!localFilters.regions.includes("all")) {
      localFilters.regions.forEach((regionId) => {
        const region = REGIONS.find((r) => r.id === regionId);
        if (region) {
          items.push({ id: `region-${regionId}`, label: region.label, category: "regions" });
        }
      });
    }

    // 팝업 카테고리
    if (!localFilters.popupCategories.includes("all")) {
      localFilters.popupCategories.forEach((catId) => {
        const cat = POPUP_CATEGORIES.find((c) => c.id === catId);
        if (cat) {
          items.push({ id: `popup-${catId}`, label: cat.label, category: "popupCategories" });
        }
      });
    }

    // 전시 카테고리
    if (!localFilters.exhibitionCategories.includes("all")) {
      localFilters.exhibitionCategories.forEach((catId) => {
        const cat = EXHIBITION_CATEGORIES.find((c) => c.id === catId);
        if (cat) {
          items.push({ id: `exhibition-${catId}`, label: cat.label, category: "exhibitionCategories" });
        }
      });
    }

    // 가격
    if (localFilters.price.free) {
      items.push({ id: "price-free", label: "무료", category: "price" });
    }
    if (localFilters.price.paid) {
      items.push({ id: "price-paid", label: "유료", category: "price" });
    }

    // 편의사항
    if (localFilters.amenities.parking) {
      items.push({ id: "amenity-parking", label: "주차가능", category: "amenities" });
    }
    if (localFilters.amenities.petFriendly) {
      items.push({ id: "amenity-petFriendly", label: "반려견 동반 가능", category: "amenities" });
    }

    // 행사 진행 상태
    if (localFilters.eventStatus.all) {
      items.push({ id: "eventStatus-all", label: "전체", category: "eventStatus" });
    }
    if (localFilters.eventStatus.ongoing) {
      items.push({ id: "eventStatus-ongoing", label: "진행 중", category: "eventStatus" });
    }
    if (localFilters.eventStatus.upcoming) {
      items.push({ id: "eventStatus-upcoming", label: "진행 예정", category: "eventStatus" });
    }
    if (localFilters.eventStatus.ended) {
      items.push({ id: "eventStatus-ended", label: "진행 종료", category: "eventStatus" });
    }

    return items;
  }, [localFilters]);

  // 선택된 항목 chip 제거
  const handleRemoveItem = (id: string) => {
    const [category, itemId] = id.split("-");

    if (category === "region") {
      const newRegions = localFilters.regions.filter((r) => r !== itemId);
      handleRegionsChange(newRegions.length === 0 ? ["all"] : newRegions);
    } else if (category === "popup") {
      const newCategories = localFilters.popupCategories.filter((c) => c !== itemId);
      handlePopupCategoriesChange(newCategories.length === 0 ? ["all"] : newCategories);
    } else if (category === "exhibition") {
      const newCategories = localFilters.exhibitionCategories.filter((c) => c !== itemId);
      handleExhibitionCategoriesChange(newCategories.length === 0 ? ["all"] : newCategories);
    } else if (category === "price") {
      handlePriceChange(itemId, false);
    } else if (category === "amenity") {
      handleAmenityChange(itemId, false);
    } else if (category === "eventStatus") {
      handleEventStatusChange(itemId, false);
    }
  };

  // 초기화 버튼 활성화 여부 (초기 상태와 다른지 확인)
  const isResetEnabled = useMemo(() => {
    return (
      JSON.stringify(localFilters) !== JSON.stringify(INITIAL_FILTER_STATE)
    );
  }, [localFilters]);

  // 필터 적용
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  // 필터 초기화
  const handleResetClick = () => {
    setLocalFilters(INITIAL_FILTER_STATE);
    onReset();
  };

  return (
    <aside
      className="bg-white"
      style={{
        width: "512px",
        height: "auto",
        maxHeight: "calc(100vh - 80px)",
        boxShadow: "-6px 0px 25px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px 16px 16px 12px",
        flexShrink: 0,
      }}
      aria-label="지역/행사 필터"
    >
      <div
        className="flex flex-col"
        style={{
          height: "100%",
          padding: "24px 80px 32px 32px",
          gap: "20px",
        }}
      >
        {/* 헤더 */}
        <header className="flex items-center justify-between">
          <h2
            className="text-[#000000]"
            style={{
              fontFamily: "Pretendard Variable",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "26px",
              letterSpacing: "-0.025em",
            }}
          >
            필터
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-12 h-12 hover:opacity-70 transition-opacity"
            aria-label="필터 닫기"
          >
            <X className="w-6 h-6 text-[#6C7180]" strokeWidth={1.5} />
          </button>
        </header>

        {/* 필터 섹션들 (스크롤 가능) */}
        <div
          className="flex-1 overflow-y-scroll"
          style={{
            width: "378px",
            maxHeight: "calc(100vh - 320px)",
            scrollbarWidth: "thin",
            scrollbarColor: "#D3D5DC #F7F7F7",
          }}
        >
          {/* 지역 */}
          <AccordionSection
            title="지역"
            isExpanded={expandedSections.region}
            onToggle={() => toggleSection("region")}
            isFirst
          >
            <PillButtonGroup
              options={REGIONS}
              selectedIds={localFilters.regions}
              onChange={handleRegionsChange}
            />
          </AccordionSection>

          {/* 카테고리 */}
          <AccordionSection
            title="카테고리"
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection("category")}
          >
            <div className="flex flex-col gap-2.5">
              {/* 팝업스토어 */}
              <div>
                <p
                  className="mb-2 text-[#959595]"
                  style={{
                    fontFamily: "Pretendard Variable",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "150%",
                    letterSpacing: "-0.025em",
                  }}
                >
                  팝업스토어
                </p>
                <PillButtonGroup
                  options={POPUP_CATEGORIES}
                  selectedIds={localFilters.popupCategories}
                  onChange={handlePopupCategoriesChange}
                />
              </div>

              {/* 전시 */}
              <div>
                <p
                  className="mb-2 text-[#959595]"
                  style={{
                    fontFamily: "Pretendard Variable",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "150%",
                    letterSpacing: "-0.025em",
                  }}
                >
                  전시
                </p>
                <PillButtonGroup
                  options={EXHIBITION_CATEGORIES}
                  selectedIds={localFilters.exhibitionCategories}
                  onChange={handleExhibitionCategoriesChange}
                />
              </div>
            </div>
          </AccordionSection>

          {/* 기간 */}
          <AccordionSection
            title="기간"
            isExpanded={expandedSections.period}
            onToggle={() => toggleSection("period")}
          >
            <DateRangeCalendar
              startDate={localFilters.dateRange.startDate}
              endDate={localFilters.dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </AccordionSection>

          {/* 행사 진행 */}
          <AccordionSection
            title="행사 진행"
            isExpanded={expandedSections.eventStatus}
            onToggle={() => toggleSection("eventStatus")}
          >
            <EventStatusCheckboxGroup
              options={EVENT_STATUS_OPTIONS}
              values={localFilters.eventStatus}
              onChange={handleEventStatusChange}
            />
          </AccordionSection>

          {/* 가격 */}
          <AccordionSection
            title="가격"
            isExpanded={expandedSections.price}
            onToggle={() => toggleSection("price")}
          >
            <CheckboxGroup
              options={PRICE_OPTIONS}
              values={localFilters.price}
              onChange={handlePriceChange}
            />
          </AccordionSection>

          {/* 편의사항 */}
          <AccordionSection
            title="편의사항"
            isExpanded={expandedSections.amenity}
            onToggle={() => toggleSection("amenity")}
          >
            <CheckboxGroup
              options={AMENITY_OPTIONS}
              values={localFilters.amenities}
              onChange={handleAmenityChange}
            />
          </AccordionSection>
        </div>

        {/* 선택된 항목 (조건부 렌더링) */}
        {selectedItems.length > 0 && (
          <div
            className="flex flex-col"
            style={{
              width: "378px",
              padding: "16px 0px",
              gap: "12px",
            }}
          >
            <h3
              className="text-[#202937]"
              style={{
                fontFamily: "Pretendard Variable",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "140%",
              }}
            >
              선택된 항목
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item) => (
                <SelectedItemChip
                  key={item.id}
                  label={item.label}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* 하단 버튼 (초기화 + 검색) */}
        <footer
          className="flex items-center"
          style={{
            width: "378px",
            gap: "12px",
          }}
        >
          {/* 초기화 버튼 */}
          <button
            type="button"
            onClick={handleResetClick}
            disabled={!isResetEnabled}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-full border transition-all",
              isResetEnabled
                ? "bg-white border-[#D3D5DC] text-[#4B5462] hover:border-[#6C7180]"
                : "bg-[#F3F4F6] border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
            )}
            style={{
              width: "120px",
              height: "52px",
              fontFamily: "Pretendard Variable",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "19px",
            }}
          >
            <RotateCcw
              className={cn("w-5 h-5", isResetEnabled ? "text-[#4B5462]" : "text-[#9CA3AF]")}
              strokeWidth={1.5}
            />
            초기화
          </button>

          {/* 검색 버튼 */}
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 flex items-center justify-center rounded-full bg-[#FA7228] text-white transition-colors hover:brightness-90"
            style={{
              height: "52px",
              fontFamily: "Pretendard Variable",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "19px",
            }}
          >
            <span className="flex items-center gap-0.5">
              <span className="font-semibold">{calculatedCount}</span>
              <span className="font-medium">개 행사 검색</span>
            </span>
          </button>
        </footer>
      </div>
    </aside>
  );
}
