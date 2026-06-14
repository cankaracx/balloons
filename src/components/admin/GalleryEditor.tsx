"use client";

import { useState } from "react";
import type { GalleryImage, SiteData } from "@/lib/types";
import { deleteGalleryImage, moveGalleryImage, saveGalleryImage } from "@/actions/site";
import type { ApplyFn } from "./Dashboard";
import { BilingualText, Card, ImageUpload, RowControls, SectionTitle } from "./ui";

const empty = (): GalleryImage => ({ id: "", url: "", caption: { en: "", tr: "" }, sort: 0 });

export default function GalleryEditor({ data, apply }: { data: SiteData; apply: ApplyFn }) {
  const images = [...data.gallery].sort((a, b) => a.sort - b.sort);
  const [draft, setDraft] = useState<GalleryImage | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(p: Promise<SiteData>) {
    setBusy(true);
    await apply(p);
    setBusy(false);
  }

  async function save() {
    if (!draft) return;
    await run(saveGalleryImage(draft));
    setDraft(null);
  }

  if (draft) {
    return (
      <Card>
        <SectionTitle title={draft.id ? "Edit image" : "Add image"} />
        <div className="space-y-4">
          <ImageUpload label="Image" url={draft.url || null} onChange={(url) => setDraft({ ...draft, url: url || "" })} aspect="aspect-video" />
          <BilingualText label="Caption (optional)" value={draft.caption} onChange={(v) => setDraft({ ...draft, caption: v })} />
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={busy || !draft.url} className="btn-primary px-6 py-2.5 disabled:opacity-50">
              {busy ? "Saving…" : "Save image"}
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
        <SectionTitle title="Gallery" hint="Upload photos of your team, builds, and events." />
        <button onClick={() => setDraft(empty())} className="btn-primary px-4 py-2 text-sm">
          + Add image
        </button>
      </div>

      {images.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-navy/15 bg-paper px-4 py-12 text-center text-sm text-ink/55">
          No images yet. Add a few to bring the gallery to life.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {images.map((g, i) => (
            <li key={g.id} className="overflow-hidden rounded-xl border border-navy/10 bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.url} alt="" className="aspect-video w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-3">
                <p className="min-w-0 flex-1 truncate text-sm text-ink/60">{g.caption.en || "No caption"}</p>
                <RowControls
                  busy={busy}
                  isFirst={i === 0}
                  isLast={i === images.length - 1}
                  onUp={() => run(moveGalleryImage(g.id, "up"))}
                  onDown={() => run(moveGalleryImage(g.id, "down"))}
                  onEdit={() => setDraft(structuredClone(g))}
                  onDelete={() => {
                    if (confirm("Delete this image?")) run(deleteGalleryImage(g.id));
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
