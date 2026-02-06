import { useState, useCallback } from "react";
import { searchAddress } from "@/services/api/user";

interface UseAddressSearchReturn {
  /** 주소 검색 알림 표시 여부 */
  showAlert: boolean;
  /** 주소 검색 진행 중 여부 */
  isSearching: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 주소 검색 함수 */
  search: () => Promise<{ address: string; zonecode: string } | null>;
  /** 알림 숨김 */
  hideAlert: () => void;
}

/**
 * 주소 검색 커스텀 훅
 *
 * @description
 * - 다음 우편번호 API 호출
 * - 검색 성공 시 3초간 알림 표시
 * - 에러 핸들링
 *
 * @example
 * ```tsx
 * const { showAlert, isSearching, error, search } = useAddressSearch();
 *
 * const handleSearch = async () => {
 *   const result = await search();
 *   if (result) {
 *     setProfile({ address: result.address });
 *   }
 * };
 * ```
 */
export function useAddressSearch(): UseAddressSearchReturn {
  const [showAlert, setShowAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hideAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const search = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const result = await searchAddress();

      // 검색 성공
      setShowAlert(true);

      // 3초 후 알림 자동 숨김
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message === "Address search cancelled"
          ? null // 사용자가 취소한 경우는 에러로 처리하지 않음
          : "주소 검색에 실패했습니다. 다시 시도해주세요.";

      setError(errorMessage);
      console.error("주소 검색 실패:", error);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    showAlert,
    isSearching,
    error,
    search,
    hideAlert,
  };
}
