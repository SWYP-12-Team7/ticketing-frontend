"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Footer를 숨길 경로 목록

interface FooterProps {
  className?: string;
}

const HIDDEN_FOOTER_PATHS = ["/onboarding", "/auth"];

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
  const shouldHide = HIDDEN_FOOTER_PATHS.some((path) => pathname.startsWith(path));

  if (shouldHide) return null;

  return (
    <footer className={cn("bg-[#FFF2E6]", className)}>
      <Image
        src="/images/Footer.png"
        alt="푸터"
        width={1280}
        height={400}
        className="h-auto w-full"
      />
    </footer>
  );
}
