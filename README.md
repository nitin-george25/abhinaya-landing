# Abhinaya Cinemas — Landing Site (Next.js)

Public marketing site for **abhinayacinemas.com**. Server-rendered with
Next.js (App Router) and deployed to **Cloudflare Workers** via
[OpenNext](https://opennext.js.org/cloudflare).

This is the SSR rewrite of the previous in-browser-Babel site (which lived in
the `abhinaya-cinemas` repo under `index.html` + `site/`). The rewrite exists
so crawlers receive fully-rendered HTML — including the live **Now Showing /
Coming Soon** programme — instead of an empty `<div id="root">`.

## Stack

- **Next.js 15** (App Router, React 19), TypeScript
- **@opennextjs/cloudflare** → Cloudflare Workers
- **@supabase/supabase-js** for the live programme + careers (read-only, anon key)
- Plain inline-style components ported 1:1 from the old `site/*.jsx`

## Layout

```
src/app/         layout (metadata + JSON-LD), page (SSR data fetch), robots.ts, sitemap.ts, globals.css
src/components/   SiteShell (client orchestrator) + all sections + primitives + Icon + JsonLd
src/lib/         env (hostname → prod/staging), supabase (server/browser), movies (data), site (constants)
public/site/     assets, fonts, legal CSS — same /site/ path convention as the old site
public/*.html    privacy.html, terms.html (carried over verbatim)
```

## Develop

```bash
npm install
npm run dev          # http://localhost:3000 — talks to STAGING Supabase
```

## Preview on the Workers runtime / deploy

```bash
npm run preview      # builds with OpenNext + runs locally on workerd
npm run deploy       # builds + wrangler deploy to Cloudflare
```

## How data + environments work

`src/lib/env.ts` selects the Supabase project **by request host**, mirroring the
rest of the stack:

| Host | Supabase |
|---|---|
| `abhinayacinemas.com`, `www`, `admin.…` | **prod** (`xkmjygegtpmmwwnyoufn`) |
| everything else (`*.workers.dev`, localhost, previews) | **staging** (`lctkvmpzijaspaytunkm`) |

No hard-coded env — staging/prod parity holds automatically. Anon keys are
public (RLS controls access), so they live in the repo as before.

The home page is `force-dynamic` (rendered per request) because it reads the
host and the programme changes daily.

See **DEPLOY.md** for the GitHub repo split and Cloudflare wiring.
