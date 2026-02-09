"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Place {
  id: string;
  name: string;
  category: string;
  location: string;
  imageUrl: string;
  rating?: number;
}

interface NearbyPlacesProps {
  className?: string;
  places?: Place[];
}

// 임시 목데이터
const mockPlaces: Place[] = [
  {
    id: "1",
    name: "카페 온도",
    category: "카페",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/cafe1/400/400",
    rating: 4.5,
  },
  {
    id: "2",
    name: "스시 오마카세",
    category: "일식",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/sushi/400/400",
    rating: 4.3,
  },
  {
    id: "3",
    name: "브런치 가든",
    category: "브런치",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/brunch/400/400",
    rating: 4.7,
  },
  {
    id: "4",
    name: "파스타 공방",
    category: "양식",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/pasta/400/400",
    rating: 4.2,
  },
  {
    id: "5",
    name: "로스터리 커피",
    category: "카페",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/coffee/400/400",
    rating: 4.6,
  },
  {
    id: "6",
    name: "한정식 담",
    category: "한식",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/korean/400/400",
    rating: 4.6,
  },
  {
    id: "7",
    name: "디저트 라운지",
    category: "디저트",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/dessert/400/400",
    rating: 4.6,
  },
  {
    id: "8",
    name: "피자 팩토리",
    category: "양식",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/pizza/400/400",
    rating: 4.6,
  },
  {
    id: "9",
    name: "라멘 하우스",
    category: "일식",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/ramen/400/400",
    rating: 4.6,
  },
  {
    id: "10",
    name: "베이커리 숲",
    category: "베이커리",
    location: "성수동",
    imageUrl: "https://picsum.photos/seed/bakery/400/400",
    rating: 4.6,
  },
];

export function NearbyPlaces({ className, places }: NearbyPlacesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const fallbackImage = "/images/404/emptyImg2.png";
  const displayPlaces = places || mockPlaces;
  const visibleCount = 5;
  const maxIndex = Math.max(0, displayPlaces.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visiblePlaces = displayPlaces.slice(startIndex, startIndex + visibleCount);

  return (
    <section className={cn("border-t border-border py-10", className)}>
      <div className="mx-auto max-w-300 px-5">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            주변 인기 카페·식당이 확인해세요
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {startIndex + 1} / {displayPlaces.length}
            </span>
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= maxIndex}
              className="flex size-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* 카드 리스트 */}
        <div className="grid grid-cols-5 gap-4">
          {visiblePlaces.map((place) => (
            <Link
              key={place.id}
              href={`/place/${place.id}`}
              className="group"
            >
              {/* 이미지 */}
              <div className="relative mb-3 h-64.5 w-48.25 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={place.imageUrl || fallbackImage}
                  alt={place.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== fallbackImage) {
                      target.src = fallbackImage;
                      target.srcset = "";
                    }
                  }}
                />
              </div>

              {/* 정보 */}
              <h3 className="mb-1 truncate text-sm font-medium text-foreground group-hover:underline">
                {place.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span>{place.location}</span>
                <span>·</span>
                <span>{place.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
