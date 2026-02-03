"use client";

import { useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ToggleSwitch } from "./ToggleSwitch";
import { useUserSettingsStore } from "@/store/user-settings";
import type { NotificationSettings as NotificationSettingsType } from "@/types/user";
import {
  handleAllNewsToggle,
  handleAllNewsSubItemToggle,
  handleOnboardingToggle,
  handleOnboardingSubItemToggle,
} from "./utils/notification-helpers";

/**
 * 알림 항목 메타데이터
 */
const notificationItems: Array<{
  key: keyof NotificationSettingsType;
  label: string;
  indent: boolean;
  parentKey?: keyof NotificationSettingsType;
}> = [
  { key: "allNews", label: "모든 소식 받기", indent: false },
  {
    key: "popup",
    label: "팝업 관련만 알림 받을래요",
    indent: true,
    parentKey: "allNews",
  },
  {
    key: "exhibition",
    label: "전시 관련만 알림 받을래요",
    indent: true,
    parentKey: "allNews",
  },
  {
    key: "newEvent",
    label: "신규 업로드 된 행사 알림 받을래요",
    indent: true,
    parentKey: "allNews",
  },
  {
    key: "hotDeal",
    label: "종료 일주일 전에 알림 받을래요",
    indent: true,
    parentKey: "allNews",
  },
  { key: "onemonthNews", label: "온보딩 알림 받기", indent: false },
  {
    key: "likedEvent",
    label: "좋아하는 팝업 · 전시 소식을 골라서 알림 받을래요",
    indent: true,
    parentKey: "onemonthNews",
  },
  {
    key: "interestedEvent",
    label: "설정한 지역에서 놓치기 쉬운 소식을 받을래요",
    indent: true,
    parentKey: "onemonthNews",
  },
] as const;

/**
 * 알림 설정 컴포넌트
 *
 * @description
 * - Figma 스펙 완전 반영
 * - "모든 알림 받기" → "모든 소식 받기"
 * - 조건부 표시 규칙:
 *   - 부모 항목은 항상 표시
 *   - 자식 항목: 부모가 ON이면 표시, OFF면 숨김
 * - list-item height: 64px, padding: 16px
 * - 헬퍼 함수로 로직 분리
 * - 성능 최적화 (useMemo, useCallback)
 */
export function NotificationSettings() {
  const { currentProfile, updateNotifications } = useUserSettingsStore();

  /**
   * 토글 핸들러
   */
  const handleToggle = useCallback(
    (key: keyof NotificationSettingsType) => {
      const notifications = currentProfile.notifications;

      let updates: Partial<NotificationSettingsType>;

      if (key === "allNews") {
        updates = handleAllNewsToggle(notifications.allNews);
      } else if (
        key === "popup" ||
        key === "exhibition" ||
        key === "newEvent" ||
        key === "hotDeal"
      ) {
        updates = handleAllNewsSubItemToggle(key, notifications);
      } else if (key === "onemonthNews") {
        updates = handleOnboardingToggle(notifications.onemonthNews);
      } else if (key === "likedEvent" || key === "interestedEvent") {
        updates = handleOnboardingSubItemToggle(key, notifications);
      } else {
        // Fallback (실행되지 않아야 함)
        updates = { [key]: !notifications[key] };
      }

      updateNotifications(updates);
    },
    [currentProfile.notifications, updateNotifications]
  );

  /**
   * 렌더링할 항목 목록 (메모이제이션)
   *
   * @description
   * - 부모 항목(indent: false)은 항상 표시
   * - 자식 항목(indent: true): 형제 자식들 중 하나라도 ON이면 모두 표시, 모두 OFF면 숨김
   */
  const visibleItems = useMemo(() => {
    const notifications = currentProfile.notifications;

    return notificationItems.filter((item) => {
      // 부모 항목은 항상 표시
      if (!item.indent) {
        return true;
      }

      // 자식 항목: 형제 자식들 중 하나라도 ON이면 표시
      if (item.parentKey === "allNews") {
        // popup, exhibition, newEvent, hotDeal 중 하나라도 ON이면 모두 표시
        return (
          notifications.popup ||
          notifications.exhibition ||
          notifications.newEvent ||
          notifications.hotDeal
        );
      }

      if (item.parentKey === "onemonthNews") {
        // likedEvent, interestedEvent 중 하나라도 ON이면 모두 표시
        return notifications.likedEvent || notifications.interestedEvent;
      }

      return true;
    });
  }, [currentProfile.notifications]);

  return (
    <>
      {/* 섹션 제목 - Figma: 866px, 24px, font-weight 600 */}
      <h2 className="w-[866px] text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
        알림 설정
      </h2>

      {/* 알림 항목 리스트 - Figma: width 866px */}
      <div className="flex w-[866px] flex-col" role="list">
        {visibleItems.map((item) => {
          const isChecked = currentProfile.notifications[item.key];
          const isParent = !item.indent;

          return (
            <div
              key={item.key}
              role="listitem"
              className={cn(
                "flex h-16 items-center justify-between bg-white",
                item.indent ? "px-4 pl-12" : "px-4"
              )}
            >
              <label
                htmlFor={`notification-${item.key}`}
                className={cn(
                  "flex-1 cursor-pointer text-lg leading-[180%]",
                  isParent
                    ? "font-semibold text-basic"
                    : "font-normal text-[#4B5462]"
                )}
              >
                {item.label}
              </label>
              <ToggleSwitch
                id={`notification-${item.key}`}
                checked={isChecked}
                onChange={() => handleToggle(item.key)}
                aria-label={`${item.label} ${isChecked ? "끄기" : "켜기"}`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
