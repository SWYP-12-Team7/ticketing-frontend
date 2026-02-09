/**
 * 지역/행사 필터 상수
 *
 * 캘린더뷰와 지도뷰에서 사용하는 지역, 카테고리 옵션
 */

import type { PillOption, CheckboxOption } from "./types";

/**
 * 지역 목록 (17개)
 * Figma 순서대로 정렬
 */
export const REGIONS: readonly PillOption[] = [
  { id: "all", label: "전체" },
  { id: "seoul", label: "서울" },
  { id: "gyeonggi", label: "경기" },
  { id: "incheon", label: "인천" },
  { id: "chungnam", label: "충남" },
  { id: "chungbuk", label: "충북" },
  { id: "daejeon", label: "대전" },
  { id: "gangwon", label: "강원" },
  { id: "jeonnam", label: "전남" },
  { id: "jeonbuk", label: "전북" },
  { id: "jeonju", label: "전주" },
  { id: "gyeongnam", label: "경남" },
  { id: "gyeongbuk", label: "경북" },
  { id: "ulsan", label: "울산" },
  { id: "busan", label: "부산" },
  { id: "daegu", label: "대구" },
  { id: "jeju", label: "제주" },
] as const;

/**
 * 팝업스토어 카테고리 (8개)
 */
export const POPUP_CATEGORIES: readonly PillOption[] = [
  { id: "all", label: "전체" },
  { id: "fashion", label: "패션" },
  { id: "beauty", label: "뷰티" },
  { id: "fnb", label: "F&B" },
  { id: "character", label: "캐릭터" },
  { id: "tech", label: "테크" },
  { id: "lifestyle", label: "라이프스타일" },
  { id: "furniture", label: "가구/인테리어" },
] as const;

/**
 * 전시 카테고리 (8개)
 */
export const EXHIBITION_CATEGORIES: readonly PillOption[] = [
  { id: "all", label: "전체" },
  { id: "art", label: "현대미술" },
  { id: "photo", label: "사진" },
  { id: "design", label: "디자인" },
  { id: "illustration", label: "일러스트" },
  { id: "painting", label: "회화" },
  { id: "sculpture", label: "조각" },
  { id: "installation", label: "설치미술" },
] as const;

/**
 * 가격 옵션 (2개)
 */
export const PRICE_OPTIONS: readonly CheckboxOption[] = [
  { id: "free", label: "무료" },
  { id: "paid", label: "유료" },
] as const;

/**
 * 편의사항 옵션 (2개)
 */
export const AMENITY_OPTIONS: readonly CheckboxOption[] = [
  { id: "parking", label: "주차가능" },
  { id: "petFriendly", label: "반려견 동반 가능" },
] as const;

/**
 * 행사 진행 상태 옵션 (4개)
 */
export const EVENT_STATUS_OPTIONS: readonly CheckboxOption[] = [
  { id: "all", label: "전체" },
  { id: "ongoing", label: "진행 중" },
  { id: "upcoming", label: "진행 예정" },
  { id: "ended", label: "진행 종료" },
] as const;

/**
 * 초기 필터 상태
 */
export const INITIAL_FILTER_STATE: Readonly<{
  regions: string[];
  popupCategories: string[];
  exhibitionCategories: string[];
  price: { free: boolean; paid: boolean };
  amenities: { parking: boolean; petFriendly: boolean };
  dateRange: { startDate: string | null; endDate: string | null };
  eventStatus: { all: boolean; ongoing: boolean; upcoming: boolean; ended: boolean };
}> = {
  regions: ["all"],
  popupCategories: ["all"],
  exhibitionCategories: ["all"],
  price: {
    free: false,
    paid: false,
  },
  amenities: {
    parking: false,
    petFriendly: false,
  },
  dateRange: {
    startDate: null,
    endDate: null,
  },
  eventStatus: {
    all: false,
    ongoing: false,
    upcoming: false,
    ended: false,
  },
} as const;
