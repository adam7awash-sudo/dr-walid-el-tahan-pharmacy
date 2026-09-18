import type { Metadata, Viewport } from "next";
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "صيدلية الدكتور وليد الطحاوي | Dr. Walid El-Tahan Pharmacy",
  description:
    "صيدليتك الموثوقة في مصر — أدوية، عناية بالبشرة، تجميل، أم وطفل مع توصيل سريع في نفس اليوم داخل القاهرة والجيزة. Your trusted pharmacy in Egypt with same-day delivery.",
  keywords: [
    "pharmacy Egypt",
    "صيدلية اونلاين",
    "skincare Egypt",
    "La Roche-Posay",
    "CeraVe",
    "صيدلية الدكتور وليد الطحاوي",
    "online pharmacy Cairo",
  ],
  authors: [{ name: "Dr. Walid El-Tahan Pharmacy" }],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "صيدلية الدكتور وليد الطحاوي | Dr. Walid El-Tahan Pharmacy",
    description: "تسوق الأدوية والعناية والجمال مع توصيل سريع لكل مصر",
    siteName: "Dr. Walid El-Tahan Pharmacy",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e7490",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
