"use client";

import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { EventCard } from "@/components/common/EventCard";
import type { Event, EventSortOption } from "@/types/event";
import type { IsoDate } from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "./calendar.query-state";
import { generateEventsByDate } from "@/lib/calendar-dummy-events";
import { parseIsoDateLocal } from "@/lib/calendar-date";

interface HotEventSectionProps {
  className?: string;
  selectedDate?: IsoDate | null;
  activeCategories?: CalendarCategoryActiveMap;
  events?: Event[];
}

// 정렬 옵션 설정
const SORT_OPTIONS = [
  { value: "popular" as const, label: "인기순" },
  { value: "latest" as const, label: "최신순" },
  { value: "deadline" as const, label: "마감임박순" },
  { value: "views" as const, label: "조회순" },
];

// 날짜를 "M월 D일" 형식으로 포맷
function formatDateKorean(isoDate: IsoDate): string {
  const date = parseIsoDateLocal(isoDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

export function HotEventSection({
  className,
  selectedDate,
  activeCategories,
  events,
}: HotEventSectionProps) {
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");

  // 선택된 날짜의 이벤트 + 카테고리 필터링
  const displayEvents = useMemo(() => {
    // 두 개 모두 체크 해제면 빈 배열
    if (
      activeCategories &&
      !activeCategories.exhibition &&
      !activeCategories.popup
    ) {
      return [];
    }

    let allEvents: Event[] = [];
    if (selectedDate && !events) {
      allEvents = generateEventsByDate(selectedDate);
    } else {
      allEvents = events || [];
    }

    // 카테고리 필터링
    if (activeCategories) {
      return allEvents.filter((event) => {
        if (event.category === "전시" && !activeCategories.exhibition)
          return false;
        if (event.category === "팝업" && !activeCategories.popup) return false;
        return true;
      });
    }

    return allEvents;
  }, [selectedDate, events, activeCategories]);

  // 정렬 로직
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

  const handleLikeClick = (id: string) => {
    console.log("이벤트 좋아요 클릭:", id);
    // TODO: 좋아요 API 호출
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as EventSortOption);
  };

  // 제목 결정
  const sectionTitle = selectedDate
    ? `${formatDateKorean(selectedDate)} 이벤트`
    : "HOT EVENT";

  return (
    <section
      className={cn("hotEventSection", className)}
      aria-labelledby="hotEventHeading"
    >
      <div className="hotEventSection__container">
        {/* 헤더 */}
        <div className="hotEventSection__header mb-6 flex items-center justify-between">
          <h2
            id="hotEventHeading"
            className="hotEventSection__title text-2xl font-bold text-foreground"
          >
            {sectionTitle}
          </h2>

          {/* 정렬 드롭다운 */}
          <div className="hotEventSection__sortWrapper">
            <label htmlFor="hotEventSort" className="sr-only">
              정렬 기준 선택
            </label>
            <select
              id="hotEventSort"
              value={sortBy}
              onChange={handleSortChange}
              className="hotEventSection__sortSelect rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 카드 그리드 */}
        {sortedEvents.length > 0 ? (
          <ul className="hotEventSection__grid grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {sortedEvents.map((event) => (
              <li key={event.id}>
                <EventCard event={event} onLikeClick={handleLikeClick} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="hotEventSection__empty py-12 text-center text-gray-500">
            {selectedDate
              ? "행사 종류와 날짜를 선택해주세요.🎉"
              : activeCategories &&
                  !activeCategories.exhibition &&
                  !activeCategories.popup
                ? "카테고리를 선택해주세요."
                : "이벤트를 불러오는 중..."}
          </div>
        )}
      </div>
    </section>
  );
}
