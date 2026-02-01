export type CalendarCategory = "popup" | "exhibition";

export type IsoDate = `${number}-${string}-${string}`; // "YYYY-MM-DD"
export type IsoMonth = `${number}-${string}`; // "YYYY-MM"

export type CalendarDaySummary = Readonly<{
  date: IsoDate;
  counts: Record<CalendarCategory, number>;
}>;

export type CalendarRegion = Readonly<{ id: string; label: string }>;

export type CalendarMonthSummaryResponse = Readonly<{
  month: IsoMonth;
  days: readonly CalendarDaySummary[];
  regions: readonly CalendarRegion[];
}>;

export type CalendarMonthSummaryParams = Readonly<{
  month: IsoMonth;
  regionId?: string | null;
  categories?: readonly CalendarCategory[];
}>;
