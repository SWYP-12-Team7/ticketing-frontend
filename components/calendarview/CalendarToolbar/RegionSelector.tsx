/**
 * 지역 선택 드롭다운 컴포넌트
 *
 * Figma 스펙:
 * - 외부 컨테이너: padding: 4px, gap: 6px, height: 32px, bg: #FFF4EC
 * - 레이블: "지역" (주황색 #F36012)
 * - 드롭다운: 흰 배경, height: 26px
 * - SubcategorySelector와 동일한 구조
 *
 * @remarks
 * SubcategorySelector와 동일한 스타일 구조를 따름
 */

import React from "react";
import { cn } from "@/lib/utils";
import type { CalendarRegion } from "@/types/calendar";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

/**
 * RegionSelector Props
 */
interface RegionSelectorProps {
  /** 지역 목록 */
  regions: readonly CalendarRegion[];
  /** 선택된 지역 ID */
  selectedRegionId: string;
  /** 지역 변경 핸들러 */
  onRegionChange: (regionId: string) => void;
}

/**
 * 지역 선택 드롭다운 컴포넌트
 *
 * @example
 * ```tsx
 * <RegionSelector
 *   regions={[
 *     { id: 'all', label: '부산시 전체' },
 *     { id: 'haeundae', label: '해운대구' }
 *   ]}
 *   selectedRegionId="all"
 *   onRegionChange={handleRegionChange}
 * />
 * ```
 */
export function RegionSelector({
  regions,
  selectedRegionId,
  onRegionChange,
}: RegionSelectorProps) {
  const _selectedRegion = regions.find((r) => r.id === selectedRegionId);

  return (
    <div
      className={cn(
        "region-selector",
        "flex items-center gap-[6px] p-1 rounded-[24px]"
      )}
      style={{
        backgroundColor: CALENDAR_DESIGN_TOKENS.colors.filter.background,
        height: CALENDAR_DESIGN_TOKENS.sizing.toolbar.filterItemHeight,
      }}
    >
      {/* 레이블 (주황색) */}
      <div
        className={cn(
          "region-selector__label",
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
        지역
      </div>

      {/* 드롭다운 */}
      <div
        className={cn(
          "region-selector__dropdown",
          "flex items-center justify-center px-[10px] py-[2px] rounded-[24px] h-[26px]"
        )}
        style={{
          backgroundColor: CALENDAR_DESIGN_TOKENS.colors.filter.valueBackground,
        }}
      >
        <select
          className={cn(
            "region-selector__select",
            "bg-transparent outline-none cursor-pointer min-w-0"
          )}
          style={{
            fontFamily: CALENDAR_DESIGN_TOKENS.fonts.filter.family,
            fontSize: CALENDAR_DESIGN_TOKENS.fonts.filter.size,
            fontWeight: CALENDAR_DESIGN_TOKENS.fonts.filter.weight,
            lineHeight: CALENDAR_DESIGN_TOKENS.fonts.filter.lineHeight,
            color: CALENDAR_DESIGN_TOKENS.colors.filter.valueText,
          }}
          value={selectedRegionId}
          onChange={(e) => onRegionChange(e.target.value)}
          aria-label="지역 선택"
        >
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
