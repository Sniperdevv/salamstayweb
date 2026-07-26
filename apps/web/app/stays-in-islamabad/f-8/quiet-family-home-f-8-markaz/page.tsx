import { ListingPage } from "@/components/listing/listing-page";
import { quietFamilyHomeF8Markaz } from "@/lib/content/listings/quiet-family-home-f-8-markaz";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 — `/stays-in-islamabad/f-8/quiet-family-home-f-8-markaz`, the page
 * that owns the money query "quiet family home F-8 Markaz Islamabad". The area
 * page (GW-003) owns "stays in F-8, Islamabad" and the city page (GW-002) owns
 * "stays in Islamabad"; this page never competes for either.
 *
 * A literal route folder, one per listing, for the same reason the city and
 * area routes are literal: a `[slug]` segment under an area would generate a
 * route for every string typed after it, and an indexable URL for a listing
 * that does not exist is worse than a 404. The route folder IS the decision
 * that this home is live, recorded in the filesystem where it can be reviewed.
 *
 * The registry row for this path is still `stub()` at the time this folder
 * lands, and that is deliberate: the folder shadows the `app/[...registered]`
 * catch-all immediately, so the page renders, while `pageMetadata` keeps
 * emitting `noindex,follow` off the stub row until the ten listing rows are
 * flipped to `page()` together. One agent owns that file.
 *
 * Everything else lives in the template: layout in `components/listing/*`, copy
 * and the SEO contract in
 * `lib/content/listings/quiet-family-home-f-8-markaz.ts`.
 */
export const metadata = pageMetadata(
  quietFamilyHomeF8Markaz.path,
  quietFamilyHomeF8Markaz.metaDescription,
);

export default function QuietFamilyHomeF8MarkazPage() {
  return <ListingPage listing={quietFamilyHomeF8Markaz} />;
}
