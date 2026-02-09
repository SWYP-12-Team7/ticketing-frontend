/**
 * 카카오 로그인 API - 다양한 방식 백업
 * 
 * @description
 * 현재 방식이 안 되면 아래 방식들을 services/api/auth.ts에서 교체해서 사용
 */

import axiosInstance from "@/services/axios";
import type { LoginResponse } from "@/types/auth";

// ============================================================
// 방식 1: Query Parameter (현재 사용 중) ✅
// ============================================================
export async function kakaoLogin_QueryParam(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/kakao/callback",
    null,
    {
      params: { code }
    }
  );
  return response.data;
}

// ============================================================
// 방식 2: Request Body JSON
// ============================================================
export async function kakaoLogin_RequestBody(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/kakao/callback",
    { code }
  );
  return response.data;
}

// ============================================================
// 방식 3: URL-encoded
// ============================================================
export async function kakaoLogin_URLEncoded(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/kakao/callback",
    new URLSearchParams({ code }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  return response.data;
}

// ============================================================
// 방식 4: Path Parameter
// ============================================================
export async function kakaoLogin_PathParam(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    `/auth/kakao/callback/${code}`
  );
  return response.data;
}

// ============================================================
// 방식 5: 추가 파라미터 포함 (OAuth 표준)
// ============================================================
export async function kakaoLogin_WithGrantType(code: string): Promise<LoginResponse> {
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
  
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/kakao/callback",
    null,
    {
      params: { 
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }
    }
  );
  return response.data;
}

// ============================================================
// 방식 6: 다른 필드명 (authCode)
// ============================================================
export async function kakaoLogin_AuthCode(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/kakao/callback",
    null,
    {
      params: { authCode: code }
    }
  );
  return response.data;
}

// ============================================================
// 사용 방법
// ============================================================
/*
services/api/auth.ts에서 kakaoLogin 함수의 내용을 
위의 방식 중 하나로 교체해서 테스트:

export async function kakaoLogin(code: string): Promise<LoginResponse> {
  return kakaoLogin_URLEncoded(code);  // 예: 방식 3 테스트
}
*/
