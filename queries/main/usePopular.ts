import { useQuery } from "@tanstack/react-query";
import { getPopular } from "@/services/api/main";

export const popularKeys = {
  all: ["popular"] as const,
  list: (limit: number) =>
    [...popularKeys.all, limit] as const,
};

export function usePopular(limit: number = 10) {
  return useQuery({
    queryKey: popularKeys.list(limit),
    queryFn: () => getPopular(limit),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}
