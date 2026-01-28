"use client";

import { cn } from "@/lib/utils";
import { Heart, ChevronLeft, Eye, Share } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ShareBox } from "./ShareBox";

interface HeroSectionProps {
  className?: string;
  images: string[];
  category: string;
  title: string;
  description: string;
  tags: string[];
  period: string;
  address: string;
  age: string;
  viewCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  onBackClick?: () => void;
  onLikeClick?: () => void;
}

export function HeroSection({
  className,
  images,
  category,
  title,
  description,
  tags,
  period,
  address,
  age,
  viewCount = 0,
  likeCount = 0,
  isLiked = false,
  onBackClick,
  onLikeClick,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const currentImage = images[currentImageIndex] || "";

  return (
    <section className={cn("", className)}>
      {/* 블러 배경 + 이미지 영역 */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {/* 블러 배경 */}
        {currentImage && (
          <div className="absolute inset-0">
            <Image
              src={currentImage}
              alt=""
              fill
              className="scale-110 object-cover blur-xl"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

        {/* 메인 이미지 */}
        <div className="relative mx-auto flex h-full max-w-[1200px] items-center justify-center px-5">
          {currentImage ? (
            <div className="relative h-[360px] w-[270px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={currentImage}
                alt={title}
                fill
                className="object-cover"
              />
              {/* 이미지 인디케이터 */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "size-2 rounded-full transition-colors",
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-[360px] w-[270px] items-center justify-center rounded-lg bg-muted">
              <span className="text-muted-foreground">이미지 없음</span>
            </div>
          )}
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="mx-auto max-w-[1200px] px-5 py-6">
        {/* 1행: 뒤로가기 / 조회수, 좋아요 */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackClick}
            className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="size-4" />
              <span>{viewCount.toLocaleString()}</span>
            </div>
            <button
              onClick={onLikeClick}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Heart
                className={cn(
                  "size-4",
                  isLiked ? "fill-red-500 text-red-500" : ""
                )}
              />
              <span>{likeCount.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* 2행: 카테고리 (오른쪽 정렬) */}
        <div className="mb-4 flex justify-end">
          <div className="w-[300px] shrink-0 pl-10">
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>

        {/* 3행: 내용 / 기간, 주소, 연령 */}
        <div className="mb-6 flex gap-10">
          {/* 왼쪽: 내용 */}
          <div className="flex-1">
            <h1 className="mb-4 text-xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="w-[300px] shrink-0 space-y-3 border-l border-border pl-10">
            <div className="flex gap-4">
              <span className="w-10 shrink-0 text-sm text-muted-foreground">
                기간
              </span>
              <span className="text-sm text-foreground">{period}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-10 shrink-0 text-sm text-muted-foreground">
                주소
              </span>
              <span className="text-sm text-foreground">{address}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-10 shrink-0 text-sm text-muted-foreground">
                연령
              </span>
              <span className="text-sm text-foreground">{age}</span>
            </div>
          </div>
        </div>

        {/* 4행: 태그공간 / 공유 */}
        <div className="flex items-end justify-between">
          {/* 왼쪽: 태그 */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 오른쪽: 공유하기 버튼 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsShareOpen((prev) => !prev)}
              className="flex shrink-0 flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Share className="size-5" />
              <span className="text-xs">공유하기</span>
            </button>

            {isShareOpen && (
              <div className="absolute right-0 bottom-[calc(100%+12px)] z-10">
                <ShareBox onClose={() => setIsShareOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
