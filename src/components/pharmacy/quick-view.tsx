"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { formatEGP, type Product } from "@/lib/types";
import { RatingStars } from "./rating-stars";
import { toast } from "@/hooks/use-toast";

function QuickBody({ p }: { p: Product }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const addToCart = useApp((s) => s.addToCart);
  const setQuickView = useApp((s) => s.setQuickView);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const [qty, setQty] = useState(1);

  const name = lang === "ar" ? p.nameAr : p.nameEn;
  const brand = lang === "ar" ? p.brand.nameAr : p.brand.nameEn;
  const cat = lang === "ar" ? p.category.nameAr : p.category.nameEn;
  const desc = lang === "ar" ? p.descAr : p.descEn;
  const discount = p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;

  const handleAdd = (goCart = false) => {
    addToCart(p, qty);
    toast({ title: t.product.added, description: name });
    setQuickView(null);
    if (goCart) setCartOpen(true);
  };

  return (
    <div className="grid md:grid-cols-2">
      <div className="relative bg-muted aspect-square">
        <img src={p.image} alt={name} className="w-full h-full object-cover" />
        {discount > 0 && (
          <span className="absolute top-4 start-4 bg-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            {discount}% {t.product.off}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col gap-4">
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">{brand}</span>
          <h3 className="text-lg sm:text-xl font-extrabold leading-snug mt-1">{name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars rating={p.rating} size={16} />
          <span className="text-sm text-muted-foreground">
            {p.rating} · {p.reviews} {t.product.reviews}
          </span>
          <span className="text-sm text-muted-foreground">· {p.sellCount}+ {t.product.sold}</span>
        </div>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-extrabold text-foreground">{formatEGP(p.price, lang)}</span>
          {p.comparePrice && (
            <span className="text-base text-muted-foreground line-through">{formatEGP(p.comparePrice, lang)}</span>
          )}
          {p.comparePrice && (
            <span className="text-xs font-bold text-emerald-600">
              {t.product.save} {formatEGP(p.comparePrice - p.price, lang)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed clamp-3">{desc}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 font-semibold">
            {t.product.category}: {cat}
          </span>
          {p.skinType && (
            <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 font-semibold">
              {t.product.skinType}: {t.product.skinTypes[p.skinType as keyof typeof t.product.skinTypes] ?? p.skinType}
            </span>
          )}
          <span className={`rounded-full px-3 py-1.5 font-semibold ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {p.stock > 5 ? t.product.inStock : p.stock > 0 ? t.product.lowStock : t.product.outOfStock}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-xl overflow-hidden h-11">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-full flex items-center justify-center hover:bg-accent"
              aria-label="decrease"
            >
              <Minus size={15} />
            </button>
            <span className="w-10 text-center font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(p.stock, q + 1))}
              className="w-10 h-full flex items-center justify-center hover:bg-accent"
              aria-label="increase"
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            onClick={() => handleAdd(false)}
            disabled={p.stock <= 0}
            className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <ShoppingBag size={17} />
            {t.product.addToCart}
          </button>
        </div>
        <button
          onClick={() => handleAdd(true)}
          disabled={p.stock <= 0}
          className="h-11 border-2 border-primary text-primary rounded-xl font-bold hover:bg-accent disabled:opacity-50 transition-colors"
        >
          {t.product.goCart}
        </button>
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground border-t border-border pt-3">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-primary" /> {t.topBar.sameday}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-primary" /> {t.trust.genuineTitle}
          </span>
        </div>
      </div>
    </div>
  );
}

export function QuickView() {
  const quickView = useApp((s) => s.quickView);
  const setQuickView = useApp((s) => s.setQuickView);

  if (!quickView) return null;

  return (
    <Dialog open onOpenChange={(v) => !v && setQuickView(null)}>
      <DialogContent
        key={quickView.id}
        className="max-w-3xl p-0 overflow-hidden rounded-3xl max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <QuickBody p={quickView} />
      </DialogContent>
    </Dialog>
  );
}
