/**
 * 캘린더 키보드 네비게이션 커스텀 훅
 *
 * - 화살표 키로 날짜 간 이동
 * - PageUp/PageDown으로 월 이동
 * - Home/End 키 지원
 * - 접근성 향상
 */

import { useCallback } from "react";
import type { IsoDate } from "@/types/calendar";
import { parseIsoDateLocal, toIsoDateLocal } from "@/lib/calendar-date";

/**
 * 날짜에 일수를 더한 IsoDate 반환
 */
function addDays(isoDate: IsoDate, days: number): IsoDate {
  const date = parseIsoDateLocal(isoDate);
  date.setDate(date.getDate() + days);
  return toIsoDateLocal(date);
}

/**
 * 해당 주의 시작일(일요일) 반환
 */
function getWeekStart(isoDate: IsoDate): IsoDate {
  const date = parseIsoDateLocal(isoDate);
  const dayOfWeek = date.getDay();
  date.setDate(date.getDate() - dayOfWeek);
  return toIsoDateLocal(date);
}

/**
 * 해당 주의 마지막일(토요일) 반환
 */
function getWeekEnd(isoDate: IsoDate): IsoDate {
  const date = parseIsoDateLocal(isoDate);
  const dayOfWeek = date.getDay();
  date.setDate(date.getDate() + (6 - dayOfWeek));
  return toIsoDateLocal(date);
}

/**
 * useCalendarKeyboardNavigation 파라미터
 */
interface UseCalendarKeyboardNavigationParams {
  /** 현재 선택된 날짜 */
  selectedDate: IsoDate | null;
  /** 날짜 선택 핸들러 */
  onDateSelect: (date: IsoDate) => void;
  /** 이전 달로 이동 */
  onPreviousMonth?: () => void;
  /** 다음 달로 이동 */
  onNextMonth?: () => void;
}

/**
 * 캘린더 키보드 네비게이션 훅
 *
 * @param params - 선택된 날짜 및 핸들러 함수
 * @returns 키보드 이벤트 핸들러
 *
 * @example
 * ```tsx
 * function Calendar() {
 *   const [selectedDate, setSelectedDate] = useState<IsoDate | null>(null);
 *
 *   const { handleKeyDown } = useCalendarKeyboardNavigation({
 *     selectedDate,
 *     onDateSelect: setSelectedDate,
 *     onPreviousMonth: goToPrevMonth,
 *     onNextMonth: goToNextMonth,
 *   });
 *
 *   return (
 *     <div
 *       tabIndex={0}
 *       onKeyDown={handleKeyDown}
 *     >
 *       // 캘린더 내용
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalendarKeyboardNavigation({
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
}: UseCalendarKeyboardNavigationParams) {
  /**
   * 키보드 이벤트 핸들러
   *
   * 지원하는 키:
   * - ArrowLeft: 이전 날
   * - ArrowRight: 다음 날
   * - ArrowUp: 이전 주 (7일 전)
   * - ArrowDown: 다음 주 (7일 후)
   * - Home: 주의 시작 (일요일)
   * - End: 주의 마지막 (토요일)
   * - PageUp: 이전 달
   * - PageDown: 다음 달
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!selectedDate) return;

      let handled = false;
      let newDate: IsoDate | null = null;

      switch (event.key) {
        case "ArrowLeft":
          // 이전 날
          newDate = addDays(selectedDate, -1);
          handled = true;
          break;

        case "ArrowRight":
          // 다음 날
          newDate = addDays(selectedDate, 1);
          handled = true;
          break;

        case "ArrowUp":
          // 이전 주 (7일 전)
          newDate = addDays(selectedDate, -7);
          handled = true;
          break;

        case "ArrowDown":
          // 다음 주 (7일 후)
          newDate = addDays(selectedDate, 7);
          handled = true;
          break;

        case "Home":
          // 주의 시작 (일요일)
          newDate = getWeekStart(selectedDate);
          handled = true;
          break;

        case "End":
          // 주의 마지막 (토요일)
          newDate = getWeekEnd(selectedDate);
          handled = true;
          break;

        case "PageUp":
          // 이전 달
          if (onPreviousMonth) {
            onPreviousMonth();
            handled = true;
          }
          break;

        case "PageDown":
          // 다음 달
          if (onNextMonth) {
            onNextMonth();
            handled = true;
          }
          break;

        default:
          // 처리하지 않는 키
          break;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();

        if (newDate) {
          onDateSelect(newDate);
        }
      }
    },
    [selectedDate, onDateSelect, onPreviousMonth, onNextMonth]
  );

  return {
    /** 키보드 이벤트 핸들러 */
    handleKeyDown,
  };
}

/**
 * useCalendarKeyboardNavigation 훅의 반환 타입
 */
export type CalendarKeyboardNavigation = ReturnType<
  typeof useCalendarKeyboardNavigation
>;
