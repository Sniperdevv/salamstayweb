/**
 * Area-landing content model — the data contract behind the GW-003 template.
 *
 * `/stays-in-islamabad/f-7` is the first area page. The layout lives once in
 * `components/area/*`; an area ships by adding one object of this shape — and,
 * critically, only once that area clears the GATE 19 supply gate recorded in
 * its content file. This type cannot enforce the gate; the content file's
 * ledger comment is where a reviewer checks it.
 *
 * Rules this file enforces by construction:
 * - Copy is DATA, never JSX. The same strings feed the visible FAQ and the
 *   FAQPage JSON-LD, and the same array feeds the visible breadcrumb and the
 *   BreadcrumbList, so G49 and G40 cannot drift.
 * - Icons are referenced by role id, not by component, so a content file never
 *   imports React and an area cannot invent a glyph outside the corpus set.
 * - Photography is referenced by `ImageId`, so every frame is a manifest entry
 *   with real dimensions, real alt text and a declared authenticity flag (G57).
 * - Every `href` must resolve in `lib/seo/route-registry.ts` (G37).
 * - Sibling links are a fixed list on the object, not a computed "all other
 *   areas in this city". A generated sibling set is exactly how a doorway
 *   network gets built (§6 / G70); an author has to type each one and defend it.
 */

import type { Crumb } from "@/lib/seo/jsonld";
import type { FaqEntry, RelatedLink, RichText, StayCardContent } from "@/lib/content/stays";

/** Quick-facts strip glyphs (card §hero `.facts`). */
export type AreaFactIcon = "sector" | "masjid" | "transit" | "price";

/** "About {area}" context-row glyphs (card §About `.ctx`). */
export type AreaContextIcon = "market" | "masjid" | "civic" | "hills";

/** "Getting around {area}" glyphs (card §Getting around `.note`). */
export type AreaNoteIcon = "walk" | "transit" | "power";

export interface AreaFact {
  readonly icon: AreaFactIcon;
  /** Uppercase micro-label, e.g. "Nearest masjid". */
  readonly label: string;
  /** The fact itself, in primary ink. */
  readonly value: string;
  /** The qualifier that trails it, in secondary ink, e.g. "· F-7 Markaz". */
  readonly muted: string;
}

/** One `<h3>` row of local context. Never a generic "vibrant district" line. */
export interface AreaContextRow {
  readonly icon: AreaContextIcon;
  readonly heading: string;
  readonly body: string;
}

export interface AreaNote {
  readonly icon: AreaNoteIcon;
  readonly heading: string;
  readonly body: string;
}

/**
 * An adjacent area a reader can book instead. Only areas that carry their own
 * locally-true content AND are already published by the parent city page may
 * appear here.
 */
export interface NearbyArea {
  readonly href: string;
  /** Link text, e.g. "Stays in F-6". */
  readonly label: string;
  readonly blurb: string;
}

export interface AreaContent {
  /** URL slug fragment, e.g. "f-7". */
  readonly slug: string;
  /** Full route, e.g. "/stays-in-islamabad/f-7". Must be a registry `page`. */
  readonly path: string;
  /** Display name used in prose and headings, e.g. "F-7". */
  readonly name: string;
  /** Parent city, e.g. "Islamabad". */
  readonly cityName: string;
  /** ~160 chars, from the card header comment. Feeds `pageMetadata`. */
  readonly metaDescription: string;

  /**
   * The trail, root-first. Feeds the visible `<nav aria-label="Breadcrumb">`
   * AND `breadcrumbList()` from this one array — the last crumb renders as
   * `aria-current` text while still carrying its path for the schema, which is
   * how G40's "visible ≡ schema" holds without a second list to keep in sync.
   */
  readonly crumbs: readonly Crumb[];

  /** The one `<h1>`. */
  readonly h1: string;
  /** Answer-first intro naming the area in its first clause (§7). */
  readonly intro: RichText;
  readonly facts: readonly AreaFact[];

  readonly about: {
    readonly eyebrow: string;
    readonly heading: string;
    /** Lede paragraphs above the context rows. */
    readonly paragraphs: readonly RichText[];
    readonly items: readonly AreaContextRow[];
  };

  readonly stays: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly StayCardContent[];
    readonly viewAll: RelatedLink;
    /** The card's `.supplynote` — why these tiles carry no rating. */
    readonly note: string;
  };

  readonly around: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly AreaNote[];
  };

  readonly nearby: {
    readonly eyebrow: string;
    /** Question-shaped, answered answer-first by `intro` (G69). */
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly NearbyArea[];
    /** Link back up to the parent city page. */
    readonly parent: RelatedLink;
    /** The card's `.parentnote` — why some sectors have no page of their own. */
    readonly parentNote: string;
  };

  readonly faq: {
    readonly eyebrow: string;
    readonly heading: string;
    readonly items: readonly FaqEntry[];
  };
}
