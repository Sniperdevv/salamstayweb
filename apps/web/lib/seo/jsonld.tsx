/**
 * Typed JSON-LD builders — the ONLY way a page may emit structured data.
 *
 * The per-page schema matrix (GATE 74, HARD) is enforced by construction:
 * there are no builders for VacationRental, Offer, price, priceRange,
 * availability, or AggregateRating. If a builder doesn't exist here, the
 * schema type is forbidden on this site. Do not add builders without a
 * founder-approved gate change.
 */

import { ORIGIN } from "./route-registry";

type JsonLd = Record<string, unknown>;

export const organization = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${ORIGIN}/#organization`,
  name: "SalamStay",
  url: `${ORIGIN}/`,
  description:
    "SalamStay is a home-sharing marketplace for Pakistan — verified homes and rooms across six cities.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${ORIGIN}/help/contact`,
    availableLanguage: ["en-PK", "ur-PK"],
  },
});

export const webSite = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  name: "SalamStay",
  url: `${ORIGIN}/`,
  publisher: { "@id": `${ORIGIN}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${ORIGIN}/search?city={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export interface Crumb {
  readonly name: string;
  readonly path: string;
}

export const breadcrumbList = (crumbs: readonly Crumb[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${ORIGIN}${c.path === "/" ? "/" : c.path}`,
  })),
});

export const itemList = (items: readonly { name: string; path: string }[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    url: `${ORIGIN}${it.path}`,
  })),
});

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/**
 * FAQPage is permitted ONLY where a genuine, visible FAQ exists and matches
 * verbatim (G49/G72). The caller must render the same items visibly.
 */
export const faqPage = (items: readonly FaqItem[]): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export interface LodgingInput {
  readonly name: string;
  readonly path: string;
  readonly description: string;
  readonly addressLocality: string;
  readonly addressRegion: string;
  readonly latitude: number;
  readonly longitude: number;
  /** Visible attribute pills — schema must match these exactly (G44). */
  readonly amenities: readonly string[];
  readonly image?: readonly string[];
}

/**
 * LodgingBusiness ONLY — never VacationRental (partner-feed-gated, G74 HARD),
 * never Offer/price/availability, never AggregateRating (no real reviews yet).
 */
export const lodgingBusiness = (l: LodgingInput): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": `${ORIGIN}${l.path}#lodging`,
  name: l.name,
  url: `${ORIGIN}${l.path}`,
  description: l.description,
  address: {
    "@type": "PostalAddress",
    addressLocality: l.addressLocality,
    addressRegion: l.addressRegion,
    addressCountry: "PK",
  },
  geo: { "@type": "GeoCoordinates", latitude: l.latitude, longitude: l.longitude },
  amenityFeature: l.amenities.map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a,
    value: true,
  })),
  ...(l.image ? { image: l.image.map((p) => `${ORIGIN}${p}`) } : {}),
});

export interface ArticleInput {
  readonly headline: string;
  readonly path: string;
  readonly description: string;
  readonly datePublished: string;
  readonly dateModified: string;
  readonly image?: string;
}

export const article = (a: ArticleInput): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: a.headline,
  url: `${ORIGIN}${a.path}`,
  inLanguage: "en-PK",
  description: a.description,
  datePublished: a.datePublished,
  dateModified: a.dateModified,
  author: {
    "@type": "Organization",
    name: "SalamStay Editorial",
    url: `${ORIGIN}/authors/salamstay-editorial`,
  },
  publisher: { "@id": `${ORIGIN}/#organization` },
  isPartOf: { "@id": `${ORIGIN}/#website` },
  ...(a.image ? { image: `${ORIGIN}${a.image}` } : {}),
});

export interface WebPageInput {
  readonly path: string;
  readonly name: string;
  /** The card's own WebPage description. Registry-grounded prose, never new claims. */
  readonly description: string;
  /**
   * Internal paths this page deliberately hands the reader on to — the GW-006 /
   * GW-007 card contracts name these explicitly. Paths, not URLs: the origin is
   * applied here so a card contract can never ship a bare or foreign one.
   */
  readonly significantLink?: readonly string[];
}

export const webPage = (p: WebPageInput): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: `${ORIGIN}${p.path}`,
  name: p.name,
  inLanguage: "en-PK",
  description: p.description,
  isPartOf: { "@id": `${ORIGIN}/#website` },
  publisher: { "@id": `${ORIGIN}/#organization` },
  ...(p.significantLink
    ? { significantLink: p.significantLink.map((path) => `${ORIGIN}${path}`) }
    : {}),
});

export const aboutPage = (description: string): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${ORIGIN}/about`,
  name: "About SalamStay",
  inLanguage: "en-PK",
  description,
  isPartOf: { "@id": `${ORIGIN}/#website` },
  mainEntity: {
    "@type": "Organization",
    name: "SalamStay",
    url: `${ORIGIN}/`,
    description: "SalamStay, a home-sharing marketplace for Pakistan.",
    areaServed: { "@type": "Country", name: "Pakistan" },
    knowsLanguage: ["en-PK", "ur-PK"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["en", "ur"],
      url: `${ORIGIN}/help/contact`,
    },
  },
});

/** ProfilePage for the collective editorial entity — never an invented Person. */
export const editorialProfilePage = (): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${ORIGIN}/authors/salamstay-editorial`,
  mainEntity: {
    "@type": "Organization",
    name: "SalamStay Editorial",
    parentOrganization: { "@id": `${ORIGIN}/#organization` },
    knowsLanguage: ["en-PK", "ur-PK"],
    publishingPrinciples: `${ORIGIN}/legal/editorial-policy`,
    correctionsPolicy: `${ORIGIN}/legal/corrections`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      url: `${ORIGIN}/help/contact`,
    },
  },
});

/** Renders JSON-LD blocks. Server component — schema lands in initial HTML (G61). */
export function JsonLdScript({ data }: { data: readonly JsonLd[] }) {
  return (
    <>
      {data.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
