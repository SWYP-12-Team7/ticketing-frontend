import type { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import koLocale from "@fullcalendar/core/locales/ko";

export const EVENT_TOOLTIP = {
  size: { width: 280, height: 92 },
  paddingPx: 12,
  gapPx: 12,
} as const;

export const FULLCALENDAR_DEFAULTS: Readonly<
  Pick<
    CalendarOptions,
    | "plugins"
    | "initialView"
    | "locales"
    | "locale"
    | "dayCellContent"
    | "headerToolbar"
    | "height"
    | "dayMaxEvents"
  >
> = {
  plugins: [dayGridPlugin],
  initialView: "dayGridMonth",
  locales: [koLocale],
  locale: "ko",
  dayCellContent: (arg) => <span>{arg.dayNumberText.replace(/일$/, "")}</span>,
  headerToolbar: { left: "prev,next today", center: "title", right: "" },
  height: "auto",
  dayMaxEvents: true,
} as const;
