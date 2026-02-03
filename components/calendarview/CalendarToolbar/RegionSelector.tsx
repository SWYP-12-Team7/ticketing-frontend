/**
 * 지역 선택 드롭다운 컴포넌트
 *
 * - select 요소로 지역 선택
 * - 접근성 고려 (label, aria-label)
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
  return (
    <div
      className={cn(
        "region-selector inline-flex min-w-0 items-center gap-2",
        CALENDAR_DESIGN_TOKENS.borderRadius.full,
        "bg-[#FFF0E2] px-3 py-2 text-sm font-semibold",
        "focus-within:ring-2 focus-within:ring-black/20 focus-within:ring-offset-1"
      )}
    >
      <span className="region-selector__label shrink-0 text-[#FF7A00]">
        지역
      </span>
      <select
        className={cn(
          "region-selector__select min-w-0 bg-transparent text-sm font-semibold outline-none",
          "cursor-pointer",
          "focus:outline-none"
        )}
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
  );
}
