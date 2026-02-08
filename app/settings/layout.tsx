import { SettingsSidebar } from "@/components/settings";
import type { Metadata } from "next";
import Script from "next/script";

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
    <>
      {/* Daum Postcode API 로드 (주소 검색용) */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="beforeInteractive"
      />

      {/* Kakao Maps SDK 로드 (주소 → 좌표 변환용) */}
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services`}
        strategy="beforeInteractive"
      />

      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-[1440px] gap-12 px-20 py-20">
          {/* 좌측 사이드바 - 302px */}
          <SettingsSidebar />

          {/* 우측 컨텐츠 - 930px */}
          <main className="max-w-[930px] flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
