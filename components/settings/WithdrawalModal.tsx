"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserSettingsStore } from "@/store/user-settings";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const withdrawalReasons = [
  "사용을 잘 안하게 돼요",
  "원하는 행사가 없어요",
  "다른 계정으로 재가입하려고요",
  "개인정보 보호를 위해 삭제할 정보가 있어요",
  "기타",
] as const;

// 특수문자 정규식 (한글, 영문, 숫자, 공백만 허용)
const SPECIAL_CHAR_REGEX = /[^가-힣a-zA-Z0-9\s]/;

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const router = useRouter();
  
  // Store에서 withdrawUser 가져오기
  const { withdrawUser, isLoading } = useUserSettingsStore();
  
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Textarea 높이 자동 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [otherReason]);

  if (!isOpen) return null;

  // 텍스트 입력 핸들러 (특수문자 체크)
  const handleOtherReasonChange = (value: string) => {
    // 특수문자 포함 여부 체크 (경고만 표시)
    if (SPECIAL_CHAR_REGEX.test(value)) {
      setHasValidationError(true);
    } else {
      setHasValidationError(false);
    }

    // 100자 초과해도 입력 가능 (Figma 스펙에 에러 상태 존재)
    setOtherReason(value);
  };

  // 버튼 활성화 조건
  const isButtonEnabled =
    (selectedReason !== "" && selectedReason !== "기타") ||
    (selectedReason === "기타" &&
      otherReason.trim() !== "" &&
      otherReason.length <= 100 &&
      !hasValidationError);

  /**
   * 탈퇴 확인
   */
  const handleWithdrawal = async () => {
    if (!isButtonEnabled || isLoading) return;

    try {
      const reason = selectedReason === "기타" ? otherReason : selectedReason;

      // 탈퇴 사유 로깅 (백엔드에서 받지 않으므로 프론트엔드 로그만)
      console.log("📊 [Analytics] 탈퇴 사유:", reason);

      // 실제 회원탈퇴 API 호출
      await withdrawUser();

      // 탈퇴 성공 시 메인페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      
      // 에러 메시지 표시
      alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 모달 닫기 (100자 초과 시 닫기 불가)
  const handleClose = () => {
    if (selectedReason === "기타" && otherReason.length > 100) {
      alert("100자 이하로 입력해주세요");
      return;
    }
    onClose();
  };

  // 현재 글자 수
  const charCount = otherReason.length;
  const isOverLimit = charCount > 100;
  const hasText = charCount > 0;

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 모달 - 628px × auto (동적 높이, 최소 759px) */}
      <div className="fixed left-1/2 top-1/2 z-50 flex w-[628px] -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-2xl bg-white px-6 py-12 shadow-[0px_0px_4px_rgba(0,0,0,0.1),0px_6px_8px_rgba(0,0,0,0.1)] transition-all duration-300"
        style={{
          minHeight: "759px",
        }}
      >
        {/* 컨텐츠 - 580px */}
        <div className="flex w-[580px] flex-col">
          {/* 탈퇴 이유 선택 */}
          <div className="flex flex-col gap-4">
            {/* 제목 */}
            <h2 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
              탈퇴 이유를 알려주세요
              <br />
              <span className="text-[#F36012]">더욱 개선하는 와르르</span>가
              될게요!
            </h2>

            {/* 라디오 버튼 리스트 - gap: 16px, padding: 8px 0 */}
            <div className="flex flex-col gap-4 py-2">
              {withdrawalReasons.map((reason) => (
                <div key={reason} className="flex flex-col gap-2">
                  {/* 라디오 버튼 - 32px height */}
                  <label className="flex h-8 items-center gap-2 py-1">
                    {/* 커스텀 라디오 버튼 (Figma 스펙: 1px/1.6px border + 12px 내부 원) */}
                    <input
                      type="radio"
                      name="withdrawal-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="peer sr-only"
                    />
                    <div
                      className={cn(
                        "relative flex size-6 shrink-0 items-center justify-center rounded-full border bg-white transition-all",
                        selectedReason === reason
                          ? "border-[1.6px] border-[#F36012]"
                          : "border border-[#6C7180]"
                      )}
                    >
                      {/* 선택 시 내부 원 (12px) */}
                      {selectedReason === reason && (
                        <div className="size-3 rounded-full bg-[#F36012]" />
                      )}
                    </div>

                    {/* 라벨 - 16px */}
                    <span className="text-base font-medium leading-[140%] text-[#4B5462]">
                      {reason}
                    </span>
                  </label>

                  {/* 기타 선택 시 input 표시 */}
                  {reason === "기타" && selectedReason === "기타" && (
                    <div className="flex flex-col gap-2 pl-[32px]">
                      {/* 안내 텍스트 */}
                      <span
                        className="text-sm leading-[180%] text-[#6C7180]"
                        style={{
                          fontFamily: "Pretendard",
                          fontSize: "14px",
                          fontWeight: 400,
                          lineHeight: "180%",
                        }}
                      >
                        더 나은 서비스를 위해 남겨주세요
                      </span>

                      {/* 입력 필드 wrapper - 548px × auto (동적 높이) */}
                      <div
                        className={cn(
                          "flex w-[548px] min-w-[320px] items-start justify-between gap-2 rounded border px-4 py-4 transition-all duration-200",
                          isOverLimit
                            ? "min-h-[132px] border-[#D93E39] bg-[#FDECEC]"
                            : hasText
                              ? "min-h-[57px] border-[#F36012] bg-white"
                              : "min-h-[57px] border-[#D3D5DC] bg-white"
                        )}
                      >
                        <textarea
                          ref={textareaRef}
                          value={otherReason}
                          onChange={(e) =>
                            handleOtherReasonChange(e.target.value)
                          }
                          placeholder="기타 사유를 입력해주세요"
                          className="flex-1 resize-none overflow-hidden bg-transparent text-lg font-medium leading-[140%] text-basic placeholder:text-[#A6ABB7] focus:outline-none"
                          style={{
                            fontFamily: "Pretendard",
                            fontSize: "18px",
                            fontWeight: 500,
                            lineHeight: "140%",
                            minHeight: "25px",
                          }}
                          rows={1}
                        />
                        {/* X 아이콘 (텍스트 있을 때만 표시) */}
                        {hasText && (
                          <button
                            type="button"
                            onClick={() => {
                              setOtherReason("");
                              setHasValidationError(false);
                            }}
                            className="flex size-4 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                            aria-label="입력 내용 지우기"
                          >
                            <X
                              className="size-4 text-[#6C7180]"
                              strokeWidth={1}
                            />
                          </button>
                        )}
                      </div>

                      {/* alert+counter - 548px */}
                      <div className="flex w-[548px] items-start gap-2">
                        {/* alert (100자 초과 또는 특수문자 포함 시 표시) */}
                        {(isOverLimit || hasValidationError) && (
                          <div className="flex grow items-center gap-0.5">
                            {/* circle-alert icon - 16px */}
                            <AlertCircle
                              className={cn(
                                "h-[16px] w-[16px]",
                                isOverLimit
                                  ? "text-[#D93E39]"
                                  : "text-[#0088E8]"
                              )}
                              strokeWidth={1}
                            />
                            <span
                              className={cn(
                                "text-xs leading-[180%]",
                                isOverLimit
                                  ? "text-[#D93E39]"
                                  : "text-[#2970E2]"
                              )}
                            >
                              {isOverLimit
                                ? "글자 수 제한에 도달했어요"
                                : "메세지를 입력해 주세요"}
                            </span>
                          </div>
                        )}

                        {/* counter */}
                        <div
                          className={cn(
                            "flex justify-end gap-0.5",
                            (isOverLimit || hasValidationError) && "grow"
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm leading-[180%]",
                              isOverLimit
                                ? "text-[#D93E39]"
                                : hasText
                                  ? "text-[#F36012]"
                                  : "text-[#6C7180]"
                            )}
                            style={{
                              fontFamily: "Pretendard Variable",
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "180%",
                            }}
                          >
                            {charCount}
                          </span>
                          <span
                            className="text-sm leading-[180%] text-[#6C7180]"
                            style={{
                              fontFamily: "Pretendard Variable",
                              fontSize: "14px",
                              fontWeight: 400,
                              lineHeight: "180%",
                            }}
                          >
                            /100
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 구분선 - 1px */}
        <div className="h-px w-[580px] bg-[#D3D5DC]" />

        {/* 경고 메시지 */}
        <div className="flex w-[580px] flex-col gap-4 py-4">
          <h3 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
            정말 와르르{" "}
            <span className="text-[#F36012]">없이 괜찮으시겠어요...?</span>
          </h3>
          <p className="text-lg font-medium leading-[140%] text-[#6C7180]">
            탈퇴일 포함 3일 동안 재가입이 불가하며, 재가입 시에도 이용 내역은
            되찾을 수 없어요
          </p>
        </div>

        {/* 버튼 wrapper - 40px height, gap: 8px */}
        <div className="flex w-[580px] justify-end gap-2">
          {/* 탈퇴할래요 - 109px × 40px */}
          <button
            type="button"
            onClick={handleWithdrawal}
            disabled={!isButtonEnabled || isLoading}
            className={cn(
              "flex h-10 w-[109px] items-center justify-center whitespace-nowrap rounded border px-6 text-sm font-normal leading-[140%] transition-colors",
              (!isButtonEnabled || isLoading)
                ? "cursor-not-allowed border-[#D3D5DC] bg-[#F9FAFB] text-[#D3D5DC]"
                : "border-[#D3D5DC] bg-white text-basic hover:bg-muted"
            )}
          >
            {isLoading ? "탈퇴 중..." : "탈퇴할래요"}
          </button>

          {/* 다음에 할게요 - 125px × 40px */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-[125px] items-center justify-center whitespace-nowrap rounded bg-[#F36012] px-6 text-sm font-normal leading-[140%] text-white transition-colors hover:bg-[#E55511]"
          >
            다음에 할게요
          </button>
        </div>
      </div>
    </>
  );
}
