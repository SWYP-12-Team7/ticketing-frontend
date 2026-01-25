"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { cn } from "@/lib/utils";

import "swiper/swiper-bundle.css";

interface CarouselSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link?: string;
}

interface MainCarouselProps {
  className?: string;
  slides?: CarouselSlide[];
}

export function MainCarousel({ className, slides }: MainCarouselProps) {
  // 더미 데이터
  const defaultSlides: CarouselSlide[] = [
    {
      id: "1",
      imageUrl: "/images/mockImg.png",
      title: "SEJONG SEASON 세종시즌",
      subtitle: "예술의전당 클래식 음악의 전당",
    },
    {
      id: "2",
      imageUrl: "/images/mockImg.png",
      title: "뮤지컬 <보니 앤 클라이드>",
      subtitle: "남산예술센터 뮤지컬",
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
    },
    {
      id: "5",
      imageUrl: "/images/mockImg.png",
      title: "뮤지컬아이프",
      subtitle: "멜로디션 뮤지컬 아이프",
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

  return (
    <section className={cn("relative pt-9.5 pb-5.5 w-full", className)}>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[#00000033]" />
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        slidesPerView="auto"
        spaceBetween={24}
        className="relative z-0 w-full"
      >
        {displaySlides.map((slide) => (
          <SwiperSlide key={slide.id} className="w-auto!">
            <div className="flex flex-col">
              <div className="relative aspect-9/16 w-40 overflow-hidden bg-[#f2f2f2] md:w-48">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="w-40 px-1 pt-3 text-center md:w-48">
                <h3 className="truncate text-sm font-semibold text-black md:text-base">
                  {slide.title}
                </h3>
                {slide.subtitle && (
                  <p className="mt-1 text-xs text-black/70 md:text-sm">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
