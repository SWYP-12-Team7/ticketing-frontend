"use client";

import React from "react";
import { CalendarSurface } from "./calendar/CalendarSurface";
import { FilterPanel } from "./calendar/FilterPanel";
import {
  DEMO_EVENTS,
  decorateEventsForCalendar,
  getActiveCategoryKeys,
  getSelectedCount,
  type CategorizedEvent,
} from "./calendar/domain";
import { useEventTooltip } from "./calendar/useEventTooltip";
import { useFilterQuerySync } from "./calendar/useFilterQuerySync";
import { CALENDAR_COPY } from "./calendar/calendar.copy";
import { EventListPanel } from "./calendar/EventListPanel";
import { mapEventToListItem } from "./calendar/eventList.utils";

export default function Calendar() {
  const { active, toggle } = useFilterQuerySync();
  const selectedCount = React.useMemo(() => getSelectedCount(active), [active]);

  const events = React.useMemo(
    () => decorateEventsForCalendar(DEMO_EVENTS, active),
    [active]
  );

  const listItems = React.useMemo(() => {
    const activeKeys = getActiveCategoryKeys(active);
    if (activeKeys.length === 0) return [];

    const filtered: CategorizedEvent[] = DEMO_EVENTS.filter((e) =>
      activeKeys.includes(e.extendedProps.category)
    );
    return filtered.map(mapEventToListItem).filter((x): x is NonNullable<typeof x> => Boolean(x));
  }, [active]);

  const { tooltip, closeTooltip, onEventMouseEnter, onEventMouseLeave } =
    useEventTooltip();

  return (
    <section
      aria-label={CALENDAR_COPY.calendarAriaLabel}
      className="calendarLayout flex w-full flex-col gap-4 md:flex-row"
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

      <EventListPanel items={listItems} />
    </section>
  );
}


