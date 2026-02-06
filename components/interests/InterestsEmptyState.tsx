/**
 * Interests Empty State - 빈 상태 컴포넌트 (Figma 스펙)
 *
 * Figma 스펙:
 * - Spot: 882×319px
 * - Carousel: 930×404px
 * - Text: 18px, Pretendard, 400, 180% line-height, #4B5462
 * - Nickname: #F36012
 * - Button: 40px, padding 0 24px, #F36012
 * - Gap: 44px
 */

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InterestsEmptyStateProps {
  /** 표시할 메시지 (닉네임 포함 가능) */
  message: string;
  /** 닉네임 (주황색으로 강조) */
  nickname?: string;
  /** 버튼 클릭 시 이동할 경로 */
  href?: string;
  /** 버튼 텍스트 */
  buttonText?: string;
  /** 컨테이너 너비 (기본: 882px) */
  width?: string;
  /** 컨테이너 높이 (기본: 319px) */
  height?: string;
}

/**
 * 빈 상태 컴포넌트 (Figma 스펙)
 *
 * @example
 * ```tsx
 * <InterestsEmptyState
 *   message="아직 {nickname}님의 취향을 파악 중이에요"
 *   nickname="소심한꿀주먹이"
 *   href="/search"
 *   buttonText="전체보기"
 * />
 * ```
 */
export function InterestsEmptyState({
  message,
  nickname,
  href = "/search",
  buttonText = "전체보기",
  width = "882px",
  height = "319px",
}: InterestsEmptyStateProps) {
  // 메시지를 닉네임 기준으로 분리
  const renderMessage = () => {
    if (!nickname) {
      return (
        <span
          style={{
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "180%",
            color: "#4B5462",
          }}
        >
          {message}
        </span>
      );
    }

    const parts = message.split("{nickname}");
    return (
      <>
        <span
          style={{
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "180%",
            color: "#4B5462",
          }}
        >
          {parts[0]}
        </span>
        <span
          style={{
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "180%",
            color: "#F36012",
          }}
        >
          {nickname}
        </span>
        <span
          style={{
            fontFamily: "Pretendard",
            fontSize: "18px",
            fontWeight: 400,
            lineHeight: "180%",
            color: "#4B5462",
          }}
        >
          {parts[1]}
        </span>
      </>
    );
  };

  return (
    <div
      className="interests-empty-state flex flex-col items-center justify-center"
      style={{
        width,
        height,
        gap: "44px",
      }}
    >
      {/* 메시지 텍스트 */}
      <div
        className="interests-empty-state__text flex items-end justify-center"
        style={{ gap: "4px" }}
      >
        {renderMessage()}
      </div>

      {/* 전체보기 버튼 */}
      <Link
        href={href}
        className="interests-empty-state__button flex items-center justify-center"
        style={{
          height: "40px",
          padding: "0 24px",
          gap: "8px",
          backgroundColor: "#F36012",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "Pretendard",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "140%",
            color: "#FFFFFF",
          }}
        >
          {buttonText}
        </span>
        <ArrowRight
          style={{
            width: "16px",
            height: "16px",
            color: "#FFFFFF",
            strokeWidth: 1.5,
          }}
        />
      </Link>
    </div>
  );
}
