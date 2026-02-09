"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 로그인 필요한 페이지 감싸기
 * 비로그인 시 → 로그인 페이지로 리다이렉트
 */
export function RequireAuth({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      if (!hasNotifiedRef.current) {
        toast.error("로그인이 필요한 페이지 입니다.");
        hasNotifiedRef.current = true;
      }
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // 하이드레이션 전 또는 비로그인 시 로딩
  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * 비로그인 전용 페이지 감싸기 (로그인, 회원가입 등)
 * 로그인 시 → 메인 페이지로 리다이렉트
 */
export function RequireGuest({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [_hasHydrated, isAuthenticated, router]);

  // 하이드레이션 전 또는 로그인 상태면 로딩
  if (!_hasHydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
