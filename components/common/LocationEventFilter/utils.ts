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
 * 예시:
 * - { displayLabel: "지역", values: ["전체"] }  // "전체" 선택 시
 * - { displayLabel: "지역", values: ["울산", "부산"] }  // 여러 개 선택 시
 * - { displayLabel: "팝업", values: ["뷰티", "패션"] }
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
 * - "전체" 선택 시 → [{ displayLabel: "지역", values: ["전체"] }, { displayLabel: "팝업", values: ["전체"] }, ...]
 * - 지역 여러 개 선택 → [{ displayLabel: "지역", values: ["울산", "부산"] }]
 * - 팝업+전시 선택 → [{ displayLabel: "팝업", values: [...] }, { displayLabel: "전시", values: [...] }]
 *
 * @example
 * ```ts
 * // Input: { regions: ["all"], popupCategories: ["all"], exhibitionCategories: ["all"], ... }
 * // Output: [
 * //   { displayLabel: "지역", values: ["전체"] },
 * //   { displayLabel: "팝업", values: ["전체"] },
 * //   { displayLabel: "전시", values: ["전체"] }
 * // ]
 *
 * // Input: { regions: ["ulsan", "busan"], popupCategories: ["beauty"], ... }
 * // Output: [
 * //   { displayLabel: "지역", values: ["울산", "부산"] },
 * //   { displayLabel: "팝업", values: ["뷰티"] }
 * // ]
 * ```
 */
export function convertFiltersToDisplayPills(
  filters: LocationEventFilterState
): DisplayFilter[] {
  const pills: DisplayFilter[] = [];

  // 1. 지역 그룹화 ("전체" 포함)
  const regionValues = filters.regions
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

  // 2. 팝업 카테고리 그룹화 ("전체" 포함)
  const popupValues = filters.popupCategories
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

  // 3. 전시 카테고리 그룹화 ("전체" 포함)
  const exhibitionValues = filters.exhibitionCategories
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

  // 4. 가격 그룹화
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

  // 5. 편의사항 그룹화
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
