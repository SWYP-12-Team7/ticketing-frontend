/**
 * 체크박스 그룹 컴포넌트
 *
 * 가격/편의사항 필터에서 사용하는 체크박스 그룹
 *
 * Figma 스펙 (2026-02-08 업데이트):
 * - 선택 안됨: border 1px #6C7180, bg #FFFFFF
 * - 선택됨: bg #FA7228
 * - Size: 24px × 24px
 * - Border-radius: 4px
 * - Gap: 12px (vertical)
 * - Label: 14px, #6C7180
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { CheckboxOption } from "./types";

interface CheckboxGroupProps {
  /** 옵션 목록 */
  options: readonly CheckboxOption[];
  /** 선택된 값들 (key: id, value: checked) */
  values: Record<string, boolean>;
  /** 변경 핸들러 */
  onChange: (id: string, checked: boolean) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  className,
}: CheckboxGroupProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {options.map((option) => {
        const isChecked = values[option.id] || false;

        return (
          <label
            key={option.id}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {/* 커스텀 체크박스 */}
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onChange(option.id, e.target.checked)}
                className="sr-only"
              />
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center transition-all rounded",
                  isChecked
                    ? "bg-[#FA7228] border border-[#FA7228]"
                    : "bg-white border border-[#6C7180]"
                )}
              >
                {isChecked && (
                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M1 5L5 9L13 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* 레이블 */}
            <span
              className="text-[#6C7180]"
              style={{
                fontFamily: "Pretendard Variable",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "140%",
              }}
            >
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}
