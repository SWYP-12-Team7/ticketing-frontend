"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarView } from "@/components/calendarview/CalendarView";
import { HotEventSection } from "@/components/calendarview/HotEventSection";
import { KakaoMap } from "@/components/map";
import { OverlayEventCard, type Event } from "@/components/common";
import { X } from "lucide-react";

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

// 고정된 목데이터 (hydration 에러 방지)
const mockLocations: (Location & { event: Event })[] = [
  // 강남
  { id: "1", title: "현대미술 컬렉션 - 강남", lat: 37.4989, lng: 127.0286, event: { id: "1", title: "현대미술 컬렉션 - 강남", category: "전시", location: "서울 강남", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 18353, viewCount: 2444, tags: ["전시", "강남"] } },
  { id: "2", title: "캐릭터 팝업스토어 - 강남", lat: 37.4969, lng: 127.0266, event: { id: "2", title: "캐릭터 팝업스토어 - 강남", category: "팝업", location: "서울 강남", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 12000, viewCount: 3500, tags: ["팝업", "강남"] } },
  { id: "3", title: "디자인 페스티벌 - 강남", lat: 37.4999, lng: 127.0296, event: { id: "3", title: "디자인 페스티벌 - 강남", category: "전시", location: "서울 강남", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 8500, viewCount: 1800, tags: ["전시", "강남"] } },
  { id: "4", title: "브랜드 팝업 - 강남", lat: 37.4959, lng: 127.0256, event: { id: "4", title: "브랜드 팝업 - 강남", category: "팝업", location: "서울 강남", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 15000, viewCount: 4200, tags: ["팝업", "강남"] } },
  // 홍대
  { id: "5", title: "현대미술 컬렉션 - 홍대", lat: 37.5573, lng: 126.9246, event: { id: "5", title: "현대미술 컬렉션 - 홍대", category: "전시", location: "서울 홍대", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 9800, viewCount: 2100, tags: ["전시", "홍대"] } },
  { id: "6", title: "캐릭터 팝업스토어 - 홍대", lat: 37.5553, lng: 126.9226, event: { id: "6", title: "캐릭터 팝업스토어 - 홍대", category: "팝업", location: "서울 홍대", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 11200, viewCount: 3800, tags: ["팝업", "홍대"] } },
  { id: "7", title: "디자인 페스티벌 - 홍대", lat: 37.5583, lng: 126.9256, event: { id: "7", title: "디자인 페스티벌 - 홍대", category: "전시", location: "서울 홍대", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 7600, viewCount: 1500, tags: ["전시", "홍대"] } },
  { id: "8", title: "브랜드 팝업 - 홍대", lat: 37.5543, lng: 126.9216, event: { id: "8", title: "브랜드 팝업 - 홍대", category: "팝업", location: "서울 홍대", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 13500, viewCount: 4000, tags: ["팝업", "홍대"] } },
  // 명동
  { id: "9", title: "현대미술 컬렉션 - 명동", lat: 37.5646, lng: 126.9879, event: { id: "9", title: "현대미술 컬렉션 - 명동", category: "전시", location: "서울 명동", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 16200, viewCount: 3200, tags: ["전시", "명동"] } },
  { id: "10", title: "캐릭터 팝업스토어 - 명동", lat: 37.5626, lng: 126.9859, event: { id: "10", title: "캐릭터 팝업스토어 - 명동", category: "팝업", location: "서울 명동", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 14800, viewCount: 4500, tags: ["팝업", "명동"] } },
  { id: "11", title: "디자인 페스티벌 - 명동", lat: 37.5656, lng: 126.9889, event: { id: "11", title: "디자인 페스티벌 - 명동", category: "전시", location: "서울 명동", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 10500, viewCount: 2800, tags: ["전시", "명동"] } },
  { id: "12", title: "브랜드 팝업 - 명동", lat: 37.5616, lng: 126.9849, event: { id: "12", title: "브랜드 팝업 - 명동", category: "팝업", location: "서울 명동", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 17800, viewCount: 5200, tags: ["팝업", "명동"] } },
  // 잠실
  { id: "13", title: "현대미술 컬렉션 - 잠실", lat: 37.5155, lng: 127.103, event: { id: "13", title: "현대미술 컬렉션 - 잠실", category: "전시", location: "서울 잠실", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 11000, viewCount: 2600, tags: ["전시", "잠실"] } },
  { id: "14", title: "캐릭터 팝업스토어 - 잠실", lat: 37.5135, lng: 127.101, event: { id: "14", title: "캐릭터 팝업스토어 - 잠실", category: "팝업", location: "서울 잠실", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 19500, viewCount: 5800, tags: ["팝업", "잠실"] } },
  { id: "15", title: "디자인 페스티벌 - 잠실", lat: 37.5165, lng: 127.104, event: { id: "15", title: "디자인 페스티벌 - 잠실", category: "전시", location: "서울 잠실", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 8900, viewCount: 1900, tags: ["전시", "잠실"] } },
  { id: "16", title: "브랜드 팝업 - 잠실", lat: 37.5125, lng: 127.1, event: { id: "16", title: "브랜드 팝업 - 잠실", category: "팝업", location: "서울 잠실", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 14200, viewCount: 4100, tags: ["팝업", "잠실"] } },
  // 성수
  { id: "17", title: "현대미술 컬렉션 - 성수", lat: 37.5455, lng: 127.0567, event: { id: "17", title: "현대미술 컬렉션 - 성수", category: "전시", location: "서울 성수", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 13800, viewCount: 3100, tags: ["전시", "성수"] } },
  { id: "18", title: "캐릭터 팝업스토어 - 성수", lat: 37.5435, lng: 127.0547, event: { id: "18", title: "캐릭터 팝업스토어 - 성수", category: "팝업", location: "서울 성수", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 16500, viewCount: 4800, tags: ["팝업", "성수"] } },
  { id: "19", title: "디자인 페스티벌 - 성수", lat: 37.5465, lng: 127.0577, event: { id: "19", title: "디자인 페스티벌 - 성수", category: "전시", location: "서울 성수", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 9200, viewCount: 2200, tags: ["전시", "성수"] } },
  { id: "20", title: "브랜드 팝업 - 성수", lat: 37.5425, lng: 127.0537, event: { id: "20", title: "브랜드 팝업 - 성수", category: "팝업", location: "서울 성수", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 15200, viewCount: 4400, tags: ["팝업", "성수"] } },
  // 이태원
  { id: "21", title: "현대미술 컬렉션 - 이태원", lat: 37.5355, lng: 126.9956, event: { id: "21", title: "현대미술 컬렉션 - 이태원", category: "전시", location: "서울 이태원", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 12500, viewCount: 2900, tags: ["전시", "이태원"] } },
  { id: "22", title: "캐릭터 팝업스토어 - 이태원", lat: 37.5335, lng: 126.9936, event: { id: "22", title: "캐릭터 팝업스토어 - 이태원", category: "팝업", location: "서울 이태원", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 10800, viewCount: 3600, tags: ["팝업", "이태원"] } },
  { id: "23", title: "디자인 페스티벌 - 이태원", lat: 37.5365, lng: 126.9966, event: { id: "23", title: "디자인 페스티벌 - 이태원", category: "전시", location: "서울 이태원", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 7800, viewCount: 1700, tags: ["전시", "이태원"] } },
  { id: "24", title: "브랜드 팝업 - 이태원", lat: 37.5325, lng: 126.9926, event: { id: "24", title: "브랜드 팝업 - 이태원", category: "팝업", location: "서울 이태원", period: "2024.01.20 - 2024.03.20", imageUrl: "/images/mockImg.png", likeCount: 14600, viewCount: 4300, tags: ["팝업", "이태원"] } },
];

