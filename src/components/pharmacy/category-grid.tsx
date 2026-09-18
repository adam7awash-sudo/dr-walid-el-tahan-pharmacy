"use client";

import type { Category } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { SectionHeader } from "./section-header";
import { CategoryIcon } from "./category-icon";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);

  const main = categories.filter((c) => !c.isSpecial);
  const special = categories.filter((c) => c.isSpecial);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      <SectionHeader title={t.sections.shopByCategory} subtitle={t.sections.shopByCategorySub} />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {main.map((c) => (
          <button
            key={c.id}
            onClick={() => openShop({ category: c.slug })}
            className="group flex flex-col items-center gap-2.5 bg-card border border-border rounded-2xl p-4 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <span
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform"
              style={{ backgroundColor: c.color }}
            >
              <CategoryIcon name={c.icon} className="w-7 h-7" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-center text-foreground leading-tight">
              {lang === "ar" ? c.nameAr : c.nameEn}
            </span>
          </button>
        ))}
      </div>

      {/* specialized sections */}
      <div className="mt-10">
        <SectionHeader title={t.sections.specialSections} subtitle={t.sections.specialSub} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {special.map((c) => (
            <button
              key={c.id}
              onClick={() => openShop({ category: c.slug })}
              className="group relative overflow-hidden rounded-3xl p-6 text-start text-white h-40 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-xl"
              style={{ backgroundColor: c.color }}
            >
              <span className="absolute -end-6 -bottom-8 opacity-20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                <CategoryIcon name={c.icon} className="w-40 h-40" />
              </span>
              <span className="text-lg sm:text-xl font-extrabold relative">{lang === "ar" ? c.nameAr : c.nameEn}</span>
              <span className="text-sm opacity-90 relative font-medium">
                {t.sections.viewAll} ←
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
