"use client";

import { useRef, useState, type ReactNode } from "react";
import type { Localized } from "@/lib/types";

/* ── Layout primitives ── */

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-navy/10 bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-display text-xl font-bold text-navy">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
    </div>
  );
}

const fieldBase =
  "w-full rounded-xl border border-navy/15 bg-white px-3.5 py-2.5 text-sm text-navy outline-none transition-colors focus:border-scarlet placeholder:text-ink/35";

/* ── Single-language fields ── */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy/80">{label}</span>
      <input type={type} className={fieldBase} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-navy/80">{label}</span>
      <textarea className={`${fieldBase} resize-y leading-relaxed`} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/* ── Bilingual fields (EN + TR side by side) ── */

export function BilingualText({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  hint?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-navy/80">{label}</span>
      {hint && <span className="-mt-1 mb-2 block text-xs text-ink/50">{hint}</span>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-navy/45">English</span>
          <input className={fieldBase} value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-navy/45">Türkçe</span>
          <input className={fieldBase} value={value.tr} onChange={(e) => onChange({ ...value, tr: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export function BilingualArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: Localized;
  onChange: (v: Localized) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-navy/80">{label}</span>
      {hint && <span className="-mt-1 mb-2 block text-xs text-ink/50">{hint}</span>}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-navy/45">English</span>
          <textarea className={`${fieldBase} resize-y leading-relaxed`} rows={rows} value={value.en} onChange={(e) => onChange({ ...value, en: e.target.value })} />
        </div>
        <div>
          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-navy/45">Türkçe</span>
          <textarea className={`${fieldBase} resize-y leading-relaxed`} rows={rows} value={value.tr} onChange={(e) => onChange({ ...value, tr: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

/* ── Image upload widget ── */

export function ImageUpload({
  label,
  url,
  onChange,
  rounded = "rounded-xl",
  aspect = "aspect-video",
}: {
  label: string;
  url: string | null;
  onChange: (url: string | null) => void;
  rounded?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(file: File) {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) onChange(data.url);
      else setErr(data.error || "Upload failed");
    } catch {
      setErr("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-navy/80">{label}</span>
      <div className="flex items-center gap-4">
        <div className={`relative flex ${aspect} w-28 shrink-0 items-center justify-center overflow-hidden ${rounded} border border-navy/15 bg-paper`}>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-ink/40">No image</span>
          )}
          {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-semibold text-navy">Uploading…</div>}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary px-4 py-2 text-sm">
            {url ? "Replace" : "Upload"}
          </button>
          {url && (
            <button type="button" onClick={() => onChange(null)} className="text-left text-xs font-semibold text-scarlet-600 hover:underline">
              Remove
            </button>
          )}
        </div>
      </div>
      {err && <p className="mt-2 text-xs font-medium text-scarlet-600">{err}</p>}
    </div>
  );
}

/* ── Reorder + row controls ── */

export function RowControls({
  onUp,
  onDown,
  onEdit,
  onDelete,
  isFirst,
  isLast,
  busy,
}: {
  onUp: () => void;
  onDown: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  isFirst: boolean;
  isLast: boolean;
  busy?: boolean;
}) {
  const iconBtn = "flex h-8 w-8 items-center justify-center rounded-lg border border-navy/15 text-navy/70 transition-colors hover:border-navy/40 hover:text-navy disabled:opacity-30";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onUp} disabled={isFirst || busy} className={iconBtn} aria-label="Move up">↑</button>
      <button type="button" onClick={onDown} disabled={isLast || busy} className={iconBtn} aria-label="Move down">↓</button>
      {onEdit && (
        <button type="button" onClick={onEdit} disabled={busy} className={`${iconBtn} w-auto px-3 text-sm font-semibold`}>Edit</button>
      )}
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        className="flex h-8 items-center justify-center rounded-lg border border-scarlet/30 px-3 text-sm font-semibold text-scarlet-600 transition-colors hover:bg-scarlet hover:text-white disabled:opacity-30"
      >
        Delete
      </button>
    </div>
  );
}
