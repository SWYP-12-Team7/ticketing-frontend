import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, NotificationSettings } from "@/types/user";
import { updateUserProfile } from "@/services/api/user";

interface UserSettingsState {
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  updateNotifications: (notifications: Partial<NotificationSettings>) => void;
  isLoading: boolean;
  error: string | null;
  isSaved: boolean;
  saveProfile: () => Promise<void>;
  resetProfile: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// 초기 데이터 (실제로는 API에서 가져옴)
const initialProfile: UserProfile = {
  kakaoProfileImage: "/images/mockImg.png",
  name: "스위프",
  email: "Dusty65@kakao.com",
  nickname: "소심한꿀주먹이지만용감한편인데용안그래보이나요",
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
      userProfile: initialProfile,
      setUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),
      updateNotifications: (notifications) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            notifications: {
              ...state.userProfile.notifications,
              ...notifications,
            },
          },
        })),
      isLoading: false,
      error: null,
      isSaved: false,
      saveProfile: async () => {
        set({ isLoading: true, error: null, isSaved: false });
        try {
          const profile = get().userProfile;
          await updateUserProfile(profile);
          set({ isLoading: false, isSaved: true });

          // 3초 후 저장 완료 메시지 제거
          setTimeout(() => set({ isSaved: false }), 3000);
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "저장 실패",
          });
        }
      },
      resetProfile: () => set({ userProfile: initialProfile }),
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
