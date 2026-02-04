import type { CalendarCategory } from "@/types/calendar";

/**
 * 캘린더 카테고리별 메타데이터
 *
 * - 각 카테고리의 레이블, 색상 정보 정의
 * - UI 일관성 유지를 위한 단일 정의
 *
 * @example
 * ```ts
 * const exhibitionLabel = CALENDAR_CATEGORY_META.exhibition.label; // "전시회"
 * ```
 */
export const CALENDAR_CATEGORY_META: Record<
  CalendarCategory,
  Readonly<{
    /** 사용자에게 표시할 레이블 */
    label: string;
    /** 왼쪽 액센트 테두리 색상 */
    accentBorderColor: string;
    /** Pill 배경 색상 */
    pillBackgroundColor: string;
  }>
> = {
  exhibition: {
    label: "전시회",
    accentBorderColor: "#A2C5FF",
    pillBackgroundColor: "#F8F9FA",
  },
  popup: {
    label: "팝업",
    accentBorderColor: "#FFBF89",
    pillBackgroundColor: "#F8F9FA",
  },
} as const;

/**
 * 모든 캘린더 카테고리 키 배열
 *
 * @example
 * ```ts
 * CALENDAR_CATEGORIES.forEach(category => {
 *   console.log(CALENDAR_CATEGORY_META[category].label);
 * });
 * ```
 */
export const CALENDAR_CATEGORIES = Object.keys(
  CALENDAR_CATEGORY_META
) as CalendarCategory[];

/**
 * 카테고리 메타데이터 타입
 */
export type CalendarCategoryMeta =
  (typeof CALENDAR_CATEGORY_META)[CalendarCategory];
