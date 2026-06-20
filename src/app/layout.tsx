import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import JsonLd from "@/components/JsonLd";

const GA_MEASUREMENT_ID = "G-Z5357PEHDG";

const TITLE = "Abhinaya Cinemas — Movie Theatre in Changanacherry, Kottayam | Now Showing";
const DESCRIPTION =
  "Abhinaya Cinemas is a family-owned movie theatre in Changanacherry, Kottayam, Kerala — serving audiences since 1968. See Now Showing & Coming Soon, showtimes, and book tickets.";
const OG_DESCRIPTION =
  "A family-owned Kerala cinema since 1968. Now Showing, Coming Soon, showtimes and tickets.";
const OG_IMAGE = "https://abhinayacinemas.com/site/assets/og-cover.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://abhinayacinemas.com"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Abhinaya Cinemas",
  authors: [{ name: "Abhinaya Cinemas" }],
  keywords: [
    "Abhinaya Cinemas",
    "cinema in Changanacherry",
    "movie theatre Kottayam",
    "now showing Changanacherry",
    "Malayalam movies Kottayam",
    "book movie tickets Changanacherry",
    "4K Dolby cinema Kerala",
  ],
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/site/assets/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/site/assets/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/site/assets/favicon.ico",
    apple: "/site/assets/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Abhinaya Cinemas",
    title: "Abhinaya Cinemas — Movie Theatre in Changanacherry, Kottayam",
    description: OG_DESCRIPTION,
    url: "https://abhinayacinemas.com/",
    locale: "en_IN",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Inside the Abhinaya Cinemas auditorium" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhinaya Cinemas — Movie Theatre in Changanacherry, Kottayam",
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  // Geo / local SEO. Coordinates verified against the Google Business pin.
  other: {
    "geo.region": "IN-KL",
    "geo.placename": "Changanacherry, Kottayam, Kerala",
    "geo.position": "9.4426752;76.5431387",
    ICBM: "9.4426752, 76.5431387",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Motion reveals start hidden (opacity:0) and animate in on the client.
            If JS never runs — a text-only crawler, JS disabled — neutralise the
            hidden state so every section stays fully visible and indexable. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <JsonLd />
        {/* Google Analytics 4 (gtag.js). Enhanced Measurement auto-tracks
            outbound link clicks — e.g. clicks on the social media links. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
