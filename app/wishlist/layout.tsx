import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "찜 목록 | 와르르",
  description: "내가 좋아요 표시한 전시와 공연을 모아보세요",
  openGraph: {
    title: "찜 목록 | 와르르",
    description: "내가 좋아요 표시한 전시와 공연을 모아보세요",
  },
};

/**
 * 찜 목록 레이아웃
 * - SEO 메타데이터 설정
 * - 페이지 구조 정의
 */
export default function WishlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
