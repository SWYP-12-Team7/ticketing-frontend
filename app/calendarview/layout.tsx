import type { Metadata } from "next";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "캘린더 | 와르르",
};

/**
 * 캘린더 뷰는 TanStack Query를 사용하므로,
 * 어떤 렌더 경로에서도 QueryClientProvider가 보장되도록 세그먼트 레이아웃에서 한 번 더 감쌉니다.
 * - RootLayout에도 Providers가 있지만, dev 환경/워크트리/라우팅 구조 변경 시 런타임 누락을 방지합니다.
 */
export default function CalendarViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
