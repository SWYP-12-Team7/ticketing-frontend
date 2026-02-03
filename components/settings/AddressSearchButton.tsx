"use client";

interface AddressSearchButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

/**
 * 주소 검색 버튼 컴포넌트
 *
 * @description
 * - Figma 스펙: 76×48px, border-radius 4px
 * - 다음 우편번호 API 트리거
 *
 * @example
 * ```tsx
 * <AddressSearchButton onClick={handleSearch} />
 * ```
 */
export function AddressSearchButton({
  onClick,
  disabled = false,
}: AddressSearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="주소 검색"
      className="mt-auto h-12 w-[76px] shrink-0 rounded border border-[#D3D5DC] bg-white px-6 text-base font-medium leading-[140%] text-basic whitespace-nowrap transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      검색
    </button>
  );
}
