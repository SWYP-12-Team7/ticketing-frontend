import axios from "@/services/axios";
import type { UserProfile } from "@/types/user";

/**
 * 사용자 프로필 조회
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  const { data } = await axios.get<UserProfile>("/api/user/profile");
  return data;
};

/**
 * 사용자 프로필 업데이트
 */
export const updateUserProfile = async (
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data } = await axios.put<UserProfile>("/api/user/profile", profile);
  return data;
};

/**
 * 주소 검색 (다음 우편번호 API)
 */
export const searchAddress = (): Promise<{
  address: string;
  zonecode: string;
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    // 다음 우편번호 API
    new (window as any).daum.Postcode({
      oncomplete: (data: any) => {
        resolve({
          address: data.address,
          zonecode: data.zonecode,
        });
      },
      onclose: () => {
        reject(new Error("Address search cancelled"));
      },
    }).open();
  });
};
