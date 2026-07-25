/**
 * Featured-stay fixtures for the inventory-first rails — six named homes per
 * beta city, in rail order.
 *
 * Why this file exists: the redesign leads with inventory, so a homepage or a
 * city landing needs six real card objects per city before it can render a
 * rail. The city and area templates already hold their own card data; this
 * collection does NOT duplicate it. Islamabad is the exact `StayCardContent`
 * objects the Islamabad city page ships, and `F7_STAYS` is the exact set the
 * F-7 area page ships, both re-projected into the compact card's shape by one
 * mapper. Only the five template cities, which have no content file yet, get
 * fresh objects here.
 *
 * Rules this file enforces by construction:
 * - Every `href` resolves in `lib/seo/route-registry.ts` (G37). Islamabad's six
 *   point at registered listing stubs because those routes exist. The other
 *   five cities point at their own `/stays-in-{city}` landing, because minting
 *   `/stays-in-karachi/clifton/…` here would emit links to routes the router
 *   cannot serve. When listing routes land, only the `href` changes.
 * - Photography is an `ImageId` off `CITY_STAY_CARDS`, in the manifest's own
 *   card order, so each city keeps the frames the manifest already assigned it
 *   and no two cities share a frame on one page.
 * - No price, no rating, no review count, no "N stays" tally. Pre-launch none
 *   of those numbers exists, and the card has no slot for them.
 *
 * On `isNew`: the chip means "no two-way review has been published for this
 * home yet". Pre-launch that is true of every listing, so every entry carries
 * `true` and none of them is claiming to be newer than its neighbour. It is a
 * per-stay flag rather than a page switch so the first home to earn a review
 * can drop its chip without the others changing. `StayCardCompact` also takes a
 * page-level `newChip` gate for surfaces that would otherwise draw six
 * identical chips in a row.
 */

import { CITY_STAY_CARDS, type ImageId } from "@/lib/content/image-manifest";
import type { StayCardContent } from "@/lib/content/stays";
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
}

export type CitySlug =
  | "islamabad"
  | "karachi"
  | "lahore"
  | "peshawar"
  | "faisalabad"
  | "rawalpindi";

/**
 * Re-projects a shipped `StayCardContent` into the compact shape. The compact
 * card drops the attribute pills and the price row, so the mapper drops them
 * too rather than inventing a shorter version of either.
 */
export function fromStayCard(stay: StayCardContent): FeaturedStay {
  return {
    href: stay.href,
    name: stay.title,
    area: stay.location,
    image: stay.image,
    isNew: true,
  };
}

/** Islamabad — the six the city page already ships, verbatim. */
const ISLAMABAD_STAYS: readonly FeaturedStay[] = islamabad.stays.items.map(fromStayCard);

/**
 * F-7, Islamabad — the six the area page already ships, verbatim. Exported for
 * an area rail; not part of the six-city collection, since F-7 is a sector.
 */
export const F7_STAYS: readonly FeaturedStay[] = f7Islamabad.stays.items.map(fromStayCard);

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
  },
  {
    href: "/stays-in-karachi",
    name: "Quiet 1-bed near Bahadurabad",
    area: "Bahadurabad, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][1],
    isNew: true,
  },
  {
    href: "/stays-in-karachi",
    name: "Family portion in PECHS",
    area: "PECHS Block 6, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][2],
    isNew: true,
  },
  {
    href: "/stays-in-karachi",
    name: "Whole apartment in DHA Phase 5",
    area: "DHA Phase 5, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][3],
    isNew: true,
  },
  {
    href: "/stays-in-karachi",
    name: "Twin room in Gulshan-e-Iqbal",
    area: "Gulshan-e-Iqbal, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][4],
    isNew: true,
  },
  {
    href: "/stays-in-karachi",
    name: "Garden guest house in North Nazimabad",
    area: "North Nazimabad, Karachi",
    image: CITY_STAY_CARDS["/stays-in-karachi"][5],
    isNew: true,
  },
];

