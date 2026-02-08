export interface UserProfile {
  // 카카오 SSO에서 받아온 정보
  kakaoProfileImage: string;
  name: string;
  email: string;

  // 사용자가 설정하는 정보
  nickname: string;
  address: string;
  detailAddress: string;

  // 알림 설정
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  allNews: boolean;
  popup: boolean;
  exhibition: boolean;
  newEvent: boolean;
  hotDeal: boolean;
  onemonthNews: boolean;
  likedEvent: boolean;
  interestedEvent: boolean;
}

export interface UserMeta {
  name: string;
  email: string;
}

// ========== 백엔드 API 응답 타입 ==========

/**
 * 백엔드 User 객체 (GET /users/me 응답)
 */
export interface BackendUserResponse {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  email: string;
  nickname: string;
  profileImage: string;
  socialAccounts: BackendSocialAccount[];
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  onboardingCompleted: boolean;
  onboardingStep: number;
  deleted: boolean;
}

/**
 * 백엔드 소셜 계정 정보
 */
export interface BackendSocialAccount {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  id: number;
  user: string;
  provider: "KAKAO";
  providerId: string;
  deleted: boolean;
}

/**
 * 주소 변경 요청 (PATCH /users/address)
 */
export interface UpdateAddressRequest {
  address: string;
}

/**
 * 프로필 초기 저장 요청 (POST /users/profile)
 */
export interface CreateProfileRequest {
  name: string;
  address: string;
}
