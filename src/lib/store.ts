"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";
import type { Lang } from "@/lib/i18n";

export type View = "home" | "shop" | "success";
export type PolicyKey = "terms" | "privacy" | "delivery" | "stores" | "contact" | "about";

export interface ShopFilters {
  category: string | null; // slug
  brands: string[]; // slugs
  skinTypes: string[];
  minPrice: number | null;
  maxPrice: number | null;
  onSale: boolean;
  minRating: number | null;
  search: string;
  sort: "featured" | "priceLow" | "priceHigh" | "rating" | "newest" | "bestSelling";
}

export interface LastOrder {
  orderNumber: string;
  total: number;
  etaAr: string;
  etaEn: string;
}

export interface AppliedPromo {
  code: string;
  type: string;
  value: number;
}

interface AppState {
  lang: Lang;
  view: View;
  filters: ShopFilters;
  cart: CartItem[];
  cartOpen: boolean;
  checkoutOpen: boolean;
  quickView: Product | null;
  policy: PolicyKey | null;
  lastOrder: LastOrder | null;
  promo: AppliedPromo | null;
  setPromo: (p: AppliedPromo | null) => void;
  setView: (v: View) => void;
  setLang: (l: Lang) => void;
  goHome: () => void;
  openShop: (patch?: Partial<ShopFilters>) => void;
  setFilters: (patch: Partial<ShopFilters>) => void;
  resetFilters: () => void;
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setCartOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  setQuickView: (p: Product | null) => void;
  setPolicy: (p: PolicyKey | null) => void;
  setLastOrder: (o: LastOrder | null) => void;
}

const defaultFilters: ShopFilters = {
  category: null,
  brands: [],
  skinTypes: [],
  minPrice: null,
  maxPrice: null,
  onSale: false,
  minRating: null,
  search: "",
  sort: "featured",
};

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lang: "ar",
      view: "home",
      filters: defaultFilters,
      cart: [],
      cartOpen: false,
      checkoutOpen: false,
      quickView: null,
      policy: null,
      lastOrder: null,
      promo: null,
      setPromo: (p) => set({ promo: p }),
      setView: (v) => set({ view: v }),
      setLang: (l) => set({ lang: l }),
      goHome: () =>
        set({ view: "home", quickView: null, policy: null, checkoutOpen: false, filters: defaultFilters }),
      openShop: (patch) =>
        set((s) => ({ view: "shop", quickView: null, policy: null, filters: { ...defaultFilters, ...patch } })),
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: defaultFilters }),
      addToCart: (p, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((c) => c.productId === p.id);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.productId === p.id ? { ...c, quantity: Math.min(c.quantity + qty, p.stock) } : c
              ),
            };
          }
          const item: CartItem = {
            productId: p.id,
            slug: p.slug,
            nameEn: p.nameEn,
            nameAr: p.nameAr,
            price: p.price,
            image: p.image,
            brandName: p.brand.nameEn,
            quantity: Math.min(qty, p.stock),
            stock: p.stock,
          };
          return { cart: [...s.cart, item] };
        }),
      updateQty: (productId, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.productId !== productId)
              : s.cart.map((c) => (c.productId === productId ? { ...c, quantity: Math.min(qty, c.stock) } : c)),
        })),
      removeFromCart: (productId) => set((s) => ({ cart: s.cart.filter((c) => c.productId !== productId) })),
      clearCart: () => set({ cart: [] }),
      setCartOpen: (v) => set({ cartOpen: v }),
      setCheckoutOpen: (v) => set({ checkoutOpen: v }),
      setQuickView: (p) => set({ quickView: p }),
      setPolicy: (p) => set({ policy: p }),
      setLastOrder: (o) => set({ lastOrder: o }),
    }),
    {
      name: "eltahan-pharmacy",
      partialize: (s) => ({ lang: s.lang, cart: s.cart }),
    }
  )
);
