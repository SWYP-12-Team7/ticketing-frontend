import type { WishlistRegionFilter } from "./wishlist";

/**
 * 전시/팝업 이벤트 공통 타입
 * - RelatedPopups의 Popup 타입
 * - ShowPick의 Event 타입
 * - EventCard 컴포넌트
 * 모두 이 타입을 기반으로 통합
 */
export interface Event {
  id: string;
  title: string;
  category: string;
  location?: string; // ShowPick에서 사용
  region?: WishlistRegionFilter; // 지역 필터용
  period: string;
  date?: string; // ShowPick에서 사용
  imageUrl: string;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  tags?: string[]; // ShowPick에서 사용
  openDate?: Date; // countdown variant용
  originalPrice?: number; // hotdeal variant용
  discountRate?: number;
  discountPrice?: number;
  createdAt?: Date; // 최신순 정렬용
  deadline?: Date; // 마감순 정렬용
}

/**
 * HOT EVENT 정렬 옵션
 */
export type EventSortOption = "popular" | "latest" | "deadline" | "views";

export interface EventSortConfig {
  value: EventSortOption;
  label: string;
}
