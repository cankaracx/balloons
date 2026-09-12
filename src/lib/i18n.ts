import type { Locale, Localized, SiteData } from "./types";

export type { Locale };

/** Resolve localized copy for the active locale (falls back to English). */
export function pick(value: Localized | undefined, locale: Locale): string {
  if (!value) return "";
  const text = value[locale];
  if (text != null && text.trim() !== "") return text;
  return value.en || "";
}

export function loc(en: string, tr: string): Localized {
  return { en, tr };
}

export function isLocalized(v: unknown): v is Localized {
  return typeof v === "object" && v !== null && "en" in v && "tr" in v;
}

/** Wrap legacy plain strings from older saves. */
export function asLocalized(v: unknown, fallbackTr = ""): Localized {
  if (isLocalized(v)) return v;
  if (typeof v === "string") return { en: v, tr: fallbackTr || v };
  return { en: "", tr: "" };
}

const LOCALE_KEY = "balloons-locale";

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LOCALE_KEY);
  return stored === "tr" ? "tr" : "en";
}

export function storeLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
}

/** Upgrade pre-bilingual JSON rows to the Localized shape using seed Turkish copy. */
export function migrateSiteData(raw: unknown, seed: SiteData): SiteData {
  const d = structuredClone(raw) as Record<string, unknown>;
  const s = seed;

  d.nav = migrateNav(d.nav, s.nav);
  d.hero = migrateHero(d.hero, s.hero);
  d.marquee = migrateMarquee(d.marquee, s.marquee);
  d.about = migrateAbout(d.about, s.about);
  d.support = migrateSupport(d.support, s.support);
  d.sponsors = migrateSponsors(d.sponsors, s.sponsors);
  d.team = migrateTeam(d.team, s.team);
  d.work = migrateWork(d.work, s.work);
  d.outreach = migrateOutreach(d.outreach, s.outreach);
  d.contact = migrateContact(d.contact, s.contact);
  d.footer = migrateFooter(d.footer, s.footer);

  return d as SiteData;
}

function migrateNav(raw: unknown, seed: SiteData["nav"]) {
  const n = (raw ?? {}) as Record<string, unknown>;
  const links = Array.isArray(n.links) ? n.links : seed.links;
  return {
    links: links.map((link: Record<string, unknown>, i: number) => ({
      id: String(link.id ?? seed.links[i]?.id ?? `n${i}`),
      href: String(link.href ?? seed.links[i]?.href ?? "#"),
      label: asLocalized(link.label, pick(seed.links[i]?.label, "tr")),
    })),
    cta: asLocalized(n.cta, pick(seed.cta, "tr")),
  };
}

function migrateHero(raw: unknown, seed: SiteData["hero"]) {
  const h = (raw ?? {}) as Record<string, unknown>;
  return {
    eyebrow: asLocalized(h.eyebrow, pick(seed.eyebrow, "tr")),
    title: typeof h.title === "string" ? h.title : seed.title,
    sub: asLocalized(h.sub, pick(seed.sub, "tr")),
    ctaPrimary: asLocalized(h.ctaPrimary, pick(seed.ctaPrimary, "tr")),
    ctaSecondary: asLocalized(h.ctaSecondary, pick(seed.ctaSecondary, "tr")),
  };
}

function migrateMarquee(raw: unknown, seed: SiteData["marquee"]) {
  const m = (raw ?? {}) as Record<string, unknown>;
  const items = Array.isArray(m.items) ? m.items : seed.items;
  return {
    items: items.map((item: unknown, i: number) => asLocalized(item, pick(seed.items[i], "tr"))),
  };
}

function migrateAbout(raw: unknown, seed: SiteData["about"]) {
  const a = (raw ?? {}) as Record<string, unknown>;
  const stats = Array.isArray(a.stats) ? a.stats : seed.stats;
  return {
    idx: String(a.idx ?? seed.idx),
    label: asLocalized(a.label, pick(seed.label, "tr")),
    headingLead: asLocalized(a.headingLead, pick(seed.headingLead, "tr")),
    headingRest: asLocalized(a.headingRest, pick(seed.headingRest, "tr")),
    body: asLocalized(a.body, pick(seed.body, "tr")),
    stats: stats.map((st: Record<string, unknown>, i: number) => ({
      id: String(st.id ?? seed.stats[i]?.id ?? `s${i}`),
      n: String(st.n ?? seed.stats[i]?.n ?? ""),
      d: asLocalized(st.d, pick(seed.stats[i]?.d, "tr")),
    })),
  };
}

