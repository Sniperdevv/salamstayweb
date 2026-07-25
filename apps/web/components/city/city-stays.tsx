import { StayRail } from "@/components/stays/stay-rail";
import { fromStayCard } from "@/lib/content/featured-stays";
import type { CityContent } from "@/lib/content/cities/types";
import { shell, rhythm } from "@/components/discovery/shell";

/**
 * Featured stays — the rail, and the second thing on the page.
 *
 * v1 drew this as `StayGrid`: six 4:3 reading tiles with attribute pills and a
 * price row, three across, under a section eyebrow, a heading and a two-line
 * intro. It was the fourth block on the page and it filled two screens. The
 * rail is the same six homes at browsing scale — near-square photograph, name,
 * sector, price line — six across at this shell's width, arriving directly
 * under the H1.
 *
 * `priority` marks the first card only: it is the LCP element now that the
 * hero photograph is gone, and a second priority image on the page would only
 * compete with it for the same connection.
 *
 * `newChip` is on. The chip means one checkable thing — this home has no
 * published two-way review — and pre-launch that is true of every listing, so
 * six chips in a row are six true statements rather than a ranking. The
 * homepage turns it off on its second, third and fourth rails because four
 * rails of chips is wallpaper; one rail is not.
 *
 * The projection through `fromStayCard` is the mapper the homepage rails use,
 * so a home rendered here and the same home rendered on `/` cannot drift.
 */
export function CityStays({ city }: { readonly city: CityContent }) {
  const { stays } = city;

  return (
    <div className={`${shell} ${rhythm}`}>
      <StayRail
        heading={stays.heading}
        headingId="stays-h"
        stays={stays.items.map((s) => fromStayCard(s))}
        viewAll={{ href: stays.viewAll.href, label: stays.viewAll.label }}
        newChip
        priority
      />
    </div>
  );
}

export default CityStays;
