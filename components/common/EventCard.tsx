"use client";

import { cn } from "@/lib/utils";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";

interface EventCardProps {
  event: Event;
  onLikeClick?: (id: string) => void;
  className?: string;
  /**
   * 이미지 aspect ratio 커스터마이징
   * @default "aspect-[3/4]" (세로형 카드)
   */
  imageAspectRatio?: string;
}

/**
 * 재사용 가능한 이벤트 카드 컴포넌트
 *
 * @example
 * // 6열 그리드 (HOT EVENT)
 * <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
 *   {events.map(event => <EventCard key={event.id} event={event} />)}
 * </div>
 *
 * @example
 * // 5열 그리드 (가까운 팝업스토어)
 * <div className="grid grid-cols-5 gap-4">
 *   {events.map(event => <EventCard key={event.id} event={event} />)}
 * </div>
 */
export function EventCard({
  event,
  onLikeClick,
  className,
  imageAspectRatio = "aspect-[3/4]",
}: EventCardProps) {
  const {
    id,
    title,
    category,
    period,
    imageUrl,
    viewCount,
    likeCount,
    isLiked = false,
    tags,
    subcategory,
  } = event;
  const typeLabel = category;
  const tagLabel = tags?.[0] ?? subcategory ?? "";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  return (
    <article className={cn("eventCard group w-[193px]", className)}>
      {/* 이미지 섹션 */}
      <Link href={`/detail/${id}`} className="eventCard__imageLink">
        <div
          className={cn(
            "eventCard__imageContainer border-1 relative mb-3 h-[258px] w-full overflow-hidden rounded-xl",
            imageAspectRatio
          )}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="eventCard__image object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* 좋아요 버튼 */}
          <button
            type="button"
            onClick={handleLikeClick}
            className="eventCard__likeButton absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            <Heart
              className={cn(
                "eventCard__likeIcon size-5 transition-colors",
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 group-hover:text-gray-800"
              )}
            />
          </button>
        </div>
      </Link>

      {/* 정보 섹션 */}
      <Link href={`/detail/${id}`} className="eventCard__infoLink block">
        {/* 타입 | 태그 */}
        <p className="eventCard__category mb-1 text-caption-medium text-muted-foreground">
          <span className="text-orange">{typeLabel}</span>
          {tagLabel && (
            <>
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="text-muted-foreground">{tagLabel}</span>
            </>
          )}
        </p>

        {/* 제목 */}
        <h3 className="eventCard__title mb-1 line-clamp-2 text-body-medium-bold text-foreground transition-colors group-hover:underline">
          {title}
        </h3>

        {/* 기간 */}
        <p className="eventCard__period mb-2 text-caption-medium text-muted-foreground">
          {period}
        </p>

        {/* 조회수 / 좋아요 */}
        <div className="eventCard__metaRow flex items-center gap-3 text-caption-medium text-muted-foreground">
          <div className="eventCard__viewCount flex items-center gap-1">
            <Eye className="size-3" aria-hidden="true" />
            <span>{viewCount.toLocaleString()}+</span>
          </div>
          <div className="eventCard__likeCount flex items-center gap-1">
            <Heart className="size-3" aria-hidden="true" />
            <span>{likeCount.toLocaleString()}+</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
