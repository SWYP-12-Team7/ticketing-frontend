"use client";

import { useState, useEffect, useRef, useCallback, ComponentType } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Layers,
  Shirt,
  Sparkles,
  Coffee,
  Smile,
  Laptop,
  Heart,
  Sofa,
  Palette,
  Camera,
  Pencil,
  Box,
  Tv,
  Hammer,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ========================================
// Types
// ========================================

interface Subcategory {
  id: string;
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

interface MenuCategory {
  id: string;
  label: string;
  subcategories: Subcategory[];
}

interface HeaderSideBarProps {
  /** Sidebar 열림/닫힘 상태 */
  isOpen: boolean;
  /** Sidebar 닫기 핸들러 */
  onClose: () => void;
  /** 커스텀 className */
  className?: string;
}

// ========================================
// Constants
// ========================================

const MENU_DATA: MenuCategory[] = [
  {
    id: "popup-store",
    label: "팝업스토어",
    subcategories: [
      {
        id: "popup-all",
        label: "전체보기",
        href: "/popup-store",
        icon: Layers,
      },
      {
        id: "popup-fashion",
        label: "패션",
        href: "/popup-store/fashion",
        icon: Shirt,
      },
      {
        id: "popup-beauty",
        label: "뷰티",
        href: "/popup-store/beauty",
        icon: Sparkles,
      },
      {
        id: "popup-fnb",
        label: "F&B",
        href: "/popup-store/fnb",
        icon: Coffee,
      },
      {
        id: "popup-character",
        label: "캐릭터",
        href: "/popup-store/character",
        icon: Smile,
      },
      {
        id: "popup-tech",
        label: "테크",
        href: "/popup-store/tech",
        icon: Laptop,
      },
      {
        id: "popup-lifestyle",
        label: "라이프스타일",
        href: "/popup-store/lifestyle",
        icon: Heart,
      },
      {
        id: "popup-furniture",
        label: "기구 & 인테리어",
        href: "/popup-store/furniture",
        icon: Sofa,
      },
    ],
  },
  {
    id: "exhibition",
    label: "전시",
    subcategories: [
      {
        id: "exhibition-all",
        label: "전체보기",
        href: "/exhibition",
        icon: Layers,
      },
      {
        id: "exhibition-art",
        label: "현대미술",
        href: "/exhibition/art",
        icon: Palette,
      },
      {
        id: "exhibition-photo",
        label: "사진",
        href: "/exhibition/photo",
        icon: Camera,
      },
      {
        id: "exhibition-design",
        label: "디자인",
        href: "/exhibition/design",
        icon: Pencil,
      },
      {
        id: "exhibition-sculpture",
        label: "조각",
        href: "/exhibition/sculpture",
        icon: Box,
      },
      {
        id: "exhibition-media",
        label: "미디어아트",
        href: "/exhibition/media",
        icon: Tv,
      },
      {
        id: "exhibition-craft",
        label: "공예",
        href: "/exhibition/craft",
        icon: Hammer,
      },
      {
        id: "exhibition-history",
        label: "역사전시",
        href: "/exhibition/history",
        icon: Building2,
      },
    ],
  },
];

/**
 * Sidebar 너비
 * Figma 스펙: 382px
 */
const SIDEBAR_WIDTH = 382;

/**
 * Sidebar 내부 콘텐츠 패딩
 * Figma 스펙: padding: 0px 16px 0px 80px
 * 적용: pl-20 (80px), pr-4 (16px)
 */

/**
 * 애니메이션 속도
 * 메뉴 펼침/접힘 및 Sidebar 슬라이드 애니메이션 (600ms)
 */
const ANIMATION_DURATION = 900;

// ========================================
// Component
// ========================================

/**
 * HeaderSideBar
 *
 * 전역 네비게이션 Sidebar 컴포넌트
 * - 2depth 아코디언 메뉴 구조
 * - 호버/클릭으로 카테고리 펼침/접기
 * - 현재 페이지 자동 감지 및 하이라이트
 * - dimmed overlay + slide-in 애니메이션
 * - body scroll lock
 * - 키보드 네비게이션 지원 (ESC, Tab)
 *
 * [SWYP-108] Sidebar 고도화 (2026-02-01)
 * - Header 아래에서 시작 (top-14)
 * - Sidebar 내부 헤더 제거
 * - Footer 간소화
 * - Figma 디자인 스펙 적용 (382px, 내부 패딩 80px/16px)
 */
export function HeaderSideBar({
  isOpen,
  onClose,
  className,
}: HeaderSideBarProps) {
  const pathname = usePathname();

  // 확장된 카테고리 ID (아코디언)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null
  );

