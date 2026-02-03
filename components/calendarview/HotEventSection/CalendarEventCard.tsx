/**
 * Calendar Event Card - Figma 스펙 준수 버전
 *
 * Figma 스펙:
 * - 카드: 193px × 376-380px, gap: 8px
 * - 이미지: 193px × 258px, border-radius: 8px
 * - 좋아요 버튼: 48px, rgba(0,0,0,0.4)
 * - 좋아요 아이콘: 24px
 * - 제목: 20px/600, 2줄 제한
 * - 메타 아이콘: 16px, gap: 8px
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";

interface CalendarEventCardProps {
  event: Event;
  onLikeClick?: (id: string) => void;
  className?: string;
}

/**
 * 캘린더 뷰 전용 이벤트 카드 (Figma 스펙 준수)
 *
 * @example
 * ```tsx
 * <CalendarEventCard
 *   event={event}
 *   onLikeClick={(id) => console.log('Like:', id)}
 * />
 * ```
 */
export function CalendarEventCard({
  event,
  onLikeClick,
  className,
}: CalendarEventCardProps) {
  const {
    id,
    title,
    category,
    imageUrl,
    viewCount,
    likeCount,
    isLiked = false,
  } = event;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  return (
    <article
      className={cn("calendar-event-card group flex flex-col", className)}
      style={{
        width: "193px",
        gap: "8px",
      }}
    >
      {/* 이미지 섹션 (193px × 258px) */}
      <Link href={`/detail/${id}`} className="calendar-event-card__imageLink">
        <div
          className="calendar-event-card__imageContainer relative overflow-hidden bg-[#F3F4F6]"
          style={{
            width: "193px",
            height: "258px",
            borderRadius: "8px",
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="193px"
            className="calendar-event-card__image object-cover"
          />

          {/* 좋아요 버튼 (48px, 검은색 반투명) */}
          <button
            type="button"
            onClick={handleLikeClick}
            className="calendar-event-card__likeButton absolute flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{
              width: "48px",
              height: "48px",
              right: "calc(50% - 48px/2 - 64.5px)",
              top: "calc(50% - 48px/2 + 97px)",
              background: "rgba(0, 0, 0, 0.4)",
              borderRadius: "1000px",
            }}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            <Heart
              className={cn(
                "calendar-event-card__likeIcon transition-colors",
                isLiked ? "fill-red-500 text-red-500" : "text-white"
              )}
              style={{
                width: "24px",
                height: "24px",
                strokeWidth: "1.5px",
              }}
            />
          </button>
        </div>
      </Link>

      {/* 컨텐츠 영역 (110px) */}
      <Link href={`/detail/${id}`} className="calendar-event-card__infoLink">
        <div
          className="calendar-event-card__content flex flex-col"
          style={{
            width: "193px",
            gap: "4px",
          }}
        >
          {/* 카테고리 레이블 */}
          <p
            className="calendar-event-card__category"
            style={{
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "140%",
              color: "#4B5462",
            }}
          >
            {category}
          </p>

          {/* 제목 (2줄 제한) */}
          <h3
            className="calendar-event-card__title line-clamp-2 transition-colors group-hover:underline"
            style={{
              width: "193px",
              maxHeight: "48px",
              fontFamily: "Pretendard Variable",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "128%",
              letterSpacing: "-0.025em",
              color: "#202937",
            }}
          >
            {title}
          </h3>

          {/* 메타 (조회수/좋아요) */}
          <div
            className="calendar-event-card__meta flex items-start"
            style={{
              paddingTop: "2px",
              gap: "8px",
            }}
          >
            {/* 조회수 */}
            <div className="calendar-event-card__viewCount flex items-center gap-1">
              <Eye
                className="calendar-event-card__viewIcon"
                style={{
                  width: "16px",
                  height: "16px",
                  color: "#6C7180",
                  strokeWidth: "1px",
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "Pretendard",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "180%",
                  color: "#6C7180",
                }}
              >
                {viewCount >= 99999 ? "99,999+" : viewCount.toLocaleString()}
              </span>
            </div>

            {/* 좋아요 */}
            <div className="calendar-event-card__likeCount flex items-center gap-1">
              <Heart
                className="calendar-event-card__likeIcon"
                style={{
                  width: "16px",
                  height: "16px",
                  color: "#6C7180",
                  strokeWidth: "1px",
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: "Pretendard",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "180%",
                  color: "#6C7180",
                }}
              >
                {likeCount >= 99999 ? "99,999+" : likeCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
