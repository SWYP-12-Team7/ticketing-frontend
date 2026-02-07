"use client";

import { Fragment, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard, type Event } from "@/components/common";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import Image from "next/image";
import { searchCurations } from "@/services/api/search";

const DEFAULT_PAGE_SIZE = 15;

function SearchContent() {
  const searchParams = useSearchParams();

  // URL에서 파라미터 추출
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";
  const sizeParamRaw = searchParams.get("size");
  const size = Math.max(
    1,
    Number(sizeParamRaw || DEFAULT_PAGE_SIZE) || DEFAULT_PAGE_SIZE
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);


  // 필터 사이드바 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [keyword, type, category, subcategory, size]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      try {
        const categoryParam = subcategory || category;
        const { events: fetched, total, totalPages: pages } =
          await searchCurations({
            keyword: keyword || undefined,
            type: type || undefined,
            category: categoryParam || undefined,
            page,
            size,
          });
        if (controller.signal.aborted) return;
        setEvents(fetched);
        setTotalCount(total);
        setTotalPages(pages);
      } catch {
        if (controller.signal.aborted) return;
        setEvents([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    run();
    return () => controller.abort();
  }, [keyword, type, category, subcategory, page, size]);
  const visibleEvents = events;

  return (
    <main className="min-h-screen bg-background py-5">
      <div className="mx-auto max-w-300 px-5 py-10">
        {/* 헤더: 검색 결과 수 + 정렬/필터 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-orange">
              {totalCount}
            </span>
            <span className="text-2xl font-medium text-foreground mb-5">
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

        {/* 태그/필터 칩 제거 (사이드바 패널로만 조작) */}

        {/* 카드 그리드 */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
          </div>
        )}
        <div className="flex flex-wrap gap-6">
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
