import { useQuery } from "@tanstack/react-query";
import { getOnboardingSettings } from "@/services/api/auth";

export const onboardingSettingsQueryKey = ["onboarding", "settings"] as const;

export function useOnboardingSettings() {
  return useQuery({
    queryKey: onboardingSettingsQueryKey,
    queryFn: getOnboardingSettings,
    staleTime: 60_000,
    gcTime: 10 * 60_000,
  });
}
