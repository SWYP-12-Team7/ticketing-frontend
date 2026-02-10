/**
 * 선택된 항목 칩 컴포넌트
 *
 * 필터 모달 하단에 선택된 항목을 표시하는 작은 칩
 *
 * Figma 스펙:
 * - Height: 24px
 * - Font-size: 12px
 * - Font-weight: 400
 * - Padding: 0px 8px
 * - Border-radius: 100px
 * - Background: #FFFFFF
 * - Border: 1px solid #D3D5DC
 * - Text color: #4B5462
 * - X 아이콘: 16px × 16px
 */

"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectedItemChipProps {
  /** 칩 레이블 */
  label: string;
  /** 제거 핸들러 */
  onRemove: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function SelectedItemChip({
  label,
  onRemove,
  className,
}: SelectedItemChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1",
        "bg-white border border-[#D3D5DC] rounded-full",
        "h-6 px-2",
        "transition-colors",
        className
      )}
    >
      {/* 레이블 */}
      <span
        className="text-[#4B5462] leading-none"
        style={{
          fontFamily: "Pretendard Variable",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: "100%",
        }}
      >
        {label}
      </span>

      {/* 제거 버튼 */}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center justify-center hover:opacity-70 transition-opacity"
        aria-label={`${label} 제거`}
      >
        <X className="w-4 h-4 text-[#6C7180]" strokeWidth={1.5} />
      </button>
    </div>
  );
}
