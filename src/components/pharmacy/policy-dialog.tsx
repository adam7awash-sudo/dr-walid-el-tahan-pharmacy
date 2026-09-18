"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw, FileText, Lock, Store, Headset } from "lucide-react";
import { useApp, type PolicyKey } from "@/lib/store";
import { translations } from "@/lib/i18n";

function TermsContent({ lang }: { lang: "ar" | "en" }) {
  const t = translations[lang];
  const ar = lang === "ar";
  return (
    <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "1. قبول الشروط" : "1. Acceptance of Terms"}</h3>
        <p>{ar ? "باستخدامك موقع صيدلية الدكتور وليد الطحاوي، فإنك توافق على هذه الشروط والأحكام بالكامل. نحتفظ بحق تعديل هذه الشروط في أي وقت، وتسري التعديلات فور نشرها على الموقع." : "By using Dr. Walid El-Tahan Pharmacy website, you agree to these Terms & Conditions in full. We reserve the right to modify these terms at any time, effective immediately upon posting."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "2. المنتجات والأسعار" : "2. Products & Pricing"}</h3>
        <p>{ar ? "جميع المنتجات أصلية 100% من وكلاء معتمدين. نحتفظ بحق تحديث الأسعار والعروض في أي وقت دون إشعار مسبق. الأسعار تشمل ضريبة القيمة المضافة." : "All products are 100% genuine from authorized distributors. We may update prices and offers at any time without prior notice. Prices include VAT."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "3. الطلبات والتأكيد" : "3. Orders & Confirmation"}</h3>
        <p>{ar ? "يتم تأكيد كل طلب هاتفيًا من قبل الصيدلي قبل الشحن. يحق للصيدلية رفض أو إلغاء أي طلب لأسباب تتعلق بتوفر المنتج أو صحة بيانات العميل." : "Every order is confirmed by phone by our pharmacist before shipping. The pharmacy may refuse or cancel any order due to product availability or incorrect customer information."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "4. العروض وأكواد الخصم" : "4. Offers & Promo Codes"}</h3>
        <p>{ar ? "لا يمكن الجمع بين أكثر من كود خصم في نفس الطلب. عرض (اشترِ 1 واحصل على 40% خصم على الثاني) يطبق تلقائيًا ولا يُجمع مع أكواد الخصم. العروض سارية حتى إشعار آخر." : "Only one promo code can be applied per order. The 'Buy 1, get 40% off the 2nd item' offer applies automatically and cannot be combined with promo codes. Offers valid until further notice."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "5. الاستخدام المقبول" : "5. Acceptable Use"}</h3>
        <p>{ar ? "يمنع إساءة استخدام الموقع أو محاولة اختراقه أو استخدام بيانات وهمية. جميع الطلبات تخضع للمراجعة والتأكيد." : "Misusing the website, attempting to breach it, or using fake information is prohibited. All orders are subject to review and confirmation."}</p>
      </section>
    </div>
  );
}

function PrivacyContent({ lang }: { lang: "ar" | "en" }) {
  const ar = lang === "ar";
  return (
    <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "البيانات التي نجمعها" : "Data We Collect"}</h3>
        <p>{ar ? "نجمع فقط البيانات اللازمة لتنفيذ طلبك: الاسم، رقم الهاتف، البريد الإلكتروني (اختياري)، وعنوان التوصيل. لا نطلب أبداً بيانات بطاقتك البنكية عبر الهاتف أو الرسائل." : "We collect only the data needed to fulfil your order: name, phone number, email (optional), and delivery address. We never ask for your card details by phone or message."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "حماية البيانات" : "Data Protection"}</h3>
        <p className="flex gap-2"><ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />{ar ? "تُحمى جميع البيانات المرسلة عبر الموقع بتشفير SSL معتمد بمعايير الصناعة (256-bit)، وتُخزن بيانات الدفع عبر بوابة دفع آمنة مشفرة بالكامل." : "All data transmitted through the site is protected with industry-standard 256-bit SSL encryption, and payment data is processed via a fully encrypted secure payment gateway."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "مشاركة البيانات" : "Data Sharing"}</h3>
        <p><Lock size={14} className="inline mx-1 text-primary" />{ar ? "لا نبيع أو نشارك بياناتك الشخصية مع أي طرف ثالث، باستثناء شركة الشحن لتوصيل طلبك فقط." : "We never sell or share your personal data with any third party, except the shipping company solely to deliver your order."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "حقوقك" : "Your Rights"}</h3>
        <p>{ar ? "يمكنك طلب حذف بياناتك أو تعديلها في أي وقت عبر التواصل معنا على care@eltahan-pharmacy.com أو الاتصال بالخط الساخن 19288." : "You can request deletion or modification of your data at any time via care@eltahan-pharmacy.com or our hotline 19288."}</p>
      </section>
    </div>
  );
}

