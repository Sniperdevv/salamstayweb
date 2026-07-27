import { f7Islamabad } from "@/lib/content/areas/f7-islamabad";
import { islamabad } from "@/lib/content/cities/islamabad";
import { fromStayCard, type FeaturedStay } from "@/lib/content/featured-stays";
import type { StayCardContent } from "@/lib/content/stays";

/**
 * The one worked wishlist — the record `/wishlists/{slug}` renders, and the
 * only slug that route answers on.
 *
 * `lib/booking/trip-record.ts` is the shipped precedent for this file's whole
 * shape: one fixture, one id, one `is…Id` guard, and the page 404s on everything
 * else (`GUEST-SHELL.md` §12's cold deep-link rule — *"a surface keyed to a
 * record that does not exist refuses to render"*).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE HOMES ARE REAL. THE LIST AROUND THEM IS NOT.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every entry below is a home that already ships on this site, with its own
 * registered listing route, its own photograph from the image manifest, and its
 * own attribute pair read off its own content module. **Nothing here is a home,
 * a photograph, a price or an attribute invented for a wishlist to have
 * something to hold.** §14's bar, and TASTE §12's: steal the layout, never the
 * content.
 *
 * The cards are pulled from the two shipped `StayCardContent` sets rather than
 * re-typed, so a home cannot say one thing on `/stays-in-islamabad` and a
 * different thing in a saved list. The mapper is `fromStayCard`, the same one
 * the homepage rails and `/search` use — which also means the compact card's
 * **price row stays a skeleton** here, exactly as it does everywhere else: no
 * nightly price is published for these homes, and §12/TASTE §12 rule that null
 * money is a `backgrounds.skeleton` bar or nothing, never a dash and never a
 * number somebody made up. `ga-102` draws `PKR 14,200 / night` on every card;
 * that is the single largest thing this file refuses to carry forward.
 *
 * WHY THESE FIVE. They are five real Islamabad homes across three sectors —
 * F-7, F-8 and F-6 — which is what a list called "Islamabad in August" would
 * plausibly hold, and which shows the grid doing the one thing a wishlist grid
 * does that a city rail does not: mixing sectors. Each has a distinct frame
 * (`LISTING_THUMBS` gives one photograph per listing, and no two of these five
 * share one), and no two neighbours carry the same attribute pair.
 *
 * WHY THE AREA IS PASSED EXPLICITLY. `fromStayCard` falls back to the card's own
 * `location`, and the two source sets fill that field differently on purpose —
 * a city page puts the sector there ("F-8, Islamabad"), an area page puts the
 * home's shape and capacity ("Entire apartment · 2 bedrooms · 6 guests"). A
 * saved list spans sectors, so the sector is the line that earns its place;
 * `f7Islamabad`'s own rail passes "F-7, Islamabad" for exactly this reason.
 */

/**
 * The slug, and the ONE value `isExampleWishlistSlug` accepts.
 *
 * It has to be registered in `lib/seo/route-registry.ts` before this route can
 * render a legal page: `pageMetadata` throws on a path it cannot find, and G41
 * compares the served `<title>` to the registry entry byte for byte.
 */
export const EXAMPLE_WISHLIST_SLUG = "islamabad-in-august";

/** One expression, so no call site spells the path a second way. */
export const wishlistPath = (slug: string = EXAMPLE_WISHLIST_SLUG): string =>
  `/wishlists/${slug}`;

/**
 * The refusal, asked on the SERVER in both `generateMetadata` and the route
 * body — so an unknown slug never emits a byte of wishlist document.
 */
export const isExampleWishlistSlug = (slug: string): boolean =>
  slug === EXAMPLE_WISHLIST_SLUG;

/**
 * Every shipped card object for an Islamabad home, indexed by its listing route.
 *
 * Two sets, because the five below are split across them: `is-f7-2bed`,
 * `cedar-lodge-f7` and `family-portion-jinnah-super` are drawn by the F-7 area
 * page, `quiet-family-home-f-8-markaz` and `garden-guest-house-near-kohsar` by
 * the Islamabad city page. `central-studio-by-jinnah-super` appears in both and
 * is the same home either way; the later write wins and nothing reads it.
 *
 * A home with `href: null` has no listing page and is dropped rather than keyed
 * under an empty string — a saved home that cannot be opened is not a home this
 * list can hold.
 */
const CARD_BY_HREF: ReadonlyMap<string, StayCardContent> = new Map(
  [...islamabad.stays.items, ...f7Islamabad.stays.items].flatMap((stay) =>
    stay.href === null ? [] : [[stay.href, stay] as const],
  ),
);

/** Listing route → the sector line the card draws under the name. */
const SAVED: readonly { readonly href: string; readonly area: string }[] = [
  { href: "/stays-in-islamabad/f-7/is-f7-2bed", area: "F-7, Islamabad" },
  { href: "/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz", area: "F-8, Islamabad" },
  { href: "/stays-in-islamabad/f-7/cedar-lodge-f7", area: "F-7, Islamabad" },
  { href: "/stays-in-islamabad/f-6/garden-guest-house-near-kohsar", area: "F-6, Islamabad" },
  { href: "/stays-in-islamabad/f-7/family-portion-jinnah-super", area: "F-7, Islamabad" },
];

/**
 * Resolved at module load, so a home renamed or removed from its city page
 * fails the BUILD rather than rendering a wishlist with a hole in it. Same
 * discipline as `pageMetadata` throwing on an unregistered path.
 */
const STAYS: readonly FeaturedStay[] = SAVED.map(({ href, area }) => {
  const card = CARD_BY_HREF.get(href);
  if (card === undefined) {
    throw new Error(`Example wishlist references a home with no shipped card: ${href}`);
  }
  return fromStayCard(card, area);
});

export interface ExampleWishlist {
  readonly slug: string;
  /** The list's name — the page's `<h1>`. */
  readonly name: string;
  /**
   * The one line a guest writes under the name (`ga-126`'s `.wsub`,
   * `ga-102`'s `.dsub`).
   *
   * `ga-126` writes "For the family Eid trip". `REPOSITIONING.md` retires the
   * observance vocabulary from the product outright — *"Eid-week policy"* is on
   * the removal list — and this string is written by SalamStay, not by a guest,
   * so it is ours to keep off the surface. What survives is the part that was
   * doing the work: the list is for a family, and it needs room.
   */
  readonly description: string;
  readonly stays: readonly FeaturedStay[];
}

export const EXAMPLE_WISHLIST: ExampleWishlist = {
  slug: EXAMPLE_WISHLIST_SLUG,
  name: "Islamabad in August",
  description: "Homes with room for everyone.",
  stays: STAYS,
};
