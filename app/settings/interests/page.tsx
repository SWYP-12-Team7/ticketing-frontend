/**
 * Interests Settings Page - 나의 취향 설정 (Figma 스펙 완전 준수)
 *
 * @description
 * - 930px width, 1836px height (전체)
 * - Hero 섹션: 제목 + 배너 2개
 * - Spot 섹션: 취향 저격 신규 스팟 (칩 필터 + 카드)
 * - Carousel 섹션: 찜한/다시보기 캐러셀
 *
 * Figma 스펙:
 * - 섹션 간격: 64px (Hero-Spot), 88px (Spot-Carousel)
 * - Hero 내부 간격: 32px
 * - 배너 간격: 16px
 */

"use client";

import {
  InterestsBanner,
  InterestsSpotSection,
  InterestsCarouselSection,
  INTERESTS_BANNERS,
  INTERESTS_DESIGN_TOKENS as TOKENS,
} from "@/components/interests";
import { useUserTaste } from "@/queries/settings";
import { useAuthStore } from "@/store/auth";
import { mapTasteEventsToEvents } from "@/lib/taste-helpers";

/**
 * 나의 취향 설정 메인 페이지 (Figma 스펙)
 *
 * @example
 * Route: /settings/interests
 * Layout: SettingsLayout (SNB + Content)
 */
export default function InterestsSettingsPage() {
  const { heroTitle } = TOKENS.typography;
  const { heroGap, bannerGap } = TOKENS.spacing;
  
  const user = useAuthStore((s) => s.user);
  const { data: tasteData } = useUserTaste();
  
  const userNickname = user?.nickname ?? "사용자";
  const recommendations = tasteData?.recommendations ?? [];

  return (
    <article
      className="interests-settings-page flex flex-col"
      style={{
        width: TOKENS.sizing.pageWidth,
        gap: "64px", // Figma: Hero와 Spot 사이 간격
      }}
    >
      {/* ========== 1. Hero Section - 제목 + 배너 ========== */}
      <section
        className="interests-hero-section flex flex-col"
        style={{ gap: heroGap }}
        aria-labelledby="interests-hero-title"
      >
        {/* 제목 - Figma: 32px, 첫 줄 #F36012, 둘째 줄 #111928 */}
        <h1
          id="interests-hero-title"
          className="interests-hero-section__title"
          style={{
            fontFamily: heroTitle.family,
            fontSize: heroTitle.size,
            fontWeight: heroTitle.weight,
            lineHeight: heroTitle.lineHeight,
          }}
        >
          <span style={{ color: heroTitle.color }}>
            내 취향에 맞는 팝업･전시만
          </span>
          <br />
          <span style={{ color: "#111928" }}>
            골라 보고 싶다면 설정해 보세요
          </span>
        </h1>

        {/* 배너 2개 - Figma: gap 16px */}
        <div
          className="interests-hero-section__banners flex"
          style={{ gap: bannerGap }}
        >
          {INTERESTS_BANNERS.map((banner) => (
            <InterestsBanner
              key={banner.id}
              title={banner.title}
              href={banner.href}
              imageUrl={banner.imageUrl}
            />
          ))}
        </div>
      </section>

      {/* ========== 2. Spot Section - 취향 저격 신규 스팟 ========== */}
      <InterestsSpotSection 
        nickname={userNickname}
        events={mapTasteEventsToEvents(recommendations)}
      />

      {/* ========== 3. Carousel Section - 찜한/다시보기 ========== */}
      <InterestsCarouselSection />
    </article>
  );
}
