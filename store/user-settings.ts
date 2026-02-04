import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, NotificationSettings } from "@/types/user";
import { updateUserProfile } from "@/services/api/user";

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
          const profile = get().currentProfile;

          // 백엔드로 전송
          await updateUserProfile(profile);

          // 성공 시 savedProfile 업데이트 (SNB에 반영)
          set({
            savedProfile: profile,
            isLoading: false,
            isSaved: true,
          });

          // 3초 후 저장 완료 메시지 제거
          setTimeout(() => set({ isSaved: false }), 3000);
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "저장 실패",
          });
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
