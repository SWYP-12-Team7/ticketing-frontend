"use client";

import { X, ChevronUp, Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  resultCount?: number;
  onApply?: (filters: FilterState) => void;
}

interface FilterState {
  regions: string[];
  categories: string[];
  status: string[];
  price: string[];
}

const REGIONS = [
  "서울", "경기", "인천", "충남", "충북", "대전", "강원", "전남", "전북", "전주", "경남", "경북", "울산", "부산", "대구", "제주"
];

const CATEGORIES = {
  팝업스토어: ["패션", "뷰티", "F&B", "캐릭터", "테크", "라이프스타일", "가구/인테리어"],
  전시: ["현대미술", "사진", "디자인", "일러스트", "회화", "조각", "설치미술"],
};

const STATUS = ["행사 중", "행사 예정"];
const PRICE = ["무료", "유료"];

export function FilterSidebar({ isOpen, onClose, resultCount = 0, onApply }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    region: true,
    category: true,
    date: true,
    status: true,
    price: true,
  });

  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    categories: [],
    status: [],
    price: [],
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
    onClose();
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ backgroundColor: "rgba(18, 18, 18, 0.4)" }}
        onClick={onClose}
      />

      {/* 사이드바 */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <button type="button" onClick={onClose}>
            <X className="size-6" />
          </button>
          <h2 className="text-lg font-semibold">필터</h2>
          <div className="size-6" /> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 필터 내용 */}
        <div className="h-[calc(100%-140px)] overflow-y-auto px-6 py-4">
          {/* 지역 */}
          <div className="border-b border-border pb-4">
            <button
              type="button"
              onClick={() => toggleSection("region")}
              className="flex w-full items-center justify-between py-2"
            >
              <span className="text-lg font-semibold">지역</span>
              <ChevronUp
                className={cn(
                  "size-5 transition-transform",
                  !expandedSections.region && "rotate-180"
                )}
              />
            </button>
            {expandedSections.region && (
              <div className="mt-3 flex flex-wrap gap-2">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => toggleFilter("regions", region)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      filters.regions.includes(region)
                        ? "border-orange bg-orange text-white"
                        : "border-border text-foreground hover:border-orange"
                    )}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 카테고리 */}
          <div className="border-b border-border py-4">
            <button
              type="button"
              onClick={() => toggleSection("category")}
              className="flex w-full items-center justify-between py-2"
            >
              <span className="text-lg font-semibold">카테고리</span>
              <ChevronUp
                className={cn(
                  "size-5 transition-transform",
                  !expandedSections.category && "rotate-180"
                )}
              />
            </button>
            {expandedSections.category && (
              <div className="mt-3 space-y-4">
                {Object.entries(CATEGORIES).map(([group, items]) => (
                  <div key={group}>
                    <p className="mb-2 text-sm text-muted-foreground">{group}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleFilter("categories", item)}
                          className={cn(
                            "rounded-full border px-4 py-1.5 text-sm transition-colors",
                            filters.categories.includes(item)
                              ? "border-orange bg-orange text-white"
                              : "border-border text-foreground hover:border-orange"
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 일시 */}
          <div className="border-b border-border py-4">
            <button
              type="button"
              onClick={() => toggleSection("date")}
              className="flex w-full items-center justify-between py-2"
            >
              <span className="text-lg font-semibold">일시</span>
              <ChevronUp
                className={cn(
                  "size-5 transition-transform",
                  !expandedSections.date && "rotate-180"
                )}
              />
            </button>
            {expandedSections.date && (
              <div className="mt-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground hover:border-orange"
                >
                  <span>기간을 선택하세요!</span>
                  <Calendar className="size-5" />
                </button>
              </div>
            )}
          </div>

          {/* 현황 */}
          <div className="border-b border-border py-4">
            <button
              type="button"
              onClick={() => toggleSection("status")}
              className="flex w-full items-center justify-between py-2"
            >
              <span className="text-lg font-semibold">현황</span>
              <ChevronUp
                className={cn(
                  "size-5 transition-transform",
                  !expandedSections.status && "rotate-180"
                )}
              />
            </button>
            {expandedSections.status && (
              <div className="mt-3 space-y-3">
                {STATUS.map((status) => (
                  <label
                    key={status}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter("status", status)}
                      className="size-5 accent-orange"
                    />
                    <span className="text-sm">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 가격 */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => toggleSection("price")}
              className="flex w-full items-center justify-between py-2"
            >
              <span className="text-lg font-semibold">가격</span>
              <ChevronUp
                className={cn(
                  "size-5 transition-transform",
                  !expandedSections.price && "rotate-180"
                )}
              />
            </button>
            {expandedSections.price && (
              <div className="mt-3 space-y-3">
                {PRICE.map((price) => (
                  <label
                    key={price}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={filters.price.includes(price)}
                      onChange={() => toggleFilter("price", price)}
                      className="size-5 accent-orange"
                    />
                    <span className="text-sm">{price}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 border-t border-border bg-white px-6 py-4">
          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full border border-border"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 20V12M12 12V4M12 12H20M12 12H4"
                stroke="#121212"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 rounded-full bg-orange py-4 text-center font-semibold text-white transition-colors hover:brightness-90"
          >
            {resultCount}개 행사 검색
          </button>
        </div>
      </div>
    </>
  );
}
