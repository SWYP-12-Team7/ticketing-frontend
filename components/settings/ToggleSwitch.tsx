"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

/**
 * 토글 스위치 컴포넌트
 *
 * @description
 * - Figma 스펙: 40×24px, knob 20px, padding 2px
 * - 접근성: role="switch", aria-checked, aria-label
 * - 키보드 네비게이션 지원
 *
 * @example
 * ```tsx
 * <ToggleSwitch
 *   checked={enabled}
 *   onChange={handleToggle}
 *   aria-label="알림 받기"
 * />
 * ```
 */
export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-10 rounded-full p-0.5 transition-colors",
        checked ? "bg-[#F36012]" : "bg-[#A6ABB7]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
      )}
    >
      {/* Knob - Figma: 20px */}
      <span
        aria-hidden="true"
        className={cn(
          "block size-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
