import { ListingPage } from "@/components/listing/listing-page";
import { gardenGuestHouseNearKohsar } from "@/lib/content/listings/garden-guest-house-near-kohsar";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * GW-004 instance — `/stays-in-islamabad/f-6/garden-guest-house-near-kohsar`.
 *
 * Same two shared-component defects as its F-6 sibling: the map substrate in
 * `listing-location.tsx` and the `F7_STAYS` rail in `listing-nearby.tsx` both
 * hard-code F-7. Neither is this route's to change; both are reported.
 *
 * The registry row for this path is still `stub()`, so the page serves
 * `noindex, follow` until it is flipped to `page()` centrally.
 */
export const metadata = pageMetadata(
  gardenGuestHouseNearKohsar.path,
  gardenGuestHouseNearKohsar.metaDescription,
);

export default function GardenGuestHouseNearKohsarPage() {
  return <ListingPage listing={gardenGuestHouseNearKohsar} />;
}
