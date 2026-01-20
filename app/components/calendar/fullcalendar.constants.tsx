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

// #region agent log
(() => {
  const isServer = typeof window === "undefined";
  fetch("http://127.0.0.1:7243/ingest/8ac4a727-08b3-4c34-a88c-c654febad19e", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "fullcalendar.constants.tsx:30",
      message: "FULLCALENDAR_DEFAULTS module evaluated",
      data: { isServer },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
})();
// #endregion

