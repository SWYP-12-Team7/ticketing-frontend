import {
  MainCarousel,
  CategoryTabs,
  TodayPick,
  UpcomingEvents,
  AdBanner,
  EventSection,
} from "@/components/home";

// SSR: 서버에서 초기 데이터 fetch
// async function getHomeData() {
//   const res = await fetch(`${process.env.API_URL}/home`, {
//     cache: "no-store", // 또는 revalidate 설정
//   });
//   return res.json();
// }

export default async function Home() {
  // const data = await getHomeData();

  return (
    <div className="mx-auto max-w-7xl"> 
      {/* 히어로 캐러셀 */}
      <MainCarousel />
      {/* 카테고리 탭 */}
      <CategoryTabs className="px-4 py-6" />

      {/* TODAY PICK */}
      <TodayPick className="px-4 py-6" />

      {/* 오픈 예정 행사 카운트다운 */}
      <UpcomingEvents className="px-4 py-6" />

      {/* 광고 배너 */}
      <AdBanner className="px-4 py-6" />

      {/* 행사 섹션 */}
      <EventSection className="px-4 py-6" title="행사" />

      {/* 장르별 섹션 */}
      <EventSection className="px-4 py-6" title="장르별 추천" />
    </div>
  );
}
