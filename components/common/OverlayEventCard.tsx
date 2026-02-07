"use client";

import { cn } from "@/lib/utils";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/types/event";

interface OverlayEventCardProps {
  event: Event;
  size?: "sm" | "lg";
  onLikeClick?: (id: string) => void;
  className?: string;
}

const sizeConfig = {
  sm: {
    card: "w-[193px] h-[258px]",
    category: "text-body-small text-[#FFFFFFCC]",
    titleClamp: "line-clamp-2",
  },
  lg: {
    card: "w-[302px] h-[404px]",
    category: "text-body-medium",
    titleClamp: "line-clamp-3",
  },
} as const;

export function OverlayEventCard({
  event,
  size = "lg",
  onLikeClick,
  className,
}: OverlayEventCardProps) {
  const { id, title, category, location, period, imageUrl } =
    event;
  const config = sizeConfig[size];

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  return (
    <div
      className={cn(
        "group relative block shrink-0 overflow-hidden rounded-xl shadow-[0px_0px_6px_0px_rgba(0,0,0,0.10),0px_1px_2px_0px_rgba(0,0,0,0.10)]",
        config.card,
        className
      )}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-muted bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />

      {/* hover 오버레이 */}
      <div className="absolute inset-0 z-10 flex flex-col bg-black/60 px-[24px] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* 상단: 하트 버튼 */}
        <div className="flex justify-end pt-[24px]">
          <button
            type="button"
            onClick={handleLikeClick}
            className="flex size-[48px] items-center justify-center rounded-full transition-colors hover:bg-white/20"
          >
            <Heart
              className="size-[24px] text-white"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* 하단: 정보 — 하트 48px 영역으로부터 70px 아래 */}
        <div className="mt-[70px] flex flex-col">
          {category && (
             <h3
            className={cn(
              "text-heading-medium text-[#FFFFFFCC]!",
              config.category
            )}
          >
            {category}
          </h3>
          )}
          

          <h3
            className={cn(
              "mt-[8px] text-xl font-semibold leading-[128%] tracking-[-0.025em] text-white",
              config.titleClamp
            )}
          >
            {title}
          </h3>
          

          {period && (
            <span className="mt-[16px] text-body-small text-white/60!">
              {period}
            </span>
          )}

          {location && (
            <span className="text-body-small text-white/60!">
              {location}
            </span>
          )}

          <Link
            href={`/detail/${id}`}
            className="mt-[44px] flex w-fit items-center gap-[8px] rounded-full border border-white/50 px-[12px] py-[6px] text-body-small text-white! transition-colors hover:bg-white/10"
          >
            자세히 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
