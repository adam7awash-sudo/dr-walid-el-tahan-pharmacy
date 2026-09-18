"use client";

import { useEffect, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { Header } from "./header";
import { Hero } from "./hero";
import { TrustStrip } from "./trust-strip";
import { CategoryGrid } from "./category-grid";
import { BrandsShowcase } from "./brands-showcase";
import { FlashSale } from "./flash-sale";
import { BogoBanner } from "./bogo-banner";
import { ProductRow } from "./product-row";
import { SupportSection } from "./support-section";
import { Footer } from "./footer";

interface HomeData {
  featured: Product[];
  onSale: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  kbeauty: Product[];
  homeScents: Product[];
  dermo: Product[];
}

export function HomeView({ categories, brands }: { categories: Category[]; brands: Product["brand"][] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const openShop = useApp((s) => s.openShop);
  const [data, setData] = useState<HomeData | null>(null);

  useEffect(() => {
    const load = async (qs: string) => {
      const res = await fetch(`/api/products?${qs}`);
      const json = await res.json();
      return (json.products ?? []) as Product[];
    };
    Promise.all([
      load("featured=true&limit=10"),
      load("onSale=true&sort=priceLow&limit=12"),
      load("sort=bestSelling&limit=10"),
      load("sort=newest&limit=5"),
      load("category=k-beauty&limit=5"),
      load("category=home-scents&limit=5"),
      load("category=dermocosmetics&limit=5"),
    ])
      .then(([featured, onSale, bestSellers, newArrivals, kbeauty, homeScents, dermo]) =>
        setData({ featured, onSale, bestSellers, newArrivals, kbeauty, homeScents, dermo })
      )
      .catch(() => setData({ featured: [], onSale: [], bestSellers: [], newArrivals: [], kbeauty: [], homeScents: [], dermo: [] }));
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <CategoryGrid categories={categories} />
        {data && <FlashSale products={data.onSale} />}
        <ProductRow
          title={t.sections.bestSellers}
          subtitle={t.sections.bestSellersSub}
          products={data?.bestSellers ?? []}
          onViewAll={() => openShop({ sort: "bestSelling" })}
        />
        <BogoBanner />
        <ProductRow
          title={t.sections.forYou}
          subtitle={t.sections.featuredSub}
          products={data?.featured ?? []}
          onViewAll={() => openShop({})}
          accent=""
        />
        <BrandsShowcase brands={brands} />
        <ProductRow
          title={t.nav.kbeauty}
          subtitle={lang === "ar" ? "روتين الكوري الأصلي لبشرة مثالية" : "Authentic Korean routines for flawless skin"}
          products={data?.kbeauty ?? []}
          onViewAll={() => openShop({ category: "k-beauty" })}
        />
        <ProductRow
          title={t.nav.dermo}
          subtitle={lang === "ar" ? "ماركات موصى بها من أطباء الجلدية" : "Dermatologist-recommended brands"}
          products={data?.dermo ?? []}
          onViewAll={() => openShop({ category: "dermocosmetics" })}
        />
        <ProductRow
          title={t.sections.newArrivals}
          subtitle={undefined}
          products={data?.newArrivals ?? []}
          onViewAll={() => openShop({ sort: "newest" })}
        />
        <SupportSection />
      </main>
      <Footer categories={categories} />
    </>
  );
}
