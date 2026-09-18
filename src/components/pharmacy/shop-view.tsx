"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, Search, PackageSearch } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import type { Brand, Category, Product } from "@/lib/types";
import { formatEGP } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const MAX_PRICE = 4000;

function FilterPanel({
  categories,
  brands,
  onClose,
}: {
  categories: Category[];
  brands: Brand[];
  onClose?: () => void;
}) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);
  const resetFilters = useApp((s) => s.resetFilters);

  const priceVal = useMemo<[number]>(
    () => [filters.maxPrice ?? MAX_PRICE],
    [filters.maxPrice]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base flex items-center gap-2">
          <SlidersHorizontal size={17} className="text-primary" />
          {t.filters.title}
        </h3>
        <button
          onClick={() => {
            resetFilters();
            onClose?.();
          }}
          className="text-xs font-bold text-rose-500 hover:underline"
        >
          {t.filters.clear}
        </button>
      </div>

      {/* category */}
      <div>
        <p className="text-sm font-bold mb-2.5">{t.filters.category}</p>
        <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pe-1">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox
                checked={filters.category === c.slug}
                onCheckedChange={(v) => {
                  setFilters({ category: v ? c.slug : null });
                  onClose?.();
                }}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {lang === "ar" ? c.nameAr : c.nameEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* brands */}
      <div>
        <p className="text-sm font-bold mb-2.5">{t.filters.brand}</p>
        <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pe-1">
          {brands.map((b) => {
            const checked = filters.brands.includes(b.slug);
            return (
              <label key={b.id} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(v) => {
                    setFilters({
                      brands: v ? [...filters.brands, b.slug] : filters.brands.filter((s) => s !== b.slug),
                    });
                  }}
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {lang === "ar" ? b.nameAr : b.nameEn}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* skin type */}
      <div>
        <p className="text-sm font-bold mb-2.5">{t.filters.skinType}</p>
        <div className="flex flex-wrap gap-2">
          {(["oily", "dry", "combination", "sensitive", "normal", "all"] as const).map((st) => {
            const active = filters.skinTypes.includes(st);
            return (
              <button
                key={st}
                onClick={() =>
                  setFilters({
                    skinTypes: active ? filters.skinTypes.filter((s) => s !== st) : [...filters.skinTypes, st],
                  })
                }
                className={`text-xs font-bold rounded-full px-3 py-1.5 border transition-colors ${
                  active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {t.product.skinTypes[st]}
              </button>
            );
          })}
        </div>
      </div>

      {/* price */}
      <div>
        <p className="text-sm font-bold mb-3">{t.filters.price}</p>
        <Slider
          value={priceVal}
          max={MAX_PRICE}
          step={50}
          onValueChange={(v) => setFilters({ maxPrice: v[0] >= MAX_PRICE ? null : v[0] })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0</span>
          <span className="font-bold text-foreground">
            ≤ {formatEGP(filters.maxPrice ?? MAX_PRICE, lang)}
          </span>
        </div>
      </div>

      {/* rating */}
      <div>
        <p className="text-sm font-bold mb-2.5">{t.filters.rating}</p>
        <div className="flex flex-wrap gap-2">
          {[4.5, 4, 3.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ minRating: filters.minRating === r ? null : r })}
              className={`text-xs font-bold rounded-full px-3 py-1.5 border transition-colors ${
                filters.minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              ⭐ {r}+ {t.filters.andUp}
            </button>
          ))}
        </div>
      </div>

      {/* on sale */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <Checkbox
          checked={filters.onSale}
          onCheckedChange={(v) => setFilters({ onSale: v === true })}
          className="data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
        />
        <span className="text-sm font-bold text-rose-500">{t.filters.onSale}</span>
      </label>
    </div>
  );
}

export function ShopView({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const filters = useApp((s) => s.filters);
  const setFilters = useApp((s) => s.setFilters);

  const [result, setResult] = useState<{ qs: string; products: Product[]; total: number } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (filters.search) p.set("search", filters.search);
    if (filters.category) p.set("category", filters.category);
    if (filters.brands.length) p.set("brands", filters.brands.join(","));
    if (filters.skinTypes.length) p.set("skinTypes", filters.skinTypes.join(","));
    if (filters.minPrice != null) p.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice != null) p.set("maxPrice", String(filters.maxPrice));
    if (filters.onSale) p.set("onSale", "true");
    if (filters.minRating != null) p.set("minRating", String(filters.minRating));
    p.set("sort", filters.sort);
    p.set("limit", "60");
    return p.toString();
  }, [filters]);

  const loading = result?.qs !== qs;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products?${qs}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setResult({ qs, products: data.products ?? [], total: data.total ?? 0 });
      })
      .catch(() => {
        if (!cancelled) setResult({ qs, products: [], total: 0 });
      });
    return () => {
      cancelled = true;
    };
  }, [qs]);

  const activeFilterCount =
    (filters.category ? 1 : 0) +
    filters.brands.length +
    filters.skinTypes.length +
    (filters.maxPrice != null ? 1 : 0) +
    (filters.minRating != null ? 1 : 0) +
    (filters.onSale ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">
            {filters.search ? `"${filters.search}"` : filters.category
              ? (() => {
                  const c = categories.find((x) => x.slug === filters.category);
                  return c ? (lang === "ar" ? c.nameAr : c.nameEn) : t.nav.shop;
                })()
              : t.nav.shop}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? t.common.loading : `${result?.total ?? 0} ${t.filters.results}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* sort */}
          <Select value={filters.sort} onValueChange={(v) => setFilters({ sort: v as typeof filters.sort })}>
            <SelectTrigger className="h-11 rounded-xl w-44 bg-card" aria-label={t.filters.sortBy}>
              <SelectValue placeholder={t.filters.sortBy} />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(t.filters.sort).map(([k, label]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* mobile filter button */}
          <Button variant="outline" onClick={() => setSheetOpen(true)} className="h-11 rounded-xl relative">
            <SlidersHorizontal size={16} className="me-1.5" />
            {t.filters.mobileFilters}
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* active chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {filters.category && (
            <button
              onClick={() => setFilters({ category: null })}
              className="flex items-center gap-1.5 bg-accent rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {(() => {
                const c = categories.find((x) => x.slug === filters.category);
                return c ? (lang === "ar" ? c.nameAr : c.nameEn) : "";
              })()}
              <X size={12} />
            </button>
          )}
          {filters.brands.map((b) => (
            <button
              key={b}
              onClick={() => setFilters({ brands: filters.brands.filter((x) => x !== b) })}
              className="flex items-center gap-1.5 bg-accent rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {(() => {
                const br = brands.find((x) => x.slug === b);
                return br ? (lang === "ar" ? br.nameAr : br.nameEn) : b;
              })()}
              <X size={12} />
            </button>
          ))}
          {filters.onSale && (
            <button
              onClick={() => setFilters({ onSale: false })}
              className="flex items-center gap-1.5 bg-rose-50 text-rose-600 rounded-full px-3 py-1.5 text-xs font-bold"
            >
              {t.filters.onSale}
              <X size={12} />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 bg-card border border-border rounded-2xl p-5 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-thin">
            <FilterPanel categories={categories} brands={brands} />
          </div>
        </aside>

        {/* grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : result && result.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <span className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
                <PackageSearch size={36} className="text-primary" />
              </span>
              <p className="font-extrabold text-lg">{t.filters.noResults}</p>
              <p className="text-sm text-muted-foreground">{t.filters.adjustFilters}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {result.products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side={lang === "ar" ? "left" : "right"} className="w-80 overflow-y-auto scrollbar-thin">
          <SheetHeader>
            <SheetTitle>{t.filters.title}</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <FilterPanel categories={categories} brands={brands} onClose={() => setSheetOpen(false)} />
            <Button onClick={() => setSheetOpen(false)} className="w-full h-11 mt-6 rounded-xl font-bold">
              {t.filters.apply}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
