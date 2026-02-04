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

  /** 서브카테고리 (예: "라이프스타일", "현대미술") */
  subcategory?: string;

  /** 지역 (예: "서울 성수") */
  region?: string;

  /** 장소 (ShowPick에서 사용) */
  location?: string;

  /** 기간 (예: "26.01.01 ~ 26.01.31") */
  period: string;

  /** 날짜 (ShowPick에서 사용) */
  date?: string;

  /** 가격 표시용 (예: "무료", "10,000원") */
  priceDisplay?: string;

  /** 원가 (hotdeal variant용) */
  originalPrice?: number;

  /** 할인율 */
  discountRate?: number;

  /** 할인가 */
  discountPrice?: number;

  imageUrl: string;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;

  /** 태그 목록 (ShowPick에서 사용) */
  tags?: string[];

  /** 오픈 예정일 (countdown variant용) */
  openDate?: Date;

  /** 생성일 (최신순 정렬용) */
  createdAt?: string;

  /** 종료일 (마감임박순 정렬용) */
  endDate?: string;
}

/**
 * HOT EVENT 정렬 옵션
 */
export type EventSortOption = "popular" | "latest" | "deadline" | "views";

export interface EventSortConfig {
  value: EventSortOption;
  label: string;
}
