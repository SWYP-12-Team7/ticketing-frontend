"use client";

import { WishlistContainer } from "@/components/wishlist";
import { useUserNickname } from "@/contexts/UserContext";
import { Suspense } from "react";

/**
 * 찜 목록 페이지
 *
 * 기능:
 * - 사용자가 좋아요 표시한 이벤트 목록 표시
 * - 정렬/필터링 기능
 * - 페이지네이션
 * - 빈 상태 처리
 *
 * 요구사항:
 * - Google/AWS/Meta 수준의 코드 품질
 * - 유지보수 용이성
 * - 시맨틱 HTML
 * - 명확한 className
 */
export default function WishlistPage() {
  const userNickname = useUserNickname("스위프");

  return (
    <div className="wishlistPage min-h-screen bg-background">
      <div className="wishlistPage__container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <header className="wishlistPage__header mb-8">
          <h1 className="wishlistPage__title text-heading-large text-foreground">
            <span className="text-primary">{userNickname}</span> 님이 찜한
            행사들이에요!
          </h1>
        </header>

        {/* 찜 목록 컨텐츠 */}
        <Suspense
          fallback={
            <div className="wishlistPage__loading flex min-h-[400px] items-center justify-center">
              <div className="wishlistPage__loadingSpinner size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          }
        >
          <WishlistContainer userNickname={userNickname} />
        </Suspense>
      </div>
    </div>
  );
}
