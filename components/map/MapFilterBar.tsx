"use client";

import { RotateCcw, ChevronDown, Search, X } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { FilterState } from "@/components/search/FilterSidebar";

const POPUP_CATEGORIES = [
  "패션", "뷰티", "F&B", "캐릭터",
  "테크", "라이프스타일", "가구/인테리어",
];
const EXHIBITION_CATEGORIES = [
  "현대미술", "사진", "디자인", "일러스트",
  "회화", "조각", "설치미술",
];

interface MapFilterBarProps {
  filters: FilterState;
  onChipClick: (section: string) => void;
  onReset: () => void;
  onSearchSelect?: (payload: { lat: number; lng: number; label: string }) => void;
}

export function MapFilterBar({
  filters,
  onChipClick,
  onReset,
  onSearchSelect,
}: MapFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; place_name: string; address_name: string; x: string; y: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim() || isSearching) return;
    if (!("kakao" in window)) return;

    setIsSearching(true);
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchQuery, (data, status) => {
      setIsSearching(false);
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data as unknown as typeof searchResults);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    });
  }, [searchQuery, isSearching, searchResults]);

  const handleSelectResult = (result: (typeof searchResults)[number]) => {
    setShowResults(false);
    setSearchQuery(result.place_name);
    onSearchSelect?.({
      lat: parseFloat(result.y),
      lng: parseFloat(result.x),
      label: result.place_name,
    });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const hasRegion = filters.regions.length > 0;
  const hasPopup =
    filters.type === "POPUP" ||
    filters.categories.some((c) =>
      POPUP_CATEGORIES.includes(c)
    );
  const hasExhibition =
    filters.type === "EXHIBITION" ||
    filters.categories.some((c) =>
      EXHIBITION_CATEGORIES.includes(c)
    );
  const hasCategory = hasPopup || hasExhibition;
  const hasAnyFilter =
    hasRegion ||
    hasCategory ||
    !!filters.startDate ||
    !!filters.endDate;

  const regionLabel =
    filters.regions.length === 1
      ? filters.regions[0]
      : filters.regions.length > 1
        ? `지역 ${filters.regions.length}`
        : "지역";

  return (
    <div className="absolute top-4 left-4 right-4 z-10">
      <div
        className={cn(
          "flex items-center gap-4",
          "rounded-full border border-black/10 bg-[#FFFFFF80] px-4 py-2",
          "shadow-[0_4px_12px_3px_rgba(0,0,0,0.15)]"
        )}
      >
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-hide">
          {/* 초기화 */}
          <button
            type="button"
            onClick={onReset}
            disabled={!hasAnyFilter}
          className={cn(
            "flex shrink-0 items-center gap-1",
            "rounded-full border px-3 py-1.5",
            "text-sm font-normal shadow-sm transition-colors",
            hasAnyFilter
              ? "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
              : "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
          )}
        >
            <RotateCcw className="size-3.5" />
            초기화
          </button>

          {/* 카테고리 */}
          <button
            type="button"
            onClick={() => onChipClick("category")}
            className={cn(
              "flex shrink-0 items-center gap-1",
              "rounded-full border px-3 py-1.5",
              "text-sm font-normal shadow-sm transition-colors",
              hasCategory
                ? "border-[#4B5462] bg-[#6C7180] text-white"
                : "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
            )}
          >
            카테고리
            <ChevronDown className="size-3.5" />
          </button>

          {/* 지역 */}
          <button
            type="button"
            onClick={() => onChipClick("region")}
            className={cn(
              "flex shrink-0 items-center gap-1",
              "rounded-full border px-3 py-1.5",
              "text-sm font-normal shadow-sm transition-colors",
              hasRegion
                ? "border-[#4B5462] bg-[#6C7180] text-white"
                : "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
            )}
          >
            {regionLabel}
            <ChevronDown className="size-3.5" />
          </button>

          {/* 팝업스토어 */}
          <button
            type="button"
            onClick={() => onChipClick("popup")}
            className={cn(
              "flex shrink-0 items-center gap-1",
              "rounded-full border px-3 py-1.5",
              "text-sm font-normal shadow-sm transition-colors",
              hasPopup
                ? "border-[#4B5462] bg-[#6C7180] text-white"
                : "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
            )}
          >
            팝업스토어
            <ChevronDown className="size-3.5" />
          </button>

          {/* 전시 */}
          <button
            type="button"
            onClick={() => onChipClick("exhibition")}
            className={cn(
              "flex shrink-0 items-center gap-1",
              "rounded-full border px-3 py-1.5",
              "text-sm font-normal shadow-sm transition-colors",
              hasExhibition
                ? "border-[#4B5462] bg-[#6C7180] text-white"
                : "border-[#D3D5DC] bg-white/90 text-[#4B5462]"
            )}
          >
            전시
            <ChevronDown className="size-3.5" />
          </button>
        </div>

        <div className="relative flex min-w-0 flex-1 justify-center">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="장소 검색"
              className="h-9 w-[420px] max-w-full rounded-full border border-gray-200 bg-white px-4 pr-20 text-sm shadow-sm focus:border-orange focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-orange p-1.5 text-white hover:bg-orange/90 disabled:opacity-50"
              aria-label="검색"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          {showResults && searchResults.length > 0 && (
            <ul className="absolute left-1/2 top-full mt-1 max-h-60 w-[420px] -translate-x-1/2 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-md">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {result.place_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.address_name}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
