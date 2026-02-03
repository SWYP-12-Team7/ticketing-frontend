"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { EventCard } from "@/components/common/EventCard";
import { X } from "lucide-react";
import type { Event, EventSortOption } from "@/types/event";

interface HotEventSectionProps {
  className?: string;
  events?: Event[];
  onResetFilter?: () => void;
}

// 정렬 옵션 설정
const SORT_OPTIONS = [
  { value: "popular" as const, label: "인기순" },
  { value: "latest" as const, label: "최신순" },
  { value: "deadline" as const, label: "마감임박순" },
  { value: "views" as const, label: "조회순" },
];

// 임시 목데이터 (HOT EVENT용) - 고정값으로 hydration 에러 방지
const mockHotEvents: Event[] = [
  { id: "hot-1", title: "나이키 에어맥스 팝업 스토어", category: "패션", period: "2024.01.20 - 2024.02.20", imageUrl: "https://picsum.photos/seed/hot1/400/500", viewCount: 95000, likeCount: 48000, isLiked: true },
  { id: "hot-2", title: "스타벅스 시즌 한정 팝업", category: "라이프스타일", period: "2024.01.25 - 2024.02.25", imageUrl: "https://picsum.photos/seed/hot2/400/500", viewCount: 88000, likeCount: 45000, isLiked: false },
  { id: "hot-3", title: "아디다스 오리지널스 전시", category: "패션", period: "2024.02.01 - 2024.03.01", imageUrl: "https://picsum.photos/seed/hot3/400/500", viewCount: 82000, likeCount: 42000, isLiked: false },
  { id: "hot-4", title: "무인양품 라이프 팝업", category: "라이프스타일", period: "2024.02.05 - 2024.03.05", imageUrl: "https://picsum.photos/seed/hot4/400/500", viewCount: 76000, likeCount: 39000, isLiked: false },
  { id: "hot-5", title: "뉴발란스 574 컬렉션", category: "패션", period: "2024.02.10 - 2024.03.10", imageUrl: "https://picsum.photos/seed/hot5/400/500", viewCount: 71000, likeCount: 36000, isLiked: true },
  { id: "hot-6", title: "이케아 홈 페스티벌", category: "라이프스타일", period: "2024.02.15 - 2024.03.15", imageUrl: "https://picsum.photos/seed/hot6/400/500", viewCount: 65000, likeCount: 33000, isLiked: false },
  { id: "hot-7", title: "컨버스 척 테일러 팝업", category: "패션", period: "2024.02.20 - 2024.03.20", imageUrl: "https://picsum.photos/seed/hot7/400/500", viewCount: 59000, likeCount: 30000, isLiked: false },
  { id: "hot-8", title: "다이슨 테크 쇼룸", category: "라이프스타일", period: "2024.02.25 - 2024.03.25", imageUrl: "https://picsum.photos/seed/hot8/400/500", viewCount: 54000, likeCount: 27000, isLiked: false },
  { id: "hot-9", title: "반스 스케이트 컬쳐", category: "패션", period: "2024.03.01 - 2024.04.01", imageUrl: "https://picsum.photos/seed/hot9/400/500", viewCount: 48000, likeCount: 24000, isLiked: false },
  { id: "hot-10", title: "애플 비전 체험존", category: "라이프스타일", period: "2024.03.05 - 2024.04.05", imageUrl: "https://picsum.photos/seed/hot10/400/500", viewCount: 43000, likeCount: 21000, isLiked: true },
  { id: "hot-11", title: "노스페이스 아웃도어", category: "패션", period: "2024.03.10 - 2024.04.10", imageUrl: "https://picsum.photos/seed/hot11/400/500", viewCount: 38000, likeCount: 18000, isLiked: false },
  { id: "hot-12", title: "레고 브릭 월드", category: "라이프스타일", period: "2024.03.15 - 2024.04.15", imageUrl: "https://picsum.photos/seed/hot12/400/500", viewCount: 33000, likeCount: 15000, isLiked: false },
  { id: "hot-13", title: "푸마 RS-X 런칭", category: "패션", period: "2024.03.20 - 2024.04.20", imageUrl: "https://picsum.photos/seed/hot13/400/500", viewCount: 28000, likeCount: 12000, isLiked: false },
  { id: "hot-14", title: "삼성 갤럭시 언팩", category: "라이프스타일", period: "2024.03.25 - 2024.04.25", imageUrl: "https://picsum.photos/seed/hot14/400/500", viewCount: 23000, likeCount: 9000, isLiked: false },
  { id: "hot-15", title: "리복 클래식 전시", category: "패션", period: "2024.04.01 - 2024.05.01", imageUrl: "https://picsum.photos/seed/hot15/400/500", viewCount: 18000, likeCount: 6000, isLiked: true },
  { id: "hot-16", title: "소니 플레이스테이션 존", category: "라이프스타일", period: "2024.04.05 - 2024.05.05", imageUrl: "https://picsum.photos/seed/hot16/400/500", viewCount: 13000, likeCount: 3000, isLiked: false },
  { id: "hot-17", title: "아식스 러닝 페스타", category: "패션", period: "2024.04.10 - 2024.05.10", imageUrl: "https://picsum.photos/seed/hot17/400/500", viewCount: 8000, likeCount: 2000, isLiked: false },
  { id: "hot-18", title: "닌텐도 스위치 팝업", category: "라이프스타일", period: "2024.04.15 - 2024.05.15", imageUrl: "https://picsum.photos/seed/hot18/400/500", viewCount: 5000, likeCount: 1000, isLiked: false },
];

export function HotEventSection({ className, events, onResetFilter }: HotEventSectionProps) {
  const isFiltered = !!onResetFilter;
  const [sortBy, setSortBy] = useState<EventSortOption>("popular");
  const displayEvents = events || mockHotEvents;

  // 정렬 로직 (실제 구현 시 백엔드에서 처리하는 것이 이상적)
  const sortedEvents = [...displayEvents].sort((a, b) => {
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

  const handleLikeClick = (id: string) => {
    console.log("HOT EVENT 좋아요 클릭:", id);
    // TODO: 좋아요 API 호출
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as EventSortOption);
  };

  return (
    <section
      className={cn("hotEventSection", className)}
      aria-labelledby="hotEventHeading"
    >
      <div className="hotEventSection__container">
        {/* 헤더 */}
        <div className="hotEventSection__header mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2
              id="hotEventHeading"
              className="hotEventSection__title text-2xl font-bold text-foreground"
            >
              {isFiltered ? "선택한 지역 이벤트" : "HOT EVENT"}
            </h2>
            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilter}
                className="flex items-center gap-1 rounded-full bg-orange/10 px-3 py-1 text-sm text-orange hover:bg-orange/20 transition-colors"
              >
                <X className="size-3" />
                <span>전체보기</span>
              </button>
            )}
          </div>

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

        {/* 카드 그리드 - 반응형 6열 */}
        <ul className="hotEventSection__grid grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {sortedEvents.map((event) => (
            <li key={event.id}>
              <EventCard event={event} onLikeClick={handleLikeClick} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
