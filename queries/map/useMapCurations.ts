import { useQuery } from "@tanstack/react-query";
import { getMapCurations, type MapCurationsParams } from "@/services/api/mapCurations";

export function useMapCurations(params: MapCurationsParams) {
  return useQuery({
    queryKey: ["mapCurations", params],
    queryFn: () => getMapCurations(params),
    enabled: Boolean(params.date),
  });
}
