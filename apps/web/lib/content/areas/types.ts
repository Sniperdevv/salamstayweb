/**
 * Area-landing content model, v2: the data contract behind the GW-003
 * template, rebuilt inventory-first (Phase 4 of the Airbnb-gap redesign, and
 * the last of the three build phases).
 *
 * `/stays-in-islamabad/f-7` is the first area page. The layout lives once in
 * `components/area/*`; an area ships by adding one object of this shape, and
 * critically only once that area clears the GATE 19 supply gate recorded in
 * its content file. This type cannot enforce the gate; the content file's
 * ledger comment is where a reviewer checks it.
 *
 * What changed in v2, and why (see MIGRATION at the foot of this file for the
 * mechanical list every future area file follows):
 *
 * - **`facts` is gone.** Four quick facts under the H1 cost roughly eighty
 *   vertical pixels on a page that also carries a breadcrumb, and every one of
 *   them is stated again below: the markaz and Jinnah Super in `about`, the
 *   four-minute masjid walk in `about` and FAQ answer 2, walkability and
 *   ride-hailing in `around`, and "PKR —" on every card in the rail. A strip
 *   that only repeats is a strip that only costs.
 * - **`intro: RichText` became `support: string`.** The old lede set two
 *   SEO-RULES §5 claims in `<strong>` inside a five-line paragraph. Claims are
 *   now stated once each, verbatim, where they are load-bearing (the FAQ), and
 *   the support line is one plain descriptive sentence that says where in the
 *   area you are looking. A claim is never paraphrased and then presented as
 *   the claim. `RichText` leaves this model entirely with it.
 * - **`about.paragraphs` is gone.** Two lede paragraphs above four context
 *   rows made the block read as an essay with an appendix. Everything
 *   checkable in them survives verbatim in FAQ answer 1 (central sector, the
 *   grid, the Margalla Hills, the markaz built around Jinnah Super Market, the
 *   embassies) and in `about.items`; what does not survive is the paragraph
 *   about which kinds of traveller the sector "suits", which was the one run of
 *   prose on the page that named no checkable local fact.
 * - **`stays.intro` is gone.** The rail heading is the whole label. The reason
 *   the sector has a page at all (enough verified homes from enough separate
 *   hosts) is still stated on the page, in `nearby.parentNote`, which is where
 *   a reader meets the question ("why does F-7 have a page and G-11 not?").
 * - **Every `eyebrow` is gone.** Five uppercase micro-labels above five
 *   headings is a rhythm, not information, and the redesign direction bans them.
 *
 * Rules this file enforces by construction, unchanged from v1:
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
import type { FaqEntry, RelatedLink, StayCardContent } from "@/lib/content/stays";

/** "About {area}" context-card glyphs. */
export type AreaContextIcon = "market" | "masjid" | "civic" | "hills";

/** "Getting around {area}" glyphs. */
export type AreaNoteIcon = "walk" | "transit" | "power";

/**
 * One card of local context. Never a generic "vibrant district" line.
 *
 * The card clamps `body` to two lines and a disclosure opens the rest in
 * place, so the whole string is always in the served HTML and in the
 * accessibility tree, so an area may write the context it needs without having
 * to guess a card height.
 */
export interface AreaContextRow {
  readonly icon: AreaContextIcon;
  readonly heading: string;
  readonly body: string;
}

