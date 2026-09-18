/* Seed script for Dr. Walid El-Tahan Pharmacy
 * Run: bun prisma/seed.ts
 * Reads image pools from .assets/*.json (image-search results) with SVG fallback.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const db = new PrismaClient();

const ASSETS = path.join(__dirname, "..", ".assets");

function placeholderSVG(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0f2fe"/><stop offset="1" stop-color="#a5d8e8"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><rect x="255" y="200" width="90" height="200" rx="24" fill="#0e7490" opacity="0.85"/><rect x="255" y="230" width="90" height="40" fill="#ffffff" opacity="0.9"/><circle cx="345" cy="220" r="26" fill="#14b8a6" opacity="0.8"/><text x="300" y="470" font-family="Arial" font-size="26" fill="#0e7490" text-anchor="middle">${text}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

type Pools = Record<string, string[]>;

function loadPools(): Pools {
  const pools: Pools = {};
  try {
    for (const f of fs.readdirSync(ASSETS)) {
      if (!f.endsWith(".json")) continue;
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(ASSETS, f), "utf-8"));
        if (raw && raw.success && Array.isArray(raw.results)) {
          const urls = raw.results
            .map((r: { original_url?: string }) => r.original_url)
            .filter((u: unknown): u is string => typeof u === "string" && u.startsWith("http"));
          if (urls.length > 0) pools[f.replace(".json", "")] = urls;
        }
      } catch {
        /* skip bad file */
      }
    }
    // locally generated pool images (lower priority than real search photos)
    for (const f of fs.readdirSync(ASSETS)) {
      if (f.startsWith("gen-") && f.endsWith(".png")) {
        const pool = f.replace("gen-", "").replace(".png", "");
        if (!pools[pool]) pools[pool] = [`/assets/${f}`];
      }
    }
  } catch {
    /* assets dir missing */
  }
  return pools;
}

function pick(pools: Pools, pool: string, idx: number, label: string): string {
  const urls = pools[pool];
  if (urls && urls.length > 0) return urls[idx % urls.length];
  return placeholderSVG(label);
}

interface SeedProduct {
  slug: string;
  nameEn: string;
  nameAr: string;
  descEn: string;
  descAr: string;
  price: number;
  comparePrice?: number;
  pool: string;
  poolIdx?: number;
  rating: number;
  reviews: number;
  stock: number;
  skinType?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  sellCount: number;
  category: string;
  brand: string;
}

const categories = [
  { slug: "skin-care", nameEn: "Skin Care", nameAr: "العناية بالبشرة", icon: "Sparkles", color: "#0e7490", sortOrder: 1 },
  { slug: "hair-care", nameEn: "Hair Care", nameAr: "العناية بالشعر", icon: "Brush", color: "#0d9488", sortOrder: 2 },
  { slug: "bath-body", nameEn: "Bath & Body", nameAr: "الاستحمام والجسم", icon: "Bath", color: "#059669", sortOrder: 3 },
  { slug: "oral-care", nameEn: "Oral Care", nameAr: "العناية بالأسنان", icon: "Smile", color: "#0891b2", sortOrder: 4 },
  { slug: "eye-care", nameEn: "Eye & Nose Care", nameAr: "العناية بالعيون والأنف", icon: "Eye", color: "#0e7490", sortOrder: 5 },
  { slug: "personal-care", nameEn: "Personal Care", nameAr: "العناية الشخصية", icon: "Hand", color: "#0d9488", sortOrder: 6 },
  { slug: "vitamins-supplements", nameEn: "Vitamins & Supplements", nameAr: "الفيتامينات والمكملات", icon: "Pill", color: "#16a34a", sortOrder: 7 },
  { slug: "medical-devices", nameEn: "Medical Devices", nameAr: "الأجهزة الطبية", icon: "Stethoscope", color: "#0f766e", sortOrder: 8 },
  { slug: "makeup", nameEn: "Makeup", nameAr: "المكياج", icon: "Palette", color: "#db2777", sortOrder: 9 },
  { slug: "fragrances", nameEn: "Perfumes & Fragrances", nameAr: "العطور", icon: "SprayCan", color: "#b45309", sortOrder: 10 },
  { slug: "mother-baby", nameEn: "Mother & Baby", nameAr: "الأم والطفل", icon: "Baby", color: "#f472b6", sortOrder: 11 },
  { slug: "k-beauty", nameEn: "K-Beauty", nameAr: "كي-بيوتي", icon: "Flower2", color: "#be185d", sortOrder: 12, isSpecial: true },
  { slug: "dermocosmetics", nameEn: "Dermocosmetics", nameAr: "ديرموكوزميكس", icon: "FlaskConical", color: "#1d4ed8", sortOrder: 13, isSpecial: true },
  { slug: "home-scents", nameEn: "Home Scents", nameAr: "روائح المنزل", icon: "Home", color: "#92400e", sortOrder: 14, isSpecial: true },
];

const brands = [
  { slug: "la-roche-posay", nameEn: "La Roche-Posay", nameAr: "لا روش بوزيه", color: "#0f4c81" },
  { slug: "cerave", nameEn: "CeraVe", nameAr: "سيرافي", color: "#1c3f6e" },
  { slug: "vichy", nameEn: "Vichy", nameAr: "فيشي", color: "#00539f" },
  { slug: "the-ordinary", nameEn: "The Ordinary", nameAr: "ذي أورديناري", color: "#1a1a1a" },
  { slug: "bioderma", nameEn: "Bioderma", nameAr: "بيوديرما", color: "#0093b2" },
  { slug: "eucerin", nameEn: "Eucerin", nameAr: "أويسرين", color: "#004f9f" },
  { slug: "avene", nameEn: "Avène", nameAr: "أفين", color: "#0083a3" },
  { slug: "neutrogena", nameEn: "Neutrogena", nameAr: "نيوتروجينا", color: "#2b6a6b" },
  { slug: "nivea", nameEn: "Nivea", nameAr: "نيفيا", color: "#0054a6" },
  { slug: "loreal-paris", nameEn: "L'Oréal Paris", nameAr: "لوريال باريس", color: "#1a1a1a" },
  { slug: "maybelline", nameEn: "Maybelline", nameAr: "ميبلين", color: "#c2185b" },
  { slug: "garnier", nameEn: "Garnier", nameAr: "جارنييه", color: "#37a737" },
  { slug: "eva", nameEn: "EVA Cosmetics", nameAr: "إيفا", color: "#d63384" },
  { slug: "dove", nameEn: "Dove", nameAr: "دوف", color: "#004890" },
  { slug: "pampers", nameEn: "Pampers", nameAr: "بامبرز", color: "#00b5e2" },
  { slug: "lattafa", nameEn: "Lattafa", nameAr: "لطافة", color: "#b8860b" },
  { slug: "armaf", nameEn: "Armaf", nameAr: "أرماف", color: "#92400e" },
  { slug: "cosrx", nameEn: "COSRX", nameAr: "كوز آر إكس", color: "#4a4a4a" },
  { slug: "chicco", nameEn: "Chicco", nameAr: "كيكو", color: "#0288d1" },
  { slug: "omron", nameEn: "Omron", nameAr: "أومرون", color: "#00a0e3" },
];

