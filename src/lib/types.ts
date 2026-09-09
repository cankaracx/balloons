// Single editable content document for the BALLOONS site.

export type Locale = "en" | "tr";

export type Localized = { en: string; tr: string };

export type Brand = { name: string; logoUrl: string | null };

export type NavLink = { id: string; label: Localized; href: string };

export type Hero = {
  eyebrow: Localized;
  title: string;
  sub: Localized;
  ctaPrimary: Localized;
  ctaSecondary: Localized;
};

export type Stat = { id: string; n: string; d: Localized };

export type About = {
  idx: string;
  label: Localized;
  headingLead: Localized;
  headingRest: Localized;
  body: Localized;
  stats: Stat[];
};

export type SupportCell = { id: string; key: string; title: Localized; body: Localized };
export type Support = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  body: Localized;
  cells: SupportCell[];
  cta: Localized;
};

export type Sponsor = { id: string; name: Localized; logoUrl: string | null };
export type Sponsors = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  body: Localized;
  items: Sponsor[];
};

export type Member = { id: string; initials: string; name: Localized; role: Localized; body: Localized; photoUrl: string | null };
export type Team = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  members: Member[];
};

export type Frame = { id: string; caption: Localized; photoUrl: string | null; span: "a" | "b" | "c" | "" };
export type Work = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  frames: Frame[];
};

export type OutreachRow = { id: string; num: string; title: Localized; body: Localized };
export type Outreach = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  rows: OutreachRow[];
};

export type ContactDetail = { id: string; k: Localized; v: Localized };
export type Contact = {
  idx: string;
  label: Localized;
  headingPre: Localized;
  headingUnderline: Localized;
  email: string;
  details: ContactDetail[];
};

export type SiteData = {
  brand: Brand;
  nav: { links: NavLink[]; cta: Localized };
  hero: Hero;
  marquee: { items: Localized[] };
  about: About;
  support: Support;
  sponsors: Sponsors;
  team: Team;
  work: Work;
  outreach: Outreach;
  contact: Contact;
  footer: { blurb: Localized };
};
