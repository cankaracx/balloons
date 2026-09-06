# BALLOONS — FRC Team Website + CMS

A fast single-page website for the **BALLOONS** rookie FRC team at TED Antalya Koleji — with an inline editor so anyone on the team can change text, photos, members, and sponsors without touching code.

Built to attract sponsors: clean and minimal, with a signature red pufferfish that gently "breathes" (small by nature, built to expand far beyond its size — the rookie metaphor).

---

## 1. What you get

- **Public site** — one smooth-scrolling page: Home, About, Support, Sponsors, Team, Workshop, Outreach, Contact. Desktop section links plus a **mobile menu** on smaller screens. Fully responsive, SEO-ready (sitemap, robots), fast.
- **Inline editor** — log in at `/admin` with a shared password, then click **Edit page** on the homepage:
  - Click any text to change it
  - Click any photo to replace it
  - Add, reorder, or delete team members, sponsors, workshop frames, stats, and outreach items
  - **Save** writes the whole page; **Done** warns you if there are unsaved changes
  - **Sign out** ends the shared session
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

**The key idea:** all editable content lives in **one JSON object** called `SiteData` (text, members, sponsors, workshop photos). It's stored as a single row (`id = 1`) in a Postgres table called `site`, in a `jsonb` column called `data`. There's no complex schema to manage — the whole site is one document you read and write atomically.

**Why this stack:**

- **Next.js 14 + TypeScript** — industry standard, great free hosting on Vercel, server-rendered for SEO. Pinned to the stable 14.2.x line (not 15) for fewer surprises.
- **Plain CSS + Tailwind utilities** — brand colors live in `src/app/globals.css`.
- **Supabase** — a hosted Postgres database + file storage with a generous free tier and a friendly dashboard. No backend server to run.
- **Lightweight auth** — one password, a signed `httpOnly` cookie (using `jose`). No third-party login service.
- **Reordering** — simple up/down buttons (robust, works on mobile) rather than drag-and-drop.

**Folder map:**

```
src/
  app/
    page.tsx              Public homepage (server component)
    layout.tsx            SEO metadata
    sitemap.ts robots.ts  SEO
    icon.svg              Pufferfish favicon
    admin/page.tsx        Login page
    api/
      auth/login          Sets the session cookie
      auth/logout         Clears it
      upload              Receives image uploads
  components/site/        Homepage, inline editor, pufferfish
  lib/
    types.ts              The SiteData shape
    store.ts              Read/write data + upload images (dual-mode)
    supabase.ts auth.ts guard.ts
  actions/site.ts         Save server action
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

Open **http://localhost:3000/admin** and log in with the demo password **`balloons`**. You return to the homepage with an **Edit page** bar at the bottom. Click text or photos to change them; **Save** writes to `content/db.json`.

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
3. Public buckets allow anyone to *read* files via their URL, which is what we want for a public website. Uploads still go only through your authenticated editor.

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

## 5. Using the editor

1. Go to `/admin` and log in.
2. On the homepage, click **Edit page** in the bottom bar.
3. Click any text or photo. Use the small ↑ / ↓ / × controls on cards to reorder or delete.
4. Click **Save**. The bar shows **Unsaved changes** until you do.
5. **Done** asks for confirmation if you still have unsaved edits. **Sign out** clears the login cookie (sessions last 7 days otherwise).

Editing tips: the whole page is one document, so last write wins. Fine for a small team — don't have two people save at the same time.

---

## 6. Customizing the look

- **Colors / fonts:** `src/app/globals.css` (`:root` variables).
- **The pufferfish:** `src/components/site/Pufferfish.tsx` — pure SVG, scales to any size.
- **Default starting content:** `content/seed.json`. (Once you're on Supabase, edits happen in the editor, not here.)
- **Section order:** `src/components/site/Site.tsx`.

---

## 7. Assumptions & limitations

- **One shared admin account.** Edits are last-write-wins — fine for a small team; not designed for many simultaneous editors.
- **Local mode is not persistent in production** — always connect Supabase before launch.
- **Images** are capped at 6 MB each and must be image files.

---

## 8. Hosting recommendation

**Vercel (website) + Supabase (data & images) — both free tiers.** Push to GitHub, click deploy, paste the environment variables. No servers to manage, automatic HTTPS, global CDN. Add a custom domain whenever you're ready.

---

Made for BALLOONS · TED Antalya Koleji 🐡
