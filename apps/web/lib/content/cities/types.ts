/**
 * City-landing content model — the data contract behind the GW-002 template.
 *
 * `/stays-in-islamabad` is the first of six city landings (Wave 1 + Wave 1b).
 * The layout lives once in `components/city/*`; a city ships by adding one
 * object of this shape. Nothing here is optional decoration: every field maps
 * to a block the card draws, so a missing field is a missing block, caught by
 * the compiler rather than by a reviewer reading rendered HTML.
 *
 * Rules this file enforces by construction:
 * - Copy is DATA, never JSX. The same string feeds the visible FAQ and the
 *   FAQPage JSON-LD, so G49 (schema ≡ visible, verbatim) cannot drift.
 * - Icons are referenced by role id, not by component, so a content file never
 *   imports React and a city cannot invent a glyph outside the corpus set.
 * - Photography is referenced by `ImageId`, so every frame is a manifest entry
 *   with real dimensions, real alt text and a declared authenticity flag (G57).
 * - Every `href` must resolve in `lib/seo/route-registry.ts` (G37). The
 *   registry is the gate; this file is where a bad link gets written, so keep
 *   paths literal and greppable.
 */

import type { ImageId } from "@/lib/content/image-manifest";

/**
 * A run of copy where one phrase carries primary ink. The card's answer-first
 * intro sets its registry claims in `<strong>`; this is that, as data.
 */
export interface Emphasis {
  readonly strong: string;
}
export type RichText = readonly (string | Emphasis)[];

/** Quick-facts strip glyphs (card §hero `.facts`). */
export type FactIcon = "season" | "transit" | "areas" | "price";

/**
 * Cultural / practical attribute glyphs. The set is closed: these are the
 * corpus attributes, and a listing badge or filter chip may only be one of
 * them. Labels live with the icon map, not in city content, so "Halal kitchen"
 * reads identically on all six city pages.
 */
export type AttributeIcon =
  | "halal-kitchen"
  | "no-alcohol"
  | "backup-power"
  | "prayer-space"
  | "women-only"
  | "family-friendly";

/** Practical-notes glyphs (card §Practical notes). */
export type NoteIcon = "power" | "transit" | "weather";

export interface CityFact {
  readonly icon: FactIcon;
  /** Uppercase micro-label, e.g. "Best season". */
  readonly label: string;
  /** The fact itself, in primary ink. */
  readonly value: string;
  /** The qualifier that trails it, in secondary ink, e.g. "· cool, clear". */
  readonly muted: string;
}

export interface CityArea {
  /** Sector or neighbourhood name — the `<h3>`. */
  readonly name: string;
  /** One locally-true sentence. Never a generic "vibrant district" line. */
  readonly blurb: string;
  /** Area page. Omitted on the wayfinding tile, which is not a place. */
  readonly href?: string;
  readonly linkLabel?: string;
  /** Omitted on the wayfinding tile, which renders its glyph instead. */
  readonly image?: ImageId;
}

export interface CityStay {
  /** Listing route. Must be registry-resolvable (G37). */
  readonly href: string;
  readonly title: string;
  /** Short area label shown over the photograph, e.g. "F-6". */
  readonly areaPin: string;
  /** Full location line under the title, e.g. "F-6, Islamabad". */
  readonly location: string;
  readonly image: ImageId;
  /** Attribute pills, in card order. No ratings, no review counts. */
  readonly attributes: readonly AttributeIcon[];
  /**
   * Name for the ItemList JSON-LD entry. Carried explicitly because schema
   * names the stay AND its city ("… — F-6, Islamabad") while the visible card
   * splits the two across title and location line.
   */
  readonly schemaName: string;
}

export interface CityNote {
  readonly icon: NoteIcon;
  readonly heading: string;
  readonly body: string;
}

export interface CityFilter {
  readonly icon: AttributeIcon;
  readonly label: string;
  readonly href: string;
}

/** Question and answer, rendered visibly AND as FAQPage from this one source. */
export interface CityFaq {
  readonly question: string;
  readonly answer: string;
}

export interface RelatedLink {
  readonly href: string;
  readonly label: string;
}

export interface RelatedColumn {
  readonly heading: string;
  readonly links: readonly RelatedLink[];
  /** Optional footnote explaining an incomplete column. */
  readonly note?: string;
}

export interface CityContent {
  /** URL slug fragment, e.g. "islamabad". */
  readonly slug: string;
  /** Full route, e.g. "/stays-in-islamabad". Must be a registry `page`. */
  readonly path: string;
  /** Display name used in prose, e.g. "Islamabad". */
  readonly name: string;
  /** ~160 chars, from the card header comment. Feeds `pageMetadata`. */
  readonly metaDescription: string;

  /** The one `<h1>`. */
  readonly h1: string;
  /** Answer-first intro naming the city in its first clause (§7). */
  readonly intro: RichText;
  /** Hero photograph. Rendered `priority` — it is the LCP element. */
  readonly hero: ImageId;
  readonly facts: readonly CityFact[];

  readonly areas: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly CityArea[];
  };

  readonly stays: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly CityStay[];
    readonly viewAll: RelatedLink;
  };

  readonly notes: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly CityNote[];
  };

  readonly filters: {
    readonly heading: string;
    readonly items: readonly CityFilter[];
  };

  readonly faq: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly CityFaq[];
  };

  readonly related: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly columns: readonly RelatedColumn[];
  };
}
