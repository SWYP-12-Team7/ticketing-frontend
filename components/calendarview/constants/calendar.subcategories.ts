/**
 * 캘린더 서브카테고리 상수
 *
 * - HeaderSideBar 메뉴와 동기화
 * - 필터바 드롭다운 옵션 제공
 *
 * @remarks
 * HeaderSideBar의 MENU_DATA와 일치하도록 유지 필요
 */

import type { PopupSubcategory, ExhibitionSubcategory } from "@/types/calendar";

/**
 * 팝업스토어 서브카테고리 메타데이터
 */
export const POPUP_SUBCATEGORIES: Record<
  PopupSubcategory,
  { label: string; value: PopupSubcategory }
> = {
  all: { label: "전체보기", value: "all" },
  fashion: { label: "패션", value: "fashion" },
  beauty: { label: "뷰티", value: "beauty" },
  fnb: { label: "F&B", value: "fnb" },
  character: { label: "캐릭터", value: "character" },
  tech: { label: "테크", value: "tech" },
  lifestyle: { label: "라이프스타일", value: "lifestyle" },
  furniture: { label: "기구 & 인테리어", value: "furniture" },
} as const;

/**
 * 전시 서브카테고리 메타데이터
 */
export const EXHIBITION_SUBCATEGORIES: Record<
  ExhibitionSubcategory,
  { label: string; value: ExhibitionSubcategory }
> = {
  all: { label: "전체보기", value: "all" },
  art: { label: "현대미술", value: "art" },
  photo: { label: "사진", value: "photo" },
  design: { label: "디자인", value: "design" },
  sculpture: { label: "조각", value: "sculpture" },
  media: { label: "미디어아트", value: "media" },
  craft: { label: "공예", value: "craft" },
  history: { label: "역사전시", value: "history" },
} as const;

/**
 * 팝업 서브카테고리 배열 (드롭다운용)
 */
export const POPUP_SUBCATEGORY_OPTIONS = Object.values(POPUP_SUBCATEGORIES);

/**
 * 전시 서브카테고리 배열 (드롭다운용)
 */
export const EXHIBITION_SUBCATEGORY_OPTIONS = Object.values(
  EXHIBITION_SUBCATEGORIES
);
