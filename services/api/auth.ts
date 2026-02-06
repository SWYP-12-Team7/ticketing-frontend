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

export interface OnboardingSettings {
  preferredRegions: string[];
  categories: string[];
}

export async function getOnboardingSettings(): Promise<OnboardingSettings> {
  const response = await axiosInstance.get<OnboardingSettings>("/onboarding/settings");
  return response.data;
}
