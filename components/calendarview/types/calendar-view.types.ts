/**
 * 캘린더 뷰 컴포넌트 타입 정의
 *
 * - Props 타입
 * - 내부 상태 타입
 * - 이벤트 핸들러 타입
 */

import type {
  IsoDate,
  CalendarCategory,
  SelectedCalendarEvent,
} from "@/types/calendar";
import type { CalendarCategoryActiveMap } from "../utils/calendar.query-state";

/**
 * 날짜 클릭 핸들러 타입
 */
export type DateClickHandler = (date: IsoDate) => void;

/**
 * Pill 클릭 핸들러 타입
 */
export type PillClickHandler = (
  date: IsoDate,
  category: CalendarCategory
) => void;

/**
 * CalendarView 컴포넌트 Props
 */
export interface CalendarViewProps {
  /** 선택된 날짜 */
  selectedDate?: IsoDate | null;
  /** 날짜 클릭 핸들러 */
  onDateClick?: DateClickHandler;
}

/**
 * CalendarDayCell 컴포넌트 Props
 */
export interface CalendarDayCellProps {
  /** 표시할 날짜 */
  day: Date;
  /** 현재 보고 있는 월 */
  visibleMonthDate: Date;
  /** 활성화된 카테고리 */
  activeCategories: CalendarCategoryActiveMap;
  /** 이 날짜의 이벤트 개수 */
  counts: {
    exhibition: number;
    popup: number;
  };
  /** 선택된 날짜 (IsoDate 형식) */
  selectedDate?: IsoDate | null;
  /** 선택된 pill 카테고리들 (다중 선택 지원) */
  selectedPillCategories?: Set<CalendarCategory>;
  /** 날짜 클릭 핸들러 */
  onDateClick?: DateClickHandler;
  /** Pill 클릭 핸들러 */
  onPillClick?: PillClickHandler;
}

/**
 * CalendarWeekRow 컴포넌트 Props
 */
export interface CalendarWeekRowProps {
  /** 주의 날짜 배열 (7개) */
  weekDays: readonly Date[];
  /** 현재 보고 있는 월 */
  visibleMonthDate: Date;
  /** 활성화된 카테고리 */
  activeCategories: CalendarCategoryActiveMap;
  /** 날짜별 이벤트 개수 맵 */
  countsByDate: ReadonlyMap<IsoDate, { exhibition: number; popup: number }>;
  /** 선택된 날짜 */
  selectedDate?: IsoDate | null;
  /** 선택된 pill 카테고리들 (다중 선택 지원) */
  selectedPillCategories?: Set<CalendarCategory>;
  /** 날짜 클릭 핸들러 */
  onDateClick?: DateClickHandler;
  /** Pill 클릭 핸들러 */
  onPillClick?: PillClickHandler;
}

/**
 * CalendarGrid 컴포넌트 Props
 */
export interface CalendarGridProps {
  /** 현재 보고 있는 월 */
  visibleMonthDate: Date;
  /** 그리드에 표시할 날짜 배열 (35개 또는 42개) */
  gridDays: readonly Date[];
  /** 활성화된 카테고리 */
  activeCategories: CalendarCategoryActiveMap;
  /** 날짜별 이벤트 개수 맵 */
  countsByDate: ReadonlyMap<IsoDate, { exhibition: number; popup: number }>;
  /** 선택된 날짜 */
  selectedDate?: IsoDate | null;
  /** 선택된 pill 카테고리들 (다중 선택 지원) */
  selectedPillCategories?: Set<CalendarCategory>;
  /** 날짜 클릭 핸들러 */
  onDateClick?: DateClickHandler;
  /** Pill 클릭 핸들러 */
  onPillClick?: PillClickHandler;
}
