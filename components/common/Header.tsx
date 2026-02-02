"use client";

import { cn } from "@/lib/utils";
// ============================================
// [SWYP-108] Sidebar 고도화 - X 아이콘 추가
// 작성일: 2026-02-01
// 변경 이유: Sidebar 열림 상태에서 닫기 버튼 표시
// 이전 코드: import { Menu, Bell, Heart, User, Map, Calendar } from "lucide-react";
// ============================================
import { Menu, Bell, Heart, User, Map, Calendar, X } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import { HeaderSideBar } from "./HeaderSideBar";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isViewPage = pathname === "/view";
  const currentMode = searchParams.get("mode");

  return (
    <>
      {/* ============================================
          [SWYP-108] Header z-index 상향 조정
          작성일: 2026-02-01
          변경 이유: Sidebar Overlay가 Header를 가리지 않도록
          이전 코드: sticky top-0 z-50
          변경 후: sticky top-0 z-75
      ============================================ */}
      <header
        className={cn(
          "sticky top-0 z-75 flex h-14 items-center justify-between border-b border-border bg-background px-4",
          className
        )}
      >
        {/* 왼쪽 영역 */}
        <div className="flex items-center gap-4">
          {/* ============================================
              [SWYP-108] Menu/X 토글 버튼 구현
              작성일: 2026-02-01
              변경 이유: Sidebar 열림 상태를 Header에 명확히 표시
              
              이전 코드:
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="flex size-9 items-center justify-center"
                aria-label="메뉴"
              >
                <Menu className="size-6" />
              </button>
          ============================================ */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex size-9 items-center justify-center transition-transform duration-200 hover:bg-gray-100 rounded-md"
            aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            className="flex h-8 items-center justify-center bg-primary px-4 text-sm font-bold text-primary-foreground"
          >
            BI
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/map"
              className="text-sm font-medium text-foreground hover:text-foreground/80"
            >
              지도
            </Link>
            <Link
              href="/calendar"
              className="text-sm font-medium text-foreground hover:text-foreground/80"
            >
              캘린더
            </Link>
          </nav>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-3">
          {/* 뷰 토글 */}
          <div className="flex h-9 items-center gap-0.5 rounded-full border border-border p-1">
            <Link
              href="/view?mode=map"
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
                isViewPage && currentMode === "map"
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              지도뷰
              <Map className="size-4" />
            </Link>
            <Link
              href="/view?mode=calendar"
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
                isViewPage && currentMode === "calendar"
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              캘린더뷰
              <Calendar className="size-4" />
            </Link>
          </div>

          <SearchDropdown />

          <button
            type="button"
            className="flex size-9 items-center justify-center"
            aria-label="알림"
          >
            <Bell className="size-5" />
          </button>

          <button
            type="button"
            className="flex size-9 items-center justify-center"
            aria-label="좋아요"
          >
            <Heart className="size-5" />
          </button>

          <Link
            href="/settings/profile"
            className="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-gray-100"
            aria-label="프로필 설정"
          >
            <User className="size-5" />
          </Link>
        </div>
      </header>

      {/* Sidebar */}
      <HeaderSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
