"use client";

import { useState, useMemo } from "react";
import { KakaoMap } from "@/components/map";
import { OverlayEventCard, type Event } from "@/components/common";
import { X } from "lucide-react";

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

// 목데이터 생성 함수
function generateMockLocations(): (Location & { event: Event })[] {
  const areas = [
    { name: "강남", baseLat: 37.4979, baseLng: 127.0276 },
    { name: "홍대", baseLat: 37.5563, baseLng: 126.9236 },
    { name: "명동", baseLat: 37.5636, baseLng: 126.9869 },
    { name: "잠실", baseLat: 37.5145, baseLng: 127.1020 },
    { name: "성수", baseLat: 37.5445, baseLng: 127.0557 },
    { name: "이태원", baseLat: 37.5345, baseLng: 126.9946 },
  ];

  const categories = ["전시", "팝업"];
  const titles = [
    "현대미술 컬렉션",
    "캐릭터 팝업스토어",
    "디자인 페스티벌",
    "브랜드 팝업",
    "아트 전시회",
    "패션 팝업",
    "푸드 페스티벌",
    "뷰티 팝업",
  ];

  const locations: (Location & { event: Event })[] = [];

  areas.forEach((area, areaIndex) => {
    for (let i = 0; i < 8; i++) {
      const id = String(areaIndex * 8 + i + 1);
      const lat = area.baseLat + (Math.random() - 0.5) * 0.02;
      const lng = area.baseLng + (Math.random() - 0.5) * 0.02;
      const title = `${titles[i % titles.length]} - ${area.name}`;
      const category = categories[i % 2];

      locations.push({
        id,
        title,
        lat,
        lng,
        event: {
          id,
          title,
          category,
          location: `서울 ${area.name}`,
          period: "2024.01.20 - 2024.03.20",
          imageUrl: "/images/mockImg.png",
          likeCount: Math.floor(Math.random() * 20000),
          viewCount: Math.floor(Math.random() * 5000),
          tags: [category, area.name],
        },
      });
    }
  });

  return locations;
}

const mockLocations = generateMockLocations();

export default function MapViewPage() {
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
    <div className="relative h-[calc(100vh-64px)]">
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
  );
}