const LAHORE_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-lahore",
    name: "Studio near Liberty Market",
    area: "Gulberg III, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][0],
    isNew: true,
  },
  {
    href: "/stays-in-lahore",
    name: "Quiet 1-bed in Model Town",
    area: "Model Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][1],
    isNew: true,
  },
  {
    href: "/stays-in-lahore",
    name: "Family room near the Walled City",
    area: "Walled City, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][2],
    isNew: true,
  },
  {
    href: "/stays-in-lahore",
    name: "Whole portion in Johar Town",
    area: "Johar Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][3],
    isNew: true,
  },
  {
    href: "/stays-in-lahore",
    name: "Balcony flat in Garden Town",
    area: "Garden Town, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][4],
    isNew: true,
  },
  {
    href: "/stays-in-lahore",
    name: "Courtyard house in DHA Phase 5",
    area: "DHA Phase 5, Lahore",
    image: CITY_STAY_CARDS["/stays-in-lahore"][5],
    isNew: true,
  },
];

const PESHAWAR_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-peshawar",
    name: "City-centre flat in Saddar",
    area: "Saddar, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][0],
    isNew: true,
  },
  {
    href: "/stays-in-peshawar",
    name: "Warm 1-bed in Gulbahar",
    area: "Gulbahar, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][1],
    isNew: true,
  },
  {
    href: "/stays-in-peshawar",
    name: "Villa room in University Town",
    area: "University Town, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][2],
    isNew: true,
  },
  {
    href: "/stays-in-peshawar",
    name: "Whole portion in Hayatabad",
    area: "Hayatabad Phase 3, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][3],
    isNew: true,
  },
  {
    href: "/stays-in-peshawar",
    name: "Family apartment off Warsak Road",
    area: "Warsak Road, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][4],
    isNew: true,
  },
  {
    href: "/stays-in-peshawar",
    name: "Balcony 2-bed in Hayatabad",
    area: "Hayatabad Phase 6, Peshawar",
    image: CITY_STAY_CARDS["/stays-in-peshawar"][5],
    isNew: true,
  },
];

const FAISALABAD_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-faisalabad",
    name: "Studio near D Ground",
    area: "D Ground, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][0],
    isNew: true,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Quiet 1-bed in Madina Town",
    area: "Madina Town, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][1],
    isNew: true,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Single room in Peoples Colony",
    area: "Peoples Colony, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][2],
    isNew: true,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Whole portion on Susan Road",
    area: "Susan Road, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][3],
    isNew: true,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Family flat in Gulberg",
    area: "Gulberg, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][4],
    isNew: true,
  },
  {
    href: "/stays-in-faisalabad",
    name: "Upper portion near the Clock Tower",
    area: "Clock Tower, Faisalabad",
    image: CITY_STAY_CARDS["/stays-in-faisalabad"][5],
    isNew: true,
  },
];

const RAWALPINDI_STAYS: readonly FeaturedStay[] = [
  {
    href: "/stays-in-rawalpindi",
    name: "Whole flat in Satellite Town",
    area: "Satellite Town, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][0],
    isNew: true,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Quiet 1-bed in Bahria Town",
    area: "Bahria Town Phase 4, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][1],
    isNew: true,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Twin room in Chaklala Scheme 3",
    area: "Chaklala Scheme 3, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][2],
    isNew: true,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Plain 1-bed in Westridge",
    area: "Westridge, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][3],
    isNew: true,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Whole portion in DHA Phase 2",
    area: "DHA Phase 2, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][4],
    isNew: true,
  },
  {
    href: "/stays-in-rawalpindi",
    name: "Terrace apartment near Saddar",
    area: "Saddar, Rawalpindi",
    image: CITY_STAY_CARDS["/stays-in-rawalpindi"][5],
    isNew: true,
  },
];

/** Six named homes per beta city, in rail order. */
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
