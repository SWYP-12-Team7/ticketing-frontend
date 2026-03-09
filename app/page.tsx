"use client";

import {
  MainCarousel,
  FilterSection,
  EventSchedule,
  Ranking,
  ShowPick,
  AdBanner,
} from "@/components/home";
import { MainDataLogger } from "@/components/home/MainDataLogger";
import { UserPickSection } from "@/components/home/UserPickSection";
import { FreePickSection } from "@/components/home/FreePickSection";
import { useMainData } from "@/queries/main/useMainData";
import type { MainCuration } from "@/types/main";
import type { Event } from "@/types/event";

function convertToEvent(curation: MainCuration): Event {
  return {
    id: String(curation.id),
    title: curation.title,
    category: (curation.category ?? []).join(", "),
    location: curation.place,
    period: `${curation.startDate.replace(/-/g, ".")} - ${curation.endDate.replace(/-/g, ".")}`,
    imageUrl: curation.thumbnail,
    likeCount: 0,
    viewCount: 0,
    tags: curation.category ?? [],
    openDate: new Date(curation.startDate),
    originalPrice: 0,
    discountRate: 0,
    discountPrice: 0,
  };
}

export default function Home() {
  const { data, isLoading } = useMainData();

  const upcomingEvents = data?.data.upcomingCurations.map(convertToEvent) ?? [];
  const todayEvents = data?.data.todayOpenCurations.map(convertToEvent) ?? [];

  return (
    <>
      {/* 메인 API 응답 확인용 (콘솔) */}
      <MainDataLogger />

      {/* 히어로 캐러셀 */}
      <MainCarousel />

      <div>
        {/* 필터 + 행사일정 + 랭킹 */}
        <div className="flex flex-col gap-6 py-6 md:flex-row">
          <FilterSection className="w-full md:w-[352px] md:shrink-0" />
          <EventSchedule className="w-full md:w-[448px] md:shrink-0" />
          <Ranking className="w-full md:w-[448px] md:shrink-0" />
        </div>

        {/* 닉네임 + PICK */}
        <UserPickSection
          className="py-6"
          curations={data?.data.userCurations}
        />

        {/* 오픈 예정 행사 */}
        <div className="py-6">
          <ShowPick
            title="이번 주 안에 끝나요!"
            subtitle="사전 예약하고 특별한 혜택이?"
            events={upcomingEvents}
          />
        </div>

        {/* 광고 배너 */}
        <AdBanner className="py-6" />

        {/* 전문가 PICK 섹션 */}
        <div className="py-6">
          <ShowPick
            title="따끈따끈! 방금 오픈한 행사를 만나보세요!"
            subtitle="누구보다 빠르게 새로운 행사를 경험하세요"
            events={todayEvents}
          />
        </div>

        {/* 무료 행사 */}
        <FreePickSection
          className="py-6"
          curations={data?.data.freeCurations}
        />
      </div>
    </>
  );
}
