import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/services/api/favorite";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: (params?: {
    page?: number;
    size?: number;
    region?: string;
    folderId?: number;
  }) => [...favoriteKeys.all, params] as const,
};

export function useFavorites(params?: {
  page?: number;
  size?: number;
  region?: string;
  folderId?: number;
}) {
  const size = params?.size ?? 10;
  return useQuery({
    queryKey: favoriteKeys.list({ ...params, size }),
    queryFn: () => getFavorites({ ...params, size }),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });
}
