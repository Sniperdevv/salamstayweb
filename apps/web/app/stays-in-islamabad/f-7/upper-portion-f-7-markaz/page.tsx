import { ListingPage } from "@/components/listing/listing-page";
import { upperPortionF7Markaz } from "@/lib/content/listings/upper-portion-f-7-markaz";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 instance — `/stays-in-islamabad/f-7/upper-portion-f-7-markaz`.
 *
 * A literal route folder, like every other listing: a `[slug]` segment under an
 * area would mint an indexable URL for every string typed after it, and the
 * folder IS the recorded decision that this home is live.
 *
 * The route is still a `stub()` row in `lib/seo/route-registry.ts`, so
 * `pageMetadata` serves this page `noindex, follow` and no canonical until that
 * row is flipped to `page()` centrally. Next prefers this literal route over
 * `app/[...registered]`, so the page renders now; only its robots line waits.
 */
export const metadata = pageMetadata(
  upperPortionF7Markaz.path,
  upperPortionF7Markaz.metaDescription,
);

export default function UpperPortionF7MarkazPage() {
  return <ListingPage listing={upperPortionF7Markaz} />;
}
