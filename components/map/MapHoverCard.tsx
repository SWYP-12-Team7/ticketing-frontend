"use client";

import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import type { Event } from "@/types/event";

interface MapHoverCardProps {
  event: Event;
}

/**
 * 지도 마커 호버 시 표시되는 컴팩트한 이벤트 카드
 */
export function MapHoverCard({ event }: MapHoverCardProps) {
  const { title, location, period, imageUrl, category } = event;

  return (
    <div className="flex gap-3 rounded-xl bg-white p-3 shadow-lg">
      {/* 이미지 썸네일 */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={imageUrl || "/images/mockImg.png"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        {/* 카테고리 태그 */}
        {category && (
          <span className="mb-1 inline-flex w-fit rounded-md bg-orange/10 px-2 py-0.5 text-[10px] font-medium text-orange">
            {category}
          </span>
        )}

        {/* 제목 */}
        <h3 className="mb-1 truncate text-sm font-semibold text-gray-900">
          {title}
        </h3>

        {/* 위치 */}
        {location && (
          <div className="mb-0.5 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* 기간 */}
        {period && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="size-3 shrink-0" />
            <span className="truncate">{period}</span>
          </div>
        )}
      </div>
    </div>
  );
}
