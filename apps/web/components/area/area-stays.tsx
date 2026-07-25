import { StayRail } from "@/components/stays/stay-rail";
import { fromStayCard } from "@/lib/content/featured-stays";
import type { AreaContent } from "@/lib/content/areas/types";
import { shell, rhythm } from "./area-shell";

/**
 * Stays in {area} — the rail, and the second thing on the page.
 *
 * v1 drew this as `StayGrid`: six 4:3 reading tiles with attribute pills and a
 * price row, three across, under a section eyebrow, a heading and a two-line
 * intro, as the THIRD block on the page — behind "About F-7". It filled two
 * screens and it arrived after a screen and a half of prose about a sector the
 * reader had already chosen. The rail is the same six homes at browsing scale
 * — near-square photograph, name, sector, price line — six across at this
 * shell's width, arriving directly under the H1.
 *
 * On the block order: SEO-RULES §3.3 lists the required blocks as
 * "intro → local context → listings in-area → practical notes → parent-city
 * link", and this page draws context AFTER the listings. Every required block
 * is still present, still above the FAQ, and every sample verbatim H2 §3.3
 * names is unchanged; what moved is the order of two adjacent blocks, under
 * the founder-ordered redesign whose whole thesis is that inventory leads.
 * §3.2 lists the same pair in the same order for city pages and Phase 3
 * already shipped the inversion there, so this is the precedent applied one
 * level down rather than a new liberty.
 *
 * `priority` marks the first card only: it is the LCP element now that the
 * typographic hero is gone, and a second priority image on the page would only
 * compete with it for the same connection.
 *
 * `newChip` is ON here, and this is the one surface on the site that explains
 * why. The chip means one checkable thing — this home has no published two-way
 * review — and pre-launch that is true of every listing, so six chips in a row
 * are six true statements rather than a ranking. The supply note sits directly
 * under the rail it explains, which is the whole reason the chip is on: the
 * homepage turns it off because four rails of chips with no note is wallpaper.
 *
 * The projection through `fromStayCard` carries "F-7, Islamabad" as the card's
 * place line rather than the fixture's `location` ("Entire apartment · 2
 * bedrooms · 6 guests"), so a home rendered here and the same home rendered in
 * the homepage's F-7 rail cannot drift.
 */
export function AreaStays({ area }: { readonly area: AreaContent }) {
  const { stays } = area;
  const place = `${area.name}, ${area.cityName}`;

  return (
    <div className={`${shell} ${rhythm}`}>
      <StayRail
        heading={stays.heading}
        headingId="stays-h"
        stays={stays.items.map((s) => fromStayCard(s, place))}
        viewAll={{ href: stays.viewAll.href, label: stays.viewAll.label }}
        newChip
        priority
      />

      {/* The `.supplynote`, under the rail rather than under a grid: it
          explains the chip drawn eight pixels above it, and a reader who never
          scrolls past the rail has still read it. */}
      <p className="mt-4 max-w-[76ch] text-caption text-tertiary">{stays.note}</p>
    </div>
  );
}

export default AreaStays;
