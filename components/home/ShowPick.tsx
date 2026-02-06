"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { OverlayEventCard } from "@/components/common";
import type { Event } from "@/types/event";

interface ShowPickProps {
  className?: string;
  title: string;
  events?: Event[];
}

// 임시 목데이터
const mockEvents: Event[] = [
  {
    id: "1",
    title: "현대미술 컬렉션: 새로운 시선",
    category: "마이아트뮤지엄",
    location: "서울 코엑스",
    period: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "2",
    title: "현대미술 컬렉션: 새로운 시선",
    category: "마이아트뮤지엄",
    location: "서울 코엑스",
    period: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "3",
    title: "현대미술 컬렉션: 새로운 시선",
    category: "마이아트뮤지엄",
    location: "서울 코엑스",
    period: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "4",
    title: "현대미술 컬렉션: 새로운 시선",
    category: "마이아트뮤지엄",
    location: "서울 코엑스",
    period: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
];

export function ShowPick({
  className,
  title,
  events,
}: ShowPickProps) {
  const [startIndex, setStartIndex] = useState(0);

  const displayEvents = events || mockEvents;
  const visibleCount = 4;
  const maxIndex = Math.max(0, displayEvents.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visibleEvents = displayEvents.slice(startIndex, startIndex + visibleCount);

  return (
    <section className={cn("", className)}>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {visibleEvents.map((event) => (
          <OverlayEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
