import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { kakaoLogin } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth";
import { useUserSettingsStore } from "@/store/user-settings";
import { toast } from "sonner";

export function useKakaoLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loadProfile = useUserSettingsStore((state) => state.loadProfile);

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await kakaoLogin(code);
      login(response.user, response.accessToken, response.refreshToken);
      
      // 로그인 성공 후 프로필 로드
      try {
        await loadProfile();
      } catch (error) {
        // 프로필 로드 실패해도 로그인은 계속 진행
        if (process.env.NODE_ENV === "development") {
          console.warn("프로필 로드 실패 (로그인은 성공)", error);
        }
      }
      
      return response;
    },
    onSuccess: (data) => {
      toast.success("로그인 성공!", {
        description: `환영합니다, ${data.user.nickname || data.user.email}님`,
        duration: 2000,
      });
      
      if (data.user.onboardingCompleted) {
        router.replace("/");
      } else {
        router.replace("/onboarding/step1");
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      
      // 사용자 친화적인 toast 메시지
      if (axiosError.response?.status === 400) {
        toast.error("로그인 실패", {
          description: "인증 코드가 만료되었거나 이미 사용되었습니다.\n다시 시도해주세요.",
          duration: 4000,
        });
      } else {
        toast.error("로그인 실패", {
          description: "로그인 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
          duration: 4000,
        });
      }
      
      router.replace("/auth/login");
    },
  });
}
