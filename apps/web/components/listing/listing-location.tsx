import Link from "next/link";
import { Num } from "@/components/numerals";
import { ArrowRightIcon } from "@/components/icons";
import { sectionH2 } from "@/components/discovery/shell";
import { focusRing } from "@/components/ui";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { anchorOffset, listingLink, listingPara, listingSection } from "./shell";

/**
 * Where you'll be — the approximate-area map, the privacy note, and three ways
 * further into the site.
 *
 * **The map shows an area, never an address.** The dashed circle is the
 * published privacy radius around the home's own sector centroid, and it is the
 * SAME centroid the page's `LodgingBusiness.geo` publishes. The exact address
 * is shared once a booking is confirmed, and nothing on this page or in its
 * structured data narrows it further. The note under the map says so in the
 * host's terms rather than the platform's.
 *
 * **A static SVG substrate, not a tile embed.** No third-party map script on an
 * indexable page: it would cost a render-blocking connection, a cookie banner
 * and an LCP for a picture of five roads. The substrate is drawn from the
 * card's own path data, in token colours that flip with the theme, and it
 * carries `role="img"` with the card's `aria-label` verbatim so a screen reader
 * gets the same information a sighted reader does.
 *
 * **`radius.lg`, hairline, no shadow.** §4: 12px is the media radius. §1: the
 * map does not float over anything, so it casts nothing.
 *
 * **"Approximate area" is a badge pill over media** (§10) — OPAQUE canvas fill,
 * `rounded-full`, 14/600 ink, `elevation.onMedia`, 16px inset. Opaque and
 * shadowed rather than translucent, because §9 forbids degrading what is
 * underneath even when what is underneath is a drawing.
 */

const mapTag =
  "absolute bottom-4 left-4 inline-flex items-center rounded-full bg-canvas px-3 py-1 text-bodySm font-semibold text-primary shadow-on-media";

/**
 * Where the three names sit on the substrate above: beside the vertical road,
 * right of it below the minor cross-street, and out on the horizontal road.
 * The positions are properties of the drawing, so they live here; the names are
 * properties of the home, so they live in its content file.
 */
const LABEL_ANCHORS = [
  [316, 112],
  [596, 242],
  [20, 272],
] as const;

export function ListingLocation({ listing }: { readonly listing: ListingContent }) {
  const { location } = listing;

  return (
    <section
      id="location"
      aria-labelledby="where-h"
      className={`${listingSection} ${anchorOffset}`}
    >
      <h2 id="where-h" className={sectionH2}>
        {location.heading}
      </h2>
      <p className={`mt-2 ${listingPara}`}>
        <Num>{location.sub}</Num>
      </p>

      <div className="relative mt-5 overflow-hidden rounded-lg border border-hairline bg-sunken">
        <svg
          viewBox="0 0 800 350"
          role="img"
          aria-label={location.mapAlt}
          className="block aspect-[16/7] w-full"
        >
          <path d="M0 250 H800" className="fill-none stroke-border-default" strokeWidth={7} />
          <path d="M300 0 V350" className="fill-none stroke-border-default" strokeWidth={7} />
          <path d="M0 120 H800" className="fill-none stroke-hairline" strokeWidth={4} />
          <path d="M560 0 V350" className="fill-none stroke-hairline" strokeWidth={4} />
          <path d="M140 0 V350" className="fill-none stroke-hairline" strokeWidth={4} />
          <circle
            cx={400}
            cy={170}
            r={86}
            className="fill-raised stroke-border-strong"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          {/* The three map labels STAY at `caption` (12). §7's ladder governs
              copy a reader reads a line of; these are cartography — names
              placed on a drawing, sized to sit inside it without covering the
              roads they name, and read at a glance rather than in sequence.
              The whole substrate also carries `role="img"` with the card's
              aria-label, so nothing here is the only route to any fact.

              The NAMES come from the listing; only the anchors are fixed. They
              were hard-coded to F-7's landmarks until 2026-07-26, which was
              true while F-7 held the only listing and became a lie the moment
              an F-8 home drew a map captioned "F-7 Markaz". The substrate is
              a schematic either way — what makes it honest is that it names
              the sector the home is actually in. */}
          {LABEL_ANCHORS.map(([x, y], i) => (
            <text key={x} x={x} y={y} className="fill-secondary text-caption">
              {location.mapLabels[i]}
            </text>
          ))}
        </svg>
        <span className={mapTag}>{location.mapTag}</span>
      </div>

      <p className={`mt-4 ${listingPara}`}>
        <Num>{location.privacy}</Num>
      </p>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
        {location.links.map((l) => (
          <Link key={l.href + l.label} href={l.href} className={`${listingLink} ${focusRing}`}>
            {l.label}
            <ArrowRightIcon className="size-4" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ListingLocation;
