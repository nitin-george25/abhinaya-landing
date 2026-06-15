# Deploy & Repo-Split Handoff — Abhinaya Landing (Next.js → Cloudflare Workers)

These steps run **on your Mac** (sandbox git here crashes with SIGBUS on the
iCloud-synced folder, and the deploy needs your GitHub + Cloudflare accounts).

Folder produced by this session: `abhinaya-landing/` (sibling of
`abhinaya-cinemas/`).

---

## 1. Verify locally first

```bash
cd "abhinaya-landing"
npm install
npm run dev            # open http://localhost:3000 — should match the old site, talking to STAGING
```

Check: Now Showing / Coming Soon load, tabs switch, mobile drawer opens, the
trailer modal plays, the contact form submits, /privacy.html and /terms.html
render. Console should say the staging Supabase project on localhost.

Then prove the Workers build:

```bash
npm run preview        # opennextjs-cloudflare build + local workerd
```

---

## 2. Make it the `abhinaya-landing` GitHub repo

This is a **fresh codebase** (the components were rewritten for SSR), so a clean
repo is simpler than `git filter-repo`. If you specifically want the old
landing commit history, do the filter-repo route from the existing **Repo Split
Checklist.md** instead and drop these files on top.

```bash
cd "abhinaya-landing"
git init
git add .
git commit -m "feat: SSR landing site (Next.js + OpenNext on Cloudflare Workers)

Port of the in-browser-Babel marketing site to Next.js App Router.
Server-renders Now Showing/Coming Soon + careers from Supabase so crawlers
get full HTML. Carries SEO metadata, MovieTheater JSON-LD, robots, sitemap;
hostname-based prod/staging env parity preserved."
# create the repo on GitHub (private), then:
git remote add origin git@github.com:<your-account>/abhinaya-landing.git
git branch -M main
git push -u origin main
```

> Don't commit `node_modules`, `.next`, `.open-next`, `.wrangler` — `.gitignore`
> already excludes them.

---

## 3. Remove the old landing from the console repo

In `abhinaya-cinemas` (per Repo Split Checklist Phase 4), on a branch off `main`:

```bash
git checkout -b chore/remove-landing main
git rm index.html privacy.html terms.html robots.txt sitemap.xml
git rm -r site
# keep app/, admin/, supabase/, migrations/, scripts/, SQL + design docs
git commit -m "chore: move landing to abhinaya-landing repo"
```

Leave the SEO commit from earlier (`feat/landing-seo`) unmerged/dropped if you
go straight to the Next.js site — its changes are superseded here. (If you want
the interim win on the *current* site while the Next.js cutover is prepared,
merge `feat/landing-seo` first, then remove later.)

---

## 4. Cloudflare: landing becomes a Worker (admin stays Pages)

The OpenNext output is a **Worker**, not a Pages project. Two ways to ship it:

**A. Wrangler from your machine (simplest first cut)**

```bash
npx wrangler login
npm run deploy         # builds with OpenNext, then wrangler deploy
```

**B. Git-connected Workers Builds (CI on push)** — in the Cloudflare dashboard:
Workers & Pages → Create → Workers → connect the `abhinaya-landing` repo.
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

The Worker name is `abhinaya-landing` (see `wrangler.jsonc`). `nodejs_compat`
and the assets binding are already configured.

### Custom domains / DNS
- Attach `abhinayacinemas.com` **and** `www.abhinayacinemas.com` to the
  `abhinaya-landing` Worker (Worker → Settings → Domains & Routes → Add custom
  domain). Cloudflare creates the proxied DNS records.
- **Remove** the apex/www custom domains from the old landing **Pages** project
  so they don't both claim the hostname.
- `admin.abhinayacinemas.com` is untouched — it stays on the admin project.

A `*.workers.dev` preview will resolve and automatically use **staging**
Supabase (hostname rule), so you can smoke-test before flipping DNS.

---

## 5. Old-path redirects — DONE (verified against the old build.sh)

The old site generated `dist/_redirects` at build time (the repo-root
`_redirects` is just an empty iCloud-locked placeholder). Those three 301s are
already ported into `next.config.mjs` → `redirects()`:

| From | To | Code |
|---|---|---|
| `/v2/*` | `admin.abhinayacinemas.com/:path*` | 301 |
| `/admin/dcr/*` | `admin.abhinayacinemas.com/:path*` | 301 |
| `/admin/dcr-legacy/*` | `admin.abhinayacinemas.com/legacy/:path*` | 301 |

After deploy, smoke-test one of each (e.g. `…/admin/dcr/dashboard` and
`…/admin/dcr-legacy/x`) and confirm the `Location` header — the legacy rule
rewrites the path to `/legacy/`.

---

## 6. After the first green deploy — tighten

- In `next.config.mjs`, flip `typescript.ignoreBuildErrors` and
  `eslint.ignoreDuringBuilds` back to **false** and fix anything that surfaces.
  (They're on now only because the port couldn't be built in the session it was
  written.)
- Submit `https://abhinayacinemas.com/sitemap.xml` in Google Search Console.
- Re-test the Open Graph card (Facebook/LinkedIn debuggers) — image is
  `/site/assets/og-cover.jpg`.

---

## 7. Google Business Profile (off-code, highest local-SEO impact)

From the pin you shared, the listing still needs:
- **Website** field → change `centralcinemas.in` → `https://abhinayacinemas.com`
- **Primary name** → simplify to **Abhinaya Cinemas** (currently "Abhinaya
  Cinemas 4K Dolby 7.1.2 / Anu Abhinaya Theatre")
- Confirm phone **0481 406 6453**, address (M C Road, Perunna, 686101), hours.

Then make Name/Address/Phone identical across BookMyShow, Justdial, Moviebuff,
Facebook, Instagram.
