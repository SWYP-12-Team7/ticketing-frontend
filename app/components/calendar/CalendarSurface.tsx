"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventHoveringArg, EventInput } from "@fullcalendar/core";
import { EventTooltip, type TooltipState } from "./useEventTooltip";
import { CALENDAR_COPY } from "./calendar.copy";
import { FULLCALENDAR_DEFAULTS } from "./fullcalendar.constants";

type CalendarSurfaceProps = Readonly<{
  events: readonly EventInput[];
  showEmptyState: boolean;
  tooltip: TooltipState;
  closeTooltip: () => void;
  onEventMouseEnter: (arg: EventHoveringArg) => void;
  onEventMouseLeave: () => void;
}>;

export function CalendarSurface({
  events,
  showEmptyState,
  tooltip,
  closeTooltip,
  onEventMouseEnter,
  onEventMouseLeave,
}: CalendarSurfaceProps) {
  const onEventMouseEnterWithHighlight = React.useCallback(
    (arg: EventHoveringArg) => {
      arg.el.classList.add("pw-fc-event--hover");
      onEventMouseEnter(arg);
    },
    [onEventMouseEnter]
  );

  const onEventMouseLeaveWithHighlight = React.useCallback(
    (arg: EventHoveringArg) => {
      arg.el.classList.remove("pw-fc-event--hover");
      onEventMouseLeave();
    },
    [onEventMouseLeave]
  );

  return (
    <section
      aria-label={CALENDAR_COPY.calendarSurfaceAriaLabel}
      className="calendarSurface relative min-w-0 flex-1 rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
      onMouseLeave={closeTooltip}
    >
      {showEmptyState && (
        <div
          role="status"
          className="calendarSurface__emptyState mb-3 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
        >
          {CALENDAR_COPY.emptyState}
        </div>
      )}

      <EventTooltip state={tooltip} />

      <FullCalendar
        {...FULLCALENDAR_DEFAULTS}
        events={Array.from(events)}
        eventMouseEnter={onEventMouseEnterWithHighlight}
        eventMouseLeave={onEventMouseLeaveWithHighlight}
        eventClassNames={() => ["pw-fc-event"]}
      />
    </section>
  );
}