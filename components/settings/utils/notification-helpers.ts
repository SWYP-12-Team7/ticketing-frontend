import type { NotificationSettings } from "@/types/user";

/**
 * 알림 설정 헬퍼 함수 모음
 */

/**
 * 모든 "모든 소식" 하위 항목이 켜져 있는지 확인
 */
export function areAllNewsSubItemsEnabled(
  notifications: NotificationSettings
): boolean {
  return (
    notifications.popup &&
    notifications.exhibition &&
    notifications.newEvent &&
    notifications.hotDeal
  );
}

/**
 * 모든 "온보딩 알림" 하위 항목이 켜져 있는지 확인
 */
export function areAllOnboardingSubItemsEnabled(
  notifications: NotificationSettings
): boolean {
  return notifications.likedEvent && notifications.interestedEvent;
}

/**
 * "모든 소식" 토글 핸들러
 */
export function handleAllNewsToggle(
  currentValue: boolean
): Partial<NotificationSettings> {
  const newValue = !currentValue;
  return {
    allNews: newValue,
    popup: newValue,
    exhibition: newValue,
    newEvent: newValue,
    hotDeal: newValue,
  };
}

/**
 * "모든 소식" 하위 항목 토글 핸들러
 */
export function handleAllNewsSubItemToggle(
  key: "popup" | "exhibition" | "newEvent" | "hotDeal",
  notifications: NotificationSettings
): Partial<NotificationSettings> {
  const newValue = !notifications[key];
  const updates: Partial<NotificationSettings> = { [key]: newValue };

  // 하위 항목이 하나라도 꺼지면 "모든 소식" 자동 OFF
  if (newValue === false && notifications.allNews) {
    updates.allNews = false;
  }

  // 모든 하위 항목이 켜지면 "모든 소식" 자동 ON
  const willAllBeOn =
    notifications.popup &&
    notifications.exhibition &&
    notifications.newEvent &&
    notifications.hotDeal &&
    newValue;

  if (willAllBeOn && !notifications.allNews) {
    updates.allNews = true;
  }

  return updates;
}

/**
 * "온보딩 알림" 토글 핸들러
 */
export function handleOnboardingToggle(
  currentValue: boolean
): Partial<NotificationSettings> {
  return { onemonthNews: !currentValue };
}

/**
 * "온보딩 알림" 하위 항목 토글 핸들러
 */
export function handleOnboardingSubItemToggle(
  key: "likedEvent" | "interestedEvent",
  notifications: NotificationSettings
): Partial<NotificationSettings> {
  const newValue = !notifications[key];
  const updates: Partial<NotificationSettings> = { [key]: newValue };

  // 하위 항목이 하나라도 꺼지면 "온보딩 알림" 자동 OFF
  if (newValue === false && notifications.onemonthNews) {
    updates.onemonthNews = false;
  }

  // 모든 하위 항목이 켜지면 "온보딩 알림" 자동 ON
  const willAllBeOn =
    notifications.likedEvent && notifications.interestedEvent && newValue;

  if (willAllBeOn && !notifications.onemonthNews) {
    updates.onemonthNews = true;
  }

  return updates;
}
