import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeTotals, shippingMethodsFor } from "@/lib/types";

export const dynamic = "force-dynamic";

interface IncomingItem {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      email,
      governorate,
      city,
      address,
      notes,
      shippingMethod,
      paymentMethod,
      promoCode,
      items,
    } = body as {
      customerName?: string;
      phone?: string;
      email?: string;
      governorate?: string;
      city?: string;
      address?: string;
      notes?: string;
      shippingMethod?: string;
      paymentMethod?: string;
      promoCode?: string;
      items?: IncomingItem[];
    };

    // ---- validation ----
    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: "name_required" }, { status: 400 });
    }
    if (!phone || !/^01[0-2,5]{1}[0-9]{8}$/.test(phone.replace(/\s|-/g, ""))) {
      return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
    }
    if (!governorate || !city || !address || !address.trim()) {
      return NextResponse.json({ error: "address_required" }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "empty_order" }, { status: 400 });
    }
    const allowedShipping = shippingMethodsFor(governorate).map((m) => m.id);
    const sm = allowedShipping.includes(shippingMethod) ? shippingMethod : "standard";
    const pm = paymentMethod === "card" ? "card" : "cod";

    // ---- fetch products and validate stock ----
    const ids = items.map((i) => i.productId);
    const products = await db.product.findMany({ where: { id: { in: ids } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const it of items) {
      const p = productMap.get(it.productId);
      if (!p) return NextResponse.json({ error: "product_not_found" }, { status: 400 });
      if (!it.quantity || it.quantity < 1) {
        return NextResponse.json({ error: "invalid_quantity" }, { status: 400 });
      }
      if (p.stock < it.quantity) {
        return NextResponse.json({ error: "insufficient_stock", product: p.nameEn }, { status: 409 });
      }
    }

    const lineItems = items.map((it) => {
      const p = productMap.get(it.productId)!;
      return { price: p.price, quantity: Math.floor(it.quantity) };
    });

    // ---- promo code ----
    let promo: { code: string; type: string; value: number } | null = null;
    if (promoCode) {
      const pc = await db.promoCode.findUnique({ where: { code: promoCode.trim().toUpperCase() } });
      if (pc && pc.active) {
        const subtotalCheck = lineItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const autoCheck = Math.floor(0); // auto discount applied inside computeTotals anyway
        const afterAuto = subtotalCheck - autoCheck;
        if (afterAuto >= pc.minTotal) {
          promo = { code: pc.code, type: pc.type, value: pc.value };
        }
      }
    }

    const totals = computeTotals(lineItems, sm as "sameday" | "saver" | "standard", promo);

    const orderNumber = `WT-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        phone,
        email: email || null,
        governorate,
        city,
        address,
        notes: notes || null,
        shippingMethod: sm,
        paymentMethod: pm,
        subtotal: totals.subtotal,
        autoDiscount: totals.autoDiscount,
        promoDiscount: totals.promoDiscount,
        promoCode: promo?.code ?? null,
        shippingFee: totals.shippingFee,
        total: totals.total,
        status: "pending",
        items: {
          create: items.map((it) => {
            const p = productMap.get(it.productId)!;
            return {
              productId: p.id,
              nameEn: p.nameEn,
              nameAr: p.nameAr,
              price: p.price,
              quantity: Math.floor(it.quantity),
            };
          }),
        },
      },
      include: { items: true },
    });

    // ---- decrement stock + increment sell count ----
    await Promise.all(
      items.map((it) =>
        db.product.update({
          where: { id: it.productId },
          data: {
            stock: { decrement: Math.floor(it.quantity) },
            sellCount: { increment: Math.floor(it.quantity) },
          },
        })
      )
    );

    const methods = shippingMethodsFor(governorate);
    const m = methods.find((x) => x.id === sm)!;

    return NextResponse.json({
      orderNumber: order.orderNumber,
      total: order.total,
      etaAr: m.etaAr,
      etaEn: m.etaEn,
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
