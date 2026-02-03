/**
 * 선택된 필터 Pill 컴포넌트
 *
 * CalendarToolbar에 표시되는 개별 필터 pill
 * X 버튼 클릭 시 해당 필터 제거
 *
 * Figma 스펙:
 * - Height: 33px
 * - Min-width: 48px
 * - Padding: 6px 12px
 * - Gap: 4px
 * - Background: #FA7228
 * - Color: #FFFFFF
 * - Border-radius: 9999px
 * - Font-size: 14px
 * - Font-weight: 500
 */

"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPillProps {
  /** Pill 레이블 */
  label: string;
  /** 제거 핸들러 (optional) */
  onRemove?: () => void;
  /** X 버튼 표시 여부 */
  showRemoveButton?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function FilterPill({
  label,
  onRemove,
  showRemoveButton = true,
  className,
}: FilterPillProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-[33px] min-w-[48px] rounded-full isolate",
        "bg-[#FA7228] text-white",
        "text-sm font-medium",
        showRemoveButton ? "px-3 gap-1" : "px-3",
        className
      )}
      style={{
        padding: "6px 12px",
        gap: showRemoveButton ? "4px" : undefined,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "150%",
        letterSpacing: "-0.025em",
      }}
    >
      <span className="flex items-center" style={{ zIndex: 0 }}>
        {label}
      </span>
      {showRemoveButton && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center justify-center w-4 h-4 hover:opacity-80 transition-opacity"
          aria-label={`${label} 필터 제거`}
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
