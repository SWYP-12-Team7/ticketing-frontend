"use client";

import { cn } from "@/lib/utils";
import { PickCard } from "@/components/common/PickCard";
import { EmptyState } from "@/components/common/404/EmptyState";
import { useAddFavorite } from "@/queries/settings/useUserTaste";
import { useLikedIds } from "@/queries/favorite";
import type { MainCuration } from "@/types/main";
import type { EventType } from "@/types/user";

interface FreePickSectionProps {
  className?: string;
  curations?: MainCuration[];
}

export function FreePickSection({
  className,
  curations = [],
}: FreePickSectionProps) {
  const { mutate: addToFavorites } = useAddFavorite();
  const likedIds = useLikedIds();

  const displayCards = curations.slice(0, 6);

  const handleLikeClick = (id: number) => {
    const curation = curations.find((c) => c.id === id);
    if (!curation) return;
    addToFavorites({
      curationId: id,
      curationType: curation.type as EventType,
    });
  };

  if (displayCards.length === 0) {
    return (
      <section className={cn("", className)}>
        <div className="mb-[24px]">
          <p className="mb-1 text-[14px] font-normal leading-[180%] text-orange">
            부담 없이 가볍게 즐기는 문화 생활!
          </p>
          <h2 className="text-heading-large text-[#202937]">
            지갑 없이 즐기는 무료 행사에 참여하세요
          </h2>
        </div>
        <div className="h-[404px] rounded-xl border border-orange">
          <EmptyState
            message="등록된 행사가 없습니다"
            className="h-full"
          />
        </div>
      </section>
    );
  }

  return (
    <section className={cn("", className)}>
      {/* 헤더 */}
      <div className="mb-[24px]">
        <p className="mb-1 text-[14px] font-normal leading-[180%] text-orange">
          부담 없이 가볍게 즐기는 문화 생활!
        </p>
        <h2 className="text-heading-large text-[#202937]">
          지갑 없이 즐기는 무료 행사에 참여하세요
        </h2>
      </div>

      {/* 2x3 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {displayCards.map((curation) => (
          <PickCard
            key={curation.id}
            curation={curation}
            isLiked={likedIds.has(String(curation.id))}
            onLikeClick={handleLikeClick}
            className="w-full"
          />
        ))}
      </div>
    </section>
  );
}
