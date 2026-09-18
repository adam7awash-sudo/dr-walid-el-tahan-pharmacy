"use client";

import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Truck, ShieldCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { computeTotals, formatEGP, FREE_SHIPPING_THRESHOLD, type ShippingMethod } from "@/lib/types";

export function CartDrawer() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const cart = useApp((s) => s.cart);
  const cartOpen = useApp((s) => s.cartOpen);
  const setCartOpen = useApp((s) => s.setCartOpen);
  const updateQty = useApp((s) => s.updateQty);
  const removeFromCart = useApp((s) => s.removeFromCart);
  const setCheckoutOpen = useApp((s) => s.setCheckoutOpen);
  const openShop = useApp((s) => s.openShop);
  const promo = useApp((s) => s.promo);
  const setPromo = useApp((s) => s.setPromo);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState(false);

  const totals = computeTotals(
    cart.map((c) => ({ price: c.price, quantity: c.quantity })),
    "standard" as ShippingMethod["id"],
    promo
  );

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(false);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, subtotal: totals.subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromo({ code: data.code, type: data.type, value: data.value });
        toast({ title: t.cart.applied, description: data.code });
      } else {
        setPromoError(true);
        setPromo(null);
      }
    } catch {
      setPromoError(true);
    } finally {
      setPromoLoading(false);
    }
  };

  const away = Math.max(0, FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.autoDiscount));

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side={lang === "ar" ? "left" : "right"} className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag size={20} className="text-primary" />
            {t.cart.title}
            {cart.length > 0 && (
              <span className="text-sm font-medium text-muted-foreground">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
              <ShoppingBag size={36} className="text-primary" />
            </span>
            <p className="font-extrabold text-lg">{t.cart.empty}</p>
            <p className="text-sm text-muted-foreground">{t.cart.emptySub}</p>
            <button
              onClick={() => {
                setCartOpen(false);
                openShop({});
              }}
              className="mt-2 bg-primary text-primary-foreground rounded-2xl px-8 py-3 font-bold hover:bg-primary/90 transition-colors"
            >
              {t.cart.startShopping}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {away > 0 && (
                <div className="bg-accent rounded-xl px-4 py-2.5 text-xs font-semibold text-accent-foreground flex items-center gap-2">
                  <Truck size={15} className="text-primary shrink-0" />
                  {formatEGP(away, lang)} {t.cart.freeShipAway}
                </div>
              )}
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3 bg-card border border-border rounded-2xl p-3">
                  { }
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover bg-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-bold clamp-2 leading-snug">
                        {lang === "ar" ? item.nameAr : item.nameEn}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-muted-foreground hover:text-rose-500 transition-colors shrink-0"
                        aria-label={t.cart.remove}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.brandName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden h-8">
                        <button
                          onClick={() => updateQty(item.productId, item.quantity - 1)}
                          className="w-7 h-full flex items-center justify-center hover:bg-accent"
                          aria-label="decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-full flex items-center justify-center hover:bg-accent disabled:opacity-40"
                          aria-label="increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-primary">
                        {formatEGP(item.price * item.quantity, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4 space-y-3 bg-card">
              {/* promo */}
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value);
                        setPromoError(false);
                      }}
                      placeholder={t.cart.promoPlaceholder}
                      className="w-full h-10 rounded-xl border border-border bg-muted/50 ps-9 pe-3 text-sm outline-none focus:border-primary uppercase"
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading}
                    className="h-10 px-5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    {t.cart.apply}
                  </button>
                </div>
                {promoError && <p className="text-xs text-rose-500 mt-1.5 font-semibold">{t.cart.invalidCode}</p>}
                {!promo && !promoError && (
                  <p className="text-[11px] text-muted-foreground mt-1.5">{t.cart.promoHint}</p>
                )}
                {promo && (
                  <p className="text-xs text-emerald-600 mt-1.5 font-bold">
                    ✓ {promo.code} — {promo.type === "percent" ? `${promo.value}%` : promo.type === "fixed" ? formatEGP(promo.value, lang) : t.cart.free}
                  </p>
                )}
              </div>

              {/* totals */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cart.subtotal}</span>
                  <span className="font-semibold">{formatEGP(totals.subtotal, lang)}</span>
                </div>
                {totals.autoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Tag size={13} /> {t.cart.autoOffer}
                    </span>
                    <span className="font-bold">-{formatEGP(totals.autoDiscount, lang)}</span>
                  </div>
                )}
                {totals.promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-semibold">{t.cart.promoDiscount}</span>
                    <span className="font-bold">-{formatEGP(totals.promoDiscount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cart.shipping}</span>
                  <span className="font-semibold">
                    {totals.shippingFee === 0 ? t.cart.free : formatEGP(totals.shippingFee, lang)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold border-t border-border pt-2">
                  <span>{t.cart.total}</span>
                  <span className="text-primary">{formatEGP(totals.total, lang)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
                className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                {t.cart.checkout} →
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck size={13} className="text-emerald-600" /> {t.trust.secureDesc}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