  // Refs
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ========================================
  // 현재 활성화된 서브카테고리 자동 감지
  // Next.js pathname 기반으로 현재 페이지 감지
  // 예: pathname "/popup-store/fashion" → subcategory "popup-fashion" 활성화
  // ========================================
  const activeSubcategory = MENU_DATA.flatMap(
    (category) => category.subcategories
  ).find((subcategory) => subcategory.href === pathname);

  // 활성화된 서브카테고리가 속한 카테고리 찾기
  const activeCategoryId = activeSubcategory
    ? MENU_DATA.find((category) =>
        category.subcategories.some((sub) => sub.id === activeSubcategory.id)
      )?.id
    : null;

  // ========================================
  // Effects
  // ========================================

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // 스크롤바 너비 계산 (shift 방지)
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // ============================================
      // [SWYP-108] Focus trap 개선
      // Sidebar Header 제거로 인해 첫 번째 카테고리 버튼으로 포커스 이동
      // ============================================
      setTimeout(() => {
        const firstFocusable = sidebarRef.current?.querySelector<HTMLElement>(
          "button:not([disabled]), a[href]"
        );
        firstFocusable?.focus();
      }, ANIMATION_DURATION);
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  // 현재 페이지에 해당하는 카테고리를 자동으로 펼침
  useEffect(() => {
    if (isOpen && activeCategoryId && !expandedCategoryId) {
      setExpandedCategoryId(activeCategoryId);
    }
  }, [isOpen, activeCategoryId, expandedCategoryId]);

  // ========================================
  // Handlers
  // ========================================

  // 카테고리 토글 (클릭)
  const handleCategoryToggle = useCallback((categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  }, []);

  // 카테고리 펼침 (호버 - 즉시 반응, 애니메이션은 600ms 동안 부드럽게)
  const handleCategoryHover = useCallback((categoryId: string) => {
    setExpandedCategoryId(categoryId);
  }, []);

  // Overlay 클릭 시 닫기
  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // ========================================
  // Render Helpers
  // ========================================

