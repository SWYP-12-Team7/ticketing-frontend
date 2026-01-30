"use client";

import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  WISHLIST_PAGINATION_CONFIG,
  WISHLIST_ARIA_LABELS,
} from "./wishlist.constants";

interface WishlistPaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void;
}

/**
 * 찜 목록 페이지네이션 컴포넌트
 * - 이전/다음 페이지 버튼
 * - 페이지 번호 버튼 (최대 7개 표시)
 * - 생략 표시 (...)
 *
 * 성능 최적화:
 * - memo를 사용하여 불필요한 리렌더링 방지
 * - useMemo를 사용하여 페이지 번호 계산 최적화
 */
export const WishlistPagination = memo(function WishlistPagination({
  currentPage,
  totalPages,
  onPageChange,
}: WishlistPaginationProps) {
  /**
   * 페이지 번호 생성
   * - 최대 7개 페이지 번호 표시
   * - 현재 페이지 주변 표시
   * - 첫 페이지와 마지막 페이지는 항상 표시
   */
  const pageNumbers = useMemo(() => {
    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
    const { MAX_VISIBLE_PAGES } = WISHLIST_PAGINATION_CONFIG;

    // 페이지가 7개 이하면 모두 표시
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 항상 첫 페이지 표시
    pages.push(1);

    // 생략 표시 (시작)
    if (currentPage > 3) {
      pages.push("ellipsis-start");
    }

    // 현재 페이지 주변 표시
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 생략 표시 (끝)
    if (currentPage < totalPages - 2) {
      pages.push("ellipsis-end");
    }

    // 항상 마지막 페이지 표시
    pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  // 페이지가 1개뿐이면 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav
      className="wishlistPagination flex items-center justify-center"
      aria-label={WISHLIST_ARIA_LABELS.PAGINATION}
    >
      <div className="wishlistPagination__container flex items-center gap-1">
        {/* 이전 페이지 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="wishlistPagination__prevButton"
          aria-label={WISHLIST_ARIA_LABELS.PREVIOUS_PAGE}
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Button>

        {/* 페이지 번호 버튼 */}
        <div className="wishlistPagination__pages flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            // 생략 표시
            if (typeof page === "string") {
              return (
                <span
                  key={page}
                  className="wishlistPagination__ellipsis flex size-10 items-center justify-center text-body-medium text-muted-foreground"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            // 페이지 번호 버튼
            const isCurrentPage = page === currentPage;
            return (
              <Button
                key={page}
                type="button"
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className={cn(
                  "wishlistPagination__pageButton",
                  isCurrentPage && "pointer-events-none"
                )}
                aria-label={WISHLIST_ARIA_LABELS.GO_TO_PAGE(page)}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                <span className="text-body-medium">{page}</span>
              </Button>
            );
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="wishlistPagination__nextButton"
          aria-label={WISHLIST_ARIA_LABELS.NEXT_PAGE}
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
});
