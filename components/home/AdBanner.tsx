import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const { isAuthenticated } = useAuthStore();

  const banner = (
    <div className="overflow-hidden rounded-lg">
      <Image
        src="/images/mainBanner.png"
        alt="배너"
        width={1280}
        height={140}
        className="h-auto w-full object-cover"
        priority
      />
    </div>
  );

  return (
    <section className={className}>
      {isAuthenticated ? (
        banner
      ) : (
        <Link href="/auth/login">{banner}</Link>
      )}
    </section>
  );
}
