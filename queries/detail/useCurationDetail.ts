import { useQuery } from "@tanstack/react-query";
import { getCurationDetail } from "@/services/api/curationDetail";
import type { CurationType } from "@/types/curationDetail";

export function useCurationDetail(id?: string, type?: CurationType) {
  return useQuery({
    queryKey: ["curationDetail", type, id],
    queryFn: () => getCurationDetail(id as string, type as CurationType),
    enabled: Boolean(id && type),
  });
}
