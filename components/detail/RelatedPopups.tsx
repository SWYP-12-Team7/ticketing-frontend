"use client";

import { cn } from "@/lib/utils";
import { Heart, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Popup {
  id: string;
  title: string;
  category: string;
  period: string;
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
}

interface RelatedPopupsProps {
  className?: string;
  popups?: Popup[];
}

// 임시 목데이터
const mockPopups: Popup[] = [
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
            <div key={popup.id} className="group">
              {/* 이미지 */}
              <Link href={`/detail/${popup.id}`}>
                <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-muted">
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
                      // 좋아요 토글 로직
                    }}
                    className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white"
                  >
                    <Heart
                      className={cn(
                        "size-5",
                        popup.isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      )}
                    />
                  </button>
                </div>
              </Link>

              {/* 정보 */}
              <Link href={`/detail/${popup.id}`}>
                {/* 카테고리 */}
                <p className="mb-1 text-caption-medium text-muted-foreground">
                  {popup.category}
                </p>

                {/* 제목 */}
                <h3 className="mb-1 truncate text-body-medium-bold group-hover:underline">
                  {popup.title}
                </h3>

                {/* 기간 */}
                <p className="mb-2 text-caption-medium text-muted-foreground">
                  {popup.period}
                </p>

                {/* 조회수 / 좋아요 */}
                <div className="flex items-center gap-3 text-caption-medium text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    <span>{popup.viewCount.toLocaleString()}+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="size-3" />
                    <span>{popup.likeCount.toLocaleString()}+</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
