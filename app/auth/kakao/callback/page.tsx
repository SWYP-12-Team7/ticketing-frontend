"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { kakaoLogin } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      router.replace("/auth/login");
      return;
    }

    if (isProcessing.current) return;
    isProcessing.current = true;

    const handleLogin = async () => {
      try {
        const response = await kakaoLogin(code);
        login(response.user, response.accessToken, response.refreshToken);
        router.replace("/");
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        router.replace("/auth/login");
      }
    };

    handleLogin();
  }, [searchParams, login, router]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      <p className="text-body-medium text-muted-foreground">
        로그인 처리 중...
      </p>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
            <p className="text-body-medium text-muted-foreground">
              로그인 처리 중...
            </p>
          </div>
        }
      >
        <KakaoCallbackContent />
      </Suspense>
    </div>
  );
}
