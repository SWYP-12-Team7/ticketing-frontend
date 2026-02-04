/**
 * 필터 조건에 맞는 이벤트 개수 계산
 *
 * TODO: 실제 API 연동 시 이 함수를 교체
 */

import type { LocationEventFilterState } from "@/components/common/LocationEventFilter/types";

/**
 * 필터 조건에 맞는 이벤트 개수 계산 (더미)
 *
 * @param filters - 필터 상태
 * @returns 이벤트 개수
 */
export function calculateEventCount(filters: LocationEventFilterState): number {
  // 기본값
  let count = 100;

  // 지역 필터 적용 (전체가 아닐 경우)
  if (!filters.regions.includes("all")) {
    const regionCount = filters.regions.length;
    count = Math.floor(count * (regionCount / 17)); // 17개 지역 중 선택된 비율
  }

  // 팝업 카테고리 필터 적용
  if (!filters.popupCategories.includes("all")) {
    count = Math.floor(count * 0.7); // 30% 감소
  }

  // 전시 카테고리 필터 적용
  if (!filters.exhibitionCategories.includes("all")) {
    count = Math.floor(count * 0.7); // 30% 감소
  }

  // 가격 필터 적용
  if (filters.price.free && !filters.price.paid) {
    count = Math.floor(count * 0.4); // 무료만 40%
  } else if (!filters.price.free && filters.price.paid) {
    count = Math.floor(count * 0.6); // 유료만 60%
  }

  // 편의사항 필터 적용
  if (filters.amenities.parking) {
    count = Math.floor(count * 0.8); // 20% 감소
  }
  if (filters.amenities.petFriendly) {
    count = Math.floor(count * 0.7); // 30% 감소
  }

  return Math.max(count, 0);
}

/**
 * 실제 API 연동 함수 (향후 구현)
 *
 * @param filters - 필터 상태
 * @returns 이벤트 개수
 */
export async function fetchEventCount(
  filters: LocationEventFilterState
): Promise<number> {
  // TODO: API 연동
  // const response = await fetch('/api/events/count', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(filters),
  // });
  // const data = await response.json();
  // return data.count;

  return calculateEventCount(filters);
}
