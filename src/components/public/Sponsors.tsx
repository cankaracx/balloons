"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content, Sponsor } from "@/lib/types";

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Sponsors({ sponsors, list }: { sponsors: Content["sponsors"]; list: Sponsor[] }) {
  const { t } = useLang();
  const ordered = [...list].sort((a, b) => a.sort - b.sort);

  return (
    <section id="sponsors" className="bg-paper py-24 sm:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t(NAV_LABELS.sponsors)}</p>
          <h2 className="h-section mt-3 max-w-3xl">{t(sponsors.heading)}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70">{t(sponsors.pitch)}</p>
        </Reveal>

        {/* Tiers */}
        {sponsors.tiers.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 70}>
                <div
                  className={`flex h-full flex-col rounded-2xl border p-7 transition-shadow hover:shadow-lift ${
                    tier.featured
                      ? "border-transparent bg-navy text-white shadow-lift"
                      : "border-navy/10 bg-white text-ink"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className={`font-display text-xl font-bold ${tier.featured ? "text-white" : "text-navy"}`}>
                      {t(tier.name)}
                    </h3>
                    {tier.featured && (
                      <span className="rounded-full bg-scarlet px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                        {t({ en: "Top tier", tr: "En üst" })}
                      </span>
                    )}
                  </div>
                  <div className={`mt-2 font-display text-2xl font-bold ${tier.featured ? "text-scarlet-400" : "text-scarlet"}`}>
                    {t(tier.amount)}
                  </div>
                  <ul className={`mt-5 space-y-2.5 text-sm ${tier.featured ? "text-white/80" : "text-ink/70"}`}>
                    {t(tier.perks)
                      .split("\n")
                      .filter(Boolean)
                      .map((perk, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className={tier.featured ? "text-scarlet-400" : "text-scarlet"}>
                            <Check />
                          </span>
                          <span>{perk}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Sponsor wall */}
        <Reveal className="mt-16">
          <h3 className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-ink/40">
            {ordered.length > 0
              ? t({ en: "Our supporters", tr: "Destekçilerimiz" })
              : t({ en: "Founding sponsors wanted", tr: "Kurucu sponsorlar aranıyor" })}
          </h3>

          {ordered.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {ordered.map((s) => {
                const card = (
                  <div className="group flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-navy/10 bg-white p-5 transition-shadow hover:shadow-soft">
                    {s.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="max-h-14 max-w-[80%] object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0"
                      />
                    ) : (
                      <span className="font-display text-lg font-bold text-navy">{s.name}</span>
                    )}
                    {s.tier && <span className="text-[11px] font-medium uppercase tracking-wide text-ink/40">{s.tier}</span>}
                  </div>
                );
                return s.website ? (
                  <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}>
                    {card}
                  </a>
                ) : (
                  <div key={s.id} title={s.name}>
                    {card}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-navy/15 bg-white/40 px-4 text-center text-sm font-medium text-ink/40"
                >
                  {t({ en: "Your logo here", tr: "Logonuz burada" })}
                </div>
              ))}
            </div>
          )}

          <p className="mx-auto mt-8 max-w-2xl text-center text-base text-ink/60">{t(sponsors.emptyState)}</p>

          <div className="mt-8 flex justify-center">
            <a href="#contact" className="btn-primary">
              {t(sponsors.cta)}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
