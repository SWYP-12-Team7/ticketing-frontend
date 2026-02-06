"use client";

import { cn } from "@/lib/utils";
import { Heart, MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types/event";

interface OverlayEventCardProps {
  event: Event;
  onLikeClick?: (id: string) => void;
  className?: string;
}

/**
 * 오버레이 스타일 이벤트 카드 컴포넌트
 * - 기본: 이미지만 표시
 * - hover: 어두운 오버레이 + 정보 페이드인
 */
export function OverlayEventCard({
  event,
  onLikeClick,
  className,
}: OverlayEventCardProps) {
  const {
    id,
    title,
    category,
    location,
    period,
    imageUrl,
  } = event;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  return (
    <Link
      href={`/detail/${id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl",
        "aspect-[3/4]",
        className
      )}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-muted bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* hover 오버레이 */}
      <div className="absolute inset-0 flex flex-col justify-between bg-black/60 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* 상단: 하트 버튼 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleLikeClick}
            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
          >
            <Heart
              className="size-5 text-white"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* 하단: 정보 */}
        <div className="flex flex-col gap-2">
          {/* 카테고리 */}
          {category && (
            <span className="text-xs font-medium text-white/80">
              {category}
            </span>
          )}

          {/* 제목 */}
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {title}
          </h3>

          {/* 날짜 */}
          {period && (
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Calendar className="size-3" />
              <span>{period}</span>
            </div>
          )}

          {/* 위치 */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-white/80">
              <MapPin className="size-3" />
              <span>{location}</span>
            </div>
          )}

          {/* 자세히 보기 버튼 */}
          <div className="mt-1 flex items-center justify-center rounded-md border border-white/60 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10">
            자세히 보기
            <ArrowRight className="ml-1 size-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
