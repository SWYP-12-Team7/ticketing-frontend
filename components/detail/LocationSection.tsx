"use client";

import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { KakaoMap } from "@/components/map/KakaoMap";

interface LocationSectionProps {
  className?: string;
  id?: string;
  address: string;
  detailAddress?: string;
  lat?: number;
  lng?: number;
}

export function LocationSection({
  className,
  id,
  address,
  detailAddress,
  lat,
  lng,
}: LocationSectionProps) {
  const [isCopied, setIsCopied] = useState(false);

  const fullAddress = detailAddress ? `${address} ${detailAddress}` : address;
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const locations = useMemo(
    () =>
      hasCoords
        ? [
            {
              id: "detail-location",
              title: fullAddress,
              lat,
              lng,
            },
          ]
        : [],
    [hasCoords, fullAddress, lat, lng]
  );

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  return (
    <section className={cn("border-t border-border py-10", className)} id={id}>
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-6 text-heading-medium text-[#202937]">장소</h2>

        {/* 주소 */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-foreground">{fullAddress}</span>
          <button
            onClick={handleCopyAddress}
            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted"
          >
            {isCopied ? (
              <>
                <Check className="size-3 text-green-500" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="size-3" />
                복사
              </>
            )}
          </button>
        </div>

        <div className="h-[300px] overflow-hidden rounded-lg border border-border bg-muted">
          {hasCoords ? (
            <KakaoMap
              key={`${lat}-${lng}-detail`}
              center={{ lat: lat!, lng: lng! }}
              level={5}
              maxLevel={6}
              locations={locations}
              showSearch={false}
              showMyLocation={false}
              lockView
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm text-muted-foreground">
                카카오맵이 들어갈 자리입니다
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
