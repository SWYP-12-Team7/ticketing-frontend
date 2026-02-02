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
}

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
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      {label && (
        <label className="text-base font-semibold leading-[180%] text-basic">
          {label}
        </label>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <span className="text-sm leading-[180%] text-[#6C7180]">
          {helperText}
        </span>
      )}

      {/* Input Box */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        minLength={minLength}
        className={cn(
          "h-12 w-full rounded border px-4 py-2 text-base font-medium leading-[140%] transition-colors",
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
        <div className="flex items-center gap-0.5">
          <AlertCircle className="size-4 text-[#0088E8]" />
          <span className="text-xs font-normal leading-[180%] text-[#2970E2]">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
