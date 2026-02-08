"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useUserSettingsStore } from "@/store/user-settings";

/**
 * 설정 페이지 초기화 컴포넌트
 * 
 * @description
 * - 인증된 사용자의 프로필 자동 로드
 * - Layout에 마운트하여 모든 settings 페이지에서 공유
 * - 한 번만 로드 (isInitialized 체크)
 * 
 * @example
 * ```tsx
 * // app/settings/layout.tsx
 * <SettingsInitializer />
 * {children}
 * ```
 */
export function SettingsInitializer() {
  const { isAuthenticated } = useAuthStore();
  const { loadProfile, isInitialized, isLoading } = useUserSettingsStore();

  useEffect(() => {
    // 인증되었고, 아직 초기화되지 않았고, 로딩 중이 아닐 때만 로드
    if (isAuthenticated && !isInitialized && !isLoading) {
      loadProfile().catch((error) => {
        console.error("프로필 초기 로드 실패:", error);
        // 에러는 Store에서 이미 처리되므로 추가 처리 불필요
      });
    }
  }, [isAuthenticated, isInitialized, isLoading, loadProfile]);

  return null; // UI 없음 (초기화만 담당)
}
