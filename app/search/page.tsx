"use client";

import { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard, type Event } from "@/components/common";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { X } from "lucide-react";
import Image from "next/image";

const PAGE_SIZE = 12;

// 카테고리 칩 라벨 매핑
const CHIP_LABELS: Record<string, Record<string, string>> = {
  popup: {
    all: "팝업전체",
    fashion: "패션",
    beauty: "뷰티",
    fnb: "F&B",
    character: "캐릭터",
    tech: "테크",
    lifestyle: "라이프스타일",
    furniture: "기구 & 인테리어",
  },
  exhibition: {
    all: "전시전체",
    art: "현대미술",
    photo: "사진",
    design: "디자인",
    illustration: "일러스트",
    painting: "회화",
    sculpture: "조각",
    installation: "설치미술",
  },
};

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

function SearchContent() {
  const searchParams = useSearchParams();

  // URL에서 파라미터 추출
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  // 활성 칩 라벨 계산
  const activeChipLabel = category && subcategory 
    ? CHIP_LABELS[category]?.[subcategory] || null
    : null;

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

  // 카테고리 칩 삭제
  const handleRemoveCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("subcategory");
    window.history.replaceState(null, "", `/search?${params.toString()}`);
    window.location.reload();
  };

  // 필터링된 이벤트
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // 카테고리/서브카테고리 필터링 (TODO: 실제 API 연동 시 서버에서 처리)
    if (category && subcategory) {
      // 현재는 목데이터이므로 태그 기반 필터링
      // 실제로는 API 호출 시 category/subcategory 파라미터 전달
      const chipLabel = CHIP_LABELS[category]?.[subcategory];
      if (chipLabel) {
        // 목데이터 필터링 로직 (실제 구현 시 삭제)
        filtered = filtered.filter((event) =>
          event.tags.some((tag) => tag.includes(chipLabel) || chipLabel.includes(tag))
        );
      }
    }

    // 태그 필터링 (삭제되지 않은 태그를 가진 이벤트만)
    if (visibleTags.length !== allTags.length) {
      filtered = filtered.filter((event) =>
        event.tags.some((tag) => visibleTags.includes(tag))
      );
    }

    return filtered;
  }, [events, visibleTags, allTags.length, category, subcategory]);

  const [page, setPage] = useState(1);

  // 필터 사이드바 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [visibleTags]);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / PAGE_SIZE)
  );
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleEvents = filteredEvents.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );
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
          {/* 카테고리 칩 (사이드바 메뉴에서 선택) */}
          {activeChipLabel && (
            <button
              type="button"
              onClick={handleRemoveCategory}
              className="flex items-center gap-2 rounded-full border border-orange bg-orange/10 px-3 py-1.5 text-sm font-medium text-orange transition-colors hover:brightness-90"
            >
              <span>{activeChipLabel}</span>
              <X className="size-3" />
            </button>
          )}

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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {visibleEvents.map((event, index) => (
            <Fragment key={event.id}>
              <EventCard event={event} />
            </Fragment>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground disabled:opacity-40"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <button
                key={`page-${pageNumber}`}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={
                  pageNumber === page
                    ? "rounded-md bg-orange px-3 py-1.5 text-sm text-white"
                    : "rounded-md border border-border px-3 py-1.5 text-sm text-foreground"
                }
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground disabled:opacity-40"
          >
            다음
          </button>
        </div>
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

export default function SearchPage() {
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
      <SearchContent />
    </Suspense>
  );
}
