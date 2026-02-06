import {
  MainCarousel,
  FilterSection,
  EventSchedule,
  Ranking,
  ShowPick,
  AdBanner,
} from "@/components/home";
import { MainDataLogger } from "@/components/home/MainDataLogger";

export default async function Home() {
  return (
    <>
      {/* 메인 API 응답 확인용 (콘솔) */}
      <MainDataLogger />

      {/* 히어로 캐러셀 */}
      <MainCarousel />

      <div>
        {/* 필터 + 행사일정 + 랭킹 */}
        <div className="flex flex-col gap-6 py-6 md:flex-row">
          <FilterSection className="w-full md:min-w-66.25 md:basis-[21%]" />
          <EventSchedule className="w-full md:basis-[36%]" />
          <Ranking className="w-full md:basis-[43%]" />
        </div>

        {/* 와르르 PICK */}
        <ShowPick className="py-6" title="와르르 PICK!" subtitle="취향을 분석해 딱 맞는 행사를 찾았어요" subtitleType="orange"/>

        {/* 오픈 예정 행사 */}
        <ShowPick
          className="py-6"
          title="오픈 예정 행사를 미리 만나보세요!"
        />

        {/* 광고 배너 */}
        <AdBanner className="py-6" />

        {/* Hot Deal */}
        <ShowPick className="py-6" title="핫딜 행사" />

        {/* 전문가 PICK 섹션 */}
        <ShowPick className="py-6" title="전문가 PICK!" />
      </div>
    </>
  );
}
