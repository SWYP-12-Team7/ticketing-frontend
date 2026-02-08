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
      {/* 빈 상태 아이콘 (돋보기 + 위치 핀, 크기: 211px × 292px) */}
      <div className="relative z-10 mb-6">
        <Image
          src="/images/404/emptyImg2.png"
          alt="검색 결과 없음"
          width={211}
          height={292}
          priority
        />
      </div>

      {/* 메시지 (Figma spec) */}
      <p
        className="relative z-10 flex items-end"
        style={{
          width: "257px",
          height: "32px",
          fontFamily: "Pretendard Variable",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "18px",
          lineHeight: "180%",
          textAlign: "center",
          color: "#4B5462",
        }}
      >
        선택하신 조건에 맞는 행사가 없어요!
      </p>
    </div>
  );
}
