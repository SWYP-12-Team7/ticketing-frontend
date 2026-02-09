/**
 * Interests Carousel Section - 찜한/다시보기 캐러셀 섹션 (Figma 스펙)
 *
 * Figma 스펙:
 * - 2개 캐러셀: 찜한 팝업･전시 / 다시 보고 싶은 팝업･전시
 * - 각 844px, gap 24px
 * - 세로형 카드 4개 (193×404px) - CalendarEventCard 재사용 (meta 표시)
 *
 * @refactored
 * - Mock 데이터 분리 (interests.mock.ts)
 * - Design Tokens 적용
 * - React.memo 최적화
 */

"use client";

import { memo } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CalendarEventCard } from "@/components/calendarview/HotEventSection/CalendarEventCard";
import { InterestsEmptyState } from "./InterestsEmptyState";
import { useUserTaste, useAddFavorite } from "@/queries/settings/useUserTaste";
import { useRemoveFavorite } from "@/queries/favorite";
import { mapTasteEventsToEvents } from "@/lib/taste-helpers";
import {
  INTERESTS_CAROUSEL_SECTIONS,
  INTERESTS_DESIGN_TOKENS as TOKENS,
} from "./constants";
import type { Event } from "@/types/event";
import type { EventType } from "@/types/user";

/**
 * 찜한/다시보기 캐러셀 섹션 (API 연동)
 *
 * @description
 * - 2개 캐러셀: 찜한 팝업･전시 / 다시 보고 싶은 팝업･전시
 * - 각 844px, gap 24px
 * - 세로형 카드 4개 (193×404px) - CalendarEventCard 재사용
 * - BE API 연동: GET /users/me/taste
 *
 * @example
 * ```tsx
 * <InterestsCarouselSection />
 * ```
 */
export function InterestsCarouselSection() {
  const { data, isLoading, error } = useUserTaste();
  const { mutate: addToFavorites } = useAddFavorite();
  const { mutate: removeFavoriteItem } = useRemoveFavorite();

  // BE 데이터 → FE Event 타입 변환
  const bookmarked = data ? mapTasteEventsToEvents(data.favorites) : [];
  const viewed = data ? mapTasteEventsToEvents(data.recentViews) : [];

  /**
   * 찜한 팝업･전시 - 찜하기 해제 핸들러
   * 
   * @description
   * - DELETE /users/me/favorites/{favoriteId} 호출
   * - 성공 시 자동으로 userTaste, userTimeline, folders 쿼리 무효화 (리프레시)
   */
  const handleBookmarkedLike = (id: string) => {
    const favoriteItem = data?.favorites.find((f) => String(f.id) === id);
    if (favoriteItem) {
      removeFavoriteItem(favoriteItem.id, {
        onSuccess: () => {
          console.log("찜하기 해제 성공:", id);
        },
        onError: (error) => {
          console.error("찜하기 해제 실패:", error);
          alert("찜 삭제에 실패했습니다");
        },
      });
    }
  };

  /**
   * 다시 보고 싶은 팝업･전시 - 찜하기 추가 핸들러
   * 
   * @description
   * - POST /curations/favorites 호출
   * - 성공 시 자동으로 userTaste 쿼리 무효화 (리프레시)
   */
  const handleViewedLike = (id: string) => {
    const event = viewed.find((e) => e.id === id);
    if (event && event.type) {
      addToFavorites({
        curationId: Number(id),
        curationType: event.type as EventType,
      });
    }
  };

  return (
    <div
      className="interests-carousel flex flex-col"
      style={{
        width: TOKENS.sizing.pageWidth,
        gap: TOKENS.spacing.carouselGap,
      }}
    >
      <CarouselBlock
        title={INTERESTS_CAROUSEL_SECTIONS.bookmarked}
        events={bookmarked}
        href="/wishlist"
        onLikeClick={handleBookmarkedLike}
        emptyMessage="내 취향 픽! 차곡차곡 쌓아봐요"
        isLoading={isLoading}
        isError={!!error}
      />
      <CarouselBlock
        title={INTERESTS_CAROUSEL_SECTIONS.viewed}
        events={viewed}
        href="/history"
        onLikeClick={handleViewedLike}
        emptyMessage="스쳐본 행사, 여기서 다시 볼 수 있어요"
        isLoading={isLoading}
        isError={!!error}
      />
    </div>
  );
}

