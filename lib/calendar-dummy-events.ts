import type { Event } from "@/types/event";
import type { IsoDate } from "@/types/calendar";

/**
 * 날짜별 더미 이벤트 생성
 */
export function generateEventsByDate(date: IsoDate): Event[] {
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
