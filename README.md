# BALLOONS — FRC Team Website + CMS

A fast, bilingual (English / Türkçe), single-page website for the **BALLOONS** rookie FRC team at TED Antalya Koleji — with a friendly built-in admin panel so anyone on the team can edit every word, photo, member, and sponsor without touching code.

Built to attract sponsors and look the part: clean, Apple-minimalist, with a signature red pufferfish that gently "breathes" (small by nature, built to expand far beyond its size — the rookie metaphor).

---

## 1. What you get

- **Public site** — one smooth-scrolling page: Home, About, Sponsors, Team, Gallery, Outreach, Contact. Language switcher top-right. Fully responsive, SEO-ready (sitemap, robots, Open Graph, JSON-LD), fast (≈94 kB JS on first load).
- **Admin panel** at `/admin` — log in with a password, then edit:
  - All section text (every field is English + Türkçe side by side)
  - Team members (photo, name, role, bio) — add, edit, reorder, delete
  - Sponsors (logo, website, tier, description) — same controls
  - Gallery images with captions
  - Sponsorship tiers, stats, and outreach items
  - Your logo, team name, and team number
- **Two ways to run:**
  - **Local demo mode** — works the instant you run it, no accounts needed. Saves to a local file.
  - **Production mode** — connect Supabase (free) for permanent storage + image hosting.

---

## 2. Architecture (the short version)

```
Browser ──▶ Next.js 14 (App Router, on Vercel)
                │
                ├─ Public page  →  reads SiteData, renders all sections
                ├─ /admin       →  password login (signed cookie)
                └─ Server Actions / API routes
                        │
                        ▼
                 store.ts  ──▶  Supabase Postgres  (one row of JSON)
                            └▶  Supabase Storage   (uploaded images)
                        (falls back to a local file + /public/uploads
                         when Supabase isn't configured)
```

**The key idea:** all editable content lives in **one JSON object** called `SiteData` (text, members, sponsors, gallery). It's stored as a single row (`id = 1`) in a Postgres table called `site`, in a `jsonb` column called `data`. There's no complex schema to manage — the whole site is one document you read and write atomically.

**Why this stack:**

- **Next.js 14 + TypeScript** — industry standard, great free hosting on Vercel, server-rendered for SEO. Pinned to the stable 14.2.x line (not 15) for fewer surprises.
- **Tailwind CSS** — styling without juggling separate CSS files; the brand palette is defined once in `tailwind.config.ts`.
- **Supabase** — a hosted Postgres database + file storage with a generous free tier and a friendly dashboard. No backend server to run.
- **Lightweight auth** — one password, a signed `httpOnly` cookie (using `jose`). No third-party login service, nothing to configure. Perfect for a single shared team account.
- **Reordering** — simple up/down buttons (robust, works on mobile) rather than drag-and-drop.

**Folder map:**

```
src/
  app/
    page.tsx              Public homepage (server component)
    layout.tsx            Fonts, SEO metadata, JSON-LD
    sitemap.ts robots.ts  SEO
    icon.svg              Pufferfish favicon
    admin/
      page.tsx            Login page
      dashboard/page.tsx  The CMS (protected by middleware)
    api/
      auth/login          Sets the session cookie
      auth/logout         Clears it
      upload              Receives image uploads
  components/
    public/               Nav, Hero, About, Sponsors, Team, Gallery,
                          Outreach, Contact, Footer, Pufferfish, …
    admin/                Dashboard + one editor per content type
  lib/
    types.ts              The SiteData shape
    store.ts              Read/write data + upload images (dual-mode)
    supabase.ts auth.ts guard.ts i18n.ts
  middleware.ts           Protects /admin/dashboard
  actions/site.ts         Server actions for every edit
content/
  seed.json               Default content (the starting point)
public/uploads/           Local-mode image folder
```

---

## 3. Run it locally (5 minutes)

You need **Node.js 18.18+** (or 20+). Then:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** — the public site is live with placeholder content.

Open **http://localhost:3000/admin** and log in with the demo password **`balloons`**. Edit anything; changes save to `content/db.json` and show up immediately.

> Local mode is for development and preview only. The file resets when you redeploy, so connect Supabase before going live (next section).

To set your own local password, create a file named `.env.local`:

```bash
ADMIN_PASSWORD=your-password-here
SESSION_SECRET=any-long-random-string
```

---

## 4. Go live (production)

### Step A — Create a Supabase project

1. Sign up at **supabase.com** (free) and create a new project. Pick a region near you (Frankfurt / London are good for Turkey).
2. Wait for it to finish provisioning.

### Step B — Create the database table

In the Supabase dashboard, open **SQL Editor → New query**, paste this, and click **Run**:

