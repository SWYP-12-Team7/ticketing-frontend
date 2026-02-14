"use client";

import { cn, getNickname } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { OverlayEventCard } from "@/components/common";
import { EmptyState } from "@/components/common/404/EmptyState";
import { useAddFavorite } from "@/queries/settings/useUserTaste";
import type { Event } from "@/types/event";
import type { EventType } from "@/types/user";

import "swiper/css";

interface ShowPickProps {
  className?: string;
  title: ReactNode;
  subtitle?: string;
  subtitleType?: "orange" | "gray";
  useNickname?: boolean;
  events?: Event[];
}

// 임시 목데이터
const mockEvents: Event[] = [
  {
    id: "1",
    title: "현대미술 컬렉션: 새로운 시선",
    category: "마이아트뮤지엄",
    location: "서울 코엑스",
    period: "2024.01.20 - 2024.03.20",
    imageUrl: "https://picsum.photos/400/300?random=11",
    likeCount: 18353,
    viewCount: 2444,
    tags: ["전시", "현대미술"],
    openDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    originalPrice: 65000,
    discountRate: 20,
    discountPrice: 58000,
  },
  {
    id: "2",
    title: "빛의 축제: 미디어아트전",
    category: "아트센터나비",
    location: "서울 강남구",
    period: "2024.02.01 - 2024.04.15",
    imageUrl: "https://picsum.photos/400/300?random=12",
    likeCount: 15200,
    viewCount: 1980,
    tags: ["전시", "미디어아트"],
    openDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    originalPrice: 50000,
    discountRate: 15,
    discountPrice: 42500,
  },
  {
    id: "3",
    title: "서울 재즈 페스티벌 2024",
    category: "문화행사",
    location: "올림픽공원",
    period: "2024.03.10 - 2024.03.12",
    imageUrl: "https://picsum.photos/400/300?random=13",
    likeCount: 22100,
    viewCount: 3120,
    tags: ["공연", "재즈"],
    openDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    originalPrice: 80000,
    discountRate: 10,
    discountPrice: 72000,
  },
  {
    id: "4",
    title: "모네에서 앤디워홀까지",
    category: "국립현대미술관",
    location: "서울 종로구",
    period: "2024.01.15 - 2024.05.30",
    imageUrl: "https://picsum.photos/400/300?random=14",
    likeCount: 31400,
    viewCount: 4250,
    tags: ["전시", "인상파"],
    openDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    originalPrice: 70000,
    discountRate: 25,
    discountPrice: 52500,
  },
  {
    id: "5",
    title: "디지털 아트 서울 2024",
    category: "DDP",
    location: "동대문디자인플라자",
    period: "2024.02.20 - 2024.03.31",
    imageUrl: "https://picsum.photos/400/300?random=15",
    likeCount: 19800,
    viewCount: 2650,
    tags: ["전시", "디지털아트"],
    openDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    originalPrice: 55000,
    discountRate: 30,
    discountPrice: 38500,
  },
  {
    id: "6",
    title: "한국 전통공예 특별전",
    category: "국립중앙박물관",
    location: "서울 용산구",
    period: "2024.03.01 - 2024.06.30",
    imageUrl: "https://picsum.photos/400/300?random=16",
    likeCount: 13500,
    viewCount: 1820,
    tags: ["전시", "전통공예"],
    openDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
    originalPrice: 45000,
    discountRate: 0,
    discountPrice: 45000,
  },
  {
    id: "7",
    title: "팝업스토어: 디올 2024",
    category: "팝업",
    location: "성수동",
    period: "2024.02.10 - 2024.02.28",
    imageUrl: "https://picsum.photos/400/300?random=17",
    likeCount: 28900,
    viewCount: 3890,
    tags: ["팝업", "패션"],
    openDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    originalPrice: 0,
    discountRate: 0,
    discountPrice: 0,
  },
  {
    id: "8",
    title: "사진전: 시간의 기록",
    category: "갤러리",
    location: "서울 마포구",
    period: "2024.01.25 - 2024.04.20",
    imageUrl: "https://picsum.photos/400/300?random=18",
    likeCount: 11200,
    viewCount: 1450,
    tags: ["전시", "사진"],
    openDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    originalPrice: 40000,
    discountRate: 20,
    discountPrice: 32000,
  },
  {
    id: "9",
    title: "반 고흐 몰입형 전시",
    category: "아트센터",
    location: "서울 강남구",
    period: "2024.02.15 - 2024.05.15",
    imageUrl: "https://picsum.photos/400/300?random=19",
    likeCount: 35600,
    viewCount: 5120,
    tags: ["전시", "몰입형"],
    openDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    originalPrice: 75000,
    discountRate: 15,
    discountPrice: 63750,
  },
  {
    id: "10",
    title: "클래식 음악회: 베토벤 교향곡",
    category: "공연",
    location: "예술의전당",
    period: "2024.03.05 - 2024.03.05",
    imageUrl: "https://picsum.photos/400/300?random=20",
    likeCount: 17800,
    viewCount: 2340,
    tags: ["공연", "클래식"],
    openDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    originalPrice: 90000,
    discountRate: 10,
    discountPrice: 81000,
  },
];

export function ShowPick({
  className,
  title,
  subtitle,
  subtitleType = "gray",
  useNickname = false,
  events,
}: ShowPickProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const nickname = useMemo(
    () => (useNickname ? getNickname() : null),
    [useNickname]
  );

  const displayTitle =
    useNickname && nickname ? (
      <>
        {nickname}
        {title}
      </>
    ) : (
      title
    );

  const displayEvents = events || mockEvents;
  const { mutate: addToFavorites } = useAddFavorite();

  const handleLikeClick = (id: string) => {
    const event = displayEvents.find((e) => e.id === id);
    if (!event) return;
    const curationType = (event.type ?? (event.category === "전시" ? "EXHIBITION" : "POPUP")) as EventType;
    addToFavorites({ curationId: Number(id), curationType });
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  if (!displayEvents || displayEvents.length === 0) {
    return (
      <section className={cn("", className)}>
        <div className="mb-[24px]">
          {subtitle && (
            <p className={cn(
              "mb-1 text-[14px] font-normal leading-[180%]",
              subtitleType === "orange" ? "text-orange" : "text-[#6C7180]"
            )}>
              {subtitle}
            </p>
          )}
          <h2 className="text-heading-large">{displayTitle}</h2>
        </div>
        <div className="h-[404px] rounded-xl border border-orange">
          <EmptyState message="등록된 행사가 없습니다" className="h-full" />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("", className)}>
      {/* 헤더 */}
      <div className="mb-[24px] flex items-center justify-between">
        <div>
          {subtitle && (
            <p className={cn(
              "mb-1 text-[14px] font-normal leading-[180%]",
              subtitleType === "orange" ? "text-orange" : "text-[#6C7180]"
            )}>
              {subtitle}
            </p>
          )}
          <h2 className="text-heading-large">{displayTitle}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNext}
            className="flex size-8 items-center justify-center rounded-full border border-border bg-[#BBBBBB]/73 text-[#404040] transition-colors hover:brightness-110"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView="auto"
        slidesPerGroup={4}
        spaceBetween={24}
        loop
        speed={500}
        breakpoints={{
          0: {
            slidesPerGroup: 2,
          },
          1024: {
            slidesPerGroup: 4,
          },
        }}
      >
        {displayEvents.map((event) => (
          <SwiperSlide key={event.id} style={{ width: "302px" }}>
            <OverlayEventCard event={event} onLikeClick={handleLikeClick} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
