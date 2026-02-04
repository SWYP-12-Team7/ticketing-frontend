/**
 * Interests Spot Section - 취향 저격 신규 스팟 섹션 (Figma 스펙)
 *
 * Figma 스펙:
 * - 930×430px, padding 24px
 * - header + chip 필터 + 2개 리스트 카드
 * - gap 20px, card gap 16px
 *
 * @refactored
 * - 커스텀 훅으로 비즈니스 로직 분리 (useInterestsSpot)
 * - Mock 데이터 분리 (interests.mock.ts)
 * - Design Tokens 적용
 */

"use client";

import { InterestsChip } from "./InterestsChip";
import { EventListCard } from "@/components/common/EventListCard";
import { useInterestsSpot } from "@/hooks";
import { INTERESTS_DESIGN_TOKENS as TOKENS } from "./constants";
import type { Event } from "@/types/event";

interface InterestsSpotSectionProps {
  events?: Event[];
}

/**
 * 취향 저격 신규 스팟 섹션 (Figma 스펙)
 *
 * @description
 * - 930×430px, padding 24px
 * - header + chip 필터 + 2개 리스트 카드
 * - gap 20px, card gap 16px
 *
 * @example
 * ```tsx
 * <InterestsSpotSection events={spotEvents} />
 * ```
 */
export function InterestsSpotSection({ events }: InterestsSpotSectionProps) {
  // 커스텀 훅으로 비즈니스 로직 분리
  const { selectedChipIndex, filteredEvents, handleChipClick, chipLabels } =
    useInterestsSpot(events);

  const { sectionTitle } = TOKENS.typography;

  return (
    <section
      className="interests-spot-section flex flex-col items-start bg-white"
      style={{
        width: TOKENS.sizing.spot.width,
        padding: "24px",
        gap: TOKENS.spacing.spotInnerGap,
        borderRadius: TOKENS.borderRadius.spot,
        border: `1px solid ${TOKENS.colors.border}`,
        boxShadow: TOKENS.shadow.spot,
      }}
      aria-labelledby="interests-spot-title"
    >
      {/* header-wrapper - Figma: padding 16px 0 */}
      <h2
        id="interests-spot-title"
        className="py-4"
        style={{
          fontFamily: sectionTitle.family,
          fontSize: sectionTitle.size,
          fontWeight: sectionTitle.weight,
          lineHeight: sectionTitle.lineHeight,
          letterSpacing: sectionTitle.letterSpacing,
          color: sectionTitle.colorPrimary,
        }}
      >
        취향 저격 신규 스팟
      </h2>

      {/* wrapper - Figma: gap 20px */}
      <div
        className="interests-spot-section__wrapper flex w-full flex-col"
        style={{ gap: TOKENS.spacing.spotInnerGap }}
      >
        {/* chips - Figma: gap 8px */}
        <div
          className="interests-spot-section__chips flex flex-wrap items-start"
          style={{ gap: TOKENS.spacing.spotChipGap }}
        >
          {chipLabels.map((label, i) => (
            <InterestsChip
              key={label}
              label={label}
              selected={selectedChipIndex === i}
              onClick={() => handleChipClick(i)}
            />
          ))}
        </div>

        {/* card-wrapper - Figma: gap 16px */}
        <div
          className="interests-spot-section__cards flex flex-row items-start"
          style={{ gap: TOKENS.spacing.spotCardGap }}
        >
          {filteredEvents.map((event) => (
            <EventListCard
              key={event.id}
              event={event}
              type={event.category === "전시" ? "exhibition" : "popup"}
              onLikeClick={(id) => console.log("Like:", id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
