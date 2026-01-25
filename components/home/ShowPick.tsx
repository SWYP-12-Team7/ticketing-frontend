"use client";

import { cn } from "@/lib/utils";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
}

interface ShowPickProps {
  className?: string;
  title: string;
  events?: Event[];
}

export function ShowPick({ className, title, events }: ShowPickProps) {
  const [startIndex, setStartIndex] = useState(0);

  // 임시 데이터
  const defaultEvents: Event[] = [
    {
      id: "1",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "현대미술 컬렉션: 새로운 시선",
      date: "2024.01.21 - 2024.03.28",
      imageUrl: "/images/mockImg.svg",
      likeCount: 312,
    },
    {
      id: "2",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "현대미술 컬렉션: 새로운 시선",
      date: "2024.01.21 - 2024.03.28",
      imageUrl: "/images/mockImg.svg",
      likeCount: 2444,
    },
    {
      id: "3",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "현대미술 컬렉션: 새로운 시선",
      date: "2024.01.21 - 2024.03.28",
      imageUrl: "/images/mockImg.svg",
      likeCount: 1082,
    },
    {
      id: "4",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "현대미술 컬렉션: 새로운 시선",
      date: "2024.01.21 - 2024.03.28",
      imageUrl: "/images/mockImg.svg",
      likeCount: 982,
    },
  ];

  const displayEvents = events || defaultEvents;
  const visibleCount = 4;
  const maxIndex = Math.max(0, displayEvents.length - visibleCount);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const visibleEvents = displayEvents.slice(
    startIndex,
    startIndex + visibleCount
  );

  return (
    <section className={cn("", className)}>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted disabled:opacity-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {visibleEvents.map((event) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            {/* 배경 이미지 */}
            <div
              className="absolute inset-0 bg-muted bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${event.imageUrl})` }}
            />

            {/* 찜 버튼 */}
            <button
              onClick={(e) => {
                e.preventDefault();
                // 찜하기 로직
              }}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <Heart className="size-4 text-white" />
            </button>

            {/* 하단 그라데이션 + 텍스트 */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-16">
              <h3 className="mb-1 text-sm font-medium text-white">
                {event.title}
              </h3>
              <p className="mb-1 text-xs text-white/80">{event.location}</p>
              <p className="mb-2 text-xs text-white/80">{event.date}</p>
              <div className="flex items-center gap-1 text-white/80">
                <Heart className="size-3" />
                <span className="text-xs">
                  {event.likeCount.toLocaleString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
