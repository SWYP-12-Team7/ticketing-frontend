import { MemberInfoSection, NotificationSettings } from "@/components/settings";

export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* 회원정보 섹션 */}
      <MemberInfoSection />

      {/* 구분선 */}
      <div className="h-px bg-[#D3D5DC]" />

      {/* 알림 설정 섹션 */}
      <NotificationSettings />
    </div>
  );
}
