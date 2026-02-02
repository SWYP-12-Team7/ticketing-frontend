"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface SettingsNavigationProps {
  currentPath: string;
}

const navItems = [
  { label: "내 정보 설정", path: "/settings/profile" },
  { label: "나의 취향", path: "/settings/interests" },
];

export function SettingsNavigation({ currentPath }: SettingsNavigationProps) {
  return (
    <nav className="flex flex-col">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "relative ml-3 flex items-center rounded px-3 py-2 text-xl font-semibold leading-[128%] tracking-[-0.025em] transition-colors",
              isActive ? "text-[#F36012]" : "text-[#202937] hover:bg-muted"
            )}
          >
            {/* 활성 상태 왼쪽 바 */}
            {isActive && (
              <span className="absolute -left-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r bg-[#F36012]" />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
