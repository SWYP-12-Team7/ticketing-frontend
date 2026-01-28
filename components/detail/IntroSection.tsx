"use client";

import { cn } from "@/lib/utils";
import { ExpandButton } from "@/components/common/ExpandButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface IntroSectionProps {
  className?: string;
  id?: string;
  text?: string;
  imageUrl?: string;
}

const IMAGE_HEIGHT_THRESHOLD = 540;

export function IntroSection({
  className,
  id,
  text,
  imageUrl,
}: IntroSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageContainerRef.current || !imageUrl) return;

    const checkHeight = () => {
      const container = imageContainerRef.current;
      if (container) {
        const renderedHeight = container.scrollHeight;
        setNeedsExpand(renderedHeight > IMAGE_HEIGHT_THRESHOLD);
      }
    };

    // 이미지 로드 후 높이 체크
    const img = imageContainerRef.current.querySelector("img");
    if (img) {
      if (img.complete) {
        checkHeight();
      } else {
        img.onload = checkHeight;
      }
    }

    // 리사이즈 시 재체크
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [imageUrl]);

  // 텍스트와 이미지 모두 없으면 렌더링하지 않음
  if (!text && !imageUrl) {
    return null;
  }

  return (
    <section className={cn("py-10", className)} id={id}>
      <div className="mx-auto max-w-300 px-5 text-[#202937]">
        <h2 className="mb-6 text-lg font-[700] text-foreground">소개</h2>

        {/* 텍스트 */}
        {text && (
          <p className="mb-6 whitespace-pre-line text-sm font-[400] leading-relaxed text-foreground">
            {text}
          </p>
        )}

        {/* 이미지 */}
        {imageUrl && (
          <div className="relative">
            <div
              ref={imageContainerRef}
              className={cn(
                "relative w-full overflow-hidden transition-all duration-300",
                needsExpand && !isExpanded && "max-h-[540px]"
              )}
            >
              <Image
                src={imageUrl}
                alt="소개 이미지"
                width={1200}
                height={800}
                className="w-full object-contain"
              />

              {/* 그라데이션 오버레이 (접힌 상태에서만) */}
              {needsExpand && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
              )}
            </div>

            {/* 펼치기/접기 버튼 */}
            {needsExpand && (
              <div className="mt-4 flex justify-center">
                <ExpandButton
                  isExpanded={isExpanded}
                  onClick={() => setIsExpanded(!isExpanded)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
