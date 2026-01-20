export const CALENDAR_COPY = {
  pageTitle: "캘린더",
  pageDescription: "FullCalendar(dayGridMonth) 데모 화면입니다.",
  calendarAriaLabel: "캘린더",
  calendarSurfaceAriaLabel: "캘린더 월간 보기",
  filterPanelAriaLabel: "이벤트 필터",
  filterTitle: "필터",
  filterSummary: (selectedCount: number) =>
    `표시할 항목 선택 (${selectedCount}개 선택됨)`,
  filterLegend: "이벤트 필터 선택",
  loading: "캘린더 로딩 중…",
  emptyState: "왼쪽 필터에서 표시할 항목을 선택하면 일정이 나타나요.",
  demoFooter:
    "events는 현재 데모 데이터입니다. (원하면 CRUD/DB 연동까지 확장 가능)",
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
      hypothesisId: "H2",
      location: "calendar.copy.ts:20",
      message: "CALENDAR_COPY module evaluated",
      data: { isServer },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
})();
// #endregion

