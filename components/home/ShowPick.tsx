"use client";

import { cn } from "@/lib/utils";
import { formatDdayStart } from "@/lib/date";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  likeCount: number;
  viewCount: number;
  tags: string[];
  openDate?: Date;
  // HotDeal 전용
  originalPrice?: number;
  discountRate?: number;
  discountPrice?: number;
}

interface ShowPickProps {
  className?: string;
  title: string;
  events?: Event[];
  variant?: "normal" | "countdown" | "hotdeal";
}

// 임시 목데이터
const mockEvents: Event[] = [
  {
    id: "1",
    title: "현대미술 컬렉션: 새로운 시선",
    location: "서울 코엑스",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "2",
    title: "현대미술 컬렉션: 새로운 시선",
    location: "서울 코엑스",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "3",
    title: "현대미술 컬렉션: 새로운 시선",
    location: "서울 코엑스",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "4",
    title: "현대미술 컬렉션: 새로운 시선",
    location: "서울 코엑스",
    date: "2024.01.20 - 2024.03.20",
    imageUrl: "/images/mockImg.png",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
];

export function ShowPick({
  className,
  title,
  events,
  variant = "normal",
}: ShowPickProps) {
  const [startIndex, setStartIndex] = useState(0);

  const displayEvents = events || mockEvents;
  const visibleCount = 4;
  const maxIndex = Math.max(0, displayEvents.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () =>
    setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visibleEvents = displayEvents.slice(
    startIndex,
    startIndex + visibleCount
  );

  // HotDeal 카드 렌더링
  const renderHotDealCard = (event: Event) => (
    <Link
      key={event.id}
      href={`/event/${event.id}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-3"
    >
      {/* 이미지 */}
      <div className="relative aspect-square w-30 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div>
          {/* 태그 */}
          <div className="mb-2 flex gap-1">
            {event.tags.map((tag, index) => (
              <span
                key={index}
                className={
                  index === 0
                    ? "rounded-md bg-[#6A8DFF] px-2 py-0.5 text-xs text-white"
                    : "rounded-md bg-[#FA7228] px-2 py-0.5 text-xs text-white"
                }
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 제목 */}
          <h3 className="mb-2 text-sm font-semibold text-foreground group-hover:underline">
            {event.title}
          </h3>

          {/* 위치 */}
          <div className="mb-1 flex items-center gap-1 text-[12px] font-normal text-[#111111]">
            <MapPin className="size-3 text-[#111111]" />
            <span>{event.location}</span>
          </div>

          {/* 날짜 */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="size-3" />
            <span>{event.date}</span>
          </div>
        </div>

        {/* 가격 */}
        <div className="mt-2">
          {event.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {event.originalPrice.toLocaleString()}원
            </span>
          )}
          <div className="flex items-center gap-2">
            {event.discountRate && (
              <span className="text-sm font-bold text-[#FA7228]">
                {event.discountRate}%
              </span>
            )}
            {event.discountPrice && (
              <span className="text-sm font-bold text-foreground">
                {event.discountPrice.toLocaleString()}원
              </span>
            )}
          </div>
        </div>

        {/* 조회수 + 좋아요 */}
        <div className="mt-2 flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="size-3" />
            <span className="text-xs">{event.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-3" />
            <span className="text-xs">{event.likeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 하트 버튼 */}
      <button
        onClick={(e) => {
          e.preventDefault();
        }}
        className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full border border-border bg-white transition-colors hover:bg-muted"
      >
        <Heart className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </button>
    </Link>
  );

  // Normal/Countdown 카드 렌더링
  const renderNormalCard = (event: Event) => (
    <Link
      key={event.id}
      href={`/event/${event.id}`}
      className="group relative aspect-3/4 overflow-hidden rounded-xl"
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-muted bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      />

      {/* 우측 상단: 하트 버튼 */}
      <button
        onClick={(e) => {
          e.preventDefault();
        }}
        className="absolute right-5.5 top-4 flex size-8 items-center justify-center rounded-full bg-[#BBBBBB]/73 transition-colors hover:bg-[#BBBBBB]/90"
      >
        <Heart className="size-5 text-black" strokeWidth={1.5} />
      </button>

      {/* 하단 그라데이션 + 텍스트 */}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-4 pt-20">
        {/* 태그 */}
        <div className="mb-2 flex gap-1">
          {event.tags.map((tag, index) => (
            <span
              key={index}
              className={
                index === 0
                  ? "rounded-md bg-[#6A8DFF] px-2 py-0.5 text-xs text-white"
                  : "rounded-md border-[1.5px] border-[#6A8DFF] bg-white px-2 py-0.5 text-xs text-[#6A8DFF]"
              }
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 제목 */}
        <h3 className="mb-2 text-sm font-medium text-white">{event.title}</h3>

        {/* 위치 */}
        <div className="mb-1 flex items-center gap-1 text-xs text-white/80">
          <MapPin className="size-3" />
          <span>{event.location}</span>
        </div>

        {/* 날짜: variant에 따라 D-day 또는 날짜 표시 */}
        <div className="mb-2 flex items-center gap-1 text-xs">
          <Calendar className="size-3 text-white/80" />
          {variant === "countdown" && event.openDate ? (
            <span className="font-medium text-[#FF0000]">
              {formatDdayStart(event.openDate)}
            </span>
          ) : (
            <span className="text-white/80">{event.date}</span>
          )}
        </div>

        {/* 경계선 */}
        <div className="mb-2 border-t border-white/30" />

        {/* 조회수 + 좋아요 */}
        <div className="flex items-center gap-3 text-white/80">
          <div className="flex items-center gap-1">
            <Eye className="size-3" />
            <span className="text-xs">{event.viewCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="size-3" />
            <span className="text-xs">{event.likeCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className={cn("", className)}>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex >= maxIndex}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* 카드 그리드 */}
      {variant === "hotdeal" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleEvents.map((event) => (
            <div key={event.id} className="relative">
              {renderHotDealCard(event)}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {visibleEvents.map((event) => renderNormalCard(event))}
        </div>
      )}
    </section>
  );
}
