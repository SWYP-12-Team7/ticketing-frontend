"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Info } from "lucide-react";
import { EmptyState } from "@/components/common";
import { usePopular } from "@/queries/main";
import type {
  PopularItem,
  PopularPeriod,
} from "@/types/popular";
import { getNowStampText } from "@/lib/time";

type TabKey = "realtime" | "weekly" | "monthly";
type CategoryKey = "popup" | "exhibition";

const TAB_TO_PERIOD: Record<TabKey, PopularPeriod> = {
  realtime: "daily",
  weekly: "weekly",
  monthly: "monthly",
};

interface RankingProps {
  className?: string;
}

export function Ranking({ className }: RankingProps) {
  const [activeTab, setActiveTab] =
    useState<TabKey>("realtime");
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("popup");

  const { data } = usePopular();
   const nowTime = useMemo(() => getNowStampText(), []);

  const period = TAB_TO_PERIOD[activeTab];
  const items: PopularItem[] =
    data?.data?.[activeCategory]?.[period] ?? [];

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
                { key: "monthly", label: "월간 베스트" },
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
                onClick={() =>
                  setActiveCategory("exhibition")
                }
                className={cn(
                  "rounded-full border px-4.5 py-[6px] text-[14px] font-normal",
                  activeCategory === "exhibition"
                    ? "border-transparent bg-[#6C7180] text-white"
                    : "border-[#D5D9E0] bg-white text-[#4B5462]"
                )}
              >
                전시
              </button>
            </div>
            <div className="flex items-center gap-1 text-[12px] text-[#6C7180] font-normal">
              <span>{nowTime}</span>
              
              <Info className="size-3.5" />
            </div>
          </div>
        </div>

        <div className="py-2.5 flex flex-1 flex-col gap-2 overflow-hidden">
          {items.length === 0 ? (
            <EmptyState message="아직 인기 행사가 없어요" />
          ) : (
            items.map((item, index) => (
              <Link
                key={item.id}
                href={`/detail/${item.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-2 py-3 transition-colors hover:bg-[#F3F4F6]",
                  index !== items.length - 1 &&
                    "border-b border-[#E8E8E8]"
                )}
              >
                <div className="w-6 text-center text-[16px] font-semibold text-[#5B5F66]">
                  {item.rank}
                </div>
                <div className="relative h-[84px] w-[60px] p-2.5 shrink-0 overflow-hidden rounded-[4px] bg-[#EAEAEA]">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="truncate text-[15px] font-semibold text-[#111111]">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-[12px] text-[#7A7A7A]">
                    {item.address}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[12px] text-[#7A7A7A]">
                    <span>{item.period}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
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
