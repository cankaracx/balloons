import type { Locale, Localized } from "./types";

/** Resolve a Localized value to a string for the given locale (falls back to EN). */
export function t(value: Localized | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.en || "";
}

export const NAV_LABELS: Record<string, Localized> = {
  home: { en: "Home", tr: "Ana Sayfa" },
  about: { en: "About", tr: "Hakkımızda" },
  sponsors: { en: "Sponsors", tr: "Sponsorlar" },
  team: { en: "Team", tr: "Takım" },
  gallery: { en: "Gallery", tr: "Galeri" },
  outreach: { en: "Outreach", tr: "Sosyal Etki" },
  contact: { en: "Contact", tr: "İletişim" },
};
