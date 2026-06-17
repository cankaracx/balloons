"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import type { Content, Sponsor } from "@/lib/types";

export default function SponsorWall({ sponsors, list }: { sponsors: Content["sponsors"]; list: Sponsor[] }) {
  const { t } = useLang();
  const ordered = [...list].sort((a, b) => a.sort - b.sort);
  const hasSponsors = ordered.length > 0;

  return (
    <section id="sponsors" className="bg-paper py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-ink/40">
            {hasSponsors
              ? t({ en: "Proudly backed by", tr: "Gururla destekleyenler" })
              : t({ en: "Founding sponsors wanted", tr: "Kurucu sponsorlar aranıyor" })}
          </p>
        </Reveal>

        {hasSponsors ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {ordered.map((s, i) => {
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
              return (
                <Reveal key={s.id} delay={i * 60}>
                  {s.website ? (
                    <a href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}>
                      {card}
                    </a>
                  ) : (
                    <div title={s.name}>{card}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
        ) : (
          <>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Reveal key={i} delay={i * 80}>
                  <a
                    href="#partner"
                    className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-navy/15 bg-white/40 px-4 text-center text-sm font-medium text-ink/40 transition-colors hover:border-scarlet/40 hover:text-scarlet"
                  >
                    {t({ en: "Your logo here", tr: "Logonuz burada" })}
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-2xl text-center text-base text-ink/60">{t(sponsors.emptyState)}</p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
