"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CarouselCard } from "./CarouselCard";
import { useCarouselData } from "@/queries/main/useCarouselData";

import "swiper/css";

export function MainCarouselInner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: apiSlides = [], isLoading } = useCarouselData();

  // loop용 슬라이드 2배 복제
  const slides = useMemo(() => {
    if (apiSlides.length === 0) return [];
    const doubled = [...apiSlides, ...apiSlides];
    return doubled.map((s, i) => ({ ...s, _key: `${s.id}-${i}` }));
  }, [apiSlides]);

  const toggleAutoplay = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (isPlaying) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handlePrev = useCallback(() => {
    swiperRef.current?.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    swiperRef.current?.slideNext();
  }, []);

  const goToSlide = useCallback((index: number) => {
    swiperRef.current?.slideToLoop(index);
  }, []);

  if (isLoading || apiSlides.length === 0) {
    return (
      <section className="relative flex h-[604px] w-full items-center justify-center bg-[#1a1a1a]">
        <div className="animate-pulse text-white/50 text-sm">
          {isLoading ? "로딩 중..." : ""}
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
      {/* 블러 배경 */}
      <div className="absolute inset-0">
        <img
          src={apiSlides[activeIndex]?.imageUrl}
          alt=""
          className="h-full w-full scale-105 object-cover blur-xl"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 캐러셀 영역 */}
      <div className="relative flex h-[604px] flex-col justify-center">
        <Swiper
          modules={[Autoplay]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onRealIndexChange={(swiper) => {
            setActiveIndex(swiper.realIndex % apiSlides.length);
          }}
          slidesPerView="auto"
          centeredSlides
          loop
          speed={500}
          spaceBetween={16}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="main-carousel h-[512px] w-full"
        >
          {slides.map((slide, index) => {
            const realIndex = index % apiSlides.length;
            const isActive = realIndex === activeIndex;
            return (
              <SwiperSlide
                key={slide._key}
                className="flex w-[260px] items-center px-2 md:w-[320px]"
              >
                <CarouselCard
                  data={slide}
                  isActive={isActive}
                  onClick={() => goToSlide(realIndex)}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* 좌우 화살표 */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label="다음 슬라이드"
        >
          <ChevronRight size={24} />
        </button>

        {/* 하단 페이지네이션 */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {apiSlides.map((slide, index) => (
            <button
              type="button"
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={`main-carousel-bullet ${
                index === activeIndex
                  ? "main-carousel-bullet-active"
                  : ""
              }`}
              aria-label={`슬라이드 ${index + 1}`}
            />
          ))}
        </div>

        {/* 재생/일시정지 버튼 */}
        <button
          type="button"
          onClick={toggleAutoplay}
          className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          aria-label={isPlaying ? "일시정지" : "재생"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </section>
  );
}
