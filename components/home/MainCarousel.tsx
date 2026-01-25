"use client";

interface MainCarouselProps {
  className?: string;
}

export function MainCarousel({ className }: MainCarouselProps) {
  // TODO: 캐러셀 라이브러리 적용 예정
  return (
    <section className={className}>
      <div className="h-100 w-full bg-[#767676]">
        {/* 캐러셀 라이브러리 적용 영역 */}
      </div>
    </section>
  );
}
