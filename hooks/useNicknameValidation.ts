import { useState, useCallback } from "react";
import { checkNicknameDuplicate } from "@/services/api/user";

/**
 * 닉네임 검증 규칙
 */
const NICKNAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 7,
  REGEX: {
    WHITESPACE: /\s/,
    VALID_CHARS: /[가-힣a-zA-Z0-9]/,
  },
  MESSAGES: {
    WHITESPACE: "닉네임에 공백을 사용할 수 없습니다",
    EMPTY: "닉네임은 반드시 글자를 포함해주세요",
    INVALID_CHARS: "닉네임은 반드시 글자를 포함해주세요",
    TOO_SHORT: "닉네임은 2자 이상이어야 합니다",
    TOO_LONG: "닉네임은 7자 이하이어야 합니다",
    DUPLICATE: "이미 사용 중인 닉네임입니다",
  },
} as const;

interface UseNicknameValidationReturn {
  /** 에러 메시지 */
  error: string;
  /** 중복 체크 진행 중 여부 */
  isChecking: boolean;
  /** 닉네임 검증 함수 */
  validate: (value: string) => Promise<boolean>;
  /** 에러 초기화 */
  clearError: () => void;
}

/**
 * 닉네임 검증 커스텀 훅
 *
 * @description
 * - 공백 체크
 * - 빈 문자열 체크
 * - 유효한 문자(한글/영문/숫자) 체크
 * - 길이 체크 (2-7자)
 * - 중복 체크
 *
 * @example
 * ```tsx
 * const { error, isChecking, validate, clearError } = useNicknameValidation();
 *
 * <InputField
 *   onBlur={() => validate(nickname)}
 *   error={error}
 * />
 * ```
 */
export function useNicknameValidation(): UseNicknameValidationReturn {
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const validate = useCallback(async (value: string): Promise<boolean> => {
    // 1. 공백 체크
    if (NICKNAME_VALIDATION.REGEX.WHITESPACE.test(value)) {
      setError(NICKNAME_VALIDATION.MESSAGES.WHITESPACE);
      return false;
    }

    // 2. 빈 문자열 체크
    if (!value || value.length === 0) {
      setError(NICKNAME_VALIDATION.MESSAGES.EMPTY);
      return false;
    }

    // 3. 유효한 문자 체크 (한글/영문/숫자)
    const hasValidChars = NICKNAME_VALIDATION.REGEX.VALID_CHARS.test(value);
    if (!hasValidChars) {
      setError(NICKNAME_VALIDATION.MESSAGES.INVALID_CHARS);
      return false;
    }

    // 4. 길이 체크 (실제 문자 수 - 이모지 대응)
    const actualLength = [...value].length;

    if (actualLength < NICKNAME_VALIDATION.MIN_LENGTH) {
      setError(NICKNAME_VALIDATION.MESSAGES.TOO_SHORT);
      return false;
    }

    if (actualLength > NICKNAME_VALIDATION.MAX_LENGTH) {
      setError(NICKNAME_VALIDATION.MESSAGES.TOO_LONG);
      return false;
    }

    // 5. 닉네임 중복 체크
    try {
      setIsChecking(true);
      const result = await checkNicknameDuplicate(value);

      if (result.isDuplicate) {
        setError(NICKNAME_VALIDATION.MESSAGES.DUPLICATE);
        return false;
      }
    } catch (error) {
      console.error("닉네임 중복 확인 실패:", error);
      // 네트워크 오류는 저장 시도 허용 (UX 개선)
    } finally {
      setIsChecking(false);
    }

    // 검증 통과
    setError("");
    return true;
  }, []);

  return {
    error,
    isChecking,
    validate,
    clearError,
  };
}
