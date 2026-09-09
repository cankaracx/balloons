"use client";

import { useLocale } from "./LocaleCtx";
import type { Locale } from "@/lib/types";

export default function LangSwitch() {
  const { locale, setLocale } = useLocale();

  const set = (next: Locale) => {
    if (next !== locale) setLocale(next);
  };

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={locale === "en" ? "on" : undefined}
        aria-pressed={locale === "en"}
        onClick={() => set("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "tr" ? "on" : undefined}
        aria-pressed={locale === "tr"}
        onClick={() => set("tr")}
      >
        TR
      </button>
    </div>
  );
}
