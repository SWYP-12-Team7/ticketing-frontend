export const EVENT_LIST_COPY = {
  panelAriaLabel: "이벤트 목록",
  sortNavAriaLabel: "이벤트 정렬",
  title: "이벤트",
  empty: "표시할 이벤트가 없습니다.",
  fields: {
    period: "행사기간",
    hours: "영업시간",
    categoryTheme: "카테고리, 테마",
    tag: "태그",
    price: "티켓 가격",
  },
  sortLabels: {
    popular: "인기순",
    price: "가격순",
    recommended: "추천순",
    latest: "최신순",
  },
} as const;

export type SortKey = keyof typeof EVENT_LIST_COPY.sortLabels;

