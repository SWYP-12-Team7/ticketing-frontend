"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
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
          "sticky top-0 z-75 flex items-center justify-between border-b border-border bg-background px-[80px] py-5",
          className
        )}
      >
        {/* 왼쪽 영역 */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex size-12 items-center justify-center p-2 transition-transform duration-200 hover:bg-gray-100 rounded-md"
            aria-label={isSidebarOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Image src="/images/header/menu.svg" alt="" width={24} height={24} aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            className="flex items-center justify-center ml-5 mr-2"
          >
            <Image
              src="/images/logo.png"
              alt="와르르 로고"
              width={145}
              height={56}
              priority
            />
          </Link>

          {/* 뷰 네비게이션 */}
          <nav className="flex items-center gap-1">
            <Link
              href="/view?mode=map"
              className={cn(
                "flex items-center justify-center gap-0.5 w-[76px] h-10 p-1 transition-colors",
                "text-base leading-[180%]",
                isViewPage && currentMode === "map"
                  ? "text-[#F36012] font-semibold border-b-2 border-[#F36012]"
                  : "text-[#A6ABB7] font-normal hover:text-[#F36012]"
              )}
            >
              지도뷰
              <Image
                src={isViewPage && currentMode === "map"
                  ? "/images/header/map-pinned2.svg"
                  : "/images/header/map-pinned.svg"
                }
                alt=""
                width={24}
                height={24}
              />
            </Link>
            <Link
              href="/calendarview"
              className={cn(
                "flex items-center justify-center gap-0.5 w-[90px] h-10 p-1 transition-colors",
                "text-base leading-[180%]",
                pathname === "/calendarview"
                  ? "text-[#F36012] font-semibold border-b-2 border-[#F36012]"
                  : "text-[#A6ABB7] font-normal hover:text-[#F36012]"
              )}
            >
              캘린더뷰
              <Image
                src={pathname === "/calendarview"
                  ? "/images/header/calendar-search2.svg"
                  : "/images/header/calendar-search.svg"
                }
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </nav>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-4">
          {/* 검색창 섹션 */}
          <div className="flex items-center">
            <SearchDropdown />
          </div>

          {/* 아이콘 섹션 */}
          <div className="flex items-center">
            <button
              type="button"
              className="flex size-12 items-center justify-center p-2 rounded-md transition-colors hover:bg-gray-100"
              aria-label="알림"
            >
              <Image src="/images/header/bell-default.svg" alt="" width={24} height={24} />
            </button>

            <button
              type="button"
              className="flex size-12 items-center justify-center p-2 rounded-md transition-colors hover:bg-gray-100"
              aria-label="좋아요"
            >
              <Image src="/images/header/icon-like.svg" alt="" width={24} height={24} />
            </button>

            <Link
              href="/settings/profile"
              className="flex size-12 items-center justify-center p-2 rounded-md transition-colors hover:bg-gray-100"
              aria-label="프로필 설정"
            >
              <Image
                src={pathname.startsWith("/settings")
                  ? "/images/header/icon-user2.svg"
                  : "/images/header/icon-user.svg"
                }
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </div>
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
