import type { TasteEvent, EventType } from "@/types/user";
import type { Event } from "@/types/event";

/**
 * TasteEvent → Event 변환
 * 
 * @description
 * - BE 응답을 FE Event 타입으로 변환
 * - id: number → string
 * - thumbnail → imageUrl
 * - startDate/endDate → period
 * 
 * @param tasteEvent - 백엔드 TasteEvent
 * @returns FE Event 타입
 * 
 * @example
 * const event = mapTasteEventToEvent({
 *   id: 123,
 *   type: "EXHIBITION",
 *   title: "전시회",
 *   thumbnail: "/image.jpg",
 *   region: "서울 성수",
 *   place: "성수동",
 *   startDate: "2026-02-08",
 *   endDate: "2026-03-08"
 * });
 */
export function mapTasteEventToEvent(tasteEvent: TasteEvent): Event {
  // 날짜 형식 변환: 2026-02-08 → 26.02.08
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year.slice(2)}.${month}.${day}`;
  };

  const period = `${formatDate(tasteEvent.startDate)} ~ ${formatDate(tasteEvent.endDate)}`;

  return {
    id: String(tasteEvent.id),
    title: tasteEvent.title,
    category: mapEventTypeToCategory(tasteEvent.type),
    type: tasteEvent.type,
    region: tasteEvent.region,
    location: tasteEvent.place,
    period,
    imageUrl: tasteEvent.thumbnail,
    viewCount: 0,    // BE에서 제공 안함
    likeCount: 0,    // BE에서 제공 안함
    isLiked: true,   // favorites/recentViews는 항상 true로 간주
    endDate: tasteEvent.endDate,
  };
}

/**
 * EventType → 카테고리명 변환
 * 
 * @param type - 백엔드 EventType
 * @returns 한글 카테고리명
 */
function mapEventTypeToCategory(type: EventType): string {
  const categoryMap: Record<EventType, string> = {
    EXHIBITION: "전시",
    POPUP: "팝업",
    FAIR: "페어",
  };
  return categoryMap[type] || "기타";
}

/**
 * TasteEvent 배열 → Event 배열 변환
 * 
 * @param tasteEvents - 백엔드 TasteEvent 배열
 * @returns FE Event 배열
 * 
 * @example
 * const events = mapTasteEventsToEvents(data.favorites);
 */
export function mapTasteEventsToEvents(tasteEvents: TasteEvent[]): Event[] {
  return tasteEvents.map(mapTasteEventToEvent);
}
