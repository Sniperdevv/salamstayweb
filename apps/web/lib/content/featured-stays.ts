/**
 * Featured-stay fixtures for the inventory-first rails — nine named homes per
 * beta city, in rail order.
 *
 * Why this file exists: the redesign leads with inventory, so a homepage or a
 * city landing needs real card objects per city before it can render a rail.
 * The city and area templates already hold their own card data; this collection
 * does NOT duplicate it. Islamabad's first six are the exact `StayCardContent`
 * objects the Islamabad city page ships, and `F7_STAYS` is the exact set the
 * F-7 area page ships, both re-projected into the compact card's shape by one
 * mapper. Only the five template cities, which have no content file yet, get
 * fresh objects here — plus the three that take Islamabad's rail to nine,
 * which are appended after the shipped six rather than edited into them.
 *
 * Rules this file enforces by construction:
 * - Every `href` resolves in `lib/seo/route-registry.ts` (G37). Islamabad's six
 *   point at registered listing stubs because those routes exist. Everything
 *   else points at its own `/stays-in-{city}` landing, because minting
 *   `/stays-in-karachi/clifton/…` here would emit links to routes the router
 *   cannot serve. When listing routes land, only the `href` changes.
 * - Photography is an `ImageId` off `CITY_STAY_CARDS` (or, for Islamabad's
 *   three extras, `ISLAMABAD_EXTRA_STAY_CARDS`), in the manifest's own card
 *   order, so each city keeps the frames the manifest already assigned it and
 *   no two cities share a frame on one page. The nine frames behind a rail are
 *   nine distinct photographs: the verifier fails on a repeat.
 * - No price, no rating, no review count, no "N stays" tally. Pre-launch none
 *   of those numbers exists, and the card has no slot for them.
 * - Attributes are the shipped `ATTRIBUTES` lexicon and nothing else. Two per
 *   card, derived from the home's own attribute list where a content file
 *   exists, so no card can claim something the listing page does not.
 *
 * On `isNew`: the chip means "no two-way review has been published for this
 * home yet". Pre-launch that is true of every listing, so every entry carries
 * `true` and none of them is claiming to be newer than its neighbour. It is a
 * per-stay flag rather than a page switch so the first home to earn a review
 * can drop its chip without the others changing. `StayCardCompact` also takes a
 * page-level `newChip` gate for surfaces that would otherwise draw six
 * identical chips in a row.
 */

import { ATTRIBUTES } from "@/components/stays/attributes";
import {
  CITY_STAY_CARDS,
  ISLAMABAD_EXTRA_STAY_CARDS,
  type ImageId,
} from "@/lib/content/image-manifest";
import type { AttributeIcon, StayCardContent } from "@/lib/content/stays";
import { islamabad } from "@/lib/content/cities/islamabad";
import { f7Islamabad } from "@/lib/content/areas/f7-islamabad";

/** One stay as the compact card draws it: photograph, name, area line, chip. */
export interface FeaturedStay {
  /** Registry-resolvable route (G37). */
  readonly href: string;
  /** Card title. One line, truncated by the card, never wrapped. */
  readonly name: string;
  /** The line under the name — sector or neighbourhood, then city. */
  readonly area: string;
  readonly image: ImageId;
  /** True until this home's first two-way review is published. */
  readonly isNew: boolean;
  /**
   * The card's third line: exactly two attributes, joined by one `·` (§7 —
   * one separator per gap, never chained).
   *
   * Strings, not `AttributeIcon` ids, because the card renders them as prose
   * rather than as pills — but every string here is produced by
   * `label()` below, so the only wording that can ever appear is the shipped
   * `ATTRIBUTES` lexicon. "Verified", "Alcohol-free", "Superhost" and every
   * other invented badge are unreachable by construction (§12).
   *
   * Optional: a stay with fewer than two real attributes ships no line at all
   * rather than a padded one.
   */
  readonly attributes?: readonly [string, string];
}

