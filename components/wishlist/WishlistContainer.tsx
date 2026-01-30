"use client";

import { useState, useCallback, useMemo } from "react";
import { WishlistCategorySection } from "./WishlistCategorySection";
import { WishlistToolbar } from "./WishlistToolbar";
import { WishlistGrid } from "./WishlistGrid";
import { WishlistPagination } from "./WishlistPagination";
import { WishlistTimelineSection } from "./WishlistTimelineSection";
import { WishlistEmptyState } from "./WishlistEmptyState";
import { WISHLIST_PAGINATION_CONFIG } from "./wishlist.constants";
import type { Event } from "@/types/event";
import type {
  WishlistSortOption,
  WishlistRegionFilter,
} from "@/types/wishlist";

/**
 * 임시 카테고리 데이터
 * TODO: 실제 API 연동 시 제거
 */
const MOCK_CATEGORIES = [
  {
    id: "all",
    label: "전체",
    count: 53,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
  {
    id: "my-taste-1",
    label: "내취향 전시",
    count: 3,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
  {
    id: "my-taste-2",
    label: "내취향 전시",
    count: 3,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
  {
    id: "my-taste-3",
    label: "내취향 전시",
    count: 3,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
  {
    id: "my-taste-4",
    label: "내취향 전시",
    count: 3,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
  {
    id: "my-taste-5",
    label: "내취향 전시",
    count: 3,
    thumbnails: Array(4).fill("/images/mockImg.png"),
  },
];

/**
 * 임시 타임라인 데이터
 * TODO: 실제 API 연동 시 제거
 */
const MOCK_TIMELINE = {
  year: 2026,
  groups: [
    {
      label: "티켓오픈알로",
      events: [
        {
          id: "timeline-1",
          title: "적란운 1st 전국 투어 〈초도비행 (初度飛行)〉 - 대전",
          author: "관메가긴!",
          date: "2026.01.23 16:59",
          imageUrl: "/images/mockImg.png",
        },
        {
          id: "timeline-2",
          title: "제18회 서울재즈페스티벌 2026 얼리버드",
          author: "관메가긴!",
          date: "2026.01.26 23:59",
          imageUrl: "/images/mockImg.png",
        },
        {
          id: "timeline-3",
          title: "BanG Dream! 10주년의 궤적展",
          author: "관메가긴!",
          date: "2026.01.31 23:59",
          imageUrl: "/images/mockImg.png",
        },
      ],
    },
  ],
};

/**
 * 지역 목록 (순환용)
 */
const REGIONS: WishlistRegionFilter[] = [
  "seoul",
  "busan",
  "gyeonggi",
  "incheon",
  "daejeon",
  "gwangju",
  "ulsan",
  "gyeongnam",
  "jeonbuk",
  "jeonnam",
  "chungbuk",
  "chungnam",
  "gyeongbuk",
];

/**
 * 임시 이벤트 데이터 (다양한 데이터)
 * TODO: 실제 API 연동 시 제거
 */
const MOCK_WISHLIST_EVENTS: Event[] = Array.from({ length: 53 }, (_, i) => {
  const now = new Date();
  const createdAt = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
  const deadline = new Date(now.getTime() + (53 - i) * 24 * 60 * 60 * 1000);

  return {
    id: `event-${i + 1}`,
    title: `현대미술을 담백한: 새로운 시선 #${i + 1}`,
    category: i % 2 === 0 ? "전시" : "캐러터",
    region: REGIONS[i % REGIONS.length],
    location: `${REGIONS[i % REGIONS.length]} 지역`,
    period: "2024.12.19 - 2025.3.22",
    imageUrl: "/images/mockImg.png",
    viewCount: Math.floor(1000 + Math.random() * 10000),
    likeCount: Math.floor(500 + Math.random() * 20000),
    isLiked: true,
    createdAt,
    deadline,
  };
});

interface WishlistContainerProps {
  userNickname?: string;
}

/**
 * 찜 목록 메인 컨테이너 컴포넌트
 * - 상태 관리
 * - 이벤트 핸들러
 * - 자식 컴포넌트 조합
 * - 정렬/필터링 로직
 *
 * 아키텍처:
 * - Container/Presenter 패턴
 * - 상태 로직과 UI 로직 분리
 * - 재사용 가능한 컴포넌트 구조
 *
 * @param userNickname 유저 닉네임 (타임라인 섹션에 전달)
 */
export function WishlistContainer({ userNickname }: WishlistContainerProps) {
  // ============================================
  // 상태 관리
  // ============================================
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<WishlistSortOption>("popular");
  const [selectedRegions, setSelectedRegions] = useState<
    Set<WishlistRegionFilter>
  >(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [removedEventIds, setRemovedEventIds] = useState<Set<string>>(
    new Set()
  );

  // ============================================
  // 필터링 & 정렬 로직
  // ============================================

  /**
   * 필터링 & 정렬된 이벤트 목록
   * - 지역 필터 적용
   * - 정렬 적용
   * - 좋아요 해제된 항목 제외
   */
  const filteredAndSortedEvents = useMemo(() => {
    let result = MOCK_WISHLIST_EVENTS.filter(
      (event) => !removedEventIds.has(event.id)
    );

    // 1. 지역 필터 적용
    if (selectedRegions.size > 0) {
      result = result.filter(
        (event) => event.region && selectedRegions.has(event.region)
      );
    }

    // 2. 정렬 적용
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "popular":
          // 인기순 (좋아요 많은 순)
          return b.likeCount - a.likeCount;

        case "latest":
          // 최신순 (생성일 기준)
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);

        case "deadline":
          // 마감순 (마감일 가까운 순)
          return (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0);

        case "views":
          // 조회순 (조회수 많은 순)
          return b.viewCount - a.viewCount;

        default:
          return 0;
      }
    });

    return result;
  }, [sortOption, selectedRegions, removedEventIds]);

  // ============================================
  // 페이지네이션 계산
  // ============================================
  const { ITEMS_PER_PAGE, SCROLL_BEHAVIOR, SCROLL_TOP_POSITION } =
    WISHLIST_PAGINATION_CONFIG;

  const totalPages = useMemo(
    () => Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE),
    [filteredAndSortedEvents.length, ITEMS_PER_PAGE]
  );

  const currentEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(startIndex, endIndex);
  }, [filteredAndSortedEvents, currentPage, ITEMS_PER_PAGE]);

  // ============================================
  // 이벤트 핸들러
  // ============================================

  /**
   * 카테고리 변경
   */
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    // TODO: API 호출하여 카테고리별 데이터 가져오기
  }, []);

  /**
   * 카테고리 추가
   */
  const handleAddCategory = useCallback(() => {
    // TODO: 카테고리 추가 모달 또는 페이지로 이동
    console.log("카테고리 추가 클릭");
  }, []);

  /**
   * 정렬 옵션 변경
   * - 정렬 변경 시 첫 페이지로 이동
   */
  const handleSortChange = useCallback((option: WishlistSortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  }, []);

  /**
   * 지역 필터 토글
   * - 필터 변경 시 첫 페이지로 이동
   */
  const handleRegionToggle = useCallback((region: WishlistRegionFilter) => {
    setSelectedRegions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(region)) {
        newSet.delete(region);
      } else {
        newSet.add(region);
      }
      return newSet;
    });
    setCurrentPage(1);
  }, []);

  /**
   * 모든 필터 초기화
   */
  const handleClearFilters = useCallback(() => {
    setSelectedRegions(new Set());
    setCurrentPage(1);
  }, []);

  /**
   * 페이지 변경
   * - 페이지 상단으로 부드럽게 스크롤
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      window.scrollTo({
        top: SCROLL_TOP_POSITION,
        behavior: SCROLL_BEHAVIOR,
      });
    },
    [SCROLL_BEHAVIOR, SCROLL_TOP_POSITION]
  );

  /**
   * 이벤트 좋아요 해제
   * - removedEventIds에 추가하여 필터링
   * - 현재 페이지가 비어있으면 이전 페이지로 이동
   */
  const handleUnlike = useCallback(
    (eventId: string) => {
      setRemovedEventIds((prev) => new Set([...prev, eventId]));

      // 현재 페이지가 비어있는지 확인
      const remainingCount = filteredAndSortedEvents.length - 1;
      const maxPage = Math.ceil(remainingCount / ITEMS_PER_PAGE);

      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }

      // TODO: API 호출하여 백엔드에 좋아요 해제 요청
      // await unlikeEvent(eventId);
    },
    [currentPage, filteredAndSortedEvents.length, ITEMS_PER_PAGE]
  );

  // ============================================
  // 렌더링
  // ============================================

  // 빈 상태
  if (filteredAndSortedEvents.length === 0) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="wishlistContainer">
      {/* 카테고리 섹션 */}
      <WishlistCategorySection
        categories={MOCK_CATEGORIES}
        selectedCategoryId={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onAddCategory={handleAddCategory}
      />

      {/* 정렬 & 필터 툴바 */}
      <WishlistToolbar
        sortOption={sortOption}
        selectedRegions={selectedRegions}
        onSortChange={handleSortChange}
        onRegionToggle={handleRegionToggle}
        onClearFilters={handleClearFilters}
      />

      {/* 이벤트 그리드 */}
      <WishlistGrid events={currentEvents} onUnlike={handleUnlike} />

      {/* 페이지네이션 */}
      <WishlistPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* 타임라인 섹션 */}
      <WishlistTimelineSection
        year={MOCK_TIMELINE.year}
        groups={MOCK_TIMELINE.groups}
        userNickname={userNickname}
      />
    </div>
  );
}
