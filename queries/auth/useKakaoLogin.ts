import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { kakaoLogin } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth";

export function useKakaoLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (code: string) => {
      console.log("[MUTATION] 카카오 로그인 Mutation 시작");
      
      const response = await kakaoLogin(code);
      
      console.log("[MUTATION] API 응답 받음, 로그인 처리 중", {
        user: response.user.email,
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
      });
      
      login(response.user, response.accessToken, response.refreshToken);
      
      console.log("[MUTATION] 로그인 완료");
      return response;
    },
    onSuccess: (data) => {
      console.log("[MUTATION] onSuccess 호출", {
        onboardingCompleted: data.user.onboardingCompleted,
      });
      
      if (data.user.onboardingCompleted) {
        console.log("[MUTATION] 홈으로 이동");
        router.replace("/");
      } else {
        console.log("[MUTATION] 온보딩으로 이동");
        router.replace("/onboarding/step1");
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      console.error("[MUTATION] onError 호출", {
        status: axiosError.response?.status,
        message: axiosError.message,
        data: axiosError.response?.data,
      });
      
      // 400 에러에 대한 사용자 친화적 메시지
      if (axiosError.response?.status === 400) {
        alert(
          "카카오 로그인에 실패했습니다.\n" +
          "인증 코드가 만료되었거나 이미 사용되었을 수 있습니다.\n" +
          "다시 시도해주세요."
        );
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
      
      router.replace("/auth/login");
    },
  });
}
