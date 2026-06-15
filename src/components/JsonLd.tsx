// Structured data — local cinema for Google rich results / map pack.
// Server component (no interactivity): renders a single JSON-LD script.
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MovieTheater",
  "@id": "https://abhinayacinemas.com/#cinema",
  name: "Abhinaya Cinemas",
  url: "https://abhinayacinemas.com/",
  logo: "https://abhinayacinemas.com/site/assets/icon-512.png",
  image: "https://abhinayacinemas.com/site/assets/og-cover.jpg",
  description:
    "Family-owned boutique movie theatre in Changanacherry, Kottayam, Kerala, serving audiences since 1968. 4K projection and Dolby sound.",
  foundingDate: "1968",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  telephone: "+914814066453",
  email: "hello@abhinayacinemas.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "M C Road, Perunna",
    addressLocality: "Changanacherry",
    addressRegion: "Kerala",
    postalCode: "686101",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 9.4426752, longitude: 76.5431387 },
  areaServed: { "@type": "City", name: "Kottayam" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "23:30",
    },
  ],
  sameAs: [
    "https://www.instagram.com/abhinayacinemas/",
    "https://www.facebook.com/profile.php?id=61586263048713",
    "https://www.youtube.com/@AbhinayaCinemas",
    "https://in.bookmyshow.com/cinemas/CNSY/abhinaya-cinemas-4k-dolby-712-changanassery/buytickets/ABCN/",
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
    />
  );
}
