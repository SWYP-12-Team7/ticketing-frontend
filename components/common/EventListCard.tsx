/**
 * Event List Card - 가로형 이벤트 카드 (Figma 스펙 완전 준수)
 *
 * Figma 스펙:
 * - Type=exhibition / Type=pop-up 공통 컴포넌트
 * - 카드: 422.5px × 267px (min-width 420px)
 * - padding: 20px, gap: 16px, border-radius: 12px
 * - information(197.5px): 카테고리 + 제목 + 지역 + 기간
 * - thumbnail(169×227px): 이미지 + 좋아요 버튼
 * - 전시: #F36012, 팝업: #2970E2
 */

"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";

/**
 * 이벤트 리스트 카드 타입 (카테고리 색상 결정)
 */
export type EventListCardType = "exhibition" | "popup";

interface EventListCardProps {
  event: Event;
  /** 카테고리 타입 - 전시: #F36012, 팝업: #2970E2 */
  type?: EventListCardType;
  onLikeClick?: (id: string) => void;
  className?: string;
}

/**
 * 가로형 이벤트 리스트 카드 (Figma 스펙 완전 준수)
 *
 * @description
 * - Type=exhibition / Type=pop-up 공통 컴포넌트
 * - 카드: 422.5px × 267px (min-width 420px)
 * - padding: 20px, gap: 16px, border-radius: 12px
 * - information(197.5px): 카테고리 + 제목 + 지역 + 기간
 * - thumbnail(169×227px): 이미지 + 좋아요 버튼
 * - 전시: #F36012, 팝업: #2970E2
 *
 * @example
 * ```tsx
 * <EventListCard
 *   event={event}
 *   type="exhibition"
 *   onLikeClick={handleLike}
 * />
 * ```
 */
export function EventListCard({
  event,
  type = "exhibition",
  onLikeClick,
  className,
}: EventListCardProps) {
  const categoryColor = type === "exhibition" ? "#F36012" : "#2970E2";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(event.id);
  };

  return (
    <Link
      href={`/detail/${event.id}`}
      className={cn(
        "event-list-card group flex min-w-[420px] flex-1 flex-row items-start gap-4 rounded-xl border border-[#E5E7EA] bg-white p-5 transition-shadow hover:shadow-md",
        className
      )}
      aria-label={`${event.title} 상세보기`}
    >
      {/* information - Figma: 197.5px, justify-between, padding 8px 0, gap 44px */}
      <div className="event-list-card__information flex flex-1 flex-col justify-between gap-11 self-stretch py-2">
        {/* title - Figma: gap 4px */}
        <div className="event-list-card__titleWrapper flex flex-col gap-1 self-stretch">
          <span
            className="event-list-card__category font-['Pretendard_Variable',sans-serif] text-base font-medium leading-[140%]"
            style={{ color: categoryColor }}
          >
            {event.category}
          </span>
          <h3 className="event-list-card__title line-clamp-1 font-['Pretendard_Variable',sans-serif] text-xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
            {event.title}
          </h3>
        </div>

        {/* meta - Figma: region + date */}
        <div className="event-list-card__meta flex flex-col self-stretch">
          {event.region && (
            <span className="event-list-card__region font-['Pretendard',sans-serif] text-sm leading-[140%] text-[#4B5462]">
              {event.region}
            </span>
          )}
          <div className="event-list-card__date flex items-start gap-1 font-['Pretendard',sans-serif] text-xs leading-[140%] text-[#6C7180]">
            <span>{event.period?.split(" ~ ")[0] ?? ""}</span>
            <span>~</span>
            <span>{event.period?.split(" ~ ")[1] ?? ""}</span>
          </div>
        </div>
      </div>

      {/* thumbnail - Figma: 169×227px, drop-shadow, border-radius 8px */}
      <div className="event-list-card__thumbnail relative h-[227px] w-[169px] shrink-0 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_6px_rgba(0,0,0,0.1)]">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          quality={85}
          className="object-cover transition-transform group-hover:scale-105"
          sizes="169px"
          loading="lazy"
        />
        {/* action/icon/like - Figma 스펙 준수: 48×48px, right 8px, top 8px */}
        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute right-2 top-2 flex size-12 items-center justify-center rounded-full bg-black/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={event.isLiked ? "좋아요 취소" : "좋아요"}
        >
          <Heart
            className={cn(event.isLiked && "fill-current")}
            style={{
              width: event.isLiked ? "22px" : "20px",
              height: event.isLiked ? "22px" : "20px",
              color: event.isLiked ? "#EE443F" : "#FFFFFF",
              strokeWidth: 1.5,
            }}
          />
        </button>
      </div>
    </Link>
  );
}
