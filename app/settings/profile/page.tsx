import { MemberInfoSection, NotificationSettings } from "@/components/settings";

/**
 * 프로필 설정 페이지
 *
 * @description
 * - Figma 스펙 완전 반영
 * - 회원정보 섹션: 930×808px, padding 40px 32px, gap 32px, border + shadow
 * - 알림 설정 섹션: 930×635px, padding 40px 32px, gap 12px, border + shadow
 * - 섹션 간 간격: 40px
 */
export default function ProfileSettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* 회원정보 섹션 - Figma: 930×808px, padding 40px 32px, gap 32px */}
      <div className="flex w-[930px] flex-col gap-8 rounded-xl border border-[#E5E7EA] bg-white p-10 px-8 shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_6px_rgba(0,0,0,0.1)]">
        <MemberInfoSection />
      </div>

      {/* 알림 설정 섹션 - Figma: 930×635px, padding 40px 32px, gap 12px */}
      <div className="flex w-[930px] flex-col gap-3 rounded-xl border border-[#E5E7EA] bg-white p-10 px-8 shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_6px_rgba(0,0,0,0.1)]">
        <NotificationSettings />
      </div>
    </div>
  );
}
