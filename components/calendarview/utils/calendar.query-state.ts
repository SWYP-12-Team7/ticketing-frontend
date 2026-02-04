/**
 * 캘린더 뷰 쿼리 스트링 상태 관리
 *
 * - URL 파라미터 파싱 및 검증
 * - 쿼리 스트링 직렬화/역직렬화
 * - 기본값 처리
 */

import type {
  CalendarCategory,
  IsoMonth,
  PopupSubcategory,
  ExhibitionSubcategory,
} from "@/types/calendar";
import { toIsoMonth } from "@/lib/calendar-date";
import { isValidIsoMonth } from "./calendar.validation";

/**
 * 카테고리별 활성화 상태 맵
 *
 * @example
 * ```ts
 * const activeMap: CalendarCategoryActiveMap = {
 *   exhibition: true,
 *   popup: false
 * };
 * ```
 */
export type CalendarCategoryActiveMap = Record<CalendarCategory, boolean>;

/**
 * 캘린더 뷰 쿼리 스트링 상태 타입
 */
export type CalendarViewQueryState = Readonly<{
  /** 표시할 월 (YYYY-MM) */
  month: IsoMonth;
  /** 선택된 지역 ID */
  regionId: string;
  /** 카테고리별 활성화 상태 */
  activeCategories: CalendarCategoryActiveMap;
}>;

/**
 * 기본 카테고리 활성화 상태 (모두 선택)
 */
const DEFAULT_ACTIVE_CATEGORIES: CalendarCategoryActiveMap = {
  exhibition: true,
  popup: true,
} as const;

/**
 * 기본 지역 ID
 */
const DEFAULT_REGION_ID = "all" as const;

/**
 * URL 파라미터에서 월(month) 값 파싱
 *
 * - 유효하지 않은 값이면 현재 월 반환
 * - 날짜 범위 검증 포함
 *
 * @param value - URL 파라미터 값
 * @returns 파싱된 IsoMonth 또는 현재 월
 *
 * @example
 * ```ts
 * parseMonthParam("2025-02"); // "2025-02"
 * parseMonthParam("invalid");  // 현재 월
 * parseMonthParam(null);       // 현재 월
 * ```
 */
export function parseMonthParam(value: string | null): IsoMonth {
  if (value && isValidIsoMonth(value)) {
    return value;
  }
  return toIsoMonth(new Date());
}

/**
 * URL 파라미터에서 지역 ID 파싱
 *
 * @param value - URL 파라미터 값
 * @returns 파싱된 지역 ID 또는 기본값 "all"
 *
 * @example
 * ```ts
 * parseRegionIdParam("haeundae"); // "haeundae"
 * parseRegionIdParam("");         // "all"
 * parseRegionIdParam(null);       // "all"
 * ```
 */
export function parseRegionIdParam(value: string | null): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_REGION_ID;
}

/**
 * URL 파라미터에서 카테고리 활성화 상태 파싱
 *
 * - null/undefined: 기본값 (모두 활성화)
 * - 빈 문자열: 모두 비활성화
 * - "exhibition,popup": 파싱하여 활성화 상태 설정
 *
 * @param value - URL 파라미터 값 (쉼표로 구분된 카테고리)
 * @returns 카테고리별 활성화 상태 맵
 *
 * @example
 * ```ts
 * parseCategoriesParam(null);              // { exhibition: true, popup: true }
 * parseCategoriesParam("");                // { exhibition: false, popup: false }
 * parseCategoriesParam("exhibition");      // { exhibition: true, popup: false }
 * parseCategoriesParam("exhibition,popup"); // { exhibition: true, popup: true }
 * ```
 */
export function parseCategoriesParam(
  value: string | null
): CalendarCategoryActiveMap {
  // 빈 문자열 = 명시적으로 모두 해제
  if (value === "") {
    return { exhibition: false, popup: false };
  }

  // null 또는 undefined = 기본값 (둘 다 체크)
  if (!value) {
    return DEFAULT_ACTIVE_CATEGORIES;
  }

  // 쉼표로 구분된 카테고리 파싱
  const tokens = new Set(
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );

  return {
    exhibition: tokens.has("exhibition"),
    popup: tokens.has("popup"),
  };
}