const P = (p: SeedProduct) => p;

const products: SeedProduct[] = [
  // ---------- Skin care ----------
  P({ slug: "cerave-moisturizing-cream", nameEn: "CeraVe Moisturizing Cream 454g", nameAr: "سيرافي كريم مرطب 454 جم", descEn: "Rich moisturizing cream with 3 essential ceramides and hyaluronic acid for dry to very dry skin on face and body. Fragrance-free, non-comedogenic.", descAr: "كريم مرطب غني بثلاث سيراميدات أساسية وحمض الهيالورونيك للبشرة الجافة جدًا على الوجه والجسم. خالٍ من العطور ولا يسد المسام.", price: 480, comparePrice: 560, pool: "cerave", poolIdx: 0, rating: 4.8, reviews: 1240, stock: 80, skinType: "dry", isFeatured: true, isOnSale: true, sellCount: 3200, category: "skin-care", brand: "cerave" }),
  P({ slug: "cerave-foaming-cleanser", nameEn: "CeraVe Foaming Facial Cleanser 355ml", nameAr: "سيرافي جل رغوي منظف للوجه 355 مل", descEn: "Gel-to-foam cleanser that removes oil and dirt without disrupting the skin barrier. Ideal for normal to oily skin.", descAr: "منظف يتحول لرغوة يزيل الزيوت والأوساخ دون الإضرار بحاجز البشرة. مثالي للبشرة العادية إلى الدهنية.", price: 355, pool: "cerave", poolIdx: 1, rating: 4.7, reviews: 860, stock: 70, skinType: "oily", sellCount: 2100, category: "skin-care", brand: "cerave" }),
  P({ slug: "cerave-sa-smoothing", nameEn: "CeraVe SA Smoothing Cream 340g", nameAr: "سيرافي كريم تنعيم بحمض الساليسيليك 340 جم", descEn: "Salicylic acid and ceramides cream that gently exfoliates and smooths rough, bumpy skin on body.", descAr: "كريم بحمض الساليسيليك والسيراميدات يقشر بلطف وينعم خشونة جلد الجسم.", price: 420, pool: "cerave", poolIdx: 2, rating: 4.6, reviews: 540, stock: 55, skinType: "combination", sellCount: 980, category: "skin-care", brand: "cerave" }),
  P({ slug: "cerave-eye-repair", nameEn: "CeraVe Eye Repair Cream 14ml", nameAr: "سيرافي كريم العين 14 مل", descEn: "Brightening eye cream with ceramides, niacinamide and hyaluronic acid to reduce dark circles and puffiness.", descAr: "كريم العين المفتح بالسيراميدات والنياسيناميد وحمض الهيالورونيك لتقليل الهالات السوداء والانتفاخ.", price: 460, pool: "cerave", poolIdx: 0, rating: 4.5, reviews: 320, stock: 40, skinType: "all", sellCount: 640, category: "skin-care", brand: "cerave" }),
  P({ slug: "ordinary-niacinamide", nameEn: "The Ordinary Niacinamide 10% + Zinc 1%", nameAr: "ذي أورديناري نياسيناميد 10% + زنك 1%", descEn: "Water-based vitamin and mineral formula that reduces the appearance of skin blemishes and congestion.", descAr: "تركيبة مائية بالفيتامينات والمعادن تقلل ظهور حبوب البشرة والانسدادات.", price: 350, pool: "ordinary", poolIdx: 0, rating: 4.7, reviews: 1520, stock: 90, skinType: "oily", isFeatured: true, sellCount: 2800, category: "skin-care", brand: "the-ordinary" }),
  P({ slug: "ordinary-hyaluronic", nameEn: "The Ordinary Hyaluronic Acid 2% + B5", nameAr: "ذي أورديناري حمض الهيالورونيك 2% + B5", descEn: "Hydration support formula with multi-depth hyaluronic acid for plumper, smoother skin.", descAr: "تركيبة ترطيب متعددة الأعماق بحمض الهيالورونيك لبشرة أكثر امتلاءً ونعومة.", price: 380, pool: "ordinary", poolIdx: 1, rating: 4.6, reviews: 1100, stock: 85, skinType: "dry", sellCount: 1900, category: "skin-care", brand: "the-ordinary" }),
  P({ slug: "ordinary-glycolic", nameEn: "The Ordinary Glycolic Acid 7% Toner", nameAr: "ذي أورديناري تونر حمض الجليكوليك 7%", descEn: "Glycolic acid toner that gently exfoliates, brightens and evens skin tone.", descAr: "تونر بحمض الجليكوليك يقشر بلطف ويفتح البشرة ويوحّد لونها.", price: 420, pool: "ordinary", poolIdx: 2, rating: 4.5, reviews: 780, stock: 60, skinType: "combination", sellCount: 1200, category: "skin-care", brand: "the-ordinary" }),
  P({ slug: "ordinary-caffeine", nameEn: "The Ordinary Caffeine Solution 5% + EGCG", nameAr: "ذي أورديناري كافيين 5% + EGCG", descEn: "Lightweight serum that reduces the appearance of eye contours puffiness and dark circles.", descAr: "سيروم خفيف يقلل انتفاخ محيط العين والهالات السوداء.", price: 300, pool: "ordinary", poolIdx: 0, rating: 4.4, reviews: 620, stock: 70, skinType: "all", sellCount: 1100, category: "skin-care", brand: "the-ordinary" }),
  P({ slug: "vichy-aqualia", nameEn: "Vichy Aqualia Thermal Hydrating Cream 50ml", nameAr: "فيشي أكواليا كريم ترطيب 50 مل", descEn: "Dynamic hydration cream with 15% Vichy volcanic mineralizing water for 48h moisture.", descAr: "كريم ترطيب متجدد بـ15% من المياه المعدنية البركانية فيشي لترطيب يدوم 48 ساعة.", price: 480, pool: "vichy", poolIdx: 1, rating: 4.6, reviews: 430, stock: 50, skinType: "dry", sellCount: 700, category: "skin-care", brand: "vichy" }),
  P({ slug: "neutrogena-hydroboost", nameEn: "Neutrogena Hydro Boost Water Gel 50ml", nameAr: "نيوتروجينا هايدرو بوست جل مائي 50 مل", descEn: "Oil-free water gel with hyaluronic acid that quenches skin for 72 hours.", descAr: "جل مائي خالٍ من الزيوت بحمض الهيالورونيك يرطب البشرة لمدة 72 ساعة.", price: 420, pool: "skincare", poolIdx: 0, rating: 4.6, reviews: 890, stock: 65, skinType: "combination", isFeatured: true, sellCount: 1600, category: "skin-care", brand: "neutrogena" }),
  P({ slug: "eva-collagen-cream", nameEn: "EVA Skin Care Collagen Day Cream 75ml", nameAr: "إيفا سكن كير كريم كولاجين نهاري 75 مل", descEn: "Egyptian daily cream with marine collagen and vitamin E for soft, supple skin.", descAr: "كريم يومي مصري بالكولاجين البحري وفيتامين E لبشرة ناعمة ومرنة.", price: 95, pool: "skincare", poolIdx: 1, rating: 4.3, reviews: 1500, stock: 120, skinType: "normal", sellCount: 4200, category: "skin-care", brand: "eva" }),
  P({ slug: "eucerin-sun-oil-control", nameEn: "Eucerin Sun Oil Control SPF50+ 50ml", nameAr: "أويسرين صن واقي شمس للبشرة الدهنية SPF50+ 50 مل", descEn: "Dry-touch sun gel-cream with very high SPF protection and 8h oil control for oily skin.", descAr: "جلس-كريم شمس بملمس جاف وحماية عالية جدًا وتحكم في اللمعان 8 ساعات للبشرة الدهنية.", price: 590, comparePrice: 690, pool: "eucerin", poolIdx: 0, rating: 4.7, reviews: 560, stock: 45, skinType: "oily", isOnSale: true, sellCount: 850, category: "skin-care", brand: "eucerin" }),

  // ---------- Dermocosmetics ----------
  P({ slug: "lrp-anthelios-uv", nameEn: "La Roche-Posay Anthelios UV Mune 400 SPF50+ 50ml", nameAr: "لا روش بوزيه أنثيليوس UV مون 400 SPF50+ 50 مل", descEn: "Advanced daily sunscreen with exclusive UV Mune 400 filter, invisible fluid for sensitive skin.", descAr: "واقي شمس يومي متطور بفلتر UV مون 400 الحصري، سائل شفاف للبشرة الحساسة.", price: 675, comparePrice: 790, pool: "lrp", poolIdx: 0, rating: 4.9, reviews: 2100, stock: 60, skinType: "all", isFeatured: true, isOnSale: true, sellCount: 3500, category: "dermocosmetics", brand: "la-roche-posay" }),
  P({ slug: "lrp-effaclar-gel", nameEn: "La Roche-Posay Effaclar Purifying Gel 400ml", nameAr: "لا روش بوزيه إيفاكلار جل منقي 400 مل", descEn: "Purifying foaming gel for oily, acne-prone skin. Removes impurities without over-drying.", descAr: "جل رغوي منقي للبشرة الدهنية المعرضة لحب الشباب، يزيل الشوائب دون جفاف زائد.", price: 450, pool: "lrp", poolIdx: 1, rating: 4.7, reviews: 940, stock: 70, skinType: "oily", sellCount: 1700, category: "dermocosmetics", brand: "la-roche-posay" }),
  P({ slug: "lrp-lipikar-baume", nameEn: "La Roche-Posay Lipikar Baume AP+M 400ml", nameAr: "لا روش بوزيه ليبكار بال ap+M 400 مل", descEn: "Anti-itching body balm for very dry skin, suitable for the whole family including babies.", descAr: "بلسم الجسم المضاد للحكة للبشرة الجافة جدًا، مناسب لكل العائلة حتى الرضع.", price: 520, pool: "lrp", poolIdx: 2, rating: 4.8, reviews: 1180, stock: 55, skinType: "dry", sellCount: 1500, category: "dermocosmetics", brand: "la-roche-posay" }),
  P({ slug: "lrp-toleriane-cleanser", nameEn: "La Roche-Posay Toleriane Gentle Cleanser 400ml", nameAr: "لا روش بوزيه توليريان منظف لطيف 400 مل", descEn: "Fragrance-free milky cleanser that respects sensitive skin's physiological balance.", descAr: "منظف لطيف خالٍ من العطور يحافظ على التوازن الطبيعي للبشرة الحساسة.", price: 390, pool: "lrp", poolIdx: 0, rating: 4.6, reviews: 640, stock: 60, skinType: "sensitive", sellCount: 900, category: "dermocosmetics", brand: "la-roche-posay" }),
  P({ slug: "lrp-cicaplast-b5", nameEn: "La Roche-Posay Cicaplast Baume B5+ 100ml", nameAr: "لا روش بوزيه سيكابلاست بال B5+ 100 مل", descEn: "Repairing balm with panthenol and madecassoside that soothes and accelerates skin recovery.", descAr: "بلسم إصلاح بالبانثينول وماديكاسوسايد يهدئ ويسرّع تعافي البشرة.", price: 380, pool: "lrp", poolIdx: 1, rating: 4.8, reviews: 1320, stock: 75, skinType: "sensitive", isFeatured: true, sellCount: 2400, category: "dermocosmetics", brand: "la-roche-posay" }),
  P({ slug: "vichy-mineral-89", nameEn: "Vichy Mineral 89 Booster 50ml", nameAr: "فيشي مينرال 89 معزز الترطيب 50 مل", descEn: "89% Vichy volcanic water and hyaluronic acid fortifying daily booster — skin's daily dose of strength.", descAr: "معزز يومي مقوٍّ بـ89% مياه فيشي البركانية وحمض الهيالورونيك — جرعة قوة يومية لبشرتك.", price: 550, comparePrice: 650, pool: "vichy", poolIdx: 0, rating: 4.7, reviews: 1050, stock: 65, skinType: "all", isFeatured: true, isOnSale: true, sellCount: 2200, category: "dermocosmetics", brand: "vichy" }),
  P({ slug: "bioderma-sensibio-h2o", nameEn: "Bioderma Sensibio H2O Micellar Water 500ml", nameAr: "بيوديرما سانسيبيو H2O ماء ميسيلار 500 مل", descEn: "The world's No.1 micellar water — gently removes makeup and soothes sensitive skin.", descAr: "الماء الميسيلار رقم 1 عالميًا — يزيل المكياج بلطف ويهدئ البشرة الحساسة.", price: 520, pool: "bioderma", poolIdx: 0, rating: 4.8, reviews: 1980, stock: 80, skinType: "sensitive", isFeatured: true, sellCount: 3000, category: "dermocosmetics", brand: "bioderma" }),
  P({ slug: "bioderma-atoderm-gel", nameEn: "Bioderma Atoderm Shower Gel 1L", nameAr: "بيوديرما أتوديرم جل استحمام 1 لتر", descEn: "Ultra-gentle soap-free shower gel that cleanses and protects very dry sensitive skin.", descAr: "جل استحمام فائق اللطف خالٍ من الصابون ينظف ويحمي البشرة الحساسة الجافة جدًا.", price: 480, pool: "bioderma", poolIdx: 1, rating: 4.7, reviews: 720, stock: 60, skinType: "dry", sellCount: 1300, category: "dermocosmetics", brand: "bioderma" }),
  P({ slug: "avene-cleanance-gel", nameEn: "Avène Cleanance Cleansing Gel 400ml", nameAr: "أفين كلينانس جل منظف 400 مل", descEn: "Cleansing gel for oily, blemish-prone skin with Avene thermal spring water.", descAr: "جل منظف للبشرة الدهنية المعرضة للحبوب بمياه أفين الحرارية.", price: 490, pool: "avene", poolIdx: 0, rating: 4.5, reviews: 480, stock: 50, skinType: "oily", sellCount: 820, category: "dermocosmetics", brand: "avene" }),
  P({ slug: "avene-thermal-water", nameEn: "Avène Thermal Spring Water Spray 300ml", nameAr: "أفين مياه حرارية رذاذ 300 مل", descEn: "Soothing, softening thermal spring water spray — perfect after cleansing or sun exposure.", descAr: "رذاذ مياه حرارية مهدئ ومخفف — مثالي بعد التنظيف أو التعرض للشمس.", price: 380, pool: "avene", poolIdx: 1, rating: 4.7, reviews: 830, stock: 70, skinType: "sensitive", sellCount: 1400, category: "dermocosmetics", brand: "avene" }),

  // ---------- K-Beauty ----------
  P({ slug: "cosrx-snail-essence", nameEn: "COSRX Snail Mucin 96% Essence 100ml", nameAr: "كوز آر إكس سيروم الحلزون 96% 100 مل", descEn: "Korea's iconic snail secretion essence for intense hydration, elasticity and skin repair.", descAr: "سيروم الحلزون الكوري الشهير بتركيز 96% لترطيب مكثف ومرونة وإصلاح البشرة.", price: 690, comparePrice: 790, pool: "kbeauty", poolIdx: 0, rating: 4.8, reviews: 1670, stock: 55, skinType: "all", isFeatured: true, isOnSale: true, sellCount: 2300, category: "k-beauty", brand: "cosrx" }),
  P({ slug: "cosrx-pimple-patch", nameEn: "COSRX Acne Pimple Master Patch 24 Patches", nameAr: "كوز آر إكس لصقات حب الشباب 24 لصقة", descEn: "Hydrocolloid patches that protect pimples from dirt and speed up healing overnight.", descAr: "لصقات هيدروكولويد تحمي الحبوب من الأوساخ وتسرع الشفاء أثناء النوم.", price: 220, pool: "kbeauty", poolIdx: 1, rating: 4.6, reviews: 940, stock: 100, sellCount: 1900, category: "k-beauty", brand: "cosrx" }),
  P({ slug: "beauty-joseon-sun", nameEn: "Beauty of Joseon Relief Sun SPF50+ 50ml", nameAr: "بيوتي أوف جوسون ريليف صن SPF50+ 50 مل", descEn: "Viral Korean rice probiotics sunscreen — lightweight, no white cast, dewy finish.", descAr: "واقي الشمس الكوري الفيروسي بالأرز والبروبيوتيك — خفيف بدون أثر أبيض ولمسة ندى.", price: 650, pool: "kbeauty", poolIdx: 2, rating: 4.8, reviews: 1240, stock: 60, skinType: "all", sellCount: 1700, category: "k-beauty", brand: "cosrx" }),
  P({ slug: "anua-heartleaf-toner", nameEn: "Anua Heartleaf 77% Soothing Toner 250ml", nameAr: "أنوا تونر القلب الوردي المهدئ 77% 250 مل", descEn: "77% houttuynia cordata extract toner that calms redness and balances pH.", descAr: "تونر بخلاصة الهوتوينيا 77% يهدئ الاحمرار ويوازن حموضة البشرة.", price: 620, pool: "kbeauty", poolIdx: 0, rating: 4.7, reviews: 560, stock: 45, skinType: "sensitive", sellCount: 700, category: "k-beauty", brand: "cosrx" }),
  P({ slug: "laneige-lip-mask", nameEn: "Laneige Lip Sleeping Mask 20g", nameAr: "لانيج ماسك الشفة الليلي 20 جم", descEn: "Overnight lip mask with berry complex and vitamin C for soft, smooth lips by morning.", descAr: "ماسك شفاه ليلي بمركب التوت وفيتامين C لشفاه ناعمة وورديه في الصباح.", price: 580, pool: "kbeauty", poolIdx: 1, rating: 4.9, reviews: 880, stock: 40, skinType: "dry", sellCount: 1100, category: "k-beauty", brand: "cosrx" }),

  // ---------- Hair care ----------
  P({ slug: "loreal-elseve-shampoo", nameEn: "L'Oréal Elseve Hyaluron Plump Shampoo 370ml", nameAr: "لوريال إليفي شامبو هيالورون 370 مل", descEn: "Hyaluron-infused shampoo that deeply hydrates and plumps dry, lifeless hair.", descAr: "شامبو بحمض الهيالورونيك يرطب بعمق ويكثف الشعر الجاف الضعيف.", price: 195, pool: "shampoo", poolIdx: 0, rating: 4.5, reviews: 670, stock: 90, sellCount: 1800, category: "hair-care", brand: "loreal-paris" }),
  P({ slug: "loreal-elseve-mask", nameEn: "L'Oréal Elseve Total Repair Mask 300ml", nameAr: "لوريال إليفي ماسك الترميم الشامل 300 مل", descEn: "Deep repair hair mask with ceramide for damaged, over-processed hair.", descAr: "ماسك ترميم عميق بالسيراميد للشعر التالف والمعالج كيميائيًا.", price: 280, comparePrice: 320, pool: "shampoo", poolIdx: 1, rating: 4.6, reviews: 440, stock: 60, isOnSale: true, sellCount: 900, category: "hair-care", brand: "loreal-paris" }),
  P({ slug: "garnier-fructis-shampoo", nameEn: "Garnier Fructis Long & Strong Shampoo 370ml", nameAr: "جارنييه فروكتيس شامبو للشعر الطويل والقوي 370 مل", descEn: "Fructis shampoo with fruit vitamins that strengthens hair and reduces breakage.", descAr: "شامبو فروكتيس بفيتامينات الفاكهة يقوي الشعر ويقلل التقصف.", price: 150, pool: "shampoo", poolIdx: 2, rating: 4.4, reviews: 520, stock: 110, sellCount: 1500, category: "hair-care", brand: "garnier" }),
  P({ slug: "loreal-extraordinary-serum", nameEn: "L'Oréal Extraordinary Hair Oil Serum 100ml", nameAr: "لوريال سيروم الزيت الاستثنائي للشعر 100 مل", descEn: "6 rare oils serum for instant shine, softness and frizz control.", descAr: "سيروم بـ6 زيوت نادرة لمعان فوري ونعومة وتحكيم في الهيشان.", price: 260, pool: "shampoo", poolIdx: 0, rating: 4.7, reviews: 810, stock: 75, isFeatured: true, sellCount: 1300, category: "hair-care", brand: "loreal-paris" }),
  P({ slug: "eva-hair-cream", nameEn: "EVA Cosmetics Hair Care Cream 150ml", nameAr: "إيفا كوزمتكس كريم العناية بالشعر 150 مل", descEn: "Egyptian favorite styling cream that moisturizes, defines and tames hair daily.", descAr: "كريم تصفيف مصري محبوب يرطب ويشكل ويرتب الشعر يوميًا.", price: 85, pool: "shampoo", poolIdx: 1, rating: 4.3, reviews: 2100, stock: 150, sellCount: 5200, category: "hair-care", brand: "eva" }),

  // ---------- Bath & Body ----------
  P({ slug: "nivea-body-lotion", nameEn: "Nivea Nourishing Body Lotion 400ml", nameAr: "نيفيا لوشن الجسم المغذي 400 مل", descEn: "48h deep moisture body lotion with almond oil for dry skin.", descAr: "لوشن جسم بترطيب عميق 48 ساعة بزيت اللوز للبشرة الجافة.", price: 180, pool: "bath", poolIdx: 0, rating: 4.6, reviews: 930, stock: 100, sellCount: 2400, category: "bath-body", brand: "nivea" }),
  P({ slug: "dove-shower-gel", nameEn: "Dove Deeply Nourishing Shower Gel 500ml", nameAr: "دوف جل استحمام مغذي عميقًا 500 مل", descEn: "Moisturizing shower gel with NutriumMoisture for soft, smooth skin.", descAr: "جل استحمام مرطب بتقنية نيوتوريوم مويستشر لبشرة ناعمة.", price: 165, pool: "bath", poolIdx: 1, rating: 4.7, reviews: 780, stock: 95, sellCount: 2100, category: "bath-body", brand: "dove" }),
  P({ slug: "vaseline-jelly", nameEn: "Vaseline Original Petroleum Jelly 250ml", nameAr: "فازلين الأصلي 250 مل", descEn: "100% pure petroleum jelly that locks in moisture and protects dry, cracked skin.", descAr: "جلي بترولي نقي 100% يحبس الرطوبة ويحمي البشرة الجافة المتشققة.", price: 95, pool: "bath", poolIdx: 2, rating: 4.7, reviews: 1400, stock: 130, sellCount: 3800, category: "bath-body", brand: "vaseline" }),
  P({ slug: "nivea-deo-rollon", nameEn: "Nivea Black & White Deodorant Roll-on 50ml", nameAr: "نيفيا ديدورانت بلاك أند وايت 50 مل", descEn: "48h antiperspirant protection that keeps white clothes white and black clothes black.", descAr: "حماية 48 ساعة من التعرق تحافظ على الملابس البيضاء والسوداء.", price: 120, pool: "bath", poolIdx: 0, rating: 4.5, reviews: 620, stock: 120, sellCount: 1900, category: "personal-care", brand: "nivea" }),
  P({ slug: "veet-hair-removal", nameEn: "Veet Hair Removal Cream 100ml", nameAr: "فيت كريم إزالة الشعر 100 مل", descEn: "Smooth, hair-free skin in 3 minutes with Veet's gentle formula and silky touch.", descAr: "بشرة ناعمة بدون شعر في 3 دقائق بتركيبة فيت اللطيفة.", price: 190, pool: "bath", poolIdx: 1, rating: 4.3, reviews: 540, stock: 80, sellCount: 1200, category: "personal-care", brand: "veet" }),
  P({ slug: "dettol-antiseptic", nameEn: "Dettol Antiseptic Liquid 750ml", nameAr: "ديتول مطهر 750 مل", descEn: "Trusted antiseptic for first aid and household disinfection — kills 99.9% of germs.", descAr: "المطهر الموثوق للإسعافات الأولية وتعقيم المنزل — يقضي على 99.9% من الجراثيم.", price: 210, pool: "bath", poolIdx: 2, rating: 4.8, reviews: 1100, stock: 90, sellCount: 2600, category: "personal-care", brand: "dettol" }),

  // ---------- Oral care ----------
  P({ slug: "sensodyne-toothpaste", nameEn: "Sensodyne Fresh & Mint Toothpaste 100ml", nameAr: "سنسوداين معجون أسنان للأسنان الحساسة 100 مل", descEn: "Daily anti-sensitivity toothpaste with fluoride for lasting freshness and relief.", descAr: "معجون يومي مضاد لحساسية الأسنان بالفلورايد لانتعاش يدوم وتخفيف الحساسية.", price: 165, pool: "oral", poolIdx: 0, rating: 4.7, reviews: 890, stock: 110, sellCount: 2300, category: "oral-care", brand: "sensodyne" }),
  P({ slug: "parodontax-toothpaste", nameEn: "Parodontax Original Gum Care Toothpaste 90g", nameAr: "بارودونتاكس معجون العناية باللثة 90 جم", descEn: "Clinically proven to help stop and prevent bleeding gums.", descAr: "مثبت إكلينيكيًا أنه يساعد على وقف ونزيف اللثة والوقاية منه.", price: 140, pool: "oral", poolIdx: 1, rating: 4.6, reviews: 640, stock: 100, sellCount: 1700, category: "oral-care", brand: "parodontax" }),
  P({ slug: "oralb-electric-brush", nameEn: "Oral-B Pro 2 Electric Toothbrush", nameAr: "أورال بي برو 2 فرشاة أسنان كهربائية", descEn: "2D cleaning with pressure sensor and 2-minute timer for dentist-level clean.", descAr: "تنظيف ثنائي الأبعاد بحساس ضغط ومؤقت دقيقتين لتنظيف بمستوى العيادة.", price: 1250, comparePrice: 1450, pool: "oral", poolIdx: 2, rating: 4.8, reviews: 470, stock: 35, isFeatured: true, isOnSale: true, sellCount: 650, category: "oral-care", brand: "oralb" }),
  P({ slug: "listerine-mouthwash", nameEn: "Listerine Cool Mint Mouthwash 500ml", nameAr: "ليسترين غسول فم كول مينت 500 مل", descEn: "Kills 99% of germs causing bad breath, plaque and gum problems.", descAr: "يقضي على 99% من الجراثيم المسببة لرائحة الفم واللويحة ومشاكل اللثة.", price: 130, pool: "oral", poolIdx: 0, rating: 4.5, reviews: 720, stock: 120, sellCount: 2000, category: "oral-care", brand: "listerine" }),

  // ---------- Eye & nose ----------
  P({ slug: "systane-eye-drops", nameEn: "Systane Ultra Lubricant Eye Drops 10ml", nameAr: "سيستين ألترا قطرات ترطيب للعين 10 مل", descEn: "Fast-acting dry eye relief that soothes and protects with every blink.", descAr: "تخفيف سريع لجفاف العين يهدئ ويحمي مع كل رمشة.", price: 320, pool: "eyecare", poolIdx: 0, rating: 4.7, reviews: 380, stock: 60, sellCount: 800, category: "eye-care", brand: "systane" }),
  P({ slug: "optrex-eye-wash", nameEn: "Optrex Multi-Action Eye Wash 100ml", nameAr: "أوبتريكس غسول العين 100 مل", descEn: "Gently washes away dust, pollen and impurities to soothe tired eyes.", descAr: "يغسل بلطف الأتربة واللطخة والشوائب لتهدئة العيون المتعبة.", price: 210, pool: "eyecare", poolIdx: 1, rating: 4.4, reviews: 240, stock: 55, sellCount: 520, category: "eye-care", brand: "optrex" }),
  P({ slug: "physiomer-nasal", nameEn: "Physiomer Normal Nasal Spray 135ml", nameAr: "فيزيومير رذاذ أنف بمياه البحر 135 مل", descEn: "100% natural sea water spray that decongests and moistens nasal passages daily.", descAr: "رذاذ مياه بحر طبيعي 100% يفتح الأنف ويرطبه يوميًا.", price: 185, pool: "eyecare", poolIdx: 2, rating: 4.6, reviews: 420, stock: 70, sellCount: 950, category: "eye-care", brand: "physiomer" }),

  // ---------- Vitamins ----------
  P({ slug: "centrum-adults", nameEn: "Centrum Adults Multivitamin 60 Tablets", nameAr: "سنتروم مالتي فيتامين للبالغين 60 قرص", descEn: "Complete multivitamin with 23 essential nutrients to support immunity, energy and metabolism.", descAr: "مالتي فيتامين متكامل بـ23 عنصرًا غذائيًا أساسيًا لدعم المناعة والطاقة والتمثيل الغذائي.", price: 480, pool: "vitamins", poolIdx: 0, rating: 4.7, reviews: 980, stock: 70, isFeatured: true, sellCount: 2000, category: "vitamins-supplements", brand: "centrum" }),
  P({ slug: "vitamin-d3-2000", nameEn: "Vitamin D3 2000 IU — 60 Capsules", nameAr: "فيتامين د3 2000 وحدة - 60 كبسولة", descEn: "High-absorption vitamin D3 that supports bone health, immunity and muscle function.", descAr: "فيتامين د3 سريع الامتصاص يدعم صحة العظام والمناعة والعضلات.", price: 130, pool: "vitamins", poolIdx: 1, rating: 4.6, reviews: 640, stock: 140, sellCount: 2800, category: "vitamins-supplements", brand: "natures" }),
  P({ slug: "omega3-1000", nameEn: "Omega-3 Fish Oil 1000mg — 60 Capsules", nameAr: "أوميجا 3 زيت السمك 1000 مجم - 60 كبسولة", descEn: "Heart, brain and vision support with purified fish oil omega-3 fatty acids.", descAr: "دعم للقلب والدماغ والنظر بزيوت أوميجا 3 النقية من السمك.", price: 290, comparePrice: 340, pool: "vitamins", poolIdx: 2, rating: 4.5, reviews: 520, stock: 90, isOnSale: true, sellCount: 1400, category: "vitamins-supplements", brand: "natures" }),
  P({ slug: "vitamin-c-1000", nameEn: "Vitamin C 1000mg Effervescent — 20 Tablets", nameAr: "فيتامين سي 1000 مجم فوار - 20 قرص", descEn: "Orange-flavored effervescent vitamin C for daily immunity boost.", descAr: "فيتامين سي فوار بطعم البرتقال لدعم مناعتك يوميًا.", price: 95, pool: "vitamins", poolIdx: 0, rating: 4.5, reviews: 1100, stock: 160, sellCount: 3400, category: "vitamins-supplements", brand: "natures" }),
  P({ slug: "zinc-50", nameEn: "Zinc 50mg — 60 Tablets", nameAr: "زنك 50 مجم - 60 قرص", descEn: "Essential zinc for immune support, healthy skin and wound healing.", descAr: "زنك أساسي لدعم المناعة وصحة البشرة والتئام الجروح.", price: 85, pool: "vitamins", poolIdx: 1, rating: 4.4, reviews: 380, stock: 150, sellCount: 1600, category: "vitamins-supplements", brand: "natures" }),
  P({ slug: "calcium-d", nameEn: "Calcium + Vitamin D3 — 120 Tablets", nameAr: "كالسيوم + فيتامين د3 - 120 قرص", descEn: "Calcium carbonate with vitamin D for strong bones and teeth at every age.", descAr: "كالسيوم كربونات مع فيتامين د لعظام وأسنان قوية في كل الأعمار.", price: 210, pool: "vitamins", poolIdx: 2, rating: 4.5, reviews: 460, stock: 85, sellCount: 1200, category: "vitamins-supplements", brand: "natures" }),

  // ---------- Devices ----------
  P({ slug: "omron-m2-bp", nameEn: "Omron M2 Blood Pressure Monitor", nameAr: "أومرون M2 جهاز قياس ضغط الدم", descEn: "Clinically validated upper-arm blood pressure monitor with irregular heartbeat detection.", descAr: "جهاز قياس ضغط موثوق إكلينيكيًا للذراع مع كشف عدم انتظام ضربات القلب.", price: 3200, comparePrice: 3600, pool: "device", poolIdx: 0, rating: 4.8, reviews: 350, stock: 25, isFeatured: true, isOnSale: true, sellCount: 420, category: "medical-devices", brand: "omron" }),
  P({ slug: "digital-thermometer", nameEn: "Digital Thermometer Flexible Tip", nameAr: "ترمومتر رقمي بذريعة مرنة", descEn: "Fast 10-second readings with fever alarm and memory function.", descAr: "قياس سريع في 10 ثوانٍ مع تنبيه الحرارة ووظيفة الذاكرة.", price: 350, pool: "device", poolIdx: 1, rating: 4.5, reviews: 280, stock: 60, sellCount: 900, category: "medical-devices", brand: "omron" }),
  P({ slug: "glucometer-kit", nameEn: "Blood Glucose Meter Complete Kit", nameAr: "جهاز قياس السكر الكامل", descEn: "Complete diabetes monitoring kit with meter, lancing device and 25 test strips.", descAr: "طقم مراقبة السكر الكامل مع الجهاز وقلم الوخز و25 شريط اختبار.", price: 850, pool: "device", poolIdx: 2, rating: 4.6, reviews: 190, stock: 40, sellCount: 600, category: "medical-devices", brand: "omron" }),
  P({ slug: "pulse-oximeter", nameEn: "Fingertip Pulse Oximeter", nameAr: "مقياس النبض والأكسجين بالإصبع", descEn: "Instant SpO2 and pulse rate readings with clear LED display.", descAr: "قياس فوري لنسبة الأكسجين ومعدل النبض بشاشة LED واضحة.", price: 600, pool: "device", poolIdx: 0, rating: 4.5, reviews: 310, stock: 50, sellCount: 750, category: "medical-devices", brand: "omron" }),
  P({ slug: "nebulizer-machine", nameEn: "Compressor Nebulizer for Adults & Kids", nameAr: "جهاز بخار للكبار والصغار", descEn: "Quiet compressor nebulizer with complete mask set for effective respiratory therapy.", descAr: "جهاز بخار هادئ مع طقم أقنعة كامل لعلاج الجهاز التنفسي بفعالية.", price: 1900, pool: "device", poolIdx: 1, rating: 4.6, reviews: 150, stock: 20, sellCount: 300, category: "medical-devices", brand: "omron" }),

  // ---------- Makeup ----------
  P({ slug: "maybelline-fitme", nameEn: "Maybelline Fit Me Matte + Poreless Foundation", nameAr: "ميبلين فيت مي فاونديشن مات + مسام مثالية", descEn: "Iconic matte foundation that fits skin tone and texture — 110 shades of confidence.", descAr: "الفاونديشن المات الشهيرة بـ110 درجة تناسب لون وملمس بشرتك.", price: 390, pool: "makeup", poolIdx: 0, rating: 4.6, reviews: 1600, stock: 70, isFeatured: true, sellCount: 2600, category: "makeup", brand: "maybelline" }),
  P({ slug: "maybelline-lash-mascara", nameEn: "Maybelline Lash Sensational Mascara", nameAr: "ميبلين لاش سينسيشن ماسكارا", descEn: "Fan-brush mascara that reveals layers of full, fanned-out lashes.", descAr: "ماسكارا بفرشاة المروحة تكشف طبقات من الرموش الكاملة المتفرقة.", price: 330, pool: "makeup", poolIdx: 1, rating: 4.7, reviews: 1300, stock: 80, sellCount: 2100, category: "makeup", brand: "maybelline" }),
  P({ slug: "maybelline-superstay", nameEn: "Maybelline Superstay Matte Ink Lipstick", nameAr: "ميبلين سوبرستاي أحمر شفاه مات إنك", descEn: "Up to 16-hour wear liquid lipstick with intense pigment and arrow applicator.", descAr: "أحمر شفاه سائل يدوم حتى 16 ساعة بثبات عالي وملعقة سهم.", price: 280, comparePrice: 320, pool: "makeup", poolIdx: 2, rating: 4.6, reviews: 980, stock: 85, isOnSale: true, sellCount: 1700, category: "makeup", brand: "maybelline" }),
  P({ slug: "loreal-infallible", nameEn: "L'Oréal Infallible 24H Fresh Wear Foundation", nameAr: "لوريال إنفاليبل فاونديشن 24 ساعة", descEn: "24h wear, waterproof, breathable full coverage that stays fresh all day.", descAr: "تغطية كاملة تتحمل 24 ساعة، مقاومة للماء والماء والماء وتنفس البشرة طول اليوم.", price: 420, pool: "makeup", poolIdx: 0, rating: 4.5, reviews: 760, stock: 55, sellCount: 1100, category: "makeup", brand: "loreal-paris" }),
  P({ slug: "loreal-paradise-palette", nameEn: "L'Oréal Paradise Enchanted Eyeshadow Palette", nameAr: "لوريال باليت ظلال العيون الباراديز", descEn: "12 scented, highly-pigmented shades from soft nudes to deep sultry tones.", descAr: "12 درجة عطرية عالية التصبغ من العاريات الناعمة للألوان الغامقة الساحرة.", price: 550, pool: "makeup", poolIdx: 1, rating: 4.4, reviews: 340, stock: 30, sellCount: 500, category: "makeup", brand: "loreal-paris" }),

  // ---------- Fragrances ----------
  P({ slug: "lattafa-khamrah", nameEn: "Lattafa Khamrah Eau de Parfum 100ml", nameAr: "لطافة خمرة أو دو بارفان 100 مل", descEn: "Warm spicy-amber fragrance with cinnamon, praline and vanilla — winter luxury in a bottle.", descAr: "عطر عنبري حار بالقرفة والبرالين والفانيليا — فخامة الشتاء في زجاجة.", price: 1400, comparePrice: 1650, pool: "perfume", poolIdx: 0, rating: 4.8, reviews: 890, stock: 30, isFeatured: true, isOnSale: true, sellCount: 950, category: "fragrances", brand: "lattafa" }),
  P({ slug: "lattafa-asad", nameEn: "Lattafa Asad Eau de Parfum 100ml", nameAr: "لطافة أسد أو دو بارفان 100 مل", descEn: "Bold masculine fragrance with coffee, amber and vanilla — confidence in every spray.", descAr: "عطر رجولي جريء بالبن والعمبر والفانيليا — ثقة في كل رشة.", price: 1100, pool: "perfume", poolIdx: 1, rating: 4.7, reviews: 620, stock: 40, sellCount: 800, category: "fragrances", brand: "lattafa" }),
  P({ slug: "armaf-club-nuit", nameEn: "Armaf Club de Nuit Intense Man 105ml", nameAr: "أرماف كلوب دو نوي إنتنس مان 105 مل", descEn: "Legendary smoky-citrus EDP — the iconic statement of presence and power.", descAr: "عطر دخاني-حمضي أسطوري — بيان أيقوني للحضور والقوة.", price: 1200, pool: "perfume", poolIdx: 2, rating: 4.7, reviews: 720, stock: 35, sellCount: 880, category: "fragrances", brand: "armaf" }),
  P({ slug: "vanilla-body-mist", nameEn: "Vanilla & Musk Body Mist 250ml", nameAr: "بدي ميست فانيليا ومسك 250 مل", descEn: "Light everyday body mist with warm vanilla and soft musk notes.", descAr: "بدي ميست خفيف لكل يوم بنوتات الفانيليا الدافئة والمسك الناعم.", price: 220, pool: "perfume", poolIdx: 0, rating: 4.3, reviews: 410, stock: 90, sellCount: 1300, category: "fragrances", brand: "lattafa" }),

  // ---------- Home scents ----------
  P({ slug: "lavender-candle", nameEn: "Lavender Scented Candle 220g", nameAr: "شمعة معطرة بعبير اللافندر 220 جم", descEn: "Hand-poured soy candle that fills your home with calming lavender for 40+ hours.", descAr: "شمعة صويا مصبوبة يدويًا تملأ منزلك بعبير اللافندر المهدئ لأكثر من 40 ساعة.", price: 450, pool: "perfume", poolIdx: 1, rating: 4.6, reviews: 260, stock: 45, sellCount: 420, category: "home-scents", brand: "lattafa" }),
  P({ slug: "oud-reed-diffuser", nameEn: "Vanilla & Oud Reed Diffuser 200ml", nameAr: "ديفيوزر عيدان فانيليا وعود 200 مل", descEn: "Elegant reed diffuser with natural oils for 90 days of continuous home fragrance.", descAr: "ديفيوزر أنيق بالزيوت الطبيعية لعبير منزلي مستمر لمدة 90 يومًا.", price: 690, pool: "perfume", poolIdx: 2, rating: 4.7, reviews: 180, stock: 35, sellCount: 310, category: "home-scents", brand: "lattafa" }),
  P({ slug: "room-freshener", nameEn: "Luxury Room & Linen Freshener 300ml", nameAr: "معطر غرف ومفروشات فاخر 300 مل", descEn: "Long-lasting fine fragrance spray for rooms, curtains and linens.", descAr: "رذاذ عطر فاخر طويل الثبات للغرف والستائر والمفروشات.", price: 180, pool: "perfume", poolIdx: 0, rating: 4.4, reviews: 230, stock: 80, sellCount: 600, category: "home-scents", brand: "lattafa" }),

  // ---------- Mother & baby ----------
  P({ slug: "pampers-baby-dry", nameEn: "Pampers Baby-Dry Diapers Mega Pack", nameAr: "بامبرز بيبي دري باكيت ميجا", descEn: "Up to 12h of dryness with extra absorb channels — comfort and protection for your baby.", descAr: "جفاف حتى 12 ساعة بقنوات امتصاص إضافية — راحة وحماية لطفلك.", price: 480, comparePrice: 540, pool: "baby", poolIdx: 0, rating: 4.8, reviews: 2300, stock: 60, isFeatured: true, isOnSale: true, sellCount: 3600, category: "mother-baby", brand: "pampers" }),
  P({ slug: "baby-shampoo-gentle", nameEn: "Gentle Baby Shampoo 500ml", nameAr: "شامبو الأطفال اللطيف 500 مل", descEn: "Tear-free hypoallergenic shampoo that leaves baby's hair soft and easy to comb.", descAr: "شامبو هايبوالرجينيك بدون دموع يترك شعر طفلك ناعمًا وسهل التسريح.", price: 145, pool: "baby", poolIdx: 1, rating: 4.7, reviews: 870, stock: 95, sellCount: 2200, category: "mother-baby", brand: "dove" }),
  P({ slug: "baby-lotion-nourish", nameEn: "Baby Nourishing Lotion 400ml", nameAr: "لوشن الأطفال المغذي 400 مل", descEn: "24h moisture baby lotion with shea butter for delicate skin from day one.", descAr: "لوشن أطفال بترطيب 24 ساعة بزبدة الشيا للبشرة الحساسة من أول يوم.", price: 150, pool: "baby", poolIdx: 2, rating: 4.7, reviews: 690, stock: 90, sellCount: 1800, category: "mother-baby", brand: "dove" }),
  P({ slug: "chicco-feeding-bottle", nameEn: "Chicco Anti-Colic Feeding Bottle 260ml", nameAr: "كيكو زجاجة رضاعة مضادة للغازات 260 مل", descEn: "Anti-colic valve system that reduces air ingestion for comfortable feeding.", descAr: "نظام صمام مضاد للغازات يقلل ابتلاع الهواء لرضاعة مريحة.", price: 220, pool: "baby", poolIdx: 0, rating: 4.6, reviews: 340, stock: 50, sellCount: 700, category: "mother-baby", brand: "chicco" }),
  P({ slug: "pampers-wipes", nameEn: "Pampers Baby Wipes 99% Water — 3×72", nameAr: "مناديل بامبرز 99% ماء - 3×72", descEn: "Thick, soft wipes with 99% pure water for gentle everyday cleansing.", descAr: "مناديل سميكة وناعمة بـ99% ماء نقي لتنظيف لطيف كل يوم.", price: 195, pool: "baby", poolIdx: 1, rating: 4.7, reviews: 1150, stock: 100, sellCount: 2800, category: "mother-baby", brand: "pampers" }),
  P({ slug: "chicco-baby-bath", nameEn: "Chicco Baby Bath Wash 300ml", nameAr: "كيكو جل استحمام الأطفال 300 مل", descEn: "No-tears bath wash that gently cleanses and protects baby's skin barrier.", descAr: "جل استحمام بدون دموع ينظف بلطف ويحمي حاجز بشرة طفلك.", price: 185, pool: "baby", poolIdx: 2, rating: 4.5, reviews: 280, stock: 65, sellCount: 560, category: "mother-baby", brand: "chicco" }),
];

