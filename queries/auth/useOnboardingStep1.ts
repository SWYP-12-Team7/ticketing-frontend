import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postOnboardingStep1 } from "@/services/api/auth";

export function useOnboardingStep1() {
  const router = useRouter();

  return useMutation({
    mutationFn: postOnboardingStep1,
    onSuccess: () => {
      router.push("/onboarding/step2");
    },
    onError: (error) => {
      console.error("온보딩 step1 저장 실패:", error);
    },
  });
}
