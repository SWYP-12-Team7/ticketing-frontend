"use client";

import { useState } from "react";
import { InputField } from "./InputField";
import { AddressSearchButton } from "./AddressSearchButton";
import { WithdrawalModal } from "./WithdrawalModal";
import { useUserSettingsStore } from "@/store/user-settings";
import { checkNicknameDuplicate } from "@/services/api/user";
import { AlertCircle } from "lucide-react";

export function MemberInfoSection() {
  const {
    currentProfile,
    setCurrentProfile,
    saveProfile,
    isLoading,
    isSaved,
    error,
  } = useUserSettingsStore();
  const [showAddressAlert, setShowAddressAlert] = useState(false);
  const [nicknameError, setNicknameError] = useState<string>("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const validateNickname = async (value: string): Promise<boolean> => {
    // 1. 스페이스 포함 여부 체크
    if (/\s/.test(value)) {
      setNicknameError("닉네임에 공백을 사용할 수 없습니다");
      return false;
    }

    // 2. 빈 문자열
    if (!value || value.length === 0) {
      setNicknameError("닉네임은 반드시 글자를 포함해주세요");
      return false;
    }

    // 3. 이모지만 입력 (한글/영문/숫자 없음)
    const hasValidChars = /[가-힣a-zA-Z0-9]/.test(value);
    if (!hasValidChars) {
      setNicknameError("닉네임은 반드시 글자를 포함해주세요");
      return false;
    }

    // 4. 길이 체크 (실제 문자 수 - 7자로 제한)
    const actualLength = [...value].length;
    if (actualLength < 2) {
      setNicknameError("닉네임은 2자 이상이어야 합니다");
      return false;
    }
    if (actualLength > 7) {
      setNicknameError("닉네임은 7자 이하이어야 합니다");
      return false;
    }

    // 5. 닉네임 중복 체크
    try {
      setIsCheckingNickname(true);
      const result = await checkNicknameDuplicate(value);

      if (result.isDuplicate) {
        setNicknameError("이미 사용 중인 닉네임입니다");
        return false;
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
      // 네트워크 오류는 저장 시도 허용
    } finally {
      setIsCheckingNickname(false);
    }

    setNicknameError("");
    return true;
  };

  const handleAddressSearch = async () => {
    try {
      // 실제로는 다음 우편번호 API 호출
      // const result = await searchAddress();
      // setUserProfile({ address: result.address });

      // Mock 데이터
      setCurrentProfile({ address: "서울특별시 강남구 테헤란로 123" });
      setShowAddressAlert(true);

      // 3초 후 알림 자동 숨김
      setTimeout(() => setShowAddressAlert(false), 3000);
    } catch (error) {
      console.error("주소 검색 실패:", error);
    }
  };

  return (
    <>
      <section className="flex flex-col gap-8">
        {/* 섹션 제목 */}
        <h2 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
          회원정보
        </h2>

        {/* 이름 */}
        <InputField
          label="이름"
          value={currentProfile.name}
          onChange={(value) => setCurrentProfile({ name: value })}
          placeholder="입력해 주세요"
          disabled
        />

        {/* 닉네임 - 7자 제한 */}
        <InputField
          label="닉네임"
          value={currentProfile.nickname}
          onChange={(value) => {
            // 스페이스 자동 제거
            const noSpaces = value.replace(/\s/g, "");
            setCurrentProfile({ nickname: noSpaces });
            // 즉시 검증은 하지 않고, blur 시에만 검증
            if (nicknameError) {
              setNicknameError("");
            }
          }}
          onBlur={() => validateNickname(currentProfile.nickname)}
          placeholder="입력해 주세요"
          maxLength={7}
          minLength={2}
          error={nicknameError}
        />

        {/* 이메일 */}
        <InputField
          label="이메일"
          value={currentProfile.email}
          onChange={(value) => setCurrentProfile({ email: value })}
          placeholder="입력해 주세요"
          helperText="가까운 곳부터 추천해드려요"
          disabled
        />

        {/* 주소 */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <InputField
              label="주소"
              value={currentProfile.address}
              onChange={(value) => setCurrentProfile({ address: value })}
              placeholder="지역을 입력해 주세요"
              helperText="가까운 곳부터 추천해드려요"
              readOnly
              className="flex-1"
            />
            <AddressSearchButton onClick={handleAddressSearch} />
          </div>

          {/* 상세 주소 */}
          <InputField
            value={currentProfile.detailAddress}
            onChange={(value) => setCurrentProfile({ detailAddress: value })}
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
            onClick={() => setShowWithdrawalModal(true)}
            className="rounded px-3 py-1.5 text-sm leading-[140%] text-[#6C7180] transition-colors hover:bg-muted"
          >
            회원탈퇴
          </button>

          <button
            type="button"
            onClick={async () => {
              // 저장 전 닉네임 검증
              const isValid = await validateNickname(currentProfile.nickname);

              if (!isValid) {
                // 검증 실패 시 저장하지 않음
                return;
              }

              // 검증 통과 시 저장 (백엔드 전송 + SNB 반영)
              await saveProfile();
            }}
            disabled={isLoading || isCheckingNickname}
            className="rounded bg-[#F36012] px-6 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "저장 중..."
              : isCheckingNickname
                ? "확인 중..."
                : isSaved
                  ? "저장 완료!"
                  : "저장"}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="flex items-center gap-0.5">
            <AlertCircle className="size-4 text-red-500" />
            <span className="text-sm text-red-500">{error}</span>
          </div>
        )}
      </section>

      {/* 회원탈퇴 모달 */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      />
    </>
  );
}
