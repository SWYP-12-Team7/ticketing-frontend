import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, removeFavorite, moveFavoriteToFolder } from "@/services/api/favorite";
import type { GetFavoritesParams } from "@/types/favorite";

/**
 * Favorite Query Keys
 * 
 * @description
 * - React Query 캐시 키 관리
 * - 계층적 무효화 전략 지원
 */
export const favoriteKeys = {
  all: ["favorites"] as const,
  lists: () => [...favoriteKeys.all, "list"] as const,
  list: (params?: GetFavoritesParams) => 
    [...favoriteKeys.lists(), params ?? {}] as const,
};

/**
 * 찜 목록 조회 Query
 * 
 * @description
 * - GET /users/me/favorites
 * - 캐싱: 1분
 * - 자동 리프레시: 포커스 시
 * 
 * @param params - 조회 파라미터 (페이지네이션, 필터)
 * @returns Query result with { items, currentPage, totalPages, totalElements }
 * 
 * @example
 * ```tsx
 * // 기본 조회
 * const { data, isLoading } = useFavorites();
 * 
 * // 특정 폴더의 찜 목록
 * const { data } = useFavorites({ folderId: 22 });
 * 
 * // 페이지네이션 + 필터
 * const { data } = useFavorites({ 
 *   folderId: 22, 
 *   region: "서울",
 *   page: 0, 
 *   size: 20 
 * });
 * ```
 */
export function useFavorites(params?: GetFavoritesParams) {
  return useQuery({
    queryKey: favoriteKeys.list(params),
    queryFn: () => getFavorites(params),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * 찜 항목 삭제 Mutation
 * 
 * @description
 * - DELETE /users/me/favorites/{favoriteId}
 * - 성공 시 관련 쿼리 무효화 (찜 목록, 취향 데이터, 타임라인, 폴더)
 * 
 * @returns Mutation result with { mutate, isPending, error }
 * 
 * @example
 * ```tsx
 * const { mutate: removeFav, isPending } = useRemoveFavorite();
 * 
 * const handleRemove = (favoriteId: number) => {
 *   if (confirm("찜을 삭제하시겠습니까?")) {
 *     removeFav(favoriteId, {
 *       onSuccess: () => alert("삭제되었습니다"),
 *     });
 *   }
 * };
 * ```
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (favoriteId: number) => removeFavorite(favoriteId),
    onSuccess: () => {
      // 찜 목록 & 취향 데이터 & 타임라인 & 폴더 리프레시
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
      queryClient.invalidateQueries({ queryKey: ["userTaste"] });
      queryClient.invalidateQueries({ queryKey: ["userTimeline"] });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
    onError: (error) => {
      console.error("찜 삭제 실패:", error);
    },
  });
}

/**
 * 찜 항목 폴더 이동 Mutation
 * 
 * @description
 * - POST /users/me/favorites/{favoriteId}/move
 * - 성공 시 관련 쿼리 무효화 (찜 목록, 폴더 목록, 취향 데이터)
 * 
 * @returns Mutation result with { mutate, isPending, error }
 * 
 * @example
 * ```tsx
 * const { mutate: moveToFolder, isPending } = useMoveFavoriteToFolder();
 * 
 * // 폴더로 이동
 * const handleMoveToFolder = (favoriteId: number, folderId: number) => {
 *   moveToFolder({ favoriteId, folderId });
 * };
 * 
 * // 미분류로 이동
 * const handleMoveToUncategorized = (favoriteId: number) => {
 *   moveToFolder({ favoriteId, folderId: null });
 * };
 * ```
 */
export function useMoveFavoriteToFolder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ favoriteId, folderId }: {
      favoriteId: number;
      folderId: number | null;
    }) => moveFavoriteToFolder(favoriteId, folderId),
    onSuccess: () => {
      // 찜 목록 & 폴더 목록 & 취향 데이터 리프레시
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["userTaste"] });
    },
    onError: (error) => {
      console.error("찜 항목 이동 실패:", error);
    },
  });
}
