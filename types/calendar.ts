export type CalendarCategory = "popup" | "exhibition";

export type IsoDate = `${number}-${string}-${string}`; // "YYYY-MM-DD"
export type IsoMonth = `${number}-${string}`; // "YYYY-MM"

/**
 * 팝업스토어 서브카테고리
 * HeaderSideBar 메뉴와 동기화
 */
export type PopupSubcategory =
  | "all"
  | "fashion"
  | "beauty"
  | "fnb"
  | "character"
  | "tech"
  | "lifestyle"
  | "furniture";

/**
 * 전시 서브카테고리
 * HeaderSideBar 메뉴와 동기화
 */
export type ExhibitionSubcategory =
  | "all"
  | "art"
  | "photo"
  | "design"
  | "sculpture"
  | "media"
  | "craft"
  | "history";

/**
 * 캘린더 필터 상태
 * 필터바에서 사용하는 전체 필터 상태
 */
export type CalendarFilterState = {
  region: string;
  popup: {
    enabled: boolean;
    subcategory: PopupSubcategory;
  };
  exhibition: {
    enabled: boolean;
    subcategory: ExhibitionSubcategory;
  };
};

/**
 * 선택된 캘린더 이벤트 (Pill 클릭)
 * null이면 선택 없음
 */
export type SelectedCalendarEvent = {
  date: IsoDate;
  category: CalendarCategory;
  subcategory: PopupSubcategory | ExhibitionSubcategory;
} | null;

export type CalendarDaySummary = Readonly<{
  date: IsoDate;
  counts: Record<CalendarCategory, number>;
}>;

export type CalendarRegion = Readonly<{ id: string; label: string }>;

export type CalendarMonthSummaryResponse = Readonly<{
  month: IsoMonth;
  days: readonly CalendarDaySummary[];
  regions: readonly CalendarRegion[];
}>;

export type CalendarMonthSummaryParams = Readonly<{
  month: IsoMonth;
  regionId?: string | null;
  categories?: readonly CalendarCategory[];
}>;
