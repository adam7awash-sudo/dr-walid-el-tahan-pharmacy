# Dr. Walid El-Tahan Pharmacy | صيدلية الدكتور وليد الطحاوي

A comprehensive, modern, fully bilingual (Arabic RTL / English) e-commerce pharmacy platform for the Egyptian market — inspired by top online pharmacy experiences like Bloom Pharmacy.

![stack](https://img.shields.io/badge/Next.js-16-black) ![stack](https://img.shields.io/badge/TypeScript-5-blue) ![stack](https://img.shields.io/badge/Prisma-SQLite-green) ![stack](https://img.shields.io/badge/Tailwind_CSS-4-teal)

## ✨ Features

### 🛍️ Commerce
- **60+ real products** across 14 categories with real product photography
- **Smart search** with live suggestions (products, brands, categories)
- **Advanced filtering**: category, brand, skin type, price range (slider), rating, on-sale
- **Sorting**: featured, price, rating, newest, best selling
- **Quick view** modals with quantity selection
- **Persistent shopping bag** (localStorage) with quantity steppers
- **Automatic promotion**: "Buy 1, get 40% off the 2nd item" applied automatically at checkout
- **Promo codes**: `WELCOME10` (10%), `TAHA15` (15% off 500+), `FREESHIP` (300+), `SAVE50` (50 EGP off 400+)
- **Multi-step checkout**: Information → Shipping → Payment → Review
- **Order confirmation** with generated order numbers and server-side total validation

### 🚚 Logistics (Egyptian market)
- Same-day / next-day delivery in **Cairo & Giza**
- **Super Saver** 2-3 days delivery
- **2-7 days** delivery for all other governorates (all 27 supported)
- Free shipping over 1500 EGP
- Cash on delivery + secure card payment options

### 🌐 Experience
- **Fully bilingual** — Arabic (RTL, default) & English with instant switching
- **Responsive** mobile-first design (mobile → tablet → desktop)
- **Sticky header** with live search suggestions
- **Brands showcase** — La Roche-Posay, CeraVe, Vichy, The Ordinary, Bioderma, Avène, Eucerin, L'Oréal, Maybelline, Lattafa and more
- **Flash deals** with live countdown timer
- **Specialized sections**: K-Beauty, Dermocosmetics, Home Scents
- **Policy pages**: Terms & Conditions, Privacy Policy, Delivery & Returns, Store Finder (4 branches), Contact, About
- **Customer support** section — hotline 19288, WhatsApp, email (10 AM – 6 PM daily)
- Industry-standard SSL security messaging and trust badges

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui + Lucide icons |
| Database | Prisma ORM + SQLite |
| State | Zustand (persisted cart, language, promo) |
| Fonts | Cairo (Arabic + Latin) |

## 🚀 Getting Started

```bash
# install
bun install

# push the database schema
bun run db:push

# seed categories, brands, products & promo codes
bun prisma/seed.ts

# start the dev server
bun run dev
```

Open the app at `http://localhost:3000`.

## 📁 Project Structure

```
prisma/
  schema.prisma        # Category, Brand, Product, PromoCode, Order, OrderItem
  seed.ts              # 60+ products, 20+ brands, 14 categories, 4 promo codes
src/
  app/
    page.tsx           # single-page app entry (server component)
    api/
      products/        # filtering, search, sorting, pagination
      categories/      # category list with product counts
      brands/          # brand list
      promo/           # promo code validation
      orders/          # order creation with server-side totals & stock checks
  components/pharmacy/ # header, hero, shop, cart, checkout, policies…
  lib/
    store.ts           # Zustand store (cart, filters, language, UI state)
    types.ts           # shared types + pricing/shipping engine
    i18n.ts            # full AR/EN dictionary
```

## 🧾 Pricing Engine

Totals are always recomputed **server-side** on order creation (client shows estimates only):

```
subtotal → auto BOGO-40 discount → promo discount → shipping fee → total
```

Shipping fees: Cairo/Giza same-day 35 EGP · Super Saver 30 EGP · Other governorates 45 EGP · Free over 1500 EGP.

---

© Dr. Walid El-Tahan Pharmacy — proudly serving Egypt 🇪🇬
