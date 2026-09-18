import { db } from "@/lib/db";
import { PharmacyApp } from "@/components/pharmacy/pharmacy-app";
import type { Category, Brand } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let categories: Category[] = [];
  let brands: Brand[] = [];
  try {
    const [cats, brs] = await Promise.all([
      db.category.findMany({ orderBy: { sortOrder: "asc" } }),
      db.brand.findMany({ orderBy: { nameEn: "asc" } }),
    ]);
    categories = cats;
    brands = brs;
  } catch (err) {
    console.error("Failed to load categories/brands:", err);
  }

  return <PharmacyApp categories={categories} brands={brands} />;
}
