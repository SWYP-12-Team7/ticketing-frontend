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

  // TODO: 실제 알림 API 연동 시 교체
  const notificationCount = 0; // 0: 배지 없음, 1-99: 숫자 표시, 100+: "99+" 표시

  return (
    <>
      {/* ============================================
          [SWYP-108] Header - Figma 스펙 완전 반영
          작성일: 2026-02-05
          
          Figma 스펙:
          - 크기: 1440×100px
          - padding: 0 80px
          - border-bottom: 1px solid #6C7180
          - z-75 (최상위)
          
          구성:
          - 햄버거 메뉴: 48×48px (p-2)
          - BI 로고: 145×56px (이미지)
          - 지도뷰: 76×40px (16px/400/180%)
          - 캘린더뷰: 90×40px (16px/400/180%)
          - 검색창: 448×57px
          - 아이콘: 알림/좋아요/프로필 (48×48px, p-2)
          
          인터랙션:
          - 메뉴 활성: #F36012, 600, border-b-2
          - 메뉴 비활성: #A6ABB7, 400, hover #F36012
          - 아이콘 hover: stroke #A6ABB7
          - 알림 배지: 28×13px, #D93E39, 99+
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
              className="group relative flex size-12 items-center justify-center p-2 transition-colors"
              aria-label="알림"
            >
              <Image
                src="/images/header/bell-default.svg"
                alt=""
                width={24}
                height={24}
                className="group-hover:hidden"
              />
              <Image
                src="/images/header/bell-hover.svg"
                alt=""
                width={24}
                height={24}
                className="hidden group-hover:block"
              />
              {notificationCount > 0 && (
                <span
                  className="absolute flex items-center justify-center px-1 bg-[#D93E39] rounded-full text-white font-semibold text-[10px] leading-[180%]"
                  style={{
                    minWidth: '28px',
                    height: '13px',
                    left: 'calc(50% - 28px/2 + 10px)',
                    top: 'calc(50% - 13px/2 - 9.5px)',
                  }}
                  aria-label={`${notificationCount}개의 알림`}
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            <button
              type="button"
              className="group flex size-12 items-center justify-center p-2 transition-colors"
              aria-label="좋아요"
            >
              <Image
                src="/images/header/icon-like.svg"
                alt=""
                width={24}
                height={24}
                className="group-hover:hidden"
              />
              <Image
                src="/images/header/icon-like-hover.svg"
                alt=""
                width={24}
                height={24}
                className="hidden group-hover:block"
              />
            </button>

            <Link
              href="/settings/profile"
              className="group flex size-12 items-center justify-center p-2 transition-colors"
              aria-label="프로필 설정"
            >
              {pathname.startsWith("/settings") ? (
                <Image
                  src="/images/header/icon-user2.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              ) : (
                <>
                  <Image
                    src="/images/header/icon-user.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="group-hover:hidden"
                  />
                  <Image
                    src="/images/header/icon-user-hover.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="hidden group-hover:block"
                  />
                </>
              )}
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
