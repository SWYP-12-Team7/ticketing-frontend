"use client";

import { memo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";

interface WishlistCategory {
  id: string;
  label: string;
  count: number;
  thumbnails: string[];
}

interface WishlistCategorySectionProps {
  categories: WishlistCategory[];
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory?: () => void;
}

/**
 * 찜 목록 카테고리 섹션
 * - 횡스크롤 카테고리 네비게이션
 * - 각 카테고리는 2x2 썸네일 그리드 표시
 * - 선택된 카테고리 강조 (빨간 배경)
 * - 카테고리 추가 버튼
 */
export const WishlistCategorySection = memo(function WishlistCategorySection({
  categories,
  selectedCategoryId,
  onCategoryChange,
  onAddCategory,
}: WishlistCategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // 스크롤 가능 여부 체크
  const updateArrowsVisibility = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateArrowsVisibility();
    window.addEventListener("resize", updateArrowsVisibility);
    return () => window.removeEventListener("resize", updateArrowsVisibility);
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 320;
    const newScrollLeft =
      direction === "left"
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="wishlistCategorySection relative mb-8"
      aria-label="찜 목록 카테고리"
    >
      {/* 왼쪽 스크롤 버튼 */}
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="wishlistCategorySection__scrollButton wishlistCategorySection__scrollButton--left absolute left-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
          aria-label="이전 카테고리 보기"
        >
          <ChevronLeft className="size-5 text-gray-700" />
        </button>
      )}

      {/* 카테고리 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        onScroll={updateArrowsVisibility}
        className="wishlistCategorySection__scrollContainer scrollbar-hide flex gap-4 overflow-x-auto py-2"
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "wishlistCategorySection__categoryCard group relative flex min-w-[220px] flex-shrink-0 flex-col gap-3 rounded-2xl p-4 transition-all duration-300",
                isSelected
                  ? "bg-[#FF6B6B] shadow-lg ring-2 ring-[#FF6B6B] ring-offset-2"
                  : "bg-[#FFF5E6] hover:bg-[#FFE8CC] hover:shadow-md"
              )}
              aria-pressed={isSelected}
              aria-label={`${category.label} ${category.count}개 카테고리`}
            >
              {/* 카테고리 헤더 */}
              <div className="wishlistCategorySection__categoryHeader flex items-baseline justify-start gap-1">
                <span
                  className={cn(
                    "text-body-medium-bold",
                    isSelected ? "text-white" : "text-[#FF6B6B]"
                  )}
                >
                  {category.label}
                </span>
                <span
                  className={cn(
                    "text-body-small",
                    isSelected ? "text-white/90" : "text-[#FF6B6B]/80"
                  )}
                >
                  {category.count}
                </span>
              </div>

              {/* 썸네일 그리드 (2x2) */}
              <div className="wishlistCategorySection__thumbnailGrid grid grid-cols-2 gap-2">
                {category.thumbnails.slice(0, 4).map((thumbnail, index) => (
                  <div
                    key={`${category.id}-thumb-${index}`}
                    className="wishlistCategorySection__thumbnail relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
                  >
                    <Image
                      src={thumbnail}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </button>
          );
        })}

        {/* 카테고리 추가 버튼 */}
        {onAddCategory && (
          <button
            type="button"
            onClick={onAddCategory}
            className="wishlistCategorySection__addButton flex min-w-[100px] flex-shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#FFB380] bg-white transition-all hover:border-[#FF6B6B] hover:bg-[#FFF5E6]"
            aria-label="새 카테고리 추가"
          >
            <Plus className="size-8 text-[#FFB380]" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* 오른쪽 스크롤 버튼 */}
      {showRightArrow && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="wishlistCategorySection__scrollButton wishlistCategorySection__scrollButton--right absolute right-0 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
          aria-label="다음 카테고리 보기"
        >
          <ChevronRight className="size-5 text-gray-700" />
        </button>
      )}
    </section>
  );
});
