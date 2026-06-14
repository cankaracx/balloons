"use client";

import { useLang } from "./LangProvider";
import Pufferfish from "./Pufferfish";
import Reveal from "./Reveal";
import type { Content } from "@/lib/types";

export default function Hero({ hero, brand }: { hero: Content["hero"]; brand: Content["brand"] }) {
  const { t } = useLang();

  return (
    <section id="home" className="relative overflow-hidden bg-navy text-white">
      {/* dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 35%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 35%, #000 30%, transparent 75%)",
        }}
        aria-hidden
      />
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -right-24 top-10 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(229,40,60,0.55), transparent 62%)" }}
        aria-hidden
      />
      {/* floating bubbles */}
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

      <div className="container-page relative grid min-h-[92svh] grid-cols-1 items-center gap-10 pb-16 pt-28 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div className="max-w-xl">
          {/* achievement badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-1.5 pl-2 pr-4 backdrop-blur-sm">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-scarlet/40" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F25563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3" />
                </svg>
              </span>
              <span className="text-xs font-semibold tracking-wide text-white/85">
                {t({ en: "2nd place \u00b7 NASA Space Apps Challenge", tr: "2.'lik \u00b7 NASA Space Apps Challenge" })}
              </span>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <p className="eyebrow mt-6 text-scarlet-400">{t(hero.eyebrow)}</p>
          </Reveal>
          <Reveal delay={170}>
            <h1 className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
              {brand.name}
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-6 text-lg leading-relaxed text-white/75 sm:text-xl">{t(hero.tagline)}</p>
          </Reveal>
          <Reveal delay={330}>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#partner" className="btn-primary">
                {t(hero.ctaPrimary)}
              </a>
              <a href="#team" className="btn-ghost">
                {t(hero.ctaSecondary)}
              </a>
            </div>
          </Reveal>
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

      <a
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
