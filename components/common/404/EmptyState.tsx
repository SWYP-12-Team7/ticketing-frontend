import { cn } from "@/lib/utils";
import Image from "next/image";

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({
  message = "데이터가 없어요",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Image
        src="/images/404/emptyImg.svg"
        alt="데이터 없음"
        width={120}
        height={210}
      />
      <p className="text-[14px] text-[#9CA3AF]">
        {message}
      </p>
    </div>
  );
}
