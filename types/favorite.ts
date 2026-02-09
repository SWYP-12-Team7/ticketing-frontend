/**
 * 찜 항목
 * 
 * @description
 * - GET /users/me/favorites 응답의 개별 찜 항목 타입
 */
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

/**
 * 찜 목록 응답
 * 
 * @description
 * - GET /users/me/favorites 응답 타입
 * - 페이지네이션 정보 포함
 */
export interface FavoriteResponse {
  items: FavoriteItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

/**
 * 찜 목록 조회 파라미터
 * 
 * @description
 * - GET /users/me/favorites 요청 파라미터
 * - 페이지네이션, 지역 필터, 폴더 필터 지원
 */
export interface GetFavoritesParams {
  page?: number;
  size?: number;
  region?: string;
  folderId?: number;
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
