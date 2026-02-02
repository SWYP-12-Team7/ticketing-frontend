"use client";

interface AddressSearchButtonProps {
  onClick: () => void;
}

export function AddressSearchButton({ onClick }: AddressSearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-auto h-12 shrink-0 rounded border border-[#D3D5DC] bg-white px-6 text-base font-medium leading-[140%] text-[#202937] transition-colors hover:bg-muted"
    >
      검색
    </button>
  );
}
