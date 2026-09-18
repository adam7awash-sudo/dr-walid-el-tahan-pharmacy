"use client";

import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { SectionHeader } from "./section-header";

export function ProductRow({
  title,
  subtitle,
  products,
  onViewAll,
  accent,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  onViewAll?: () => void;
  accent?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 pt-12">
      <SectionHeader title={title} subtitle={subtitle} onViewAll={onViewAll} accent={accent} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {products.slice(0, 10).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
