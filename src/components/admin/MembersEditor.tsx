"use client";

import { useState } from "react";
import type { Member, SiteData } from "@/lib/types";
import { deleteMember, moveMember, saveMember } from "@/actions/site";
import type { ApplyFn } from "./Dashboard";
import { BilingualArea, BilingualText, Card, ImageUpload, RowControls, SectionTitle, TextField } from "./ui";

const empty = (): Member => ({ id: "", name: "", role: { en: "", tr: "" }, bio: { en: "", tr: "" }, photoUrl: null, sort: 0 });

export default function MembersEditor({ data, apply }: { data: SiteData; apply: ApplyFn }) {
  const members = [...data.members].sort((a, b) => a.sort - b.sort);
  const [draft, setDraft] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(p: Promise<SiteData>) {
    setBusy(true);
    await apply(p);
    setBusy(false);
  }

  async function save() {
    if (!draft) return;
    await run(saveMember(draft));
    setDraft(null);
  }

  if (draft) {
    return (
      <Card>
        <SectionTitle title={draft.id ? "Edit member" : "Add member"} />
        <div className="space-y-4">
          <TextField label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Jane Doe" />
          <BilingualText label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} hint="e.g. Captain / Kaptan" />
          <BilingualArea label="Short bio" value={draft.bio} onChange={(v) => setDraft({ ...draft, bio: v })} rows={3} />
          <ImageUpload label="Photo" url={draft.photoUrl} onChange={(url) => setDraft({ ...draft, photoUrl: url })} rounded="rounded-full" aspect="aspect-square" />
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={busy || !draft.name.trim()} className="btn-primary px-6 py-2.5 disabled:opacity-50">
              {busy ? "Saving…" : "Save member"}
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
        <SectionTitle title="Team members" hint="Add, reorder, and edit your team. Order here is the order shown on the site." />
        <button onClick={() => setDraft(empty())} className="btn-primary px-4 py-2 text-sm">
          + Add member
        </button>
      </div>

      {members.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-navy/15 bg-paper px-4 py-12 text-center text-sm text-ink/55">
          No members yet. Add your first one to get started.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {members.map((m, i) => (
            <li key={m.id} className="flex items-center gap-4 rounded-xl border border-navy/10 bg-paper p-3">
              {m.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photoUrl} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {m.name.slice(0, 1).toUpperCase() || "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{m.name || "Untitled"}</p>
                <p className="truncate text-sm text-ink/55">{m.role.en}</p>
              </div>
              <RowControls
                busy={busy}
                isFirst={i === 0}
                isLast={i === members.length - 1}
                onUp={() => run(moveMember(m.id, "up"))}
                onDown={() => run(moveMember(m.id, "down"))}
                onEdit={() => setDraft(structuredClone(m))}
                onDelete={() => {
                  if (confirm(`Delete ${m.name || "this member"}?`)) run(deleteMember(m.id));
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