const promoCodes = [
  { code: "WELCOME10", type: "percent", value: 10, minTotal: 0, active: true },
  { code: "TAHA15", type: "percent", value: 15, minTotal: 500, active: true },
  { code: "FREESHIP", type: "freeship", value: 0, minTotal: 300, active: true },
  { code: "SAVE50", type: "fixed", value: 50, minTotal: 400, active: true },
];

// Extra brand records referenced above but not in the curated logo list
const extraBrands = [
  { slug: "vaseline", nameEn: "Vaseline", nameAr: "فازلين", color: "#0b6e99" },
  { slug: "veet", nameEn: "Veet", nameAr: "فيت", color: "#c2410c" },
  { slug: "dettol", nameEn: "Dettol", nameAr: "ديتول", color: "#166534" },
  { slug: "sensodyne", nameEn: "Sensodyne", nameAr: "سنسوداين", color: "#0e7490" },
  { slug: "parodontax", nameEn: "Parodontax", nameAr: "بارودونتاكس", color: "#b91c1c" },
  { slug: "oralb", nameEn: "Oral-B", nameAr: "أورال بي", color: "#0369a1" },
  { slug: "listerine", nameEn: "Listerine", nameAr: "ليسترين", color: "#1e40af" },
  { slug: "systane", nameEn: "Systane", nameAr: "سيستين", color: "#0d9488" },
  { slug: "optrex", nameEn: "Optrex", nameAr: "أوبتريكس", color: "#0369a1" },
  { slug: "physiomer", nameEn: "Physiomer", nameAr: "فيزيومير", color: "#0891b2" },
  { slug: "centrum", nameEn: "Centrum", nameAr: "سنتروم", color: "#ca8a04" },
  { slug: "natures", nameEn: "Nature's Bounty", nameAr: "نيتشرز باونتي", color: "#16a34a" },
];

