"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface RankingEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  isBookmarked?: boolean;
}

interface RankingProps {
  className?: string;
  events?: RankingEvent[];
}

export function Ranking({ className, events }: RankingProps) {
  // 더미 데이터
  const defaultEvents: RankingEvent[] = [
    {
      id: "1",
      title: "BanG Dream! 10주년의 궤적展",
      location: "Space Gallery 서울 용산",
      date: "2025.12.04 - 2026.02.01",
      imageUrl: "/images/mockImg.png",
      isBookmarked: true,
    },
    {
      id: "2",
      title: "나 혼자만 레벨업 展",
      location: "익스DUCE스",
      date: "2025.12.13 - 2026.03.01",
      imageUrl: "/images/mockImg.png",
      isBookmarked: false,
    },
    {
      id: "3",
      title: "[할 천만 20%할인] 월레와 친구...",
      location: "서울숲 갤러리아포레",
      date: "2026.01.02 - 2026.02.28",
      imageUrl: "/images/mockImg.png",
      isBookmarked: false,
    },
  ];

  const displayEvents = events || defaultEvents;

  return (
    <div
      className={cn(
        "rounded-xl border border-[#FA7228] bg-white px-10 py-3",
        className
      )}
    >
      <div className="flex h-full flex-col justify-center"> 
        {displayEvents.map((event, index) => (
          <Link
            key={event.id}
            href={`/event/${event.id}`}
            className={cn(
              "flex items-start gap-4 py-4 ",
              index !== displayEvents.length - 1 && "border-b border-[#E8E8E8]"
            )}
          >
            <div className="flex w-6 flex-col items-center text-[#111111]">
              <span className="text-3xl font-semibold">{index + 1}</span>
              <span className="text-xl leading-none text-[#111111]/60">-</span>
            </div>
            <div className="relative h-34 w-24 shrink-0 overflow-hidden rounded-sm bg-[#F2F2F2]">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 pt-4">
              <h4 className="truncate text-base font-semibold text-[#111111]">
                {event.title}
              </h4>
              <p className="mt-9 text-sm text-[#7A7A7A]">{event.date}</p>
              <p className="text-[13px] text-[#7A7A7A]">{event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