/**
 * 캐러셀 블록 (재사용)
 *
 * @description
 * - 제목 + 세로 카드 4개 + 전체보기 버튼
 * - CalendarEventCard 재사용
 * - React.memo 최적화
 */
const CarouselBlock = memo(function CarouselBlock({
  title,
  events,
  href,
  onLikeClick,
  emptyMessage,
  isLoading,
  isError,
}: {
  title: string;
  events: Event[];
  href: string;
  onLikeClick: (id: string) => void;
  emptyMessage: string;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const { sectionTitle, viewAllButton } = TOKENS.typography;
  const hasEvents = events.length > 0;

  return (
    <section
      className="interests-carousel-block flex flex-col items-start"
      style={{ width: TOKENS.sizing.pageWidth }}
      aria-labelledby={`carousel-${title}`}
    >
      {/* header-wrapper - Figma: padding 16px 0 */}
      <h2
        id={`carousel-${title}`}
        className="py-4"
        style={{
          fontFamily: sectionTitle.family,
          fontSize: sectionTitle.size,
          fontWeight: sectionTitle.weight,
          lineHeight: sectionTitle.lineHeight,
          letterSpacing: sectionTitle.letterSpacing,
          color: sectionTitle.colorTitle,
        }}
      >
        {title}
      </h2>

      {/* 로딩 상태 또는 Empty State 또는 컨텐츠 */}
      {isLoading ? (
        <div
          className="flex animate-pulse"
          style={{ 
            gap: TOKENS.spacing.carouselCardGap,
            width: TOKENS.sizing.carousel.width 
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[404px] w-[193px] rounded-lg bg-gray-200"
              aria-label="로딩 중"
            />
          ))}
        </div>
      ) : isError || !hasEvents ? (
        <InterestsEmptyState
          message={emptyMessage}
          href="/search"
          buttonText="전체보기"
          width="930px"
          height="404px"
        />
      ) : (
        <div className="flex w-full items-start justify-between">
          {/* card-bookmark - Figma: 844px */}
          <div
            className="flex flex-col"
            style={{ width: TOKENS.sizing.carousel.width }}
          >
            {/* card-item - Figma: gap 24px */}
            <div
              className="flex"
              style={{ gap: TOKENS.spacing.carouselCardGap }}
            >
              {events.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  event={event}
                  onLikeClick={onLikeClick}
                />
              ))}
            </div>
          </div>

          {/* action-wrapper - Figma: padding 0 8px, width 65px, height 467px */}
          <div
            className="action-wrapper flex flex-row items-center justify-end"
            style={{
              width: TOKENS.sizing.viewAllButton.width,
              height: TOKENS.sizing.viewAllButton.height,
              padding: "0 8px",
            }}
          >
            <Link
              href={href}
              className="action-move flex flex-col items-center transition-colors hover:text-foreground"
              style={{
                width: TOKENS.sizing.viewAllButton.actionMoveWidth,
                height: TOKENS.sizing.viewAllButton.actionMoveHeight,
                gap: "4px",
              }}
              aria-label={`${title} 전체보기`}
            >
              <span
                className="flex items-center justify-center bg-white transition-colors hover:border-foreground"
                style={{
                  width: TOKENS.sizing.viewAllButton.iconSize,
                  height: TOKENS.sizing.viewAllButton.iconSize,
                  borderRadius: TOKENS.borderRadius.viewAllButton,
                  border: `${TOKENS.sizing.viewAllButton.iconBorder} solid ${TOKENS.colors.border}`,
                }}
              >
                <ChevronRight
                  className="size-6 text-[#6C7180]"
                  strokeWidth={1.5}
                />
              </span>
              <span
                style={{
                  fontFamily: viewAllButton.family,
                  fontSize: viewAllButton.size,
                  fontWeight: viewAllButton.weight,
                  lineHeight: viewAllButton.lineHeight,
                  color: viewAllButton.color,
                }}
              >
                전체보기
              </span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
});
