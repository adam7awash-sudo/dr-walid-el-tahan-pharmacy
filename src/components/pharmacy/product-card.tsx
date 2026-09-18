"use client";

import { useState } from "react";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatEGP } from "@/lib/types";
import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { RatingStars } from "./rating-stars";
import { toast } from "@/hooks/use-toast";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const addToCart = useApp((s) => s.addToCart);
  const setQuickView = useApp((s) => s.setQuickView);
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const brand = lang === "ar" ? product.brand.nameAr : product.brand.nameEn;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    setAdding(true);
    addToCart(product, 1);
    toast({ title: t.product.added, description: name });
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => setQuickView(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") setQuickView(product);
      }}
      aria-label={name}
    >
      {/* badges */}
      <div className="absolute top-2 start-2 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            {discount}% {t.product.off}
          </span>
        )}
        {product.isFeatured && discount === 0 && (
          <span className="bg-primary text-primary-foreground text-[11px] font-bold px-2 py-0.5 rounded-full">
            {t.common.new}
          </span>
        )}
      </div>
      <button
        className="absolute top-2 end-2 z-10 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setWished((w) => !w);
        }}
        aria-label="wishlist"
      >
        <Heart size={15} className={wished ? "fill-rose-500 text-rose-500" : "text-gray-500"} />
      </button>

      {/* image */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        { }
        <img
          src={product.image}
          alt={name}
          loading={index < 6 ? "eager" : "lazy"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* hover quick actions */}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleAdd}
            disabled={adding || product.stock <= 0}
            className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 disabled:opacity-60 shadow-md"
          >
            <ShoppingBag size={15} />
            {product.stock > 0 ? t.product.addToBag : t.product.outOfStock}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickView(product);
            }}
            className="w-9 bg-white rounded-xl flex items-center justify-center shadow-md hover:bg-gray-50"
            aria-label={t.product.quickView}
          >
            <Eye size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">{brand}</span>
        <h3 className="text-[13px] sm:text-sm font-semibold text-foreground clamp-2 leading-snug min-h-[2.4em]">
          {name}
        </h3>
        <div className="flex items-center gap-1.5">
          <RatingStars rating={product.rating} size={12} />
          <span className="text-[11px] text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-sm sm:text-base font-extrabold text-foreground">{formatEGP(product.price, lang)}</span>
          {product.comparePrice && (
            <span className="text-xs text-muted-foreground line-through">{formatEGP(product.comparePrice, lang)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
