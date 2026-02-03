import type { Event } from "@/types/event";
import type { IsoDate } from "@/types/calendar";

// 서브카테고리 샘플
const SUBCATEGORIES = {
  exhibition: [
    "현대미술",
    "사진",
    "디자인",
    "조각",
    "미디어아트",
    "공예",
    "역사전시",
  ],
  popup: [
    "패션",
    "뷰티",
    "F&B",
    "캐릭터",
    "테크",
    "라이프스타일",
    "기구 & 인테리어",
  ],
};

// 지역 샘플
const REGIONS = [
  "서울 성수",
  "서울 강남",
  "서울 홍대",
  "부산 해운대",
  "부산 남포동",
];

// 가격 샘플
const PRICES = ["무료", "5,000원", "10,000원", "15,000원", "20,000원"];

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
    const subcategoryList = isExhibition
      ? SUBCATEGORIES.exhibition
      : SUBCATEGORIES.popup;

    const [year, month, day] = date.split("-");
    const endDay = String(Number(day) + 7).padStart(2, "0");

    events.push({
      id: `${date}-event-${i + 1}`,
      title: isExhibition
        ? `나이키 에어맥스 팝업 스토어 에어맥스 40주년 기념 한정판 전시 ${i + 1}`
        : `팝업스토어 - ${date} 이벤트 ${i + 1}`,
      category: isExhibition ? "전시" : "팝업",
      subcategory: subcategoryList[random(subcategoryList.length, i) - 1],
      region: REGIONS[random(REGIONS.length, i * 2) - 1],
      period: `${year.slice(2)}.${month}.${day} ~ ${year.slice(2)}.${month}.${endDay}`,
      priceDisplay: PRICES[random(PRICES.length, i * 3) - 1],
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
    const subcategoryList = isExhibition
      ? SUBCATEGORIES.exhibition
      : SUBCATEGORIES.popup;

    events.push({
      id: `popular-event-${i + 1}`,
      title: isExhibition
        ? `인기 전시회 - 나이키 에어맥스 40주년 ${i + 1}`
        : `인기 팝업스토어 ${i + 1}`,
      category: isExhibition ? "전시" : "팝업",
      subcategory: subcategoryList[i % subcategoryList.length],
      region: REGIONS[i % REGIONS.length],
      period: "26.01.01 ~ 26.12.31",
      priceDisplay: PRICES[i % PRICES.length],
      imageUrl: `https://picsum.photos/seed/popular-${i}/400/500`,
      // 인기순 정렬을 위해 내림차순
      viewCount: baseViewCount - i * 1000,
      likeCount: baseLikeCount - i * 500,
      isLiked: i % 5 === 0,
    });
  }

  return events;
}
