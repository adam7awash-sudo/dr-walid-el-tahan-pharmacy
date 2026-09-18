import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ valid: false, error: "Code required" }, { status: 400 });
    }
    const promo = await db.promoCode.findUnique({
      where: { code: code.trim().toUpperCase() },
    });
    if (!promo || !promo.active) {
      return NextResponse.json({ valid: false, error: "invalid" });
    }
    if (subtotal != null && subtotal < promo.minTotal) {
      return NextResponse.json({ valid: false, error: "min_total", minTotal: promo.minTotal });
    }
    return NextResponse.json({
      valid: true,
      code: promo.code,
      type: promo.type,
      value: promo.value,
      minTotal: promo.minTotal,
    });
  } catch (err) {
    console.error("POST /api/promo error:", err);
    return NextResponse.json({ error: "Failed to validate promo" }, { status: 500 });
  }
}
