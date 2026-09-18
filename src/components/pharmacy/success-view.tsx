"use client";

import { CheckCircle2, Package, Phone, Copy } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { formatEGP } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function SuccessView() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const order = useApp((s) => s.lastOrder);
  const setView = useApp((s) => s.setView);

  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
        <span className="inline-flex w-20 h-20 rounded-full bg-emerald-50 items-center justify-center mb-4">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold">{t.success.title}</h1>
        <p className="text-muted-foreground mt-2">{t.success.thanks}</p>

        <div className="my-6 bg-accent/70 rounded-2xl p-5 flex items-center justify-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground">{t.success.orderNumber}:</span>
          <span className="text-lg font-extrabold text-primary tracking-wide" dir="ltr">{order.orderNumber}</span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(order.orderNumber);
              toast({ title: t.success.orderNumber + " ✓" });
            }}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="copy"
          >
            <Copy size={15} />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 text-start">
          <div className="border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">{t.success.eta}</p>
            <p className="font-bold flex items-center gap-2">
              <Package size={16} className="text-primary" />
              {lang === "ar" ? order.etaAr : order.etaEn}
            </p>
          </div>
          <div className="border border-border rounded-2xl p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1">{t.cart.total}</p>
            <p className="font-extrabold text-primary text-lg">{formatEGP(order.total, lang)}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-5 flex items-center justify-center gap-2">
          <Phone size={14} className="text-primary" />
          {t.success.willContact}
        </p>

        <Button
          onClick={() => setView("home")}
          className="mt-6 h-12 px-10 rounded-2xl font-bold text-base bg-primary hover:bg-primary/90"
        >
          {t.success.continueShopping}
        </Button>
      </div>
    </div>
  );
}
