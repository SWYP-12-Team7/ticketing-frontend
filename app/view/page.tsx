"use client";

import { Fragment, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { OverlayEventCard, type Event } from "@/components/common";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { X } from "lucide-react";
import Image from "next/image";

const PAGE_SIZE = 8;

const baseEvent: Omit<Event, "id"> = {
  title: "현대미술 컬렉션: 새로운 시선",
  category: "전시",
  location: "서울 코엑스",
  period: "2024.01.20 - 2024.03.20",
  imageUrl: "/images/mockImg.png",
  likeCount: 18353,
  viewCount: 2444,
  tags: ["전시", "현대미술"],
};

function ViewContent() {
  const searchParams = useSearchParams();

  // URL에서 검색어 추출
  const keyword = searchParams.get("keyword") || "";

  // 목데이터 (나중에 API 연동)
  const events = useMemo(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        ...baseEvent,
        id: String(index + 1),
        // 다양한 태그를 가진 목데이터
        tags:
          index % 3 === 0
            ? ["전시", "현대미술"]
            : index % 3 === 1
              ? ["팝업", "캐릭터"]
              : ["전시", "현대미술"],
      })),
    []
  );

  // 검색 결과 카드들에서 태그 추출 (중복 제거)
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    events.forEach((event) => {
      event.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [events]);

  // 표시할 태그 목록 (삭제된 태그 제외)
  const [visibleTags, setVisibleTags] = useState<string[]>([]);

  // allTags가 변경되면 visibleTags 초기화
  useEffect(() => {
    setVisibleTags(allTags);
  }, [allTags]);

  // 태그 삭제
  const handleRemoveTag = (tag: string) => {
    setVisibleTags((prev) => prev.filter((t) => t !== tag));
  };

  // 검색어 태그 삭제
  const handleRemoveKeyword = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("keyword");
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  // 필터링된 이벤트 (삭제되지 않은 태그를 가진 이벤트만)
  const filteredEvents = useMemo(() => {
    if (visibleTags.length === allTags.length) return events;
    return events.filter((event) =>
      event.tags.some((tag) => visibleTags.includes(tag))
    );
  }, [events, visibleTags, allTags.length]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 필터 사이드바 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 변경 시 visibleCount 리셋
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [visibleTags]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) =>
          Math.min(prev + PAGE_SIZE, filteredEvents.length)
        );
      },
      { rootMargin: "200px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredEvents.length]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const totalCount = filteredEvents.length;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-300 px-5 py-10">
        {/* 헤더: 검색 결과 수 + 정렬/필터 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-orange">
              {totalCount}
            </span>
            <span className="text-2xl font-medium text-foreground">
              개의 행사가 검색되었어요!
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 정렬 드롭다운 */}
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-foreground"
            >
              <span>정렬순</span>
              <Image
                src="/images/searchResult/IC_Sort.svg"
                alt="정렬"
                width={20}
                height={20}
              />
            </button>

            {/* 필터 버튼 */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              <span>필터</span>
              <Image
                src="/images/searchResult/IC_Fillter.svg"
                alt="필터"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>

        {/* 태그 필터 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {/* 검색어 태그 */}
          {keyword && (
            <button
              type="button"
              onClick={handleRemoveKeyword}
              className="flex items-center gap-2 rounded-full border border-orange px-3 py-1.5 text-sm font-medium text-orange transition-colors hover:brightness-90"
            >
              <span>검색어 : {keyword}</span>
              <X className="size-3" />
            </button>
          )}

          {/* 카드 태그들 */}
          {visibleTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="flex items-center gap-2 rounded-full border border-orange px-3 py-1.5 text-sm font-medium text-orange transition-colors hover:brightness-90"
            >
              <span>{tag}</span>
              <X className="size-3" />
            </button>
          ))}
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleEvents.map((event, index) => (
            <Fragment key={event.id}>
              <OverlayEventCard event={event} />
              {(index + 1) % PAGE_SIZE === 0 &&
                index + 1 < visibleEvents.length && (
                  <div className="col-span-full py-4">
                    <div className="flex h-20 items-center justify-center rounded-lg bg-[#E5E5E5] text-lg font-semibold text-muted-foreground">
                      배너
                    </div>
                  </div>
                )}
            </Fragment>
          ))}
        </div>

        {/* 무한 스크롤 감지용 */}
        <div ref={sentinelRef} className="h-12" />

        {/* 로딩 인디케이터 */}
        {visibleCount < filteredEvents.length && (
          <div className="flex justify-center py-6">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
          </div>
        )}

        {visibleCount >= filteredEvents.length && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            모든 결과를 불러왔습니다.
          </p>
        )}
      </div>

      {/* 필터 사이드바 */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        resultCount={totalCount}
      />
    </main>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
          </div>
        </main>
      }
    >
      <ViewContent />
    </Suspense>
  );
}
