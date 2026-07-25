import { StayRail } from "@/components/stays/stay-rail";
import { shell } from "@/components/discovery/shell";
import { F7_STAYS } from "@/lib/content/featured-stays";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Nearby stays — the last block, and the page's route back into supply.
 *
 * It is a `StayRail`, not the card's three-up grid. The rail is the site's one
 * inventory component: same cards on the homepage, the city pages, the area
 * page and here, so a visitor who has already scrolled one recognises this one.
 * A bespoke grid on the deepest page in the tree would be a fourth listing-tile
 * family for no gain.
 *
 * The homes are the F-7 area page's OWN six, projected through the shared
 * mapper, minus this listing — so "nearby" cannot contain the page you are
 * standing on, and cannot drift from the sector page one level up. Five homes
 * across a rail that holds six is the honest supply in this sector today.
 *
 * `newChip` is OFF. Every listing in the beta is pre-review, so all five cards
 * would carry the identical chip, and five identical badges in one row rank
 * nothing — they are wallpaper. The chip earns its place where it is explained:
 * once, against this page's own H1, with the paragraph beside it that says what
 * it means. The area page keeps its chips because it ships a supply note under
 * the rail doing the same job.
 *
 * No `priority` image here: the mosaic hero is the page's LCP element, and a
 * second eager fetch below the fold would only compete with it for the same
 * connection.
 *
 * The eyebrow the card draws above this heading ("Also in this sector") is
 * gone. §7 and §11.20: `overline` is a form-label token, there are zero section
 * eyebrows anywhere on this site, and the heading already says what the block
 * is.
 */
export function ListingNearby({ listing }: { readonly listing: ListingContent }) {
  const stays = F7_STAYS.filter((s) => s.href !== listing.nearby.excludeHref);

  return (
    <section className={`${shell} border-t border-hairline py-10 md:py-12`}>
      <StayRail
        heading={listing.nearby.heading}
        headingId="nearby-h"
        stays={stays}
        viewAll={{ href: listing.place.areaHref, label: "All stays in F-7" }}
        newChip={false}
      />
    </section>
  );
}

export default ListingNearby;
