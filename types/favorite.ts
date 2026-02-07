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
