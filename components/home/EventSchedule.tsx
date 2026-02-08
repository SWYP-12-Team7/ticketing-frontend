"use client";

import { cn } from "@/lib/utils";
import { useFavorites } from "@/queries/favorite/useFavorites";
import { useAuthStore } from "@/store/auth";
import { EmptyText } from "@/components/common/404/EmptyText";
import type { FavoriteItem } from "@/types/favorite";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronRight } from "lucide-react";

function formatPeriod(start: string, end: string) {
  return `${start.replace(/-/g, ".")} ~ ${end.replace(/-/g, ".")}`;
}

function getCurationLabel(type: "EXHIBITION" | "POPUP") {
  return type === "POPUP" ? "팝업" : "전시";
}

interface EventCardProps {
  item: FavoriteItem;
}

function EventCard({ item }: EventCardProps) {
  return (
    <Link
      href={`/detail/${item.id}`}
      className="flex gap-3 rounded-lg bg-white p-3 transition-opacity hover:opacity-80"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="text-[11px] text-[#767676]">
            {formatPeriod(item.startDate, item.endDate)}
          </p>
          <h4 className="mt-0.5 truncate text-sm font-semibold text-[#111111]">
            {item.title}
          </h4>
        </div>
        <p className="text-xs text-[#767676]">{item.region}</p>
      </div>
    </Link>
  );
}

interface EventScheduleProps {
  className?: string;
}

export function EventSchedule({ className }: EventScheduleProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data, isLoading } = useFavorites();

  const userName = user?.nickname ?? "";
  const items = data?.items ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoingEvents = items.filter((item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return start <= today && end >= today;
  });

  const upcomingEvents = items.filter((item) => {
    const start = new Date(item.startDate);
    start.setHours(0, 0, 0, 0);
    return start > today;
  });

  const hasEvents = ongoingEvents.length > 0 || upcomingEvents.length > 0;

  const todayDate = new Date();
  const todayLabel = `${String(todayDate.getMonth() + 1).padStart(2, "0")}.${String(todayDate.getDate()).padStart(2, "0")} 오늘`;

  if (!isAuthenticated) {
    return (
      <div
        className={cn(
          "flex min-h-[642px] flex-col items-center justify-center rounded-xl border border-[#FA7228] px-5 py-6",
          className
        )}
      >
        <EmptyText
          title="로그인이 필요해요"
          subtitle="찜한 행사를 확인하려면 로그인 해주세요"
          buttonText="로그인하기"
          onButtonClick={() => router.push("/auth/login")}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          "flex min-h-[642px] flex-col items-center justify-center rounded-xl border border-[#FA7228] px-5 py-6",
          className
        )}
      >
        <div className="size-6 animate-spin rounded-full border-2 border-[#FA7228] border-t-transparent" />
      </div>
    );
  }

  if (!hasEvents) {
    return (
      <div
        className={cn(
          "flex min-h-[642px] flex-col items-center justify-center rounded-xl border border-[#FA7228] px-5 py-6",
          className
        )}
      >
        <EmptyText
          title="찜한 행사가 없어요"
          subtitle="관심있는 행사를 찜해보세요"
          buttonText="행사 둘러보기"
          onButtonClick={() => router.push("/search")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[642px] flex-col rounded-xl border border-[#FA7228] px-5 py-6",
        className
      )}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between pb-6">
        <div>
          <div className="mb-2.5 flex flex-wrap items-center gap-1 text-base md:text-lg">
            <span className="font-semibold text-[#FA7228]">
              {userName}
            </span>
            <span className="text-[#000000]">
              님! 찜한 행사일정이에요!
            </span>
          </div>
          <p className="text-sm text-[#000000]">
            찜한 행사를 타임라인으로 확인해보세요
          </p>
        </div>
      </div>

      {/* 컨텐츠 */}
      {(
        <div className="relative mt-4 flex flex-1 flex-col gap-4 overflow-y-auto">
          {/* 타임라인 세로선 */}
          <div className="absolute left-[7px] top-8 h-[calc(100%-32px)] w-px border-l border-dashed border-[#50505078]" />

          {/* 날짜 뱃지 */}
          <div className="z-10 flex items-center">
            <span className="rounded-full bg-[#1E1E1E] px-3 py-1 text-xs font-semibold text-white">
              {todayLabel}
            </span>
          </div>

          {/* 진행 중인 행사 */}
          {ongoingEvents.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-[14px] items-center justify-center">
                  <span className="size-3 rounded-full bg-[#505050]" />
                </span>
                <span className="text-sm font-semibold text-[#111111]">
                  진행 중인 행사
                </span>
              </div>
              <div className="pl-6">
                <EventCard item={ongoingEvents[0]} />
              </div>
            </div>
          )}

          {/* 오픈 예정 행사 */}
          {upcomingEvents.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-[14px] items-center justify-center">
                  <span className="size-3 rounded-full border border-[#505050]" />
                </span>
                <span className="text-sm font-semibold text-[#111111]">
                  오픈 예정 행사
                </span>
              </div>
              <div className="pl-6">
                <EventCard item={upcomingEvents[0]} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 하단 버튼 */}
      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-3 py-3 text-base font-medium leading-[140%] text-white">
        타임라인 더보기
        <ChevronRight className="size-6" />
      </button>
    </div>
  );
}
