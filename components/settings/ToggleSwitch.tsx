"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative h-6 w-10 rounded-full p-0.5 transition-colors",
        checked ? "bg-[#F36012]" : "bg-[#A6ABB7]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
      )}
    >
      {/* Knob */}
      <span
        className={cn(
          "block size-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
