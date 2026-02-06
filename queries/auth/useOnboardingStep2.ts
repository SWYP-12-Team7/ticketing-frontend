import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { postOnboardingStep2 } from "@/services/api/auth";

export function useOnboardingStep2() {
  const router = useRouter();

  return useMutation({
    mutationFn: postOnboardingStep2,
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      console.error("온보딩 step2 저장 실패:", error);
    },
  });
}
