/**
 * Accordion 섹션 컴포넌트
 *
 * 필터 섹션을 접고 펼 수 있는 Accordion
 *
 * Figma 스펙 (2026-02-08 업데이트):
 * - Title: 18px, weight 600, line-height 128%, color #121212
 * - Chevron: 24px × 24px, color #6C7180
 * - Border-bottom: 1px solid #F7F7F7
 * - Padding: 20px 0px 10px (첫 번째), 10px 0px (나머지)
 */

"use client";

import React from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 확장 상태 */
  isExpanded: boolean;
  /** 토글 핸들러 */
  onToggle: () => void;
  /** 섹션 내용 */
  children: React.ReactNode;
  /** 첫 번째 섹션 여부 (padding 조정) */
  isFirst?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function AccordionSection({
  title,
  isExpanded,
  onToggle,
  children,
  isFirst = false,
  className,
}: AccordionSectionProps) {
  return (
    <div
      className={cn(
        "flex flex-col border-b border-[#F7F7F7]",
        isFirst ? "pt-5 pb-2.5" : "py-2.5",
        className
      )}
    >
      {/* 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-0 gap-2.5"
        aria-expanded={isExpanded}
        aria-controls={`accordion-${title}`}
      >
        <span
          className="text-[#121212] text-left"
          style={{
            fontFamily: "Pretendard Variable",
            fontSize: "18px",
            fontWeight: 600,
            lineHeight: "128%",
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </span>
        <ChevronUp
          className={cn(
            "w-6 h-6 text-[#6C7180] transition-transform duration-200 shrink-0",
            !isExpanded && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* 내용 */}
      {isExpanded && (
        <div id={`accordion-${title}`} className="mt-2.5">
          {children}
        </div>
      )}
    </div>
  );
}
