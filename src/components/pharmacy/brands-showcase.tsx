"use client";

import type { Brand } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { SectionHeader } from "./section-header";

export function BrandsShowcase({ brands }: { brands: Brand[] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      <SectionHeader title={t.sections.brands} subtitle={t.sections.brandsSub} onViewAll={() => openShop({})} />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {brands.slice(0, 16).map((b) => (
          <button
            key={b.id}
            onClick={() => openShop({ brands: [b.slug] })}
            className="group bg-card border border-border rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-extrabold group-hover:scale-110 transition-transform shadow-sm"
              style={{ backgroundColor: b.color }}
              aria-hidden
            >
              {b.nameEn.replace("The ", "").charAt(0)}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-foreground text-center truncate w-full">
              {lang === "ar" ? b.nameAr : b.nameEn}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
