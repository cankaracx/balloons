"use client";

import { useRef, type ReactNode } from "react";
import { useEdit } from "./EditCtx";

type Tag = "span" | "div" | "p" | "h1" | "h2" | "h3" | "a";

/** Inline click-to-edit text. Edits commit on blur. */
export function EText({
  value,
  onChange,
  as = "span",
  className,
  href,
  style,
  onClick,
}: {
  value: string;
  onChange: (v: string) => void;
  as?: Tag;
  className?: string;
  href?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const { editMode } = useEdit();
  const ref = useRef<HTMLElement>(null);
  const Tag = as as any;

  if (editMode) {
    return (
      <Tag
        ref={ref}
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
  // view mode
  if (as === "a") {
    return (
      <Tag href={href} className={className} style={style} onClick={onClick}>
        {value}
      </Tag>
    );
  }
  return (
    <Tag className={className} style={style} onClick={onClick}>
      {value}
    </Tag>
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
  alt?: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const { editMode, upload } = useEdit();
  const inputRef = useRef<HTMLInputElement>(null);

  const img = url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className={className} />
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
