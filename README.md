# BALLOONS

Website and lightweight CMS for **BALLOONS**, the rookie FIRST Robotics Competition team at TED Antalya Koleji.

English and Turkish. One scrolling public page, plus a password-protected editor for copy, photos, members, and sponsors.

## Features

- Public page: Home, About, Support, Sponsors, Team, Workshop, Outreach, Contact
- Language switch (EN / TR), remembered in the browser
- `/admin` login, then inline editing on the live page
- Local JSON storage for development; Supabase for production
- Sitemap, robots, and Open Graph tags

## Stack

- Next.js 14 (App Router) and TypeScript
- Tailwind CSS
- Supabase (Postgres + Storage) when configured
- Cookie session via `jose`

Content lives in one `SiteData` JSON document. In production it is a single row (`id = 1`) in a `site` table. Without Supabase, the same document is stored at `content/db.json`.

```
src/
  app/                 pages, API routes, sitemap, robots
  components/site/     public page, editor, language switch
  lib/                 types, store, auth, i18n
  actions/site.ts      save handlers
  middleware.ts        protects admin routes
content/seed.json      starting copy
public/uploads/        local-mode images
```

## Local setup

Needs Node.js 18.18+ or 20+.

```bash
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — default password `balloons`

Edits in local mode write to `content/db.json`. That file is not kept across deploys. Connect Supabase before going live.

Optional `.env.local`:

```bash
ADMIN_PASSWORD=your-password-here
SESSION_SECRET=any-long-random-string
```

See `.env.example` for the full list.

## Production

### 1. Supabase project

Create a project (Frankfurt or London is a good region for Turkey).

### 2. Table

SQL Editor:

```sql
create table if not exists public.site (
  id   integer primary key,
  data jsonb not null
);

alter table public.site enable row level security;
```

The app inserts the first row on first load. There are no public policies; the server uses the service-role key.

### 3. Storage bucket

Create a public bucket named `balloons-media`. Visitors can read uploaded logos and photos; uploads still go through the admin session.

Optional read policy:

```sql
create policy "Public read for balloons-media"
on storage.objects for select
using ( bucket_id = 'balloons-media' );
```

### 4. Keys

From **Settings → API**:

- Project URL → `SUPABASE_URL`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

### 5. Vercel

Import the GitHub repo. Add:

| Name | Value |
|---|---|
| `ADMIN_PASSWORD` | team password |
| `SESSION_SECRET` | `openssl rand -base64 32` |
| `SUPABASE_URL` | project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role key |
| `SUPABASE_BUCKET` | `balloons-media` |
| `NEXT_PUBLIC_SITE_URL` | live URL |

After a custom domain is attached, update `NEXT_PUBLIC_SITE_URL` and redeploy.

## Editing the site

Sign in at `/admin`, then use **Edit page** on the homepage.

- Text fields show English and Turkish side by side
- Team, sponsors, gallery, and outreach items can be added, reordered, and removed
- Images are uploaded through the same editor (6 MB max, image types only)
- The language switch on the public page is independent of what you are editing

## Look and content

- Colors and type: `src/app/globals.css`, `src/app/layout.tsx`, `tailwind.config.ts`
- Starting copy: `content/seed.json`
- After Supabase is connected, edit in the admin panel, not in `seed.json`

## Limits

- One shared admin password. Last write wins.
- Turkish copy should be reviewed by a native speaker.
- Local mode is for development only.

## License

Original code and content: see [LICENSE](LICENSE) (all rights reserved).

Third-party packages: see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
