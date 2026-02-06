/**
 * 캘린더 날짜 포맷팅 유틸리티
 *
 * - 사용자에게 표시할 날짜 문자열 생성
 * - 접근성을 위한 스크린 리더용 포맷팅
 * - 국제화(i18n) 준비
 */

import type { IsoDate } from "@/types/calendar";
import { parseIsoDateLocal } from "@/lib/calendar-date";

/**
 * IsoDate를 "M월 D일" 형식으로 포맷팅
 *
 * @param isoDate - ISO 형식 날짜 문자열 (YYYY-MM-DD)
 * @returns 한글 날짜 문자열 (예: "2월 3일")
 *
 * @example
 * ```ts
 * formatDateKorean("2025-02-03"); // "2월 3일"
 * formatDateKorean("2025-12-25"); // "12월 25일"
 * ```
 */
export function formatDateKorean(isoDate: IsoDate): string {
  const date = parseIsoDateLocal(isoDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * IsoDate를 "YYYY년 M월 D일" 형식으로 포맷팅
 *
 * @param isoDate - ISO 형식 날짜 문자열
 * @returns 한글 전체 날짜 문자열 (예: "2025년 2월 3일")
 *
 * @example
 * ```ts
 * formatDateKoreanFull("2025-02-03"); // "2025년 2월 3일"
 * ```
 */
export function formatDateKoreanFull(isoDate: IsoDate): string {
  const date = parseIsoDateLocal(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 스크린 리더용 날짜 포맷팅 (접근성)
 *
 * - 요일 정보 포함
 * - 자연스러운 한글 표현
 *
 * @param isoDate - ISO 형식 날짜 문자열
 * @returns 스크린 리더 친화적 문자열
 *
 * @example
 * ```ts
 * formatDateForScreenReader("2025-02-03");
 * // "2025년 2월 3일 월요일"
 * ```
 */
export function formatDateForScreenReader(isoDate: IsoDate): string {
  const date = parseIsoDateLocal(isoDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const weekdayNames = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekday = weekdayNames[date.getDay()];

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

/**
 * 숫자를 천 단위 콤마로 포맷팅
 *
 * @param num - 포맷팅할 숫자
 * @returns 콤마가 포함된 문자열 (예: "1,234")
 *
 * @example
 * ```ts
 * formatNumberWithCommas(1234); // "1,234"
 * formatNumberWithCommas(1234567); // "1,234,567"
 * ```
 */
export function formatNumberWithCommas(num: number): string {
  return num.toLocaleString("ko-KR");
}

/**
 * 이벤트 개수를 사용자 친화적으로 포맷팅
 *
 * - 0개: 빈 문자열
 * - 1개 이상: "N개"
 * - 100개 이상: "99+"
 *
 * @param count - 이벤트 개수
 * @param maxDisplay - 최대 표시 개수 (기본값: 99)
 * @returns 포맷팅된 문자열
 *
 * @example
 * ```ts
 * formatEventCount(0);   // ""
 * formatEventCount(5);   // "5개"
 * formatEventCount(150); // "99+"
 * ```
 */
export function formatEventCount(count: number, maxDisplay = 99): string {
  if (count <= 0) {
    return "";
  }

  if (count > maxDisplay) {
    return `${maxDisplay}+`;
  }

  return `${count}개`;
}
