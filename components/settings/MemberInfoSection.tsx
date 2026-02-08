"use client";

import { useState } from "react";
import { InputField } from "./InputField";
import { AddressSearchButton } from "./AddressSearchButton";
import { WithdrawalModal } from "./WithdrawalModal";
import { useUserSettingsStore } from "@/store/user-settings";
import { useAuthStore } from "@/store/auth";
import { useAddressSearch } from "@/hooks";
import { AlertCircle } from "lucide-react";

/**
 * 회원정보 섹션 컴포넌트
 *
 * @description
 * - Figma 스펙 완전 반영
 * - 레이아웃:
 *   - 제목 "회원정보" + 수정 버튼 (같은 행, 우측 정렬)
 *   - 입력 필드 순서: 이름 → 이메일 → 닉네임 → 주소 → 상세주소
 *   - 모든 필드: 866px (full width)
 * - 수정 버튼 클릭 시 모든 변경사항 저장 (닉네임 + 주소 + 알림설정)
 * - 회원탈퇴 하단 우측 정렬
 *
 * @remarks
 * 카드 스타일은 상위 페이지(profile/page.tsx)에서 적용
 */
export function MemberInfoSection() {
  const { currentProfile, setCurrentProfile, saveProfile, isLoading, error } =
    useUserSettingsStore();
  
  const { isAuthenticated } = useAuthStore();

  const {
    showAlert: showAddressAlert,
    isSearching: isSearchingAddress,
    search: searchAddress,
  } = useAddressSearch();

  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  /**
   * 주소 검색 핸들러
   */
  const handleAddressSearch = async () => {
    const result = await searchAddress();
    if (result) {
      setCurrentProfile({ address: result.address });
    }
  };

  /**
   * 전체 프로필 저장 핸들러
   *
   * @description
   * 모든 변경사항 저장 (닉네임 + 주소 + 알림설정)
   */
  const handleSaveProfile = async () => {
    // 인증 상태 확인
    if (!isAuthenticated) {
      alert("로그인이 필요합니다.");
      window.location.href = "/auth/login";
      return;
    }
    
    await saveProfile();
  };

  return (
    <>
      {/* 인증 경고 메시지 - 로그인하지 않은 경우 */}
      {!isAuthenticated && (
        <div className="flex w-[866px] items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 mb-4" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-red-800">로그인이 필요합니다</p>
            <p className="text-sm text-red-600">
              회원정보를 수정하려면 로그인이 필요합니다.
            </p>
          </div>
        </div>
      )}

      {/* 섹션 제목 + 수정 버튼 - Figma: 866px, flex justify-between */}
      <div className="flex w-[866px] items-center justify-between">
        <h2 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
          회원정보
        </h2>
        {/* 수정 버튼 - Figma: 49×32px */}
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isLoading || !isAuthenticated}
          aria-label="프로필 수정"
          className="flex h-8 w-[49px] shrink-0 items-center justify-center rounded border border-[#D3D5DC] bg-white px-3 text-sm font-normal leading-[140%] text-basic whitespace-nowrap transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "저장중..." : "수정"}
        </button>
      </div>

      {/* 이름 - Figma 순서: 1, width: 866px */}
      <InputField
        label="이름"
        value={currentProfile.name}
        onChange={(value) => setCurrentProfile({ name: value })}
        placeholder="입력해 주세요"
        disabled
        aria-label="이름 (변경 불가)"
        labelColor="tertiary"
      />

      {/* 이메일 - Figma 순서: 2, width: 866px */}
      <InputField
        label="이메일"
        value={currentProfile.email}
        onChange={(value) => setCurrentProfile({ email: value })}
        placeholder="입력해 주세요"
        helperText="가까운 곳부터 추천해드려요"
        disabled
        aria-label="이메일 (변경 불가)"
        labelColor="tertiary"
      />

      {/* 닉네임 - Figma 순서: 3, width: 866px (full width) */}
      <InputField
        label="닉네임"
        value={currentProfile.nickname}
        onChange={(value) => setCurrentProfile({ nickname: value })}
        placeholder="입력해 주세요"
        aria-label="닉네임"
      />

      {/* 주소 wrapper - Figma 순서: 4, width: 866px */}
      <div className="flex w-[866px] flex-col gap-1">
        <div className="flex gap-1">
          <InputField
            label="주소"
            value={currentProfile.address}
            onChange={(value) => setCurrentProfile({ address: value })}
            placeholder="지역을 입력해 주세요"
            helperText="가까운 곳부터 추천해드려요"
            readOnly
            aria-label="주소 (검색 버튼 사용)"
            className="w-[786px]"
          />
          <AddressSearchButton
            onClick={handleAddressSearch}
            disabled={isSearchingAddress}
          />
        </div>

        {/* 상세 주소 - Figma 순서: 5, width: 866px (full width) */}
        <InputField
          value={currentProfile.detailAddress}
          onChange={(value) => setCurrentProfile({ detailAddress: value })}
          placeholder="상세주소를 입력해 주세요"
          aria-label="상세주소"
        />

        {/* 상세주소 안내 메시지 - Figma: 항상 표시 */}
        <div
          className="flex w-[866px] items-center gap-0.5 text-xs leading-[180%] text-[#2970E2]"
          role="status"
        >
          <AlertCircle className="h-[16px] w-[16px]" aria-hidden="true" />
          <span>추천 정확도가 올라가요</span>
        </div>

        {/* 주소 검색 완료 알림 - 조건부 표시 */}
        {showAddressAlert && (
          <div
            className="flex w-[866px] items-center gap-0.5 text-xs leading-[180%] text-[#2970E2]"
            role="status"
            aria-live="polite"
          >
            <AlertCircle className="h-[16px] w-[16px]" aria-hidden="true" />
            <span>주소가 입력되었습니다</span>
          </div>
        )}
      </div>

      {/* 회원탈퇴 - Figma: botton-wrapper, width 866px, flex-col items-end */}
      <div className="flex w-[866px] flex-col items-end gap-2 border-t border-[#D3D5DC] pt-6">
        <button
          type="button"
          onClick={() => setShowWithdrawalModal(true)}
          className="flex h-8 w-[73px] items-center justify-center rounded px-3 text-sm font-normal leading-[140%] text-[#6C7180] transition-colors hover:bg-muted"
        >
          회원탈퇴
        </button>
      </div>

      {/* 에러 메시지 - 눈에 띄게 표시 */}
      {error && (
        <div className="flex w-[866px] items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-red-800">저장 실패</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* 회원탈퇴 모달 */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
      />
    </>
  );
}
