import { ListingPage } from "@/components/listing/listing-page";
import { margallaViewApartment } from "@/lib/content/listings/margalla-view-apartment";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 — `/stays-in-islamabad/e-7/margalla-view-apartment`, the page that
 * owns the money query "Margalla View Apartment E-7 Islamabad". The area page
 * (GW-003) owns "stays in E-7, Islamabad" and the city page (GW-002) owns
 * "stays in Islamabad"; this page never competes for either.
 *
 * It also does not compete with `/stays-in-islamabad/f-7/is-f7-2bed`, which
 * carries a home of the SAME NAME in another sector. Both titles are normalised
 * with their area — "Margalla View Apartment — E-7, Islamabad" here, "— F-7,
 * Islamabad" there — which is the §3.4 uniqueness guard doing exactly the job
 * it exists for, and the two pages describe two different homes throughout.
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
 * and the SEO contract in `lib/content/listings/margalla-view-apartment.ts`.
 */
export const metadata = pageMetadata(
  margallaViewApartment.path,
  margallaViewApartment.metaDescription,
);

export default function MargallaViewApartmentE7Page() {
  return <ListingPage listing={margallaViewApartment} />;
}
