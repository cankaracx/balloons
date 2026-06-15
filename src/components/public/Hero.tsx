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
          <Reveal>
            <p className="eyebrow mt-6 text-scarlet-400">{t(hero.eyebrow)}</p>
          </Reveal>
          <Reveal delay={170}>
            <h1
              className="mt-4 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
              style={{
                background: "linear-gradient(110deg,#ffffff 30%,#F25563 50%,#ffffff 70%)",
                backgroundSize: "220% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "blshimmer 6s linear infinite",
              }}
            >
              {brand.name}
            </h1>
            <style>{`@keyframes blshimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
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

        <div className="relative flex justify-center md:justify-end">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full md:h-96 md:w-96"
            style={{ background: "radial-gradient(circle, rgba(229,40,60,0.35), transparent 65%)", animation: "blpulse2 5s ease-in-out infinite" }}
            aria-hidden
          />
          <style>{`@keyframes blpulse2{0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)}50%{opacity:.85;transform:translate(-50%,-50%) scale(1.12)}}`}</style>
          {brand.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logoUrl} alt="" className="relative h-56 w-56 animate-breathe object-contain md:h-72 md:w-72" />
          ) : (
            <Pufferfish size={300} className="relative animate-breathe drop-shadow-2xl" />
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
