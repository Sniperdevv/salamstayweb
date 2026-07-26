/**
 * Primitives shared by every stays-discovery content model.
 *
 * `cities/types.ts` (GW-002) and `areas/types.ts` (GW-003) describe different
 * pages, but they describe the SAME objects: a run of emphasised copy, a
 * listing tile, an attribute pill, a Q&A pair, a labelled link. Those live here
 * once so a backup-power pill on the F-7 page is byte-identical to the one on
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
 * House-rule and practical attribute glyphs. The set is closed: these are the
 * modelled attributes, and a listing badge or filter chip may only be one of
 * them. Labels live with the icon map in `components/stays/attributes.ts`, not
 * in content, so the wording cannot drift page to page.
 *
 * Four, down from seven (REPOSITIONING.md, founder decision). `halal-kitchen`,
 * `prayer-space` and `qibla-marked` are RETIRED — not softened, not renamed:
 * SalamStay does not model observance, and a host who wants to say any of it
 * says it in their own listing prose. What remains is two house rules a guest
 * has to know before booking (`no-alcohol`, `family-friendly`), one safety
 * category (`women-only`), and the practical fact that now leads the product
 * (`backup-power`). Narrowing the union rather than deleting the values from
 * the fixtures is deliberate: the compiler, not a reviewer, finds every stay
 * that still claims a retired attribute.
 */
export type AttributeIcon =
  | "no-alcohol"
  | "backup-power"
  | "women-only"
  | "family-friendly";

/**
 * One listing tile, as both templates draw it. Deliberately carries no price,
 * no rating and no review count: "PKR —" is a placeholder the component owns,
 * and pre-launch there is no real review to show (§5/§6, G14, G74).
 */
export interface StayCardContent {
  /**
   * Listing route, or `null` when no listing page exists for this home yet.
   *
   * `null` is the honest value, not a placeholder: a home whose page has not
   * been built has no URL, and the type has to be able to say so. The
   * alternative this replaced — pointing the card at the city page it already
   * sits on — produced a card that linked to itself and an `ItemList` whose
   * nine entries all carried the same URL, which is a fabricated schema value
   * (SEO-RULES §1.5) and the doorway pattern SCREENS §6 exists to prevent:
   * instances are earned, not minted.
   *
   * The nullability is load-bearing. Every consumer is forced by the compiler
   * to decide what an absent route means for it — the card renders unlinked,
   * the `ItemList` omits the entry, and a list left with no entries is not
   * emitted at all.
   *
   * When non-null it must be registry-resolvable (G37): a route is minted by
   * `lib/seo/route-registry.ts`, never by a content file.
   */
  readonly href: string | null;
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
