"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Locale, Localized } from "@/lib/types";
import { t as translate } from "@/lib/i18n";

type Ctx = {
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (v?: Localized) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(initial);

  const setLang = useCallback((l: Locale) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      document.cookie = `lang=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      document.documentElement.lang = l;
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (v?: Localized) => translate(v, lang) }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
