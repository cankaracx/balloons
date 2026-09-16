"use client";

import { useCallback, useEffect } from "react";
import { pick } from "@/lib/i18n";
import { useLocale } from "./LocaleCtx";
import type { Frame } from "@/lib/types";

export default function GalleryLightbox({
  frames,
  index,
  onClose,
  onMove,
}: {
  frames: Frame[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const { locale } = useLocale();
  const frame = frames[index];
  const hasPrev = index > 0;
  const hasNext = index < frames.length - 1;

  const prev = useCallback(() => {
    if (hasPrev) onMove(index - 1);
  }, [hasPrev, index, onMove]);

  const next = useCallback(() => {
    if (hasNext) onMove(index + 1);
  }, [hasNext, index, onMove]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  if (!frame?.photoUrl) return null;

  const caption = pick(frame.caption, locale);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={caption || "Workshop photo"}>
      <button type="button" className="lightbox-back" aria-label="Close" onClick={onClose} />
      <div className="lightbox-in">
        <button type="button" className="lightbox-x" onClick={onClose} aria-label="Close">
          Close
        </button>
        {hasPrev && (
          <button type="button" className="lightbox-nav lightbox-prev" onClick={prev} aria-label="Previous photo">
            ‹
          </button>
        )}
        <figure className="lightbox-fig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={frame.photoUrl} alt={caption} />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
        {hasNext && (
          <button type="button" className="lightbox-nav lightbox-next" onClick={next} aria-label="Next photo">
            ›
          </button>
        )}
        <p className="lightbox-count">
          {index + 1} / {frames.length}
        </p>
      </div>
    </div>
  );
}
