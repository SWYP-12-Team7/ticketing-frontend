import type { IsoDate, IsoMonth } from "@/types/calendar";

export function toIsoMonth(date: Date): IsoMonth {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function toIsoDateLocal(date: Date): IsoDate {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * "YYYY-MM-DD" 문자열을 로컬 타임존 기준 자정으로 파싱합니다.
 * - Date.parse("YYYY-MM-DD")는 환경에 따라 UTC로 해석되어 날짜가 밀릴 수 있어 피합니다.
 */
export function parseIsoDateLocal(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map((v) => Number(v));
  return new Date(y, m - 1, d);
}

export function addMonths(baseMonth: Date, deltaMonths: number): Date {
  return new Date(
    baseMonth.getFullYear(),
    baseMonth.getMonth() + deltaMonths,
    1
  );
}

export function isSameMonth(day: Date, month: Date): boolean {
  return (
    day.getFullYear() === month.getFullYear() &&
    day.getMonth() === month.getMonth()
  );
}

/**
 * 월 제목을 "YYYY년 M월" 형식으로 포맷팅
 *
 * @param date - Date 객체
 * @returns 한글 월 제목 (예: "2026년 2월", "2026년 1월")
 *
 * @example
 * ```ts
 * formatMonthTitle(new Date(2026, 0, 1));  // "2026년 1월"
 * formatMonthTitle(new Date(2026, 1, 1));  // "2026년 2월"
 * formatMonthTitle(new Date(2026, 11, 1)); // "2026년 12월"
 * ```
 */
export function formatMonthTitle(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * 달력 그리드 생성 (5주 고정)
 *
 * Figma 스펙: 5주 × 7일 = 35칸
 *
 * @param monthDate - 표시할 월
 * @param weeks - 표시할 주 수 (기본값: 5)
 * @returns 날짜 배열 (35개 또는 지정된 주 수 × 7)
 */
export function buildMonthGrid(monthDate: Date, weeks = 5): Date[] {
  const firstOfMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  );
  const firstWeekday = firstOfMonth.getDay(); // 0(Sun)~6(Sat)
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstWeekday);

  const totalCells = weeks * 7; // 5주 × 7일 = 35칸
  const days: Date[] = [];

  for (let i = 0; i < totalCells; i += 1) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  return days;
}