function DeliveryContent({ lang }: { lang: "ar" | "en" }) {
  const ar = lang === "ar";
  return (
    <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
      <section>
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><Truck size={18} className="text-primary" />{ar ? "خيارات التوصيل" : "Delivery Options"}</h3>
        <div className="space-y-2">
          <p>🚀 {ar ? "توصيل نفس اليوم / اليوم التالي — داخل القاهرة والجيزة (35 ج.م)" : "Same-day / next-day delivery — within Cairo & Giza (35 EGP)"}</p>
          <p>💰 {ar ? "الوفر الذكي 2-3 أيام — القاهرة والجيزة (30 ج.م)" : "Super Saver 2-3 days — Cairo & Giza (30 EGP)"}</p>
          <p>🇪🇬 {ar ? "جميع المحافظات الأخرى 2-7 أيام (45 ج.م)" : "All other governorates 2-7 days (45 EGP)"}</p>
          <p>🎁 {ar ? "شحن مجاني للطلبات أكثر من 1500 ج.م" : "Free shipping on orders over 1500 EGP"}</p>
        </div>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2"><RotateCcw size={18} className="text-primary" />{ar ? "سياسة الاستبدال والإرجاع" : "Return & Exchange Policy"}</h3>
        <p>{ar ? "يمكنك استبدال أو إرجاع أي منتج خلال 14 يومًا من الاستلام بشرط أن يكون بحالته الأصلية وغير مستخدم وبفاتورته. لا يمكن إرجاع الأدوية ومنتجات العناية الشخصية المفتوحة لأسباب صحية." : "You can exchange or return any product within 14 days of receipt, provided it is in its original condition, unused, and with its invoice. Opened medicines and personal care products cannot be returned for health reasons."}</p>
      </section>
      <section>
        <h3 className="font-bold text-foreground mb-2">{ar ? "تلف المنتج" : "Damaged Products"}</h3>
        <p>{ar ? "في حالة وصول منتج تالف أو خطأ في الطلب، تواصل معنا خلال 48 ساعة وسنستبدله فورًا دون أي رسوم إضافية." : "If a damaged product arrives or you receive a wrong item, contact us within 48 hours and we will replace it immediately at no extra charge."}</p>
      </section>
    </div>
  );
}

function StoresContent({ lang }: { lang: "ar" | "en" }) {
  const t = translations[lang];
  const ar = lang === "ar";
  const stores = [
    { key: "store1", map: "https://maps.google.com/?q=Abbas+El+Akkad+Nasr+City+Cairo" },
    { key: "store2", map: "https://maps.google.com/?q=Road+9+Maadi+Cairo" },
    { key: "store3", map: "https://maps.google.com/?q=Arkan+Plaza+Sheikh+Zayed+Giza" },
    { key: "store4", map: "https://maps.google.com/?q=Smouha+Alexandria" },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Clock size={15} className="text-primary" /> {t.footer.openNow}
      </p>
      {stores.map((s) => (
        <div key={s.key} className="flex items-center justify-between gap-3 border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Store size={19} />
            </span>
            <div>
              <p className="font-bold text-sm">{t.footer[s.key as keyof typeof t.footer]}</p>
              <p className="text-xs text-muted-foreground">{t.footer.openNow}</p>
            </div>
          </div>
          <a
            href={s.map}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-primary border-2 border-primary rounded-xl px-4 py-2 hover:bg-accent transition-colors shrink-0"
          >
            {t.footer.getDirections}
          </a>
        </div>
      ))}
    </div>
  );
}

