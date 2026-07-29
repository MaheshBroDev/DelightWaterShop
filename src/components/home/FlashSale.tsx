"use client";

import { useState, useEffect } from "react";
import { Zap, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPriceLKR } from "@/lib/utils";

interface FlashSaleProps {
  endTime: string;
  products: Array<{
    id: string;
    slug: string;
    name: string;
    basePrice: number;
    images: string[];
    type: string;
    variants?: { price: number; isActive: boolean }[];
    reviews?: { rating: number }[];
    brand?: { name: string };
    category?: { name: string };
    salePrice: number;
    soldPercent?: number;
  }>;
}

function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(endTime).getTime() - Date.now();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-1">
      <TimeBlock value={timeLeft.hours} label="HRS" />
      <span className="text-white font-bold">:</span>
      <TimeBlock value={timeLeft.minutes} label="MIN" />
      <span className="text-white font-bold">:</span>
      <TimeBlock value={timeLeft.seconds} label="SEC" />
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-[var(--color-abyss)] text-white text-lg font-bold w-10 h-10 rounded-lg flex items-center justify-center">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-white/70 mt-0.5">{label}</span>
    </div>
  );
}

export function FlashSale({ endTime, products }: FlashSaleProps) {
  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--color-deal)] text-white px-4 py-2 rounded-full">
            <Zap size={18} className="fill-white" />
            <span className="font-heading font-bold">Flash Sale</span>
          </div>
          <CountdownTimer endTime={endTime} />
        </div>
        <a
          href="/flash-sale"
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-deal)] hover:underline"
        >
          View All <ChevronRight size={16} />
        </a>
      </div>

      {/* Products */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
        {products.map((product) => (
          <div key={product.id} className="min-w-[180px] sm:min-w-[200px] max-w-[200px]">
            <ProductCard product={product} salePrice={product.salePrice} />
            {product.soldPercent && (
              <div className="mt-2 px-1">
                <div className="h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-deal)] rounded-full transition-all"
                    style={{ width: `${product.soldPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                  {product.soldPercent}% sold
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
