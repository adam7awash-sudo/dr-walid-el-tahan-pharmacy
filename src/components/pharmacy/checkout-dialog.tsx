"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check, ChevronLeft, ChevronRight, CreditCard, Banknote, ShieldCheck, Lock, User, MapPin, Package, FileCheck } from "lucide-react";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import {
  computeTotals, formatEGP, GOVERNORATES, shippingMethodsFor, type ShippingMethod,
} from "@/lib/types";
import { toast } from "@/hooks/use-toast";

type Step = 0 | 1 | 2 | 3;
interface FormState {
  customerName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  address: string;
  notes: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export function CheckoutDialog() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const cart = useApp((s) => s.cart);
  const checkoutOpen = useApp((s) => s.checkoutOpen);
  const setCheckoutOpen = useApp((s) => s.setCheckoutOpen);
  const clearCart = useApp((s) => s.clearCart);
  const setLastOrder = useApp((s) => s.setLastOrder);
  const setView = useApp((s) => s.setView);
  const promo = useApp((s) => s.promo);

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormState>({
    customerName: "", phone: "", email: "", governorate: "", city: "", address: "", notes: "",
    cardName: "", cardNumber: "", cardExpiry: "", cardCvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shipping, setShipping] = useState<ShippingMethod["id"]>("standard");
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [placing, setPlacing] = useState(false);

  const methods = useMemo(
    () => shippingMethodsFor(form.governorate || null),
    [form.governorate]
  );

  useEffect(() => {
    if (checkoutOpen) {
      setStep(0);
      setErrors({});
      setShipping("standard");
      setPayment("cod");
    }
  }, [checkoutOpen]);

  useEffect(() => {
    if (!methods.find((m) => m.id === shipping)) setShipping(methods[0].id);
  }, [methods, shipping]);

  const totals = computeTotals(
    cart.map((c) => ({ price: c.price, quantity: c.quantity })),
    shipping,
    promo
  );

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = t.checkout.required;
    if (!/^01[0-2,5]{1}[0-9]{8}$/.test(form.phone.replace(/\s|-/g, ""))) e.phone = t.checkout.invalidPhone;
    if (!form.governorate) e.governorate = t.checkout.required;
    if (!form.city.trim()) e.city = t.checkout.required;
    if (!form.address.trim()) e.address = t.checkout.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateCard = () => {
    if (payment !== "card") return true;
    const e: Record<string, string> = {};
    if (!form.cardName.trim()) e.cardName = t.checkout.required;
    if (!/^[0-9]{16}$/.test(form.cardNumber.replace(/\s/g, ""))) e.cardNumber = t.checkout.required;
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(form.cardExpiry)) e.cardExpiry = t.checkout.required;
    if (!/^[0-9]{3,4}$/.test(form.cardCvv)) e.cardCvv = t.checkout.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          email: form.email,
          governorate: form.governorate,
          city: form.city,
          address: form.address,
          notes: form.notes,
          shippingMethod: shipping,
          paymentMethod: payment,
          promoCode: promo?.code,
          items: cart.map((c) => ({ productId: c.productId, quantity: c.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: t.common.error, description: data.error ?? "", variant: "destructive" });
        return;
      }
      setLastOrder({ orderNumber: data.orderNumber, total: data.total, etaAr: data.etaAr, etaEn: data.etaEn });
      clearCart();
      setCheckoutOpen(false);
      setView("success");
      window.scrollTo({ top: 0 });
    } catch {
      toast({ title: t.common.error, variant: "destructive" });
    } finally {
      setPlacing(false);
    }
  };

  const steps = [
    { label: t.checkout.stepInfo, icon: User },
    { label: t.checkout.stepShipping, icon: Package },
    { label: t.checkout.stepPayment, icon: CreditCard },
    { label: t.checkout.stepReview, icon: FileCheck },
  ];

  const inputCls = (k: string) =>
    `w-full h-11 rounded-xl border bg-background px-3.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
      errors[k] ? "border-rose-400" : "border-border focus:border-primary"
    }`;

  const err = (k: string) => (errors[k] ? <p className="text-xs text-rose-500 mt-1">{errors[k]}</p> : null);

  return (
    <Dialog open={checkoutOpen} onOpenChange={(v) => !v && setCheckoutOpen(false)}>
      <DialogContent className="max-w-2xl rounded-3xl max-h-[92vh] overflow-y-auto scrollbar-thin">
        <DialogTitle className="text-xl font-extrabold">{t.checkout.title}</DialogTitle>

        {/* steps */}
        <div className="flex items-center gap-1.5 mt-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex-1 flex items-center gap-1.5">
              <span
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span className={`text-[11px] sm:text-xs font-semibold hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <span className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* STEP 0 — info */}
        {step === 0 && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-semibold">{t.checkout.fullName} *</label>
              <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCls("customerName")} />
              {err("customerName")}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">{t.checkout.phone} *</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} dir="ltr" inputMode="tel" placeholder="01xxxxxxxxx" className={inputCls("phone")} />
                {err("phone")}
              </div>
              <div>
                <label className="text-sm font-semibold">{t.checkout.email}</label>
                <input value={form.email} onChange={(e) => set("email", e.target.value)} dir="ltr" inputMode="email" className={inputCls("email")} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">{t.checkout.governorate} *</label>
                <select value={form.governorate} onChange={(e) => set("governorate", e.target.value)} className={inputCls("governorate")}>
                  <option value="">{t.checkout.selectGov}</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g.en} value={g.en}>
                      {lang === "ar" ? g.ar : g.en}
                    </option>
                  ))}
                </select>
                {err("governorate")}
              </div>
              <div>
                <label className="text-sm font-semibold">{t.checkout.city} *</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls("city")} />
                {err("city")}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">{t.checkout.address} *</label>
              <textarea value={form.address} onChange={(e) => set("address", e.target.value)} rows={2} className="w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              {err("address")}
            </div>
            <div>
              <label className="text-sm font-semibold">{t.checkout.notes}</label>
              <input value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputCls("notes")} />
            </div>
          </div>
        )}

        {/* STEP 1 — shipping */}
        {step === 1 && (
          <div className="space-y-3 mt-4">
            <p className="text-sm font-bold flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> {t.checkout.shippingMethod}
            </p>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setShipping(m.id)}
                className={`w-full flex items-center justify-between border-2 rounded-2xl p-4 transition-all ${
                  shipping === m.id ? "border-primary bg-accent/50" : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-start">
                  <span className="block font-bold text-sm">{m.etaAr && lang === "ar" ? m.etaAr.split("·")[0] : m.etaEn.split("·")[0]}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{lang === "ar" ? m.etaAr : m.etaEn}</span>
                </span>
                <span className="font-extrabold text-primary">{formatEGP(m.fee, lang)}</span>
              </button>
            ))}
            <div className="bg-accent rounded-xl p-3 text-xs text-accent-foreground">
              📍 {lang === "ar" ? "القاهرة والجيزة: توصيل في نفس اليوم أو اليوم التالي · باقي المحافظات: 2-7 أيام" :
                "Cairo & Giza: same-day / next-day · Other governorates: 2-7 days"}
            </div>
          </div>
        )}

        {/* STEP 2 — payment */}
        {step === 2 && (
          <div className="space-y-3 mt-4">
            <p className="text-sm font-bold flex items-center gap-2">
              <Lock size={16} className="text-primary" /> {t.checkout.paymentMethod}
            </p>
            {(["cod", "card"] as const).map((pm) => (
              <button
                key={pm}
                onClick={() => setPayment(pm)}
                className={`w-full flex items-center gap-3 border-2 rounded-2xl p-4 transition-all text-start ${
                  payment === pm ? "border-primary bg-accent/50" : "border-border hover:border-primary/40"
                }`}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${pm === "cod" ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"}`}>
                  {pm === "cod" ? <Banknote size={20} /> : <CreditCard size={20} />}
                </span>
                <span>
                  <span className="block font-bold text-sm">{pm === "cod" ? t.checkout.cod : t.checkout.card}</span>
                  <span className="block text-xs text-muted-foreground">{pm === "cod" ? t.checkout.codDesc : t.checkout.cardDesc}</span>
                </span>
              </button>
            ))}
            {payment === "card" && (
              <div className="grid sm:grid-cols-2 gap-3 bg-muted/60 rounded-2xl p-4">
                <div className="sm:col-span-2">
                  <input value={form.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder={t.checkout.cardName} className={inputCls("cardName")} />
                  {err("cardName")}
                </div>
                <div className="sm:col-span-2">
                  <input value={form.cardNumber} onChange={(e) => set("cardNumber", e.target.value)} dir="ltr" inputMode="numeric" placeholder="#### #### #### ####" className={inputCls("cardNumber")} />
                  {err("cardNumber")}
                </div>
                <div>
                  <input value={form.cardExpiry} onChange={(e) => set("cardExpiry", e.target.value)} dir="ltr" placeholder={t.checkout.cardExpiry} className={inputCls("cardExpiry")} />
                  {err("cardExpiry")}
                </div>
                <div>
                  <input value={form.cardCvv} onChange={(e) => set("cardCvv", e.target.value)} dir="ltr" inputMode="numeric" placeholder={t.checkout.cardCvv} className={inputCls("cardCvv")} />
                  {err("cardCvv")}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — review */}
        {step === 3 && (
          <div className="space-y-4 mt-4">
            <div className="bg-muted/60 rounded-2xl p-4 text-sm space-y-1.5">
              <p className="font-bold">{form.customerName}</p>
              <p dir="ltr" className="text-muted-foreground">{form.phone}</p>
              <p className="text-muted-foreground">
                {lang === "ar" ? GOVERNORATES.find((g) => g.en === form.governorate)?.ar : form.governorate} — {form.city}، {form.address}
              </p>
              <p className="text-muted-foreground">
                {methods.find((m) => m.id === shipping)?.[lang === "ar" ? "etaAr" : "etaEn"]}
                {" · "}
                {payment === "cod" ? t.checkout.cod : t.checkout.card}
              </p>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {cart.map((c) => (
                <div key={c.productId} className="flex items-center justify-between text-sm gap-3">
                  <span className="clamp-2 flex-1">
                    {lang === "ar" ? c.nameAr : c.nameEn} <span className="text-muted-foreground">×{c.quantity}</span>
                  </span>
                  <span className="font-semibold shrink-0">{formatEGP(c.price * c.quantity, lang)}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-emerald-600" /> {t.checkout.secureNote} · {t.checkout.reviewNote}
            </p>
          </div>
        )}

        {/* summary + actions */}
        <div className="border-t border-border pt-4 mt-2 space-y-3">
          <div className="bg-accent/60 rounded-2xl p-4 text-sm">
            <p className="font-bold mb-2">{t.checkout.orderSummary}</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.cart.subtotal}</span>
              <span>{formatEGP(totals.subtotal, lang)}</span>
            </div>
            {totals.autoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{t.cart.autoOffer}</span>
                <span>-{formatEGP(totals.autoDiscount, lang)}</span>
              </div>
            )}
            {totals.promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{promo?.code}</span>
                <span>-{formatEGP(totals.promoDiscount, lang)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.cart.shipping}</span>
              <span>{totals.shippingFee === 0 ? t.cart.free : formatEGP(totals.shippingFee, lang)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-base border-t border-border mt-2 pt-2">
              <span>{t.cart.total}</span>
              <span className="text-primary">{formatEGP(totals.total, lang)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => (s - 1) as Step)}
                className="h-12 px-6 rounded-2xl border-2 border-border font-bold flex items-center gap-1.5 hover:bg-accent transition-colors"
              >
                {lang === "ar" ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
                {t.checkout.back}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 0 && !validateInfo()) return;
                  setStep((s) => (s + 1) as Step);
                }}
                className="flex-1 h-12 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
              >
                {t.checkout.next}
                {lang === "ar" ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (validateCard()) placeOrder();
                }}
                disabled={placing || cart.length === 0}
                className="flex-1 h-12 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {placing ? t.checkout.placing : t.checkout.placeOrder}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
