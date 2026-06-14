"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content } from "@/lib/types";

export default function About({ about }: { about: Content["about"] }) {
  const { t } = useLang();

  return (
    <section id="about" className="bg-white py-24 sm:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t(NAV_LABELS.about)}</p>
          <h2 className="h-section mt-3 max-w-3xl">{t(about.heading)}</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70">{t(about.body)}</p>
        </Reveal>

        {about.stats.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-navy/10 bg-navy/10 lg:grid-cols-4">
            {about.stats.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="bg-white">
                <div className="h-full px-6 py-8">
                  <div className="font-display text-2xl font-bold text-navy sm:text-3xl">{t(s.value)}</div>
                  <div className="mt-2 text-sm font-medium uppercase tracking-wide text-ink/50">{t(s.label)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
