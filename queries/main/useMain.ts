import { useQuery } from "@tanstack/react-query";
import { getMain } from "@/services/api/main";

export function useMain() {
  return useQuery({
    queryKey: ["main"],
    queryFn: getMain,
  });
}
