"use client";

import { useEffect, useId, useRef } from "react";
import { EText } from "./Editable";

type NavLink = { id: string; label: string; href: string };

export default function MobileNav({
  links,
  cta,
  sectionIdx,
  open,
  onOpenChange,
  onCtaChange,
  onLinkChange,
}: {
  links: NavLink[];
  cta: string;
  sectionIdx: Record<string, string>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCtaChange: (v: string) => void;
  onLinkChange: (index: number, v: string) => void;
}) {
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <button
        type="button"
        className="nav-menu-btn"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id={panelId}
        className={`nav-drawer${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <div className="nav-drawer-in">
          <ul className="nav-drawer-list">
            {links.map((l, i) => (
              <li key={l.id}>
                <a
                  href={l.href}
                  className="nav-drawer-link"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="nav-drawer-idx">{sectionIdx[l.href] ?? "—"}</span>
                  <EText value={l.label} onChange={(v) => onLinkChange(i, v)} />
                </a>
              </li>
            ))}
          </ul>
          <a href="#support" className="btn fill nav-drawer-cta" onClick={() => onOpenChange(false)}>
            <EText value={cta} onChange={onCtaChange} />
          </a>
          <button ref={closeRef} type="button" className="nav-drawer-close" onClick={() => onOpenChange(false)}>
            Close menu
          </button>
        </div>
      </div>
      {open && (
        <button
          type="button"
          className="nav-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => onOpenChange(false)}
        />
      )}
    </>
  );
}
