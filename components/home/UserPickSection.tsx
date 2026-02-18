"use client";

import { useMemo } from "react";
import { cn, getNickname } from "@/lib/utils";
import { PickCard } from "@/components/common/PickCard";
import { EmptyState } from "@/components/common/404/EmptyState";
import { useAddFavorite } from "@/queries/settings/useUserTaste";
import { useLikedIds } from "@/queries/favorite";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import type { MainCuration } from "@/types/main";
import type { EventType } from "@/types/user";

interface UserPickSectionProps {
  className?: string;
  curations?: MainCuration[];
}

export function UserPickSection({
  className,
  curations = [],
}: UserPickSectionProps) {
  const { isAuthenticated } = useAuthStore();
  const nickname = useMemo(() => getNickname(), []);
  const { mutate: addToFavorites } = useAddFavorite();
  const likedIds = useLikedIds();

  const requiresLogin = !isAuthenticated;

  // curations를 반으로 나눠서 왼쪽(팝업), 오른쪽(전시)에 배치
  const mid = Math.ceil(curations.length / 2);
  const popupCards = curations.slice(0, Math.min(mid, 3));
  const exhibitionCards = curations.slice(mid, mid + 3);

  const handleLikeClick = (id: number) => {
    const curation = curations.find((c) => c.id === id);
    if (!curation) return;
    addToFavorites({
      curationId: id,
      curationType: curation.type as EventType,
    });
  };

  const displayTitle = nickname ? (
    <>
      {nickname}님을 위한 PICK!
    </>
  ) : (
    "나를 위한 맞춤 PICK!"
  );

  if (requiresLogin) {
    return (
      <section className={cn("", className)}>
        <div className="mb-[24px]">
          <p className="mb-1 text-[14px] font-normal leading-[180%] text-orange">
            로그인하면 취향에 맞는 행사를 추천해드려요
          </p>
          <h2 className="text-heading-large">
            나를 위한 맞춤 PICK!
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-orange p-6">
          <div className="pointer-events-none blur-md">
            <div className="grid grid-cols-2 gap-4">
              {/* 빈 플레이스홀더 */}
              <div className="h-[200px] rounded-xl bg-muted" />
              <div className="h-[200px] rounded-xl bg-muted" />
            </div>
          </div>
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Link
              href="/auth/login"
              className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110"
            >
              로그인하고 맞춤 추천 받기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (curations.length === 0) {
    return (
      <section className={cn("", className)}>
        <div className="mb-[24px]">
          <p className="mb-1 text-[14px] font-normal leading-[180%] text-orange">
            취향을 분석해 딱 맞는 행사를 찾았어요
          </p>
          <h2 className="text-heading-large">{displayTitle}</h2>
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
      <div className="mb-[24px] text-center">
        <h2 className="text-[32px] font-semibold text-[#202937]">
          {nickname ?? "나"}님을 위한 PICK!
        </h2>
      </div>

      {/* 2컬럼 레이아웃 */}
      <div className="grid grid-cols-2 gap-5">
        {/* 왼쪽: 팝업 */}
        <div className="flex flex-col gap-4">
          {/* 배너 */}
          <div
            className="relative flex h-[250px] items-end overflow-hidden rounded-xl bg-cover bg-center p-5"
            style={{
              backgroundImage: "url(/images/main/popupBg.png)",
            }}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white">
                팝업
              </h3>
              <p className="mt-1 text-sm text-white/80">
                일상에 환기를 불어넣는 톡톡튀는 문화생활, 지금 경험해봐요!
              </p>
            </div>
          </div>

          {/* 카드 리스트 */}
          <div className="flex flex-col gap-3">
            {popupCards.map((curation) => (
              <PickCard
                key={curation.id}
                curation={curation}
                isLiked={likedIds.has(String(curation.id))}
                onLikeClick={handleLikeClick}
                className="w-full"
              />
            ))}
          </div>
        </div>

        {/* 오른쪽: 전시 */}
        <div className="flex flex-col gap-4">
          {/* 배너 */}
          <div
            className="relative flex h-[250px] items-end overflow-hidden rounded-xl bg-cover bg-center p-5"
            style={{
              backgroundImage:
                "url(/images/main/exhibitionBg.png)",
            }}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white">
                전시
              </h3>
              <p className="mt-1 text-sm text-white/80">
                시야를 넓혀줄 깊이 있는 문화생활을 만나봐요!
              </p>
            </div>
          </div>

          {/* 카드 리스트 */}
          <div className="flex flex-col gap-3">
            {exhibitionCards.map((curation) => (
              <PickCard
                key={curation.id}
                curation={curation}
                isLiked={likedIds.has(String(curation.id))}
                onLikeClick={handleLikeClick}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
