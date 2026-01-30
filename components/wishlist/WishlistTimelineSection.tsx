"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TimelineEvent {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
}

interface TimelineGroup {
  label: string;
  events: TimelineEvent[];
}

interface WishlistTimelineSectionProps {
  year: number;
  groups: TimelineGroup[];
  className?: string;
  userNickname?: string;
}

/**
 * 찜 목록 타임라인 섹션
 * - 연도별 이벤트 타임라인
 * - 그룹별 이벤트 표시
 * - 세로 타임라인 UI
 * - 유저 닉네임 표시
 */
export const WishlistTimelineSection = memo(function WishlistTimelineSection({
  year,
  groups,
  className,
  userNickname = "스위프",
}: WishlistTimelineSectionProps) {
  if (!groups || groups.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("wishlistTimelineSection mt-16", className)}
      aria-label="찜한 행사 타임라인"
    >
      {/* 섹션 타이틀 */}
      <h2 className="wishlistTimelineSection__title mb-10 text-heading-medium text-foreground">
        <span className="text-primary">{userNickname}</span> 님이 찜한 행사
        타임라인이에요!
      </h2>

      {/* 타임라인 컨테이너 */}
      <div className="wishlistTimelineSection__timeline relative pl-12">
        {/* 타임라인 세로선 */}
        <div className="wishlistTimelineSection__verticalLine absolute left-[15px] top-0 h-full w-[2px] bg-linear-to-b from-border via-border to-transparent" />

        {/* 연도 노드 */}
        <div className="wishlistTimelineSection__yearNode relative mb-10">
          <div className="wishlistTimelineSection__yearDot absolute -left-[46px] flex size-8 items-center justify-center rounded-full border-4 border-white bg-muted-foreground shadow-sm">
            <div className="size-2 rounded-full bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <p className="text-body-large-bold text-foreground">{year}년</p>
          </div>
        </div>

        {/* 그룹별 이벤트 */}
        {groups.map((group, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            className="wishlistTimelineSection__group relative mb-12 last:mb-0"
          >
            {/* 그룹 헤더 */}
            <div className="wishlistTimelineSection__groupHeader relative mb-6">
              <div className="wishlistTimelineSection__groupDot absolute -left-[46px] flex size-8 items-center justify-center rounded-full border-4 border-white bg-primary shadow-sm">
                <div className="size-2 rounded-full bg-white" />
              </div>
              <h3 className="text-body-large-bold text-foreground">
                {group.label}
              </h3>
            </div>

            {/* 이벤트 목록 */}
            <div className="wishlistTimelineSection__events space-y-4">
              {group.events.map((event) => (
                <Link
                  key={event.id}
                  href={`/detail/${event.id}`}
                  className="wishlistTimelineSection__eventCard group flex gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
                >
                  {/* 이벤트 썸네일 */}
                  <div className="wishlistTimelineSection__eventThumbnail relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* 이벤트 정보 */}
                  <div className="wishlistTimelineSection__eventInfo flex flex-1 flex-col justify-between">
                    {/* 작성자 */}
                    <div>
                      <p className="wishlistTimelineSection__eventAuthor mb-1.5 text-caption-medium text-muted-foreground">
                        {event.author}
                      </p>

                      {/* 제목 */}
                      <h4 className="wishlistTimelineSection__eventTitle line-clamp-2 text-body-medium-bold text-foreground transition-colors group-hover:text-primary">
                        {event.title}
                      </h4>
                    </div>

                    {/* 날짜 */}
                    <p className="wishlistTimelineSection__eventDate mt-2 text-caption-medium text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
