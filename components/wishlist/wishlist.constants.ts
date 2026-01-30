import type {
  WishlistSortOption,
  WishlistRegionFilter,
} from "@/types/wishlist";

/**
 * 찜 목록 관련 상수 정의
 * - 하드코딩 방지
 * - 유지보수 용이성
 * - 타입 안정성
 */

/**
 * 정렬 옵션 설정
 */
export const WISHLIST_SORT_OPTIONS: ReadonlyArray<{
  readonly value: WishlistSortOption;
  readonly label: string;
}> = [
  { value: "popular", label: "인기순" },
  { value: "latest", label: "최신순" },
  { value: "deadline", label: "마감순" },
  { value: "views", label: "조회순" },
] as const;

/**
 * 지역 필터 옵션
 */
export const WISHLIST_REGION_FILTERS: ReadonlyArray<{
  readonly value: WishlistRegionFilter;
  readonly label: string;
}> = [
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "incheon", label: "인천" },
  { value: "chungnam", label: "충남" },
  { value: "chungbuk", label: "충북" },
  { value: "daejeon", label: "대전" },
  { value: "gyeongbuk", label: "경북" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gwangju", label: "광주" },
  { value: "gyeongnam", label: "경남" },
  { value: "ulsan", label: "울산" },
  { value: "busan", label: "부산" },
] as const;

/**
 * 페이지네이션 설정
 */
export const WISHLIST_PAGINATION_CONFIG = {
  /** 페이지당 표시할 아이템 수 */
  ITEMS_PER_PAGE: 8,
  /** 한 번에 표시할 최대 페이지 번호 개수 */
  MAX_VISIBLE_PAGES: 7,
  /** 스크롤 동작 옵션 */
  SCROLL_BEHAVIOR: "smooth" as ScrollBehavior,
  /** 스크롤 위치 (페이지 상단) */
  SCROLL_TOP_POSITION: 0,
} as const;

/**
 * 접근성 레이블
 */
export const WISHLIST_ARIA_LABELS = {
  SORT_BUTTON: (label: string) => `${label}으로 정렬`,
  REGION_FILTER_BUTTON: (label: string, isSelected: boolean) =>
    `${label} 지역 필터 ${isSelected ? "제거" : "추가"}`,
  CLEAR_FILTERS: "모든 필터 초기화",
  PAGINATION: "페이지네이션",
  PREVIOUS_PAGE: "이전 페이지",
  NEXT_PAGE: "다음 페이지",
  GO_TO_PAGE: (page: number) => `${page}페이지로 이동`,
  UNLIKE_EVENT: (title: string) => `${title} 좋아요 취소`,
} as const;
