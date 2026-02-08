import axiosInstance from "@/services/axios";
import type { 
  UserProfile, 
  BackendUserResponse,
  UpdateAddressRequest,
  CreateProfileRequest 
} from "@/types/user";

// ========== 헬퍼 함수 ==========

/**
 * 백엔드 User 객체 → 프론트엔드 UserProfile 변환
 * 
 * @description
 * - 백엔드 응답을 프론트엔드 타입으로 매핑
 * - detailAddress는 백엔드에 없으므로 빈 값
 * - notifications는 백엔드에 없으므로 기본값
 */
function mapBackendUserToProfile(user: BackendUserResponse): UserProfile {
  return {
    kakaoProfileImage: user.profileImage || "",
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    address: user.address,
    detailAddress: "", // 백엔드 미지원
    notifications: {
      // 기본값 (백엔드 미지원)
      allNews: true,
      popup: true,
      exhibition: true,
      newEvent: true,
      hotDeal: true,
      onemonthNews: true,
      likedEvent: true,
      interestedEvent: true,
    },
  };
}

// ========== API 함수들 ==========

/**
 * 1. 닉네임 수정
 * 
 * @description
 * - API: PATCH /users/me/nickname
 * - Request Body: 단순 문자열 (JSON 객체 아님!)
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param nickname - 변경할 닉네임
 * @returns void (200 OK만 반환)
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await updateNickname("새로운닉네임");
 */
export async function updateNickname(nickname: string): Promise<void> {
  // ⚠️ 중요: Request Body가 단순 문자열이므로 JSON.stringify 사용
  // { nickname: "..." } 형태가 아님!
  await axiosInstance.patch(
    "/users/me/nickname", 
    JSON.stringify(nickname),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * 2. 주소 변경
 * 
 * @description
 * - API: PATCH /users/address
 * - Request Body: { address: string }
 * 
 * @param address - 변경할 주소
 * @returns void (200 OK)
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await updateAddress("서울시 강남구 역삼동");
 */
export async function updateAddress(address: string): Promise<void> {
  await axiosInstance.patch<void>("/users/address", {
    address,
  } as UpdateAddressRequest);
}

/**
 * 3. 내 정보 조회
 * 
 * @description
 * - API: GET /users/me
 * - Response: BackendUserResponse
 * - 프론트엔드 UserProfile로 변환하여 반환
 * 
 * @returns 사용자 프로필
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * const profile = await getUserProfile();
 * console.log(profile.nickname); // "소심한꿀주먹"
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await axiosInstance.get<BackendUserResponse>("/users/me");
  
  // 백엔드 응답 → 프론트엔드 타입 변환
  return mapBackendUserToProfile(response.data);
}

/**
 * 4. 회원 탈퇴
 * 
 * @description
 * - API: DELETE /users/me
 * - Query parameter 없음 (Swagger UI 버그 무시)
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * - Response: 200 OK / 403 Forbidden
 * 
 * @returns void
 * 
 * @throws {Error} 403 Forbidden - 인증 실패
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await deleteUser();
 * // 이후 로그아웃 처리 필요
 */
export async function deleteUser(): Promise<void> {
  // ⚠️ Query parameter 보내지 않음
  // Swagger UI가 잘못 생성한 curl 명령어 무시
  await axiosInstance.delete<void>("/users/me");
}

/**
 * 5. 이름/주소 최초 저장 (온보딩)
 * 
 * @description
 * - API: POST /users/profile
 * - Request Body: { name: string, address: string }
 * - 신규 회원 온보딩 시 사용
 * 
 * @param name - 사용자 이름
 * @param address - 주소
 * @returns void
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await createProfile("스위프", "서울시 강남구");
 */
export async function createProfile(
  name: string, 
  address: string
): Promise<void> {
  await axiosInstance.post<void>("/users/profile", {
    name,
    address,
  } as CreateProfileRequest);
}

/**
 * 닉네임 중복 확인
 * 
 * @description
 * - 백엔드 API 미구현으로 Mock 함수 사용
 * - 항상 사용 가능으로 반환 (중복 아님)
 * 
 * @param _nickname - 확인할 닉네임
 * @returns { isDuplicate: false } - 항상 사용 가능
 * 
 * @example
 * const result = await checkNicknameDuplicate("닉네임");
 * console.log(result.isDuplicate); // false
 */
export async function checkNicknameDuplicate(
  _nickname: string
): Promise<{ isDuplicate: boolean }> {
  // TODO: 백엔드 API 구현 후 실제 API로 교체
  // Mock: 항상 사용 가능으로 반환
  return Promise.resolve({ isDuplicate: false });
}

/**
 * 프로필 전체 업데이트
 * 
 * @description
 * - 변경된 필드만 개별 API 호출
 * - 닉네임 변경 시: PATCH /users/me/nickname
 * - 주소 변경 시: PATCH /users/address
 * - detailAddress, notifications는 LocalStorage에만 저장 (Zustand persist)
 * - 모든 업데이트 완료 후 최신 프로필 조회
 * 
 * @param profile - 변경할 필드들
 * @returns 최신 사용자 프로필
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * // 닉네임만 변경
 * await updateUserProfile({ nickname: "새닉네임" });
 * 
 * // 주소만 변경
 * await updateUserProfile({ address: "서울시 강남구" });
 * 
 * // 동시 변경
 * await updateUserProfile({ 
 *   nickname: "새닉네임", 
 *   address: "서울시 강남구" 
 * });
 */
export async function updateUserProfile(
  profile: Partial<UserProfile>
): Promise<UserProfile> {
  try {
    // 닉네임 변경 (undefined가 아닐 때만)
    if (profile.nickname !== undefined) {
      await updateNickname(profile.nickname);
    }

    // 주소 변경 (undefined가 아닐 때만)
    if (profile.address !== undefined) {
      await updateAddress(profile.address);
    }

    // ⚠️ detailAddress는 백엔드에서 지원하지 않음
    // → Zustand persist로 LocalStorage에만 저장됨

    // ⚠️ notifications는 별도 API 필요 (현재 미구현)
    // → Zustand persist로 LocalStorage에만 저장됨

    // 최신 프로필 조회하여 반환
    return await getUserProfile();
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    throw error;
  }
}

// ========== 주소 검색 (다음 우편번호 API) ==========

/**
 * 주소 검색 (다음 우편번호 API)
 * 
 * @description
 * - 클라이언트 사이드 전용
 * - 다음 Postcode API 사용
 * - 백엔드 API 아님
 * 
 * @returns 주소와 우편번호
 * 
 * @throws {Error} Window가 없거나 API가 로드되지 않은 경우
 * @throws {Error} 사용자가 검색을 취소한 경우
 * 
 * @example
 * const result = await searchAddress();
 * console.log(result.address); // "서울 강남구 역삼동"
 * console.log(result.zonecode); // "06234"
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

    if (!window.daum?.Postcode) {
      reject(new Error("Daum Postcode API is not loaded"));
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
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

// ========== 타입 정의 ==========

interface DaumPostcodeData {
  address: string;
  zonecode: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
        onclose: () => void;
      }) => {
        open: () => void;
      };
    };
  }
}
