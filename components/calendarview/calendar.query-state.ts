import type { CalendarCategory, IsoMonth } from "@/types/calendar";
import { toIsoMonth } from "@/lib/calendar-date";

export type CalendarCategoryActiveMap = Record<CalendarCategory, boolean>;

export type CalendarViewQueryState = Readonly<{
  month: IsoMonth;
  regionId: string;
  activeCategories: CalendarCategoryActiveMap;
}>;

const DEFAULT_ACTIVE_CATEGORIES: CalendarCategoryActiveMap = {
  exhibition: true,
  popup: true,
};

export function parseMonthParam(value: string | null): IsoMonth {
  if (value && /^\d{4}-\d{2}$/.test(value)) return value as IsoMonth;
  return toIsoMonth(new Date());
}

export function parseRegionIdParam(value: string | null): string {
  return value?.trim() ? value : "all";
}

export function parseCategoriesParam(
  value: string | null
): CalendarCategoryActiveMap {
  if (!value) return DEFAULT_ACTIVE_CATEGORIES;
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

export function serializeCategoriesParam(
  active: CalendarCategoryActiveMap
): string | null {
  const selected = (Object.keys(active) as CalendarCategory[]).filter(
    (k) => active[k]
  );
  if (selected.length === 0) return null;
  return selected.join(",");
}

export function getSelectedCategories(
  active: CalendarCategoryActiveMap
): CalendarCategory[] {
  return (Object.keys(active) as CalendarCategory[]).filter((k) => active[k]);
}
