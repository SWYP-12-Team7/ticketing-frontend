/**
 * HOT EVENT 섹션 컴포넌트
 *
 * 3가지 상태:
 * 1. 날짜 선택 안 됨 → 인기 이벤트 표시 (제목: "HOT EVENT")
 * 2. 날짜 선택됨 + 이벤트 있음 → 해당 날짜 이벤트 (제목: "1월 8일 전시 60개")
 * 3. 날짜 선택됨 + 이벤트 없음 → 스위프 캐릭터 + 빈 상태 메시지
 */

"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarEventCard } from "./CalendarEventCard";
import type { Event, EventSortOption } from "@/types/event";
import type {
  IsoDate,
  CalendarCategory,
  CalendarEventFilterParams,
} from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "../utils/calendar.query-state";
import type { LocationEventFilterState } from "@/components/common/LocationEventFilter/types";
import {
  useCalendarEventsByDate,
  useCalendarPopularEvents,
} from "@/queries/calendar";
import { formatDateKorean } from "../utils/calendar.formatters";
import { EmptyState } from "./EmptyState";
import { applyClientSideFilters } from "@/utils/eventFilters";

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
  /** 정렬 옵션 */
  sortBy: EventSortOption;
  /** 이벤트 목록 (선택사항, 없으면 더미 데이터 사용) */
  events?: Event[];
  /** Pill 클릭으로 선택된 카테고리들 (다중 선택 지원) */
  selectedCategories?: Set<"exhibition" | "popup">;
  /** API 필터 파라미터 (지역, 카테고리, 서브카테고리) */
  apiFilterParams?: CalendarEventFilterParams;
  /** 전체 필터 상태 (클라이언트 필터링용) */
  locationFilterState?: LocationEventFilterState;
}

/**
 * HOT EVENT 섹션 컴포넌트
 *
 * @example
 * ```tsx
 * <HotEventSection
 *   selectedDate="2026-01-08"
 *   activeCategories={{ exhibition: true, popup: true }}
 * />
 * ```
 */
