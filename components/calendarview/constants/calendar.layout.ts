/**
 * 캘린더 레이아웃 관련 상수
 *
 * - 그리드 구조, 주/일 수 등 불변 값 정의
 * - 매직 넘버 제거를 통한 코드 가독성 향상
 */

/**
 * 캘린더 레이아웃 구조 상수
 * Figma 스펙: 5행 그리드 (2026-02-03)
 */
export const CALENDAR_LAYOUT = {
  /** 캘린더에 표시할 주 수 (5주로 변경) */
  WEEKS_PER_MONTH: 5,

  /** 한 주의 일 수 */
  DAYS_PER_WEEK: 7,

  /** 총 셀 개수 (5주 × 7일 = 35칸) */
  TOTAL_CELLS: 35,

  /** 일요일 인덱스 */
  SUNDAY_INDEX: 0,

  /** 토요일 인덱스 */
  SATURDAY_INDEX: 6,

  /** Pill 최대 표시 개수 (2개까지만 표시, 나머지는 "+N개 더보기") */
  MAX_VISIBLE_PILLS: 2,
} as const;

/**
 * 요일 레이블 (영문 약자)
 */
export const WEEKDAY_LABELS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

/**
 * 요일 레이블 (한글 전체)
 * 접근성 및 스크린 리더 지원용
 */
export const WEEKDAY_LABELS_KO = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
] as const;

/**
 * 요일 레이블 타입 (영문)
 */
export type WeekdayLabel = (typeof WEEKDAY_LABELS)[number];

/**
 * 요일 레이블 타입 (한글)
 */
export type WeekdayLabelKo = (typeof WEEKDAY_LABELS_KO)[number];

/**
 * 주 인덱스 타입 (0~5)
 */
export type WeekIndex = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * 요일 인덱스 타입 (0~6, 일요일~토요일)
 */
export type DayOfWeekIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
