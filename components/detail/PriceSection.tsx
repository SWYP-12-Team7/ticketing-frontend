"use client";

import { cn } from "@/lib/utils";

interface PriceItem {
  name: string;
  price?: number;
}

interface PriceSectionProps {
  className?: string;
  id?: string;
  prices?: PriceItem[];
}

export function PriceSection({ className, id, prices }: PriceSectionProps) {
  const hasPrices = !!prices && prices.length > 0;
  const rows = hasPrices
    ? prices
    : [{ name: "입장권", price: undefined }];

  return (
    <section className={cn("border-t border-border py-10", className)} id={id}>
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-6 text-lg font-bold text-foreground">가격</h2>

        <div className="space-y-3">
          {rows.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg  border-border bg-whitepx-5 py-4"
            >
              <span className="text-md font-semibold text-[#4B5462]">{item.name}</span>
              <span className="text-sm font-semibold text-basic">
                {typeof item.price === "number"
                  ? `${item.price.toLocaleString()}원`
                  : "현장 문의 필요"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
