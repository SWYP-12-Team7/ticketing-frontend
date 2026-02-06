/**
 * 지역/행사 필터 타입 정의
 *
 * 캘린더뷰와 지도뷰에서 공통으로 사용
 */

/**
 * 지역/행사 필터 상태
 */
export interface LocationEventFilterState {
  /** 지역 (다중 선택) */
  regions: string[];

  /** 팝업 카테고리 (다중 선택) */
  popupCategories: string[];

  /** 전시 카테고리 (다중 선택) */
  exhibitionCategories: string[];

  /** 가격 필터 */
  price: {
    /** 무료 */
    free: boolean;
    /** 유료 */
    paid: boolean;
  };

  /** 편의사항 필터 */
  amenities: {
    /** 주차가능 */
    parking: boolean;
    /** 반려견 동반 가능 */
    petFriendly: boolean;
  };
}

/**
 * Pill 옵션 타입
 */
export interface PillOption {
  id: string;
  label: string;
}

/**
 * 체크박스 옵션 타입
 */
export interface CheckboxOption {
  id: string;
  label: string;
}
