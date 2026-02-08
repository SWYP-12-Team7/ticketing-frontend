import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, NotificationSettings } from "@/types/user";
import { updateUserProfile, deleteUser } from "@/services/api/user";
import { useAuthStore } from "@/store/auth";
import { AxiosError } from "axios";

interface UserSettingsState {
  // 현재 편집 중인 프로필 (임시 저장)
  currentProfile: UserProfile;

  // 저장된 프로필 (SNB에 표시)
  savedProfile: UserProfile;

  // 현재 프로필 업데이트 (편집 중)
  setCurrentProfile: (profile: Partial<UserProfile>) => void;

  // 알림 설정 업데이트
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;

  // 저장 상태
  isLoading: boolean;
  error: string | null;
  isSaved: boolean;

  // 저장 (currentProfile → savedProfile + 백엔드 전송)
  saveProfile: () => Promise<void>;

  // 회원 탈퇴
  withdrawUser: () => Promise<void>;

  // 초기화
  resetProfile: () => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// 초기 데이터 (실제로는 API에서 가져옴)
const initialProfile: UserProfile = {
  kakaoProfileImage: "/images/mockImg.png",
  name: "스위프",
  email: "Dusty65@kakao.com",
  nickname: "소심한꿀주먹",
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
};

export const useUserSettingsStore = create<UserSettingsState>()(
  persist(
    (set, get) => ({
      // 초기값: 둘 다 동일
      currentProfile: initialProfile,
      savedProfile: initialProfile,

      // 편집 중인 프로필 업데이트 (SNB에는 반영 안됨)
      setCurrentProfile: (profile) =>
        set((state) => ({
          currentProfile: { ...state.currentProfile, ...profile },
        })),

      // 알림 설정 업데이트
      updateNotifications: (notifications) =>
        set((state) => ({
          currentProfile: {
            ...state.currentProfile,
            notifications: {
              ...state.currentProfile.notifications,
              ...notifications,
            },
          },
        })),

      isLoading: false,
      error: null,
      isSaved: false,

      // 저장: currentProfile → savedProfile + 백엔드 전송
      saveProfile: async () => {
        set({ isLoading: true, error: null, isSaved: false });
        try {
          const { currentProfile, savedProfile } = get();

          // 변경된 필드만 추출 (최적화)
          const changedFields: Partial<UserProfile> = {};

          // 닉네임 변경 확인
          if (currentProfile.nickname !== savedProfile.nickname) {
            changedFields.nickname = currentProfile.nickname;
          }

          // 주소 변경 확인
          if (currentProfile.address !== savedProfile.address) {
            changedFields.address = currentProfile.address;
          }

          // 변경사항이 있을 때만 백엔드로 전송
          if (Object.keys(changedFields).length > 0) {
            await updateUserProfile(changedFields);
          }

          // 성공 시 savedProfile 업데이트 (SNB에 반영)
          // detailAddress, notifications는 LocalStorage에만 저장
          set({
            savedProfile: currentProfile,
            isLoading: false,
            isSaved: true,
          });

          // 3초 후 저장 완료 메시지 제거
          setTimeout(() => set({ isSaved: false }), 3000);
        } catch (error) {
          // 403 에러: 인증 문제
          if (error instanceof AxiosError && error.response?.status === 403) {
            set({
              isLoading: false,
              error: "로그인이 필요합니다",
            });
            return;
          }

          // 401 에러: 토큰 만료 (interceptor에서 처리하지만 혹시 모를 경우)
          if (error instanceof AxiosError && error.response?.status === 401) {
            set({
              isLoading: false,
              error: "인증이 만료되었습니다. 다시 로그인해주세요",
            });
            return;
          }

          // 그 외 에러
          set({
            isLoading: false,
            error: error instanceof Error 
              ? error.message 
              : "저장에 실패했습니다. 다시 시도해주세요",
          });
        }
      },

      /**
       * 회원 탈퇴
       * 
       * @description
       * 1. 백엔드 API 호출 (DELETE /users/me)
       * 2. Auth Store에서 로그아웃
       * 3. 로컬 데이터 초기화
       * 4. 메인 페이지 리다이렉트는 컴포넌트에서 처리
       * 
       * @throws {Error} API 호출 실패 시
       */
      withdrawUser: async () => {
        set({ isLoading: true, error: null });

        try {
          // 1. 백엔드 API 호출
          await deleteUser();

          // 2. Auth Store에서 로그아웃
          useAuthStore.getState().logout();

          // 3. 로컬 데이터 초기화
          set({
            currentProfile: initialProfile,
            savedProfile: initialProfile,
            isLoading: false,
            error: null,
          });

          // 4. 메인 페이지 리다이렉트는 컴포넌트에서 처리
          // router.push('/')는 WithdrawalModal에서 호출
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error 
              ? error.message 
              : "회원 탈퇴에 실패했습니다",
          });
          throw error; // 컴포넌트에서 에러 핸들링
        }
      },

      // 초기화
      resetProfile: () =>
        set({
          currentProfile: initialProfile,
          savedProfile: initialProfile,
        }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user-settings",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
