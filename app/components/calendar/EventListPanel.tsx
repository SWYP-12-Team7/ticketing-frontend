"use client";

import * as React from "react";
import { EVENT_LIST_COPY, type SortKey } from "./eventList.copy";
import { sortEventListItems } from "./eventList.sort";
import {
  formatBusinessHours24h,
  formatKRWOrFree,
  formatPeriodYYYYMMDD,
  type EventListItem,
} from "./eventList.utils";

type EventListPanelProps = Readonly<{
  items: readonly EventListItem[];
}>;

export function EventListPanel({ items }: EventListPanelProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>("popular");

  const sortedItems = React.useMemo(
    () => sortEventListItems(items, sortKey),
    [items, sortKey]
  );

  return (
    <aside
      aria-label={EVENT_LIST_COPY.panelAriaLabel}
      className={[
        "eventListPanel w-full shrink-0 rounded-2xl border-2 border-blue-500/60 bg-white p-4 shadow-sm",
        "dark:border-blue-400/40 dark:bg-zinc-950",
        "md:w-[360px]",
      ].join(" ")}
    >
      <header className="eventListPanel__header mb-3 flex items-center justify-between gap-3">
        <h2 className="eventListPanel__title text-sm font-semibold">
          {EVENT_LIST_COPY.title}
        </h2>

        <nav
          aria-label={EVENT_LIST_COPY.sortNavAriaLabel}
          className="eventListPanel__sortNav"
        >
          <ul className="eventListPanel__sortList inline-flex items-center gap-1 rounded-full bg-blue-50 p-1 dark:bg-blue-500/10">
            {(Object.keys(EVENT_LIST_COPY.sortLabels) as SortKey[]).map((key) => {
              const isActive = sortKey === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSortKey(key)}
                    className={[
                      "eventListPanel__sortButton rounded-full px-3 py-1 text-xs font-medium",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-blue-700 hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-white/10",
                    ].join(" ")}
                  >
                    {EVENT_LIST_COPY.sortLabels[key]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {sortedItems.length === 0 ? (
        <p className="eventListPanel__empty text-sm text-zinc-600 dark:text-zinc-300">
          {EVENT_LIST_COPY.empty}
        </p>
      ) : (
        <ul className="eventListPanel__cards flex flex-col gap-3">
          {sortedItems.map((item) => (
            <li key={item.id}>
              <article className="eventListCard rounded-xl border border-black/10 p-3 dark:border-white/10">
                <h3 className="eventListCard__title line-clamp-2 text-sm font-semibold">
                  {item.title}
                </h3>

                <dl className="eventListCard__meta mt-2 grid gap-1 text-xs text-zinc-700 dark:text-zinc-200">
                  <div className="eventListCard__row flex gap-2">
                    <dt className="eventListCard__label shrink-0 text-zinc-500 dark:text-zinc-400">
                      {EVENT_LIST_COPY.fields.period}
                    </dt>
                    <dd className="eventListCard__value min-w-0">
                      {formatPeriodYYYYMMDD(item)}
                    </dd>
                  </div>

                  <div className="eventListCard__row flex gap-2">
                    <dt className="eventListCard__label shrink-0 text-zinc-500 dark:text-zinc-400">
                      {EVENT_LIST_COPY.fields.hours}
                    </dt>
                    <dd className="eventListCard__value min-w-0">
                      {formatBusinessHours24h(item.businessHours)}
                    </dd>
                  </div>

                  <div className="eventListCard__row flex gap-2">
                    <dt className="eventListCard__label shrink-0 text-zinc-500 dark:text-zinc-400">
                      {EVENT_LIST_COPY.fields.categoryTheme}
                    </dt>
                    <dd className="eventListCard__value min-w-0">
                      {(item.backendCategory ?? "-") + ", " + (item.theme ?? "-")}
                    </dd>
                  </div>

                  <div className="eventListCard__row flex gap-2">
                    <dt className="eventListCard__label shrink-0 text-zinc-500 dark:text-zinc-400">
                      {EVENT_LIST_COPY.fields.tag}
                    </dt>
                    <dd className="eventListCard__value min-w-0">
                      <span
                        className="eventListCard__tag inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{
                          backgroundColor: item.tag.color,
                          color: item.tag.textColor,
                        }}
                      >
                        {item.tag.label}
                      </span>
                    </dd>
                  </div>

                  <div className="eventListCard__row flex gap-2">
                    <dt className="eventListCard__label shrink-0 text-zinc-500 dark:text-zinc-400">
                      {EVENT_LIST_COPY.fields.price}
                    </dt>
                    <dd className="eventListCard__value min-w-0 font-semibold text-zinc-900 dark:text-zinc-50">
                      {formatKRWOrFree(item.ticketPrice)}
                    </dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

