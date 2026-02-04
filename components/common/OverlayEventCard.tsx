"use client";

import { cn } from "@/lib/utils";
import { formatDdayStart } from "@/lib/date";
import { Heart, Eye, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types/event";

interface OverlayEventCardProps {
  event: Event;
  onLikeClick?: (id: string) => void;
  className?: string;
  variant?: "normal" | "countdown";
}

/**
 * 오버레이 스타일 이벤트 카드 컴포넌트
 * - 이미지 위에 정보가 오버레이되는 스타일
 * - ShowPick 등에서 사용
 */
export function OverlayEventCard({
  event,
  onLikeClick,
  className,
  variant = "normal",
}: OverlayEventCardProps) {
  const {
    id,
    title,
    location,
    period,
    imageUrl,
    viewCount,
    likeCount,
    tags = [],
    openDate,
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
        "group relative block aspect-[3/4] overflow-hidden rounded-xl",
        className
      )}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-muted bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* 우측 상단: 하트 버튼 */}
      <button
        type="button"
        onClick={handleLikeClick}
        className="absolute right-5.5 top-4 flex size-8 items-center justify-center rounded-full bg-[#BBBBBB]/73 transition-colors hover:bg-[#BBBBBB]/90"
      >
        <Heart className="size-5 text-black" strokeWidth={1.5} />
      </button>

      {/* 하단 그라데이션 + 텍스트 */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-4 pt-20">
        {/* 태그 */}
        {tags.length > 0 && (
          <div className="mb-2 flex gap-1">
            {tags.map((tag, index) => (
              <span
                key={tag}
                className={
                  index === 0
                    ? "rounded-md bg-[#6A8DFF] px-2 py-0.5 text-xs text-white"
                    : "rounded-md border-[1.5px] border-[#6A8DFF] bg-white px-2 py-0.5 text-xs text-[#6A8DFF]"
                }
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 제목 */}
        <h3 className="mb-2 text-sm font-medium text-white">
          {title}
        </h3>

        {/* 위치 */}
        {location && (
          <div className="mb-1 flex items-center gap-1 text-xs text-white/80">
            <MapPin className="size-3" />
            <span>{location}</span>
          </div>
        )}

        {/* 날짜: variant에 따라 D-day 또는 날짜 표시 */}
        <div className="mb-2 flex items-center gap-1 text-xs">
          <Calendar className="size-3 text-white/80" />
          {variant === "countdown" && openDate ? (
            <span className="font-medium text-[#FF0000]">
              {formatDdayStart(openDate)}
            </span>
          ) : (
            <span className="text-white/80">{period}</span>
          )}
        </div>

        {/* 경계선 */}
        <div className="mb-2 border-t border-white/30" />

        {/* 조회수 + 좋아요 */}
        <div className="flex items-center gap-3 text-white/80">
          <div className="flex items-center gap-1">
            <Eye className="size-3" />
            <span className="text-xs">{viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-3" />
            <span className="text-xs">{likeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
