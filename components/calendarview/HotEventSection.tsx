"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { EventCard } from "@/components/common/EventCard";
import type { Event, EventSortOption } from "@/types/event";

interface HotEventSectionProps {
  className?: string;
  events?: Event[];
}

// 정렬 옵션 설정
const SORT_OPTIONS = [
  { value: "popular" as const, label: "인기순" },
  { value: "latest" as const, label: "최신순" },
  { value: "deadline" as const, label: "마감임박순" },
  { value: "views" as const, label: "조회순" },
];

// 임시 목데이터 (HOT EVENT용)
const mockHotEvents: Event[] = Array.from({ length: 18 }, (_, i) => ({
  id: `hot-${i + 1}`,
  title: `나이가 에이즈스 랑 스토어 에이 나.${i + 1}`,
  category: i % 2 === 0 ? "패션" : "라이프스타일",
  period: "26.88.88 - 26.88.88",
  imageUrl: `https://picsum.photos/seed/hot${i + 1}/400/500`,
  viewCount: Math.floor(Math.random() * 100000),
  likeCount: Math.floor(Math.random() * 50000),
  isLiked: i % 5 === 0,
}));

export function HotEventSection({ className, events }: HotEventSectionProps) {
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");
  const displayEvents = events || mockHotEvents;

  // 정렬 로직 (실제 구현 시 백엔드에서 처리하는 것이 이상적)
  const sortedEvents = [...displayEvents].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likeCount - a.likeCount;
      case "views":
        return b.viewCount - a.viewCount;
      case "latest":
        // TODO: 실제로는 createdAt 필드 필요
        return 0;
      case "deadline":
        // TODO: 실제로는 endDate 필드 필요
        return 0;
      default:
        return 0;
    }
  });

  const handleLikeClick = (id: string) => {
    console.log("HOT EVENT 좋아요 클릭:", id);
    // TODO: 좋아요 API 호출
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as EventSortOption);
  };

  return (
    <section
      className={cn("hotEventSection", className)}
      aria-labelledby="hotEventHeading"
    >
      <div className="hotEventSection__container">
        {/* 헤더 */}
        <div className="hotEventSection__header mb-6 flex items-center justify-between">
          <h2
            id="hotEventHeading"
            className="hotEventSection__title text-2xl font-bold text-foreground"
          >
            HOT EVENT
          </h2>

          {/* 정렬 드롭다운 */}
          <div className="hotEventSection__sortWrapper">
            <label htmlFor="hotEventSort" className="sr-only">
              정렬 기준 선택
            </label>
            <select
              id="hotEventSort"
              value={sortBy}
              onChange={handleSortChange}
              className="hotEventSection__sortSelect rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 카드 그리드 - 반응형 6열 */}
        <ul className="hotEventSection__grid grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedEvents.map((event) => (
            <li key={event.id}>
              <EventCard event={event} onLikeClick={handleLikeClick} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
