/**
 * 필터 상태 표시 버튼 (읽기 전용)
 *
 * Figma 스펙 (2026-02-16):
 * - 비활성화 (전체 선택): background #FFFFFF, border #D3D5DC, color #4B5462
 * - 활성화 (일부 선택): background #6C7180, border #4B5462, color #FFFFFF
 * - arrow-down 아이콘 16px
 * - 클릭 불가 (읽기 전용 표시)
 *
 * @example
 * ```tsx
 * <FilterStatusButton label="지역" isActive={true} />
 * <FilterStatusButton label="팝업스토어" isActive={false} />
 * ```
 */

import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

/**
 * FilterStatusButton Props
 */
interface FilterStatusButtonProps {
  /** 버튼 레이블 (예: "지역", "팝업스토어", "전시", "행사진행") */
  label: string;

  /** 활성화 상태 (true: 일부 선택, false: 전체 선택) */
  isActive: boolean;
}

/**
 * 필터 상태 표시 버튼
 *
 * - 읽기 전용 (클릭 불가)
 * - 필터 사이드바에서 선택된 상태를 시각적으로 표시
 * - React.memo로 최적화
 */
function FilterStatusButtonComponent({
  label,
  isActive,
}: FilterStatusButtonProps) {
  const tokens = CALENDAR_DESIGN_TOKENS.filterToolbar;
  const style = isActive ? tokens.button.active : tokens.button.inactive;

  return (
    <div
      className="filter-status-button inline-flex items-center justify-center"
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.button.padding,
        gap: tokens.button.gap,
        minWidth: tokens.button.minWidth,
        height: tokens.button.height,
        background: style.background,
        border: style.border,
        borderRadius: tokens.button.borderRadius,
        flexShrink: 0,
      }}
      role="status"
      aria-live="polite"
      aria-label={`${label} 필터 ${isActive ? "활성화" : "비활성화"}`}
    >
      {/* 레이블 */}
      <span
        style={{
          fontFamily: tokens.fonts.fontFamily,
          fontWeight: tokens.fonts.fontWeight,
          fontSize: tokens.fonts.fontSize,
          lineHeight: tokens.fonts.lineHeight,
          color: style.textColor,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* arrow-down 아이콘 */}
      <ChevronDown
        style={{
          width: tokens.arrow.size,
          height: tokens.arrow.size,
          color: style.arrowColor,
          strokeWidth: tokens.arrow.strokeWidth,
        }}
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * React.memo로 최적화된 FilterStatusButton
 *
 * props가 변경되지 않으면 리렌더링 방지
 */
export const FilterStatusButton = memo(FilterStatusButtonComponent);
