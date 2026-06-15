import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./env";

/* Server-side client (used in Server Components / route handlers). A fresh
 * client per request keyed on the request host, so SSR reads hit the right
 * project. No session persistence on the server. */
export function serverClient(hostname?: string | null): SupabaseClient {
  const cfg = supabaseConfig(hostname);
  return createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* Browser singleton (used by the contact form). Picks the project from
 * window.location.hostname so previews talk to staging automatically. */
let _browser: SupabaseClient | null = null;
export function browserClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("browserClient() called on the server");
  }
  if (!_browser) {
    const cfg = supabaseConfig(window.location.hostname);
    _browser = createClient(cfg.url, cfg.anonKey);
  }
  return _browser;
}