function migrateSupport(raw: unknown, seed: SiteData["support"]) {
  const sp = (raw ?? {}) as Record<string, unknown>;
  const cells = Array.isArray(sp.cells) ? sp.cells : seed.cells;
  return {
    idx: String(sp.idx ?? seed.idx),
    label: asLocalized(sp.label, pick(seed.label, "tr")),
    headingPre: asLocalized(sp.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(sp.headingUnderline, pick(seed.headingUnderline, "tr")),
    body: asLocalized(sp.body, pick(seed.body, "tr")),
    cta: asLocalized(sp.cta, pick(seed.cta, "tr")),
    cells: cells.map((c: Record<string, unknown>, i: number) => ({
      id: String(c.id ?? seed.cells[i]?.id ?? `c${i}`),
      key: String(c.key ?? seed.cells[i]?.key ?? ""),
      title: asLocalized(c.title, pick(seed.cells[i]?.title, "tr")),
      body: asLocalized(c.body, pick(seed.cells[i]?.body, "tr")),
    })),
  };
}

function migrateSponsors(raw: unknown, seed: SiteData["sponsors"]) {
  const sp = (raw ?? {}) as Record<string, unknown>;
  const items = Array.isArray(sp.items) ? sp.items : seed.items;
  return {
    idx: String(sp.idx ?? seed.idx),
    label: asLocalized(sp.label, pick(seed.label, "tr")),
    headingPre: asLocalized(sp.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(sp.headingUnderline, pick(seed.headingUnderline, "tr")),
    body: asLocalized(sp.body, pick(seed.body, "tr")),
    items: items.map((it: Record<string, unknown>, i: number) => ({
      id: String(it.id ?? seed.items[i]?.id ?? `sp${i}`),
      name: asLocalized(it.name, pick(seed.items[i]?.name, "tr")),
      logoUrl: (it.logoUrl ?? seed.items[i]?.logoUrl ?? null) as string | null,
    })),
  };
}

function migrateTeam(raw: unknown, seed: SiteData["team"]) {
  const t = (raw ?? {}) as Record<string, unknown>;
  const members = Array.isArray(t.members) ? t.members : seed.members;
  return {
    idx: String(t.idx ?? seed.idx),
    label: asLocalized(t.label, pick(seed.label, "tr")),
    headingPre: asLocalized(t.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(t.headingUnderline, pick(seed.headingUnderline, "tr")),
    members: members.map((m: Record<string, unknown>, i: number) => ({
      id: String(m.id ?? seed.members[i]?.id ?? `m${i}`),
      initials: String(m.initials ?? seed.members[i]?.initials ?? ""),
      name: asLocalized(m.name, pick(seed.members[i]?.name, "tr")),
      role: asLocalized(m.role, pick(seed.members[i]?.role, "tr")),
      body: asLocalized(m.body, pick(seed.members[i]?.body, "tr")),
      photoUrl: (m.photoUrl ?? seed.members[i]?.photoUrl ?? null) as string | null,
    })),
  };
}

function migrateWork(raw: unknown, seed: SiteData["work"]) {
  const w = (raw ?? {}) as Record<string, unknown>;
  const frames = Array.isArray(w.frames) ? w.frames : seed.frames;
  return {
    idx: String(w.idx ?? seed.idx),
    label: asLocalized(w.label, pick(seed.label, "tr")),
    headingPre: asLocalized(w.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(w.headingUnderline, pick(seed.headingUnderline, "tr")),
    frames: frames.map((f: Record<string, unknown>, i: number) => ({
      id: String(f.id ?? seed.frames[i]?.id ?? `f${i}`),
      caption: asLocalized(f.caption, pick(seed.frames[i]?.caption, "tr")),
      photoUrl: (f.photoUrl ?? seed.frames[i]?.photoUrl ?? null) as string | null,
      span: (f.span ?? seed.frames[i]?.span ?? "") as SiteData["work"]["frames"][0]["span"],
    })),
  };
}

function migrateOutreach(raw: unknown, seed: SiteData["outreach"]) {
  const o = (raw ?? {}) as Record<string, unknown>;
  const rows = Array.isArray(o.rows) ? o.rows : seed.rows;
  return {
    idx: String(o.idx ?? seed.idx),
    label: asLocalized(o.label, pick(seed.label, "tr")),
    headingPre: asLocalized(o.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(o.headingUnderline, pick(seed.headingUnderline, "tr")),
    rows: rows.map((r: Record<string, unknown>, i: number) => ({
      id: String(r.id ?? seed.rows[i]?.id ?? `o${i}`),
      num: String(r.num ?? seed.rows[i]?.num ?? ""),
      title: asLocalized(r.title, pick(seed.rows[i]?.title, "tr")),
      body: asLocalized(r.body, pick(seed.rows[i]?.body, "tr")),
    })),
  };
}

function migrateContact(raw: unknown, seed: SiteData["contact"]) {
  const c = (raw ?? {}) as Record<string, unknown>;
  const details = Array.isArray(c.details) ? c.details : seed.details;
  return {
    idx: String(c.idx ?? seed.idx),
    label: asLocalized(c.label, pick(seed.label, "tr")),
    headingPre: asLocalized(c.headingPre, pick(seed.headingPre, "tr")),
    headingUnderline: asLocalized(c.headingUnderline, pick(seed.headingUnderline, "tr")),
    email: typeof c.email === "string" ? c.email : seed.email,
    details: details.map((d: Record<string, unknown>, i: number) => ({
      id: String(d.id ?? seed.details[i]?.id ?? `d${i}`),
      k: asLocalized(d.k, pick(seed.details[i]?.k, "tr")),
      v: asLocalized(d.v, pick(seed.details[i]?.v, "tr")),
    })),
  };
}

function migrateFooter(raw: unknown, seed: SiteData["footer"]) {
  const f = (raw ?? {}) as Record<string, unknown>;
  return {
    blurb: asLocalized(f.blurb, pick(seed.blurb, "tr")),
  };
}

export function needsMigration(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return true;
  const hero = (raw as SiteData).hero;
  return typeof hero?.sub === "string";
}
