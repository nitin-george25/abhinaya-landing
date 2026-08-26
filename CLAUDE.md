# abhinaya-landing

Next.js landing site deployed to **Cloudflare Workers** via OpenNext
(`wrangler.jsonc`, entry `.open-next/worker.js`). Custom domains
(abhinayacinemas.com, www) are attached in the Cloudflare dashboard — see
DEPLOY.md.

## Working rules

- Default to `staging`, never `main`, unless told otherwise.
- I commit and push myself with GitHub Desktop. After any change, paste a
  ready-to-use commit message in chat: a conventional-commit subject line
  (<=72 chars), a blank line, then a prose body covering what changed, why, and
  any operator side-effects (redeploy, env var, DNS).
- Concise plain prose in replies, no emojis.
- Real bugs get their own dated markdown file under `docs/bug-reports/` —
  symptom as observed, why it was hard to see, root cause, fix, how to
  recognise it again. Include self-inflicted bugs and wrong diagnoses.

## Cloudflare tooling

The Cloudflare skills plugin is enabled repo-wide via `.claude/settings.json`
(marketplace `cloudflare/skills`, plugin `cloudflare@cloudflare`), so Workers /
Wrangler / Pages guidance loads automatically and prefers current Cloudflare
docs over recalled knowledge. First use of a Cloudflare MCP tool triggers OAuth.
