import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserTaste, addFavorite, getUserTimeline } from "@/services/api/user";
import type { EventType } from "@/types/user";
import type { FavoriteResponse } from "@/types/favorite";

/**
 * 사용자 취향 조회 Query
 * 
 * @description
 * - GET /users/me/taste
 * - 캐싱: 5분
 * - 자동 리프레시: 포커스 시
 * 
 * @returns Query result with { favorites, recentViews, recommendations }
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useUserTaste();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * return <div>{data.favorites.length}개 찜함</div>;
 * ```
 */
export function useUserTaste() {
  return useQuery({
    queryKey: ["userTaste"],
    queryFn: getUserTaste,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분 (구 cacheTime)
  });
}

/**
 * 찜하기 추가 Mutation
 * 
 * @description
 * - POST /curations/favorites
 * - 성공 시 userTaste 쿼리 무효화 (자동 리프레시)
 * 
 * @returns Mutation result with { mutate, isPending, error }
 * 
 * @example
 * ```tsx
 * const { mutate, isPending } = useAddFavorite();
 * 
 * const handleLike = () => {
 *   mutate({ 
 *     curationId: 123, 
 *     curationType: "EXHIBITION" 
 *   });
 * };
 * ```
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ curationId, curationType }: {
      curationId: number;
      curationType: EventType;
    }) => addFavorite(curationId, curationType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTaste"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
    onError: (error) => {
      console.error("찜하기 실패:", error);
    },
  });
}

/**
 * 사용자 타임라인 조회 Query
 * 
 * @description
 * - GET /users/me/timeline
 * - 캐싱: 5분
 * - 자동 리프레시: 포커스 시
 * 
 * @returns Query result with { upcoming, ongoing }
 * 
 * @example
 * ```tsx
 * const { data: timeline, isLoading, error } = useUserTimeline();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 * 
 * return (
 *   <div>
 *     <h2>오픈 예정 ({timeline.upcoming.length})</h2>
 *     <h2>진행 중 ({timeline.ongoing.length})</h2>
 *   </div>
 * );
 * ```
 */
export function useUserTimeline() {
  return useQuery({
    queryKey: ["userTimeline"],
    queryFn: getUserTimeline,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
  });
}
