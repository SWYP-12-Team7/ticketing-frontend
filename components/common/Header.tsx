"use client";

import { cn } from "@/lib/utils";
import { Menu, Bell, Heart, User, Map, Calendar } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isViewPage = pathname === "/view";
  const currentMode = searchParams.get("mode");

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
