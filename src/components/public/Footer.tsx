"use client";

import { useLang } from "./LangProvider";
import { NAV_LABELS } from "@/lib/i18n";
import Pufferfish from "./Pufferfish";
import type { Content } from "@/lib/types";

const LINKS = ["about", "sponsors", "team", "gallery", "outreach", "contact"] as const;

export default function Footer({ brand }: { brand: Content["brand"] }) {
  const { lang, setLang, t } = useLang();
  const other: "en" | "tr" = lang === "en" ? "tr" : "en";
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy py-14 text-white">
      <div className="container-page">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-2.5">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoUrl} alt="" className="h-8 w-8 rounded-md object-contain" />
              ) : (
                <Pufferfish size={32} />
              )}
              <span className="font-display text-lg font-bold tracking-tight">{brand.name}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              {t({
                en: "Rookie FRC team at TED Antalya Koleji — building our future one mechanism, one idea, and one bold dream at a time.",
                tr: "TED Antalya Koleji çatısı altındaki çaylak FRC takımı — geleceğimizi her bir mekanizma, fikir ve cesur hayalle inşa ediyoruz.",
              })}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((key) => (
              <a key={key} href={`#${key}`} className="text-sm font-medium text-white/65 transition-colors hover:text-white">
                {t(NAV_LABELS[key])}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.name}
            {brand.teamNumber ? ` · #${brand.teamNumber}` : ""} · TED Antalya Koleji
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLang(other)}
              className="font-semibold uppercase tracking-wide text-white/60 transition-colors hover:text-white"
            >
              {other === "tr" ? "Türkçe" : "English"}
            </button>
            <a href="/admin" className="text-white/35 transition-colors hover:text-white/70">
              {t({ en: "Admin", tr: "Yönetim" })}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
