"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  name: string;
  imageUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function OnboardingCard({
  name,
  imageUrl,
  isSelected = false,
  onClick,
}: OnboardingCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center w-full px-10 py-[48px] rounded-lg overflow-hidden transition-all"
    >
      {/* 배경 이미지 */}
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
      />
      {/* 오버레이 - 선택 시 오렌지 */}
      <div
        className={cn(
          "absolute inset-0 transition-colors",
          isSelected ? "bg-orange/60" : "bg-black/20"
        )}
      />
      {/* 텍스트 */}
      <span className="relative text-[24px] font-semibold leading-[150%] z-10 text-white">
        {name}
      </span>
    </button>
  );
}
