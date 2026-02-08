import Image from "next/image";

export interface CarouselCardData {
  id: number;
  imageUrl: string;
  subtitle: string;
  title: string;
  period: string;
}

interface CarouselCardProps {
  data: CarouselCardData;
  isActive?: boolean;
  onClick?: () => void;
}

export function CarouselCard({ data, isActive = false, onClick }: CarouselCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (!isActive && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative block h-full w-full overflow-hidden rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
      aria-label={`${data.title} 슬라이드`}
    >
      <Image
        src={data.imageUrl}
        alt={data.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 70vw, 410px"
      />

      {/* 하단 그라데이션 + 텍스트 오버레이 */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 text-white">
        <span className="text-caption-medium block opacity-80">
          {data.subtitle}
        </span>
        <span className="text-body-small-bold mt-0.5 block line-clamp-1">
          {data.title}
        </span>
        <span className="text-caption-medium mt-0.5 block opacity-60">
          {data.period}
        </span>
      </div>
    </button>
  );
}
