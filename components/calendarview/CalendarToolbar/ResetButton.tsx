/**
 * 초기화 버튼
 *
 * Figma 스펙 (2026-02-16):
 * - background #FFFFFF
 * - border #D3D5DC
 * - color #4B5462
 * - rotate-ccw 아이콘 16px
 * - 클릭 시: 모든 필터를 "전체" 상태로 리셋
 *
 * @example
 * ```tsx
 * <ResetButton onReset={handleReset} />
 * ```
 */

import { memo } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CALENDAR_DESIGN_TOKENS } from "../constants/calendar.design-tokens";

/**
 * ResetButton Props
 */
interface ResetButtonProps {
  /** 초기화 핸들러 */
  onReset: () => void;
}

/**
 * 초기화 버튼
 *
 * - 모든 필터를 초기 상태로 리셋
 * - rotate-ccw 아이콘 포함
 * - React.memo로 최적화
 */
function ResetButtonComponent({ onReset }: ResetButtonProps) {
  const tokens = CALENDAR_DESIGN_TOKENS.filterToolbar;

  return (
    <button
      type="button"
      onClick={onReset}
      className={cn(
        "reset-button inline-flex items-center justify-center",
        "transition-opacity hover:opacity-80 active:opacity-60",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "cursor-pointer"
      )}
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
        background: tokens.button.inactive.background,
        border: tokens.button.inactive.border,
        borderRadius: tokens.button.borderRadius,
        flexShrink: 0,
      }}
      aria-label="필터 초기화"
    >
      {/* 레이블 */}
      <span
        style={{
          fontFamily: tokens.fonts.fontFamily,
          fontWeight: tokens.fonts.fontWeight,
          fontSize: tokens.fonts.fontSize,
          lineHeight: tokens.fonts.lineHeight,
          color: tokens.reset.iconColor,
          whiteSpace: "nowrap",
        }}
      >
        초기화
      </span>

      {/* rotate-ccw 아이콘 */}
      <RotateCcw
        style={{
          width: tokens.reset.iconSize,
          height: tokens.reset.iconSize,
          color: tokens.reset.iconColor,
        }}
        aria-hidden="true"
      />
    </button>
  );
}

/**
 * React.memo로 최적화된 ResetButton
 *
 * props가 변경되지 않으면 리렌더링 방지
 */
export const ResetButton = memo(ResetButtonComponent);
