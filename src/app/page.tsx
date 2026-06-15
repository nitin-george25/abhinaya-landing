import { headers } from "next/headers";
import SiteShell from "@/components/SiteShell";
import { loadMovies, loadOpenings, pickHero } from "@/lib/movies";
import { envForHost } from "@/lib/env";

// Render per request: we read the request host to pick prod vs staging
// Supabase, and the programme changes daily. This is what gives crawlers the
// live Now Showing / Coming Soon titles in the initial HTML.
export const dynamic = "force-dynamic";

export default async function Page() {
  const h = await headers();
  // x-forwarded-host wins (set by Cloudflare on custom domains); fall back to
  // host. If both are missing we'd default to staging — log it so an empty
  // grid on the prod domain is debuggable rather than silent.
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  console.info(`[abhinaya] SSR env=${envForHost(host)} host=${host || "(none)"}`);

  const [movies, openings] = await Promise.all([loadMovies(host), loadOpenings(host)]);
  const heroMovie = pickHero(movies);

  return <SiteShell movies={movies} openings={openings} heroMovie={heroMovie} />;
}
