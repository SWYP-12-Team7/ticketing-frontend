"use client";

import { cn } from "@/lib/utils";

interface PriceItem {
  name: string;
  price: number;
}

interface PriceSectionProps {
  className?: string;
  id?: string;
  prices: PriceItem[];
}

export function PriceSection({ className, id, prices }: PriceSectionProps) {
  if (!prices || prices.length === 0) {
    return null;
  }

  return (
    <section className={cn("border-t border-border py-10", className)} id={id}>
      <div className="mx-auto max-w-[1200px] px-5">
        <h2 className="mb-6 text-lg font-bold text-foreground">가격</h2>

        <div className="space-y-3">
          {prices.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border bg-white px-5 py-4"
            >
              <span className="text-sm text-foreground">{item.name}</span>
              <span className="text-sm font-semibold text-[#6A8DFF]">
                {item.price.toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
