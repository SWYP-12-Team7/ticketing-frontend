"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  className?: string;
}

const HIDDEN_FOOTER_PATHS = ["/onboarding", "/auth"];

const footerLinks = {
  서비스: [
    { label: "지도 & 캘린더", href: "/map" },
    { label: "FN태그라", href: "/fn-tagra" },
    { label: "Wireframing", href: "/wireframing" },
    { label: "Diagramming", href: "/diagramming" },
    { label: "Brainstorming", href: "/brainstorming" },
    { label: "Online whiteboard", href: "/whiteboard" },
    { label: "Team collaboration", href: "/collaboration" },
  ],
  고객센터: [
    { label: "Q&A", href: "/qna" },
    { label: "내 정보관리", href: "/myinfo" },
    { label: "문의하기", href: "/contact" },
    { label: "Design systems", href: "/design-systems" },
    { label: "Collaboration features", href: "/features" },
    { label: "Design process", href: "/process" },
    { label: "FigJam", href: "/figjam" },
  ],
  알림: [
    { label: "공지사항", href: "/notice" },
    { label: "알림 리스트", href: "/notifications" },
    { label: "저장한 행사 시작 디데일", href: "/saved-start" },
    { label: "저장한 행사 마감 디데일", href: "/saved-end" },
    { label: "Support", href: "/support" },
    { label: "Developers", href: "/developers" },
    { label: "Resource library", href: "/resources" },
  ],
  회사: [
    { label: "서비스 소개", href: "/about" },
    { label: "서비스 이용약관", href: "/terms" },
    { label: "개인정보 수집 및 이용", href: "/privacy" },
    { label: "오픈 소스 라이센스", href: "/license" },
    { label: "버전정보", href: "/version" },
    { label: "Developers", href: "/developers" },
    { label: "Resource library", href: "/resources" },
  ],
};

export function Footer({ className }: FooterProps) {
  const pathname = usePathname();
  const shouldHide = HIDDEN_FOOTER_PATHS.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <footer
      className={cn(
        "border-t border-border bg-muted px-4 py-10 mt-10",
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="inline-flex h-8 items-center justify-center bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              로고
            </Link>
          </div>

          {/* 링크 영역 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
