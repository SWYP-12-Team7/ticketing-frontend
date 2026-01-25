import { cn } from "@/lib/utils";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  return (
    <section className={className}>
      <div
        className={cn(
          "flex h-24 items-center justify-center rounded-lg bg-muted"
        )}
      >
        <span className="text-sm text-muted-foreground">광고</span>
      </div>
    </section>
  );
}
