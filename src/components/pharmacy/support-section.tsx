"use client";

import { Phone, MessageCircle, Mail, BadgeCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";

export function SupportSection() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden border border-border bg-card">
        <div className="relative min-h-56 order-2 md:order-1">
          { }
          <img
            src="/assets/pharmacist.png"
            alt={lang === "ar" ? "صيدلية الطحاوي" : "El-Tahan pharmacist"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-8 sm:p-10 flex flex-col justify-center gap-4 order-1 md:order-2">
          <span className="inline-flex w-fit items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-xs font-bold">
            <BadgeCheck size={14} />
            {lang === "ar" ? "استشارة صيدلانية مجانية" : "Free pharmacist consultation"}
          </span>
          <h2 className="text-2xl font-extrabold">{t.support.title}</h2>
          <p className="text-sm text-muted-foreground">{t.support.subtitle}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <a
              href="tel:19288"
              className="flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <Phone size={16} /> {t.support.call}
            </a>
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-500 text-white rounded-2xl px-5 py-2.5 text-sm font-bold hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle size={16} /> {t.support.whatsapp}
            </a>
            <a
              href={`mailto:${t.footer.email}`}
              className="flex items-center gap-2 border-2 border-border rounded-2xl px-5 py-2.5 text-sm font-bold hover:border-primary hover:text-primary transition-colors"
            >
              <Mail size={16} /> {t.support.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
