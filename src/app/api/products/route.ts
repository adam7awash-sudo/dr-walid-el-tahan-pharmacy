import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = (sp.get("search") || "").trim();
    const category = sp.get("category") || null;
    const brands = (sp.get("brands") || "").split(",").filter(Boolean);
    const skinTypes = (sp.get("skinTypes") || "").split(",").filter(Boolean);
    const minPrice = sp.get("minPrice") ? parseFloat(sp.get("minPrice")!) : null;
    const maxPrice = sp.get("maxPrice") ? parseFloat(sp.get("maxPrice")!) : null;
    const onSale = sp.get("onSale") === "true";
    const minRating = sp.get("minRating") ? parseFloat(sp.get("minRating")!) : null;
    const featured = sp.get("featured") === "true";
    const limit = Math.min(parseInt(sp.get("limit") || "60", 10), 200);
    const offset = Math.max(parseInt(sp.get("offset") || "0", 10), 0);
    const sort = sp.get("sort") || "featured";

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { nameEn: { contains: q } },
        { nameAr: { contains: q } },
        { descEn: { contains: q } },
        { descAr: { contains: q } },
        { brand: { is: { nameEn: { contains: q } } } },
        { brand: { is: { nameAr: { contains: q } } } },
        { category: { is: { nameEn: { contains: q } } } },
        { category: { is: { nameAr: { contains: q } } } },
      ];
    }
    if (category) where.category = { slug: category };
    if (brands.length > 0) where.brand = { slug: { in: brands } };
    if (skinTypes.length > 0) where.skinType = { in: skinTypes };
    if (minPrice !== null || maxPrice !== null) {
      where.price = {
        ...(minPrice !== null ? { gte: minPrice } : {}),
        ...(maxPrice !== null ? { lte: maxPrice } : {}),
      };
    }
    if (onSale) where.isOnSale = true;
    if (minRating !== null) where.rating = { gte: minRating };
    if (featured) where.isFeatured = true;

    const orderBy: Record<string, string>[] = (() => {
      switch (sort) {
        case "priceLow":
          return [{ price: "asc" }];
        case "priceHigh":
          return [{ price: "desc" }];
        case "rating":
          return [{ rating: "desc" }];
        case "newest":
          return [{ createdAt: "desc" }];
        case "bestSelling":
          return [{ sellCount: "desc" }];
        default:
          return [{ isFeatured: "desc" }, { sellCount: "desc" }];
      }
    })();

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: { category: true, brand: true },
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total });
  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
