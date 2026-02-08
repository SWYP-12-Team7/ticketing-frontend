import axiosInstance from "@/services/axios";
import type { FavoriteResponse } from "@/types/favorite";

export async function getFavorites(params?: {
  page?: number;
  size?: number;
  region?: string;
  folderId?: number;
}) {
  const response = await axiosInstance.get<FavoriteResponse>(
    "/users/me/favorites",
    { params }
  );
  return response.data;
}
