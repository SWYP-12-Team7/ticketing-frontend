"use client";

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  maxLength?: number;
  minLength?: number;
  error?: string;
  onBlur?: () => void;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** Input ID for label association */
  id?: string;
  /** Label 색상: 'primary'(#202937) | 'tertiary'(#6C7180) */
  labelColor?: "primary" | "tertiary";
}

/**
 * 설정 페이지 입력 필드 컴포넌트
 *
 * @description
 * - Figma 스펙 완전 반영 (라벨 18px/500, padding 12px 16px)
 * - 접근성: aria-label, aria-invalid, aria-describedby
 * - 에러 상태 관리
 * - disabled/readOnly 상태 지원
 *
 * @example
 * ```tsx
 * <InputField
 *   label="이름"
 *   value={name}
 *   onChange={setName}
 *   placeholder="입력해 주세요"
 *   helperText="도움말"
 *   error={error}
 * />
 * ```
 */
export function InputField({
  label,
  value,
  onChange,
  placeholder = "입력해 주세요",
  helperText,
  disabled = false,
  readOnly = false,
  className,
  maxLength,
  minLength,
  error,
  onBlur,
  "aria-label": ariaLabel,
  id,
  labelColor = "primary",
}: InputFieldProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  // Label 색상 결정 (disabled 필드는 tertiary)
  const labelTextColor =
    labelColor === "tertiary" ? "text-[#6C7180]" : "text-basic";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label - Figma: 18px, font-weight 500 */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-lg font-medium leading-[140%]", labelTextColor)}
        >
          {label}
        </label>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <span
          id={helperId}
          className="text-sm font-normal leading-[180%] text-[#6C7180]"
        >
          {helperText}
        </span>
      )}

      {/* Input Box - Figma: padding 12px 16px */}
      <input
        id={inputId}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperId}
        className={cn(
          "h-12 w-full rounded border px-4 py-3 text-base font-medium leading-[140%] transition-colors",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-[#D3D5DC] focus:border-orange focus:ring-orange",
          disabled || readOnly
            ? "bg-[#F9FAFB] text-[#6C7180]"
            : "bg-white text-foreground placeholder:text-[#A6ABB7]",
          "focus:outline-none focus:ring-1",
          "disabled:cursor-not-allowed"
        )}
      />

      {/* Error Message - Figma Spec */}
      {error && (
        <div id={errorId} className="flex items-center gap-0.5" role="alert">
          <AlertCircle
            className="h-[16px] w-[16px] text-[#0088E8]"
            aria-hidden="true"
          />
          <span className="text-xs font-normal leading-[180%] text-[#2970E2]">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
