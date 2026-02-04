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

import { memo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CalendarEventCard } from "@/components/calendarview/HotEventSection/CalendarEventCard";
import { InterestsEmptyState } from "./InterestsEmptyState";
import {
  MOCK_BOOKMARKED_EVENTS,
  MOCK_VIEWED_EVENTS,
} from "@/lib/mock-data/interests.mock";
import {
  INTERESTS_CAROUSEL_SECTIONS,
  INTERESTS_DESIGN_TOKENS as TOKENS,
} from "./constants";
import type { Event } from "@/types/event";

interface InterestsCarouselSectionProps {
  bookmarkedEvents?: Event[];
  viewedEvents?: Event[];
}

/**
 * 찜한/다시보기 캐러셀 섹션 (Figma 스펙)
 *
 * @description
 * - 2개 캐러셀: 찜한 팝업･전시 / 다시 보고 싶은 팝업･전시
 * - 각 844px, gap 24px
 * - 세로형 카드 4개 (193×404px) - CalendarEventCard 재사용
 *
 * @example
 * ```tsx
 * <InterestsCarouselSection
 *   bookmarkedEvents={bookmarked}
 *   viewedEvents={viewed}
 * />
 * ```
 */
export function InterestsCarouselSection({
  bookmarkedEvents,
  viewedEvents,
}: InterestsCarouselSectionProps) {
  // 찜한 팝업･전시 상태 관리 (좋아요 해제 시 목록에서 제거)
  const [bookmarked, setBookmarked] = useState<Event[]>(
    bookmarkedEvents ?? MOCK_BOOKMARKED_EVENTS
  );

  // 다시 보고 싶은 팝업･전시 상태 관리 (좋아요 토글)
  const [viewed, setViewed] = useState<Event[]>(
    viewedEvents ?? MOCK_VIEWED_EVENTS
  );

  // 찜한 팝업･전시 - 좋아요 해제 시 목록에서 제거
  const handleBookmarkedLike = (id: string) => {
    setBookmarked((prev) => prev.filter((event) => event.id !== id));
  };

  // 다시 보고 싶은 팝업･전시 - 좋아요 토글
  const handleViewedLike = (id: string) => {
    setViewed((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, isLiked: !event.isLiked } : event
      )
    );
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
      />
      <CarouselBlock
        title={INTERESTS_CAROUSEL_SECTIONS.viewed}
        events={viewed}
        href="/history"
        onLikeClick={handleViewedLike}
        emptyMessage="스쳐본 행사, 여기서 다시 볼 수 있어요"
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
}: {
  title: string;
  events: Event[];
  href: string;
  onLikeClick: (id: string) => void;
  emptyMessage: string;
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

      {/* Empty State 또는 컨텐츠 */}
      {!hasEvents ? (
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
