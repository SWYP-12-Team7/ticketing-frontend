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
  tag?: string;
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
      imageUrl: "/images/mockImg.png",
      title: "SEJONG SEASON 세종시즌",
      subtitle: "예술의전당 클래식 음악의 전당",
      tag: "클래식",
    },
    {
      id: "2",
      imageUrl: "/images/mockImg.png",
      title: "뮤지컬 <보니 앤 클라이드>",
      subtitle: "남산예술센터 뮤지컬",
      tag: "뮤지컬",
    },
    {
      id: "3",
      imageUrl: "/images/mockImg.png",
      title: "이번 공연 어때?",
      subtitle: "인기 PICK 추천 공연!",
    },
    {
      id: "4",
      imageUrl: "/images/mockImg.png",
      title: "ROLLING 31ST ANNIVERSARY",
      subtitle: "31주년 기념 공연 예매 중",
      tag: "공연",
    },
    {
      id: "5",
      imageUrl: "/images/mockImg.png",
      title: "뮤지컬아이프",
      subtitle: "멜로디션 뮤지컬 아이프",
      tag: "뮤지컬",
    },
    {
      id: "6",
      imageUrl: "/images/mockImg.png",
      title: "NIKE ORC",
      subtitle: "나이키 오알씨",
    },
    {
      id: "7",
      imageUrl: "/images/mockImg.png",
      title: "배너 7",
      subtitle: "서브타이틀",
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
          className="scale-105 object-cover blur-xl transition-all
            duration-700"
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
              <div
                className="w-full overflow-hidden rounded-xl
                  bg-white shadow-lg"
              >
                <div className="relative aspect-3/4">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-3 text-center">
                  {slide.tag && (
                    <span
                      className="mb-1 inline-block rounded-full
                        bg-orange/10 px-2 py-0.5 text-xs
                        font-medium text-orange"
                    >
                      {slide.tag}
                    </span>
                  )}
                  <h3
                    className="truncate text-sm font-semibold
                      text-basic md:text-base"
                  >
                    {slide.title}
                  </h3>
                  {slide.subtitle && (
                    <p
                      className="mt-0.5 truncate text-xs
                        text-basic/70 md:text-sm"
                    >
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 좌우 화살표 */}
      <button
        className="main-carousel-prev absolute left-4 top-1/2 z-20
          flex size-10 -translate-y-1/2 items-center justify-center
          rounded-full bg-white/30 backdrop-blur transition-colors
          hover:bg-white/50"
      >
        <ChevronLeft className="size-5 text-white" />
      </button>
      <button
        className="main-carousel-next absolute right-4 top-1/2 z-20
          flex size-10 -translate-y-1/2 items-center justify-center
          rounded-full bg-white/30 backdrop-blur transition-colors
          hover:bg-white/50"
      >
        <ChevronRight className="size-5 text-white" />
      </button>

      {/* 하단 컨트롤: 도트 */}
      <div
        className="absolute bottom-6 left-1/2 z-20 flex
          -translate-x-1/2 items-center gap-3"
      >
        {/* 도트 인디케이터 */}
        <div className="main-carousel-pagination flex gap-1.5" />
      </div>

      {/* Play/Pause 버튼 */}
      <button
        onClick={toggleAutoplay}
        className="absolute bottom-6 right-[90px] z-20 flex size-8
          items-center justify-center rounded-full bg-white/30
          backdrop-blur transition-colors hover:bg-white/50"
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
