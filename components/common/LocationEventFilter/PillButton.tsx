/**
 * Pill 버튼 컴포넌트
 *
 * 지역/행사 필터에서 사용하는 pill 형태 버튼
 *
 * Figma 스펙:
 * - 선택됨: bg #FA7228, color #FFFFFF
 * - 선택 안됨: bg #FFFFFF, border 1px #D9D9D9, color #121212
 * - Height: 33px, Min-width: 48px, Padding: 6px 12px
 * - Font-size: 14px, Font-weight: 500, Line-height: 150%
 * - Letter-spacing: -0.025em, Border-radius: 9999px
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PillButtonProps {
  /** 버튼 레이블 */
  label: string;
  /** 선택 상태 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function PillButton({
  label,
  isSelected,
  onClick,
  className,
}: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        // Layout
        "flex items-center justify-center",
        "min-w-[48px] h-[33px]",
        "px-3 py-1.5 gap-1",

        // Style
        "rounded-full",
        "text-sm font-medium",
        "transition-colors duration-200",
        "isolate",

        // Conditional styles
        isSelected
          ? "bg-[#FA7228] text-white border-none"
          : "bg-white text-[#121212] border border-[#D9D9D9] hover:border-[#FA7228]",

        className
      )}
      style={{
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "150%",
        letterSpacing: "-0.025em",
      }}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
