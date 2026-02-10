/**
 * 필터 관련 유틸리티 함수
 *
 * 캘린더뷰와 지도뷰에서 사용
 */

import type { LocationEventFilterState } from "./types";
import {
  REGIONS,
  POPUP_CATEGORIES,
  EXHIBITION_CATEGORIES,
  AMENITY_OPTIONS,
} from "./constants";

/**
 * Display Filter 값 (개별 chip, Figma 스펙: 값 chip별 X 버튼)
 */
export interface DisplayFilterValue {
  /** 표시 라벨 (예: "울산", "부산") */
  label: string;
  /** 필터 상태용 ID (예: "ulsan", "busan") */
  id: string;
}

/**
 * Display Filter 타입 (CalendarToolbar용)
 * Figma 스펙: 레이블 + 값 배열 (그룹화 지원, 값 chip별 X 버튼)
 *
 * 동작:
 * - 전체 선택 시: 필터 표시 안 함 (빈 배열 반환)
 * - 특정 항목 선택 시: 해당 그룹만 표시
 * - 값 chip별 X: 개별 값만 제거
 *
 * 예시:
 * - { displayLabel: "지역", values: [{ label: "울산", id: "ulsan" }, { label: "부산", id: "busan" }] }
 */
export interface DisplayFilter {
  /** 고유 ID (그룹 단위) */
  id: string;
  /** 필터 레이블 (예: "지역", "팝업", "전시") */
  displayLabel: string;
  /** 필터 값 배열 (label + id, 개별 제거용) */
  values: DisplayFilterValue[];
  /** 필터 타입 */
  type: "region" | "popup" | "exhibition" | "price" | "amenity" | "all";
  /** 그룹 전체 X 버튼 표시 여부 */
  showRemoveButton?: boolean;
  /** 활성화 상태 (Figma: 팝업/전시 서브카테고리 선택 시 활성화) */
  isActive?: boolean;
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
  const regionValues: DisplayFilterValue[] = filters.regions
    .filter((id) => id !== "all")
    .map((id) => {
      const opt = REGIONS.find((r) => r.id === id);
      return opt ? { label: opt.label, id: opt.id } : null;
    })
    .filter((v): v is DisplayFilterValue => v !== null);

  if (regionValues.length > 0) {
    pills.push({
      id: "region-group",
      displayLabel: "지역",
      values: regionValues,
      type: "region",
      showRemoveButton: true,
      isActive: false, // 지역은 항상 비활성화
    });
  }

  // 4. 팝업 카테고리 그룹화 ("전체" 제외)
  const popupValues: DisplayFilterValue[] = filters.popupCategories
    .filter((id) => id !== "all")
    .map((id) => {
      const opt = POPUP_CATEGORIES.find((c) => c.id === id);
      return opt ? { label: opt.label, id: opt.id } : null;
    })
    .filter((v): v is DisplayFilterValue => v !== null);

  if (popupValues.length > 0) {
    pills.push({
      id: "popup-group",
      displayLabel: "팝업스토어",
      values: popupValues,
      type: "popup",
      showRemoveButton: true,
      isActive: true, // 팝업 서브카테고리 선택 시 활성화
    });
  }

  // 5. 전시 카테고리 그룹화 ("전체" 제외)
  const exhibitionValues: DisplayFilterValue[] = filters.exhibitionCategories
    .filter((id) => id !== "all")
    .map((id) => {
      const opt = EXHIBITION_CATEGORIES.find((c) => c.id === id);
      return opt ? { label: opt.label, id: opt.id } : null;
    })
    .filter((v): v is DisplayFilterValue => v !== null);

  if (exhibitionValues.length > 0) {
    pills.push({
      id: "exhibition-group",
      displayLabel: "전시",
      values: exhibitionValues,
      type: "exhibition",
      showRemoveButton: true,
      isActive: true, // 전시 서브카테고리 선택 시 활성화
    });
  }

  // 6. 가격 그룹화
  const priceValues: DisplayFilterValue[] = [];
  if (filters.price.free) priceValues.push({ label: "무료", id: "free" });
  if (filters.price.paid) priceValues.push({ label: "유료", id: "paid" });

  if (priceValues.length > 0) {
    pills.push({
      id: "price-group",
      displayLabel: "가격",
      values: priceValues,
      type: "price",
      showRemoveButton: true,
      isActive: false, // 가격은 비활성화
    });
  }

  // 7. 편의사항 그룹화
  const amenityValues: DisplayFilterValue[] = [];
  if (filters.amenities.parking)
    amenityValues.push({
      label: AMENITY_OPTIONS.find((a) => a.id === "parking")!.label,
      id: "parking",
    });
  if (filters.amenities.petFriendly)
    amenityValues.push({
      label: AMENITY_OPTIONS.find((a) => a.id === "petFriendly")!.label,
      id: "petFriendly",
    });

  if (amenityValues.length > 0) {
    pills.push({
      id: "amenity-group",
      displayLabel: "편의시설",
      values: amenityValues,
      type: "amenity",
      showRemoveButton: true,
      isActive: false, // 편의시설은 비활성화
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

/**
 * 필터 그룹 내 개별 값 제거 (Figma 스펙: 값 chip별 X 버튼)
 *
 * @param state 현재 필터 상태
 * @param filterId 그룹 ID (예: "region-group", "popup-group")
 * @param valueId 제거할 값 ID (예: "ulsan", "beauty", "free")
 * @returns 업데이트된 필터 상태
 */
export function removeFilterValueFromState(
  state: LocationEventFilterState,
  filterId: string,
  valueId: string
): LocationEventFilterState {
  switch (filterId) {
    case "region-group": {
      const next = state.regions.filter((id) => id !== valueId);
      return {
        ...state,
        regions: next.length === 0 ? ["all"] : next,
      };
    }

    case "popup-group": {
      const next = state.popupCategories.filter((id) => id !== valueId);
      return {
        ...state,
        popupCategories: next.length === 0 ? ["all"] : next,
      };
    }

    case "exhibition-group": {
      const next = state.exhibitionCategories.filter((id) => id !== valueId);
      return {
        ...state,
        exhibitionCategories: next.length === 0 ? ["all"] : next,
      };
    }

    case "price-group":
      if (valueId === "free" || valueId === "paid") {
        return {
          ...state,
          price: { ...state.price, [valueId]: false },
        };
      }
      return state;

    case "amenity-group":
      if (valueId === "parking" || valueId === "petFriendly") {
        return {
          ...state,
          amenities: { ...state.amenities, [valueId]: false },
        };
      }
      return state;

    default:
      return state;
  }
}
