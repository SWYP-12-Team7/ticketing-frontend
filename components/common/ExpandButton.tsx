"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

export function ExpandButton({
  isExpanded,
  onClick,
  className,
}: ExpandButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-[312px] items-center justify-center gap-1 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      {isExpanded ? (
        <>
          접기 <ChevronUp className="size-4" />
        </>
      ) : (
        <>
          전체보기 <ChevronDown className="size-4" />
        </>
      )}
    </button>
  );
}
