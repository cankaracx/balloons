"use client";

import { useState } from "react";
import { useLocale } from "./LocaleCtx";

export default function CopyEmailButton({ email }: { email: string }) {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = email.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  const label =
    copied
      ? locale === "tr"
        ? "Kopyalandı"
        : "Copied"
      : locale === "tr"
        ? "E-postayı kopyala"
        : "Copy email";

  return (
    <button type="button" className="copy-mail" onClick={copy} disabled={!email.trim()}>
      {label}
    </button>
  );
}
