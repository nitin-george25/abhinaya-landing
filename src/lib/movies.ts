/* Programme + careers data — fetched server-side from Supabase so the
 * rendered HTML carries real titles/showtimes for crawlers. Ported from the
 * legacy data.jsx / Careers.jsx (window-free, typed). */

import type { SupabaseClient } from "@supabase/supabase-js";
import { serverClient } from "./supabase";

// Fallback programme, shown only when no real schedule has been published for
// any recent day (e.g. a brand-new cinema, or the schedule table is empty).
// Real times come from the `public_show_schedule` view; see loadShowtimes.
export const STANDARD_SHOWTIMES = ["10:15 AM", "01:30 PM", "06:15 PM", "09:30 PM"];

/** Postgres `time` ("HH:MM[:SS]") → display "HH:MM AM/PM" (zero-padded hour to
 *  match STANDARD_SHOWTIMES). Returns "" for anything unparseable. */
export function formatShowtime(t?: string | null): string {
  const m = /^(\d{1,2}):(\d{2})/.exec(t || "");
  if (!m) return "";
  let h = parseInt(m[1], 10);
  const min = m[2];
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${String(h).padStart(2, "0")}:${min} ${ampm}`;
}

/** minutes-since-midnight, for chronological sort of raw "HH:MM" times. */
function showtimeMinutes(t: string): number {
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 0;
}

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

function rowToCard(row: any, showtimes: Map<string, string[]>): MovieCardData {
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
    // Coming Soon has no showtimes. Now Showing uses the published schedule for
    // the effective day; if this film isn't in that schedule (or none exists at
    // all) fall back to the standard slots so a card never renders time-less.
    times: isComingSoon ? [] : (showtimes.get(row.id) ?? STANDARD_SHOWTIMES),
  };
}

/**
 * Real showtimes per movie for the "effective" programme day: today's schedule
 * (IST), or — until today's is published — the most recent prior day's.
 *
 * The `public_show_schedule` view already excludes cancelled shows and future
 * dates, so the greatest schedule_date it returns IS the effective day. We keep
 * only that day's rows and group formatted times by movie id.
 *
 * Returns an empty map on error or when the schedule is empty; callers then
 * fall back to STANDARD_SHOWTIMES.
 */
async function loadShowtimes(sb: SupabaseClient): Promise<Map<string, string[]>> {
  const byMovie = new Map<string, string[]>();
  const { data, error } = await sb
    .from("public_show_schedule")
    .select("schedule_date,movie_id,showtime")
    .order("schedule_date", { ascending: false });

  if (error) {
    console.error("[abhinaya] failed to load show schedule", error.message);
    return byMovie;
  }
  if (!data || data.length === 0) return byMovie;

  const effectiveDate = data[0].schedule_date; // greatest date ≤ today (IST)
  // Collect raw "HH:MM" per movie for just the effective day, deduped.
  const rawByMovie = new Map<string, Set<string>>();
  for (const r of data) {
    if (r.schedule_date !== effectiveDate) break; // rows are date-desc ordered
    const raw = String(r.showtime || "").slice(0, 5);
    if (!raw) continue;
    const set = rawByMovie.get(r.movie_id) ?? new Set<string>();
    set.add(raw);
    rawByMovie.set(r.movie_id, set);
  }
  for (const [movieId, set] of rawByMovie) {
    const times = [...set]
      .sort((a, b) => showtimeMinutes(a) - showtimeMinutes(b))
      .map(formatShowtime)
      .filter(Boolean);
    if (times.length) byMovie.set(movieId, times);
  }
  return byMovie;
}

/** Fetch + classify into Now Showing / Coming Soon. */
export async function loadMovies(hostname?: string | null): Promise<Programme> {
  const sb = serverClient(hostname);
  const [{ data, error }, showtimes] = await Promise.all([
    sb
      .from("movies")
      .select("id,name,distributor,release_date,language,certification,poster_url,status,trailer_url,is_featured")
      .in("status", ["coming_soon", "now_showing"])
      .order("release_date", { ascending: true, nullsFirst: false }),
    loadShowtimes(sb),
  ]);

  if (error) {
    console.error("[abhinaya] failed to load movies", error.message);
    return { "Now Showing": [], "Coming Soon": [] };
  }

  const nowShowing: MovieCardData[] = [];
  const comingSoon: MovieCardData[] = [];
  for (const row of data || []) {
    if (row.status === "coming_soon") comingSoon.push(rowToCard(row, showtimes));
    else nowShowing.push(rowToCard(row, showtimes));
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
