"use client";

import { useState } from "react";
import type { Content, OutreachItem, Stat, Tier, SiteData } from "@/lib/types";
import { updateContent } from "@/actions/site";
import type { ApplyFn } from "./Dashboard";
import { BilingualArea, BilingualText, Card, SectionTitle, TextField } from "./ui";

const L = (): { en: string; tr: string } => ({ en: "", tr: "" });
const rid = () => Math.random().toString(36).slice(2, 9);

export default function ContentEditor({ data, apply }: { data: SiteData; apply: ApplyFn }) {
  const [c, setC] = useState<Content>(structuredClone(data.content));
  const [dirty, setDirty] = useState(false);

  function set<K extends keyof Content>(key: K, value: Content[K]) {
    setC((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }

  async function save() {
    await apply(updateContent(c));
    setDirty(false);
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Hero */}
      <Card>
        <SectionTitle title="Home / Hero" hint="The first thing visitors see." />
        <div className="space-y-4">
          <BilingualText label="Eyebrow (small label above the title)" value={c.hero.eyebrow} onChange={(v) => set("hero", { ...c.hero, eyebrow: v })} />
          <TextField label="Wordmark / title" value={c.hero.title} onChange={(v) => set("hero", { ...c.hero, title: v })} hint="Shown the same in both languages, e.g. “BALLOONS”." />
          <BilingualArea label="Tagline" value={c.hero.tagline} onChange={(v) => set("hero", { ...c.hero, tagline: v })} rows={2} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BilingualText label="Primary button" value={c.hero.ctaPrimary} onChange={(v) => set("hero", { ...c.hero, ctaPrimary: v })} />
            <BilingualText label="Secondary button" value={c.hero.ctaSecondary} onChange={(v) => set("hero", { ...c.hero, ctaSecondary: v })} />
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <SectionTitle title="About" />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.about.heading} onChange={(v) => set("about", { ...c.about, heading: v })} />
          <BilingualArea label="Body" value={c.about.body} onChange={(v) => set("about", { ...c.about, body: v })} rows={4} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy/80">Stats</span>
              <button
                type="button"
                className="text-sm font-semibold text-scarlet-600 hover:underline"
                onClick={() => set("about", { ...c.about, stats: [...c.about.stats, { id: rid(), value: L(), label: L() }] })}
              >
                + Add stat
              </button>
            </div>
            <div className="space-y-3">
              {c.about.stats.map((s: Stat, i) => (
                <div key={s.id} className="rounded-xl border border-navy/10 bg-paper p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-navy/45">Stat {i + 1}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-scarlet-600 hover:underline"
                      onClick={() => set("about", { ...c.about, stats: c.about.stats.filter((x) => x.id !== s.id) })}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <BilingualText label="Value" value={s.value} onChange={(v) => set("about", { ...c.about, stats: c.about.stats.map((x) => (x.id === s.id ? { ...x, value: v } : x)) })} />
                    <BilingualText label="Label" value={s.label} onChange={(v) => set("about", { ...c.about, stats: c.about.stats.map((x) => (x.id === s.id ? { ...x, label: v } : x)) })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Sponsors copy + tiers */}
      <Card>
        <SectionTitle title="Sponsors section" hint="The sponsor logos themselves are managed in the Sponsors tab." />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.sponsors.heading} onChange={(v) => set("sponsors", { ...c.sponsors, heading: v })} />
          <BilingualArea label="Pitch" value={c.sponsors.pitch} onChange={(v) => set("sponsors", { ...c.sponsors, pitch: v })} rows={3} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BilingualText label="Call-to-action button" value={c.sponsors.cta} onChange={(v) => set("sponsors", { ...c.sponsors, cta: v })} />
            <BilingualText label="Empty state (no sponsors yet)" value={c.sponsors.emptyState} onChange={(v) => set("sponsors", { ...c.sponsors, emptyState: v })} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy/80">Sponsorship tiers</span>
              <button
                type="button"
                className="text-sm font-semibold text-scarlet-600 hover:underline"
                onClick={() => set("sponsors", { ...c.sponsors, tiers: [...c.sponsors.tiers, { id: rid(), name: L(), amount: L(), perks: L(), featured: false }] })}
              >
                + Add tier
              </button>
            </div>
            <div className="space-y-3">
              {c.sponsors.tiers.map((tier: Tier, i) => (
                <div key={tier.id} className="rounded-xl border border-navy/10 bg-paper p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-navy/45">Tier {i + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-navy/70">
                        <input
                          type="checkbox"
                          checked={tier.featured}
                          onChange={(e) => set("sponsors", { ...c.sponsors, tiers: c.sponsors.tiers.map((x) => (x.id === tier.id ? { ...x, featured: e.target.checked } : x)) })}
                        />
                        Featured
                      </label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-scarlet-600 hover:underline"
                        onClick={() => set("sponsors", { ...c.sponsors, tiers: c.sponsors.tiers.filter((x) => x.id !== tier.id) })}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <BilingualText label="Tier name" value={tier.name} onChange={(v) => set("sponsors", { ...c.sponsors, tiers: c.sponsors.tiers.map((x) => (x.id === tier.id ? { ...x, name: v } : x)) })} />
                    <BilingualText label="Amount (free text, e.g. ₺50,000+)" value={tier.amount} onChange={(v) => set("sponsors", { ...c.sponsors, tiers: c.sponsors.tiers.map((x) => (x.id === tier.id ? { ...x, amount: v } : x)) })} />
                    <BilingualArea label="Perks (one per line)" value={tier.perks} onChange={(v) => set("sponsors", { ...c.sponsors, tiers: c.sponsors.tiers.map((x) => (x.id === tier.id ? { ...x, perks: v } : x)) })} rows={4} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Team copy */}
      <Card>
        <SectionTitle title="Team section text" hint="Members are managed in the Team tab." />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.team.heading} onChange={(v) => set("team", { ...c.team, heading: v })} />
          <BilingualArea label="Intro" value={c.team.intro} onChange={(v) => set("team", { ...c.team, intro: v })} rows={3} />
          <BilingualText label="Empty state (no members yet)" value={c.team.emptyState} onChange={(v) => set("team", { ...c.team, emptyState: v })} />
        </div>
      </Card>

      {/* Gallery copy */}
      <Card>
        <SectionTitle title="Gallery section text" hint="Images are managed in the Gallery tab." />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.gallery.heading} onChange={(v) => set("gallery", { ...c.gallery, heading: v })} />
          <BilingualArea label="Intro" value={c.gallery.intro} onChange={(v) => set("gallery", { ...c.gallery, intro: v })} rows={2} />
          <BilingualText label="Empty state (no images yet)" value={c.gallery.emptyState} onChange={(v) => set("gallery", { ...c.gallery, emptyState: v })} />
        </div>
      </Card>

      {/* Outreach */}
      <Card>
        <SectionTitle title="Outreach" />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.outreach.heading} onChange={(v) => set("outreach", { ...c.outreach, heading: v })} />
          <BilingualArea label="Body" value={c.outreach.body} onChange={(v) => set("outreach", { ...c.outreach, body: v })} rows={3} />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy/80">Outreach items</span>
              <button
                type="button"
                className="text-sm font-semibold text-scarlet-600 hover:underline"
                onClick={() => set("outreach", { ...c.outreach, items: [...c.outreach.items, { id: rid(), title: L(), body: L() }] })}
              >
                + Add item
              </button>
            </div>
            <div className="space-y-3">
              {c.outreach.items.map((item: OutreachItem, i) => (
                <div key={item.id} className="rounded-xl border border-navy/10 bg-paper p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-navy/45">Item {i + 1}</span>
                    <button
                      type="button"
                      className="text-xs font-semibold text-scarlet-600 hover:underline"
                      onClick={() => set("outreach", { ...c.outreach, items: c.outreach.items.filter((x) => x.id !== item.id) })}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-2">
                    <BilingualText label="Title" value={item.title} onChange={(v) => set("outreach", { ...c.outreach, items: c.outreach.items.map((x) => (x.id === item.id ? { ...x, title: v } : x)) })} />
                    <BilingualArea label="Body" value={item.body} onChange={(v) => set("outreach", { ...c.outreach, items: c.outreach.items.map((x) => (x.id === item.id ? { ...x, body: v } : x)) })} rows={2} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card>
        <SectionTitle title="Contact" />
        <div className="space-y-4">
          <BilingualText label="Heading" value={c.contact.heading} onChange={(v) => set("contact", { ...c.contact, heading: v })} />
          <BilingualArea label="Body" value={c.contact.body} onChange={(v) => set("contact", { ...c.contact, body: v })} rows={2} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Email" value={c.contact.email} onChange={(v) => set("contact", { ...c.contact, email: v })} />
            <TextField label="Phone" value={c.contact.phone} onChange={(v) => set("contact", { ...c.contact, phone: v })} />
          </div>
          <BilingualText label="Location" value={c.contact.location} onChange={(v) => set("contact", { ...c.contact, location: v })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Instagram (handle or URL)" value={c.contact.instagram} onChange={(v) => set("contact", { ...c.contact, instagram: v })} />
            <TextField label="LinkedIn (URL)" value={c.contact.linkedin} onChange={(v) => set("contact", { ...c.contact, linkedin: v })} />
          </div>
        </div>
      </Card>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <span className="text-sm text-ink/60">{dirty ? "You have unsaved changes." : "All changes saved."}</span>
          <button onClick={save} disabled={!dirty} className="btn-primary px-6 py-2.5 disabled:opacity-50">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
