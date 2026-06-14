"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content, Member } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Team({ team, list }: { team: Content["team"]; list: Member[] }) {
  const { t } = useLang();
  const members = [...list].sort((a, b) => a.sort - b.sort);

  return (
    <section id="team" className="bg-white py-24 sm:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t(NAV_LABELS.team)}</p>
          <h2 className="h-section mt-3 max-w-3xl">{t(team.heading)}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70">{t(team.intro)}</p>
        </Reveal>

        {members.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m, i) => (
              <Reveal key={m.id} delay={i * 70}>
                <article className="flex h-full flex-col rounded-2xl border border-navy/10 bg-paper p-6 transition-shadow hover:shadow-soft">
                  <div className="flex items-center gap-4">
                    {m.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photoUrl} alt={m.name} className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
                        {initials(m.name) || "?"}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-bold text-navy">{m.name}</h3>
                      <p className="text-sm font-semibold text-scarlet">{t(m.role)}</p>
                    </div>
                  </div>
                  {t(m.bio) && <p className="mt-4 text-sm leading-relaxed text-ink/65">{t(m.bio)}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="rounded-2xl border-2 border-dashed border-navy/15 bg-paper px-6 py-16 text-center text-ink/55">
              {t(team.emptyState)}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
