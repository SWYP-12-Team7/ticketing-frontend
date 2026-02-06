/**
 * CalendarView 모듈 Public API
 *
 * 외부에서 import 시 이 파일을 통해서만 접근하도록 캡슐화
 *
 * @example
 * ```ts
 * import { CalendarView } from '@/components/calendarview';
 * ```
 */

// ===== 메인 컴포넌트 =====
export { CalendarView } from "./CalendarView";
export { CalendarViewPresentation } from "./CalendarViewPresentation";

// ===== 하위 컴포넌트 =====
export { CalendarGrid } from "./CalendarGrid";
export { CalendarToolbar } from "./CalendarToolbar";
export { CalendarMonthNav } from "./CalendarMonthNav";
export { HotEventSection } from "./HotEventSection";

// ===== Custom Hooks =====
export {
  useCalendarQueryState,
  useCalendarGridData,
  useCalendarKeyboardNavigation,
  type CalendarQueryState,
  type CalendarGridData,
  type CalendarKeyboardNavigation,
} from "./hooks";

// ===== 타입 =====
export type {
  CalendarViewProps,
  CalendarDayCellProps,
  CalendarWeekRowProps,
  CalendarGridProps,
  DateClickHandler,
} from "./types";

// ===== 유틸리티 =====
export {
  parseMonthParam,
  parseRegionIdParam,
  parseCategoriesParam,
  serializeCategoriesParam,
  getSelectedCategories,
  isValidIsoDate,
  isValidIsoMonth,
  toValidIsoDate,
  toValidIsoMonth,
  formatDateKorean,
  formatDateKoreanFull,
  formatDateForScreenReader,
  formatNumberWithCommas,
  formatEventCount,
  type CalendarCategoryActiveMap,
  type CalendarViewQueryState,
} from "./utils";

// ===== 상수 =====
export {
  CALENDAR_CATEGORY_META,
  CALENDAR_CATEGORIES,
  CALENDAR_DESIGN_TOKENS,
  CALENDAR_LAYOUT,
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_KO,
  type CalendarCategoryMeta,
  type CalendarDesignTokens,
  type WeekdayLabel,
  type WeekdayLabelKo,
  type WeekIndex,
  type DayOfWeekIndex,
} from "./constants";
