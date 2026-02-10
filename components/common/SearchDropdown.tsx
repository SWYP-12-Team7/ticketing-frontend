"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "recent-searches";
const MAX_SEARCHES = 10;

interface SearchDropdownProps {
  className?: string;
  onSearch?: (keyword: string) => void;
}

function getStoredSearches(): string[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function SearchDropdown({ className, onSearch }: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isFocused, setIsFocused] = useState(false); // 포커스 상태
  const [recentSearches, setRecentSearches] = useState<string[]>(getStoredSearches);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 검색어 저장
  const saveSearch = (search: string) => {
    const trimmed = search.trim();
    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter((s) => s !== trimmed),
    ].slice(0, MAX_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // 검색 실행
  const handleSearch = (search: string) => {
    const trimmed = search.trim();
    if (!trimmed) return;

    saveSearch(trimmed);
    setKeyword(trimmed);
    setIsOpen(false);
    setIsFocused(false); // 포커스 해제 (blur 효과)
    inputRef.current?.blur(); // 실제로 blur 처리
    onSearch?.(trimmed);
  };

  // 개별 삭제
  const handleDeleteOne = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // 닫기
  const handleClose = () => {
    setIsOpen(false);
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(keyword);
    }
  };

  // 검색어 변경 핸들러
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // 포커스 핸들러
  const handleInputFocus = () => {
    setIsOpen(true);
    setIsFocused(true);
  };

  // 블러 핸들러
  const handleInputBlur = () => {
    setIsFocused(false);
  };

  // X 버튼 클릭 핸들러
  const handleClear = () => {
    setKeyword("");
    setIsFocused(true);
    inputRef.current?.focus(); // 포커스 유지
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* 검색 Input (Figma 스펙: 448px × 57px) */}
      <div
        className={cn(
          "flex items-center rounded-full border transition-colors",
          // Figma 스펙: padding 16px 24px, gap 8px
          "px-6 py-4 gap-2",
          // Figma 스펙: width 448px, height 57px
          "w-[448px] h-[57px]",
          // 상태별 스타일
          isFocused || (keyword && isOpen)
            ? "border-[#F36012] bg-white" // 포커스 또는 입력 중: 오렌지 테두리
            : keyword
            ? "border-[#D3D5DC] bg-white" // 검색 완료 (포커스 해제): 회색 테두리
            : "border-[#D3D5DC] bg-white hover:bg-[#F9FAFB]" // default
        )}
      >
        {/* 검색 아이콘 */}
        <button
          type="button"
          onClick={() => handleSearch(keyword)}
          aria-label="검색"
          className="shrink-0"
        >
          <Search className="size-6 text-[#6C7180]" strokeWidth={1.5} />
        </button>

        {/* Input (항상 표시 - 검색 완료 후에도 바로 입력 가능) */}
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={handleKeywordChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해주세요"
          className="flex-1 bg-transparent text-sm leading-[180%] outline-none text-[#202937] placeholder:text-[#A6ABB7] placeholder:leading-[180%]"
        />

        {/* X 버튼 (검색어 있을 때만 표시) */}
        {keyword && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="shrink-0"
          >
            <X className="size-6 text-[#6C7180]" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* 최근 검색어 드롭다운 */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-border bg-background shadow-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-base font-semibold text-foreground">
              최근 검색어
            </span>
            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAll}
                className="text-sm text-primary hover:underline"
              >
                전체삭제
              </button>
            )}
          </div>

          {/* 검색어 목록 */}
          <div className="max-h-[240px] overflow-y-auto px-5">
            {recentSearches.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                최근 검색어가 없습니다
              </p>
            ) : (
              <ul className="space-y-1">
                {recentSearches.map((search) => (
                  <li
                    key={search}
                    className="flex items-center justify-between py-2"
                  >
                    <button
                      type="button"
                      onClick={() => handleSearch(search)}
                      className="flex-1 truncate text-left text-sm text-foreground hover:text-primary"
                    >
                      {search}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(search)}
                      className="ml-2 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={`${search} 삭제`}
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 닫기 버튼 */}
          <div className="border-t border-border px-5 py-3">
            <button
              type="button"
              onClick={handleClose}
              className="w-full text-right text-sm text-muted-foreground hover:text-foreground"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