/**
 * The shipped label for one attribute id. The single source is the icon map in
 * `components/stays/attributes.ts` — the same map the pills on the city and
 * area pages read — so "Halal kitchen" on a rail card and "Halal kitchen" on a
 * listing pill cannot drift apart.
 */
const label = (id: AttributeIcon): string => ATTRIBUTES[id].label;

/** The first two of a stay's own attributes, or nothing if it has fewer. */
function attributePair(
  ids: readonly AttributeIcon[],
): readonly [string, string] | undefined {
  const [a, b] = ids;
  return a && b ? [label(a), label(b)] : undefined;
}

/** Two shipped labels, for the template cities that have no content file yet. */
const pair = (a: AttributeIcon, b: AttributeIcon): readonly [string, string] => [
  label(a),
  label(b),
];

export type CitySlug =
  | "islamabad"
  | "karachi"
  | "lahore"
  | "peshawar"
  | "faisalabad"
  | "rawalpindi";

/**
 * Re-projects a shipped `StayCardContent` into the compact shape. The compact
 * card has no price row, so the mapper carries no price rather than inventing a
 * shorter version of one; the attribute PILLS become the card's third text
 * line, and the first two of the home's own attributes are what it says.
 */
export function fromStayCard(stay: StayCardContent, area?: string): FeaturedStay {
  const attributes = attributePair(stay.attributes);
  return {
    href: stay.href,
    name: stay.title,
    area: area ?? stay.location,
    image: stay.image,
    isNew: true,
    ...(attributes ? { attributes } : {}),
  };
}

/**
 * Islamabad's three extra rail cards. The city page's own six are re-projected
 * untouched below; these sit after them so the rail reaches nine without any
 * edit to the shipped set. Their `href` is the city landing, not a minted
 * listing slug, for the same G37 reason the template cities point at theirs.
 */
const ISLAMABAD_EXTRA_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-islamabad",
    name: "Family home in F-10",
    area: "F-10, Islamabad",
    image: ISLAMABAD_EXTRA_STAY_CARDS[0],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-islamabad",
    name: "Whole portion in G-11",
    area: "G-11, Islamabad",
    image: ISLAMABAD_EXTRA_STAY_CARDS[1],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-islamabad",
    name: "Hillside 1-bed in Bani Gala",
    area: "Bani Gala, Islamabad",
    image: ISLAMABAD_EXTRA_STAY_CARDS[2],
    isNew: true,
    attributes: pair("no-alcohol", "prayer-space"),
  },
];

/** Islamabad — the six the city page already ships, verbatim, then three more. */
const ISLAMABAD_STAYS: readonly FeaturedStay[] = [
  ...islamabad.stays.items.map((s) => fromStayCard(s)),
  ...ISLAMABAD_EXTRA_STAYS,
];

/**
 * F-7, Islamabad — the six the area page already ships, verbatim. Exported for
 * an area rail; not part of the six-city collection, since F-7 is a sector.
 */
export const F7_STAYS: readonly FeaturedStay[] = f7Islamabad.stays.items.map((s) =>
  fromStayCard(s, "F-7, Islamabad"),
);

/**
 * The five template cities. Names follow the corpus' own naming style: what
 * the home is, then where it is. No superlatives, no view claims the frame
 * cannot support, no host names.
 */
