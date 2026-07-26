import { ListingPage } from "@/components/listing/listing-page";
import { businessStudioJinnahAvenue } from "@/lib/content/listings/business-studio-jinnah-avenue";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 — `/stays-in-islamabad/blue-area/business-studio-jinnah-avenue`, the
 * page that owns the money query "business studio Jinnah Avenue Islamabad".
 * The area page (GW-003) owns "stays in Blue Area, Islamabad" and the city page
 * (GW-002) owns "stays in Islamabad"; this page never competes for either.
 *
 * The one listing in the Islamabad set serving BUSINESS-stay intent rather than
 * residential. That is also why its area page is the strongest of the four on
 * the independent-intent test: "stays in Blue Area" is a query the three sector
 * pages do not compete for, and this home is the supply behind it.
 *
 * A literal route folder, one per listing: a `[slug]` segment under an area
 * would mint a route for every string typed after it, and an indexable URL for
 * a listing that does not exist is worse than a 404. The folder IS the decision
 * that this home is live, recorded where it can be reviewed.
 *
 * The registry row is still `stub()` as this folder lands, deliberately: the
 * folder shadows `app/[...registered]` immediately so the page renders, while
 * `pageMetadata` keeps emitting `noindex,follow` off the stub row until the ten
 * listing rows are flipped to `page()` together. One agent owns that file.
 *
 * Everything else lives in the template: layout in `components/listing/*`, copy
 * and the SEO contract in
 * `lib/content/listings/business-studio-jinnah-avenue.ts`.
 */
export const metadata = pageMetadata(
  businessStudioJinnahAvenue.path,
  businessStudioJinnahAvenue.metaDescription,
);

export default function BusinessStudioJinnahAvenuePage() {
  return <ListingPage listing={businessStudioJinnahAvenue} />;
}
