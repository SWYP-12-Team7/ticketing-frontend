import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 찜 목록 빈 상태 컴포넌트
 * - 찜한 이벤트가 없을 때 표시
 * - 사용자에게 행동 유도
 */
export function WishlistEmptyState() {
  return (
    <section
      className="wishlistEmptyState flex min-h-[500px] flex-col items-center justify-center px-4 text-center"
      role="status"
      aria-label="찜한 행사가 없습니다🤔"
    >
      <div className="wishlistEmptyState__iconWrapper mb-6 flex size-24 items-center justify-center rounded-full bg-muted">
        <Heart
          className="wishlistEmptyState__icon size-12 text-muted-foreground/40"
          aria-hidden="true"
        />
      </div>

      <h2 className="wishlistEmptyState__title mb-3 text-heading-medium text-foreground">
        찜한 행사가 없습니다🤔
      </h2>

      <p className="wishlistEmptyState__description mb-6 max-w-md text-body-medium text-muted-foreground">
        마음에 드는 전시나 공연에 하트를 눌러 나만의 찜 목록을 만들어보세요!🤗
      </p>

      <Button asChild size="lg">
        <Link href="/" className="wishlistEmptyState__homeLink">
          행사 둘러보기
        </Link>
      </Button>
    </section>
  );
}
