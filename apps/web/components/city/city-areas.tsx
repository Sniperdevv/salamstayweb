import Image from "next/image";
import Link from "next/link";
import { focusRing } from "@/components/ui";
import { LandmarkIcon } from "@/components/stays/icons";
import { image } from "@/lib/content/image-manifest";
import type { CityArea, CityContent } from "@/lib/content/cities/types";
import { shell, rhythm, sectionH2, headingGap, TILE_SIZES } from "./city-shell";

/**
 * Popular areas — a dense six-across row of wayfinding tiles.
 *
 * v1 drew this as a two-column hairline list: an 80px square thumbnail, the
 * sector name, a full sentence of blurb and a "View stays in F-6" link, six
 * rows deep. It read as six short articles and it took a screen and a half to
 * say what a row of thumbnails says at a glance.
 *
 * The tile is deliberately the homepage city tile's shape and motion — 4:3
 * frame, name, one line under it, photograph scaling 1.03 under the pointer
 * and the tile pressing to 0.99 — so a reader arriving from `/` meets the same
 * object one level down. Two card families that move differently on one page
 * read as two design systems.
 *
 * What the tiles lost in prose is not lost from the page: FAQ answer 1 is a
 * paragraph about F-6, F-7, F-8, E-7 and Blue Area, verbatim and pinned in
 * place by G49, and the wayfinding tile keeps its full landmark sentence in
 * the HTML even where the clamp stops drawing it.
 *
 * The name stays an `<h3>` inside the anchor rather than becoming a plain
 * label: "F-6" is a real subheading of "Popular areas in Islamabad", and the
 * outline is what a crawler reads the section's structure from. The anchor's
 * accessible name comes from `linkLabel` ("View stays in F-6") because the
 * visible text alone is thin as link text; the visible label is contained in
 * it, so the name still matches what a voice user would say.
 *
 * Every sector thumbnail is a declared stand-in in the manifest (`authentic:
 * false`); the alt text describes what the frame actually shows, never what we
 * wish it showed. The wayfinding tile is not a place you can book — no
 * photograph, no link, the civic-landmark glyph in the same footprint so the
 * row's rhythm holds.
 */

const mediaFrame = "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-[4/3] w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const tileLink =
  "group block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const tileName = "mt-2.5 truncate text-bodySm font-semibold text-primary";

/** Two lines, so a longer line stays in the HTML without stretching the row. */
const tileLine = "mt-1 line-clamp-2 text-caption text-tertiary";

function AreaTile({ area }: { readonly area: CityArea }) {
  if (!area.href || !area.image) {
    return (
      <div>
        <span
          aria-hidden="true"
          className={`${mediaFrame} grid aspect-[4/3] place-items-center bg-brand-subtle text-interactive`}
        >
          <LandmarkIcon className="size-7" />
        </span>
        <h3 className={tileName}>{area.name}</h3>
        <p className={tileLine}>{area.line}</p>
      </div>
    );
  }

  const img = image(area.image);

  return (
    <Link
      href={area.href}
      {...(area.linkLabel ? { "aria-label": area.linkLabel } : {})}
      className={`${tileLink} ${focusRing}`}
    >
      <span className={mediaFrame}>
        <Image
          src={img.file}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          sizes={TILE_SIZES}
          className={mediaImage}
        />
      </span>
      <h3 className={tileName}>{area.name}</h3>
      <p className={tileLine}>{area.line}</p>
    </Link>
  );
}

export function CityAreas({ city }: { readonly city: CityContent }) {
  const { areas } = city;

  return (
    <section aria-labelledby="areas-h" className={`${shell} ${rhythm}`}>
      <h2 id="areas-h" className={sectionH2}>
        {areas.heading}
      </h2>
      {/* The one prose run outside the FAQ. It is how the city is laid out,
          which a reader needs before a row of sector names means anything. */}
      <p className="mt-2 max-w-[76ch] text-bodySm text-secondary">{areas.intro}</p>

      <ul className={`${headingGap} grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6`}>
        {areas.items.map((area) => (
          <li key={area.name}>
            <AreaTile area={area} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CityAreas;
