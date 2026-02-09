import axiosInstance from "@/services/axios";
import { AxiosError } from "axios";
import type { LoginResponse } from "@/types/auth";

/**
 * 카카오 로그인 콜백
 * 
 * @description
 * - API: POST /auth/kakao/callback
 * - 카카오 인증 코드를 받아 액세스/리프레시 토큰 발급
 * 
 * @param code - 카카오 인증 코드 (1회용, 짧은 유효기간)
 * @returns 로그인 응답 (액세스 토큰, 리프레시 토큰, 사용자 정보)
 * 
 * @throws {Error} 400 Bad Request - 잘못된/만료된/이미 사용된 인증 코드
 * @throws {Error} 401 Unauthorized - 인증 실패
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * const result = await kakaoLogin("kakao_auth_code_123");
 */
export async function kakaoLogin(code: string): Promise<LoginResponse> {
  console.log("[API] 카카오 로그인 요청 시작", {
    endpoint: "/auth/kakao/callback",
    codeLength: code.length,
    codePreview: code.substring(0, 20) + "...",
  });

  try {
    // 방식 1: Query Parameter (OAuth 표준)
    const response = await axiosInstance.post<LoginResponse>(
      "/auth/kakao/callback",
      null,
      {
        params: { code },
      }
    );

    console.log("[API] 카카오 로그인 성공", {
      userId: response.data.user.id,
      email: response.data.user.email,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("[API] 카카오 로그인 실패", {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
    });

    // 400 에러 시 상세 정보 로깅
    if (axiosError.response?.status === 400) {
      console.error("[API] 400 에러 상세 정보", {
        requestUrl: axiosError.config?.url,
        requestMethod: axiosError.config?.method,
        requestParams: axiosError.config?.params,
        requestData: axiosError.config?.data,
        requestHeaders: axiosError.config?.headers,
        responseData: axiosError.response?.data,
      });
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export interface OnboardingSettings {
  preferredRegions: string[];
  categories: string[];
}

export async function getOnboardingSettings(): Promise<OnboardingSettings> {
  const response = await axiosInstance.get<OnboardingSettings>(
    "/onboarding/settings"
  );
  return response.data;
}

export async function postOnboardingStep1(
  regions: string[]
): Promise<void> {
  await axiosInstance.post("/onboarding/step1", regions);
}

export async function postOnboardingStep2(
  categories: string[]
): Promise<void> {
  await axiosInstance.post("/onboarding/step2", categories);
}
