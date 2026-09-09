"use client";

import { useRef, type ReactNode } from "react";
import { useEdit } from "./EditCtx";
import { useLocale } from "./LocaleCtx";
import { pick } from "@/lib/i18n";
import type { Localized } from "@/lib/types";

type Tag = "span" | "div" | "p" | "h1" | "h2" | "h3" | "a";

function LocalizedField({
  label,
  text,
  onBlur,
  multiline,
}: {
  label: string;
  text: string;
  onBlur: (next: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="loc-field">
      <span className="loc-tag">{label}</span>
      <div
        data-edit
        contentEditable
        suppressContentEditableWarning
        className={multiline ? "loc-multiline" : undefined}
        onBlur={(e) => {
          const txt = e.currentTarget.innerText.replace(/\n+$/g, "");
          if (txt !== text) onBlur(txt);
        }}
        onKeyDown={(e) => {
          if (!multiline && e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Language-independent inline text (brand name, wordmark). */
export function EPlain({
  value,
  onChange,
  as = "span",
  className,
  href,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: Tag;
  className?: string;
  href?: string;
  style?: React.CSSProperties;
}) {
  const { editMode } = useEdit();
  const Tag = as as any;

  if (editMode) {
    return (
      <Tag
        data-edit
        contentEditable
        suppressContentEditableWarning
        className={className}
        style={style}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const txt = e.currentTarget.innerText.replace(/\n+$/g, "");
          if (txt !== value) onChange(txt);
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (as !== "p" && as !== "div" && e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLElement).blur();
          }
        }}
      >
        {value}
      </Tag>
    );
  }

  if (as === "a") {
    return (
      <Tag href={href} className={className} style={style}>
        {value}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={style}>
      {value}
    </Tag>
  );
}

/** Inline click-to-edit text. Edits commit on blur. */
export function EText({
  value,
  onChange,
  as = "span",
  className,
  href,
  style,
}: {
  value: Localized;
  onChange: (v: Localized) => void;
  as?: Tag;
  className?: string;
  href?: string;
  style?: React.CSSProperties;
}) {
  const { editMode } = useEdit();
  const { locale } = useLocale();
  const Tag = as as keyof JSX.IntrinsicElements;
  const shown = pick(value, locale);
  const multiline = as === "p" || as === "div";

  if (editMode) {
    const patch = (key: "en" | "tr", next: string) => {
      if (next === value[key]) return;
      onChange({ ...value, [key]: next });
    };

    return (
      <div className={`loc-edit${className ? ` ${className}` : ""}`} style={style}>
        <LocalizedField label="EN" text={value.en} onBlur={(next) => patch("en", next)} multiline={multiline} />
        <LocalizedField label="TR" text={value.tr} onBlur={(next) => patch("tr", next)} multiline={multiline} />
      </div>
    );
  }

  if (as === "a") {
    return (
      <a href={href} className={className} style={style}>
        {shown}
      </a>
    );
  }

  const Comp = Tag;
  return (
    <Comp className={className} style={style}>
      {shown}
    </Comp>
  );
}

/** Image that can be replaced by clicking in edit mode; falls back to children when no url. */
export function EImage({
  url,
  onChange,
  alt = "",
  className,
  fallback,
}: {
  url: string | null;
  onChange: (url: string) => void;
  alt?: string | Localized;
  className?: string;
  fallback?: ReactNode;
}) {
  const { editMode, upload } = useEdit();
  const { locale } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const altText = typeof alt === "string" ? alt : pick(alt, locale);

  const img = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={altText} className={className} />
  ) : (
    fallback ?? null
  );

  if (!editMode) return <>{img}</>;

  return (
    <span
      className="edit-img"
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" ? inputRef.current?.click() : null)}
      style={{ display: "inline-block" }}
    >
      {img}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f, onChange);
          e.target.value = "";
        }}
      />
    </span>
  );
}

/** Per-item controls (delete / move) shown on hover in edit mode. */
export function ItemControls({
  onUp,
  onDown,
  onDelete,
}: {
  onUp?: () => void;
  onDown?: () => void;
  onDelete: () => void;
}) {
  const { editMode } = useEdit();
  if (!editMode) return null;
  return (
    <div className="item-ctrl">
      {onUp && <button onClick={onUp} title="Move up">↑</button>}
      {onDown && <button onClick={onDown} title="Move down">↓</button>}
      <button onClick={onDelete} title="Delete">✕</button>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  const { editMode } = useEdit();
  if (!editMode) return null;
  return (
    <button className="add-btn" onClick={onClick}>
      + {label}
    </button>
  );
}

export const rid = () => Math.random().toString(36).slice(2, 9);

/** array helpers */
export function moveItem<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
