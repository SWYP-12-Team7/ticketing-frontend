import type { Event } from "./event";

/**
 * 찜 목록 관련 타입 정의
 * - 타입 안정성 보장
 * - IDE 자동완성 지원
 * - 유지보수 용이성
 */

/**
 * 정렬 옵션
 */
export type WishlistSortOption = "popular" | "latest" | "deadline" | "views";

/**
 * 지역 필터
 */
export type WishlistRegionFilter =
  | "seoul"
  | "gyeonggi"
  | "incheon"
  | "chungnam"
  | "chungbuk"
  | "daejeon"
  | "gyeongbuk"
  | "jeonbuk"
  | "jeonnam"
  | "gwangju"
  | "gyeongnam"
  | "ulsan"
  | "busan";

/**
 * 찜 목록 쿼리 파라미터
 */
export interface WishlistQueryParams {
  /** 정렬 옵션 */
  sort?: WishlistSortOption;
  /** 지역 필터 (다중 선택) */
  regions?: WishlistRegionFilter[];
  /** 현재 페이지 번호 (1부터 시작) */
  page?: number;
  /** 페이지당 아이템 수 */
  limit?: number;
}

/**
 * 찜 목록 API 응답
 */
export interface WishlistResponse {
  /** 이벤트 목록 */
  events: Event[];
  /** 전체 아이템 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 전체 페이지 수 */
  totalPages: number;
}

/**
 * 찜 목록 상태
 */
export interface WishlistState {
  /** 이벤트 목록 */
  events: Event[];
  /** 정렬 옵션 */
  sortOption: WishlistSortOption;
  /** 선택된 지역 필터 */
  selectedRegions: Set<WishlistRegionFilter>;
  /** 현재 페이지 */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error: Error | null;
}

/**
 * 찜 목록 액션
 */
export interface WishlistActions {
  /** 정렬 옵션 변경 */
  setSortOption: (option: WishlistSortOption) => void;
  /** 지역 필터 토글 */
  toggleRegion: (region: WishlistRegionFilter) => void;
  /** 모든 필터 초기화 */
  clearFilters: () => void;
  /** 페이지 변경 */
  setPage: (page: number) => void;
  /** 이벤트 좋아요 해제 */
  unlikeEvent: (eventId: string) => Promise<void>;
  /** 데이터 새로고침 */
  refetch: () => Promise<void>;
}
