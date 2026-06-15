import { headers } from "next/headers";
import SiteShell from "@/components/SiteShell";
import { loadMovies, loadOpenings, pickHero } from "@/lib/movies";

// Render per request: we read the request host to pick prod vs staging
// Supabase, and the programme changes daily. This is what gives crawlers the
// live Now Showing / Coming Soon titles in the initial HTML.
export const dynamic = "force-dynamic";

export default async function Page() {
  const h = await headers();
  const host = h.get("host");

  const [movies, openings] = await Promise.all([loadMovies(host), loadOpenings(host)]);
  const heroMovie = pickHero(movies);

  return <SiteShell movies={movies} openings={openings} heroMovie={heroMovie} />;
}
