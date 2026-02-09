export interface FavoriteItem {
  id: number;
  curationId: number;
  curationType: "EXHIBITION" | "POPUP";
  title: string;
  thumbnail: string;
  region: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  folderId: number;
}

export interface FavoriteResponse {
  items: FavoriteItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

/**
 * 찜 항목 폴더 이동 요청
 * 
 * @description
 * - POST /users/me/favorites/{favoriteId}/move
 * - folderId가 null이면 미분류로 이동
 */
export interface MoveFavoriteRequest {
  folderId: number | null;
}