const KARACHI_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-karachi",
    name: "Bright 2-bed in Clifton",
    area: "Clifton Block 2, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][0],
    isNew: true,
    attributes: pair("halal-kitchen", "no-alcohol"),
  },
  {
    href: "/stays-in-karachi",
    name: "Quiet 1-bed near Bahadurabad",
    area: "Bahadurabad, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][1],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-karachi",
    name: "Family portion in PECHS",
    area: "PECHS Block 6, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][2],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-karachi",
    name: "Whole apartment in DHA Phase 5",
    area: "DHA Phase 5, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][3],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-karachi",
    name: "Twin room in Gulshan-e-Iqbal",
    area: "Gulshan-e-Iqbal, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][4],
    isNew: true,
    attributes: pair("women-only", "halal-kitchen"),
  },
  {
    href: "/stays-in-karachi",
    name: "Garden guest house in North Nazimabad",
    area: "North Nazimabad, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][5],
    isNew: true,
    attributes: pair("family-friendly", "backup-power"),
  },
  {
    href: "/stays-in-karachi",
    name: "Balcony flat in Gulistan-e-Johar",
    area: "Gulistan-e-Johar, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][6],
    isNew: true,
    attributes: pair("backup-power", "family-friendly"),
  },
  {
    href: "/stays-in-karachi",
    name: "Veranda portion in DHA Phase 6",
    area: "DHA Phase 6, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][7],
    isNew: true,
    attributes: pair("halal-kitchen", "prayer-space"),
  },
  {
    href: "/stays-in-karachi",
    name: "Air-conditioned 1-bed in Nazimabad",
    area: "Nazimabad, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][8],
    isNew: true,
    attributes: pair("no-alcohol", "qibla-marked"),
  },
];

const LAHORE_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-lahore",
    name: "Studio near Liberty Market",
    area: "Gulberg III, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][0],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-lahore",
    name: "Quiet 1-bed in Model Town",
    area: "Model Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][1],
    isNew: true,
    attributes: pair("halal-kitchen", "no-alcohol"),
  },
  {
    href: "/stays-in-lahore",
    name: "Family room near the Walled City",
    area: "Walled City, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][2],
    isNew: true,
    attributes: pair("family-friendly", "prayer-space"),
  },
  {
    href: "/stays-in-lahore",
    name: "Whole portion in Johar Town",
    area: "Johar Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][3],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-lahore",
    name: "Balcony flat in Garden Town",
    area: "Garden Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][4],
    isNew: true,
    attributes: pair("qibla-marked", "halal-kitchen"),
  },
  {
    href: "/stays-in-lahore",
    name: "Courtyard house in DHA Phase 5",
    area: "DHA Phase 5, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][5],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-lahore",
    name: "Bright flat in Askari 11",
    area: "Askari 11, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][6],
    isNew: true,
    attributes: pair("backup-power", "no-alcohol"),
  },
  {
    href: "/stays-in-lahore",
    name: "Marble-floor room in Samanabad",
    area: "Samanabad, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][7],
    isNew: true,
    attributes: pair("women-only", "no-alcohol"),
  },
  {
    href: "/stays-in-lahore",
    name: "Whole house in Allama Iqbal Town",
    area: "Allama Iqbal Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][8],
    isNew: true,
    attributes: pair("halal-kitchen", "prayer-space"),
  },
];

