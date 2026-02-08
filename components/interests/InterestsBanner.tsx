/**
 * Interests Banner - 온보딩 배너 (Figma 스펙)
 *
 * Figma 스펙:
 * - 457×168px, border-radius 12px
 * - 그라데이션 배경
 * - 좌상단 제목 (18px, #FFFFFF)
 * - padding 22px
 *
 * @refactored
 * - Design Tokens 적용
 * - 그라데이션 중앙 관리
 */

"use client";

import Link from "next/link";
import { INTERESTS_DESIGN_TOKENS as TOKENS } from "./constants";

interface InterestsBannerProps {
  title: string;
  href: string;
  imageUrl: string;
}

/**
 * 온보딩 배너 (Figma 스펙)
 *
 * @description
 * - 457×168px, border-radius 12px
 * - 배경 이미지 사용
 * - 좌상단 제목 (18px, #FFFFFF)
 *
 * @example
 * ```tsx
 * <InterestsBanner
 *   title="추천 지역 변경하기"
 *   href="/settings"
 *   imageUrl="/images/interests-region-banner.png"
 * />
 * ```
 */
export function InterestsBanner({ title, href, imageUrl }: InterestsBannerProps) {
  const { bannerTitle } = TOKENS.typography;

  return (
    <Link
      href={href}
      className="interests-banner relative flex flex-1 cursor-pointer items-start overflow-hidden transition-transform hover:scale-[1.02]"
      style={{
        height: TOKENS.sizing.banner.height,
        padding: "22px",
        borderRadius: TOKENS.borderRadius.banner,
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      aria-label={title}
    >
      <span
        style={{
          fontFamily: bannerTitle.family,
          fontSize: bannerTitle.size,
          fontWeight: bannerTitle.weight,
          lineHeight: bannerTitle.lineHeight,
          letterSpacing: bannerTitle.letterSpacing,
          color: bannerTitle.color,
        }}
      >
        {title}
      </span>
    </Link>
  );
}
