/**
 * Calendar Event Card - Figma 스펙 완전 준수 (490px 버전)
 *
 * Figma 스펙:
 * - 카드: 193px × 490px, gap: 8px
 * - 이미지: 193px × 258px, border-radius: 8px
 * - 좋아요 버튼: 48px, rgba(0,0,0,0.4)
 * - content: 224px (카테고리 + 제목 + 정보 + 메타)
 * - label-category: 카테고리 + 구분선 + 서브카테고리
 * - information: 지역 + 기간 + 가격
 * - meta: 조회수 + 좋아요
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/types/event";
import { CALENDAR_DESIGN_TOKENS as TOKENS } from "../constants/calendar.design-tokens";

interface CalendarEventCardProps {
  event: Event;
  onLikeClick?: (id: string) => void;
  className?: string;
}

/**
 * 캘린더 뷰 전용 이벤트 카드 (Figma 스펙 완전 준수)
 *
 * @example
 * ```tsx
 * <CalendarEventCard
 *   event={{
 *     id: "1",
 *     title: "나이키 에어맥스 팝업 스토어",
 *     category: "전시",
 *     subcategory: "라이프스타일",
 *     region: "서울 성수",
 *     period: "26.01.01 ~ 26.01.31",
 *     priceDisplay: "무료",
 *     imageUrl: "/images/event.jpg",
 *     viewCount: 1234,
 *     likeCount: 567,
 *   }}
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
    subcategory,
    region,
    period,
    priceDisplay,
    imageUrl,
    viewCount,
    likeCount,
    isLiked = false,
  } = event;

  const tokens = TOKENS.eventCard;

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  // 조회수 포맷팅 (99,999+ 제한)
  const formatCount = (count: number): string => {
    return count >= 99999 ? "99,999+" : count.toLocaleString();
  };

  // 카테고리별 색상 결정 (Figma 스펙 준수)
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "전시":
        return tokens.colors.categoryExhibition;
      case "팝업":
      case "팝업스토어":
        return tokens.colors.categoryPopup;
      default:
        // fallback: 전시 색상
        return tokens.colors.categoryExhibition;
    }
  };

  return (
    <article
      className={cn("calendar-event-card group flex flex-col", className)}
      style={{
        width: tokens.sizing.width,
        height: tokens.sizing.height,
        gap: tokens.spacing.gap,
      }}
    >
      {/* ========== 이미지 섹션 (193px × 258px) ========== */}
      <Link
        href={`/detail/${id}`}
        className="calendar-event-card__imageLink"
        aria-label={`${title} 상세보기`}
      >
        <div
          className="calendar-event-card__imageContainer relative overflow-hidden"
          style={{
            width: tokens.sizing.imageWidth,
            height: tokens.sizing.imageHeight,
            backgroundColor: tokens.colors.imagePlaceholder,
            borderRadius: tokens.borderRadius.image,
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes={tokens.sizing.imageWidth}
            className="calendar-event-card__image object-cover transition-transform group-hover:scale-105"
          />

          {/* 좋아요 버튼 (우상단 고정) - Figma 스펙 준수 */}
          <button
            type="button"
            onClick={handleLikeClick}
            className="calendar-event-card__likeButton absolute flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{
              width: tokens.sizing.likeButtonSize,
              height: tokens.sizing.likeButtonSize,
              right: tokens.spacing.likeButtonRight,
              top: tokens.spacing.likeButtonTop,
              backgroundColor: tokens.colors.likeButtonBg,
              borderRadius: tokens.borderRadius.likeButton,
            }}
            aria-label={isLiked ? "좋아요 취소" : "좋아요"}
          >
            <Heart
              className={cn(
                "calendar-event-card__likeIcon",
                isLiked && "fill-current"
              )}
              style={{
                width: isLiked
                  ? tokens.sizing.likeIconSizeActive
                  : tokens.sizing.likeIconSize,
                height: isLiked
                  ? tokens.sizing.likeIconSizeActive
                  : tokens.sizing.likeIconSize,
                color: isLiked
                  ? tokens.colors.likeActive
                  : tokens.colors.likeInactive,
                strokeWidth: tokens.borders.likeIcon,
              }}
            />
          </button>
        </div>
      </Link>

      {/* ========== 컨텐츠 영역 (224px) ========== */}
      <Link
        href={`/detail/${id}`}
        className="calendar-event-card__infoLink"
        aria-label={`${title} 정보`}
      >
        <div
          className="calendar-event-card__content flex flex-col"
          style={{
            width: tokens.sizing.width,
            height: tokens.sizing.contentHeight,
            gap: tokens.spacing.contentGap,
          }}
        >
          {/* 1️⃣ label-category: 카테고리 + 구분선 + 서브카테고리 */}
          <div
            className="calendar-event-card__labelCategory flex items-center"
            style={{
              gap: tokens.spacing.categoryGap,
              borderRadius: tokens.borderRadius.category,
            }}
          >
            {/* 카테고리 (전시/팝업) */}
            <span
              className="calendar-event-card__category"
              style={{
                fontFamily: tokens.fonts.category.family,
                fontWeight: tokens.fonts.category.weight,
                fontSize: tokens.fonts.category.size,
                lineHeight: tokens.fonts.category.lineHeight,
                color: getCategoryColor(category),
              }}
            >
              {category}
            </span>

            {/* 구분선 + 서브카테고리 (있을 경우에만 표시) */}
            {subcategory && (
              <>
                <span
                  className="calendar-event-card__divider"
                  style={{
                    width: tokens.sizing.dividerWidth,
                    height: tokens.sizing.dividerHeight,
                    backgroundColor: tokens.colors.divider,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="calendar-event-card__subcategory flex-1"
                  style={{
                    fontFamily: tokens.fonts.category.family,
                    fontWeight: tokens.fonts.category.weight,
                    fontSize: tokens.fonts.category.size,
                    lineHeight: tokens.fonts.category.lineHeight,
                    color: tokens.colors.subcategory,
                  }}
                >
                  {subcategory}
                </span>
              </>
            )}
          </div>

          {/* 2️⃣ 제목 (2줄 제한) */}
          <h3
            className="calendar-event-card__title line-clamp-2 transition-colors group-hover:underline"
            style={{
              width: tokens.sizing.width,
              fontFamily: tokens.fonts.title.family,
              fontWeight: tokens.fonts.title.weight,
              fontSize: tokens.fonts.title.size,
              lineHeight: tokens.fonts.title.lineHeight,
              letterSpacing: tokens.fonts.title.letterSpacing,
              color: tokens.colors.title,
            }}
          >
            {title}
          </h3>

          {/* 3️⃣ information: 지역 + 기간 + 가격 */}
          <div
            className="calendar-event-card__information flex flex-col"
            style={{
              padding: tokens.spacing.informationPadding,
              gap: tokens.spacing.informationGap,
            }}
          >
            {/* 지역 (있을 경우) */}
            {region && (
              <span
                className="calendar-event-card__region"
                style={{
                  fontFamily: tokens.fonts.region.family,
                  fontWeight: tokens.fonts.region.weight,
                  fontSize: tokens.fonts.region.size,
                  lineHeight: tokens.fonts.region.lineHeight,
                  color: tokens.colors.region,
                }}
              >
                {region}
              </span>
            )}

            {/* 기간 */}
            {period && (
              <span
                className="calendar-event-card__period"
                style={{
                  fontFamily: tokens.fonts.date.family,
                  fontWeight: tokens.fonts.date.weight,
                  fontSize: tokens.fonts.date.size,
                  lineHeight: tokens.fonts.date.lineHeight,
                  color: tokens.colors.date,
                }}
              >
                {period}
              </span>
            )}

            {/* 가격 (있을 경우) */}
            {priceDisplay && (
              <span
                className="calendar-event-card__price"
                style={{
                  fontFamily: tokens.fonts.price.family,
                  fontWeight: tokens.fonts.price.weight,
                  fontSize: tokens.fonts.price.size,
                  lineHeight: tokens.fonts.price.lineHeight,
                  color: tokens.colors.price,
                }}
              >
                {priceDisplay}
              </span>
            )}
          </div>

          {/* 4️⃣ meta: 조회수 + 좋아요 */}
          <div
            className="calendar-event-card__meta flex items-center"
            style={{
              paddingTop: "2px",
              gap: tokens.spacing.metaGap,
            }}
          >
            {/* 조회수 */}
            <div
              className="calendar-event-card__viewCount flex items-center"
              style={{ gap: tokens.spacing.metaItemGap }}
            >
              <Eye
                className="calendar-event-card__viewIcon"
                style={{
                  width: tokens.sizing.metaIconSize,
                  height: tokens.sizing.metaIconSize,
                  color: tokens.colors.meta,
                  strokeWidth: tokens.borders.metaIcon,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: tokens.fonts.meta.family,
                  fontWeight: tokens.fonts.meta.weight,
                  fontSize: tokens.fonts.meta.size,
                  lineHeight: tokens.fonts.meta.lineHeight,
                  color: tokens.colors.meta,
                }}
              >
                {formatCount(viewCount)}
              </span>
            </div>

            {/* 좋아요 */}
            <div
              className="calendar-event-card__likeCount flex items-center"
              style={{ gap: tokens.spacing.metaItemGap }}
            >
              <Heart
                className="calendar-event-card__likeIcon"
                style={{
                  width: tokens.sizing.metaIconSize,
                  height: tokens.sizing.metaIconSize,
                  color: tokens.colors.meta,
                  strokeWidth: tokens.borders.metaIcon,
                }}
                aria-hidden="true"
              />
              <span
                style={{
                  fontFamily: tokens.fonts.meta.family,
                  fontWeight: tokens.fonts.meta.weight,
                  fontSize: tokens.fonts.meta.size,
                  lineHeight: tokens.fonts.meta.lineHeight,
                  color: tokens.colors.meta,
                }}
              >
                {formatCount(likeCount)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
