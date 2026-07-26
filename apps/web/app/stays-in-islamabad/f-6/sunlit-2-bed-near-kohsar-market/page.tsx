import { ListingPage } from "@/components/listing/listing-page";
import { sunlit2BedNearKohsarMarket } from "@/lib/content/listings/sunlit-2-bed-near-kohsar-market";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 instance — `/stays-in-islamabad/f-6/sunlit-2-bed-near-kohsar-market`,
 * and the first listing page on the site outside F-7.
 *
 * Two shared components still hard-code F-7 and render wrong here until they
 * are fixed centrally: `listing-location.tsx` draws "F-7 Markaz / Jinnah Super
 * / Margalla Road" as literal <text> nodes in the map substrate, and
 * `listing-nearby.tsx` imports `F7_STAYS` and labels its view-all "All stays in
 * F-7" while pointing it at this page's own F-6 area href. Neither is this
 * route's to change; both are reported.
 *
 * The registry row for this path is still `stub()`, so the page serves
 * `noindex, follow` until it is flipped to `page()` centrally.
 */
export const metadata = pageMetadata(
  sunlit2BedNearKohsarMarket.path,
  sunlit2BedNearKohsarMarket.metaDescription,
);

export default function Sunlit2BedNearKohsarMarketPage() {
  return <ListingPage listing={sunlit2BedNearKohsarMarket} />;
}
