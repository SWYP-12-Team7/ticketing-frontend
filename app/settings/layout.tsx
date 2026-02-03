import { SettingsSidebar } from "@/components/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정 - 내 정보",
  description: "회원 정보 및 알림 설정을 관리합니다",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-[1440px] gap-12 px-20 py-20">
        {/* 좌측 사이드바 - 302px */}
        <SettingsSidebar />

        {/* 우측 컨텐츠 - 930px */}
        <main className="max-w-[930px] flex-1">{children}</main>
      </div>
    </div>
  );
}
