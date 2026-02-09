/**
 * 클라이언트 이벤트 필터링 유틸리티
 *
 * Backend API가 지원하지 않는 필터를 클라이언트에서 처리
 * - price: 무료/유료 필터
 * - amenities: 편의사항 필터 (주차, 반려견)
 * - dateRange: 기간 필터
 * - eventStatus: 행사 진행 상태 (진행중, 예정, 종료)
 */

import type { Event } from "@/types/event";
import type { LocationEventFilterState } from "@/components/common/LocationEventFilter/types";

/**
 * 날짜 문자열을 Date 객체로 변환
 *
 * @param dateStr - "YYYY-MM-DD" 또는 "YYYY.MM.DD ~ YYYY.MM.DD" 형식
 * @returns Date 객체 또는 null
 */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  // "YYYY-MM-DD" 형식
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // "YYYY.MM.DD ~ YYYY.MM.DD" 형식에서 시작 날짜 추출
  const match = dateStr.match(/^(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }

  return null;
}

/**
 * 이벤트의 종료 날짜 추출
 *
 * @param period - "YYYY.MM.DD ~ YYYY.MM.DD" 형식
 * @returns Date 객체 또는 null
 */
function parseEndDate(period: string): Date | null {
  if (!period) return null;

  const match = period.match(/~\s*(\d{4})\.(\d{2})\.(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return new Date(`${year}-${month}-${day}`);
  }

  return null;
}

/**
 * 이벤트가 가격 필터를 만족하는지 확인
 *
 * @param event - 이벤트 객체
 * @param priceFilter - 가격 필터 상태
 * @returns 필터를 만족하면 true
 *
 * @example
 * ```ts
 * const event = { priceDisplay: "무료", ... };
 * const filter = { free: true, paid: false };
 * matchesPriceFilter(event, filter); // true
 * ```
 */
function matchesPriceFilter(
  event: Event,
  priceFilter: LocationEventFilterState["price"]
): boolean {
  // 둘 다 선택 안 됨 또는 둘 다 선택됨 → 모두 통과
  if (
    (!priceFilter.free && !priceFilter.paid) ||
    (priceFilter.free && priceFilter.paid)
  ) {
    return true;
  }

  // 이벤트의 무료 여부 판단 (priceDisplay 또는 discountPrice 기반)
  const isFree =
    event.priceDisplay?.toLowerCase().includes("무료") ||
    event.priceDisplay?.toLowerCase().includes("free") ||
    (event.discountPrice !== undefined && event.discountPrice === 0);

  // 무료만 선택
  if (priceFilter.free && !priceFilter.paid) {
    return isFree === true;
  }

  // 유료만 선택
  if (!priceFilter.free && priceFilter.paid) {
    return isFree === false;
  }

  return true;
}

/**
 * 이벤트가 편의사항 필터를 만족하는지 확인
 *
 * @param event - 이벤트 객체
 * @param amenitiesFilter - 편의사항 필터 상태
 * @returns 필터를 만족하면 true
 *
 * @note
 * - Backend API가 편의사항 정보를 제공하지 않음
 * - 현재는 모든 이벤트를 통과시킴 (향후 API 지원 시 활성화)
 *
 * @example
 * ```ts
 * const event = { ... };
 * const filter = { parking: true, petFriendly: false };
 * matchesAmenitiesFilter(event, filter); // true (모든 이벤트 통과)
 * ```
 */
function matchesAmenitiesFilter(
  _event: Event,
  _amenitiesFilter: LocationEventFilterState["amenities"]
): boolean {
  // TODO: Backend API에서 편의사항 정보 제공 시 활성화
  // 현재는 필터 무시 (모든 이벤트 통과)
  return true;

  // 향후 구현:
  // if (amenitiesFilter.parking && !event.hasParking) return false;
  // if (amenitiesFilter.petFriendly && !event.isPetFriendly) return false;
  // return true;
}

/**
 * 이벤트가 기간 필터를 만족하는지 확인
 *
 * @param event - 이벤트 객체
 * @param dateRangeFilter - 기간 필터 상태
 * @returns 필터를 만족하면 true
 *
 * @example
 * ```ts
 * const event = { period: "2026.02.01 ~ 2026.02.28", ... };
 * const filter = { startDate: '2026-02-01', endDate: '2026-02-28' };
 * matchesDateRangeFilter(event, filter); // true
 * ```
 */
function matchesDateRangeFilter(
  event: Event,
  dateRangeFilter: LocationEventFilterState["dateRange"]
): boolean {
  const { startDate, endDate } = dateRangeFilter;

  // 필터가 설정되지 않음
  if (!startDate && !endDate) {
    return true;
  }

  // 이벤트의 시작/종료 날짜 파싱
  const eventStartDate = parseDateString(event.period || "");
  const eventEndDate = parseEndDate(event.period || "");

  if (!eventStartDate) {
    // 이벤트 날짜를 파싱할 수 없으면 제외
    return false;
  }

  const filterStartDate = startDate ? new Date(startDate) : null;
  const filterEndDate = endDate ? new Date(endDate) : null;

  // 시작 날짜 체크
  if (filterStartDate && eventStartDate < filterStartDate) {
    return false;
  }

  // 종료 날짜 체크 (이벤트 종료일이 있으면 사용, 없으면 시작일 사용)
  const eventCheckDate = eventEndDate || eventStartDate;
  if (filterEndDate && eventCheckDate > filterEndDate) {
    return false;
  }

  return true;
}

/**
 * 이벤트의 진행 상태 판단
 *
 * @param event - 이벤트 객체
 * @returns 'ongoing' | 'upcoming' | 'ended'
 */
function getEventStatus(event: Event): "ongoing" | "upcoming" | "ended" {
  const now = new Date();
  const eventStartDate = parseDateString(event.period || "");
  const eventEndDate = parseEndDate(event.period || "");

  if (!eventStartDate) {
    // 날짜를 파싱할 수 없으면 ongoing으로 간주
    return "ongoing";
  }

  // 진행 예정: 시작 날짜가 현재보다 미래
  if (eventStartDate > now) {
    return "upcoming";
  }

  // 진행 종료: 종료 날짜가 현재보다 과거
  if (eventEndDate && eventEndDate < now) {
    return "ended";
  }

  // 진행 중: 시작 ~ 종료 사이
  return "ongoing";
}

/**
 * 이벤트가 진행 상태 필터를 만족하는지 확인
 *
 * @param event - 이벤트 객체
 * @param statusFilter - 진행 상태 필터
 * @returns 필터를 만족하면 true
 *
 * @example
 * ```ts
 * const event = { period: "2026.02.01 ~ 2026.02.28", ... };
 * const filter = { all: false, ongoing: true, upcoming: false, ended: false };
 * matchesEventStatusFilter(event, filter); // true (if event is ongoing)
 * ```
 */
function matchesEventStatusFilter(
  event: Event,
  statusFilter: LocationEventFilterState["eventStatus"]
): boolean {
  const { all, ongoing, upcoming, ended } = statusFilter;

  // 아무것도 선택 안 됨 또는 '전체' 선택됨 → 모두 통과
  if (all || (!ongoing && !upcoming && !ended)) {
    return true;
  }

  const eventStatus = getEventStatus(event);

  // 선택된 상태에 이벤트 상태가 포함되는지 확인
  if (ongoing && eventStatus === "ongoing") return true;
  if (upcoming && eventStatus === "upcoming") return true;
  if (ended && eventStatus === "ended") return true;

  return false;
}

/**
 * 이벤트 목록에 클라이언트 필터 적용
 *
 * @description
 * Backend API가 지원하지 않는 필터를 클라이언트에서 처리:
 * - price: 무료/유료
 * - amenities: 주차/반려견
 * - dateRange: 기간 범위
 * - eventStatus: 진행중/예정/종료
 *
 * @param events - 원본 이벤트 목록
 * @param filterState - 필터 상태
 * @returns 필터링된 이벤트 목록
 *
 * @example
 * ```ts
 * const events = await getEventsFromAPI();
 * const filtered = applyClientSideFilters(events, filterState);
 * ```
 */
export function applyClientSideFilters(
  events: Event[],
  filterState: LocationEventFilterState
): Event[] {
  return events.filter((event) => {
    // 1. 가격 필터
    if (!matchesPriceFilter(event, filterState.price)) {
      return false;
    }

    // 2. 편의사항 필터
    if (!matchesAmenitiesFilter(event, filterState.amenities)) {
      return false;
    }

    // 3. 기간 필터
    if (!matchesDateRangeFilter(event, filterState.dateRange)) {
      return false;
    }

    // 4. 진행 상태 필터
    if (!matchesEventStatusFilter(event, filterState.eventStatus)) {
      return false;
    }

    return true;
  });
}