async function main() {
  console.log("🌱 Seeding Dr. Walid El-Tahan Pharmacy…");
  const pools = loadPools();
  console.log(`🖼️  Loaded ${Object.keys(pools).length} image pools:`, Object.keys(pools).join(", "));

  // clean
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.promoCode.deleteMany();

  for (const c of categories) {
    await db.category.create({ data: { ...c, isSpecial: (c as { isSpecial?: boolean }).isSpecial ?? false } });
  }
  console.log(`✅ ${categories.length} categories`);

  for (const b of [...brands, ...extraBrands]) {
    await db.brand.create({ data: b });
  }
  console.log(`✅ ${brands.length + extraBrands.length} brands`);

  const catMap = new Map((await db.category.findMany()).map((c) => [c.slug, c.id]));
  const brandMap = new Map((await db.brand.findMany()).map((b) => [b.slug, b.id]));

  let withImages = 0;
  for (const p of products) {
    const image = pick(pools, p.pool, p.poolIdx ?? 0, p.nameEn);
    if (!image.startsWith("data:")) withImages++;
    await db.product.create({
      data: {
        slug: p.slug,
        nameEn: p.nameEn,
        nameAr: p.nameAr,
        descEn: p.descEn,
        descAr: p.descAr,
        price: p.price,
        comparePrice: p.comparePrice ?? null,
        image,
        rating: p.rating,
        reviews: p.reviews,
        stock: p.stock,
        skinType: p.skinType ?? null,
        isFeatured: p.isFeatured ?? false,
        isOnSale: p.isOnSale ?? false,
        sellCount: p.sellCount,
        categoryId: catMap.get(p.category)!,
        brandId: brandMap.get(p.brand)!,
      },
    });
  }
  console.log(`✅ ${products.length} products (${withImages} with real photos)`);

  for (const pc of promoCodes) {
    await db.promoCode.create({ data: pc });
  }
  console.log(`✅ ${promoCodes.length} promo codes`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
