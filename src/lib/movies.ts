/* Programme + careers data — fetched server-side from Supabase so the
 * rendered HTML carries real titles/showtimes for crawlers. Ported from the
 * legacy data.jsx / Careers.jsx (window-free, typed). */

import { serverClient } from "./supabase";

export const STANDARD_SHOWTIMES = ["10:15 AM", "01:30 PM", "06:15 PM", "09:30 PM"];

export type Badge = { t: string; tone: "accent" | "yellow" | "blue" | "quiet" };

export type MovieCardData = {
  title: string;
  tagline: string;
  lang: string;
  runtime: string;
  cert: string;
  badge: Badge | null;
  posterUrl: string | null;
  trailerUrl: string | null;
  featured: boolean;
  date: string | null;
  times: string[];
};

export type Programme = { "Now Showing": MovieCardData[]; "Coming Soon": MovieCardData[] };

export type Opening = {
  id: string;
  title: string;
  location?: string;
  employment?: string;
  summary?: string;
  description?: string;
  apply_email?: string;
};

/** Format YYYY-MM-DD into "MMM DD" (e.g. "Sep 12"). */
export function formatReleaseDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function rowToCard(row: any): MovieCardData {
  const isComingSoon = row.status === "coming_soon";
  let badge: Badge | null = null;
  if (isComingSoon) {
    badge = { t: "Soon", tone: "quiet" };
  } else if (row.certification && String(row.certification).toUpperCase() === "A") {
    badge = { t: "A", tone: "accent" };
  } else if (row.certification) {
    badge = { t: String(row.certification).toUpperCase(), tone: "yellow" };
  }
  return {
    title: row.name,
    tagline: row.distributor || "",
    lang: row.language || "Malayalam",
    runtime: "",
    cert: row.certification || "",
    badge,
    posterUrl: row.poster_url || null,
    trailerUrl: row.trailer_url || null,
    featured: !!row.is_featured,
    date: isComingSoon ? formatReleaseDate(row.release_date) : null,
    times: isComingSoon ? [] : STANDARD_SHOWTIMES,
  };
}

/** Fetch + classify into Now Showing / Coming Soon. */
export async function loadMovies(hostname?: string | null): Promise<Programme> {
  const sb = serverClient(hostname);
  const { data, error } = await sb
    .from("movies")
    .select("id,name,distributor,release_date,language,certification,poster_url,status,trailer_url,is_featured")
    .in("status", ["coming_soon", "now_showing"])
    .order("release_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("[abhinaya] failed to load movies", error.message);
    return { "Now Showing": [], "Coming Soon": [] };
  }

  const nowShowing: MovieCardData[] = [];
  const comingSoon: MovieCardData[] = [];
  for (const row of data || []) {
    if (row.status === "coming_soon") comingSoon.push(rowToCard(row));
    else nowShowing.push(rowToCard(row));
  }
  nowShowing.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  comingSoon.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  return { "Now Showing": nowShowing, "Coming Soon": comingSoon };
}

/** Hero film: owner-featured-with-trailer, else first now-showing-with-trailer. */
export function pickHero(movies: Programme): MovieCardData | null {
  const now = movies["Now Showing"] || [];
  const soon = movies["Coming Soon"] || [];
  const featured = [...now, ...soon].find((m) => m.featured && m.trailerUrl);
  if (featured) return featured;
  return now.find((m) => m.trailerUrl) || null;
}

/** Published, non-archived job openings. */
export async function loadOpenings(hostname?: string | null): Promise<Opening[]> {
  const sb = serverClient(hostname);
  try {
    const { data, error } = await sb
      .from("job_openings")
      .select("id,title,location,employment,summary,description,apply_email,sort_order")
      .eq("is_published", true)
      .is("archived_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Opening[]) || [];
  } catch (err: any) {
    console.error("[abhinaya] failed to load job openings", err?.message || err);
    return [];
  }
}
