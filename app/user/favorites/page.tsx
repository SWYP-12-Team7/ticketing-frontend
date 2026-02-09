
"use client";

import { Fragment, Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { EventCard, type Event } from "@/components/common";
import { EmptyState } from "@/components/common/404/EmptyState";
import type { FilterState } from "@/components/search/FilterSidebar";
import { getFavorites } from "@/services/api/favorite";
import type { FavoriteItem } from "@/types/favorite";
import { RequireAuth } from "@/components/auth";
import { Console } from "console";

const DEFAULT_PAGE_SIZE = 10;
const FilterSidebar = dynamic(
  () => import("@/components/search/FilterSidebar").then((m) => m.FilterSidebar),
  { ssr: false }
);

function formatPeriod(start: string, end: string) {
  return `${start.replace(/-/g, ".")} ~ ${end.replace(/-/g, ".")}`;
}

function mapFavoriteToEvent(item: FavoriteItem): Event {
  return {
    id: String(item.curationId),
    title: item.title,
    category: item.curationType === "POPUP" ? "팝업" : "전시",
    type: item.curationType,
    location: item.region,
    period: formatPeriod(item.startDate, item.endDate),
    imageUrl: item.thumbnail,
    viewCount: 0,
    likeCount: 0,
  };
}

function FavoriteContent() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    type: "",
    regions: [],
    categories: [],
    startDate: null,
    endDate: null,
  });

  const hasClientFilters =
    appliedFilters.regions.length > 0 ||
    appliedFilters.categories.length > 0 ||
    !!appliedFilters.type ||
    !!appliedFilters.startDate ||
    !!appliedFilters.endDate;

  useEffect(() => {
    setPage(1);
  }, [
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
        const response = await getFavorites({
          page: page - 1,
          size: DEFAULT_PAGE_SIZE,
        });
        if (controller.signal.aborted) return;
        setFavorites(response.items ?? []);
        setTotalCount(response.totalElements ?? 0);
        setTotalPages(response.totalPages ?? 1);
      } catch {
        if (controller.signal.aborted) return;
        setFavorites([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [page, hasClientFilters]);

  useEffect(() => {
    if (!hasClientFilters) return;
    const controller = new AbortController();
    const run = async () => {
      setIsLoading(true);
      try {
        const first = await getFavorites({ page: 0, size: DEFAULT_PAGE_SIZE });
        if (controller.signal.aborted) return;
        let allItems = first.items ?? [];
        const pages = first.totalPages ?? 1;
        if (pages > 1) {
          const rest = await Promise.all(
            Array.from({ length: pages - 1 }, (_, i) =>
              getFavorites({ page: i + 1, size: DEFAULT_PAGE_SIZE })
            )
          );
          if (controller.signal.aborted) return;
          allItems = allItems.concat(
            ...rest.flatMap((response) => response.items ?? [])
          );
        }
        if (controller.signal.aborted) return;
        setFavorites(allItems);
        setTotalCount(allItems.length);
        setTotalPages(Math.max(1, Math.ceil(allItems.length / DEFAULT_PAGE_SIZE)));
      } catch {
        if (controller.signal.aborted) return;
        setFavorites([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    run();
    return () => controller.abort();
  }, [hasClientFilters]);

  const events = useMemo(() => favorites.map(mapFavoriteToEvent), [favorites]);

  const visibleEvents = useMemo(() => {
    if (!hasClientFilters) return events;
    const { startDate, endDate, regions, type } = appliedFilters;

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
      if (regions.length > 0) {
        const match = regions.some((region) =>
          event.location ? event.location.includes(region) : false
        );
        if (!match) return false;
      }

      if (type && event.type !== type) return false;

      if (startDate || endDate) {
        const { start, end } = parsePeriod(event.period);
        if (!start || !end) return false;
        const filterStart = startDate ?? start;
        const filterEnd = endDate ?? end;
        if (!(start <= filterEnd && end >= filterStart)) return false;
      }

      return true;
    });
  }, [events, appliedFilters, hasClientFilters]);

  const pagedEvents = useMemo(() => {
    if (!hasClientFilters) return visibleEvents;
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return visibleEvents.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [visibleEvents, hasClientFilters, page]);

  const displayTotalPages = hasClientFilters
    ? Math.max(1, Math.ceil(visibleEvents.length / DEFAULT_PAGE_SIZE))
    : totalPages;

  return (
    <main className="min-h-screen bg-background py-5">
      <div className="relative mx-auto max-w-7xl py-10">
        <div className="mb-6 flex items-center w-[1280px] justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-medium text-orange">
              {hasClientFilters ? visibleEvents.length : totalCount}
            </span>
            <span className="text-2xl font-medium text-foreground mb-5">
              개의 찜한 행사가 있어요!
            </span>
          </div>

          <div className="flex items-center gap-3">
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

        {visibleEvents.length === 0 && !isLoading ? (
          <div className="min-h-[calc(100vh-100px-220px)] flex items-center justify-center">
            <EmptyState message="찜한 행사가 없습니다" />
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

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setAppliedFilters}
      />
    </main>
  );
}

export default function FavoritePage() {
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
      <RequireAuth>
        <FavoriteContent />
      </RequireAuth>
    </Suspense>
  );
}
