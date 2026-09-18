"use client";

import { Truck, Package, Globe, ShieldCheck, Headset, BadgeCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";

export function TrustStrip() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];

  const items = [
    { icon: Truck, title: t.trust.samedayTitle, desc: t.trust.samedayDesc },
    { icon: Package, title: t.trust.saverTitle, desc: t.trust.saverDesc },
    { icon: Globe, title: t.trust.nationwideTitle, desc: t.trust.nationwideDesc },
    { icon: ShieldCheck, title: t.trust.secureTitle, desc: t.trust.secureDesc },
    { icon: Headset, title: t.trust.supportTitle, desc: t.trust.supportDesc },
    { icon: BadgeCheck, title: t.trust.genuineTitle, desc: t.trust.genuineDesc },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3.5 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <span className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <item.icon size={20} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-bold text-foreground truncate">{item.title}</span>
              <span className="block text-[11px] text-muted-foreground truncate">{item.desc}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
