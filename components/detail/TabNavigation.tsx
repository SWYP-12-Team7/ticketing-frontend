"use client";

import { cn } from "@/lib/utils";

interface TabNavigationProps {
  className?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "intro", label: "소개" },
  { id: "info", label: "이용안내" },
  { id: "notice", label: "공지사항" },
  { id: "location", label: "장소" },
  { id: "price", label: "가격" },
  { id: "channel", label: "공식채널" },
];

export function TabNavigation({
  className,
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <nav
      className={cn(
        "sticky top-14 z-40 border-b border-border bg-white",
        className
      )}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative py-4 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "text-[#F36012]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F36012]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
