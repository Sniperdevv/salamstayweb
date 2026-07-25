import { ATTRIBUTES } from "@/components/stays/attributes";
import type { FeaturedStay } from "@/lib/content/featured-stays";
import type { AttributeIcon } from "@/lib/content/stays";

/**
 * The search shell's filter set — and, deliberately, nothing else.
 *
 * Every chip is an id from the shipped `ATTRIBUTES` lexicon, which means three
 * things hold by construction rather than by review: the chip's wording is the
 * same string a listing card prints, the chip's glyph is the same glyph, and a
 * filter can only exist for something a home actually declares. An invented
 * facet ("Superhost", "Instant book", "Best value") is unreachable from here.
 *
 * What the card lists that is NOT here, and why:
 *
 * - **All filters** (a chip opening the full filter sheet). The web filter
 *   modal is not built. A chip that opens nothing is a dead control, and §12's
 *   honesty rule reads the same on affordances as on numbers: ship fewer cells
 *   rather than a cell that lies. It returns with the sheet.
 * - **Price**. No nightly price is published yet — the cards draw a skeleton
 *   where the figure goes. A price filter would be a control over data that
 *   does not exist.
 * - **Entire place / property type**. The fixtures carry no structured type,
 *   only names ("Whole portion in G-11"). Filtering prose would silently drop
 *   homes that do qualify, which is a false negative dressed as a filter.
 * - **No alcohol**. It is the default on every listing (§5 claim 4), so a chip
 *   for it would narrow nothing. It is stated under the row instead.
 */
export const FILTER_IDS = [
  "halal-kitchen",
  "women-only",
  "family-friendly",
  "prayer-space",
  "backup-power",
  "qibla-marked",
] as const satisfies readonly AttributeIcon[];

export type FilterId = (typeof FILTER_IDS)[number];

/** The chip's label — the lexicon's, never a local string. */
export const filterLabel = (id: FilterId): string => ATTRIBUTES[id].label;

/**
 * Does this home satisfy every pressed filter?
 *
 * The test is against the two attributes the card itself prints, because those
 * are the only attributes these fixtures declare. That is a deliberate under-
 * claim: a home may well have a prayer space it has not listed, and this
 * filter will not surface it. Matching on what is listed can only ever hide a
 * home that has not said something; matching on anything looser would show a
 * home as satisfying a requirement it never stated, which is the failure that
 * actually costs a guest something.
 */
export function matchesFilters(
  stay: FeaturedStay,
  pressed: readonly FilterId[],
): boolean {
  if (pressed.length === 0) return true;
  const listed = stay.attributes;
  if (!listed) return false;
  return pressed.every((id) => listed.includes(filterLabel(id)));
}

/** How many of these homes survive this filter set. Never an estimate. */
export const countMatching = (
  stays: readonly FeaturedStay[],
  pressed: readonly FilterId[],
): number => stays.reduce((n, s) => (matchesFilters(s, pressed) ? n + 1 : n), 0);
