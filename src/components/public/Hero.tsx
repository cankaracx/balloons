"use client";

import { useLang } from "./LangProvider";
import Pufferfish from "./Pufferfish";
import type { Content } from "@/lib/types";

export default function Hero({ hero, brand }: { hero: Content["hero"]; brand: Content["brand"] }) {
  const { t } = useLang();

  return (
    <section id="home" className="relative overflow-hidden bg-navy text-white">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-24 top-10 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(229,40,60,0.55), transparent 62%)" }}
        aria-hidden
      />
      {/* subtle floating bubbles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {[
          { l: "12%", s: 10, d: "0s" },
          { l: "26%", s: 6, d: "4s" },
          { l: "68%", s: 8, d: "2s" },
          { l: "82%", s: 5, d: "6s" },
        ].map((b, i) => (
          <span
            key={i}
            className="absolute bottom-0 block animate-floatUp rounded-full bg-white/10"
            style={{ left: b.l, width: b.s, height: b.s, animationDelay: b.d }}
          />
        ))}
      </div>

      <div className="container-page grid min-h-[92svh] grid-cols-1 items-center gap-10 pb-16 pt-28 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div className="max-w-xl">
          <p className="eyebrow text-scarlet-400">{t(hero.eyebrow)}</p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            {brand.name}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">{t(hero.tagline)}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#sponsors" className="btn-primary">
              {t(hero.ctaPrimary)}
            </a>
            <a href="#team" className="btn-ghost">
              {t(hero.ctaSecondary)}
            </a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="h-56 w-56 animate-breathe object-contain md:h-72 md:w-72" />
          ) : (
            <Pufferfish size={300} className="animate-breathe drop-shadow-2xl" />
          )}
        </div>
      </div>
      
        href="#about"
        className="group absolute bottom-6 right-6 z-10 hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white/80 sm:flex"
      >
        <span>Scroll</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
          aria-hidden
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
