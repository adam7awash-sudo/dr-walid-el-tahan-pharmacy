"use client";

import { Phone, Mail, Clock, MapPin, ShieldCheck, Truck, CreditCard, Wallet, Landmark } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { CategoryIcon } from "./category-icon";

export function Footer({ categories }: { categories: { id: string; slug: string; nameAr: string; nameEn: string; icon: string }[] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const setPolicy = useApp((s) => s.setPolicy);
  const openShop = useApp((s) => s.openShop);
  const goHome = useApp((s) => s.goHome);

  const policyLinks: { key: Parameters<typeof setPolicy>[0]; label: string }[] = [
    { key: "terms", label: t.policies.terms },
    { key: "privacy", label: t.policies.privacy },
    { key: "delivery", label: t.policies.delivery },
    { key: "stores", label: t.policies.stores },
    { key: "about", label: t.policies.about },
  ];

  return (
    <footer className="mt-auto bg-foreground text-background">
      {/* support strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Phone, title: t.support.call, sub: t.footer.hotline, href: "tel:19288" },
            { icon: Mail, title: t.support.email, sub: t.footer.email, href: `mailto:${t.footer.email}` },
            { icon: Clock, title: t.support.title, sub: t.footer.hours },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href ?? undefined}
              className="flex items-center gap-3 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-emerald-400/15 text-emerald-300 flex items-center justify-center shrink-0">
                <c.icon size={21} />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-sm truncate">{c.title}</span>
                <span className="block text-xs text-background/60 truncate" dir="auto">{c.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <button onClick={goHome} className="flex items-center gap-2.5 mb-4">
            <span className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              { }
              <img src="/favicon.svg" alt="" className="w-6 h-6 rounded-md" />
            </span>
            <span className="font-extrabold text-sm">{t.brandName}</span>
          </button>
          <p className="text-xs leading-relaxed text-background/70">{t.footer.about}</p>
          <div className="flex items-center gap-2 mt-4">
            <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold">
              <ShieldCheck size={13} className="text-emerald-300" /> {t.trust.secureDesc}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold">
              <Truck size={13} className="text-emerald-300" /> {t.trust.genuineTitle}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-4">{t.footer.quickLinks}</h3>
          <ul className="space-y-2.5 text-xs text-background/70">
            <li><button onClick={goHome} className="hover:text-emerald-300 transition-colors">{t.nav.home}</button></li>
            <li><button onClick={() => openShop({})} className="hover:text-emerald-300 transition-colors">{t.nav.shop}</button></li>
            <li><button onClick={() => openShop({ onSale: true })} className="hover:text-emerald-300 transition-colors">{t.nav.offers}</button></li>
            {policyLinks.map((p) => (
              <li key={p.key}>
                <button onClick={() => setPolicy(p.key)} className="hover:text-emerald-300 transition-colors">
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-4">{t.footer.categories}</h3>
          <ul className="space-y-2.5 text-xs text-background/70">
            {categories.slice(0, 8).map((c) => (
              <li key={c.id}>
                <button onClick={() => openShop({ category: c.slug })} className="hover:text-emerald-300 transition-colors flex items-center gap-2">
                  <CategoryIcon name={c.icon} className="w-3.5 h-3.5" />
                  {lang === "ar" ? c.nameAr : c.nameEn}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-4">{t.footer.supportTitle}</h3>
          <ul className="space-y-3 text-xs text-background/70">
            <li className="flex items-center gap-2"><Phone size={14} className="text-emerald-300 shrink-0" /> {t.footer.hotline}</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-emerald-300 shrink-0" /> <span dir="ltr">{t.footer.email}</span></li>
            <li className="flex items-center gap-2"><Clock size={14} className="text-emerald-300 shrink-0" /> {t.footer.hours}</li>
            {["store1", "store2", "store3", "store4"].map((s) => (
              <li key={s} className="flex items-start gap-2">
                <MapPin size={14} className="text-emerald-300 shrink-0 mt-0.5" />
                {t.footer[s as keyof typeof t.footer]}
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-sm mb-3 mt-5">{t.footer.payment}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Wallet, label: "COD" },
              { icon: CreditCard, label: "Visa" },
              { icon: CreditCard, label: "Mastercard" },
              { icon: Landmark, label: "InstaPay" },
            ].map((p) => (
              <span key={p.label} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 text-[11px] font-bold">
                <p.icon size={13} className="text-emerald-300" /> {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-background/60">
          <span>© {new Date().getFullYear()} {t.brandName}. {t.footer.rights}</span>
          <span>{t.footer.madeIn} 🇪🇬 · {t.trust.secureDesc}</span>
        </div>
      </div>
    </footer>
  );
}
