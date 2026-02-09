"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useKakaoLogin } from "@/queries/auth";

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const { mutate: login } = useKakaoLogin();
  const isProcessing = useRef(false);
  const processedCode = useRef<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    // 1. 코드 없으면 로그인 페이지로
    if (!code) {
      console.error("[KAKAO CALLBACK] 인증 코드가 없습니다");
      window.location.href = "/auth/login";
      return;
    }

    // 2. 이미 처리 중이거나 이미 처리한 코드면 중단 (중복 실행 방지)
    if (isProcessing.current || processedCode.current === code) {
      console.warn("[KAKAO CALLBACK] 이미 처리 중이거나 처리된 코드입니다", {
        isProcessing: isProcessing.current,
        alreadyProcessed: processedCode.current === code,
      });
      return;
    }

    // 3. 처리 시작
    console.log("[KAKAO CALLBACK] 인증 코드 처리 시작", {
      code: code.substring(0, 20) + "...",
      codeLength: code.length,
    });

    isProcessing.current = true;
    processedCode.current = code;

    // 4. 로그인 요청
    login(code);

    // 5. Cleanup 함수에서 상태 유지 (재실행 방지)
    return () => {
      // isProcessing은 유지 (재실행 방지)
      console.log("[KAKAO CALLBACK] cleanup 실행 (재실행 방지 유지)");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ 의도적으로 빈 배열 (한 번만 실행, 중복 방지)

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
