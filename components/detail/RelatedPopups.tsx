"use client";

import { cn } from "@/lib/utils";
import { Heart, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Popup {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

interface RelatedPopupsProps {
  className?: string;
  popups?: Popup[];
}

// 임시 목데이터
const mockPopups: Popup[] = [
  {
    id: "1",
    title: "현대미술 컬렉션: 새로운 시선",
    location: "서울 코엑스",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    tags: ["전시", "현대미술"],
  },
  {
    id: "2",
    title: "팝업스토어 2",
    location: "서울 성수",
    date: "2024.02.01 - 2024.02.28",
    imageUrl: "/images/mockImg.png",
    tags: ["팝업", "패션"],
  },
  {
    id: "3",
    title: "팝업스토어 3",
    location: "서울 강남",
    date: "2024.03.01 - 2024.03.31",
    imageUrl: "/images/mockImg.png",
    tags: ["팝업", "뷰티"],
  },
  {
    id: "4",
    title: "팝업스토어 4",
    location: "서울 홍대",
    date: "2024.04.01 - 2024.04.30",
    imageUrl: "/images/mockImg.png",
    tags: ["팝업", "F&B"],
  },
  {
    id: "5",
    title: "팝업스토어 5",
    location: "서울 이태원",
    date: "2024.05.01 - 2024.05.31",
    imageUrl: "/images/mockImg.png",
    tags: ["팝업", "라이프스타일"],
  },
];

export function RelatedPopups({ className, popups }: RelatedPopupsProps) {
  const [startIndex, setStartIndex] = useState(0);
  const displayPopups = popups || mockPopups;
  const visibleCount = 5;
  const maxIndex = Math.max(0, displayPopups.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visiblePopups = displayPopups.slice(startIndex, startIndex + visibleCount);

  return (
    <section className={cn("border-t border-border py-10", className)}>
      <div className="mx-auto max-w-[1200px] px-5">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            가까운 팝업스토어
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {startIndex + 1} / {displayPopups.length}
            </span>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= maxIndex}
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-5 gap-4">
          {visiblePopups.map((popup) => (
            <Link
              key={popup.id}
              href={`/detail/${popup.id}`}
              className="group relative overflow-hidden rounded-xl"
            >
              {/* 이미지 */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                <Image
                  src={popup.imageUrl}
                  alt={popup.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />

                {/* 좋아요 버튼 */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/30 transition-colors hover:bg-black/50"
                >
                  <Heart className="size-4 text-white" strokeWidth={1.5} />
                </button>

                {/* 하단 그라데이션 + 텍스트 */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-16">
                  {/* 태그 */}
                  <div className="mb-2 flex gap-1">
                    {popup.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className={cn(
                          "rounded-md px-2 py-0.5 text-xs text-white",
                          index === 0 ? "bg-[#6A8DFF]" : "bg-[#FA7228]"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 제목 */}
                  <h3 className="mb-2 truncate text-sm font-medium text-white">
                    {popup.title}
                  </h3>

                  {/* 위치 */}
                  <div className="mb-1 flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="size-3" />
                    <span>{popup.location}</span>
                  </div>

                  {/* 날짜 */}
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <Calendar className="size-3" />
                    <span>{popup.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
