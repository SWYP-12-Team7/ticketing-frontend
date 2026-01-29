"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { EventCard } from "@/components/common/EventCard";
import type { Event } from "@/types/event";

interface RelatedPopupsProps {
  className?: string;
  popups?: Event[];
}

// 임시 목데이터
const mockPopups: Event[] = [
  {
    id: "1",
    title: "빵고미 팝업 - 대구",
    category: "캐릭터",
    period: "26.88.88 - 26.88.88",
    imageUrl: "https://picsum.photos/seed/popup1/400/500",
    viewCount: 99999,
    likeCount: 99999,
  },
  {
    id: "2",
    title: "패션 브랜드 팝업",
    category: "패션",
    period: "26.01.15 - 26.02.15",
    imageUrl: "https://picsum.photos/seed/popup2/400/500",
    viewCount: 85000,
    likeCount: 12000,
  },
  {
    id: "3",
    title: "뷰티 팝업스토어",
    category: "뷰티",
    period: "26.02.01 - 26.03.01",
    imageUrl: "https://picsum.photos/seed/popup3/400/500",
    viewCount: 72000,
    likeCount: 9500,
  },
  {
    id: "4",
    title: "푸드 페스티벌",
    category: "F&B",
    period: "26.03.10 - 26.03.20",
    imageUrl: "https://picsum.photos/seed/popup4/400/500",
    viewCount: 45000,
    likeCount: 6800,
  },
  {
    id: "5",
    title: "아트 전시회",
    category: "전시",
    period: "26.04.01 - 26.05.31",
    imageUrl: "https://picsum.photos/seed/popup5/400/500",
    viewCount: 120000,
    likeCount: 25000,
  },
];

export function RelatedPopups({ className, popups }: RelatedPopupsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const displayPopups = popups || mockPopups;
  const visibleCount = 5;
  const maxIndex = Math.max(0, displayPopups.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visiblePopups = displayPopups.slice(
    startIndex,
    startIndex + visibleCount
  );

  const handleLikeClick = (id: string) => {
    console.log("좋아요 클릭:", id);
    // TODO: 좋아요 API 호출
  };

  return (
    <section
      className={cn("relatedPopups border-t border-border py-10", className)}
      aria-labelledby="relatedPopupsHeading"
    >
      <div className="relatedPopups__container mx-auto max-w-[1200px] px-5">
        {/* 헤더 */}
        <div className="relatedPopups__header mb-4 flex items-center justify-between">
          <h2
            id="relatedPopupsHeading"
            className="relatedPopups__title text-lg font-bold text-foreground"
          >
            가까운 팝업스토어
          </h2>
          <div className="relatedPopups__navigation flex items-center gap-2">
            <span className="relatedPopups__pageIndicator text-sm text-muted-foreground">
              {startIndex + 1} / {displayPopups.length}
            </span>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="relatedPopups__prevButton flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= maxIndex}
              className="relatedPopups__nextButton flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="다음 페이지"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* 카드 그리드 - 5열 고정 */}
        <ul className="relatedPopups__grid grid grid-cols-5 gap-4">
          {visiblePopups.map((popup) => (
            <li key={popup.id}>
              <EventCard event={popup} onLikeClick={handleLikeClick} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
