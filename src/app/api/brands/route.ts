import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { nameEn: "asc" },
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ brands });
  } catch (err) {
    console.error("GET /api/brands error:", err);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
