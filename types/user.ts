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
