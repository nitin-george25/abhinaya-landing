import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default OpenNext-on-Cloudflare config. No incremental cache / R2 is wired
// yet — the landing site renders dynamically (it reads the request host to
// pick the prod vs staging Supabase project; see src/lib/env.ts). Add an
// `incrementalCache` here later if we move Now Showing to ISR.
export default defineCloudflareConfig({});
