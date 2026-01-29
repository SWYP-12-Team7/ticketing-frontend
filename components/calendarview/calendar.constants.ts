import type { CalendarCategory } from "@/types/calendar";

export const WEEKDAY_LABELS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THUR",
  "FRI",
  "SAT",
] as const;

export const CALENDAR_CATEGORY_META: Record<
  CalendarCategory,
  Readonly<{
    label: string;
    accentBorderColor: string;
    pillBackgroundColor: string;
  }>
> = {
  exhibition: {
    label: "전시회",
    accentBorderColor: "#A2C5FF",
    pillBackgroundColor: "#F8F9FA",
  },
  popup: {
    label: "팝업",
    accentBorderColor: "#FFBF89",
    pillBackgroundColor: "#F8F9FA",
  },
};
