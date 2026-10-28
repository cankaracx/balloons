import type { Locale } from "./types";

/** Shared by localStorage (client) and HTTP cookie (server). */
export const LOCALE_STORAGE_KEY = "balloons-locale";

export function parseLocale(value: string | undefined | null): Locale | null {
  if (value === "tr" || value === "en") return value;
  return null;
}

export function localeCookieValue(locale: Locale): string {
  return `${LOCALE_STORAGE_KEY}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}
