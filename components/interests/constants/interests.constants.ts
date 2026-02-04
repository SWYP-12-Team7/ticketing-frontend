/**
 * Interests 관련 상수 정의
 *
 * @description
 * - 나의 취향 페이지에서 사용되는 모든 상수를 중앙 관리
 * - 하드코딩 제거 및 타입 안전성 강화
 * - 유지보수성 향상
 */

/**
 * 취향 저격 신규 스팟 - 카테고리 칩 라벨
 */
export const INTERESTS_CHIP_LABELS = [
  "라이프스타일",
  "일상/데코",
  "반려동물",
  "캐릭터",
  "디자인/문구",
  "F&B",
  "패션/뷰티",
  "테크/가전",
] as const;

/**
 * 칩 라벨 타입 (타입 안전성)
 */
export type InterestsChipLabel = (typeof INTERESTS_CHIP_LABELS)[number];

/**
 * 배너 설정
 */
export const INTERESTS_BANNER_CONFIG = {
  /** Figma 스펙: 457px */
  width: 457,
  /** Figma 스펙: 168px */
  height: 168,
  /** Figma 스펙: 16px gap between banners */
  gap: 16,
  /** Figma 스펙: 12px border-radius */
  borderRadius: 12,
  /** Figma 스펙: 22px padding */
  padding: 22,
} as const;

/**
 * 배너 데이터
 */
export const INTERESTS_BANNERS = [
  {
    id: "region",
    title: "추천 지역 변경하기",
    href: "/onboarding/step1",
    imageUrl: "/images/interests-region-banner.png",
  },
  {
    id: "topics",
    title: "관심 있는 주제 고르기",
    href: "/onboarding/step2",
    imageUrl: "/images/interests-topic-banner.png",
  },
] as const;

/**
 * 캐러셀 설정
 */
export const INTERESTS_CAROUSEL_CONFIG = {
  /** 한 번에 보여줄 카드 수 */
  cardsPerView: 4,
  /** Figma 스펙: 24px gap between cards */
  cardGap: 24,
  /** Figma 스펙: 844px carousel width */
  width: 844,
  /** Figma 스펙: 193px card width */
  cardWidth: 193,
  /** Figma 스펙: 404px card height */
  cardHeight: 404,
} as const;

/**
 * 캐러셀 섹션 타이틀
 */
export const INTERESTS_CAROUSEL_SECTIONS = {
  bookmarked: "찜한 팝업 ･ 전시",
  viewed: "다시 보고 싶은 팝업 ･ 전시",
} as const;

/**
 * 페이지 레이아웃 설정 (Figma 스펙)
 */
export const INTERESTS_LAYOUT = {
  /** 페이지 너비: 930px */
  pageWidth: 930,
  /** 섹션 간 간격: 64px (Hero와 Spot 사이) */
  sectionGapPrimary: 64,
  /** 섹션 간 간격: 88px (Spot과 Carousel 사이) */
  sectionGapSecondary: 88,
  /** Hero 섹션 내부 간격: 32px */
  heroInnerGap: 32,
  /** Spot 섹션 내부 간격: 20px */
  spotInnerGap: 20,
  /** Carousel 섹션 간격: 24px */
  carouselGap: 24,
} as const;

/**
 * 스팟 섹션 설정
 */
export const INTERESTS_SPOT_CONFIG = {
  /** Figma 스펙: 930px width */
  width: 930,
  /** Figma 스펙: 430px height */
  height: 430,
  /** Figma 스펙: 24px padding */
  padding: 24,
  /** 한 번에 보여줄 카드 수 */
  cardsPerView: 2,
  /** Figma 스펙: 16px gap between cards */
  cardGap: 16,
  /** Figma 스펙: 8px gap between chips */
  chipGap: 8,
} as const;
