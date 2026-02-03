/**
 * 캘린더 뷰 상수 모듈
 *
 * 모든 상수를 단일 지점에서 export하여 import 경로 단순화
 */

export {
  CALENDAR_CATEGORY_META,
  CALENDAR_CATEGORIES,
  type CalendarCategoryMeta,
} from "./calendar.constants";

export {
  CALENDAR_DESIGN_TOKENS,
  type CalendarDesignTokens,
} from "./calendar.design-tokens";

export {
  CALENDAR_LAYOUT,
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_KO,
  type WeekdayLabel,
  type WeekdayLabelKo,
  type WeekIndex,
  type DayOfWeekIndex,
} from "./calendar.layout";

export {
  POPUP_SUBCATEGORIES,
  EXHIBITION_SUBCATEGORIES,
  POPUP_SUBCATEGORY_OPTIONS,
  EXHIBITION_SUBCATEGORY_OPTIONS,
} from "./calendar.subcategories";
