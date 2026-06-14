"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import type { Content } from "@/lib/types";

function Check({ featured }: { featured: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-0.5 shrink-0 ${featured ? "text-scarlet-400" : "text-scarlet"}`}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Partner({ sponsors }: { sponsors: Content["sponsors"] }) {
  const { t } = useLang();

  return (
    <section id="partner" className="relative overflow-hidden bg-navy py-24 text-white sm:py-28">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -left-24 top-1/3 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(229,40,60,0.6), transparent 62%)" }}
        aria-hidden
      />
      <div className="container-page relative">
        <Reveal>
          <p className="eyebrow text-scarlet-400">{t({ en: "Partner with us", tr: "Bizimle ortak olun" })}</p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="h-section mt-3 max-w-3xl text-white">{t(sponsors.heading)}</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{t(sponsors.pitch)}</p>
        </Reveal>

        {sponsors.tiers.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 90}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-7 transition-transform duration-300 hover:-translate-y-1 ${
                    tier.featured
                      ? "border-scarlet/40 bg-navy-700 shadow-lift ring-1 ring-scarlet/30"
                      : "border-white/10 bg-navy-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-white">{t(tier.name)}</h3>
                    {tier.featured && (
                      <span className="rounded-full bg-scarlet px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {t({ en: "Top tier", tr: "En üst" })}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-display text-2xl font-bold text-scarlet-400">{t(tier.amount)}</div>
                  <ul className="mt-5 space-y-2.5 text-sm text-white/75">
                    {t(tier.perks)
                      .split("\n")
                      .filter(Boolean)
                      .map((perk, idx) => (
                        <li key={idx} className="flex gap-2">
                          <Check featured={tier.featured} />
                          <span>{perk}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={120}>
          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a href="#contact" className="btn-primary">
              {t(sponsors.cta)}
            </a>
            <span className="text-sm text-white/45">{t({ en: "We reply within 48 hours.", tr: "48 saat içinde yanıt veriyoruz." })}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
