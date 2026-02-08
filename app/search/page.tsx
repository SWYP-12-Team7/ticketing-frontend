"use client";

import { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EventCard, type Event } from "@/components/common";
import { EmptyState } from "@/components/common/404/EmptyState";
import type { FilterState } from "@/components/search/FilterSidebar";
import dynamic from "next/dynamic";
import Image from "next/image";
import { searchCurations } from "@/services/api/search";

const DEFAULT_PAGE_SIZE = 15;
const FilterSidebar = dynamic(
  () => import("@/components/search/FilterSidebar").then((m) => m.FilterSidebar),
  { ssr: false }
);

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
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    type: "",
    regions: [],
    categories: [],
    startDate: null,
    endDate: null,
  });

  const [page, setPage] = useState(1);

  const hasClientFilters =
    appliedFilters.regions.length > 0 ||
    !!appliedFilters.startDate ||
    !!appliedFilters.endDate;

  // 필터 사이드바 상태
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터 변경 시 페이지 리셋
  useEffect(() => {
    setPage(1);
  }, [
    keyword,
    type,
    category,
    subcategory,
    size,
    appliedFilters.type,
    appliedFilters.categories,
    appliedFilters.regions,
    appliedFilters.startDate,
    appliedFilters.endDate,
  ]);

  useEffect(() => {
    if (hasClientFilters) return;
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      try {
        const selectedCategory =
          appliedFilters.categories[0] || subcategory || category;
        const typeParam = appliedFilters.type || type;
        const { events: fetched, total, totalPages: pages } =
          await searchCurations({
            keyword: keyword || undefined,
            type: typeParam || undefined,
            category: selectedCategory || undefined,
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
  }, [
    keyword,
    type,
    category,
    subcategory,
    page,
    size,
    appliedFilters.type,
    appliedFilters.categories,
    hasClientFilters,
  ]);

  useEffect(() => {
    if (!hasClientFilters) return;
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      try {
        const selectedCategory =
          appliedFilters.categories[0] || subcategory || category;
        const typeParam = appliedFilters.type || type;
        const baseParams = {
          keyword: keyword || undefined,
          type: typeParam || undefined,
          category: selectedCategory || undefined,
          size,
        };
        const first = await searchCurations({
          ...baseParams,
          page: 1,
        });
        if (controller.signal.aborted) return;
        let allEvents = first.events;
        const pages = first.totalPages;
        if (pages > 1) {
          const rest = await Promise.all(
            Array.from({ length: pages - 1 }, (_, i) =>
              searchCurations({ ...baseParams, page: i + 2 })
            )
          );
          if (controller.signal.aborted) return;
          allEvents = allEvents.concat(
            ...rest.flatMap((response) => response.events)
          );
        }
        if (controller.signal.aborted) return;
        setEvents(allEvents);
        setTotalCount(allEvents.length);
        setTotalPages(Math.max(1, Math.ceil(allEvents.length / size)));
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
  }, [
    keyword,
    type,
    category,
    subcategory,
    size,
    appliedFilters.type,
    appliedFilters.categories,
    appliedFilters.regions,
    appliedFilters.startDate,
    appliedFilters.endDate,
    hasClientFilters,
  ]);
  const visibleEvents = useMemo(() => {
    const { startDate, endDate, regions } = appliedFilters;
    const hasRegionFilter = regions.length > 0;
    const hasDateFilter = !!startDate || !!endDate;
    if (!hasRegionFilter && !hasDateFilter) return events;

    const toDate = (value: string) => {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const parsePeriod = (period?: string) => {
      if (!period) return { start: null, end: null };
      const parts = period.split("~").map((p) => p.trim());
      const start = toDate(parts[0] || "");
      const end = toDate(parts[1] || "");
      return { start, end };
    };

    return events.filter((event) => {
      if (hasRegionFilter && event.location) {
        if (!regions.includes(event.location)) return false;
      } else if (hasRegionFilter) {
        return false;
      }
      const { start, end } = parsePeriod(event.period);
      if (!start || !end) return !hasDateFilter;
      const filterStart = startDate ?? start;
      const filterEnd = endDate ?? end;
      return start <= filterEnd && end >= filterStart;
    });
  }, [events, appliedFilters]);

  const pagedEvents = useMemo(() => {
    if (!hasClientFilters) return visibleEvents;
    const start = (page - 1) * size;
    return visibleEvents.slice(start, start + size);
  }, [visibleEvents, hasClientFilters, page, size]);

  const displayCount = hasClientFilters ? visibleEvents.length : totalCount;
  const displayTotalPages = hasClientFilters
    ? Math.max(1, Math.ceil(visibleEvents.length / size))
    : totalPages;

    

  return (
    <main className="min-h-screen bg-background py-5">
      <div className="relative mx-auto max-w-7xl py-10">
        {/* 헤더: 검색 결과 수 + 정렬/필터 */}
        <div className="mb-6 flex items-center w-[1280px] justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-orange">
              {displayCount}
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
      
        {visibleEvents.length === 0 && !isLoading ? (
          <div className="min-h-[calc(100vh-100px-220px)] flex items-center justify-center">
            <EmptyState message="일치하는 데이터가 없습니다" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pagedEvents.map((event) => (
              <Fragment key={event.id}>
                <EventCard event={event} showMeta={false} />
              </Fragment>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {visibleEvents.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground disabled:opacity-40"
            >
              이전
            </button>
            {Array.from({ length: displayTotalPages }, (_, i) => i + 1).map(
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
              onClick={() => setPage((p) => Math.min(displayTotalPages, p + 1))}
              disabled={page === displayTotalPages}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground disabled:opacity-40"
            >
              다음
            </button>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-10 flex min-h-[50vh] items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
          </div>
        )}

      </div>

      {/* 필터 사이드바 */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setAppliedFilters}
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
