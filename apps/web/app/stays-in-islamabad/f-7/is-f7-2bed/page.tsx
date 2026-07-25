import { ListingPage } from "@/components/listing/listing-page";
import { isF72Bed } from "@/lib/content/listings/is-f7-2bed";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 — `/stays-in-islamabad/f-7/is-f7-2bed`, the page that owns the money
 * query "Margalla View Apartment F-7 Islamabad" (G69 owner map). The area page
 * (GW-003) owns "stays in F-7, Islamabad" and the city page (GW-002) owns
 * "stays in Islamabad"; this page never competes for either.
 *
 * A literal route folder, one per listing, for the same reason the city and
 * area routes are literal: a `[slug]` segment under an area would generate a
 * route for every string typed after it, and an indexable URL for a listing
 * that does not exist is worse than a 404. The route folder IS the decision
 * that this home is live and indexable, recorded in the filesystem where it can
 * be reviewed.
 *
 * On the route shape: the shipped app corpus deep-links `/rooms/is-f7-2bed`
 * (31 references) while SEO-RULES §3.4 fixes the indexable path as
 * `/stays-in-{city}/{area}/{slug}`. This page is the §3.4 path carrying the
 * corpus's stable slug, and it is the ONLY indexable URL for this home; the
 * `/rooms/…` form belongs to the app and redirects here (G5) once the redirect
 * registry lands. Nothing here publishes a second indexable URL for one home.
 *
 * Everything else lives in the template: layout in `components/listing/*`, copy
 * and the SEO contract in `lib/content/listings/is-f7-2bed.ts`.
 */
export const metadata = pageMetadata(isF72Bed.path, isF72Bed.metaDescription);

export default function MargallaViewApartmentPage() {
  return <ListingPage listing={isF72Bed} />;
}
