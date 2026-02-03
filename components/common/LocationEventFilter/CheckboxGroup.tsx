/**
 * 체크박스 그룹 컴포넌트
 *
 * 가격/편의사항 필터에서 사용하는 체크박스 그룹
 *
 * Figma 스펙:
 * - 선택 안됨: border 1.125px #B1B1B1, bg #FFFFFF
 * - 선택됨: border 0.642857px #FA7228, bg #FA7228
 * - Size: 18px × 18px
 * - Border-radius: 2.25px (선택 안됨), 2.57143px (선택됨)
 * - Gap: 20px (vertical)
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
    <div className={cn("flex flex-col gap-5", className)}>
      {options.map((option) => {
        const isChecked = values[option.id] || false;

        return (
          <label
            key={option.id}
            className="flex items-center gap-2.5 cursor-pointer group"
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
                  "w-[18px] h-[18px] flex items-center justify-center transition-all",
                  isChecked
                    ? "bg-[#FA7228] border-[0.64px] border-[#FA7228]"
                    : "bg-white border-[1.125px] border-[#B1B1B1]"
                )}
                style={{
                  borderRadius: isChecked ? "2.57px" : "2.25px",
                }}
              >
                {isChecked && (
                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M1 4.5L4.5 8L11 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* 레이블 */}
            <span
              className="text-[#121212]"
              style={{
                fontFamily: "Pretendard",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "19px",
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