```sql
-- One row holds the entire site's content as JSON.
create table if not exists public.site (
  id   integer primary key,
  data jsonb not null
);

-- Lock the table down: only the server (service-role key) can touch it.
alter table public.site enable row level security;
-- (No public policies = no anonymous access. The app uses the service-role key,
--  which bypasses RLS, so this is exactly what we want.)
```

You don't need to insert a row — the app seeds it automatically on first load.

### Step C — Create the image storage bucket

1. Go to **Storage → New bucket**.
2. Name it exactly **`balloons-media`** and tick **Public bucket** (so logos and photos are viewable by visitors). Create it.
3. Public buckets allow anyone to *read* files via their URL, which is what we want for a public website. Uploads still go only through your authenticated admin panel.

If you ever want to be explicit about the read policy, run this in the SQL editor:

```sql
create policy "Public read for balloons-media"
on storage.objects for select
using ( bucket_id = 'balloons-media' );
```

### Step D — Collect your keys

In Supabase: **Settings → API**. You need two values:

- **Project URL** → `SUPABASE_URL`
- **`service_role` secret key** → `SUPABASE_SERVICE_ROLE_KEY` (this is server-side only — never put it in client code or commit it)

### Step E — Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to **vercel.com**, sign in with GitHub, click **Add New → Project**, and import the repo. Vercel auto-detects Next.js — accept the defaults.
3. Before deploying, open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `ADMIN_PASSWORD` | a strong password for your team |
   | `SESSION_SECRET` | a long random string (`openssl rand -base64 32`) |
   | `SUPABASE_URL` | your project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service-role key |
   | `SUPABASE_BUCKET` | `balloons-media` |
   | `NEXT_PUBLIC_SITE_URL` | your final URL, e.g. `https://balloons.vercel.app` |

4. Click **Deploy**. In ~1 minute you'll have a live URL.
5. Visit `/admin`, log in, and start filling in your real content. Everything you save now lives permanently in Supabase.

> After you add a custom domain later, update `NEXT_PUBLIC_SITE_URL` to it so the SEO tags and sitemap point to the right place, then redeploy.

---

## 5. Using the admin panel

Go to `/admin`, log in, and use the tabs:

- **Content** — all section text. Each field has an English and a Türkçe box. There's a **Save changes** bar at the bottom; it lights up when you have unsaved edits.
- **Team** — add members with a photo, name, role, and bio. Use ↑ / ↓ to set the order shown on the site.
- **Sponsors** — add a logo, website, tier, and description. Logos arrange automatically; until you add any, the site shows an inviting "your logo here" placeholder. Tiers (Title Partner, Gold, …) and their perks are edited in the **Content** tab.
- **Gallery** — upload photos and add optional captions.
- **Logo & Brand** — upload a logo (leave it empty to use the built-in pufferfish), set the team name, and set your team number once FIRST assigns it (the site hides the number until you fill it in).

Editing tips: the language switch on the public site (top-right) shows the *other* language, and remembers a visitor's choice. Saving in admin updates the live site instantly.

---

## 6. Customizing the look

- **Colors / fonts:** `tailwind.config.ts` (navy, scarlet, paper) and `src/app/layout.tsx` (Space Grotesk + Inter).
- **The pufferfish:** `src/components/public/Pufferfish.tsx` — pure SVG, scales to any size.
- **Default starting content:** `content/seed.json`. (Once you're on Supabase, edits happen in the admin panel, not here.)
- **Section order/background rhythm:** `src/components/public/Site.tsx`.

---

## 7. Assumptions & limitations

- **One shared admin account.** Edits are last-write-wins — fine for a small team; not designed for many simultaneous editors.
- **The Türkçe copy is a solid first draft.** Review and polish it in the admin panel — you know the team's voice.
- **Gallery placeholders** in the seed use sample images; replace them with real photos.
- **Local mode is not persistent in production** — always connect Supabase before launch.
- **Images** are capped at 6 MB each and must be image files.
- I couldn't provision a live Supabase project from here, so the cloud path is written carefully and the app was **build-verified and tested end-to-end in local mode** (login, auth protection, content editing, image upload, reordering all confirmed working).

---

## 8. Hosting recommendation (beginner-friendly)

**Vercel (website) + Supabase (data & images) — both free tiers.** This is the path documented above and the easiest by a wide margin: push to GitHub, click deploy, paste five environment variables. No servers to manage, automatic HTTPS, global CDN, and free hosting that comfortably covers a team site's traffic. Add a custom domain whenever you're ready (Vercel walks you through it).

---

## 9. A note on dependencies

Next.js is pinned to the latest patched **14.2.x** release, which includes all current security fixes for that line. `npm audit` may still report two advisories inside packages that Next.js bundles internally; clearing those would require upgrading to Next 16 (a major version with breaking changes), which isn't worth it for a stable team site. Nothing here affects a normally deployed site. If you ever want to move to Next 16 later, do it as a deliberate upgrade.

---

Made for BALLOONS · TED Antalya Koleji 🐡
