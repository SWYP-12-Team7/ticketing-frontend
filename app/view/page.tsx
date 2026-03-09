"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CalendarView } from "@/components/calendarview/CalendarView";
import { HotEventSection } from "@/components/calendarview/HotEventSection";
import {
  KakaoMap,
  MapFilterBar,
  MapHoverCard,
  MapEventSection,
} from "@/components/map";
import {
  FilterSidebar,
  type FilterState,
} from "@/components/search/FilterSidebar";
import { useMapCurations } from "@/queries/map/useMapCurations";
import type { Event } from "@/components/common";

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface MapLocation extends Location {
  event: Event;
}

interface MapViewContentProps {
  onVisibleIdsChange?: (ids: string[]) => void;
  onClusterIdsChange?: (ids: string[]) => void;
  locations: MapLocation[];
  filterBar?: React.ReactNode;
  searchCenter?: { lat: number; lng: number };
  searchLevel?: number;
}

function MapViewContent({
  onVisibleIdsChange,
  onClusterIdsChange,
  locations,
  filterBar,
  searchCenter,
  searchLevel,
}: MapViewContentProps) {
  const router = useRouter();
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(
    null
  );

  const markerLocations = useMemo(
    () =>
      locations.map(({ id, title, lat, lng }) => ({
        id,
        title,
        lat,
        lng,
      })),
    [locations]
  );

  const handleMarkerClick = (location: Location) => {
    // 클릭 시 상세 페이지로 이동
    router.push(`/detail/${location.id}`);
  };

  const handleMarkerHover = (location: Location | null) => {
    if (location) {
      const found = locations.find((l) => l.id === location.id);
      setHoveredLocation(found || null);
    } else {
      setHoveredLocation(null);
    }
  };

  return (
    <section aria-label="지도 뷰" className="mapViewPage__section w-full min-w-0">
      <div className="mapViewPage__container relative h-[650px] w-full min-w-0 flex-shrink-0 rounded-xl overflow-hidden">
        <KakaoMap
          center={{ lat: 37.5665, lng: 126.978 }}
          level={8}
          maxLevel={5}
          locations={markerLocations}
          onMarkerClick={handleMarkerClick}
          onMarkerHover={handleMarkerHover}
          onClusterClick={onClusterIdsChange}
          onVisibleLocationIdsChange={onVisibleIdsChange}
          controlledCenter={searchCenter}
          controlledLevel={searchLevel}
          showSearch={false}
          className="h-full w-full"
        />

        {/* 필터 칩 바 */}
        {filterBar}

        {/* 호버된 이벤트 카드 */}
        {hoveredLocation && (
          <div className="absolute bottom-6 left-1/2 z-10 w-[300px] -translate-x-1/2 pointer-events-none">
            <MapHoverCard event={hoveredLocation.event} />
          </div>
        )}
      </div>
    </section>
  );
}

const DEFAULT_FILTERS: FilterState = {
  type: "",
  regions: [],
  categories: [],
  startDate: null,
  endDate: null,
};

function ViewContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "calendar";
  const regionParam = searchParams.get("region") || undefined;
  const categoryParam =
    searchParams.get("category") || undefined;
  const subCategoryParam =
    searchParams.get("subCategory") || undefined;
  const periodParam = searchParams.get("period") || undefined;
  const [visibleIds, setVisibleIds] = useState<string[] | null>(
    null
  );
  const [clusterIds, setClusterIds] = useState<string[] | null>(
    null
  );

  // 필터 상태
  const [filters, setFilters] = useState<FilterState>(
    DEFAULT_FILTERS
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSection, setSidebarSection] = useState("category");
  const [searchTarget, setSearchTarget] = useState<{
    lat: number;
    lng: number;
    label: string;
  } | null>(null);
  const [searchLevel, setSearchLevel] = useState<number | null>(null);

  const openSidebar = useCallback((section: string) => {
    setSidebarSection(section);
    setSidebarOpen(true);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleApplyFilters = useCallback(
    (next: FilterState) => {
      setFilters(next);
    },
    []
  );

  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  // FilterState → API 파라미터 변환
  const apiRegion = filters.regions[0] || regionParam;
  const apiCategory =
    filters.type || categoryParam || undefined;
  const apiSubCategory =
    filters.categories[0] || subCategoryParam;

  const { data: mapCurations = [] } = useMapCurations({
    date: today,
    region: apiRegion,
    category: apiCategory,
    subCategory: apiSubCategory,
    period: periodParam,
  });

  const mapLocations = useMemo<MapLocation[]>(
    () =>
      mapCurations
        .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude))
        .map((item) => {
          const event: Event = {
            id: String(item.id),
            title: item.title,
            category: item.type === "EXHIBITION" ? "전시" : "팝업",
            type: item.type,
            period: item.dateText ?? "",
            imageUrl: item.thumbnail || "/images/mockImg.png",
            viewCount: item.viewCount ?? 0,
            likeCount: item.likeCount ?? 0,
            tags: item.category,
          };

          return {
            id: String(item.id),
            title: item.title,
            lat: item.latitude,
            lng: item.longitude,
            event,
          };
        }),
    [mapCurations]
  );

  // 현재 지도 화면에 보이는 마커 기준으로 이벤트 필터링
  const handleVisibleIdsChange = (ids: string[]) => {
    if (clusterIds) return;
    setVisibleIds(ids);
  };

  const handleClusterIdsChange = (ids: string[]) => {
    setClusterIds(ids);
  };

  // 필터 초기화 (전체 보기)
  const handleResetFilter = () => {
    setClusterIds(null);
    setVisibleIds(null);
  };

  // 이벤트 목록 - 실데이터 사용
  const displayEvents = useMemo(() => {
    const allEvents = mapLocations.map((loc) => loc.event);
    if (clusterIds) return allEvents.filter((event) => clusterIds.includes(event.id));
    if (!visibleIds) return allEvents; // 필터 없으면 전체 이벤트
    return allEvents.filter((event) => visibleIds.includes(event.id));
  }, [clusterIds, visibleIds, mapLocations]);

  return (
    <main className="w-full py-6">
      {/* 지도 또는 캘린더 뷰 */}
      {mode === "map" ? (
        <Suspense
          fallback={
            <div className="h-[650px] rounded-xl bg-muted animate-pulse" />
          }
        >
          <MapViewContent
            onVisibleIdsChange={handleVisibleIdsChange}
            onClusterIdsChange={handleClusterIdsChange}
            locations={mapLocations}
            searchCenter={
              searchTarget
                ? { lat: searchTarget.lat, lng: searchTarget.lng }
                : undefined
            }
            searchLevel={searchLevel ?? undefined}
            filterBar={
              <MapFilterBar
                filters={filters}
                onChipClick={openSidebar}
                onReset={resetFilters}
                onSearchSelect={(payload) => {
                  setSearchTarget(payload);
                  setSearchLevel(3);
                }}
              />
            }
          />
          <FilterSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onApply={handleApplyFilters}
            defaultSection={sidebarSection}
            initialFilters={filters}
          />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <div className="rounded-xl bg-[#FFFBF4] p-4">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          }
        >
          <CalendarView />
        </Suspense>
      )}

      {/* HOT EVENT 섹션 */}
      {mode === "map" ? (
        <MapEventSection
          events={displayEvents}
          onResetFilter={handleResetFilter}
          isFiltered={!!(clusterIds || visibleIds)}
        />
      ) : (
        <HotEventSection sortBy="popular" />
      )}
    </main>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <main className="w-full py-6">
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
