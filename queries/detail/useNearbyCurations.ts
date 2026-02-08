import { useQuery } from "@tanstack/react-query";
import { getNearbyCurations } from "@/services/api/nearbyCurations";

export function useNearbyCurations(id?: string, limit: number = 10) {
  return useQuery({
    queryKey: ["nearbyCurations", id, limit],
    queryFn: () => getNearbyCurations(id as string, limit),
    enabled: Boolean(id),
  });
}
