import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { kakaoLogin, getOnboardingSettings } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth";

export function useKakaoLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (code: string) => {
      // 1. 카카오 로그인
      const response = await kakaoLogin(code);
      console.log("✅ 카카오 로그인 성공:", response);

      // 2. 토큰 저장
      login(response.user, response.accessToken, response.refreshToken);

      // 3. 온보딩 상태 조회
      const onboarding = await getOnboardingSettings();
      console.log("✅ 온보딩 상태:", onboarding);

      const hasRegions = onboarding.preferredRegions.length > 0;
      const hasCategories = onboarding.categories.length > 0;

      return { ...response, hasRegions, hasCategories };
    },
    onSuccess: (data) => {
      if (data.hasRegions && data.hasCategories) {
        router.replace("/");
      } else if (data.hasRegions) {
        router.replace("/onboarding/step2");
      } else {
        router.replace("/onboarding/step1");
      }
    },
    onError: (error) => {
      console.error("❌ 카카오 로그인 실패:", error);
      router.replace("/auth/login");
    },
  });
}
