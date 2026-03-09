"use client";

import { useEffect } from "react";

/**
 * 전역 에러 바운더리
 *
 * @description
 * - ChunkLoadError 자동 복구: 페이지 새로고침
 * - 기타 에러: 사용자 친화적인 에러 화면 표시
 * - Next.js App Router의 error.tsx 컨벤션 준수
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (개발 환경)
    if (process.env.NODE_ENV === "development") {
      console.error("🚨 Error Boundary 캐치:", error);
    }

    // ChunkLoadError 자동 복구
    if (
      error.message.includes("Failed to load chunk") ||
      error.message.includes("ChunkLoadError") ||
      error.name === "ChunkLoadError"
    ) {
      // 무한 새로고침 방지: sessionStorage 체크
      const reloadCount = Number(sessionStorage.getItem("chunk-reload-count") || "0");
      
      if (reloadCount < 3) {
        sessionStorage.setItem("chunk-reload-count", String(reloadCount + 1));
        window.location.reload();
      } else {
        // 3번 이상 실패 시 카운터 리셋하고 에러 화면 표시
        sessionStorage.removeItem("chunk-reload-count");
        console.error("ChunkLoadError 복구 실패 (3회 시도)");
      }
    }
  }, [error]);

  // 성공적으로 로드되면 카운터 리셋
  useEffect(() => {
    sessionStorage.removeItem("chunk-reload-count");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        {/* 에러 아이콘 */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 에러 메시지 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-basic">
            오류가 발생했습니다
          </h2>
          <p className="text-sm text-tertiary">
            페이지를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>

        {/* 에러 상세 (개발 환경에서만) */}
        {process.env.NODE_ENV === "development" && (
          <div className="w-full rounded-lg border border-red-200 bg-red-50 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-red-800">
              개발 모드 에러 정보:
            </p>
            <p className="text-xs text-red-600 wrap-break-word">
              {error.message}
            </p>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => reset()}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-orange px-6 text-base font-semibold text-white transition-colors hover:bg-orange/90"
          >
            다시 시도
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="flex h-12 w-full items-center justify-center rounded-lg border border-[#D3D5DC] bg-white px-6 text-base font-medium text-basic transition-colors hover:bg-muted"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
