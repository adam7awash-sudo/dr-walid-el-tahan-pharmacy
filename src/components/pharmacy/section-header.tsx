"use client";

import { useApp } from "@/lib/store";
import { translations } from "@/lib/i18n";

export function SectionHeader({
  title,
  subtitle,
  onViewAll,
  accent,
}: {
  title: string;
  subtitle?: string;
  onViewAll?: () => void;
  accent?: string;
}) {
  const lang = useApp((s) => s.lang);
  const t = translations[lang];
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
          {title}
          {accent ? <span className="text-primary"> {accent}</span> : null}
        </h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="shrink-0 text-primary hover:text-primary/80 font-semibold text-sm sm:text-base underline-offset-4 hover:underline transition-colors"
        >
          {t.sections.viewAll} ←
        </button>
      )}
    </div>
  );
}
