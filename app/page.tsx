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
import { useMainData } from "@/queries/main/useMainData";
import type { MainCuration } from "@/types/main";
import type { Event } from "@/types/event";

function convertToEvent(curation: MainCuration): Event {
  return {
    id: String(curation.id),
    title: curation.title,
    category: curation.category.join(", "),
    location: curation.place,
    period: `${curation.startDate.replace(/-/g, ".")} - ${curation.endDate.replace(/-/g, ".")}`,
    imageUrl: curation.thumbnail,
    likeCount: 0,
    viewCount: 0,
    tags: curation.category,
    openDate: new Date(curation.startDate),
    originalPrice: 0,
    discountRate: 0,
    discountPrice: 0,
  };
}

export default function Home() {
  const { data, isLoading } = useMainData();

  const userEvents = data?.data.userCurations.map(convertToEvent) ?? [];
  const upcomingEvents = data?.data.upcomingCurations.map(convertToEvent) ?? [];
  const freeEvents = data?.data.freeCurations.map(convertToEvent) ?? [];
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
          <FilterSection className="w-full md:basis-[28.2%]" />
          <EventSchedule className="w-full md:basis-[35.9%]" />
          <Ranking className="w-full md:basis-[35.9%]" />
        </div>

        {/* 닉네임 + PICK */}
        <ShowPick
          className="py-6"
          title="님을 위한 PICK!"
          subtitle="취향을 분석해 딱 맞는 행사를 찾았어요"
          subtitleType="orange"
          useNickname
          events={userEvents}
        />

        {/* 오픈 예정 행사 */}
        <ShowPick
          className="py-6"
          title={<><span className="text-orange">오픈 예정</span> 행사를 미리 만나보세요!</>}
          subtitle="사전 예약하고 특별한 혜택을 받아보세요"
          events={upcomingEvents}
        />

        {/* 광고 배너 */}
        <AdBanner className="py-6" />

        {/* Hot Deal */}
        <ShowPick
          className="py-6"
          title={<>지갑 없이 즐기는 <span className="text-orange">무료</span> 행사에 참여하세요!</>}
          subtitle="부담 없이 가볍게 즐기는 문화 생활을 즐겨보세요"
          events={freeEvents}
        />

        {/* 전문가 PICK 섹션 */}
        <ShowPick
          className="py-6"
          title={<>따끈따끈! <span className="text-orange">방금 오픈</span>한 행사를 만나보세요!</>}
          subtitle="누구보다 빠르게 새로운 행사를 경험하세요"
          events={todayEvents}
        />
      </div>
    </>
  );
}
