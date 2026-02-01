import axiosInstance from "@/services/axios";
import type { LoginResponse } from "@/types/auth";

export async function kakaoLogin(code: string): Promise<LoginResponse> {
  const response = await axiosInstance.post<LoginResponse>(
    `/auth/kakao/callback?code=${code}`
  );
  return response.data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}
