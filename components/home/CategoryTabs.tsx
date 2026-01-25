"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface CategoryTabsProps {
  className?: string;
}

const categories = [
  { id: "all", label: "전체" },
  { id: "music", label: "음악" },
  { id: "exhibition", label: "전시/행사" },
  { id: "sports", label: "스포츠" },
  { id: "theater", label: "연극/뮤지컬" },
  { id: "etc", label: "기타" },
];

export function CategoryTabs({ className }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto", className)}>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => setActiveCategory(category.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
