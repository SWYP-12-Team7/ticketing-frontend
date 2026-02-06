"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Footer를 숨길 경로 목록
const HIDDEN_FOOTER_PATHS = ["/onboarding"];

interface FooterProps {
  className?: string;
}

const footerLinks = {
  서비스: [
    { label: "지도 & 캘린더", href: "/map" },
    { label: "카테고리", href: "/category" },
    { label: "Wireframing", href: "/wireframing" },
    { label: "Diagramming", href: "/diagramming" },
    { label: "Brainstorming", href: "/brainstorming" },
    { label: "Online whiteboard", href: "/whiteboard" },
    { label: "Team collaboration", href: "/collaboration" },
  ],
  고객센터: [
    { label: "Q&A", href: "/qna" },
    { label: "내 문의내역", href: "/my-inquiries" },
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

  // 숨길 경로인지 확인
  const shouldHide = HIDDEN_FOOTER_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldHide) return null;

  return (
    <footer
      className={cn(
        "border-t border-[#D9D9D9] bg-white px-20 pt-8 pb-40",
        className
      )}
    >
      <div className="flex flex-wrap gap-4">
        {/* 로고 영역 */}
        <div className="w-[262px] min-w-[240px]">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="와르르"
              width={217}
              height={35}
              className="object-contain"
            />
          </Link>
        </div>

        {/* 링크 영역 */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="w-[237.5px] min-w-[240px] flex flex-col gap-3">
            <h3 className="pb-4 text-base font-semibold leading-[150%] tracking-[-0.025em] text-[#1E1E1E]">
              {category}
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-base font-normal leading-[150%] tracking-[-0.025em] text-[#1E1E1E] transition-colors hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
