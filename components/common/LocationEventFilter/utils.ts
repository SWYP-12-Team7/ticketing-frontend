/**
 * 필터 관련 유틸리티 함수
 *
 * 캘린더뷰와 지도뷰에서 사용
 */

import type { LocationEventFilterState } from "./types";
import { REGIONS, POPUP_CATEGORIES, EXHIBITION_CATEGORIES } from "./constants";

/**
 * Display Filter 타입 (CalendarToolbar용)
 * Figma 스펙: 레이블 + 값 2개 영역 구조
 */
export interface DisplayFilter {
  /** 고유 ID */
  id: string;
  /** 필터 레이블 (예: "지역", "팝업") */
  displayLabel: string;
  /** 필터 값 (예: "부산", "뷰티") */
  value: string;
  /** 필터 타입 */
  type: "region" | "popup" | "exhibition" | "price" | "amenity";
  /** X 버튼 표시 여부 */
  showRemoveButton?: boolean;
}

/**
 * LocationEventFilterState를 Display Pills로 변환
 *
 * Figma 스펙 준수: 레이블 + 값 2개 영역 구조
 * - "전체"만 선택된 경우 → pill 표시 안 함
 * - 개별 항목 선택 시 → 레이블과 값으로 분리하여 표시
 */
export function convertFiltersToDisplayPills(
  filters: LocationEventFilterState
): DisplayFilter[] {
  const pills: DisplayFilter[] = [];

  // 지역 (전체 제외)
  filters.regions
    .filter((id) => id !== "all")
    .forEach((id) => {
      const region = REGIONS.find((r) => r.id === id);
      if (region) {
        pills.push({
          id: `region-${id}`,
          displayLabel: "지역",
          value: region.label,
          type: "region",
          showRemoveButton: true,
        });
      }
    });

  // 팝업 카테고리 (전체 제외)
  filters.popupCategories
    .filter((id) => id !== "all")
    .forEach((id) => {
      const category = POPUP_CATEGORIES.find((c) => c.id === id);
      if (category) {
        pills.push({
          id: `popup-${id}`,
          displayLabel: "팝업",
          value: category.label,
          type: "popup",
          showRemoveButton: true,
        });
      }
    });

  // 전시 카테고리 (전체 제외)
  filters.exhibitionCategories
    .filter((id) => id !== "all")
    .forEach((id) => {
      const category = EXHIBITION_CATEGORIES.find((c) => c.id === id);
      if (category) {
        pills.push({
          id: `exhibition-${id}`,
          displayLabel: "전시",
          value: category.label,
          type: "exhibition",
          showRemoveButton: true,
        });
      }
    });

  // 가격
  if (filters.price.free) {
    pills.push({
      id: "price-free",
      displayLabel: "가격",
      value: "무료",
      type: "price",
      showRemoveButton: true,
    });
  }
  if (filters.price.paid) {
    pills.push({
      id: "price-paid",
      displayLabel: "가격",
      value: "유료",
      type: "price",
      showRemoveButton: true,
    });
  }

  // 편의사항
  if (filters.amenities.parking) {
    pills.push({
      id: "amenity-parking",
      displayLabel: "편의시설",
      value: "주차가능",
      type: "amenity",
      showRemoveButton: true,
    });
  }
  if (filters.amenities.petFriendly) {
    pills.push({
      id: "amenity-petFriendly",
      displayLabel: "편의시설",
      value: "반려견 동반",
      type: "amenity",
      showRemoveButton: true,
    });
  }

  return pills;
}

/**
 * 필터 pill ID로 필터 상태에서 해당 항목 제거
 */
export function removeFilterFromState(
  state: LocationEventFilterState,
  filterId: string
): LocationEventFilterState {
  const [type, value] = filterId.split("-");

  switch (type) {
    case "region": {
      const newRegions = state.regions.filter((id) => id !== value);
      return {
        ...state,
        regions: newRegions.length === 0 ? ["all"] : newRegions,
      };
    }

    case "popup": {
      const newCategories = state.popupCategories.filter((id) => id !== value);
      return {
        ...state,
        popupCategories: newCategories.length === 0 ? ["all"] : newCategories,
      };
    }

    case "exhibition": {
      const newCategories = state.exhibitionCategories.filter(
        (id) => id !== value
      );
      return {
        ...state,
        exhibitionCategories:
          newCategories.length === 0 ? ["all"] : newCategories,
      };
    }

    case "price":
      return {
        ...state,
        price: {
          ...state.price,
          [value]: false,
        },
      };

    case "amenity":
      return {
        ...state,
        amenities: {
          ...state.amenities,
          [value]: false,
        },
      };

    default:
      return state;
  }
}
