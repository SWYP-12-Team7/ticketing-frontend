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
    name: "Generic Metal Pizza",
    category: "카페",
    location: "성수동",
    imageUrl: "/images/mockImg.png",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Generic Metal Pizza",
    category: "식당",
    location: "성수동",
    imageUrl: "/images/mockImg.png",
    rating: 4.3,
  },
  {
    id: "3",
    name: "Generic Metal Pizza",
    category: "카페",
    location: "성수동",
    imageUrl: "/images/mockImg.png",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Generic Metal Pizza",
    category: "식당",
    location: "성수동",
    imageUrl: "/images/mockImg.png",
    rating: 4.2,
  },
  {
    id: "5",
    name: "Generic Metal Pizza",
    category: "카페",
    location: "성수동",
    imageUrl: "/images/mockImg.png",
    rating: 4.6,
  },
];

export function NearbyPlaces({ className, places }: NearbyPlacesProps) {
  const [startIndex, setStartIndex] = useState(0);
  const displayPlaces = places || mockPlaces;
  const visibleCount = 5;
  const maxIndex = Math.max(0, displayPlaces.length - visibleCount);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex((prev) => Math.min(maxIndex, prev + 1));

  const visiblePlaces = displayPlaces.slice(startIndex, startIndex + visibleCount);

  return (
    <section className={cn("border-t border-border py-10", className)}>
      <div className="mx-auto max-w-[1200px] px-5">
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
              <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={place.imageUrl}
                  alt={place.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
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
