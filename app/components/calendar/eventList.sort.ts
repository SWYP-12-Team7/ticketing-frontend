import type { SortKey } from "./eventList.copy";
import type { EventListItem } from "./eventList.utils";

export function sortEventListItems(
  items: readonly EventListItem[],
  sortKey: SortKey
): EventListItem[] {
  const arr = [...items];

  arr.sort((a, b) => {
    if (sortKey === "popular") return b.popularityScore - a.popularityScore;
    if (sortKey === "recommended")
      return b.recommendedScore - a.recommendedScore;

    if (sortKey === "price") {
      // null/undefined => 무료(0원) 취급
      const av =
        a.ticketPrice === null || a.ticketPrice === undefined ? 0 : a.ticketPrice;
      const bv =
        b.ticketPrice === null || b.ticketPrice === undefined ? 0 : b.ticketPrice;
      return av - bv;
    }

    // latest: 시작일 내림차순, 동률이면 createdAt 내림차순
    const byStart = b.start.getTime() - a.start.getTime();
    if (byStart !== 0) return byStart;
    return b.createdAtMs - a.createdAtMs;
  });

  return arr;
}

