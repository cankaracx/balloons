"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteData } from "@/lib/types";
import Pufferfish from "@/components/public/Pufferfish";
import ContentEditor from "./ContentEditor";
import MembersEditor from "./MembersEditor";
import SponsorsEditor from "./SponsorsEditor";
import GalleryEditor from "./GalleryEditor";
import BrandEditor from "./BrandEditor";

export type ApplyFn = (p: Promise<SiteData>) => Promise<void>;
type Status = "idle" | "saving" | "saved" | "error";

const TABS = [
  { id: "content", label: "Content" },
  { id: "members", label: "Team" },
  { id: "sponsors", label: "Sponsors" },
  { id: "gallery", label: "Gallery" },
  { id: "brand", label: "Logo & Brand" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Dashboard({ initialData, cloud }: { initialData: SiteData; cloud: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<SiteData>(initialData);
  const [tab, setTab] = useState<TabId>("content");
  const [status, setStatus] = useState<Status>("idle");

  const apply = useCallback<ApplyFn>(async (p) => {
    setStatus("saving");
    try {
      const next = await p;
      setData(next);
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Pufferfish size={32} />
            <span className="font-display text-base font-bold text-navy">BALLOONS Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={status} />
            <a href="/" target="_blank" rel="noreferrer" className="hidden text-sm font-medium text-navy/65 hover:text-navy sm:inline">
              View site ↗
            </a>
            <button onClick={logout} className="btn-secondary px-4 py-2 text-sm">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-6">
        {!cloud && (
          <div className="mb-6 rounded-xl border border-scarlet/25 bg-scarlet/5 px-4 py-3 text-sm text-navy/80">
            <strong className="font-semibold">Local preview mode.</strong> Changes are saved to a local file and reset on redeploy. Connect Supabase (see the
            README) to make edits permanent in production.
          </div>
        )}

        {/* Tabs */}
        <nav className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tdef) => (
            <button
              key={tdef.id}
              onClick={() => setTab(tdef.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                tab === tdef.id ? "bg-navy text-white" : "border border-navy/15 text-navy/70 hover:border-navy/40 hover:text-navy"
              }`}
            >
              {tdef.label}
            </button>
          ))}
        </nav>

        {tab === "content" && <ContentEditor data={data} apply={apply} />}
        {tab === "members" && <MembersEditor data={data} apply={apply} />}
        {tab === "sponsors" && <SponsorsEditor data={data} apply={apply} />}
        {tab === "gallery" && <GalleryEditor data={data} apply={apply} />}
        {tab === "brand" && <BrandEditor data={data} apply={apply} />}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  if (status === "idle") return null;
  const map = {
    saving: { text: "Saving…", cls: "bg-navy/10 text-navy/70" },
    saved: { text: "Saved ✓", cls: "bg-green-100 text-green-700" },
    error: { text: "Save failed", cls: "bg-scarlet/10 text-scarlet-600" },
  } as const;
  const s = map[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.cls}`}>{s.text}</span>;
}
