"use client";

import { useState } from "react";
import type { Sponsor, SiteData } from "@/lib/types";
import { deleteSponsor, moveSponsor, saveSponsor } from "@/actions/site";
import type { ApplyFn } from "./Dashboard";
import { BilingualArea, Card, ImageUpload, RowControls, SectionTitle, TextField } from "./ui";

const empty = (): Sponsor => ({ id: "", name: "", logoUrl: null, website: "", tier: "", description: { en: "", tr: "" }, sort: 0 });

export default function SponsorsEditor({ data, apply }: { data: SiteData; apply: ApplyFn }) {
  const sponsors = [...data.sponsors].sort((a, b) => a.sort - b.sort);
  const tierNames = data.content.sponsors.tiers.map((t) => t.name.en).filter(Boolean);
  const [draft, setDraft] = useState<Sponsor | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(p: Promise<SiteData>) {
    setBusy(true);
    await apply(p);
    setBusy(false);
  }

  async function save() {
    if (!draft) return;
    await run(saveSponsor(draft));
    setDraft(null);
  }

  if (draft) {
    return (
      <Card>
        <SectionTitle title={draft.id ? "Edit sponsor" : "Add sponsor"} />
        <div className="space-y-4">
          <TextField label="Sponsor name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Acme Robotics" />
          <ImageUpload label="Logo" url={draft.logoUrl} onChange={(url) => setDraft({ ...draft, logoUrl: url })} aspect="aspect-video" />
          <TextField label="Website (optional)" value={draft.website} onChange={(v) => setDraft({ ...draft, website: v })} placeholder="https://example.com" />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-navy/80">Tier</span>
            <select
              className="w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-scarlet"
              value={draft.tier}
              onChange={(e) => setDraft({ ...draft, tier: e.target.value })}
            >
              <option value="">— No tier —</option>
              {tierNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-ink/50">Tiers come from the Content tab → Sponsors section.</span>
          </label>
          <BilingualArea label="Description (optional)" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} rows={2} />
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={busy || !draft.name.trim()} className="btn-primary px-6 py-2.5 disabled:opacity-50">
              {busy ? "Saving…" : "Save sponsor"}
            </button>
            <button onClick={() => setDraft(null)} className="btn-secondary px-6 py-2.5">
              Cancel
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <SectionTitle title="Sponsors" hint="Logos arrange automatically on the site. Reorder to control priority." />
        <button onClick={() => setDraft(empty())} className="btn-primary px-4 py-2 text-sm">
          + Add sponsor
        </button>
      </div>

      {sponsors.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-navy/15 bg-paper px-4 py-12 text-center text-sm text-ink/55">
          No sponsors yet. When you add them, the public site shows the logos; until then it shows an inviting “your logo here” placeholder.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {sponsors.map((s, i) => (
            <li key={s.id} className="flex items-center gap-4 rounded-xl border border-navy/10 bg-paper p-3">
              <div className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-navy/10 bg-white">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt="" className="h-full w-full object-contain p-1" />
                ) : (
                  <span className="text-[10px] text-ink/40">No logo</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{s.name || "Untitled"}</p>
                <p className="truncate text-sm text-ink/55">{s.tier || "No tier"}</p>
              </div>
              <RowControls
                busy={busy}
                isFirst={i === 0}
                isLast={i === sponsors.length - 1}
                onUp={() => run(moveSponsor(s.id, "up"))}
                onDown={() => run(moveSponsor(s.id, "down"))}
                onEdit={() => setDraft(structuredClone(s))}
                onDelete={() => {
                  if (confirm(`Delete ${s.name || "this sponsor"}?`)) run(deleteSponsor(s.id));
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
