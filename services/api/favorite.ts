import axiosInstance from "@/services/axios";
import type { FavoriteResponse, MoveFavoriteRequest } from "@/types/favorite";

export async function getFavorites(
  params?: { page?: number; size?: number }
) {
  const response = await axiosInstance.get<FavoriteResponse>(
    "/users/me/favorites",
    { params }
  );
  return response.data;
}

/**
 * 찜 항목 폴더 이동
 * 
 * @description
 * - API: POST /users/me/favorites/{favoriteId}/move
 * - Request Body: { folderId: number | null }
 * - folderId가 null이면 미분류로 이동
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param favoriteId - 이동할 찜 항목 ID
 * @param folderId - 목적지 폴더 ID (null이면 미분류)
 * @returns void (200 OK)
 * 
 * @throws {Error} 403 Forbidden - 인증 실패
 * @throws {Error} 404 Not Found - 찜 항목 또는 폴더가 존재하지 않음
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * // 폴더로 이동
 * await moveFavoriteToFolder(234, 23);
 * 
 * // 미분류로 이동
 * await moveFavoriteToFolder(234, null);
 */
export async function moveFavoriteToFolder(
  favoriteId: number,
  folderId: number | null
): Promise<void> {
  // ⚠️ 주의: Query parameter 보내지 않음 (Swagger 버그)
  // addFavorite()와 동일한 패턴 (JSON 객체)
  await axiosInstance.post<void>(
    `/users/me/favorites/${favoriteId}/move`,
    {
      folderId,
    } as MoveFavoriteRequest
  );
}
