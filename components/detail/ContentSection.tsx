"use client";

import { cn } from "@/lib/utils";
import { ExpandButton } from "@/components/common/ExpandButton";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ContentSectionProps {
  className?: string;
  id?: string;
  title: string;
  text?: string;
  imageUrl?: string;
  maxHeight?: number;
}

const DEFAULT_MAX_HEIGHT = 540;

export function ContentSection({
  className,
  id,
  title,
  text,
  imageUrl,
  maxHeight = DEFAULT_MAX_HEIGHT,
}: ContentSectionProps) {
  const fallbackImage = "/images/404/emptyImg2.png";
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const checkHeight = () => {
      const container = contentRef.current;
      if (container) {
        const renderedHeight = container.scrollHeight;
        setNeedsExpand(renderedHeight > maxHeight);
      }
    };

    // 이미지가 있으면 로드 후 체크
    if (imageUrl) {
      const img = contentRef.current.querySelector("img");
      if (img) {
        if (img.complete) {
          checkHeight();
        } else {
          img.onload = checkHeight;
        }
      }
    } else {
      // 텍스트만 있으면 바로 체크
      const timer = setTimeout(checkHeight, 100);
      return () => clearTimeout(timer);
    }

    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [imageUrl, text, maxHeight]);

  // 텍스트와 이미지 모두 없으면 렌더링하지 않음
  if (!text && !imageUrl) {
    return null;
  }

  return (
    <section className={cn("py-10", className)} id={id}>
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-6 text-heading-medium">{title}</h2>

        <div className="relative">
          <div
            ref={contentRef}
            className={cn(
              "overflow-hidden transition-all duration-300",
              needsExpand && !isExpanded && `max-h-[${maxHeight}px]`
            )}
            style={needsExpand && !isExpanded ? { maxHeight: `${maxHeight}px` } : undefined}
          >
            {/* 텍스트 */}
            {text && (
              <p className="whitespace-pre-line text-body-medium">
                {text}
              </p>
            )}

            {/* 이미지 */}
            {imageUrl && (
              <div className={cn(text && "mt-6")}>
                <Image
                  src={imageUrl || fallbackImage}
                  alt={`${title} 이미지`}
                  width={1200}
                  height={800}
                  className="w-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== fallbackImage) {
                      target.src = fallbackImage;
                      target.srcset = "";
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* 그라데이션 오버레이 */}
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
    </section>
  );
}
