import { useQuery } from "@tanstack/react-query";
import { getMain } from "@/services/api/main";

export function useMainData() {
  return useQuery({
    queryKey: ["main"],
    queryFn: getMain,
  });
}
