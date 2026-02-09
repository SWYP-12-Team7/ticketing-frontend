import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, moveFavoriteToFolder } from "@/services/api/favorite";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: (params?: { page?: number; size?: number }) =>
    [...favoriteKeys.all, params] as const,
};

export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list({ size: 10 }),
    queryFn: () => getFavorites({ size: 10 }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
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
