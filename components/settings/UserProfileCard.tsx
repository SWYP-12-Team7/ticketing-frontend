"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail, Loader2 } from "lucide-react";
import { useUserSettingsStore } from "@/store/user-settings";

export function UserProfileCard() {
  // 저장된 프로필만 표시 (저장 버튼 클릭 시에만 업데이트)
  const savedProfile = useUserSettingsStore((state) => state.savedProfile);
  const isInitialized = useUserSettingsStore((state) => state.isInitialized);
  const [imageError, setImageError] = useState(false);

  // 로딩 중일 때 스켈레톤 UI 표시
  if (!isInitialized) {
    return (
      <div className="flex w-[262px] flex-col gap-5 px-2">
        <div className="flex w-[246px] flex-col gap-6">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex h-28 w-[246px] items-center justify-center">
            <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EA] animate-pulse">
              <Loader2 className="size-8 text-[#A6ABB7] animate-spin" />
            </div>
          </div>
          {/* 닉네임 스켈레톤 */}
          <div className="h-9 w-[246px] bg-[#E5E7EA] rounded animate-pulse" />
        </div>
        {/* 메타 정보 스켈레톤 */}
        <div className="flex w-[246px] flex-col gap-2">
          <div className="h-6 w-full bg-[#E5E7EA] rounded animate-pulse" />
          <div className="h-6 w-full bg-[#E5E7EA] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[262px] flex-col gap-5 px-2">
      {/* 프로필 이미지 + 닉네임 */}
      <div className="flex w-[246px] flex-col gap-6">
        {/* 프로필 이미지 */}
        <div className="flex h-28 w-[246px] items-center justify-center">
          <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-[#A6C4E0]">
            {!imageError ? (
              <Image
                src={savedProfile.kakaoProfileImage}
                alt="프로필 이미지"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <User className="size-14 text-white" strokeWidth={2} />
            )}
          </div>
        </div>

        {/* 닉네임 - 저장된 값만 표시 */}
        <h2 className="h-9 w-[246px] text-center text-[28px] font-semibold leading-[128%] tracking-[-0.025em] text-basic">
          {savedProfile.nickname || "사용자"}
        </h2>
      </div>

      {/* 메타 정보 (이름, 이메일) */}
      <div className="flex w-[246px] flex-col gap-2">
        {/* 이름 */}
        <div className="flex items-center gap-2">
          <User className="size-6 text-[#A6ABB7]" strokeWidth={1.5} />
          <span className="text-base font-semibold leading-[180%] text-[#4B5462]">
            {savedProfile.name || "-"}
          </span>
        </div>

        {/* 이메일 */}
        <div className="flex items-center gap-2">
          <Mail className="size-6 text-[#A6ABB7]" strokeWidth={1.5} />
          <span className="break-all text-base font-semibold leading-[180%] text-[#4B5462]">
            {savedProfile.email || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
