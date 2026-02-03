import type { Event } from "@/types/event";
import type { IsoDate } from "@/types/calendar";

/**
 * 날짜별 더미 이벤트 생성
 */
export function generateEventsByDate(date: IsoDate): Event[] {
  // 행사가 없는 날짜 정의 (테스트용)
  const emptyDates = [
    "2026-02-05", // 2월 5일
    "2026-02-15", // 2월 15일
    "2026-02-25", // 2월 25일
  ];

  // 해당 날짜는 빈 배열 반환
  if (emptyDates.includes(date)) {
    return [];
  }

  // 날짜 기반 시드 생성 (일관된 랜덤 결과)
  const seed = date.split("-").join("");
  const random = (max: number, offset = 0) =>
    ((parseInt(seed) + offset) % max) + 1;

  const count = random(15, 5) + 5; // 5~20개
  const events: Event[] = [];

  for (let i = 0; i < count; i++) {
    const isExhibition = i % 2 === 0;
    events.push({
      id: `${date}-event-${i + 1}`,
      title: isExhibition
        ? `전시회 - ${date} 이벤트 ${i + 1}`
        : `팝업 - ${date} 이벤트 ${i + 1}`,
      category: isExhibition ? "전시" : "팝업",
      period: `${date} - ${date}`,
      imageUrl: `https://picsum.photos/seed/${date}-${i}/400/500`,
      viewCount: random(100000, i * 100),
      likeCount: random(50000, i * 50),
      isLiked: i % 7 === 0,
    });
  }

  return events;
}

/**
 * 인기 이벤트 더미 데이터 생성
 * (날짜 선택 안 됐을 때 HOT EVENT용)
 *
 * @param count - 생성할 이벤트 개수 (기본: 24개)
 * @returns 인기순으로 정렬된 이벤트 배열
 */
export function generatePopularEvents(count = 24): Event[] {
  const events: Event[] = [];

  for (let i = 0; i < count; i++) {
    const isExhibition = i % 2 === 0;
    const baseViewCount = 100000;
    const baseLikeCount = 50000;

    events.push({
      id: `popular-event-${i + 1}`,
      title: isExhibition ? `인기 전시회 ${i + 1}` : `인기 팝업스토어 ${i + 1}`,
      category: isExhibition ? "전시" : "팝업",
      period: "2026.01.01 - 2026.12.31",
      imageUrl: `https://picsum.photos/seed/popular-${i}/400/500`,
      // 인기순 정렬을 위해 내림차순
      viewCount: baseViewCount - i * 1000,
      likeCount: baseLikeCount - i * 500,
      isLiked: i % 5 === 0,
    });
  }

  return events;
}
