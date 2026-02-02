"use client";

import { useState } from "react";
import { InputField } from "./InputField";
import { AddressSearchButton } from "./AddressSearchButton";
import { useUserSettingsStore } from "@/store/user-settings";
import { AlertCircle } from "lucide-react";

export function MemberInfoSection() {
  const {
    userProfile,
    setUserProfile,
    saveProfile,
    isLoading,
    isSaved,
    error,
  } = useUserSettingsStore();
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [nicknameError, setNicknameError] = useState<string>("");

  const validateNickname = (value: string) => {
    if (value.length < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다");
    } else if (value.length > 50) {
      setNicknameError("닉네임은 50자 이하이어야 합니다");
    } else {
      setNicknameError("");
    }
  };

  const handleAddressSearch = async () => {
    try {
      // 실제로는 다음 우편번호 API 호출
      // const result = await searchAddress();
      // setUserProfile({ address: result.address });

      // Mock 데이터
      setUserProfile({ address: "서울특별시 강남구 테헤란로 123" });
      setShowAddressAlert(true);

      // 3초 후 알림 자동 숨김
      setTimeout(() => setShowAddressAlert(false), 3000);
    } catch (error) {
      console.error("주소 검색 실패:", error);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      {/* 섹션 제목 */}
      <h2 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-[#202937]">
        회원정보
      </h2>

      {/* 이름 */}
      <InputField
        label="이름"
        value={userProfile.name}
        onChange={(value) => setUserProfile({ name: value })}
        placeholder="입력해 주세요"
        disabled
      />

      {/* 닉네임 */}
      <InputField
        label="닉네임"
        value={userProfile.nickname}
        onChange={(value) => {
          setUserProfile({ nickname: value });
          validateNickname(value);
        }}
        onBlur={() => validateNickname(userProfile.nickname)}
        placeholder="입력해 주세요"
        maxLength={50}
        minLength={2}
        error={nicknameError}
      />

      {/* 이메일 */}
      <InputField
        label="이메일"
        value={userProfile.email}
        onChange={(value) => setUserProfile({ email: value })}
        placeholder="입력해 주세요"
        helperText="가까운 곳부터 추천해드려요"
        disabled
      />

      {/* 주소 */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <InputField
            label="주소"
            value={userProfile.address}
            onChange={(value) => setUserProfile({ address: value })}
            placeholder="지역을 입력해 주세요"
            helperText="가까운 곳부터 추천해드려요"
            readOnly
            className="flex-1"
          />
          <AddressSearchButton onClick={handleAddressSearch} />
        </div>

        {/* 상세 주소 */}
        <InputField
          value={userProfile.detailAddress}
          onChange={(value) => setUserProfile({ detailAddress: value })}
          placeholder="상세주소를 입력해 주세요"
        />

        {/* 주소 알림 */}
        {showAddressAlert && (
          <div className="flex items-center gap-0.5 text-xs leading-[180%] text-[#2970E2]">
            <AlertCircle className="size-4" />
            <span>주소가 입력되었습니다</span>
          </div>
        )}
      </div>

      {/* 저장 버튼 & 회원탈퇴 */}
      <div className="flex items-center justify-between border-t border-[#D3D5DC] pt-6">
        <button
          type="button"
          className="rounded px-3 py-1.5 text-sm leading-[140%] text-[#6C7180] transition-colors hover:bg-muted"
        >
          회원탈퇴
        </button>

        <button
          type="button"
          onClick={saveProfile}
          disabled={isLoading}
          className="rounded bg-[#F36012] px-6 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "저장 중..." : isSaved ? "저장 완료!" : "저장"}
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </section>
  );
}
