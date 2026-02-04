/**
 * 캘린더 뷰 유틸리티 함수 모듈
 *
 * 모든 유틸리티를 단일 지점에서 export
 */

export {
  parseMonthParam,
  parseRegionIdParam,
  parseCategoriesParam,
  serializeCategoriesParam,
  getSelectedCategories,
  type CalendarCategoryActiveMap,
  type CalendarViewQueryState,
} from "./calendar.query-state";

export {
  isValidIsoDate,
  isValidIsoMonth,
  toValidIsoDate,
  toValidIsoMonth,
  VALIDATION_CONSTANTS,
} from "./calendar.validation";

export {
  formatDateKorean,
  formatDateKoreanFull,
  formatDateForScreenReader,
  formatNumberWithCommas,
  formatEventCount,
} from "./calendar.formatters";
