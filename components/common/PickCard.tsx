"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import type { MainCuration } from "@/types/main";

interface PickCardProps {
  curation: MainCuration;
  isLiked?: boolean;
  onLikeClick?: (id: number) => void;
  className?: string;
}

const typeLabel: Record<string, { text: string; color: string }> = {
  EXHIBITION: {
    text: "전시",
    color: "text-orange",
  },
  POPUP: {
    text: "팝업",
    color: "text-[#E57835]",
  },
};

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  const year = dateStr.slice(2, 4);
  return `${year}.${month}.${day}`;
}

export function PickCard({
  curation,
  isLiked = false,
  onLikeClick,
  className,
}: PickCardProps) {
  const {
    id,
    type,
    title,
    thumbnail,
    place,
    startDate,
    endDate,
    category,
  } = curation;

  const label = typeLabel[type] ?? typeLabel.EXHIBITION;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLikeClick?.(id);
  };

  return (
    <Link
      href={`/detail/${id}`}
      className={cn(
        "flex h-[175px] overflow-hidden rounded-[12px]",
        "border border-border bg-white",
        "transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* 썸네일 */}
      <div className="h-[175px] w-[135px] shrink-0 bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="size-full object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col py-[16px] pl-[12px] pr-[16px]">
        {/* 상단: 타입 | 카테고리 + 하트 */}
        <div className="flex items-center justify-between">
          <p className="truncate text-[10px] text-[#6C7180]">
            <span className={cn("font-semibold", label.color)}>
              {label.text}
            </span>
            {category.length > 0 && (
              <>
                <span className="mx-1">|</span>
                <span className="font-normal">
                  {category.join(", ")}
                </span>
              </>
            )}
          </p>
          <button
            type="button"
            onClick={handleLikeClick}
            className="ml-1 shrink-0 p-0.5"
          >
            <Heart
              className={cn(
                "size-4",
                isLiked
                  ? "fill-orange text-orange"
                  : "text-[#BBBBBB]"
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* 제목 */}
        <h3 className="mt-1 line-clamp-1 text-[16px] font-semibold leading-[140%] text-[#222]">
          {title}
        </h3>

        {/* 날짜 */}
        <span className="mt-auto text-[14px] font-normal text-[#999]">
          {formatDate(startDate)} ~ {formatDate(endDate)}
        </span>

        {/* 장소 */}
        <span className="line-clamp-1 text-[10px] font-normal text-[#999]">
          {place}
        </span>
      </div>
    </Link>
  );
}
