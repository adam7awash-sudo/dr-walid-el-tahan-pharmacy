"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";

const SLIDES = [
  {
    img: "/assets/hero-pharmacy.png",
    badgeKey: "badge1",
    titleKey: "title1",
    subKey: "sub1",
    ctaKey: "cta1",
    action: { slug: null as string | null, onSale: false },
  },
  {
    img: "/assets/hero-beauty.png",
    badgeKey: "badge2",
    titleKey: "title2",
    subKey: "sub2",
    ctaKey: "cta2",
    action: { slug: "skin-care", onSale: false },
  },
  {
    img: "/assets/hero-baby.png",
    badgeKey: "badge3",
    titleKey: "title3",
    subKey: "sub3",
    ctaKey: "cta3",
    action: { slug: "mother-baby", onSale: false },
  },
];

export function Hero() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[idx];
  const isRtl = lang === "ar";

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6" aria-roledescription="carousel">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/15 via-secondary to-emerald-50 min-h-[280px] sm:min-h-[340px] md:min-h-[420px] flex">
        {SLIDES.map((s, i) => (
           
          <img
            key={s.img}
            src={s.img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className={`absolute inset-0 bg-gradient-to-${isRtl ? "l" : "r"} from-white via-white/85 to-transparent`} />

        <div className="relative z-10 flex flex-col justify-center gap-4 p-8 sm:p-12 md:p-16 max-w-xl">
          <span className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold">
            <ShieldCheck size={15} />
            {t.hero[slide.badgeKey as keyof typeof t.hero]}
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
            {t.hero[slide.titleKey as keyof typeof t.hero]}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
            {t.hero[slide.subKey as keyof typeof t.hero]}
          </p>
          <button
            onClick={() => openShop({ category: slide.action.slug, onSale: slide.action.onSale })}
            className="w-fit bg-primary text-primary-foreground rounded-2xl px-7 py-3 font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            {t.hero[slide.ctaKey as keyof typeof t.hero]}
          </button>
        </div>

        {/* arrows */}
        <button
          onClick={() => setIdx((idx - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute z-10 start-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow flex items-center justify-center hover:bg-white transition-colors"
          aria-label="previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setIdx((idx + 1) % SLIDES.length)}
          className="absolute z-10 end-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur shadow flex items-center justify-center hover:bg-white transition-colors"
          aria-label="next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* dots */}
        <div className="absolute z-10 bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`${t.hero.slide} ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-7 bg-primary" : "w-2 bg-gray-400/60"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
