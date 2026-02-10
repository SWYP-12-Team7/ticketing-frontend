/**
 * 필터 변환 유틸리티
 *
 * LocationEventFilterState를 API 파라미터로 변환
 * - API 지원 필터: regionId, categories, subcategories
 * - API 미지원 필터: price, amenities, dateRange, eventStatus (클라이언트 필터링 필요)
 */

import type { LocationEventFilterState } from "@/components/common/LocationEventFilter/types";
import type {
  CalendarEventFilterParams,
  CalendarCategory,
} from "@/types/calendar";

/**
 * LocationEventFilterState를 API 요청 파라미터로 변환
 *
 * @description
 * - regions: 첫 번째 지역만 사용 (API는 단일 지역만 지원)
 * - popupCategories + exhibitionCategories: subcategories로 병합
 * - 카테고리가 선택되었는지 자동 판단하여 categories 배열 생성
 * - API 미지원 필터(price, amenities, dateRange, eventStatus)는 제외
 *
 * @param filterState - 필터바 UI 상태
 * @returns API 요청에 사용할 필터 파라미터
 *
 * @example
 * ```ts
 * const filterState: LocationEventFilterState = {
 *   regions: ['서울', '경기'],
 *   popupCategories: ['패션', '뷰티'],
 *   exhibitionCategories: ['미술'],
 *   price: { free: true, paid: false },
 *   amenities: { parking: true, petFriendly: false },
 *   dateRange: { startDate: '2026-02-01', endDate: '2026-02-28' },
 *   eventStatus: { all: false, ongoing: true, upcoming: false, ended: false },
 * };
 *
 * const apiParams = convertLocationFilterToAPIParams(filterState);
 * // Result:
 * // {
 * //   regionId: '서울',
 * //   categories: ['popup', 'exhibition'],
 * //   subcategories: ['패션', '뷰티', '미술']
 * // }
 * ```
 */
export function convertLocationFilterToAPIParams(
  filterState: LocationEventFilterState
): CalendarEventFilterParams {
  const { regions, popupCategories, exhibitionCategories } = filterState;

  // 1. regionId: 첫 번째 지역만 사용 (API는 단일 지역만 지원)
  const regionId = regions.length > 0 ? regions[0] : undefined;

  // 2. categories: 선택된 카테고리 판단
  const categories: CalendarCategory[] = [];

  // 팝업 카테고리가 선택되었으면 'popup' 추가
  if (popupCategories.length > 0) {
    categories.push("popup");
  }

  // 전시 카테고리가 선택되었으면 'exhibition' 추가
  if (exhibitionCategories.length > 0) {
    categories.push("exhibition");
  }

  // 3. subcategories: 팝업 + 전시 카테고리 병합
  const subcategories = [...popupCategories, ...exhibitionCategories];

  // 4. API 파라미터 반환
  return {
    regionId: regionId || undefined,
    categories: categories.length > 0 ? categories : undefined,
    subcategories: subcategories.length > 0 ? subcategories : undefined,
  };
}

/**
 * 필터 상태가 비어있는지 확인
 *
 * @description
 * - 모든 필터가 초기값(빈 배열, false, null)인지 확인
 * - 필터 적용 여부 판단에 사용
 *
 * @param filterState - 필터바 UI 상태
 * @returns 필터가 비어있으면 true, 하나라도 설정되어 있으면 false
 *
 * @example
 * ```ts
 * const emptyFilter = INITIAL_FILTER_STATE;
 * isFilterEmpty(emptyFilter); // true
 *
 * const activeFilter = { ...INITIAL_FILTER_STATE, regions: ['서울'] };
 * isFilterEmpty(activeFilter); // false
 * ```
 */
export function isFilterEmpty(filterState: LocationEventFilterState): boolean {
  return (
    filterState.regions.length === 0 &&
    filterState.popupCategories.length === 0 &&
    filterState.exhibitionCategories.length === 0 &&
    !filterState.price.free &&
    !filterState.price.paid &&
    !filterState.amenities.parking &&
    !filterState.amenities.petFriendly &&
    !filterState.dateRange.startDate &&
    !filterState.dateRange.endDate &&
    !filterState.eventStatus.all &&
    !filterState.eventStatus.ongoing &&
    !filterState.eventStatus.upcoming &&
    !filterState.eventStatus.ended
  );
}

/**
 * API 미지원 필터가 활성화되어 있는지 확인
 *
 * @description
 * - price, amenities, dateRange, eventStatus 중 하나라도 설정되어 있는지 확인
 * - 클라이언트 추가 필터링 필요 여부 판단에 사용
 *
 * @param filterState - 필터바 UI 상태
 * @returns API 미지원 필터가 활성화되어 있으면 true
 *
 * @example
 * ```ts
 * const filter1 = { ...INITIAL_FILTER_STATE, regions: ['서울'] };
 * hasClientSideFilters(filter1); // false (API 지원)
 *
 * const filter2 = { ...INITIAL_FILTER_STATE, price: { free: true, paid: false } };
 * hasClientSideFilters(filter2); // true (API 미지원)
 * ```
 */
export function hasClientSideFilters(
  filterState: LocationEventFilterState
): boolean {
  return (
    filterState.price.free ||
    filterState.price.paid ||
    filterState.amenities.parking ||
    filterState.amenities.petFriendly ||
    !!filterState.dateRange.startDate ||
    !!filterState.dateRange.endDate ||
    filterState.eventStatus.all ||
    filterState.eventStatus.ongoing ||
    filterState.eventStatus.upcoming ||
    filterState.eventStatus.ended
  );
}
