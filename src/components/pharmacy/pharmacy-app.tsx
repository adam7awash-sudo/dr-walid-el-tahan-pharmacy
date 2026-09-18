"use client";

import { useEffect } from "react";
import type { Brand, Category } from "@/lib/types";
import { useApp } from "@/lib/store";
import { Header } from "./header";
import { HomeView } from "./home-view";
import { ShopView } from "./shop-view";
import { SuccessView } from "./success-view";
import { Footer } from "./footer";
import { QuickView } from "./quick-view";
import { CartDrawer } from "./cart-drawer";
import { CheckoutDialog } from "./checkout-dialog";
import { PolicyDialog } from "./policy-dialog";

export function PharmacyApp({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const lang = useApp((s) => s.lang);
  const view = useApp((s) => s.view);

  // keep <html> dir/lang in sync
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // close overlay states with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        useApp.getState().setQuickView(null);
        useApp.getState().setPolicy(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {view === "home" && <HomeView categories={categories} brands={brands} />}
      {view === "shop" && (
        <>
          <Header />
          <main className="flex-1">
            <ShopView categories={categories} brands={brands} />
          </main>
          <Footer categories={categories} />
        </>
      )}
      {view === "success" && (
        <>
          <Header />
          <main className="flex-1">
            <SuccessView />
          </main>
          <Footer categories={categories} />
        </>
      )}

      {/* overlays */}
      <QuickView />
      <CartDrawer />
      <CheckoutDialog />
      <PolicyDialog />
    </div>
  );
}
