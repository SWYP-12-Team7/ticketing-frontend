import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { kakaoLogin } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth";

export function useKakaoLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await kakaoLogin(code);
      login(response.user, response.accessToken, response.refreshToken);
      return response;
    },
    onSuccess: (data) => {
      if (data.user.onboardingCompleted) {
        router.replace("/");
      } else {
        router.replace("/onboarding/step1");
      }
    },
    onError: (error) => {
      console.error("카카오 로그인 실패:", error);
      router.replace("/auth/login");
    },
  });
}
