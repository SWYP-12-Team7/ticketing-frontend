"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail } from "lucide-react";
import { useUserSettingsStore } from "@/store/user-settings";

export function UserProfileCard() {
  const userProfile = useUserSettingsStore((state) => state.userProfile);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col gap-5 px-2">
      {/* 프로필 이미지 + 닉네임 */}
      <div className="flex flex-col gap-6">
        {/* 프로필 이미지 */}
        <div className="flex items-center justify-center">
          <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full bg-[#A6C4E0]">
            {!imageError ? (
              <Image
                src={userProfile.kakaoProfileImage}
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

        {/* 닉네임 */}
        <h2 className="break-words text-center text-[28px] font-semibold leading-[128%] tracking-[-0.025em] text-[#202937]">
          {userProfile.nickname}
        </h2>
      </div>

      {/* 메타 정보 (이름, 이메일) */}
      <div className="flex flex-col gap-2">
        {/* 이름 */}
        <div className="flex items-center gap-2">
          <User className="size-6 text-[#A6ABB7]" strokeWidth={1.5} />
          <span className="text-base font-semibold leading-[180%] text-[#4B5462]">
            {userProfile.name}
          </span>
        </div>

        {/* 이메일 */}
        <div className="flex items-center gap-2">
          <Mail className="size-6 text-[#A6ABB7]" strokeWidth={1.5} />
          <span className="break-all text-base font-semibold leading-[180%] text-[#4B5462]">
            {userProfile.email}
          </span>
        </div>
      </div>
    </div>
  );
}
