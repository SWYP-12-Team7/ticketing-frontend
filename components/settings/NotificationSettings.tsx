"use client";

import { cn } from "@/lib/utils";
import { ToggleSwitch } from "./ToggleSwitch";
import { useUserSettingsStore } from "@/store/user-settings";
import type { NotificationSettings } from "@/types/user";

const notificationItems: Array<{
  key: keyof NotificationSettings;
  label: string;
  indent: boolean;
  parentKey?: keyof NotificationSettings;
}> = [
  { key: "allNews", label: "모든 알림 받기", indent: false },
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
];

export function NotificationSettings() {
  const { currentProfile, updateNotifications } = useUserSettingsStore();

  const handleToggle = (key: keyof typeof currentProfile.notifications) => {
    if (key === "allNews") {
      // "모든 알림 받기" 토글 시 하위 항목도 함께 변경
      const newValue = !currentProfile.notifications.allNews;
      updateNotifications({
        allNews: newValue,
        popup: newValue,
        exhibition: newValue,
        newEvent: newValue,
        hotDeal: newValue,
      });
    } else if (key === "onemonthNews") {
      // "온보딩 알림 받기"는 독립적으로 동작
      updateNotifications({
        [key]: !currentProfile.notifications[key],
      });
    } else if (key === "likedEvent" || key === "interestedEvent") {
      // "온보딩 알림 받기" 하위 항목
      const newValue = !currentProfile.notifications[key];
      updateNotifications({
        [key]: newValue,
      });

      // 하위 항목이 하나라도 꺼지면 "온보딩 알림" 자동 OFF
      if (newValue === false && currentProfile.notifications.onemonthNews) {
        updateNotifications({ onemonthNews: false });
      }

      // 모든 하위 항목이 켜지면 "온보딩 알림" 자동 ON
      const allOnboardingItemsOn =
        currentProfile.notifications.likedEvent &&
        currentProfile.notifications.interestedEvent &&
        newValue;

      if (allOnboardingItemsOn && !currentProfile.notifications.onemonthNews) {
        updateNotifications({ onemonthNews: true });
      }
    } else {
      // "모든 알림 받기" 하위 항목
      const newValue = !currentProfile.notifications[key];
      updateNotifications({
        [key]: newValue,
      });

      // 하위 항목이 하나라도 꺼지면 "모든 알림" 자동 OFF
      if (newValue === false && currentProfile.notifications.allNews) {
        updateNotifications({ allNews: false });
      }

      // 모든 하위 항목이 켜지면 "모든 알림" 자동 ON
      const allSubItemsOn =
        currentProfile.notifications.popup &&
        currentProfile.notifications.exhibition &&
        currentProfile.notifications.newEvent &&
        currentProfile.notifications.hotDeal &&
        newValue;

      if (allSubItemsOn && !currentProfile.notifications.allNews) {
        updateNotifications({ allNews: true });
      }
    }
  };

  return (
    <section className="flex flex-col gap-3">
      {/* 섹션 제목 */}
      <h2 className="text-2xl font-semibold leading-[128%] tracking-[-0.025em] text-basic">
        알림 설정
      </h2>

      {/* 알림 항목 리스트 */}
      <div className="flex flex-col">
        {notificationItems
          .filter((item) => {
            // "모든 알림 받기" 하위 항목: 하나라도 ON이면 모두 표시
            if (item.parentKey === "allNews") {
              return (
                currentProfile.notifications.popup ||
                currentProfile.notifications.exhibition ||
                currentProfile.notifications.newEvent ||
                currentProfile.notifications.hotDeal
              );
            }

            // "온보딩 알림 받기" 하위 항목: 하나라도 ON이면 모두 표시
            if (item.parentKey === "onemonthNews") {
              return (
                currentProfile.notifications.likedEvent ||
                currentProfile.notifications.interestedEvent
              );
            }

            // parentKey가 없으면 항상 표시
            return true;
          })
          .map((item) => (
            <div
              key={item.key}
              className={cn(
                "flex items-center justify-between bg-white py-4",
                item.indent ? "px-4 pl-12" : "px-4"
              )}
            >
              <span
                className={cn(
                  "text-lg leading-[180%]",
                  item.indent
                    ? "font-normal text-[#4B5462]"
                    : "font-semibold text-basic"
                )}
              >
                {item.label}
              </span>
              <ToggleSwitch
                checked={currentProfile.notifications[item.key]}
                onChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
      </div>
    </section>
  );
}
