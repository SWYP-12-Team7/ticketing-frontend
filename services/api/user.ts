import axiosInstance from "@/services/axios";
import type { 
  UserProfile, 
  BackendUserResponse,
  UpdateAddressRequest,
  CreateProfileRequest,
  UserTasteResponse,
  AddFavoriteRequest,
  EventType,
  UpdateFolderNameParams
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
 * 주소를 좌표로 변환 (카카오 Geocoder API)
 * 
 * @description
 * - 카카오 Maps Geocoder API 사용
 * - 주소 문자열 → 위도/경도 변환
 * - 변환 실패 시 서울시청 좌표 반환
 * 
 * @param address - 변환할 주소
 * @returns { latitude, longitude }
 * 
 * @throws {Error} Window가 없거나 Kakao Maps API가 로드되지 않은 경우
 * 
 * @example
 * const coords = await getCoordinatesFromAddress("서울시 강남구");
 * console.log(coords); // { latitude: 37.5011, longitude: 127.0397 }
 */
async function getCoordinatesFromAddress(
  address: string
): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    if (!window.kakao?.maps?.services) {
      reject(new Error("Kakao Maps API is not loaded"));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(
      address,
      (
        result: Array<{ x: string; y: string }>,
        status: string
      ) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          resolve({
            latitude: parseFloat(result[0].y),
            longitude: parseFloat(result[0].x),
          });
        } else {
          // 좌표 변환 실패 시 서울시청 좌표 (기본값)
          console.warn(
            `주소 변환 실패: ${address}, 기본 좌표(서울시청) 사용`
          );
          resolve({
            latitude: 37.5665,
            longitude: 126.9780,
          });
        }
      }
    );
  });
}

/**
 * 2. 주소 변경
 * 
 * @description
 * - API: PATCH /users/address
 * - Request Body: { address, latitude, longitude }
 * - 카카오 Geocoder API로 주소 → 좌표 자동 변환
 * 
 * @param address - 변경할 주소
 * @returns void (200 OK)
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await updateAddress("서울시 강남구 역삼동");
 * // → { address: "서울시 강남구 역삼동", latitude: 37.5011, longitude: 127.0397 }
 */
export async function updateAddress(address: string): Promise<void> {
  // 1. 주소 → 좌표 변환
  const { latitude, longitude } = await getCoordinatesFromAddress(address);

  // 2. 백엔드 API 호출
  await axiosInstance.patch<void>("/users/address", {
    address,
    latitude,
    longitude,
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
 * - Request Body: { name, address, latitude, longitude }
 * - 카카오 Geocoder API로 주소 → 좌표 자동 변환
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
 * // → { name: "스위프", address: "서울시 강남구", latitude: 37.5011, longitude: 127.0397 }
 */
export async function createProfile(
  name: string, 
  address: string
): Promise<void> {
  // 1. 주소 → 좌표 변환
  const { latitude, longitude } = await getCoordinatesFromAddress(address);

  // 2. 백엔드 API 호출
  await axiosInstance.post<void>("/users/profile", {
    name,
    address,
    latitude,
    longitude,
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

/**
 * 6. 나의 취향 조회
 * 
 * @description
 * - API: GET /users/me/taste
 * - Response: { favorites, recentViews, recommendations }
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @returns 사용자 취향 데이터 (찜한 행사, 최근 열람, 추천)
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * const taste = await getUserTaste();
 * console.log(taste.favorites); // TasteEvent[]
 */
export async function getUserTaste(): Promise<UserTasteResponse> {
  const response = await axiosInstance.get<UserTasteResponse>("/users/me/taste");
  return response.data;
}

/**
 * 7. 찜하기 추가
 * 
 * @description
 * - API: POST /curations/favorites
 * - Request Body: { curationId, curationType }
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param curationId - 행사 ID (number)
 * @param curationType - 행사 타입 ("EXHIBITION" | "POPUP" | "FAIR")
 * @returns void (200 OK)
 * 
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await addFavorite(123, "EXHIBITION");
 */
export async function addFavorite(
  curationId: number,
  curationType: EventType
): Promise<void> {
  await axiosInstance.post<void>("/curations/favorites", {
    curationId,
    curationType,
  } as AddFavoriteRequest);
}

/**
 * 8. 폴더 이름 수정
 * 
 * @description
 * - API: PUT /users/me/folders/{folderId}
 * - Request Body: 단순 문자열 (JSON 객체 아님!)
 * - 닉네임 수정 API와 동일한 패턴
 * - Authorization 헤더는 axiosInstance에서 자동 추가
 * 
 * @param folderId - 폴더 ID
 * @param folderName - 새 폴더명
 * @returns void (200 OK)
 * 
 * @throws {Error} 403 Forbidden - 인증 실패
 * @throws {Error} 404 Not Found - 폴더가 존재하지 않음
 * @throws {Error} API 호출 실패 시
 * 
 * @example
 * await updateFolderName(23, "내가 좋아하는 전시");
 */
export async function updateFolderName(
  folderId: number,
  folderName: string
): Promise<void> {
  // ⚠️ 중요: Request Body가 단순 문자열이므로 JSON.stringify 사용
  // { folderName: "..." } 형태가 아님! (닉네임 수정과 동일 패턴)
  await axiosInstance.put(
    `/users/me/folders/${folderId}`,
    JSON.stringify(folderName),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

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
    kakao?: {
      maps?: {
        services?: {
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (
                result: Array<{ x: string; y: string }>,
                status: string
              ) => void
            ) => void;
          };
        };
        load?: (callback: () => void) => void;
      };
    };
  }
}
