/**
 * HOT EVENT 빈 상태 컴포넌트
 *
 * - no-date: 날짜 선택 안 됨 (일반 메시지)
 * - no-events: 날짜 선택됨 + 이벤트 없음 (스위프 캐릭터)
 */

"use client";

import React from "react";
import Image from "next/image";

interface EmptyStateProps {
  /** 빈 상태 타입 */
  type: "no-date" | "no-events";
}

/**
 * HOT EVENT 빈 상태 컴포넌트
 *
 * @example
 * ```tsx
 * <EmptyState type="no-events" />
 * ```
 */
export function EmptyState({ type }: EmptyStateProps) {
  if (type === "no-date") {
    return (
      <div className="empty-state py-12 text-center text-gray-500">
        <p>이벤트를 불러오는 중...</p>
      </div>
    );
  }

  // type === "no-events"
  return (
    <div className="empty-state-with-character relative flex flex-col items-center justify-center py-20">
      {/* 주황색 radial gradient 빛 효과 (Figma Ellipse 149) */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "319px",
          height: "106px",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(58.33% 58.33% at 50% 50%, #F36012 0%, rgba(255, 255, 255, 0) 100%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* 스위프 캐릭터 (Figma: 211px × 292px) */}
      <div className="relative z-10 mb-6">
        <Image
          src="/images/swyp-character.png"
          alt=""
          width={211}
          height={292}
          priority
        />
      </div>

      {/* 메시지 */}
      <p className="relative z-10 text-lg font-medium text-gray-600">
        선택하신 조건에 맞는 행사가 없어요!
      </p>
    </div>
  );
}
