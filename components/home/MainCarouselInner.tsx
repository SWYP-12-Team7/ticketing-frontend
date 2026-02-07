"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CarouselCard, type CarouselCardData } from "./CarouselCard";

import "swiper/css";

// 임시 목데이터 (추후 API 연동)
const MOCK_SLIDES: CarouselCardData[] = [
  {
    id: 1,
    imageUrl: "https://picsum.photos/id/1015/410/512",
    subtitle: "어제 가장 많이 봤어요!",
    title: "현대미술 컬렉션: 새로운 시선",
    period: "2024.01.20 - 2024.03.20",
  },
  {
    id: 2,
    imageUrl: "https://picsum.photos/id/1016/410/512",
    subtitle: "감성충만! 현대미술",
    title: "빛의 축제: 미디어아트전",
    period: "2024.02.01 - 2024.04.15",
  },
  {
    id: 3,
    imageUrl: "https://picsum.photos/id/1018/410/512",
    subtitle: "이번 주 인기 행사",
    title: "서울 재즈 페스티벌 2024",
    period: "2024.03.10 - 2024.03.12",
  },
  {
    id: 4,
    imageUrl: "https://picsum.photos/id/1020/410/512",
    subtitle: "새로 오픈했어요",
    title: "모네에서 앤디워홀까지",
    period: "2024.01.15 - 2024.05.30",
  },
  {
    id: 5,
    imageUrl: "https://picsum.photos/id/1024/410/512",
    subtitle: "마감 임박!",
    title: "디지털 아트 서울 2024",
    period: "2024.02.20 - 2024.03.31",
  },
];

export function MainCarouselInner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // loop용 슬라이드 2배 복제
  const slides = useMemo(() => {
    const doubled = [...MOCK_SLIDES, ...MOCK_SLIDES];
    return doubled.map((s, i) => ({ ...s, _key: `${s.id}-${i}` }));
  }, []);

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

  return (
    <section className="relative w-full overflow-hidden bg-[#1a1a1a]">
      {/* 블러 배경 */}
      <div className="absolute inset-0">
        <img
          src={MOCK_SLIDES[activeIndex]?.imageUrl}
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
            setActiveIndex(swiper.realIndex % MOCK_SLIDES.length);
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
          {slides.map((slide) => (
            <SwiperSlide
              key={slide._key}
              className="flex items-center px-2"
            >
              <CarouselCard data={slide} />
            </SwiperSlide>
          ))}
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
          {MOCK_SLIDES.map((slide, index) => (
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
