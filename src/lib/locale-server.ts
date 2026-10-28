import "server-only";
import { cookies, headers } from "next/headers";
import type { Locale } from "./types";
import { LOCALE_STORAGE_KEY, parseLocale } from "./locale-cookie";

/** Locale for this request: saved choice, then browser language, then English. */
export function getRequestLocale(): Locale {
  const jar = cookies();
  const fromCookie = parseLocale(jar.get(LOCALE_STORAGE_KEY)?.value);
  if (fromCookie) return fromCookie;

  const accept = headers().get("accept-language") ?? "";
  const primary = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (primary.startsWith("tr")) return "tr";

  return "en";
}
