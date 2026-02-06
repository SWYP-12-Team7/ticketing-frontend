"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/queries/auth";

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const { mutate: login } = useKakaoLogin();
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      window.location.href = "/auth/login";
      return;
    }

    if (isProcessing.current) return;
    isProcessing.current = true;

    login(code);
  }, [searchParams, login]);

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
