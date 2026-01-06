import type { EventApi, EventInput } from "@fullcalendar/core";

/** ===== Domain types ===== */
export type CategoryKey = "exhibition" | "popup" | "event" | "wishlist";

export type FilterMeta = Readonly<{
  key: CategoryKey;
  label: string;
  color: string;
  textColor: string;
}>;

export type ActiveMap = Record<CategoryKey, boolean>;

export type CategorizedEvent = Omit<EventInput, "extendedProps"> & {
  extendedProps: { category: CategoryKey };
};

/** ===== Constants ===== */
export const FILTERS = [
  { key: "exhibition", label: "전시🖼️", color: "#3B82F6", textColor: "#FFFFFF" },
  { key: "popup", label: "팝업🥳", color: "#22C55E", textColor: "#0B0F0D" },
  { key: "event", label: "행사🎉", color: "#EC4899", textColor: "#FFFFFF" },
  { key: "wishlist", label: "찜 목록💗", color: "#FACC15", textColor: "#0B0F0D" },
] as const satisfies readonly FilterMeta[];

export const FILTER_BY_KEY: Record<CategoryKey, FilterMeta> = FILTERS.reduce(
  (acc, f) => {
    acc[f.key] = f;
    return acc;
  },
  {} as Record<CategoryKey, FilterMeta>
);

export const DEMO_EVENTS = [
  {
    id: "popup-1",
    title: "짱구 팝업스토어",
    date: "2026-01-06",
    extendedProps: { category: "popup" },
  },
  {
    id: "exhibition-1",
    title: "요시고 전시회",
    date: "2026-01-08",
    extendedProps: { category: "exhibition" },
  },
  {
    id: "event-1",
    title: "광화문 새해 퍼레이드 축제",
    start: "2026-01-12",
    end: "2026-01-15",
    extendedProps: { category: "event" },
  },
] as const satisfies readonly CategorizedEvent[];

/** ===== Pure helpers ===== */
export const createActiveMap = (initialValue: boolean): ActiveMap =>
  FILTERS.reduce(
    (acc, f) => {
      acc[f.key] = initialValue;
      return acc;
    },
    {} as ActiveMap
  );

export function parseActiveMapFromQuery(filtersParam: string | null): ActiveMap {
  const base = createActiveMap(false);
  if (!filtersParam) return base;

  const tokens = filtersParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const validKeys = new Set(FILTERS.map((f) => f.key));
  for (const token of tokens) {
    if (validKeys.has(token as CategoryKey)) {
      base[token as CategoryKey] = true;
    }
  }
  return base;
}

export function serializeActiveMapToQuery(active: ActiveMap): string | null {
  const selected = FILTERS.filter((f) => active[f.key]).map((f) => f.key);
  if (selected.length === 0) return null;
  return selected.join(",");
}

export function areActiveMapsEqual(a: ActiveMap, b: ActiveMap): boolean {
  return FILTERS.every((f) => a[f.key] === b[f.key]);
}

export function getSelectedCount(active: ActiveMap): number {
  return FILTERS.reduce((n, f) => n + (active[f.key] ? 1 : 0), 0);
}

export function decorateEventsForCalendar(
  events: readonly CategorizedEvent[],
  active: ActiveMap
): EventInput[] {
  const activeKeys = FILTERS.filter((f) => active[f.key]).map((f) => f.key);
  if (activeKeys.length === 0) return []; // 선택 0개면 아무것도 표시 X

  return events
    .filter((e) => activeKeys.includes(e.extendedProps.category))
    .map((e) => {
      const meta = FILTER_BY_KEY[e.extendedProps.category];
      return {
        ...e,
        backgroundColor: meta.color,
        borderColor: meta.color,
        textColor: meta.textColor,
      } satisfies EventInput;
    });
}

function formatKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getEventDateLabel(event: EventApi): string {
  const start = event.start;
  if (!start) return "";

  const end = event.end;
  const allDay = event.allDay;

  if (!end) return formatKoreanDate(start);

  // FullCalendar는 allDay 이벤트의 end를 end-exclusive로 다루는 경우가 많아,
  // 표시용은 "end - 1일"로 보정합니다.
  const inclusiveEnd = allDay ? addDays(end, -1) : end;

  const sameDay =
    start.getFullYear() === inclusiveEnd.getFullYear() &&
    start.getMonth() === inclusiveEnd.getMonth() &&
    start.getDate() === inclusiveEnd.getDate();

  return sameDay
    ? formatKoreanDate(start)
    : `${formatKoreanDate(start)} ~ ${formatKoreanDate(inclusiveEnd)}`;
}