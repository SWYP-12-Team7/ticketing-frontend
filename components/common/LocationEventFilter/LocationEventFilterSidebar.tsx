/**
 * 지역/행사 필터 사이드바
 *
 * 캘린더뷰와 지도뷰에서 사용 가능
 *
 * Features:
 * - 지역 선택 (다중 선택 pill 버튼)
 * - 카테고리 선택 - 팝업스토어 (다중 선택 pill)
 * - 카테고리 선택 - 전시 (다중 선택 pill)
 * - 가격 필터 (무료/유료 체크박스)
 * - 편의사항 필터 (주차가능/반려견 동반 체크박스)
 *
 * Figma 스펙:
 * - Width: 273px
 * - Height: 661px
 * - Position: 좌측 고정
 * - Padding: 10px
 * - Gap: 11px
 * - Border-radius: 12px 16px 16px 12px
 * - Box-shadow: 2px 0px 2px rgba(0, 0, 0, 0.15)
 *
 * @example
 * ```tsx
 * // 캘린더뷰에서 사용
 * <LocationEventFilterSidebar
 *   isOpen={isFilterOpen}
 *   onClose={() => setIsFilterOpen(false)}
 *   filterState={filterState}
 *   onApply={handleApplyFilters}
 *   resultCount={eventCount}
 * />
 *
 * // 지도뷰에서 사용
 * <LocationEventFilterSidebar
 *   isOpen={isFilterOpen}
 *   onClose={() => setIsFilterOpen(false)}
 *   filterState={mapFilterState}
 *   onApply={handleMapFilters}
 *   resultCount={markerCount}
 * />
 * ```
 */

"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccordionSection } from "./AccordionSection";
import { PillButtonGroup } from "./PillButtonGroup";
import { CheckboxGroup } from "./CheckboxGroup";
import type { LocationEventFilterState } from "./types";
import {
  REGIONS,
  POPUP_CATEGORIES,
  EXHIBITION_CATEGORIES,
  PRICE_OPTIONS,
  AMENITY_OPTIONS,
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
  /** 검색 결과 개수 */
  resultCount: number;
}

export function LocationEventFilterSidebar({
  isOpen,
  onClose,
  filterState,
  onApply,
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

  // 필터 적용
  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          "fixed left-0 right-0 bottom-0 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{
          top: "80px",
          backgroundColor: "rgba(18, 18, 18, 0.4)",
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed right-0 z-50 bg-white transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          top: "80px",
          width: "273px",
          height: "calc(100vh - 80px)",
          maxHeight: "661px",
          boxShadow: "-6px 0px 25px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px 16px 16px 12px",
        }}
        aria-label="지역/행사 필터"
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="flex flex-col p-[10px]" 
          style={{
            height: "100%",
            gap: "11px",
          }}
        >
          {/* 헤더 */}
          <header className="flex items-center justify-between px-4 pr-4">
            <h2
              className="text-[#222222]"
              style={{
                fontFamily: "Pretendard Variable",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "28px",
              }}
            >
              필터
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6"
              aria-label="필터 닫기"
            >
              <X className="w-6 h-6 text-black" strokeWidth={2} />
            </button>
          </header>

          {/* 필터 섹션들 (스크롤 가능) */}
          <div
            className="flex-1 overflow-y-scroll px-3"
            style={{
              height: "530px",
              scrollbarWidth: "thin",
              scrollbarColor: "#D9D9D9 transparent",
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

          {/* 하단 검색 버튼 */}
          <footer className="px-3">
            <button
              type="button"
              onClick={handleApply}
              className="w-full rounded-full bg-[#FA7228] py-[10px] px-5 text-center text-white transition-colors hover:brightness-90"
              style={{
                height: "52px",
                fontFamily: "Pretendard Variable",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
              }}
            >
              <span className="flex items-center justify-center gap-0.5">
                <span className="font-semibold">{calculatedCount}</span>
                <span className="font-medium">개 행사 검색</span>
              </span>
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}
