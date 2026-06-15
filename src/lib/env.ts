/* Supabase environment selection — by hostname, never hard-coded.
 *
 * Mirrors the legacy site's data.jsx and app/src/lib/env.ts so the landing
 * site always talks to the SAME project the rest of the stack does:
 *   abhinayacinemas.com / www / admin → prod
 *   anything else (*.workers.dev, *.pages.dev, localhost, previews) → staging
 *
 * Anon (publishable) keys are PUBLIC by Supabase classification — RLS is what
 * controls access — so hard-coding both keeps the deploy zero-config.
 */

export const PROD_HOSTS = [
  "abhinayacinemas.com",
  "www.abhinayacinemas.com",
  "admin.abhinayacinemas.com",
];

export const SUPABASE_ENVS = {
  prod: {
    url: "https://xkmjygegtpmmwwnyoufn.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrbWp5Z2VndHBtbXd3bnlvdWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODI2NTEsImV4cCI6MjA5NTQ1ODY1MX0.ILYBoN4OqFGIatTCTJ3hhfbGj6n8Q6e5LAhOVDDuTgo",
  },
  staging: {
    url: "https://lctkvmpzijaspaytunkm.supabase.co",
    anonKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdGt2bXB6aWphc3BheXR1bmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTU0NDgsImV4cCI6MjA5NTYzMTQ0OH0.YeYegXQvX0l0FMABDgljs_bV_t9C66x77Y3kj2YZ55A",
  },
} as const;

export type EnvName = keyof typeof SUPABASE_ENVS;

/** Strip any port and pick prod vs staging for a given hostname. */
export function envForHost(hostname?: string | null): EnvName {
  const h = (hostname || "").split(":")[0].toLowerCase();
  return PROD_HOSTS.includes(h) ? "prod" : "staging";
}

export function supabaseConfig(hostname?: string | null) {
  return SUPABASE_ENVS[envForHost(hostname)];
}
