/**
 * HOT EVENT 섹션 컴포넌트
 *
 * - 선택된 날짜의 이벤트 목록 표시
 * - 카테고리 필터링
 * - 정렬 기능 (인기순, 최신순, 마감임박순, 조회순)
 */

"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { EventCard } from "@/components/common/EventCard";
import type { Event, EventSortOption } from "@/types/event";
import type { IsoDate } from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "../utils/calendar.query-state";
import { generateEventsByDate } from "@/lib/calendar-dummy-events";
import { formatDateKorean } from "../utils/calendar.formatters";
import { EventSortSelector } from "./EventSortSelector";

/**
 * HotEventSection Props
 */
interface HotEventSectionProps {
  /** 추가 CSS 클래스 */
  className?: string;
  /** 선택된 날짜 */
  selectedDate?: IsoDate | null;
  /** 활성화된 카테고리 */
  activeCategories?: CalendarCategoryActiveMap;
  /** 이벤트 목록 (선택사항, 없으면 더미 데이터 사용) */
  events?: Event[];
}

/**
 * HOT EVENT 섹션 컴포넌트
 *
 * @example
 * ```tsx
 * <HotEventSection
 *   selectedDate="2025-02-03"
 *   activeCategories={{ exhibition: true, popup: true }}
 * />
 * ```
 */
export function HotEventSection({
  className,
  selectedDate,
  activeCategories,
  events,
}: HotEventSectionProps) {
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");

  /**
   * 선택된 날짜의 이벤트 + 카테고리 필터링
   */
  const displayEvents = useMemo(() => {
    // 두 개 모두 체크 해제면 빈 배열
    if (
      activeCategories &&
      !activeCategories.exhibition &&
      !activeCategories.popup
    ) {
      return [];
    }

    // 이벤트 데이터 결정 (props 우선, 없으면 더미 데이터)
    let allEvents: Event[] = [];
    if (selectedDate && !events) {
      allEvents = generateEventsByDate(selectedDate);
    } else {
      allEvents = events || [];
    }

    // 카테고리 필터링
    if (activeCategories) {
      return allEvents.filter((event) => {
        if (event.category === "전시" && !activeCategories.exhibition) {
          return false;
        }
        if (event.category === "팝업" && !activeCategories.popup) {
          return false;
        }
        return true;
      });
    }

    return allEvents;
  }, [selectedDate, events, activeCategories]);

  /**
   * 정렬 로직
   */
  const sortedEvents = useMemo(() => {
    return [...displayEvents].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likeCount - a.likeCount;
        case "views":
          return b.viewCount - a.viewCount;
        case "latest":
          // TODO: 실제로는 createdAt 필드 필요
          return 0;
        case "deadline":
          // TODO: 실제로는 endDate 필드 필요
          return 0;
        default:
          return 0;
      }
    });
  }, [displayEvents, sortBy]);

  /**
   * 좋아요 클릭 핸들러
   */
  const handleLikeClick = (id: string) => {
    // TODO: 좋아요 API 호출
    console.log("이벤트 좋아요 클릭:", id);
  };

  /**
   * 섹션 제목 결정
   */
  const sectionTitle = selectedDate
    ? `${formatDateKorean(selectedDate)} 이벤트`
    : "HOT EVENT";

  /**
   * 빈 상태 메시지
   */
  const emptyMessage = (() => {
    if (selectedDate) {
      return "행사 종류와 날짜를 선택해주세요.🎉";
    }

    if (
      activeCategories &&
      !activeCategories.exhibition &&
      !activeCategories.popup
    ) {
      return "카테고리를 선택해주세요.";
    }

    return "이벤트를 불러오는 중...";
  })();

  return (
    <section
      className={cn("hot-event-section", className)}
      aria-labelledby="hot-event-heading"
    >
      <div className="hot-event-section__container">
        {/* 헤더: 제목 + 정렬 */}
        <div className="hot-event-section__header mb-6 flex items-center justify-between">
          <h2
            id="hot-event-heading"
            className="hot-event-section__title text-2xl font-bold text-foreground"
          >
            {sectionTitle}
          </h2>

          {/* 정렬 드롭다운 */}
          <EventSortSelector sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {/* 카드 그리드 또는 빈 상태 */}
        {sortedEvents.length > 0 ? (
          <ul className="hot-event-section__grid grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedEvents.map((event) => (
              <li key={event.id}>
                <EventCard event={event} onLikeClick={handleLikeClick} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="hot-event-section__empty py-12 text-center text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
