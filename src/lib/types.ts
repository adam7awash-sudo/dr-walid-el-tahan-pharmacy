export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  icon: string;
  color: string;
  isSpecial: boolean;
  sortOrder: number;
}

export interface Brand {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  color: string;
}

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  comparePrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  skinType: string | null;
  isFeatured: boolean;
  isOnSale: boolean;
  sellCount: number;
  categoryId: string;
  category: Category;
  brandId: string;
  brand: Brand;
}

export interface CartItem {
  productId: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  brandName: string;
  quantity: number;
  stock: number;
}

export interface ShippingMethod {
  id: "sameday" | "saver" | "standard";
  fee: number;
  etaEn: string;
  etaAr: string;
}

export const GOVERNORATES: { en: string; ar: string; metro: boolean }[] = [
  { en: "Cairo", ar: "القاهرة", metro: true },
  { en: "Giza", ar: "الجيزة", metro: true },
  { en: "Alexandria", ar: "الإسكندرية", metro: false },
  { en: "Qalyubia", ar: "القليوبية", metro: false },
  { en: "Port Said", ar: "بورسعيد", metro: false },
  { en: "Suez", ar: "السويس", metro: false },
  { en: "Damietta", ar: "دمياط", metro: false },
  { en: "Dakahlia", ar: "الدقهلية", metro: false },
  { en: "Sharqia", ar: "الشرقية", metro: false },
  { en: "Monufia", ar: "المنوفية", metro: false },
  { en: "Gharbia", ar: "الغربية", metro: false },
  { en: "Beheira", ar: "البحيرة", metro: false },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ", metro: false },
  { en: "Ismailia", ar: "الإسماعيلية", metro: false },
  { en: "Fayoum", ar: "الفيوم", metro: false },
  { en: "Beni Suef", ar: "بني سويف", metro: false },
  { en: "Minya", ar: "المنيا", metro: false },
  { en: "Asyut", ar: "أسيوط", metro: false },
  { en: "Sohag", ar: "سوهاج", metro: false },
  { en: "Qena", ar: "قنا", metro: false },
  { en: "Luxor", ar: "الأقصر", metro: false },
  { en: "Aswan", ar: "أسوان", metro: false },
  { en: "Red Sea", ar: "البحر الأحمر", metro: false },
  { en: "New Valley", ar: "الوادي الجديد", metro: false },
  { en: "Matrouh", ar: "مطروح", metro: false },
  { en: "North Sinai", ar: "شمال سيناء", metro: false },
  { en: "South Sinai", ar: "جنوب سيناء", metro: false },
];

export const FREE_SHIPPING_THRESHOLD = 1500;
export const AUTO_OFF_RATE = 0.4; // 2nd item 40% off

export interface Totals {
  subtotal: number;
  autoDiscount: number;
  promoDiscount: number;
  shippingFee: number;
  total: number;
}

export function computeAutoDiscount(items: { price: number; quantity: number }[]): number {
  let d = 0;
  for (const it of items) {
    const pairs = Math.floor(it.quantity / 2);
    d += pairs * it.price * AUTO_OFF_RATE;
  }
  return Math.round(d * 100) / 100;
}

export function computeTotals(
  items: { price: number; quantity: number }[],
  shippingMethodId: ShippingMethod["id"],
  promo: { type: string; value: number } | null
): Totals {
  const subtotal = Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
  const autoDiscount = computeAutoDiscount(items);
  const afterAuto = subtotal - autoDiscount;

  let shippingFee = shippingMethodId === "sameday" ? 35 : shippingMethodId === "saver" ? 30 : 45;
  let promoDiscount = 0;

  if (promo) {
    if (promo.type === "freeship") {
      shippingFee = 0;
    } else if (promo.type === "percent") {
      promoDiscount = Math.round(afterAuto * (promo.value / 100) * 100) / 100;
    } else if (promo.type === "fixed") {
      promoDiscount = Math.min(promo.value, afterAuto);
    }
  }

  if (afterAuto >= FREE_SHIPPING_THRESHOLD) shippingFee = 0;

  const total = Math.max(0, Math.round((afterAuto - promoDiscount + shippingFee) * 100) / 100);
  return { subtotal, autoDiscount, promoDiscount, shippingFee, total };
}

export function shippingMethodsFor(governorate: string | null): ShippingMethod[] {
  const metro = governorate === "Cairo" || governorate === "Giza";
  if (metro) {
    return [
      { id: "sameday", fee: 35, etaEn: "Same-day / next-day · Cairo & Giza", etaAr: "توصيل في نفس اليوم أو اليوم التالي · القاهرة والجيزة" },
      { id: "saver", fee: 30, etaEn: "Super Saver · 2-3 days", etaAr: "الوفر الذكي · 2-3 أيام" },
      { id: "standard", fee: 45, etaEn: "Standard · 2-7 days", etaAr: "عادي · 2-7 أيام" },
    ];
  }
  return [
    { id: "standard", fee: 45, etaEn: "Standard · 2-7 days (other governorates)", etaAr: "عادي · 2-7 أيام (باقي المحافظات)" },
  ];
}

export function formatEGP(n: number, lang: "ar" | "en"): string {
  const v = new Intl.NumberFormat("en-EG", { maximumFractionDigits: 2, minimumFractionDigits: n % 1 === 0 ? 0 : 2 }).format(n);
  return lang === "ar" ? `${v} ج.م` : `${v} EGP`;
}
