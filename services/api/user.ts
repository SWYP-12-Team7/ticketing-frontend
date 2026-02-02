import axios from "@/services/axios";
import type { UserProfile } from "@/types/user";

/**
 * 사용자 프로필 조회
 * TODO: 백엔드 API 구현 후 실제 API로 교체
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  // TODO: 백엔드 API 구현 후 아래 코드 활성화
  // const { data } = await axios.get<UserProfile>("/api/user/profile");
  // return data;

  // 임시 Mock 데이터 (백엔드 API 준비 전까지 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ [Mock] 프로필 조회");
      resolve({
        kakaoProfileImage: "https://via.placeholder.com/112",
        name: "스위프",
        email: "Dusty65@kakao.com",
        nickname: "소심한꿀주먹이",
        address: "",
        detailAddress: "",
        notifications: {
          allNews: true,
          popup: true,
          exhibition: true,
          newEvent: true,
          hotDeal: true,
          onemonthNews: true,
          likedEvent: true,
          interestedEvent: true,
        },
      } as UserProfile);
    }, 300);
  });
};

/**
 * 사용자 프로필 업데이트
 * TODO: 백엔드 API 구현 후 실제 API로 교체
 */
export const updateUserProfile = async (
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  // TODO: 백엔드 API 구현 후 아래 코드 활성화
  // const { data } = await axios.put<UserProfile>("/api/user/profile", profile);
  // return data;

  // 임시 Mock 데이터 (백엔드 API 준비 전까지 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      // 실제 API 호출 시뮬레이션 (800ms 대기)
      console.log("✅ [Mock] 프로필 업데이트:", profile);
      resolve(profile as UserProfile);
    }, 800);
  });
};

/**
 * 닉네임 중복 확인
 * TODO: 백엔드 API 구현 후 실제 API로 교체
 */
export const checkNicknameDuplicate = async (
  nickname: string
): Promise<{ isDuplicate: boolean }> => {
  // TODO: 백엔드 API 구현 후 아래 코드 활성화
  // const { data } = await axios.get<{ isDuplicate: boolean }>(
  //   "/api/user/nickname/check",
  //   { params: { nickname } }
  // );
  // return data;

  // 임시 Mock 데이터 (백엔드 API 준비 전까지 사용)
  return new Promise((resolve) => {
    setTimeout(() => {
      // 실제 API 호출 시뮬레이션 (500ms 대기)
      resolve({ isDuplicate: false });
    }, 500);
  });
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