export function HotEventSection({
  className,
  selectedDate,
  activeCategories,
  sortBy,
  events,
  selectedCategories = new Set(),
  apiFilterParams,
  locationFilterState,
}: HotEventSectionProps) {
  /**
   * 좋아요 상태 관리 (로컬)
   * - Set을 사용하여 좋아요한 이벤트 ID 추적
   * - TODO: 백엔드 API 연동 시 전역 상태 또는 서버 상태로 전환
   */
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());

  /**
   * 카테고리 레이블 결정
   * - 전시만: "전시"
   * - 팝업만: "팝업"
   * - 둘 다 또는 둘 다 아님: "이벤트"
   */
  const categoryLabel = useMemo(() => {
    if (!activeCategories) return "이벤트";

    const { exhibition, popup } = activeCategories;

    if (exhibition && !popup) return "전시";
    if (!exhibition && popup) return "팝업";
    return "이벤트";
  }, [activeCategories]);

  /**
   * activeCategories를 CalendarCategory[] 배열로 변환
   * - React Query 훅에 전달하기 위함
   */
  const selectedCategoriesArray = useMemo(() => {
    if (!activeCategories) return [];
    const cats: CalendarCategory[] = [];
    if (activeCategories.exhibition) cats.push("exhibition");
    if (activeCategories.popup) cats.push("popup");
    return cats;
  }, [activeCategories]);

  /**
   * 날짜별 이벤트 API 조회
   * - 날짜 선택됐을 때만 호출 (enabled 옵션)
   * - 필터 파라미터 통합 (지역, 카테고리, 서브카테고리)
   */
  const {
    data: dateEventsData,
    isLoading: isLoadingDateEvents,
  } = useCalendarEventsByDate(
    {
      date: selectedDate!,
      categories: selectedCategoriesArray,
      sortBy,
      // API 필터 파라미터 통합
      ...apiFilterParams,
    },
    {
      enabled: !!selectedDate, // 날짜 선택됐을 때만 쿼리 실행
    }
  );

  /**
   * 인기 이벤트 API 조회
   * - 날짜 선택 안 됐을 때만 호출 (enabled 옵션)
   * - 필터 파라미터 통합 (지역, 카테고리, 서브카테고리)
   */
  const {
    data: popularEventsData,
    isLoading: isLoadingPopularEvents,
  } = useCalendarPopularEvents(
    {
      limit: 24,
      categories: selectedCategoriesArray,
      sortBy,
      // API 필터 파라미터 통합
      ...apiFilterParams,
    },
    {
      enabled: !selectedDate, // 날짜 선택 안 됐을 때만 쿼리 실행
    }
  );

  /**
   * 로딩 상태 결정
   * - 날짜 선택 여부에 따라 다른 쿼리의 로딩 상태 확인
   */
  const isLoading = selectedDate ? isLoadingDateEvents : isLoadingPopularEvents;

  /**
   * 이벤트 데이터 결정 + 필터링
   * - API 데이터 우선 사용
   * - events prop은 폴백으로 유지 (테스트용)
   * - 클라이언트 필터링 적용 (price, amenities, dateRange, eventStatus)
   */
  const displayEvents = useMemo(() => {
    // 카테고리 모두 체크 해제
    if (
      activeCategories &&
      !activeCategories.exhibition &&
      !activeCategories.popup
    ) {
      return [];
    }

    let allEvents: Event[] = [];

    // 1️⃣ 날짜 선택 안 됨 → 인기 이벤트 (API 또는 props)
    if (!selectedDate) {
      allEvents = popularEventsData?.events ?? events ?? [];
    }
    // 2️⃣ 날짜 선택됨 → 해당 날짜 이벤트 (API 또는 props)
    else {
      allEvents = dateEventsData?.events ?? events ?? [];
    }

    // API에서 이미 카테고리 필터링이 되었지만, 추가 필터링 적용
    // (activeCategories는 이미 API 요청에 포함되어 있으므로 중복이지만 안전장치)
    if (activeCategories) {
      allEvents = allEvents.filter((event) => {
        if (event.category === "전시" && !activeCategories.exhibition) {
          return false;
        }
        if (event.category === "팝업" && !activeCategories.popup) {
          return false;
        }
        return true;
      });
    }

    // Pill 클릭으로 선택된 카테고리 필터링 (다중 선택 지원)
    if (selectedCategories && selectedCategories.size > 0) {
      allEvents = allEvents.filter((event) => {
        const eventCategory =
          event.category === "전시" ? "exhibition" : "popup";
        return selectedCategories.has(eventCategory);
      });
    }

    // 클라이언트 추가 필터링 (API 미지원 필터)
    // - price, amenities, dateRange, eventStatus
    if (locationFilterState) {
      allEvents = applyClientSideFilters(allEvents, locationFilterState);
    }

    return allEvents;
  }, [
    selectedDate,
    popularEventsData,
    dateEventsData,
    events,
    activeCategories,
    selectedCategories,
    locationFilterState,
  ]);

  /**
   * 정렬 로직
   * - popular: 좋아요 많은 순
   * - views: 조회수 많은 순
   * - latest: 최신 등록 순
   * - deadline: 마감 임박 순 (종료일이 가까운 순)
   */
  const sortedEvents = useMemo(() => {
    return [...displayEvents].sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likeCount - a.likeCount;

        case "views":
          return b.viewCount - a.viewCount;

        case "latest":
          if (!a.createdAt || !b.createdAt) return 0;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "deadline":
          if (!a.endDate || !b.endDate) return 0;
          const now = Date.now();
          const diffA = Math.abs(new Date(a.endDate).getTime() - now);
          const diffB = Math.abs(new Date(b.endDate).getTime() - now);
          return diffA - diffB; // 가까운 순

        default:
          return 0;
      }
    });
  }, [displayEvents, sortBy]);

  /**
   * 좋아요 상태가 반영된 이벤트 목록
   */
  const eventsWithLikeState = useMemo(() => {
    return sortedEvents.map((event) => ({
      ...event,
      isLiked: likedEventIds.has(event.id),
    }));
  }, [sortedEvents, likedEventIds]);

  /**
   * 섹션 제목 결정
   * - 날짜 선택 안 됨: "HOT EVENT"
   * - 날짜 선택됨: "1월 8일 전시 60개"
   */
  const _sectionTitle = useMemo(() => {
    if (!selectedDate) {
      return "HOT EVENT";
    }

    const dateStr = formatDateKorean(selectedDate);
    const count = eventsWithLikeState.length;

    return `${dateStr} ${categoryLabel} ${count}개`;
  }, [selectedDate, categoryLabel, eventsWithLikeState.length]);

  /**
   * 좋아요 클릭 핸들러
   * - 로컬 상태 토글
   * - TODO: 백엔드 API 호출 추가
   */
  const handleLikeClick = (id: string) => {
    setLikedEventIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // 좋아요 취소
        console.log("좋아요 취소:", id);
      } else {
        newSet.add(id); // 좋아요 추가
        console.log("좋아요 추가:", id);
      }
      return newSet;
    });

    // TODO: 백엔드 API 호출
    // await likeEvent(id);
  };

  /**
   * 빈 상태 타입 결정
   */
  const emptyStateType: "no-date" | "no-events" | null = useMemo(() => {
    if (eventsWithLikeState.length > 0) return null;

    // 날짜 선택됨 + 이벤트 없음
    if (selectedDate) return "no-events";

    // 날짜 선택 안 됨
    return "no-date";
  }, [selectedDate, eventsWithLikeState.length]);

  return (
    <section
      className={cn("hot-event-section", className)}
      aria-labelledby="hot-event-heading"
      style={{
        width: "100%",
        zIndex: 5,
      }}
    >
      <div className="hot-event-section__container">
        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-gray-500 text-sm">
              이벤트를 불러오는 중...
            </div>
          </div>
        ) : (
          <>
            {/* 카드 그리드 또는 빈 상태 (Figma: 6열, gap: 26px 24px) */}
            {eventsWithLikeState.length > 0 ? (
              <ul
                className="hot-event-section__grid grid"
                style={{
                  gridTemplateColumns: "repeat(6, 193px)",
                  rowGap: "26px",
                  columnGap: "24px",
                }}
              >
                {eventsWithLikeState.map((event) => (
                  <li key={event.id}>
                    <CalendarEventCard
                      event={event}
                      onLikeClick={handleLikeClick}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              emptyStateType && <EmptyState type={emptyStateType} />
            )}
          </>
        )}
      </div>
    </section>
  );
}
