"use client";

import { cn } from "@/lib/utils";
import { Heart, MapPin, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface HotDealCardData {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
  originalPrice?: number;
  discountRate?: number;
  discountPrice?: number;
}

interface HotDealCardProps {
  event: HotDealCardData;
  className?: string;
  onLikeClick?: (e: React.MouseEvent) => void;
}

export function HotDealCard({ event, className, onLikeClick }: HotDealCardProps) {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onLikeClick?.(e);
  };

  return (
    <Link
      href={`/event/${event.id}`}
      className={cn(
        "group relative flex gap-4 rounded-xl border border-border bg-card p-3",
        className
      )}
    >
      {/* 이미지 */}
      <div className="relative aspect-square w-30 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* 태그 */}
          <div className="mb-2 flex gap-1">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className={
                  index === 0
                    ? "rounded-md bg-[#6A8DFF] px-2 py-0.5 text-xs text-white"
                    : "rounded-md bg-[#FA7228] px-2 py-0.5 text-xs text-white"
                }
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h3 className="mb-2 text-sm font-semibold text-foreground group-hover:underline">
            {event.title}
          </h3>

          {/* 위치 */}
          <div className="mb-1 flex items-center gap-1 text-[12px] font-normal text-[#111111]">
            <MapPin className="size-3 text-[#111111]" />
            <span>{event.location}</span>
          </div>

          {/* 날짜 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>{event.date}</span>
          </div>
        </div>

        {/* 가격 */}
        <div className="mt-2">
          {event.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {event.originalPrice.toLocaleString()}원
            </span>
          )}
          <div className="flex items-center gap-2">
            {event.discountRate && (
              <span className="text-sm font-bold text-[#FA7228]">
                {event.discountRate}%
              </span>
            )}
            {event.discountPrice && (
              <span className="text-sm font-bold text-foreground">
                {event.discountPrice.toLocaleString()}원
              </span>
            )}
          </div>
        </div>

        {/* 조회수 + 좋아요 */}
        <div className="mt-2 flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="size-3" />
            <span className="text-xs">{event.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-3" />
            <span className="text-xs">{event.likeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 하트 버튼 */}
      <button
        onClick={handleLikeClick}
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-muted"
      >
        <Heart className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </button>
    </Link>
  );
}
