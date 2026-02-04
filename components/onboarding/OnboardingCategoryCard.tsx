"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface OnboardingCategoryCardProps {
  name: string;
  imageUrl: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function OnboardingCategoryCard({
  name,
  imageUrl,
  isSelected = false,
  onClick,
}: OnboardingCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[300px] h-[417px] rounded-xl overflow-hidden transition-all"
    >
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover"
      />
      {/* 선택 시 오버레이 */}
      {isSelected && (
        <div className="absolute inset-0 bg-orange/50" />
      )}
    </button>
  );
}
