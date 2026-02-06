/**
 * Interests Chip - 나의 취향 필터 칩 (Figma 스펙)
 *
 * Figma 스펙:
 * - 선택됨: bg #6C7180, border #374051, color #FFFFFF
 * - 기본: bg #FFFFFF, border #D3D5DC, color #4B5462
 * - min-width 48px, height 32px
 * - padding 0 16px, border-radius 100px
 *
 * @refactored
 * - Design Tokens 적용
 * - React.memo 최적화
 */

"use client";

import { memo } from "react";
import { INTERESTS_DESIGN_TOKENS as TOKENS } from "./constants";

interface InterestsChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 나의 취향 필터 칩 (Figma 스펙)
 *
 * @description
 * - 선택됨: bg #6C7180, border #374051, color #FFFFFF
 * - 기본: bg #FFFFFF, border #D3D5DC, color #4B5462
 * - min-width 48px, height 32px
 * - padding 0 16px, border-radius 100px
 *
 * @example
 * ```tsx
 * <InterestsChip
 *   label="라이프스타일"
 *   selected={true}
 *   onClick={() => setSelected(true)}
 * />
 * ```
 */
export const InterestsChip = memo(function InterestsChip({
  label,
  selected = false,
  onClick,
  className,
}: InterestsChipProps) {
  const { chipLabel } = TOKENS.typography;
  const selectedStyles = TOKENS.colors.chipSelectedBg;
  const defaultStyles = TOKENS.colors.chipDefaultBg;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`interests-chip flex items-center justify-center border transition-colors ${
        selected ? "" : "hover:bg-gray-50"
      } ${className || ""}`}
      style={{
        minWidth: TOKENS.sizing.chip.minWidth,
        height: TOKENS.sizing.chip.height,
        padding: `0 ${TOKENS.sizing.chip.paddingX}`,
        borderRadius: TOKENS.borderRadius.chip,
        backgroundColor: selected
          ? TOKENS.colors.chipSelectedBg
          : TOKENS.colors.chipDefaultBg,
        borderColor: selected
          ? TOKENS.colors.chipSelectedBorder
          : TOKENS.colors.chipDefaultBorder,
        fontFamily: chipLabel.family,
        fontSize: chipLabel.size,
        fontWeight: chipLabel.weight,
        lineHeight: chipLabel.lineHeight,
        color: selected ? chipLabel.colorSelected : chipLabel.colorDefault,
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
});
