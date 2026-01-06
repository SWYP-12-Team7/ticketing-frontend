"use client";

import React from "react";
import { CalendarSurface } from "./calendar/CalendarSurface";
import { FilterPanel } from "./calendar/FilterPanel";
import { DEMO_EVENTS, decorateEventsForCalendar, getSelectedCount } from "./calendar/domain";
import { useEventTooltip } from "./calendar/useEventTooltip";
import { useFilterQuerySync } from "./calendar/useFilterQuerySync";

export default function Calendar() {
  const { active, toggle } = useFilterQuerySync();
  const selectedCount = React.useMemo(() => getSelectedCount(active), [active]);

  const events = React.useMemo(
    () => decorateEventsForCalendar(DEMO_EVENTS, active),
    [active]
  );

  const { tooltip, closeTooltip, onEventMouseEnter, onEventMouseLeave } =
    useEventTooltip();

  return (
    <section
      aria-label="캘린더"
      className="flex w-full flex-col gap-4 md:flex-row"
    >
      <FilterPanel active={active} selectedCount={selectedCount} onToggle={toggle} />

      <CalendarSurface
        events={events}
        showEmptyState={selectedCount === 0}
        tooltip={tooltip}
        closeTooltip={closeTooltip}
        onEventMouseEnter={onEventMouseEnter}
        onEventMouseLeave={onEventMouseLeave}
      />
    </section>
  );
}


