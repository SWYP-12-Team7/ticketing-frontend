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
    <nav className="flex w-[262px] flex-col">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;

        return (
          <div
            key={item.path}
            className="relative flex h-[58px] w-[262px] items-center bg-white px-2 py-2 pl-3"
          >
            {/* 활성 상태 왼쪽 바 - category-title(58px) 기준 */}
            {isActive && (
              <span className="absolute left-0 top-[11px] h-10 w-1 bg-[#F36012]" />
            )}

            <Link
              href={item.path}
              className={cn(
                "flex h-[42px] w-[242px] grow items-center rounded p-2 text-xl font-semibold leading-[128%] tracking-[-0.025em] transition-colors",
                isActive ? "text-[#F36012]" : "text-basic hover:bg-muted"
              )}
            >
              <span className="grow">{item.label}</span>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
