/**
 * Primitives shared by every stays-discovery content model.
 *
 * `cities/types.ts` (GW-002) and `areas/types.ts` (GW-003) describe different
 * pages, but they describe the SAME objects: a run of emphasised copy, a
 * listing tile, an attribute pill, a Q&A pair, a labelled link. Those live here
 * once so a halal-kitchen pill on the F-7 page is byte-identical to the one on
 * the Islamabad page, and so a future area template inherits the vocabulary
 * instead of re-declaring it slightly differently.
 *
 * Nothing page-shaped belongs in this file. If a type is only meaningful to one
 * template, it stays in that template's `types.ts`.
 */

import type { ImageId } from "@/lib/content/image-manifest";

/**
 * A run of copy where one phrase carries primary ink. The cards' answer-first
 * intros set their registry claims in `<strong>`; this is that, as data.
 */
export interface Emphasis {
  readonly strong: string;
}
export type RichText = readonly (string | Emphasis)[];

/**
 * Cultural / practical attribute glyphs. The set is closed: these are the
 * corpus attributes, and a listing badge or filter chip may only be one of
 * them. Labels live with the icon map in `components/stays/attributes.ts`, not
 * in content, so the wording cannot drift page to page.
 */
export type AttributeIcon =
  | "halal-kitchen"
  | "no-alcohol"
  | "backup-power"
  | "prayer-space"
  | "women-only"
  | "family-friendly"
  | "qibla-marked";

/**
 * One listing tile, as both templates draw it. Deliberately carries no price,
 * no rating and no review count: "PKR —" is a placeholder the component owns,
 * and pre-launch there is no real review to show (§5/§6, G14, G74).
 */
export interface StayCardContent {
  /** Listing route. Must be registry-resolvable (G37). */
  readonly href: string;
  readonly title: string;
  /** Short area label shown over the photograph, e.g. "F-7 Markaz". */
  readonly areaPin: string;
  /** The line under the title. City pages put the sector here; area pages put
   *  the home's shape and capacity, exactly as each card draws it. */
  readonly location: string;
  readonly image: ImageId;
  /** Attribute pills, in card order. */
  readonly attributes: readonly AttributeIcon[];
  /**
   * Name for the ItemList JSON-LD entry. Carried explicitly because schema
   * names the stay AND its area ("… — F-7, Islamabad") while the visible card
   * splits the two across the title and the line beneath it.
   */
  readonly schemaName: string;
}

/** Question and answer, rendered visibly AND as FAQPage from this one source. */
export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

export interface RelatedLink {
  readonly href: string;
  readonly label: string;
}