/** Same card, same clamp-and-disclose behaviour, different glyph vocabulary. */
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
  /**
   * Why this sector, in the sector's own terms. Deliberately still a sentence
   * rather than the city template's three-word tile line: each sibling link on
   * an area page has to be defended, and a row of three-word labels is what a
   * generated doorway set looks like (§6 / G70).
   */
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
   * AND `breadcrumbList()` from this one array. The last crumb renders as
   * `aria-current` text while still carrying its path for the schema, which is
   * how G40's "visible ≡ schema" holds without a second list to keep in sync.
   */
  readonly crumbs: readonly Crumb[];

  /** The one `<h1>`, verbatim from §3.3: `Stays in {Area}, {City}`. */
  readonly h1: string;
  /**
   * ONE line under the H1, at most twenty words. Plain neutral description of
   * where in the area you are looking, in checkable local terms, and it still
   * names the area in its first clause so §3.3's answer-first intro holds. It
   * may refer to a §5 claim in ordinary words, but it may NOT paraphrase a
   * claim and present the paraphrase as the claim; claims appear only in their
   * registry wording, and on this template that means the FAQ.
   */
  readonly support: string;

  readonly stays: {
    /** §3.3's sample verbatim heading: `Stays in {Area}`. */
    readonly heading: string;
    /** Exactly six, in rail order. The first is the LCP image. */
    readonly items: readonly StayCardContent[];
    /** The rail's trailing link, e.g. search filtered to this area. */
    readonly viewAll: RelatedLink;
    /** Why these tiles carry no rating. Sits under the rail it explains. */
    readonly note: string;
  };

  readonly about: {
    /** §3.3's sample verbatim heading: `About {Area}`. */
    readonly heading: string;
    /** Four cards. The ≥5 locally-true facts GATE 19 wants live here and in the FAQ. */
    readonly items: readonly AreaContextRow[];
  };

  readonly around: {
    /** §3.3's sample verbatim heading: `Getting around {Area}`. */
    readonly heading: string;
    readonly items: readonly AreaNote[];
  };

  readonly nearby: {
    /** Question-shaped, answered answer-first by `intro` (G69). */
    readonly heading: string;
    readonly intro: string;
    readonly items: readonly NearbyArea[];
    /** Link back up to the parent city page. */
    readonly parent: RelatedLink;
    /** Why some sectors have no page of their own. */
    readonly parentNote: string;
  };

  readonly faq: {
    readonly heading: string;
    readonly items: readonly FaqEntry[];
  };
}

/* ── MIGRATION: v1 → v2 ───────────────────────────────────────────────────
   For any area file written against the v1 contract, or any v1 draft already
   in hand. The order below is the order the template now draws, which is NOT
   the v1 order: the rail moved above "About {Area}".

   1. DELETE `facts` and the `AreaFact` / `AreaFactIcon` imports. The strip is
      not drawn. Before deleting, confirm each fact is stated somewhere that
      still renders. In practice `about.items`, `around.items` and the FAQ
      already carry all four, and "from PKR —" is on every rail card.
   2. REPLACE `intro: RichText` with `support: string`. Twenty words maximum,
      one line, no `{ strong }` runs, no §5 claim wording, and it still names
      the area in its first clause. Say where in the area the inventory is.
   3. DELETE `about.paragraphs`. Any fact in them that is not already in
      `about.items` or in a FAQ answer must be moved into one of those two
      before the paragraphs go; a fact that is in neither is a fact the page
      was making in passing, and GATE 19 counts facts a reader can check.
   4. DELETE `stays.intro`. Keep `stays.heading`, `stays.items` (exactly six,
      in rail order, the first being the LCP image), `stays.viewAll` and
      `stays.note`.
   5. DELETE `about.eyebrow`, `stays.eyebrow`, `around.eyebrow`,
      `nearby.eyebrow`, `faq.eyebrow`. The template no longer reads them.
   6. `crumbs`, `h1`, `around.items`, `nearby` (all of it) and `faq` are
      UNCHANGED, byte for byte. Note and blurb bodies may stay as long as they
      need to be: both the context cards and the note cards clamp to two lines
      and open the rest in place, so length costs nothing above the fold.
   7. Four `about.items` is the grid the block is tuned for (2 × 2 from `md`),
      and three `around.items` is one row from `md`. Other counts still lay
      out; they just stop being a rectangle.
   8. The GATE 19 supply-ledger comment and the anti-doorway link-discipline
      comment stay at the head of the content file, unchanged. They are the
      only record of why the route was allowed to exist. */