function MapViewContent() {
  const [selectedLocation, setSelectedLocation] = useState<
    (typeof mockLocations)[0] | null
  >(null);

  const locations = useMemo(
    () =>
      mockLocations.map(({ id, title, lat, lng }) => ({
        id,
        title,
        lat,
        lng,
      })),
    []
  );

  const handleMarkerClick = (location: Location) => {
    const found = mockLocations.find((l) => l.id === location.id);
    setSelectedLocation(found || null);
  };

  const handleCloseCard = () => {
    setSelectedLocation(null);
  };

  return (
    <section aria-label="지도 뷰" className="mapViewPage__section">
      <div className="mapViewPage__container relative h-[500px] rounded-xl overflow-hidden">
        <KakaoMap
          center={{ lat: 37.5665, lng: 126.978 }}
          level={8}
          locations={locations}
          onMarkerClick={handleMarkerClick}
          className="h-full w-full"
          enableClustering={true}
        />

        {/* 선택된 이벤트 카드 */}
        {selectedLocation && (
          <div className="absolute bottom-6 left-1/2 z-10 w-[320px] -translate-x-1/2">
            <div className="relative">
              <button
                type="button"
                onClick={handleCloseCard}
                className="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md"
              >
                <X className="h-4 w-4" />
              </button>
              <OverlayEventCard event={selectedLocation.event} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ViewContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "calendar";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* 지도 또는 캘린더 뷰 */}
      {mode === "map" ? (
        <Suspense
          fallback={
            <div className="h-[500px] rounded-xl bg-muted animate-pulse" />
          }
        >
          <MapViewContent />
        </Suspense>
      ) : (
        <Suspense
          fallback={
            <div className="rounded-xl bg-[#FFFBF4] p-4">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4" />
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          }
        >
          <CalendarView />
        </Suspense>
      )}

      {/* HOT EVENT 섹션 */}
      <HotEventSection className="mt-10" />
    </main>
  );
}

export default function ViewPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-4 py-6">
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-orange" />
          </div>
        </main>
      }
    >
      <ViewContent />
    </Suspense>
  );
}
