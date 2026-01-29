"use client";

import { cn } from "@/lib/utils";
import { formatDdayStartFromDateString } from "@/lib/date";
import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

interface SavedEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  imageUrl: string;
  initial: string;
  initialColor: string;
  status?: "open" | "upcoming";
  tags?: string[];
  location?: string;
}

interface SavedEventsProps {
  className?: string;
  userName?: string;
  events?: SavedEvent[];
}

export function EventSchedule({
  className,
  userName = "스뮤트",
  events,
}: SavedEventsProps) {
  // 더미 데이터
  const defaultEvents: SavedEvent[] = [
    {
      id: "1",
      initial: "G",
      initialColor: "#FA7228",
      subtitle: "티켓오픈완료",
      title: "펀미술관 콜렉션: 새로운 시선",
      location: "서울 코엑스",
      date: "2024.01.20",
      imageUrl: "/images/mockImg.png",
      status: "open",
      tags: ["전시", "현대미술"],
    },
    {
      id: "2",
      initial: "C",
      initialColor: "#4A90D9",
      subtitle: "오픈 예정",
      title: "펀미술관 콜렉션: 새로운 시선",
      location: "서울 코엑스",
      date: "2026.03.20",
      imageUrl: "/images/mockImg.png",
      status: "upcoming",
      tags: ["전시", "현대미술"],
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-[#FA7228] bg-[#F3EAE6]",
        className
      )}
    >
      {/* 개인화 메시지 섹션 */}
      <div className="flex items-start justify-between px-7.5 pt-7.5 pb-6">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-1 text-base md:text-lg">
            <span className="font-semibold text-[#FA7228]">
              {userName}
            </span>
            <span className="text-[#000000]">
              님! 저장하신 행사일정이에요!
            </span>
          </div>
          <p className="text-sm text-[#000000]">
            저장하신 행사를 타임라인으로 확인해보세요
          </p>
        </div>
        <div className="flex items-center">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#1E1E1E] text-xs font-semibold text-white">
            ↗
          </div>
        </div>
      </div>

      {/* 이벤트 카드 리스트 */}
      <div className="relative flex flex-col gap-4 px-7.5 pb-4">
        <div className="absolute left-9.5 top-2 h-[calc(100%-16px)] w-px border-l border-dashed border-[#50505078]" />
        <div className="h-9">
           <div className="mt-2 flex w-4 justify-center">
              <span className="size-3 rounded-full bg-[#505050]" />
            </div>
        </div>
        {displayEvents.map((event) => (
          <div key={event.id} className="relative flex gap-4">
            <div className="mt-2 flex w-4 justify-center">
              <span className="size-3 rounded-full border border-[#505050]" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-base font-semibold text-[#111111]">
                {event.subtitle}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative h-27.75 w-20 overflow-hidden bg-white">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {(event.tags || []).map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className={
                          index === 0
                            ? "rounded-md bg-[#6A8DFF] px-2.25 py-1 text-[10px] font-medium text-white"
                            : "rounded-md border-[1.5px] border-[#6A8DFF] bg-white px-2.25 py-1 text-[10px] font-medium text-[#6A8DFF]"
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h4 className="mt-1.25 truncate text-[16px] font-medium text-[#111111]">
                    {event.title}
                  </h4>
                  {event.location && (
                    <p className="mt-1.25 flex items-center gap-1 text-[12px] text-[#111111]">
                      <MapPin className="size-4 text-[#111111]" strokeWidth={1.33} />
                      {event.location}
                    </p>
                  )}
                  <p
                    className={
                      event.status === "upcoming"
                        ? "mt-1.25 flex items-center gap-1 text-[12px] font-medium text-[#FF0000]"
                        : "mt-1.25 flex items-center gap-1 text-[12px] text-[#111111]"
                    }
                  >
                    <Calendar className="size-4 text-[#111111]" strokeWidth={1.33} />
                    {event.status === "upcoming"
                      ? formatDdayStartFromDateString(event.date) ?? event.date
                      : event.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