const PESHAWAR_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-peshawar",
    name: "City-centre flat in Saddar",
    area: "Saddar, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][0],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Warm 1-bed in Gulbahar",
    area: "Gulbahar, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][1],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Villa room in University Town",
    area: "University Town, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][2],
    isNew: true,
    attributes: pair("prayer-space", "halal-kitchen"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Whole portion in Hayatabad",
    area: "Hayatabad Phase 3, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][3],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Family apartment off Warsak Road",
    area: "Warsak Road, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][4],
    isNew: true,
    attributes: pair("family-friendly", "backup-power"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Balcony 2-bed in Hayatabad",
    area: "Hayatabad Phase 6, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][5],
    isNew: true,
    attributes: pair("halal-kitchen", "no-alcohol"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Single room off Dalazak Road",
    area: "Dalazak Road, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][6],
    isNew: true,
    attributes: pair("no-alcohol", "qibla-marked"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Family portion near Board Bazaar",
    area: "Board Bazaar, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][7],
    isNew: true,
    attributes: pair("halal-kitchen", "qibla-marked"),
  },
  {
    href: "/stays-in-peshawar",
    name: "Garden bungalow off Nasir Bagh Road",
    area: "Nasir Bagh Road, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][8],
    isNew: true,
    attributes: pair("family-friendly", "prayer-space"),
  },
];

const FAISALABAD_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-faisalabad",
    name: "Studio near D Ground",
    area: "D Ground, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][0],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Quiet 1-bed in Madina Town",
    area: "Madina Town, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][1],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Single room in Peoples Colony",
    area: "Peoples Colony, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][2],
    isNew: true,
    attributes: pair("women-only", "halal-kitchen"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Whole portion on Susan Road",
    area: "Susan Road, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][3],
    isNew: true,
    attributes: pair("halal-kitchen", "prayer-space"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Family flat in Gulberg",
    area: "Gulberg, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][4],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Upper portion near the Clock Tower",
    area: "Clock Tower, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][5],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Whole house in Batala Colony",
    area: "Batala Colony, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][6],
    isNew: true,
    attributes: pair("family-friendly", "backup-power"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Guest room in Millat Town",
    area: "Millat Town, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][7],
    isNew: true,
    attributes: pair("women-only", "no-alcohol"),
  },
  {
    href: "/stays-in-faisalabad",
    name: "Compact flat on Jaranwala Road",
    area: "Jaranwala Road, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][8],
    isNew: true,
    attributes: pair("halal-kitchen", "no-alcohol"),
  },
];

const RAWALPINDI_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-rawalpindi",
    name: "Whole flat in Satellite Town",
    area: "Satellite Town, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][0],
    isNew: true,
    attributes: pair("halal-kitchen", "no-alcohol"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Quiet 1-bed in Bahria Town",
    area: "Bahria Town Phase 4, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][1],
    isNew: true,
    attributes: pair("backup-power", "halal-kitchen"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Twin room in Chaklala Scheme 3",
    area: "Chaklala Scheme 3, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][2],
    isNew: true,
    attributes: pair("no-alcohol", "backup-power"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Plain 1-bed in Westridge",
    area: "Westridge, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][3],
    isNew: true,
    attributes: pair("halal-kitchen", "backup-power"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Whole portion in DHA Phase 2",
    area: "DHA Phase 2, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][4],
    isNew: true,
    attributes: pair("family-friendly", "halal-kitchen"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Terrace apartment near Saddar",
    area: "Saddar, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][5],
    isNew: true,
    attributes: pair("qibla-marked", "halal-kitchen"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "High-floor flat in Askari 14",
    area: "Askari 14, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][6],
    isNew: true,
    attributes: pair("backup-power", "prayer-space"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Upper room in Gulraiz",
    area: "Gulraiz, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][7],
    isNew: true,
    attributes: pair("women-only", "halal-kitchen"),
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Whole portion on Peshawar Road",
    area: "Peshawar Road, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][8],
    isNew: true,
    attributes: pair("family-friendly", "no-alcohol"),
  },
];

/** Nine named homes per beta city, in rail order. */
export const FEATURED_STAYS: Record<CitySlug, readonly FeaturedStay[]> = {
  islamabad: ISLAMABAD_STAYS,
  karachi: KARACHI_STAYS,
  lahore: LAHORE_STAYS,
  peshawar: PESHAWAR_STAYS,
  faisalabad: FAISALABAD_STAYS,
  rawalpindi: RAWALPINDI_STAYS,
};

/** City slug → display name, for rail headings and card labels. */
export const CITY_NAMES: Record<CitySlug, string> = {
  islamabad: "Islamabad",
  karachi: "Karachi",
  lahore: "Lahore",
  peshawar: "Peshawar",
  faisalabad: "Faisalabad",
  rawalpindi: "Rawalpindi",
};

/** Rail order for the six beta cities. Islamabad first: it is the deepest. */
export const CITY_ORDER: readonly CitySlug[] = [
  "islamabad",
  "karachi",
  "lahore",
  "peshawar",
  "faisalabad",
  "rawalpindi",
];

/** `/stays-in-{slug}` for a beta city. */
export const cityHref = (slug: CitySlug): string => `/stays-in-${slug}`;
