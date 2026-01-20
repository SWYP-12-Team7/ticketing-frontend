import * as React from "react";
import type { EventHoveringArg } from "@fullcalendar/core";
import { FILTER_BY_KEY, getEventDateLabel, type CategoryKey } from "./domain";
import { EVENT_TOOLTIP } from "./fullcalendar.constants";

type TooltipState = Readonly<{
  open: boolean;
  left: number;
  top: number;
  title: string;
  categoryLabel: string;
  dateLabel: string;
  color: string;
}>;
export type { TooltipState };

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeTooltipPosition(anchorRect: DOMRect): { left: number; top: number } {
  const { width: tooltipW, height: tooltipH } = EVENT_TOOLTIP.size;
  const padding = EVENT_TOOLTIP.paddingPx;
  const gap = EVENT_TOOLTIP.gapPx;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 기본은 오른쪽, 공간이 없으면 왼쪽
  let left = anchorRect.right + gap;
  if (left + tooltipW + padding > vw) {
    left = anchorRect.left - tooltipW - gap;
  }
  left = clamp(left, padding, vw - tooltipW - padding);

  // 세로는 중앙 정렬, 화면 밖이면 clamp
  let top = anchorRect.top + anchorRect.height / 2 - tooltipH / 2;
  top = clamp(top, padding, vh - tooltipH - padding);

  return { left, top };
}

export function EventTooltip({ state }: { state: TooltipState }) {
  if (!state.open) return null;

  return (
    <div
      role="tooltip"
      className="calendarTooltip pointer-events-none fixed z-[60] select-none rounded-xl border border-black/10 bg-white/95 p-3 text-sm shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-950/95"
      style={{
        left: state.left,
        top: state.top,
        width: EVENT_TOOLTIP.size.width,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-semibold">{state.title}</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: state.color }}
            />
            <span className="truncate">{state.categoryLabel}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
        {state.dateLabel}
      </div>
    </div>
  );
}

type UseEventTooltipResult = Readonly<{
  tooltip: TooltipState;
  closeTooltip: () => void;
  onEventMouseEnter: (arg: EventHoveringArg) => void;
  onEventMouseLeave: () => void;
}>;

export function useEventTooltip(): UseEventTooltipResult {
  const [tooltip, setTooltip] = React.useState<TooltipState>(() => ({
    open: false,
    left: 0,
    top: 0,
    title: "",
    categoryLabel: "",
    dateLabel: "",
    color: "#000000",
  }));

  const anchorElRef = React.useRef<HTMLElement | null>(null);

  const closeTooltip = React.useCallback(() => {
    anchorElRef.current = null;
    setTooltip((prev) => (prev.open ? { ...prev, open: false } : prev));
  }, []);

  const onEventMouseEnter = React.useCallback((arg: EventHoveringArg) => {
    const category = (arg.event.extendedProps as { category?: CategoryKey })
      ?.category;
    if (!category) return;

    const meta = FILTER_BY_KEY[category];
    const dateLabel = getEventDateLabel(arg.event);

    anchorElRef.current = arg.el;
    const { left, top } = computeTooltipPosition(arg.el.getBoundingClientRect());

    setTooltip({
      open: true,
      left,
      top,
      title: arg.event.title || "",
      categoryLabel: meta.label,
      dateLabel,
      color: meta.color,
    });
  }, []);

  const onEventMouseLeave = React.useCallback(() => {
    closeTooltip();
  }, [closeTooltip]);

  // 스크롤/리사이즈 시 위치 재계산 (요소 기준)
  React.useEffect(() => {
    if (!tooltip.open) return;

    const update = () => {
      const el = anchorElRef.current;
      if (!el) return;
      const { left, top } = computeTooltipPosition(el.getBoundingClientRect());
      setTooltip((prev) => (prev.open ? { ...prev, left, top } : prev));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [tooltip.open]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTooltip();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeTooltip]);

  return { tooltip, closeTooltip, onEventMouseEnter, onEventMouseLeave };
}

// #region agent log
(() => {
  const isServer = typeof window === "undefined";
  fetch("http://127.0.0.1:7243/ingest/8ac4a727-08b3-4c34-a88c-c654febad19e", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H3",
      location: "useEventTooltip.tsx:155",
      message: "useEventTooltip module evaluated",
      data: { isServer },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
})();
// #endregion