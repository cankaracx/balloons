"use client";

import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content } from "@/lib/types";

function instaUrl(handle: string) {
  if (!handle) return "";
  if (handle.startsWith("http")) return handle;
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

export default function Contact({ contact }: { contact: Content["contact"] }) {
  const { t } = useLang();

  const rows: { label: string; value: string; href?: string }[] = [];
  if (contact.email)
    rows.push({ label: t({ en: "Email", tr: "E-posta" }), value: contact.email, href: `mailto:${contact.email}` });
  if (contact.phone)
    rows.push({ label: t({ en: "Phone", tr: "Telefon" }), value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` });
  if (t(contact.location)) rows.push({ label: t({ en: "Location", tr: "Konum" }), value: t(contact.location) });
  if (contact.instagram)
    rows.push({ label: "Instagram", value: contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""), href: instaUrl(contact.instagram) });
  if (contact.linkedin)
    rows.push({ label: "LinkedIn", value: t({ en: "View profile", tr: "Profili gör" }), href: contact.linkedin });

  return (
    <section id="contact" className="bg-white py-24 sm:py-28">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t(NAV_LABELS.contact)}</p>
            <h2 className="h-section mt-3">{t(contact.heading)}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">{t(contact.body)}</p>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="btn-primary mt-8">
                {t({ en: "Start a conversation", tr: "İletişime geçin" })}
              </a>
            )}
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-navy/10 bg-paper p-8">
              <dl className="divide-y divide-navy/10">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-6 py-4 first:pt-0 last:pb-0">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-navy/55">{r.label}</dt>
                    <dd className="text-right font-medium text-navy">
                      {r.href ? (
                        <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="transition-colors hover:text-scarlet">
                          {r.value}
                        </a>
                      ) : (
                        r.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
