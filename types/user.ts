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
  latitude: number;
  longitude: number;
}

/**
 * 프로필 초기 저장 요청 (POST /users/profile)
 */
export interface CreateProfileRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// ========== 나의 취향 API 타입 ==========

/**
 * 행사 타입 (백엔드 enum)
 */
export type EventType = "EXHIBITION" | "POPUP" | "FAIR";

/**
 * 취향 이벤트 (백엔드 응답)
 * 
 * @description
 * - GET /users/me/taste 응답의 개별 이벤트 타입
 * - BE 기준: id는 number, 이미지는 thumbnail
 */
export interface TasteEvent {
  id: number;
  type: EventType;
  title: string;
  thumbnail: string;
  region: string;
  place: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

/**
 * 사용자 취향 조회 응답
 * 
 * @description
 * - GET /users/me/taste
 * - favorites: 찜한 행사
 * - recentViews: 최근 열람 행사
 * - recommendations: 카테고리 기반 추천
 */
export interface UserTasteResponse {
  favorites: TasteEvent[];
  recentViews: TasteEvent[];
  recommendations: TasteEvent[];
}

/**
 * 찜하기 추가 요청
 * 
 * @description
 * - POST /curations/favorites
 */
export interface AddFavoriteRequest {
  curationId: number;
  curationType: EventType;
}

// ========== 폴더 관리 API 타입 ==========

/**
 * 폴더 이름 수정 파라미터
 * 
 * @description
 * - PUT /users/me/folders/{folderId}
 * - Request Body: 단순 문자열 (폴더명)
 */
export interface UpdateFolderNameParams {
  folderId: number;
  folderName: string;
}

/**
 * 폴더 정보
 * 
 * @description
 * - GET /users/me/folders 응답의 개별 폴더 타입
 */
export interface Folder {
  id: number;
  name: string;
  totalCount: number;      // 총 찜 개수
  popupCount: number;      // 팝업 개수
  exhibitionCount: number; // 전시 개수
}

/**
 * 폴더 목록 응답
 * 
 * @description
 * - GET /users/me/folders
 * - 배열 형태로 반환
 */
export type FoldersResponse = Folder[];
