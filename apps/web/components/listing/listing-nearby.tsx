import { StayRail } from "@/components/stays/stay-rail";
import { shell } from "@/components/discovery/shell";
import { fromStayCard } from "@/lib/content/featured-stays";
import { blueAreaIslamabad } from "@/lib/content/areas/blue-area-islamabad";
import { e7Islamabad } from "@/lib/content/areas/e7-islamabad";
import { f6Islamabad } from "@/lib/content/areas/f6-islamabad";
import { f7Islamabad } from "@/lib/content/areas/f7-islamabad";
import { f8Islamabad } from "@/lib/content/areas/f8-islamabad";
import type { AreaContent } from "@/lib/content/areas/types";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Area page → its own homes, keyed by the path a listing already carries in
 * `place.areaHref`.
 *
 * This rail read `F7_STAYS` unconditionally until 2026-07-26. That was correct
 * while F-7 held the only listing; the moment nine more shipped across four
 * other areas, an F-6 page offered five F-7 homes as "nearby" under a heading
 * naming F-6. Deriving from the area page keeps this block and the sector page
 * one level up reading the same supply — which is what the doc below already
 * claimed, and now is true for every area rather than one.
 */
const AREA_BY_HREF: Readonly<Record<string, AreaContent>> = {
  [f7Islamabad.path]: f7Islamabad,
  [f6Islamabad.path]: f6Islamabad,
  [f8Islamabad.path]: f8Islamabad,
  [e7Islamabad.path]: e7Islamabad,
  [blueAreaIslamabad.path]: blueAreaIslamabad,
};

/**
 * Nearby stays — the last block, and the page's route back into supply.
 *
 * It is a `StayRail`, not the card's three-up grid. The rail is the site's one
 * inventory component: same cards on the homepage, the city pages, the area
 * page and here, so a visitor who has already scrolled one recognises this one.
 * A bespoke grid on the deepest page in the tree would be a fourth listing-tile
 * family for no gain.
 *
 * The homes are THIS listing's own area page's homes, projected through the
 * shared mapper, minus this listing — so "nearby" cannot contain the page you
 * are standing on, and cannot drift from the sector page one level up. However
 * many that leaves is the honest supply in that sector today; an area with none
 * left renders no rail at all.
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
  const area = AREA_BY_HREF[listing.place.areaHref];
  // No area content means no honest "nearby" — render nothing rather than
  // another area's homes (§12: fewer cells, never invented ones).
  if (!area) return null;

  const stays = area.stays.items
    .map((stay) => fromStayCard(stay, `${listing.place.areaLabel}, ${listing.place.cityLabel}`))
    .filter((s) => s.href !== listing.nearby.excludeHref);
  if (stays.length === 0) return null;

  return (
    <section className={`${shell} border-t border-hairline py-10 md:py-12`}>
      <StayRail
        heading={listing.nearby.heading}
        headingId="nearby-h"
        stays={stays}
        viewAll={{
          href: listing.place.areaHref,
          // Was the literal "All stays in F-7" while the href already followed
          // the listing's own area — so every F-6, F-8, E-7 and Blue Area page
          // shipped a label naming a sector it was not in, pointing at one it was.
          label: `All stays in ${listing.place.areaLabel}`,
        }}
        newChip={false}
      />
    </section>
  );
}

export default ListingNearby;
