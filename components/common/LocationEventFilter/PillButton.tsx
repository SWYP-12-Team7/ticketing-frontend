/**
 * Pill 버튼 컴포넌트
 *
 * 지역/행사 필터에서 사용하는 pill 형태 버튼
 *
 * Figma 스펙 (2026-02-08 업데이트):
 * - 선택됨: bg #6C7180, border 1px #374051, color #FFFFFF
 * - 선택 안됨: bg #FFFFFF, border 1px #D3D5DC, color #4B5462
 * - Height: 32px, Min-width: 48px, Padding: 0px 16px
 * - Font-size: 14px, Font-weight: 400, Line-height: 140%
 * - Border-radius: 100px
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
        "min-w-[48px] h-[32px]",
        "px-4 gap-1",

        // Style
        "rounded-full",
        "text-sm",
        "transition-colors duration-200",
        "box-border",

        // Conditional styles
        isSelected
          ? "bg-[#6C7180] text-white border border-[#374051]"
          : "bg-white text-[#4B5462] border border-[#D3D5DC] hover:border-[#6C7180]",

        className
      )}
      style={{
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "140%",
      }}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