/**
 * 카테고리 활성화 상태를 URL 파라미터 문자열로 직렬화
 *
 * @param active - 카테고리별 활성화 상태 맵
 * @returns 직렬화된 문자열 또는 null (모두 비활성화 시 빈 문자열)
 *
 * @example
 * ```ts
 * serializeCategoriesParam({ exhibition: true, popup: true });
 * // "exhibition,popup"
 *
 * serializeCategoriesParam({ exhibition: true, popup: false });
 * // "exhibition"
 *
 * serializeCategoriesParam({ exhibition: false, popup: false });
 * // ""
 * ```
 */
export function serializeCategoriesParam(
  active: CalendarCategoryActiveMap
): string | null {
  const selected = (Object.keys(active) as CalendarCategory[]).filter(
    (key) => active[key]
  );

  // 모두 해제 → 빈 문자열 반환 (null이 아님!)
  if (selected.length === 0) {
    return "";
  }

  return selected.join(",");
}

/**
 * 활성화된 카테고리 목록 추출
 *
 * @param active - 카테고리별 활성화 상태 맵
 * @returns 활성화된 카테고리 배열
 *
 * @example
 * ```ts
 * getSelectedCategories({ exhibition: true, popup: false });
 * // ["exhibition"]
 *
 * getSelectedCategories({ exhibition: true, popup: true });
 * // ["exhibition", "popup"]
 * ```
 */
export function getSelectedCategories(
  active: CalendarCategoryActiveMap
): CalendarCategory[] {
  return (Object.keys(active) as CalendarCategory[]).filter(
    (key) => active[key]
  );
}

/**
 * 기본 서브카테고리
 */
const DEFAULT_POPUP_SUBCATEGORY: PopupSubcategory = "all" as const;
const DEFAULT_EXHIBITION_SUBCATEGORY: ExhibitionSubcategory = "all" as const;

/**
 * 유효한 팝업 서브카테고리 목록
 */
const VALID_POPUP_SUBCATEGORIES = new Set<PopupSubcategory>([
  "all",
  "fashion",
  "beauty",
  "fnb",
  "character",
  "tech",
  "lifestyle",
  "furniture",
]);

/**
 * 유효한 전시 서브카테고리 목록
 */
const VALID_EXHIBITION_SUBCATEGORIES = new Set<ExhibitionSubcategory>([
  "all",
  "art",
  "photo",
  "design",
  "sculpture",
  "media",
  "craft",
  "history",
]);

/**
 * URL 파라미터에서 팝업 서브카테고리 파싱
 *
 * @param value - URL 파라미터 값
 * @returns 파싱된 팝업 서브카테고리 또는 기본값 "all"
 *
 * @example
 * ```ts
 * parsePopupSubcategoryParam("beauty"); // "beauty"
 * parsePopupSubcategoryParam("invalid"); // "all"
 * parsePopupSubcategoryParam(null);      // "all"
 * ```
 */
export function parsePopupSubcategoryParam(
  value: string | null
): PopupSubcategory {
  if (value && VALID_POPUP_SUBCATEGORIES.has(value as PopupSubcategory)) {
    return value as PopupSubcategory;
  }
  return DEFAULT_POPUP_SUBCATEGORY;
}

/**
 * URL 파라미터에서 전시 서브카테고리 파싱
 *
 * @param value - URL 파라미터 값
 * @returns 파싱된 전시 서브카테고리 또는 기본값 "all"
 *
 * @example
 * ```ts
 * parseExhibitionSubcategoryParam("art"); // "art"
 * parseExhibitionSubcategoryParam("invalid"); // "all"
 * parseExhibitionSubcategoryParam(null);      // "all"
 * ```
 */
export function parseExhibitionSubcategoryParam(
  value: string | null
): ExhibitionSubcategory {
  if (
    value &&
    VALID_EXHIBITION_SUBCATEGORIES.has(value as ExhibitionSubcategory)
  ) {
    return value as ExhibitionSubcategory;
  }
  return DEFAULT_EXHIBITION_SUBCATEGORY;
}
