/**
 * 필터 관련 유틸리티 함수
 *
 * 캘린더뷰와 지도뷰에서 사용
 */

import type { LocationEventFilterState } from "./types";
import { REGIONS, POPUP_CATEGORIES, EXHIBITION_CATEGORIES } from "./constants";

/**
 * Display Filter 타입 (CalendarToolbar용)
 */
export interface DisplayFilter {
  id: string;
  label: string;
  type: "region" | "popup" | "exhibition" | "price" | "amenity";
  showRemoveButton?: boolean;
}

/**
 * LocationEventFilterState를 Display Pills로 변환
 *
 * "전체"만 선택된 경우 → "전체" pill 표시 (X 버튼 없음)
 * 개별 항목 선택 시 → 해당 항목들만 표시 (X 버튼 있음)
 */
export function convertFiltersToDisplayPills(
  filters: LocationEventFilterState
): DisplayFilter[] {
  const pills: DisplayFilter[] = [];

  // 모든 필터가 기본값("전체"만 선택)인지 확인
  const isDefaultState =
    filters.regions.length === 1 &&
    filters.regions[0] === "all" &&
    filters.popupCategories.length === 1 &&
    filters.popupCategories[0] === "all" &&
    filters.exhibitionCategories.length === 1 &&
    filters.exhibitionCategories[0] === "all" &&
    !filters.price.free &&
    !filters.price.paid &&
    !filters.amenities.parking &&
    !filters.amenities.petFriendly;

  // 기본 상태면 "전체" pill 하나만 반환
  if (isDefaultState) {
    return [
      {
        id: "all",
        label: "전체",
        type: "region",
        showRemoveButton: false,
      },
    ];
  }

  // 지역 (전체 제외)
  filters.regions
    .filter((id) => id !== "all")
    .forEach((id) => {
      const region = REGIONS.find((r) => r.id === id);
      if (region) {
        pills.push({
          id: `region-${id}`,
          label: region.label,
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
          label: category.label,
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
          label: category.label,
          type: "exhibition",
          showRemoveButton: true,
        });
      }
    });

  // 가격
  if (filters.price.free) {
    pills.push({
      id: "price-free",
      label: "무료",
      type: "price",
      showRemoveButton: true,
    });
  }
  if (filters.price.paid) {
    pills.push({
      id: "price-paid",
      label: "유료",
      type: "price",
      showRemoveButton: true,
    });
  }

  // 편의사항
  if (filters.amenities.parking) {
    pills.push({
      id: "amenity-parking",
      label: "주차가능",
      type: "amenity",
      showRemoveButton: true,
    });
  }
  if (filters.amenities.petFriendly) {
    pills.push({
      id: "amenity-petFriendly",
      label: "반려견 동반",
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
