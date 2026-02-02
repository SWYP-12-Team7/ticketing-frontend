import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  return (
    <section className={className}>
      <div
        className={cn(
          "flex h-35 items-center justify-center rounded-lg bg-[#767676] "
        )}
      >
        <span className="text-2xl font-semibold  text-[#000000]">배너</span>
      </div>
    </section>
  );
}
