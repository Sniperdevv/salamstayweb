import { routeByPath } from "@/lib/seo/route-registry";
import type { ListingContent } from "./is-f7-2bed";

import { businessStudioJinnahAvenue } from "./business-studio-jinnah-avenue";
import { cedarLodgeF7 } from "./cedar-lodge-f7";
import { centralStudioByJinnahSuper } from "./central-studio-by-jinnah-super";
import { familyPortionJinnahSuper } from "./family-portion-jinnah-super";
import { gardenGuestHouseNearKohsar } from "./garden-guest-house-near-kohsar";
import { isF72Bed } from "./is-f7-2bed";
import { margallaViewApartment } from "./margalla-view-apartment";
import { quiet1BedStreet12 } from "./quiet-1-bed-street-12";
import { quietFamilyHomeF8Markaz } from "./quiet-family-home-f-8-markaz";
import { sunlit2BedNearKohsarMarket } from "./sunlit-2-bed-near-kohsar-market";
import { upperPortionF7Markaz } from "./upper-portion-f-7-markaz";

/**
 * Slug → listing. The lookup every dynamic route under `/book/{slug}` needs,
 * and the first one this codebase has had.
 *
 * WHY IT DID NOT EXIST UNTIL NOW
 * ------------------------------
 * Every indexable listing surface is a LITERAL route folder — `app/stays-in-
 * islamabad/f-7/is-f7-2bed/page.tsx` imports `isF72Bed` by name and that is the
 * whole resolution. That is deliberate (a `[slug]` segment under an area would
 * mint an indexable URL for any string a crawler typed), so no index was needed
 * and none was written. Checkout is the first route on the site with a genuine
 * dynamic segment, so it is the first thing that has to turn a string back into
 * a home.
 *
 * CARRIES NO REACT AND NO `"use client"`, on purpose: `app/book/[slug]/
 * layout.tsx` is a Server Component and hands the resolved `ListingContent`
 * straight to `BookingProvider` as a prop (see `lib/booking/booking-state.tsx`).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE SLUG IS DERIVED, NOT DECLARED
 * ---------------------------------
 * `ListingContent` carries `path` and no `slug` field, and a second field would
 * be a second thing to keep in step. The slug is the last segment of the
 * canonical path, which is exactly what SEO-RULES §3.4 fixes it as
 * (`/stays-in-{city}/{area}/{slug}`), so deriving it means a home cannot have
 * one slug in its URL and a different one in its checkout.
 *
 * THE BOOKABLE SET IS DERIVED TOO, AND FROM THE REGISTRY
 * -----------------------------------------------------
 * Eleven homes have content modules. **One of them can be booked**, because
 * `lib/seo/route-registry.ts` registers `/book/{slug}/{step}` for `is-f7-2bed`
 * alone — the other ten are resolver stubs whose bodies draw no Reserve
 * affordance, so nothing on the site links into their checkout.
 *
 * That set is read OUT of the registry rather than restated here. `pageMetadata`
 * throws on a path it cannot find (`lib/seo/metadata.ts`), and G41 compares the
 * served `<title>` to the registry's entry byte for byte, so a checkout route
 * that is not registered cannot render a legal page anyway. A hand-written
 * `BOOKABLE = ["is-f7-2bed"]` here would be a second list that goes stale the
 * moment a second home is registered — and it would go stale silently, as a
 * 404 on a home that is otherwise live. Registering the seven rows is therefore
 * the ONE act that opens a home's checkout, which is where that decision belongs.
 */

/** Every home with a content module, in filename order. */
const ALL: readonly ListingContent[] = [
  businessStudioJinnahAvenue,
  cedarLodgeF7,
  centralStudioByJinnahSuper,
  familyPortionJinnahSuper,
  gardenGuestHouseNearKohsar,
  isF72Bed,
  margallaViewApartment,
  quiet1BedStreet12,
  quietFamilyHomeF8Markaz,
  sunlit2BedNearKohsarMarket,
  upperPortionF7Markaz,
];

/**
 * The last segment of the canonical path — `is-f7-2bed`.
 *
 * Exported because the reverse direction is needed too: a rail row linking
 * "Change" back to `/book/{slug}/dates` has the listing in hand, not the slug.
 */
export function listingSlug(listing: ListingContent): string {
  return listing.path.slice(listing.path.lastIndexOf("/") + 1);
}

/** Slug → content, for all eleven homes. */
export const LISTING_BY_SLUG: ReadonlyMap<string, ListingContent> = new Map(
  ALL.map((listing) => [listingSlug(listing), listing]),
);

export function listingBySlug(slug: string): ListingContent | undefined {
  return LISTING_BY_SLUG.get(slug);
}

/**
 * The path a home's checkout begins at. One expression, so the layout, the
 * step routes and the rail's "Change" links cannot spell it three ways.
 */
export function checkoutHref(slug: string, step: string): string {
  return `/book/${slug}/${step}`;
}

/**
 * Slugs whose checkout is registered, and therefore whose `/book/{slug}/*`
 * routes may render. Derived; see the file note.
 */
export const BOOKABLE_SLUGS: readonly string[] = Array.from(LISTING_BY_SLUG.keys()).filter(
  (slug) => routeByPath.has(checkoutHref(slug, "dates")),
);

/**
 * The resolver every checkout route uses. `undefined` means "not a home this
 * build can take a booking for", and the caller answers with `notFound()` —
 * never with a rendered page for a home nobody registered.
 */
export function bookableListing(slug: string): ListingContent | undefined {
  const listing = listingBySlug(slug);
  if (listing === undefined) return undefined;
  return routeByPath.has(checkoutHref(slug, "dates")) ? listing : undefined;
}

/**
 * The home's name on its own — "Margalla View Apartment", not the `<title>`'s
 * "Margalla View Apartment — F-7, Islamabad".
 *
 * The last crumb is the source rather than a slice of `title`: the crumb array
 * is already the one place the visible trail and the `BreadcrumbList` agree
 * (G40), so its leaf is the name the site has decided this home has. Splitting
 * the title on a dash would break on the first home whose name contains one.
 */
export function listingName(listing: ListingContent): string {
  const leaf = listing.crumbs[listing.crumbs.length - 1];
  return leaf === undefined ? listing.title : leaf.name;
}

/**
 * "Entire apartment · F-7, Islamabad" — the rail's second identity line and the
 * mobile strip's, off the same three facts `gw-004`'s title block uses.
 */
export function listingPlaceLine(listing: ListingContent): string {
  const kind = listing.place.facts[0];
  const where = `${listing.place.areaLabel}, ${listing.place.cityLabel}`;
  return kind === undefined ? where : `${kind} · ${where}`;
}
