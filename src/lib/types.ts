// Single editable content document for the BALLOONS site.

export type Brand = { name: string; logoUrl: string | null };

export type NavLink = { id: string; label: string; href: string };

export type Hero = {
  eyebrow: string;
  title: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type Stat = { id: string; n: string; d: string };

export type About = {
  idx: string;
  label: string;
  headingLead: string; // underlined portion
  headingRest: string;
  body: string;
  stats: Stat[];
};

export type SupportCell = { id: string; key: string; title: string; body: string };
export type Support = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  body: string;
  cells: SupportCell[];
  cta: string;
};

export type Sponsor = { id: string; name: string; logoUrl: string | null };
export type Sponsors = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  body: string;
  items: Sponsor[];
};

export type Member = { id: string; initials: string; name: string; role: string; body: string; photoUrl: string | null };
export type Team = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  members: Member[];
};

export type Frame = { id: string; caption: string; photoUrl: string | null; span: "a" | "b" | "c" | "" };
export type Work = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  frames: Frame[];
};

export type OutreachRow = { id: string; num: string; title: string; body: string };
export type Outreach = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  rows: OutreachRow[];
};

export type ContactDetail = { id: string; k: string; v: string };
export type Contact = {
  idx: string;
  label: string;
  headingPre: string;
  headingUnderline: string;
  email: string;
  details: ContactDetail[];
};

export type SiteData = {
  brand: Brand;
  nav: { links: NavLink[]; cta: string };
  hero: Hero;
  marquee: { items: string[] };
  about: About;
  support: Support;
  sponsors: Sponsors;
  team: Team;
  work: Work;
  outreach: Outreach;
  contact: Contact;
  footer: { blurb: string };
};
