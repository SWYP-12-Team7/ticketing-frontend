import {
  MainCarousel,
  FilterSection,
  EventSchedule,
  Ranking,
  ShowPick,
  AdBanner,
} from "@/components/home";

// SSR: 서버에서 초기 데이터 fetch
// async function getHomeData() {
//   const res = await fetch(`${process.env.API_URL}/home`, {
//     cache: "no-store", // 또는 revalidate 설정
//   });
//   return res.json();
// }

import { Suspense } from "react";
import Calendar from "./components/Calendar";
import { CALENDAR_COPY } from "./components/calendar/calendar.copy";

export default async function Home() {
  // const data = await getHomeData();

  return (
    <>
      {/* 히어로 캐러셀 */}
      <MainCarousel />

      <div className="mx-auto max-w-7xl">
        {/* 필터 + 행사일정 + 랭킹 */}
        <div className="flex flex-col gap-6 px-4 py-6 md:flex-row">
          <FilterSection className="w-full md:min-w-66.25 md:basis-[21%]" />
          <EventSchedule className="w-full md:basis-[36%]" />
          <Ranking className="w-full md:basis-[43%]" />
        </div>

        {/* 와르르 PICK */}
        <ShowPick className="px-4 py-6" title="와르르 PICK!" />

        {/* 오픈 예정 행사 */}
        <ShowPick
          className="px-4 py-6"
          title="오픈 예정 행사를 미리 만나보세요!"
          variant="countdown"
        />

        {/* 광고 배너 */}
        <AdBanner className="px-4 py-6" />

        {/* Hot Deal */}
        <ShowPick className="px-4 py-6" title="핫딜 행사" variant="hotdeal" />

        {/* 전문가 PICK 섹션 */}
        <ShowPick className="px-4 py-6" title="전문가 PICK!" />
      </div>
    </>
  );
}
