import axiosInstance from "@/services/axios";
import type { 
  FavoriteResponse, 
  MoveFavoriteRequest,
  GetFavoritesParams 
} from "@/types/favorite";

/**
 * 찜 목록 조회
 * 
 * @description
 * - API: GET /users/me/favorites
 * - 페이지네이션, 지역 필터, 폴더 필터 지원
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param params - 조회 파라미터
 * @param params.page - 페이지 번호 (0부터 시작)
 * @param params.size - 페이지 크기
 * @param params.region - 지역 필터 (예: "서울")
 * @param params.folderId - 폴더 ID 필터
 * 
 * @returns 찜 목록 응답 (items, 페이지네이션 정보)
 * 
 * @throws {Error} 403 Forbidden - 인증 실패
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * // 기본 조회
 * const data = await getFavorites();
 * 
 * // 특정 폴더의 찜 목록
 * const data = await getFavorites({ folderId: 22 });
 * 
 * // 지역 필터 + 페이지네이션
 * const data = await getFavorites({ region: "서울", page: 0, size: 20 });
 */
export async function getFavorites(params?: GetFavoritesParams) {
  // ⚠️ 주의: Query parameter로 전달 (Swagger 버그 없음)
  const response = await axiosInstance.get<FavoriteResponse>(
    "/users/me/favorites",
    { params }
  );
  return response.data;
}

/**
 * 찜 항목 삭제
 * 
 * @description
 * - API: DELETE /users/me/favorites/{favoriteId}
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param favoriteId - 삭제할 찜 항목 ID
 * @returns void (200 OK)
 * 
 * @throws {Error} 403 Forbidden - 인증 실패
 * @throws {Error} 404 Not Found - 찜 항목이 존재하지 않음
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await removeFavorite(234);
 */
export async function removeFavorite(favoriteId: number): Promise<void> {
  // ⚠️ 주의: Query parameter 보내지 않음 (Swagger 버그)
  await axiosInstance.delete<void>(`/users/me/favorites/${favoriteId}`);
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
