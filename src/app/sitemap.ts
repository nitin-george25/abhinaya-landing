import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://abhinayacinemas.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/privacy.html`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms.html`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
