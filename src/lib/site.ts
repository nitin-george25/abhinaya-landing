/* Site-wide constants — brand contact points, socials, BookMyShow link. */

export const SITE_URL = "https://abhinayacinemas.com";

export const CONTACT = {
  email: "hello@abhinayacinemas.com",
  hrEmail: "hr@abhinayacinemas.com",
  phoneDisplay: "+91 481 406 6453",
  phoneHref: "+914814066453",
  addressLines: ["Abhinaya Cinemas, M C Road", "Perunna, Changanacherry", "Kottayam, Kerala — 686101"],
  // Verified against the Google Business pin (matches layout.tsx geo.position).
  geo: { lat: 9.4426752, lng: 76.5431387 },
};

/** Google Maps turn-by-turn directions link to the cinema. */
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${CONTACT.geo.lat},${CONTACT.geo.lng}`;

/** Keyless interactive Google Maps embed centred on the cinema. */
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${CONTACT.geo.lat},${CONTACT.geo.lng}&z=16&output=embed`;

export const SOCIALS: Record<string, string> = {
  instagram: "https://www.instagram.com/abhinayacinemas/",
  facebook: "https://www.facebook.com/profile.php?id=61586263048713",
  youtube: "https://www.youtube.com/@AbhinayaCinemas",
};

export const BMS_BASE =
  "https://in.bookmyshow.com/cinemas/CNSY/abhinaya-cinemas-4k-dolby-712-changanassery/buytickets/ABCN/";

/** BookMyShow cinema URL with today's date (YYYYMMDD) appended. */
export function bmsUrl(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return BMS_BASE + `${y}${m}${d}`;
}

export function openBms(): void {
  if (typeof window !== "undefined") {
    window.open(bmsUrl(), "_blank", "noopener,noreferrer");
  }
}

export const NAV = ["Now Showing", "Coming Soon", "Legacy", "Gallery", "Careers", "Contact"];
