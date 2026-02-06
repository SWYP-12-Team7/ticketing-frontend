"use client";

import { useState, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectCoverflow,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

import "swiper/swiper-bundle.css";

interface CarouselSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  period?: string;
  link?: string;
}

interface MainCarouselProps {
  className?: string;
  slides?: CarouselSlide[];
}

export function MainCarousel({ className, slides }: MainCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  const defaultSlides: CarouselSlide[] = [
    {
      id: "1",
      imageUrl: "https://picsum.photos/id/1011/600/800",
      title: "SEJONG SEASON 세종시즌",
      subtitle: "예술의전당 클래식 음악의 전당",
      period: "2026.02.10 - 2026.02.28",
    },
    {
      id: "2",
      imageUrl: "https://picsum.photos/id/1015/600/800",
      title: "뮤지컬 <보니 앤 클라이드>",
      subtitle: "남산예술센터 뮤지컬",
      period: "2026.03.01 - 2026.03.31",
    },
    {
      id: "3",
      imageUrl: "https://picsum.photos/id/1025/600/800",
      title: "이번 공연 어때?",
      subtitle: "인기 PICK 추천 공연!",
      period: "2026.02.15 - 2026.03.15",
    },
    {
      id: "4",
      imageUrl: "https://picsum.photos/id/1035/600/800",
      title: "ROLLING 31ST ANNIVERSARY",
      subtitle: "31주년 기념 공연 예매 중",
      period: "2026.04.05 - 2026.04.20",
    },
    {
      id: "5",
      imageUrl: "https://picsum.photos/id/1043/600/800",
      title: "뮤지컬아이프",
      subtitle: "멜로디션 뮤지컬 아이프",
      period: "2026.02.22 - 2026.03.05",
    },
    {
      id: "6",
      imageUrl: "https://picsum.photos/id/1050/600/800",
      title: "NIKE ORC",
      subtitle: "나이키 오알씨",
      period: "2026.03.10 - 2026.03.30",
    },
    {
      id: "7",
      imageUrl: "https://picsum.photos/id/1062/600/800",
      title: "배너 7",
      subtitle: "서브타이틀",
      period: "2026.02.08 - 2026.02.18",
    },
  ];

  const displaySlides = slides || defaultSlides;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const toggleAutoplay = useCallback(() => {
    if (!swiperRef.current) return;
    if (isPlaying) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  return (
    <section
      className={cn(
        "relative h-[520px] w-full overflow-hidden md:h-[600px]",
        className
      )}
    >
      {/* 블러 배경 */}
      <div className="absolute inset-0">
        <Image
          src={displaySlides[activeIndex].imageUrl}
          alt=""
          fill
          className="scale-105 object-cover blur-xl transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "main-carousel-bullet",
          bulletActiveClass: "main-carousel-bullet-active",
          el: ".main-carousel-pagination",
        }}
        navigation={{
          prevEl: ".main-carousel-prev",
          nextEl: ".main-carousel-next",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        className="relative z-10 flex h-full items-center"
      >
        {displaySlides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="w-[280px]! md:w-[320px]!"
          >
            <div className="flex h-full items-center justify-center">
              <div className="w-full overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="relative aspect-3/4">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {/* subtitle */}
                  <p className="absolute bottom-16 left-4 text-xs text-white/80">
                    {slide.subtitle || ""}
                  </p>
                  {/* title */}
                  <h3 className="absolute bottom-10 left-4 right-4 truncate text-sm font-bold text-white">
                    {slide.title}
                  </h3>
                  {/* period */}
                  {slide.period && (
                    <span className="absolute bottom-4 left-4 flex items-center gap-1 text-[10px] text-white/70">
                      {slide.period}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 좌우 화살표 */}
      <button
        className="main-carousel-prev absolute left-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 backdrop-blur transition-colors hover:bg-white/50"
      >
        <ChevronLeft className="size-5 text-white" />
      </button>
      <button
        className="main-carousel-next absolute right-4 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 backdrop-blur transition-colors hover:bg-white/50"
      >
        <ChevronRight className="size-5 text-white" />
      </button>

      {/* 하단 컨트롤: 도트 */}
      <div
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
      >
        {/* 도트 인디케이터 */}
        <div className="main-carousel-pagination flex gap-1.5" />
      </div>

      {/* Play/Pause 버튼 */}
      <button
        onClick={toggleAutoplay}
        className="absolute bottom-6 right-[90px] z-20 flex size-8 items-center justify-center rounded-full bg-white/30 backdrop-blur transition-colors hover:bg-white/50"
      >
        {isPlaying ? (
          <Pause className="size-3.5 text-white" />
        ) : (
          <Play className="size-3.5 text-white" />
        )}
      </button>
    </section>
  );
}
