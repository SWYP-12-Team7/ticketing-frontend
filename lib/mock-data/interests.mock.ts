/**
 * Interests Mock Data
 *
 * @description
 * - 나의 취향 페이지에서 사용되는 Mock 데이터
 * - 백엔드 API 연동 전까지 사용
 * - 실제 데이터 구조와 동일하게 유지
 */

import type { Event } from "@/types/event";

/**
 * 취향 저격 신규 스팟 - Mock 이벤트
 */
export const MOCK_SPOT_EVENTS: Event[] = [
  {
    id: "spot-1",
    title: "나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시",
    category: "전시",
    subcategory: "라이프스타일",
    region: "서울 성수",
    period: "26.88.88 ~ 26.88.88",
    imageUrl: "https://picsum.photos/seed/spot1/400/500",
    viewCount: 9999,
    likeCount: 9999,
    isLiked: false,
  },
  {
    id: "spot-2",
    title: "나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시",
    category: "팝업스토어",
    subcategory: "패션/뷰티",
    region: "서울 성수",
    period: "26.88.88 ~ 26.88.88",
    imageUrl: "https://picsum.photos/seed/spot2/400/500",
    viewCount: 9999,
    likeCount: 9999,
    isLiked: false,
  },
];

/**
 * 찜한 팝업･전시 - Mock 이벤트
 */
export const MOCK_BOOKMARKED_EVENTS: Event[] = Array.from(
  { length: 4 },
  (_, i) => ({
    id: `bookmarked-${i + 1}`,
    title: "나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시",
    category: i % 2 === 0 ? "전시" : "팝업스토어",
    subcategory: "라이프스타일",
    region: "서울 성수",
    period: "26.88.88 ~ 26.88.88",
    priceDisplay: i % 3 === 0 ? "무료" : undefined,
    imageUrl: `https://picsum.photos/seed/bookmarked${i}/400/500`,
    viewCount: 9999,
    likeCount: 9999,
    isLiked: true,
  })
);

/**
 * 다시 보고 싶은 팝업･전시 - Mock 이벤트
 */
export const MOCK_VIEWED_EVENTS: Event[] = Array.from(
  { length: 4 },
  (_, i) => ({
    id: `viewed-${i + 1}`,
    title: "나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시",
    category: i % 2 === 0 ? "팝업스토어" : "전시",
    subcategory: "디자인/문구",
    region: "서울 성수",
    period: "26.88.88 ~ 26.88.88",
    priceDisplay: i % 2 === 0 ? "10,000원" : "무료",
    imageUrl: `https://picsum.photos/seed/viewed${i}/400/500`,
    viewCount: 9999,
    likeCount: 9999,
    isLiked: false,
  })
);

/**
 * 카테고리별 이벤트 생성 헬퍼 (필요시 사용)
 */
export function createMockEventsByCategory(
  category: string,
  count: number = 2
): Event[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${category.toLowerCase()}-${i + 1}`,
    title: "나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시",
    category: i % 2 === 0 ? "전시" : "팝업스토어",
    subcategory: category,
    region: "서울 성수",
    period: "26.88.88 ~ 26.88.88",
    imageUrl: `https://picsum.photos/seed/${category}${i}/400/500`,
    viewCount: Math.floor(Math.random() * 10000),
    likeCount: Math.floor(Math.random() * 5000),
    isLiked: false,
  }));
}
