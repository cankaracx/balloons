export type Locale = "en" | "tr";

/** A piece of text that exists in both languages. */
export type Localized = { en: string; tr: string };

export type Stat = { id: string; label: Localized; value: Localized };

export type Tier = {
  id: string;
  name: Localized;
  amount: Localized; // e.g. "₺50,000+" — kept as free text so it can be any currency/range
  perks: Localized; // newline-separated list of perks
  featured: boolean;
};

export type OutreachItem = { id: string; title: Localized; body: Localized };

/** All editable site copy (everything that is not a member/sponsor/gallery row). */
export type Content = {
  brand: {
    name: string; // "BALLOONS"
    teamNumber: string; // "" until assigned
    logoUrl: string | null; // null => use the built-in SVG pufferfish
  };
  hero: {
    eyebrow: Localized;
    title: string; // wordmark, language-independent
    tagline: Localized;
    ctaPrimary: Localized;
    ctaSecondary: Localized;
  };
  about: {
    heading: Localized;
    body: Localized;
    stats: Stat[];
  };
  sponsors: {
    heading: Localized;
    pitch: Localized;
    cta: Localized;
    emptyState: Localized;
    tiers: Tier[];
  };
  team: {
    heading: Localized;
    intro: Localized;
    emptyState: Localized;
  };
  gallery: {
    heading: Localized;
    intro: Localized;
    emptyState: Localized;
  };
  outreach: {
    heading: Localized;
    body: Localized;
    items: OutreachItem[];
  };
  contact: {
    heading: Localized;
    body: Localized;
    email: string;
    phone: string;
    location: Localized;
    instagram: string; // handle without @, or full URL
    linkedin: string;
  };
};

export type Member = {
  id: string;
  name: string;
  role: Localized;
  bio: Localized;
  photoUrl: string | null;
  sort: number;
};

export type Sponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string;
  tier: string; // matches a Tier name (en), or free text
  description: Localized;
  sort: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  caption: Localized;
  sort: number;
};

export type SiteData = {
  content: Content;
  members: Member[];
  sponsors: Sponsor[];
  gallery: GalleryImage[];
};
