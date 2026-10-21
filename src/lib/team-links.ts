import type { Locale } from "./types";

/** Public FRC team profile on The Blue Alliance (canonical for team numbers). */
export function teamBlueAllianceUrl(teamNumber: string | null | undefined): string | null {
  if (!teamNumber?.trim()) return null;
  const digits = teamNumber.replace(/\D/g, "");
  if (!digits) return null;
  return `https://www.thebluealliance.com/team/${digits}`;
}

/** Prefilled mailto for sponsor outreach (locale-aware subject). */
export function contactMailtoHref(
  email: string,
  locale: Locale,
  intent: "sponsor" | "general" = "sponsor",
  tierName?: string,
): string {
  const trimmed = email.trim();
  if (!trimmed) return "mailto:";

  const tier = tierName?.trim();
  const subject =
    intent === "sponsor"
      ? locale === "tr"
        ? tier
          ? `Sponsorluk — ${tier} — BALLOONS FRC`
          : "Sponsorluk — BALLOONS FRC"
        : tier
          ? `Sponsorship — ${tier} — BALLOONS FRC`
          : "Sponsorship inquiry — BALLOONS FRC"
      : locale === "tr"
        ? "Merhaba — BALLOONS FRC"
        : "Hello — BALLOONS FRC";

  const body =
    locale === "tr"
      ? "Merhaba BALLOONS ekibi,\n\n"
      : "Hello BALLOONS team,\n\n";

  const q = new URLSearchParams({ subject, body });
  return `mailto:${trimmed}?${q.toString()}`;
}