function ContactContent({ lang }: { lang: "ar" | "en" }) {
  const t = translations[lang];
  const ar = lang === "ar";
  return (
    <div className="space-y-3">
      {[
        { icon: Phone, label: t.footer.hotline, value: "19288", ltr: true, href: "tel:19288" },
        { icon: Mail, label: ar ? "البريد الإلكتروني" : "Email", value: t.footer.email, ltr: true, href: `mailto:${t.footer.email}` },
        { icon: Headset, label: ar ? "واتساب" : "WhatsApp", value: "+20 100 000 0000", ltr: true, href: "https://wa.me/201000000000" },
      ].map((row) => (
        <a key={row.label} href={row.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors">
          <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <row.icon size={19} />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">{row.label}</span>
            <span className="block font-bold text-sm" dir={row.ltr ? "ltr" : undefined}>{row.value}</span>
          </span>
        </a>
      ))}
      <div className="bg-accent/70 rounded-2xl p-4 text-sm font-semibold flex items-center gap-2">
        <Clock size={16} className="text-primary" /> {t.footer.hours}
      </div>
    </div>
  );
}

export function PolicyDialog() {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  const policy = useApp((s) => s.policy);
  const setPolicy = useApp((s) => s.setPolicy);

  const titles: Record<PolicyKey, string> = {
    terms: t.policies.terms,
    privacy: t.policies.privacy,
    delivery: t.policies.delivery,
    stores: t.policies.stores,
    contact: t.policies.contact,
    about: t.policies.about,
  };

  return (
    <Dialog open={!!policy} onOpenChange={(v) => !v && setPolicy(null)}>
      <DialogContent className="max-w-xl rounded-3xl max-h-[85vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-extrabold">
            {policy === "delivery" && <Truck size={18} className="text-primary" />}
            {policy === "privacy" && <ShieldCheck size={18} className="text-primary" />}
            {policy === "terms" && <FileText size={18} className="text-primary" />}
            {policy === "stores" && <Store size={18} className="text-primary" />}
            {(policy === "contact" || policy === "about") && <Headset size={18} className="text-primary" />}
            {policy ? titles[policy] : ""}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {policy === "terms" && <TermsContent lang={lang} />}
          {policy === "privacy" && <PrivacyContent lang={lang} />}
          {policy === "delivery" && <DeliveryContent lang={lang} />}
          {policy === "stores" && <StoresContent lang={lang} />}
          {policy === "contact" && <ContactContent lang={lang} />}
          {policy === "about" && (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>{t.footer.about}</p>
              <p>{lang === "ar"
                ? "منذ تأسيسها، التزمت صيدلية الدكتور وليد الطحاوي بتقديم الأدوية ومنتجات العناية الأصلية بأسعار عادلة وخدمة استشارية موثوقة من صيادلة متخصصين. نخدم عملاءنا في كل محافظات مصر عبر أربعة فروع رئيسية ومنصة إلكترونية متكاملة."
                : "Since its founding, Dr. Walid El-Tahan Pharmacy has been committed to providing genuine medicines and care products at fair prices with trusted consultative service from specialized pharmacists. We serve customers across all Egyptian governorates through four main branches and a complete online platform."}</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { n: "4", label: lang === "ar" ? "فروع" : "Branches" },
                  { n: "+10K", label: lang === "ar" ? "منتج أصلي" : "Genuine Products" },
                  { n: "+50K", label: lang === "ar" ? "عميل سعيد" : "Happy Customers" },
                ].map((s) => (
                  <div key={s.label} className="bg-accent/70 rounded-2xl p-3">
                    <p className="text-xl font-extrabold text-primary">{s.n}</p>
                    <p className="text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
