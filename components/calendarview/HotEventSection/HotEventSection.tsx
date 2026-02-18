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
import { useAddFavorite } from "@/queries/settings/useUserTaste";
import { useLikedIds } from "@/queries/favorite";
import type { Event, EventSortOption } from "@/types/event";
import type { EventType } from "@/types/user";
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
import { EmptyState } from "./EmptyState";
import { applyClientSideFilters } from "@/utils/eventFilters";

/**
 * 기본 빈 Set (안정적인 참조 유지)
 */
const EMPTY_CATEGORY_SET = new Set<"exhibition" | "popup">();

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
  sortBy,
  events,
  selectedCategories = EMPTY_CATEGORY_SET,
  apiFilterParams,
  locationFilterState,
}: HotEventSectionProps) {
  const { mutate: addToFavorites } = useAddFavorite();
  const serverLikedIds = useLikedIds();

  /**
   * 좋아요 상태 관리 (로컬 토글용)
   */
  const [likedEventIds, setLikedEventIds] = useState<Set<string>>(new Set());


  /**
   * API 요청에 사용할 카테고리 배열
   * - Pill 상태(selectedCategories)를 기반으로 API 파라미터 생성
   * - size > 0: 선택된 카테고리만 배열로 반환
   * - size = 0: undefined 반환 (백엔드가 전체 카테고리로 해석)
   */
  const selectedCategoriesArray = useMemo(() => {
    // Pill 상태 기반으로 API 요청 파라미터 생성
    if (selectedCategories && selectedCategories.size > 0) {
      return Array.from(selectedCategories) as CalendarCategory[];
    }
    return undefined;
  }, [selectedCategories]);

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
  const mergedParams = useMemo(() => ({
    limit: 24,
    categories: selectedCategoriesArray,
    sortBy,
    ...apiFilterParams,
  }), [selectedCategoriesArray, sortBy, apiFilterParams]);

  const {
    data: popularEventsData,
    isLoading: isLoadingPopularEvents,
  } = useCalendarPopularEvents(
    mergedParams,
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
    let allEvents: Event[] = [];

    // 1️⃣ 날짜 선택 안 됨 → 인기 이벤트 (API 또는 props)
    if (!selectedDate) {
      allEvents = popularEventsData?.events ?? events ?? [];
    }
    // 2️⃣ 날짜 선택됨 → 해당 날짜 이벤트 (API 또는 props)
    else {
      allEvents = dateEventsData?.events ?? events ?? [];
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
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now(); // 현재 시간을 한 번만 계산 (deadline 정렬용)

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
      isLiked: serverLikedIds.has(event.id) || likedEventIds.has(event.id),
    }));
  }, [sortedEvents, serverLikedIds, likedEventIds]);


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
      } else {
        newSet.add(id); // 좋아요 추가
      }
      return newSet;
    });

    const event = displayEvents.find((e) => e.id === id);
    if (event) {
      const curationType = (event.type ?? (event.category === "전시" ? "EXHIBITION" : "POPUP")) as EventType;
      addToFavorites({ curationId: Number(id), curationType });
    }
  };

  /**
   * 빈 상태 타입 결정
   * - 이벤트가 있으면: null (정상 표시)
   * - 이벤트 없음: "no-events" (선택하신 조건에 맞는 행사가 없어요!)
   */
  const emptyStateType: "no-date" | "no-events" | null = useMemo(() => {
    // 이벤트가 있으면 null 반환 (정상 표시)
    if (eventsWithLikeState.length > 0) return null;

    // 이벤트가 0개 → "no-events" 표시
    // (날짜 선택 여부와 무관하게, 조건에 맞는 행사가 없으면 메시지 표시)
    return "no-events";
  }, [eventsWithLikeState.length]);

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
