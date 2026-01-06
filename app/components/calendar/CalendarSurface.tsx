import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import koLocale from "@fullcalendar/core/locales/ko";
import type { EventHoveringArg, EventInput } from "@fullcalendar/core";
import { EventTooltip, type TooltipState } from "./useEventTooltip";

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
    <main
      className="relative min-w-0 flex-1 rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950"
      onMouseLeave={closeTooltip}
    >
      {showEmptyState && (
        <div
          role="status"
          className="mb-3 rounded-xl border border-black/10 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
        >
          왼쪽 필터에서 표시할 항목을 선택하면 일정이 나타나요.
        </div>
      )}

      <EventTooltip state={tooltip} />

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locales={[koLocale]}
        locale="ko"
        dayCellContent={(arg) => (
          <span>{arg.dayNumberText.replace(/일$/, "")}</span>
        )}
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        height="auto"
        dayMaxEvents={true}
        events={events as EventInput[]}
        eventMouseEnter={onEventMouseEnterWithHighlight}
        eventMouseLeave={onEventMouseLeaveWithHighlight}
        eventClassNames={() => ["pw-fc-event"]}
      />
    </main>
  );
}