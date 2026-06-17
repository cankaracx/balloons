"use client";

import { useState } from "react";
import type { SiteData } from "@/lib/types";
import { updateContent } from "@/actions/site";
import type { ApplyFn } from "./Dashboard";
import { Card, ImageUpload, SectionTitle, TextField } from "./ui";

export default function BrandEditor({ data, apply }: { data: SiteData; apply: ApplyFn }) {
  const [brand, setBrand] = useState(structuredClone(data.content.brand));
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  function update<K extends keyof typeof brand>(key: K, value: (typeof brand)[K]) {
    setBrand((b) => ({ ...b, [key]: value }));
    setDirty(true);
  }

  async function save() {
    setBusy(true);
    await apply(updateContent({ ...data.content, brand }));
    setBusy(false);
    setDirty(false);
  }

  return (
    <Card>
      <SectionTitle title="Logo & brand" hint="Leave the logo empty to use the built-in pufferfish mascot." />
      <div className="max-w-md space-y-5">
        <ImageUpload label="Logo" url={brand.logoUrl} onChange={(url) => update("logoUrl", url)} aspect="aspect-square" rounded="rounded-2xl" />
        <TextField label="Team name" value={brand.name} onChange={(v) => update("name", v)} placeholder="BALLOONS" />
        <TextField
          label="Team number"
          value={brand.teamNumber}
          onChange={(v) => update("teamNumber", v)}
          placeholder="e.g. 9999"
          hint="Leave blank until FIRST assigns your number — the site hides it automatically."
        />
        <button onClick={save} disabled={busy || !dirty} className="btn-primary px-6 py-2.5 disabled:opacity-50">
          {busy ? "Saving…" : "Save"}
        </button>
      </div>
    </Card>
  );
}
