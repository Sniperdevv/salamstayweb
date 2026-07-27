import { Fragment } from "react";
import Link from "next/link";
import { Num, Phrase } from "@/components/numerals";
import { PinIcon } from "@/components/icons";
import { inlineAction, focusRing } from "@/components/ui";
import { shell } from "@/components/discovery/shell";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";

/**
 * Title block — the page's single `<h1>`, the "New listing" chip, and one meta
 * line. Three elements, and that is the whole block.
 *
 * **The H1 is the title, byte-identical.** "Margalla View Apartment — F-7,
 * Islamabad", normalised with its area because a SECOND "Margalla View
 * Apartment" exists in E-7; two listings sharing an H1 and a `<title>` is
 * exactly what the §3.4 uniqueness guard forbids. `<title>` reads the route
 * registry and the H1 reads the content object, and the two strings are
 * required to match — the validator's G41/G43 pair is what holds them together.
 *
 * It is also isolated (§12), like everything else on the page and unlike itself
 * until now: the meta line under it wrapped its digit runs from the first
 * commit while the heading with "F-7" in it did not, which is precisely the run
 * somebody forgets that `numerals.tsx` is written against. `Num` re-emits every
 * character in order, so the H1's `textContent` is the registry string byte for
 * byte and G41/G43 read what they read before. The area and city labels beneath
 * are wrapped for the same reason — they are the same place-name field, and one
 * of the two carries a sector.
 *
 * **"New listing", not a rating.** This is the whole social-proof treatment on
 * this page: no stars, no score, no review count, no "Guest favourite", no
 * Reviews H2, and no AggregateRating in schema. Zero real reviews exist, so
 * anything else would be invented (§12), and inventing one on an INDEXABLE page
 * is a hard structured-data failure rather than a taste problem. The chip means
 * one checkable thing: no two-way review has been published for this home.
 *
 * Treatment: the §10 badge pill minus its shadow AND minus its glyph. It sits
 * on the canvas rather than on a photograph, and §1 is the reason the shadow
 * goes — a chip on white is not floating over anything, so it casts nothing.
 * The `bg.raised` fill and the 14/600 INK label are the badge's own; brand
 * green is not available to a status chip (§2 spends it on four roles, and this
 * is not one of them).
 *
 * **The meta line is inline flow, never flex.** A flex row with a gap splits
 * the bare text runs between the links, and "F-7, Islamabad" arrives as two
 * words with a hole in the middle. The `·` is one per gap, spaces both sides,
 * never chained (§7). Each fact is `whitespace-nowrap` so a narrow viewport
 * breaks BETWEEN facts and never inside one — at 375 the line otherwise wraps
 * after "6" and orphans "guests" onto the next row.
 *
 * The H1 wraps to two lines at 375 and opens line two with the title's em-dash.
 * Both fixes for that were measured and both cost more than they buy:
 * `text-wrap: balance` optimises for equal line LENGTHS and picked three short
 * lines, and binding the dash to "Apartment" with a no-break space makes a
 * 25-character unbreakable run that does not fit 343px either — also three
 * lines. Two full lines with a leading dash beats three ragged ones, and the
 * string itself is registry-fixed (G41 compares it byte for byte), so it is not
 * ours to reword. Left as the greedy algorithm sets it.
 */

/**
 * Text only — no glyph (closing review).
 *
 * The card's sparkle was decoration standing next to the two words that already
 * say the thing. §11.20 puts the site's decoration budget at zero, and a chip
 * whose whole content is "New listing" needs no icon to be read as a chip: the
 * pill shape and the `bg.raised` fill are the container, and the label is the
 * information. The compact stay card keeps its glyph because its chip sits over
 * a photograph, where the mark is doing legibility work this one is not.
 */
const chip =
  "inline-flex shrink-0 items-center rounded-full bg-raised px-3 py-1 text-bodySm font-semibold text-primary";

export function ListingTitle({ listing }: { readonly listing: ListingContent }) {
  const { place } = listing;

  return (
    <div className={`${shell} pt-6 md:pt-8`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-h3 font-semibold text-primary">
          <Num>{listing.title}</Num>
        </h1>
        <span className={chip}>{listing.newChip}</span>
      </div>

      <p className="mt-3 text-bodySm leading-relaxed text-secondary">
        <PinIcon className="mr-2 inline size-4 align-[-3px] text-tertiary" />
        {/*
          A17: seven isolates on one line — two place links and five facts, each
          carrying digits — and under RTL the whole line ran backwards:
          `2 baths · 3 beds · 2 bedrooms · 6 guests · Entire apartment ·
          Islamabad, F-7`. This is the site's most-linked indexable page and the
          line under its H1, so the isolate wraps the entire meta line.
        */}
        <Phrase>
          <Link href={place.areaHref} className={` `}>
            <Num>{place.areaLabel}</Num>
          </Link>
          {", "}
          <Link href={place.cityHref} className={` `}>
            <Num>{place.cityLabel}</Num>
          </Link>
          {place.facts.map((fact) => (
            <Fragment key={fact}>
              {" "}
              <span className="whitespace-nowrap">
                <span className="text-border-strong">&middot;</span> <Num>{fact}</Num>
              </span>
            </Fragment>
          ))}
        </Phrase>
      </p>
    </div>
  );
}

export default ListingTitle;
