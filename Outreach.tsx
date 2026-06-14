"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content } from "@/lib/types";

export default function Outreach({ outreach }: { outreach: Content["outreach"] }) {
  const { t } = useLang();
  const items = outreach.items || [];

  return (
    <section id="outreach" className="bg-navy py-24 text-white sm:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-scarlet-400">{t(NAV_LABELS.outreach)}</p>
          <h2 className="h-section mt-3 max-w-3xl text-white">{t(outreach.heading)}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/70">{t(outreach.body)}</p>
        </Reveal>

        {items.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-navy-700/60 p-7 transition-colors hover:border-white/25">
                  <span className="font-display text-3xl font-bold text-scarlet-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{t(item.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{t(item.body)}</p>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
