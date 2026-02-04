"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/common/EventCard";
import type { Event, EventSortOption } from "@/types/event";

interface MapEventSectionProps {
  className?: string;
  events: Event[];
  onResetFilter?: () => void;
  isFiltered?: boolean;
}

const SORT_OPTIONS = [
  { value: "popular" as const, label: "인기순" },
  { value: "latest" as const, label: "최신순" },
  { value: "deadline" as const, label: "마감임박순" },
  { value: "views" as const, label: "조회순" },
];

export function MapEventSection({
  className,
  events,
  onResetFilter,
  isFiltered = false,
}: MapEventSectionProps) {
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");

  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likeCount - a.likeCount;
      case "views":
        return b.viewCount - a.viewCount;
      default:
        return 0;
    }
  });

  const handleLikeClick = (id: string) => {
    console.log("좋아요 클릭:", id);
  };

  return (
    <section className={cn("mt-10", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">
            {isFiltered ? "선택한 지역 이벤트" : "HOT EVENT"}
          </h2>
          {isFiltered && onResetFilter && (
            <button
              type="button"
              onClick={onResetFilter}
              className="flex items-center gap-1 rounded-full bg-orange/10 px-3 py-1 text-sm text-orange hover:bg-orange/20 transition-colors"
            >
              <X className="size-3" />
              <span>전체보기</span>
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as EventSortOption)}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {sortedEvents.map((event) => (
          <li key={event.id}>
            <EventCard event={event} onLikeClick={handleLikeClick} />
          </li>
        ))}
      </ul>
    </section>
  );
}
