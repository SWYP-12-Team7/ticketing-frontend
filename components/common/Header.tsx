"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { SearchDropdown } from "./SearchDropdown";
import { HeaderSideBar } from "./HeaderSideBar";
import { MapPinnedIcon, CalendarSearchIcon } from "@/components/icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 인증 상태
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const isViewPage = pathname === "/view";
  const currentMode = searchParams.get("mode");

  // TODO: 실제 알림 API 연동 시 교체
  const notificationCount = 0; // 0: 배지 없음, 1-99: 숫자 표시, 100+: "99+" 표시

  /**
   * 비로그인 시 로그인 페이지로 이동하는 공통 핸들러
   */
  const handleAuthRequired = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!_hasHydrated) {
      e.preventDefault();
      return;
    }
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("로그인이 필요한 페이지 입니다.");
      router.push("/auth/login");
    }
  };

  const handleProfileClick = handleAuthRequired;
  const handleFavoritesClick = handleAuthRequired;

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
          "sticky top-0 z-75 h-25 flex items-center justify-between border-b border-[#E5E7EA] bg-background px-[80px]",
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
              width={140}
              height={60}
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
                  : "text-[#6C7180] font-normal rounded hover:text-[#A6ABB7]"
              )}
            >
              지도뷰
              <MapPinnedIcon className="size-6" aria-hidden={true} />
            </Link>
            <Link
              href="/calendarview"
              className={cn(
                "flex items-center justify-center gap-0.5 w-[90px] h-10 p-1 transition-colors",
                "text-base leading-[180%]",
                pathname === "/calendarview"
                  ? "text-[#F36012] font-semibold border-b-2 border-[#F36012]"
                  : "text-[#6C7180] font-normal rounded hover:text-[#A6ABB7]"
              )}
            >
              캘린더뷰
              <CalendarSearchIcon className="size-6" aria-hidden={true} />
            </Link>
          </nav>
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-4">
          {/* 검색창 섹션 */}
          <div className="flex items-center">
            <SearchDropdown
              onSearch={(keyword) => {
                const params = new URLSearchParams();
                params.set("keyword", keyword);
                router.push(`/search?${params.toString()}`);
              }}
            />
          </div>

          {/* 아이콘 섹션 */}
          <div className="flex items-center">
            {/*
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
                    minWidth: "28px",
                    height: "13px",
                    left: "calc(50% - 28px/2 + 10px)",
                    top: "calc(50% - 13px/2 - 9.5px)",
                  }}
                  aria-label={`${notificationCount}개의 알림`}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>
            */}

            <Link
              href="/user/favorites"
              onClick={handleFavoritesClick}
              className={cn(
                "group flex size-12 items-center justify-center p-2 transition-colors",
                pathname.startsWith("/user/favorites")
                  ? "text-[#F36012]"
                  : "text-[#6C7180] "
              )}
              aria-label="좋아요"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 9.50053C2.00002 8.38773 2.33759 7.30111 2.96813 6.38419C3.59867 5.46727 4.49252 4.76319 5.53161 4.36493C6.5707 3.96667 7.70616 3.89297 8.78801 4.15357C9.86987 4.41417 10.8472 4.99681 11.591 5.82453C11.6434 5.88054 11.7067 5.9252 11.7771 5.95573C11.8474 5.98626 11.9233 6.00201 12 6.00201C12.0767 6.00201 12.1526 5.98626 12.2229 5.95573C12.2933 5.9252 12.3566 5.88054 12.409 5.82453C13.1504 4.99143 14.128 4.4039 15.2116 4.14013C16.2952 3.87636 17.4335 3.94887 18.4749 4.34801C19.5163 4.74715 20.4114 5.45398 21.0411 6.37443C21.6708 7.29488 22.0053 8.38529 22 9.50053C22 11.7905 20.5 13.5005 19 15.0005L13.508 20.3135C13.3217 20.5275 13.0919 20.6994 12.834 20.8178C12.5762 20.9362 12.296 20.9984 12.0123 21.0002C11.7285 21.002 11.4476 20.9434 11.1883 20.8283C10.9289 20.7131 10.697 20.5442 10.508 20.3325L5 15.0005C3.5 13.5005 2 11.8005 2 9.50053Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/settings/profile"
              onClick={handleProfileClick}
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
