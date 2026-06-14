"use client";

import { useEffect, useState } from "react";
import { useLang } from "./LangProvider";
import { NAV_LABELS } from "@/lib/i18n";
import Pufferfish from "./Pufferfish";
import type { Content } from "@/lib/types";

const LINKS = ["about", "sponsors", "team", "gallery", "outreach", "contact"] as const;

export default function Nav({ brand }: { brand: Content["brand"] }) {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const other: "en" | "tr" = lang === "en" ? "tr" : "en";

  const headerClass = [
    "fixed inset-x-0 top-0 z-50 bg-white/85 backdrop-blur-md transition-shadow duration-300",
    scrolled ? "shadow-soft" : "",
  ].join(" ");

  return (
    <header className={headerClass}>
      <nav className="container-page flex h-[68px] items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-2.5" aria-label="BALLOONS home">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="h-9 w-9 rounded-md object-contain" />
          ) : (
            <Pufferfish size={36} />
          )}
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold tracking-tight text-navy">{brand.name}</span>
            {brand.teamNumber && <span className="text-xs font-semibold text-scarlet">#{brand.teamNumber}</span>}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((key) => (
            <li key={key}>
              <a
                href={"#" + key}
                className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
              >
                {t(NAV_LABELS[key])}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setLang(other)}
            className="rounded-full border border-navy/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy/80 transition-colors hover:border-navy/40 hover:text-navy"
            aria-label={other === "tr" ? "Switch to Turkish" : "Switch to English"}
          >
            {other}
          </button>
          <a href="#sponsors" className="btn-primary hidden px-5 py-2.5 sm:inline-flex">
            {t({ en: "Become a sponsor", tr: "Sponsor olun" })}
          </a>
          <button
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-navy/10 bg-white/95 px-6 py-4 backdrop-blur-md lg:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((key) => (
              <li key={key}>
                <a
                  href={"#" + key}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-base font-medium text-navy/80 hover:bg-paper"
                >
                  {t(NAV_LABELS[key])}
                </a>
              </li>
            ))}
          </ul>
          <a href="#sponsors" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">
            {t({ en: "Become a sponsor", tr: "Sponsor olun" })}
          </a>
        </div>
      )}
    </header>
  );
}
