"use client";

import { cn } from "@/lib/utils";
import { useViewModeStore } from "@/store/view-mode";
import { Menu, Search, Bell, Heart, User, Map } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { viewMode, setViewMode } = useViewModeStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4",
        className
      )}
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex size-9 items-center justify-center"
          aria-label="메뉴"
        >
          <Menu className="size-6" />
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
        <div className="flex h-9 items-center rounded-full border border-border">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className={cn(
              "flex h-full items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors",
              viewMode === "map"
                ? "border border-orange-500 text-orange-500"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            지도뷰
            <Map className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex h-full items-center rounded-full px-3 text-sm font-medium transition-colors",
              viewMode === "calendar"
                ? "border border-orange-500 text-orange-500"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            캘린더뷰
          </button>
        </div>

        <div className="flex h-9 items-center gap-2 rounded-full border border-border px-4">
          <input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <Search className="size-4 text-muted-foreground" />
        </div>

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

        <button
          type="button"
          className="flex size-9 items-center justify-center"
          aria-label="프로필"
        >
          <User className="size-5" />
        </button>
      </div>
    </header>
  );
}
