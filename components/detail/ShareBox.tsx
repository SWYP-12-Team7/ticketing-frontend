"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface ShareBoxProps {
  onClose?: () => void;
}

export function ShareBox({ onClose }: ShareBoxProps) {
  return (
    <div className="w-[240px] rounded-2xl bg-white px-4 py-6 shadow-[0px_1px_2px_rgba(0,0,0,0.1),0px_0px_2px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between rounded-xl py-1">
        <p className="text-lg font-normal leading-[1.5] text-[#222]">공유하기</p>
        <button
          type="button"
          onClick={onClose}
          className="flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          aria-label="공유하기 닫기"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-2 flex items-start justify-start gap-6">
        <button type="button" className="flex flex-col items-center gap-1">
          <Image
            src="/images/shareKakao.svg"
            alt="카카오톡 공유"
            width={60}
            height={60}
          />
          <span className="text-xs font-normal leading-[1.5] text-[#6c7180]">
            카카오톡
          </span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1">
          <Image
            src="/images/shareLink.svg"
            alt="링크 복사"
            width={60}
            height={60}
          />
          <span className="text-xs font-normal leading-[1.5] text-[#6c7180]">
            링크 복사
          </span>
        </button>
      </div>
    </div>
  );
}
