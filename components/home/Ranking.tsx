"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";

interface RankingEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  dday?: string;
  isBookmarked?: boolean;
}

interface RankingProps {
  className?: string;
  events?: RankingEvent[];
}

export function Ranking({ className, events }: RankingProps) {
  const [activeTab, setActiveTab] = useState<
    "realtime" | "weekly" | "daily"
  >("realtime");
  const [activeCategory, setActiveCategory] = useState<
    "popup" | "exhibit"
  >("popup");

  // 더미 데이터
  const defaultEvents: RankingEvent[] = [
    {
      id: "1",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "서울 마포구 합정동",
      date: "2024.01.20 - 2024.03.20",
      imageUrl: "https://picsum.photos/id/1035/300/400",
      isBookmarked: true,
    },
    {
      id: "2",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "서울 마포구 합정동",
      date: "2024.01.20 - 2024.03.20",
      imageUrl: "https://picsum.photos/id/1025/300/400",
      isBookmarked: false,
    },
    {
      id: "3",
      title: "현대미술 컬렉션: 새로운 시선",
      location: "서울 마포구 합정동",
      date: "2024.01.20 - 2024.03.20",
      dday: "D-7 시작",
      imageUrl: "https://picsum.photos/id/1011/300/400",
      isBookmarked: false,
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <div
      className={cn(
        "flex h-[642px] flex-col justify-between rounded-xl border border-[#FA7228] bg-white px-[20px] py-[20px]",
        className
      )}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-5">
          <h3 className="text-[18px] font-semibold text-[#111111]">
            인기 행사
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {/* 랭킹 탭 */}
          <div className="grid grid-cols-3 gap-2 rounded-[10px] bg-[#F9FAFB] p-1">
            {(
              [
                { key: "realtime", label: "실시간 급상승" },
                { key: "weekly", label: "주간 베스트" },
                { key: "daily", label: "일간 베스트" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "rounded-[8px] px-4 py-[6px] text-[14px] font-semibold leading-[180%] transition-colors",
                  activeTab === tab.key
                    ? "bg-white text-[#202937] shadow-[0_0_6px_0_rgba(0,0,0,0.10),0_1px_2px_0_rgba(0,0,0,0.10)]"
                    : "text-[#6C7180]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 카테고리 + 기준 시간 */}
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCategory("popup")}
                className={cn(
                  "rounded-full border px-4.5 py-[6px] text-[14px] font-normal",
                  activeCategory === "popup"
                    ? "border-transparent bg-[#6C7180] text-white"
                    : "border-[#D5D9E0] bg-white text-[#4B5462]"
                )}
              >
                팝업
              </button>
              <button
                onClick={() => setActiveCategory("exhibit")}
                className={cn(
                  "rounded-full border px-4.5 py-[6px] text-[14px] font-normal",
                  activeCategory === "exhibit"
                    ? "border-transparent bg-[#6C7180] text-white"
                    : "border-[#D5D9E0] bg-white text-[#4B5462]"
                )}
              >
                전시
              </button>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-[#6C7180] font-normal">
              <span>오늘 00:00 기준</span>
              <Info className="size-3.5" />
            </div>
          </div>
        </div>

        <div className="py-2.5 flex flex-1 flex-col gap-2 overflow-hidden">
          {displayEvents.map((event, index) => (
            <Link
              key={event.id}
              href={`/detail/${event.id}`}
              className={cn(
                "flex items-center gap-3 rounded-[8px] px-2 py-3 transition-colors hover:bg-[#F3F4F6]",
                index !== displayEvents.length - 1 &&
                  "border-b border-[#E8E8E8]"
              )}
            >
              <div className="w-6 text-center text-[16px] font-semibold text-[#5B5F66]">
                {index + 1}
              </div>
              <div className="relative h-[84px] w-[60px] p-2.5 shrink-0 overflow-hidden rounded-[4px] bg-[#EAEAEA]">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-[15px] font-semibold text-[#111111]">
                  {event.title}
                </h4>
                <p className="mt-1 text-[12px] text-[#7A7A7A]">
                  {event.location}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[12px] text-[#7A7A7A]">
                  <span>{event.date}</span>
                  {event.dday && (
                    <span className="font-semibold text-[#E74C3C]">
                      {event.dday}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <button className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-orange px-[12px] py-[12px] text-[16px] font-medium leading-[140%] text-white">
        랭킹 전체 보기
        <ChevronRight className="size-[24px]" />
      </button>
    </div>
  );
}
