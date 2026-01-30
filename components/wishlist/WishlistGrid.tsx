"use client";

import { memo } from "react";
import { EventCard } from "@/components/common/EventCard";
import type { Event } from "@/types/event";

interface WishlistGridProps {
  /** 표시할 이벤트 목록 */
  events: Event[];
  /** 좋아요 해제 핸들러 */
  onUnlike: (eventId: string) => void;
}

/**
 * 찜 목록 이벤트 그리드 컴포넌트
 * - 4열 반응형 그리드
 * - EventCard 컴포넌트 재사용
 *
 * 성능 최적화:
 * - memo를 사용하여 불필요한 리렌더링 방지
 */
export const WishlistGrid = memo(function WishlistGrid({
  events,
  onUnlike,
}: WishlistGridProps) {
  return (
    <section className="wishlistGrid mb-12" aria-label="찜한 행사 목록">
      <div className="wishlistGrid__container grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onLikeClick={onUnlike}
            className="wishlistGrid__card"
          />
        ))}
      </div>
    </section>
  );
});