  // 서브카테고리 렌더링 (메모이제이션)
  const renderSubcategories = useCallback(
    (category: MenuCategory) => {
      const isExpanded = expandedCategoryId === category.id;

      return (
        <div
          id={`submenu-${category.id}`}
          className={cn(
            "sidebar__submenuContainer overflow-hidden transition-all",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
          style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
          role="region"
          aria-labelledby={`category-${category.id}`}
        >
          <ul className="sidebar__submenuList">
            {category.subcategories.map((subcategory) => {
              const isActive = activeSubcategory?.id === subcategory.id;
              const IconComponent = subcategory.icon;

              return (
                <li key={subcategory.id} className="sidebar__submenuItem">
                  <Link
                    href={subcategory.href}
                    className={cn(
                      "sidebar__submenuLink flex h-[43px] w-full items-center",
                      "gap-3 px-2 py-1 pl-8 transition-all duration-200",
                      "text-body-large rounded-[4px]",
                      isActive
                        ? "bg-[#F3F4F6] font-semibold text-[#F36012]"
                        : "text-[#6C7180] hover:bg-[#F3F4F6]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <IconComponent
                      className={cn(
                        "sidebar__submenuIcon size-6 shrink-0 transition-colors",
                        isActive ? "text-[#F36012]" : "text-[#6C7180]"
                      )}
                      aria-hidden={true}
                    />
                    <span className="sidebar__submenuText">
                      {subcategory.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    },
    [expandedCategoryId, activeSubcategory]
  );

  // ========================================
  // Render
  // ========================================

  return (
    <>
      {/* Overlay (Dimmed Background) */}
      <div
        ref={overlayRef}
        className={cn(
          "sidebar__overlay fixed inset-0 bg-black/50 transition-opacity",
          "z-60",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        style={{ transitionDuration: `${ANIMATION_DURATION}ms` }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* ============================================
          [SWYP-108] Sidebar Container - Figma 스펙 적용
          작성일: 2026-02-01
          변경 이유: Figma 디자인 스펙에 맞춰 크기 및 위치 조정
          
          이전 코드:
          className={cn(
            "sidebar fixed left-0 top-0 flex h-full flex-col bg-white shadow-2xl",
            "transition-transform ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
          style={{ width: 250 }}
          
          Figma 스펙:
          - width: 382px
          - padding: 0px 16px 0px 80px (내부 콘텐츠 패딩)
          - 위치: 화면 왼쪽에 붙음 (left-0)
          - shadow: 0px 0px 2px rgba(0,0,0,0.2), 0px 8px 16px rgba(0,0,0,0.2)
          
          변경 후:
          - width: 250px → 382px
          - left: 화면 왼쪽 (left-0)
          - 내부 패딩: pl-20 (80px), pr-4 (16px) 추가
          - top: 56px (top-14, Header 아래)
          - h-full → h-[calc(100vh-3.5rem)]
          - 애니메이션: left 동적 변경
      ============================================ */}
      <aside
        ref={sidebarRef}
        className={cn(
          "sidebar fixed top-14 flex flex-col bg-white",
          "h-[calc(100vh-3.5rem)]",
          "pl-20 pr-4",
          "shadow-[0px_0px_2px_rgba(0,0,0,0.2),0px_8px_16px_rgba(0,0,0,0.2)]",
          "transition-all ease-in-out",
          "z-70",
          isOpen ? "left-0" : "left-[-382px]",
          className
        )}
        style={{
          width: SIDEBAR_WIDTH,
          transitionDuration: `${ANIMATION_DURATION}ms`,
        }}
        role="navigation"
        aria-label="사이드바 메뉴 네비게이션"
        aria-hidden={!isOpen}
      >
        {/* ============================================
            [SWYP-108] Sidebar Header 제거
            작성일: 2026-02-01
            변경 이유: active 상태에서 Sidebar 내부에 헤더 없음 (이미지 스펙)
            
            이전 코드:
            <div className="sidebar__header flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
              <h2 className="sidebar__title text-heading-small text-foreground">
                메뉴
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="sidebar__closeButton flex size-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F36012] focus-visible:ring-offset-2"
                aria-label="사이드바 닫기"
              >
                <X className="size-5 text-foreground" aria-hidden="true" />
              </button>
            </div>
        ============================================ */}

        {/* Menu Content - Header 없이 바로 시작 */}
        <nav className="sidebar__nav flex-1 overflow-y-auto">
          <ul className="sidebar__menuList" role="list">
            {MENU_DATA.map((category) => {
              const isExpanded = expandedCategoryId === category.id;

              return (
                <li key={category.id} className="sidebar__menuItem">
                  {/* 1depth: Category Button */}
                  <button
                    id={`category-${category.id}`}
                    type="button"
                    onClick={() => handleCategoryToggle(category.id)}
                    onMouseEnter={() => handleCategoryHover(category.id)}
                    className={cn(
                      "group sidebar__categoryButton flex h-[62px] w-full items-center justify-between",
                      "px-3 py-2 text-body-medium-bold transition-all duration-200",
                      isExpanded
                        ? "border-l-4 border-[#F36012] font-bold text-[#F36012]"
                        : "border-l-4 border-transparent text-foreground hover:text-muted-foreground"
                    )}
                    aria-expanded={isExpanded}
                    aria-controls={`submenu-${category.id}`}
                  >
                    <span className="sidebar__categoryText">
                      {category.label}
                    </span>
                    {isExpanded ? (
                      <ChevronUp
                        className="sidebar__categoryIcon size-5 shrink-0 transition-opacity"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="sidebar__categoryIcon size-5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* 2depth: Subcategories */}
                  {renderSubcategories(category)}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ============================================
            [SWYP-108] Sidebar Footer 간소화
            작성일: 2026-02-01
            변경 이유: 중복 정보 제거 (Header에 BI 있음, 페이지 Footer에 링크 있음)
            
            이전 코드:
            <div className="sidebar__footer shrink-0 border-t border-border bg-muted px-4 py-4">
              <Link
                href="/"
                className="mb-3 inline-flex h-8 items-center justify-center bg-primary px-4 text-sm font-bold text-primary-foreground"
              >
                로고
              </Link>
              <div className="mb-2 flex gap-3 text-caption-medium">
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  이용약관
                </Link>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  개인정보처리방침
                </Link>
              </div>
              <p className="text-caption-medium text-muted-foreground">
                © 2026 와르르. All rights reserved.
              </p>
            </div>
        ============================================ */}
        <div className="sidebar__footer shrink-0 border-t border-border bg-muted px-4 py-3">
          <p className="text-caption-medium text-muted-foreground text-center">
            © 2026 와르르. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
}
