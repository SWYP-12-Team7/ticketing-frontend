/**
 * 캘린더 날짜 검증 유틸리티
 *
 * - any 타입 제거를 위한 타입 가드 함수
 * - 안전한 날짜 변환 함수
 * - URL 파라미터 검증
 */

import type { IsoDate, IsoMonth } from "@/types/calendar";

/**
 * 날짜 검증 상수
 */
const VALIDATION_CONSTANTS = {
  /** 허용 최소 연도 */
  MIN_YEAR: 2020,
  /** 허용 최대 연도 */
  MAX_YEAR: 2030,
  /** 최소 월 (1 = 1월) */
  MIN_MONTH: 1,
  /** 최대 월 (12 = 12월) */
  MAX_MONTH: 12,
  /** 최소 일 */
  MIN_DAY: 1,
  /** 최대 일 (실제 검증은 월별로 수행) */
  MAX_DAY: 31,
} as const;

/**
 * IsoDate 형식 정규식 (YYYY-MM-DD)
 */
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * IsoMonth 형식 정규식 (YYYY-MM)
 */
const ISO_MONTH_REGEX = /^\d{4}-\d{2}$/;

/**
 * 문자열이 유효한 IsoDate 형식인지 검증하는 타입 가드
 *
 * @param value - 검증할 문자열
 * @returns Type guard - IsoDate 타입 여부
 *
 * @example
 * ```ts
 * const dateStr = "2025-02-03";
 * if (isValidIsoDate(dateStr)) {
 *   // dateStr은 IsoDate 타입으로 좁혀짐
 *   const iso: IsoDate = dateStr;
 * }
 * ```
 */
export function isValidIsoDate(value: string): value is IsoDate {
  // 형식 검증
  if (!ISO_DATE_REGEX.test(value)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // 연도 범위 검증
  if (
    year < VALIDATION_CONSTANTS.MIN_YEAR ||
    year > VALIDATION_CONSTANTS.MAX_YEAR
  ) {
    return false;
  }

  // 월 범위 검증
  if (
    month < VALIDATION_CONSTANTS.MIN_MONTH ||
    month > VALIDATION_CONSTANTS.MAX_MONTH
  ) {
    return false;
  }

  // 해당 월의 실제 일 수 확인
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < VALIDATION_CONSTANTS.MIN_DAY || day > daysInMonth) {
    return false;
  }

  return true;
}

/**
 * 문자열이 유효한 IsoMonth 형식인지 검증하는 타입 가드
 *
 * @param value - 검증할 문자열
 * @returns Type guard - IsoMonth 타입 여부
 *
 * @example
 * ```ts
 * const monthStr = "2025-02";
 * if (isValidIsoMonth(monthStr)) {
 *   // monthStr은 IsoMonth 타입으로 좁혀짐
 *   const iso: IsoMonth = monthStr;
 * }
 * ```
 */
export function isValidIsoMonth(value: string): value is IsoMonth {
  // 형식 검증
  if (!ISO_MONTH_REGEX.test(value)) {
    return false;
  }

  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);

  // 연도 범위 검증
  if (
    year < VALIDATION_CONSTANTS.MIN_YEAR ||
    year > VALIDATION_CONSTANTS.MAX_YEAR
  ) {
    return false;
  }

  // 월 범위 검증
  if (
    month < VALIDATION_CONSTANTS.MIN_MONTH ||
    month > VALIDATION_CONSTANTS.MAX_MONTH
  ) {
    return false;
  }

  return true;
}

/**
 * any 타입 없이 안전하게 IsoDate로 변환
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @param day - 일 (1-31)
 * @returns 유효한 IsoDate 또는 null
 *
 * @example
 * ```ts
 * const isoDate = toValidIsoDate(2025, 2, 3);
 * if (isoDate) {
 *   console.log(isoDate); // "2025-02-03"
 * }
 * ```
 */
export function toValidIsoDate(
  year: number,
  month: number,
  day: number
): IsoDate | null {
  const monthStr = String(month).padStart(2, "0");
  const dayStr = String(day).padStart(2, "0");
  const candidate = `${year}-${monthStr}-${dayStr}`;

  return isValidIsoDate(candidate) ? candidate : null;
}

/**
 * any 타입 없이 안전하게 IsoMonth로 변환
 *
 * @param year - 연도
 * @param month - 월 (1-12)
 * @returns 유효한 IsoMonth 또는 null
 *
 * @example
 * ```ts
 * const isoMonth = toValidIsoMonth(2025, 2);
 * if (isoMonth) {
 *   console.log(isoMonth); // "2025-02"
 * }
 * ```
 */
export function toValidIsoMonth(year: number, month: number): IsoMonth | null {
  const monthStr = String(month).padStart(2, "0");
  const candidate = `${year}-${monthStr}`;

  return isValidIsoMonth(candidate) ? candidate : null;
}

/**
 * 검증 상수 export (테스트 및 외부 참조용)
 */
export { VALIDATION_CONSTANTS };
