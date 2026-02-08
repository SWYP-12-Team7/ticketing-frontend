import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/services/api/favorite";

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
