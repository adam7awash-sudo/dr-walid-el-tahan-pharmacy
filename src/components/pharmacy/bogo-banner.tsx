"use client";

import { Gift, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";

export function BogoBanner() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      <div className="relative overflow-hidden rounded-3xl bg-foreground text-background">
        { }
        <img
          src="/assets/promo-perfume.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className={`absolute inset-0 bg-gradient-to-${lang === "ar" ? "l" : "r"} from-foreground/95 via-foreground/70 to-transparent`} />
        <div className="relative z-10 p-8 sm:p-12 md:p-14 max-w-xl flex flex-col gap-4 min-h-[260px] justify-center">
          <span className="inline-flex w-fit items-center gap-2 bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 rounded-full px-4 py-1.5 text-xs font-bold">
            <Gift size={14} />
            {t.sections.freeShipTitle} · {t.sections.freeShipText}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
            <Sparkles size={28} className="inline-block text-amber-300 align-middle mx-1" />
            {t.sections.bogoTitle}
          </h2>
          <p className="text-sm sm:text-base text-background/80">{t.sections.bogoSub}</p>
          <button
            onClick={() => openShop({})}
            className="w-fit bg-background text-foreground rounded-2xl px-8 py-3 font-bold hover:bg-white hover:shadow-lg transition-all"
          >
            {t.sections.bogoCta}
          </button>
        </div>
      </div>
    </section>
  );
}
