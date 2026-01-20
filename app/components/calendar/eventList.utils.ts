import { FILTER_BY_KEY, type CategorizedEvent, type CategoryKey } from "./domain";

export type EventListItem = Readonly<{
  id: string;
  title: string;
  start: Date; // inclusive
  end: Date; // inclusive
  businessHours?: Readonly<{ open: string; close: string }>;
  backendCategory?: string;
  theme?: string;
  tag: Readonly<{
    key: CategoryKey;
    label: string;
    color: string;
    textColor: string;
  }>;
  ticketPrice?: number | null;
  popularityScore: number;
  recommendedScore: number;
  createdAtMs: number; // 최신순 tie-breaker
}>;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatYMD(date: Date): string {
  return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
}

function parseDateOnly(iso: unknown): Date | null {
  if (typeof iso !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  const dateOnly = parseDateOnly(value);
  if (dateOnly) return dateOnly;
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function inclusiveEndFromFullCalendar(e: CategorizedEvent, start: Date): Date {
  const rawEnd = toDate(e.end);
  if (!rawEnd) return start;
  return e.allDay ? addDays(rawEnd, -1) : rawEnd;
}

export function mapEventToListItem(e: CategorizedEvent): EventListItem | null {
  const start = toDate(e.start ?? e.date);
  if (!start) return null;

  const end = inclusiveEndFromFullCalendar(e, start);
  const meta = FILTER_BY_KEY[e.extendedProps.category];

  const createdAtMs = (() => {
    const createdAt = toDate(e.extendedProps.createdAt);
    return createdAt ? createdAt.getTime() : start.getTime();
  })();

  return {
    id: String(e.id ?? `${e.title ?? "event"}:${start.getTime()}`),
    title: String(e.title ?? "행사명"),
    start,
    end,
    businessHours: e.extendedProps.businessHours,
    backendCategory: e.extendedProps.backendCategory,
    theme: e.extendedProps.theme,
    tag: {
      key: e.extendedProps.category,
      label: meta.label, // domain.ts(FILTERS) 라벨을 그대로 사용
      color: meta.color,
      textColor: meta.textColor,
    },
    ticketPrice: e.extendedProps.ticketPrice,
    popularityScore: Number(e.extendedProps.popularityScore ?? 0),
    recommendedScore: Number(e.extendedProps.recommendedScore ?? 0),
    createdAtMs,
  };
}

export function formatPeriodYYYYMMDD(item: EventListItem): string {
  return `${formatYMD(item.start)}-${formatYMD(item.end)}`;
}

export function formatBusinessHours24h(
  hours?: Readonly<{ open: string; close: string }>
): string {
  const open = hours?.open?.trim();
  const close = hours?.close?.trim();
  const isValid = (s: string) => /^\d{2}:\d{2}$/.test(s);
  if (!open || !close || !isValid(open) || !isValid(close)) return "-";
  return `${open}-${close}`;
}

export function formatKRWOrFree(price?: number | null): string {
  // backend에서 "무료"를 0으로 내려주는 케이스도 흔하므로 0도 무료로 취급
  if (price === null || price === undefined || price === 0) return "무료";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(price);
}

