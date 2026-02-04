/**
 * 필터 관련 유틸리티 함수
 *
 * 캘린더뷰와 지도뷰에서 사용
 */

import type { LocationEventFilterState } from "./types";
import { REGIONS, POPUP_CATEGORIES, EXHIBITION_CATEGORIES } from "./constants";

/**
 * Display Filter 타입 (CalendarToolbar용)
 * Figma 스펙: 레이블 + 값 배열 (그룹화 지원)
 *
 * 동작:
 * - 전체 선택 시: 필터 표시 안 함 (빈 배열 반환)
 * - 특정 항목 선택 시: 해당 그룹만 표시
 *
 * 예시:
 * - { displayLabel: "지역", values: ["울산", "부산"] }  // 여러 개 선택
 * - { displayLabel: "팝업", values: ["뷰티"] }  // 단일 선택
 * - { displayLabel: "가격", values: ["무료", "유료"] }
 */
export interface DisplayFilter {
  /** 고유 ID (그룹 단위) */
  id: string;
  /** 필터 레이블 (예: "지역", "팝업", "전시") */
  displayLabel: string;
  /** 필터 값 배열 (예: ["전체"] 또는 ["부산", "울산"]) */
  values: string[];
  /** 필터 타입 */
  type: "region" | "popup" | "exhibition" | "price" | "amenity" | "all";
  /** X 버튼 표시 여부 */
  showRemoveButton?: boolean;
}

/**
 * LocationEventFilterState를 그룹화된 Display Pills로 변환
 *
 * Figma 스펙 (2026-02-04): 필터별로 그룹화
 * - "전체" 선택 시 → [] (필터 표시 안 함)
 * - 지역 여러 개 선택 → [{ displayLabel: "지역", values: ["울산", "부산"] }]
 * - 팝업+전시 선택 → [{ displayLabel: "팝업", values: [...] }, { displayLabel: "전시", values: [...] }]
 *
 * @param filters - 현재 필터 상태
 * @returns 표시할 필터 pills 배열
 *
 * @example
 * ```ts
 * // 모든 카테고리 "전체" → 필터 없음
 * convertFiltersToDisplayPills({
 *   regions: ["all"],
 *   popupCategories: ["all"],
 *   exhibitionCategories: ["all"],
 *   price: { free: false, paid: false },
 *   amenities: { parking: false, petFriendly: false }
 * });
 * // Output: []
 *
 * // 지역만 특정 선택
 * convertFiltersToDisplayPills({
 *   regions: ["ulsan", "busan"],
 *   popupCategories: ["all"],
 *   exhibitionCategories: ["all"],
 *   price: { free: false, paid: false },
 *   amenities: { parking: false, petFriendly: false }
 * });
 * // Output: [{ displayLabel: "지역", values: ["울산", "부산"] }]
 * ```
 */
export function convertFiltersToDisplayPills(
  filters: LocationEventFilterState
): DisplayFilter[] {
  const pills: DisplayFilter[] = [];

  // 1. "전체" 상태 체크
  const isAllRegions =
    filters.regions.length === 1 && filters.regions[0] === "all";
  const isAllPopup =
    filters.popupCategories.length === 1 &&
    filters.popupCategories[0] === "all";
  const isAllExhibition =
    filters.exhibitionCategories.length === 1 &&
    filters.exhibitionCategories[0] === "all";
  const noPriceFilter = !filters.price.free && !filters.price.paid;
  const noAmenityFilter =
    !filters.amenities.parking && !filters.amenities.petFriendly;

  // 2. 모든 카테고리가 "전체"면 빈 배열 반환 (필터 표시 안 함)
  if (
    isAllRegions &&
    isAllPopup &&
    isAllExhibition &&
    noPriceFilter &&
    noAmenityFilter
  ) {
    return [];
  }

  // 3. 지역 그룹화 ("전체" 제외)
  const regionValues = filters.regions
    .filter((id) => id !== "all")
    .map((id) => REGIONS.find((r) => r.id === id)?.label)
    .filter((label): label is string => label !== undefined);

  if (regionValues.length > 0) {
    pills.push({
      id: "region-group",
      displayLabel: "지역",
      values: regionValues,
      type: "region",
      showRemoveButton: true,
    });
  }

  // 4. 팝업 카테고리 그룹화 ("전체" 제외)
  const popupValues = filters.popupCategories
    .filter((id) => id !== "all")
    .map((id) => POPUP_CATEGORIES.find((c) => c.id === id)?.label)
    .filter((label): label is string => label !== undefined);

  if (popupValues.length > 0) {
    pills.push({
      id: "popup-group",
      displayLabel: "팝업",
      values: popupValues,
      type: "popup",
      showRemoveButton: true,
    });
  }

  // 5. 전시 카테고리 그룹화 ("전체" 제외)
  const exhibitionValues = filters.exhibitionCategories
    .filter((id) => id !== "all")
    .map((id) => EXHIBITION_CATEGORIES.find((c) => c.id === id)?.label)
    .filter((label): label is string => label !== undefined);

  if (exhibitionValues.length > 0) {
    pills.push({
      id: "exhibition-group",
      displayLabel: "전시",
      values: exhibitionValues,
      type: "exhibition",
      showRemoveButton: true,
    });
  }

  // 6. 가격 그룹화
  const priceValues: string[] = [];
  if (filters.price.free) priceValues.push("무료");
  if (filters.price.paid) priceValues.push("유료");

  if (priceValues.length > 0) {
    pills.push({
      id: "price-group",
      displayLabel: "가격",
      values: priceValues,
      type: "price",
      showRemoveButton: true,
    });
  }

  // 7. 편의사항 그룹화
  const amenityValues: string[] = [];
  if (filters.amenities.parking) amenityValues.push("주차가능");
  if (filters.amenities.petFriendly) amenityValues.push("반려견 동반");

  if (amenityValues.length > 0) {
    pills.push({
      id: "amenity-group",
      displayLabel: "편의시설",
      values: amenityValues,
      type: "amenity",
      showRemoveButton: true,
    });
  }

  return pills;
}

/**
 * 필터 그룹 제거 (그룹 단위로 한 번에 제거)
 *
 * @param state 현재 필터 상태
 * @param filterId 그룹 ID (예: "region-group", "popup-group")
 * @returns 업데이트된 필터 상태
 *
 * @example
 * ```ts
 * // "지역 전체" 또는 "지역 울산 부산" 그룹 전체 제거
 * removeFilterFromState(state, "region-group")
 * // → regions: ["all"]
 *
 * // "팝업 전체" 또는 "팝업 뷰티" 그룹 제거
 * removeFilterFromState(state, "popup-group")
 * // → popupCategories: ["all"]
 * ```
 */
export function removeFilterFromState(
  state: LocationEventFilterState,
  filterId: string
): LocationEventFilterState {

  // 그룹 단위 제거
  switch (filterId) {
    case "region-group":
      return {
        ...state,
        regions: ["all"],
      };

    case "popup-group":
      return {
        ...state,
        popupCategories: ["all"],
      };

    case "exhibition-group":
      return {
        ...state,
        exhibitionCategories: ["all"],
      };

    case "price-group":
      return {
        ...state,
        price: { free: false, paid: false },
      };

    case "amenity-group":
      return {
        ...state,
        amenities: { parking: false, petFriendly: false },
      };

    default:
      return state;
  }
}
