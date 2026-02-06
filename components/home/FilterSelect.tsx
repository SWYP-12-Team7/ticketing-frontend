"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  label?: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  variant?: "primary" | "secondary";
  columns?: number;
  disabled?: boolean;
  className?: string;
}

export function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  variant = "primary",
  columns,
  disabled = false,
  className,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", className)} ref={ref}>
      {label && (
        <label className="text-[12px] font-semibold leading-[140%] text-[#6C7180]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-[4px] px-[12px] py-[10px] text-[16px] outline-none transition-colors",
            variant === "primary"
              ? "border border-orange"
              : "border-[2px] border-[#D3D5DC]",
            disabled
              ? "cursor-not-allowed bg-[#F3F4F6] text-[#D3D5DC]"
              : value ? "text-[#6C7180]" : "text-[#D3D5DC]"
          )}
        >
          {value || placeholder}
          <ChevronDown
            className={cn(
              "size-6 text-[#999] transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && options.length > 0 && (
          columns === 2 ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 flex max-h-[200px] overflow-y-auto rounded-[4px] border border-[#D3D5DC] bg-white p-1 shadow-sm">
              <ul className="flex-1">
                {options.slice(0, Math.ceil(options.length / 2)).map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-[2px] px-[12px] py-[8px] text-left text-[14px] hover:bg-[#F3F4F6]",
                        opt === value
                          ? "font-medium text-[#202937]"
                          : "text-[#121212]"
                      )}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="flex-1">
                {options.slice(Math.ceil(options.length / 2)).map((opt) => (
                  <li key={opt}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full rounded-[2px] px-[12px] py-[8px] text-left text-[14px] hover:bg-[#F3F4F6]",
                        opt === value
                          ? "font-medium text-[#202937]"
                          : "text-[#121212]"
                      )}
                    >
                      {opt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[200px] overflow-y-auto rounded-[4px] border border-[#D3D5DC] bg-white p-1 shadow-sm">
              {options.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full rounded-[2px] px-[12px] py-[8px] text-left text-[14px] hover:bg-[#F3F4F6]",
                      opt === value
                        ? "font-medium text-[#202937]"
                        : "text-[#121212]"
                    )}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
