/**
 * Pill 버튼 그룹 컴포넌트
 *
 * 여러 개의 Pill 버튼을 flex-wrap으로 배치
 *
 * Figma 스펙:
 * - display: flex
 * - flex-wrap: wrap
 * - gap: 10px (row), 14px (column)
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { PillButton } from "./PillButton";
import type { PillOption } from "./types";

interface PillButtonGroupProps {
  /** 옵션 목록 */
  options: readonly PillOption[];
  /** 선택된 ID 배열 */
  selectedIds: string[];
  /** 선택 변경 핸들러 */
  onChange: (selectedIds: string[]) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

export function PillButtonGroup({
  options,
  selectedIds,
  onChange,
  className,
}: PillButtonGroupProps) {
  const handleToggle = (id: string) => {
    // "전체" 클릭 시
    if (id === "all") {
      onChange(["all"]);
      return;
    }

    // 다른 옵션 클릭 시
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds.filter((selectedId) => selectedId !== "all"), id];

    // 선택된 항목이 없으면 "전체"로 복귀
    onChange(newSelected.length === 0 ? ["all"] : newSelected);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-start content-start",
        "gap-x-[14px] gap-y-[10px]",
        className
      )}
    >
      {options.map((option) => (
        <PillButton
          key={option.id}
          label={option.label}
          isSelected={selectedIds.includes(option.id)}
          onClick={() => handleToggle(option.id)}
        />
      ))}
    </div>
  );
}
