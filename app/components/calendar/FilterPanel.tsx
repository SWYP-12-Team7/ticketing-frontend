import * as React from "react";
import type { ActiveMap, CategoryKey } from "./domain";
import { FILTERS } from "./domain";
import { CALENDAR_COPY } from "./calendar.copy";

function ColorDot({ color, active }: { color: string; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 rounded-full border"
      style={{
        backgroundColor: active ? color : "transparent",
        borderColor: color,
        opacity: active ? 1 : 0.35,
      }}
    />
  );
}

export function FilterPanel({
  active,
  selectedCount,
  onToggle,
}: {
  active: ActiveMap;
  selectedCount: number;
  onToggle: (key: CategoryKey) => void;
}) {
  const summaryId = React.useId();

  return (
    <aside
      aria-label={CALENDAR_COPY.filterPanelAriaLabel}
      className="calendarFilterPanel w-full shrink-0 rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-950 md:w-56"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="calendarFilterPanel__title text-sm font-semibold">
            {CALENDAR_COPY.filterTitle}
          </h2>
          <p
            id={summaryId}
            className="calendarFilterPanel__summary text-xs text-zinc-500 dark:text-zinc-400"
          >
            {CALENDAR_COPY.filterSummary(selectedCount)}
          </p>
        </div>
      </header>

      <fieldset className="m-0 border-0 p-0" aria-describedby={summaryId}>
        <legend className="sr-only">{CALENDAR_COPY.filterLegend}</legend>

        <ul className="calendarFilterPanel__list flex flex-col gap-2">
          {FILTERS.map((f) => {
            const isActive = active[f.key];

            return (
              <li key={f.key}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onToggle(f.key)}
                  className={[
                    "calendarFilterPanel__item flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm",
                    "hover:bg-zinc-100 dark:hover:bg-white/5",
                    "focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15",
                  ].join(" ")}
                >
                  <ColorDot color={f.color} active={isActive} />
                  <span className={isActive ? "opacity-100" : "opacity-55"}>
                    {f.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </aside>
  );
}