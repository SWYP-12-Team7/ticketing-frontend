"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserProfileCard } from "./UserProfileCard";
import { SettingsNavigation } from "./SettingsNavigation";
import { useUserSettingsStore } from "@/store/user-settings";

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const resetProfile = useUserSettingsStore((state) => state.resetProfile);

  const handleLogout = async () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      try {
        // TODO: 실제 API 호출
        // await logout();

        // 로컬 상태 초기화
        resetProfile();

        // 홈으로 이동
        router.push("/");
      } catch (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <aside className="flex h-[682px] w-[302px] shrink-0 flex-col gap-16 rounded-xl border border-[#FFA95D] bg-white pb-14 pl-6 pr-4 pt-14 shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_6px_8px_rgba(0,0,0,0.1)]">
      {/* 사용자 프로필 카드 */}
      <UserProfileCard />

      {/* 네비게이션 */}
      <SettingsNavigation currentPath={pathname} />

      {/* 로그아웃 버튼 */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex h-8 w-[73px] items-center justify-center rounded px-3 text-sm text-[#6C7180] transition-colors hover:text-foreground"
      >
        로그아웃
      </button>
    </aside>
  );
}
