"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import type { Product } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { SectionHeader } from "./section-header";
import { ProductCard } from "./product-card";

function useCountdown() {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    // End of tomorrow at midnight
    const target = new Date();
    target.setHours(24, 0, 0, 0);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);
  return left;
}

export function FlashSale({ products }: { products: Product[] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);
  const left = useCountdown();

  if (products.length === 0) return null;

  const cell = (v: number, label: string) => (
    <span className="flex flex-col items-center bg-foreground text-background rounded-xl px-2 py-1.5 min-w-11">
      <span className="text-base sm:text-lg font-extrabold leading-none tabular-nums">{String(v).padStart(2, "0")}</span>
      <span className="text-[10px] opacity-70">{label}</span>
    </span>
  );

  return (
    <section className="pt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-l from-rose-50 via-white to-white border border-rose-100 p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Flame size={22} />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold">{t.sections.flashSale}</h2>
                <p className="text-sm text-muted-foreground">{t.sections.flashSaleSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground me-1">{t.sections.endsIn}</span>
              {cell(left.d, t.sections.days)}
              {cell(left.h, t.sections.hours)}
              {cell(left.m, t.sections.minutes)}
              {cell(left.s, t.sections.seconds)}
            </div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin snap-x">
            {products.slice(0, 10).map((p, i) => (
              <div key={p.id} className="w-44 sm:w-52 shrink-0 snap-start">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
          <button
            onClick={() => openShop({ onSale: true })}
            className="mt-2 w-full sm:w-auto bg-rose-500 text-white rounded-2xl px-8 py-3 font-bold hover:bg-rose-600 transition-colors"
          >
            {t.sections.viewAll} ←
          </button>
        </div>
      </div>
    </section>
  );
}
