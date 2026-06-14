"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import Reveal from "./Reveal";
import { NAV_LABELS } from "@/lib/i18n";
import type { Content, GalleryImage } from "@/lib/types";

export default function Gallery({ gallery, list }: { gallery: Content["gallery"]; list: GalleryImage[] }) {
  const { t } = useLang();
  const [active, setActive] = useState<GalleryImage | null>(null);
  const images = [...list].sort((a, b) => a.sort - b.sort);

  return (
    <section id="gallery" className="bg-paper py-24 sm:py-28">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{t(NAV_LABELS.gallery)}</p>
          <h2 className="h-section mt-3 max-w-3xl">{t(gallery.heading)}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/70">{t(gallery.intro)}</p>
        </Reveal>

        {images.length > 0 ? (
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setActive(img)}
                className="group relative block w-full overflow-hidden rounded-xl"
                aria-label={t(img.caption) || "Open image"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={t(img.caption)}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition-transform duration-500 group-hover:scale-105"
                />
                {t(img.caption) && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-navy/80 to-transparent p-4 text-left text-sm font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    {t(img.caption)}
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="rounded-2xl border-2 border-dashed border-navy/15 bg-white/50 px-6 py-16 text-center text-ink/55">
              {t(gallery.emptyState)}
            </div>
          </Reveal>
        )}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/90 p-6 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute right-5 top-5 text-white/80 hover:text-white"
            onClick={() => setActive(null)}
            aria-label="Close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.url}
            alt={t(active.caption)}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
