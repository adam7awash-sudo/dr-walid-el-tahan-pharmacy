"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, Menu, Phone, Clock, Truck, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { formatEGP, type Product } from "@/lib/types";
import { Button } from "@/components/ui/button";

function Logo() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  return (
    <button onClick={() => useApp.getState().goHome()} className="flex items-center gap-2.5 shrink-0" aria-label={t.brandName}>
      <span className="relative w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
        { }
        <img src="/favicon.svg" alt="" className="w-7 h-7 rounded-md" />
      </span>
      <span className="text-start leading-tight hidden sm:block">
        <span className="block font-extrabold text-[15px] text-foreground">{t.brandShort}</span>
        <span className="block text-[11px] text-muted-foreground">{t.tagline}</span>
      </span>
    </button>
  );
}

function SearchBox() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(q.trim())}&limit=6`);
        const data = await res.json();
        setResults(data.products ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  const submit = () => {
    if (!q.trim()) return;
    setOpen(false);
    useApp.getState().openShop({ search: q.trim() });
  };

  return (
    <div ref={boxRef} className="relative flex-1 max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative"
      >
        <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t.search.placeholder}
          className="w-full h-11 rounded-2xl border border-border bg-muted/60 ps-11 pe-10 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
          aria-label={t.search.placeholder}
        />
        {q && (
          <button type="button" onClick={() => setQ("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        )}
      </form>

      {open && q.trim() && (
        <div className="absolute top-[calc(100%+8px)] inset-x-0 bg-popover border border-border rounded-2xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto scrollbar-thin">
          <div className="px-4 py-2 text-[11px] font-bold text-muted-foreground uppercase">
            {loading ? t.common.loading : t.search.suggestions}
          </div>
          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">{t.search.noResults}</div>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setOpen(false);
                useApp.getState().setQuickView(p);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition-colors text-start"
            >
              { }
              <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover bg-muted shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold truncate">
                  {lang === "ar" ? p.nameAr : p.nameEn}
                </span>
                <span className="block text-xs text-muted-foreground">{lang === "ar" ? p.brand.nameAr : p.brand.nameEn}</span>
              </span>
              <span className="text-sm font-bold text-primary shrink-0">{formatEGP(p.price, lang)}</span>
            </button>
          ))}
          {!loading && results.length > 0 && (
            <button onClick={submit} className="w-full py-3 text-sm font-bold text-primary hover:bg-accent border-t border-border">
              {t.search.viewAll} ←
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const cart = useApp((s) => s.cart);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const setLang = useApp((s) => s.setLang);
  const goHome = useApp((s) => s.goHome);
  const setPolicy = useApp((s) => s.setPolicy);
  const [mobileNav, setMobileNav] = useState(false);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  const categories = [
    { slug: "skin-care", label: lang === "ar" ? "العناية بالبشرة" : "Skin Care" },
    { slug: "makeup", label: lang === "ar" ? "المكياج" : "Makeup" },
    { slug: "fragrances", label: lang === "ar" ? "العطور" : "Perfumes" },
    { slug: "hair-care", label: lang === "ar" ? "الشعر" : "Hair Care" },
    { slug: "vitamins-supplements", label: lang === "ar" ? "فيتامينات" : "Vitamins" },
    { slug: "mother-baby", label: lang === "ar" ? "الأم والطفل" : "Mother & Baby" },
    { slug: "medical-devices", label: lang === "ar" ? "أجهزة طبية" : "Devices" },
    { slug: "k-beauty", label: t.nav.kbeauty, special: true },
    { slug: "dermocosmetics", label: t.nav.dermo, special: true },
    { slug: "home-scents", label: t.nav.homeScents, special: true },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* top strip */}
      <div className="bg-foreground text-background text-[11px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Truck size={13} className="shrink-0 text-emerald-400" />
            <span className="truncate">{t.topBar.sameday} · {t.topBar.saver} · {t.topBar.nationwide}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <span className="flex items-center gap-1.5"><Clock size={13} className="text-emerald-400" /> {t.topBar.hours}</span>
            <a href="tel:19288" className="flex items-center gap-1.5 font-bold hover:text-emerald-400 transition-colors" dir="ltr">
              <Phone size={13} className="text-emerald-400" /> 19288
            </a>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3 sm:gap-5">
          <button
            className="lg:hidden w-10 h-10 rounded-xl border border-border flex items-center justify-center shrink-0"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="menu"
          >
            <Menu size={20} />
          </button>
          <Logo />
          <SearchBox />
          <div className="flex items-center gap-2 ms-auto shrink-0">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="h-10 px-3 rounded-xl border border-border text-sm font-bold hover:border-primary hover:text-primary transition-colors"
              aria-label={t.common.langSwitch}
            >
              {t.common.language}
            </button>
            <Button
              onClick={() => setCartOpen(true)}
              className="h-10 rounded-xl px-3 sm:px-4 relative font-bold gap-2"
              aria-label={t.cart.title}
            >
              <ShoppingCart size={19} />
              <span className="hidden sm:inline">{t.cart.title}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* category nav */}
        <nav className="max-w-7xl mx-auto px-4 hidden lg:flex items-center gap-1 h-11 overflow-x-auto no-scrollbar" aria-label="categories">
          <button onClick={goHome} className="px-3 h-8 rounded-lg text-sm font-semibold hover:bg-accent transition-colors shrink-0">
            {t.nav.home}
          </button>
          <button
            onClick={() => useApp.getState().openShop({ onSale: true })}
            className="px-3 h-8 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
          >
            {t.nav.offers}
          </button>
          <span className="w-px h-5 bg-border mx-1" />
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => useApp.getState().openShop({ category: c.slug })}
              className="px-3 h-8 rounded-lg text-sm font-medium hover:bg-accent hover:text-primary transition-colors shrink-0 whitespace-nowrap"
            >
              {c.label}
            </button>
          ))}
          <span className="w-px h-5 bg-border mx-1" />
          <button
            onClick={() => setPolicy("contact")}
            className="px-3 h-8 rounded-lg text-sm font-medium hover:bg-accent transition-colors shrink-0"
          >
            {t.nav.contact}
          </button>
        </nav>
      </div>

      {/* mobile nav */}
      {mobileNav && (
        <div className="lg:hidden bg-card border-b border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-1.5">
            <button onClick={() => { goHome(); setMobileNav(false); }} className="px-3 h-10 rounded-xl bg-accent text-sm font-bold text-start">
              {t.nav.home}
            </button>
            <button onClick={() => { useApp.getState().openShop({}); setMobileNav(false); }} className="px-3 h-10 rounded-xl bg-accent text-sm font-bold text-start">
              {t.nav.shop}
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => { useApp.getState().openShop({ category: c.slug }); setMobileNav(false); }}
                className="px-3 h-10 rounded-xl border border-border text-sm font-medium text-start"
              >
                {c.label}
              </button>
            ))}
            <button onClick={() => { useApp.getState().openShop({ onSale: true }); setMobileNav(false); }} className="px-3 h-10 rounded-xl bg-rose-50 text-rose-600 text-sm font-bold text-start">
              {t.nav.offers}
            </button>
            <button onClick={() => { setPolicy("contact"); setMobileNav(false); }} className="px-3 h-10 rounded-xl border border-border text-sm font-medium text-start">
              {t.nav.contact}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
