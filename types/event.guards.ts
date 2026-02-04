/**
 * Event Type Guards
 *
 * @description
 * - 런타임 타입 체크를 위한 타입 가드 함수
 * - API 응답 검증, 데이터 무결성 보장
 * - TypeScript 타입 narrowing 지원
 */

import type { Event } from "./event";

/**
 * 이벤트 객체 유효성 검증 (Type Guard)
 *
 * @param data - 검증할 데이터
 * @returns 유효한 Event 타입 여부
 *
 * @example
 * ```tsx
 * if (isValidEvent(data)) {
 *   // data는 Event 타입으로 narrowing됨
 *   console.log(data.title);
 * }
 * ```
 */
export function isValidEvent(data: unknown): data is Event {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const event = data as Record<string, unknown>;

  // 필수 필드 검증
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.category === "string" &&
    typeof event.period === "string" &&
    typeof event.imageUrl === "string" &&
    typeof event.viewCount === "number" &&
    typeof event.likeCount === "number"
  );
}

/**
 * 이벤트 배열 유효성 검증
 *
 * @param data - 검증할 배열
 * @returns 모든 요소가 유효한 Event 배열 여부
 */
export function isValidEventArray(data: unknown): data is Event[] {
  return Array.isArray(data) && data.every(isValidEvent);
}

/**
 * 이벤트 단언 (Assertion)
 *
 * @param data - 검증할 데이터
 * @throws {Error} 유효하지 않은 데이터일 경우 에러 발생
 *
 * @example
 * ```tsx
 * try {
 *   assertEvent(apiResponse);
 *   // 이 시점에서 apiResponse는 Event 타입 보장
 * } catch (error) {
 *   console.error("Invalid event data");
 * }
 * ```
 */
export function assertEvent(data: unknown): asserts data is Event {
  if (!isValidEvent(data)) {
    throw new Error(`Invalid event data: ${JSON.stringify(data, null, 2)}`);
  }
}

/**
 * 이벤트 배열 단언
 *
 * @param data - 검증할 배열
 * @throws {Error} 유효하지 않은 배열일 경우 에러 발생
 */
export function assertEventArray(data: unknown): asserts data is Event[] {
  if (!isValidEventArray(data)) {
    throw new Error("Invalid event array data");
  }
}

/**
 * 부분적 이벤트 데이터 검증 (Partial Event)
 *
 * @param data - 검증할 데이터
 * @returns 최소한의 필드를 가진 이벤트 데이터 여부
 *
 * @description
 * - API에서 일부 필드만 반환할 경우 사용
 * - 필수: id, title, imageUrl
 */
export function isPartialEvent(data: unknown): data is Partial<Event> & {
  id: string;
  title: string;
  imageUrl: string;
} {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const event = data as Record<string, unknown>;

  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.imageUrl === "string"
  );
}

/**
 * 카테고리 유효성 검증
 *
 * @param category - 검증할 카테고리
 * @returns 유효한 카테고리 여부
 */
export function isValidCategory(category: unknown): category is string {
  if (typeof category !== "string") {
    return false;
  }

  const validCategories = ["전시", "팝업", "팝업스토어"];
  return validCategories.includes(category);
}

/**
 * 이벤트 데이터 정규화 (Normalize)
 *
 * @param data - 정규화할 데이터
 * @returns 정규화된 Event 객체 또는 null
 *
 * @description
 * - API 응답을 안전하게 Event 타입으로 변환
 * - 누락된 선택적 필드에 기본값 제공
 */
export function normalizeEvent(data: unknown): Event | null {
  if (!isPartialEvent(data)) {
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    category: data.category ?? "전시",
    subcategory: data.subcategory,
    region: data.region,
    period: data.period ?? "",
    priceDisplay: data.priceDisplay,
    imageUrl: data.imageUrl,
    viewCount: data.viewCount ?? 0,
    likeCount: data.likeCount ?? 0,
    isLiked: data.isLiked ?? false,
  };
}
