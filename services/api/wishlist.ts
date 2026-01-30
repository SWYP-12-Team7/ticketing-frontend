import { axiosInstance } from "../axios";
import type { Event } from "@/types/event";
import type { WishlistQueryParams, WishlistResponse } from "@/types/wishlist";

/**
 * 찜 목록 API 서비스
 * - RESTful API 통신
 * - 에러 처리
 * - 타입 안정성
 */

/**
 * 찜 목록 조회
 *
 * @param params 쿼리 파라미터
 * @returns 찜 목록 응답
 * @throws API 에러
 *
 * @example
 * const result = await getWishlist({
 *   sort: "popular",
 *   regions: ["seoul", "gyeonggi"],
 *   page: 1,
 *   limit: 8
 * });
 */
export async function getWishlist(
  params: WishlistQueryParams = {}
): Promise<WishlistResponse> {
  const { sort = "popular", regions = [], page = 1, limit = 8 } = params;

  const queryParams = new URLSearchParams({
    sort,
    page: String(page),
    limit: String(limit),
  });

  if (regions.length > 0) {
    queryParams.append("regions", regions.join(","));
  }

  const response = await axiosInstance.get<WishlistResponse>(
    `/api/wishlist?${queryParams.toString()}`
  );

  return response.data;
}

/**
 * 좋아요 해제
 *
 * @param eventId 이벤트 ID
 * @throws API 에러
 *
 * @example
 * await unlikeEvent("event-123");
 */
export async function unlikeEvent(eventId: string): Promise<void> {
  await axiosInstance.delete(`/api/events/${eventId}/like`);
}

/**
 * 좋아요 추가
 *
 * @param eventId 이벤트 ID
 * @throws API 에러
 *
 * @example
 * await likeEvent("event-123");
 */
export async function likeEvent(eventId: string): Promise<void> {
  await axiosInstance.post(`/api/events/${eventId}/like`);
}
