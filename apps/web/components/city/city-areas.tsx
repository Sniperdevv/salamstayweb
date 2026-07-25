import Image from "next/image";
import Link from "next/link";
import { focusRing } from "@/components/ui";
import { LandmarkIcon } from "@/components/stays/icons";
import { image } from "@/lib/content/image-manifest";
import type { CityArea, CityContent } from "@/lib/content/cities/types";
import { shell, rhythm, sectionH2, headingGap } from "@/components/discovery/shell";

/**
 * Popular areas — a dense row of wayfinding tiles, plus open rows for the
 * areas that have no photograph.
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
 * wish it showed.
 *
 * The wayfinding entry is NOT one of the tiles, and it is not one of the rows
 * either. It is not a place you can book, it has no photograph and no link, and
 * drawing it in the media tile's footprint — a 4:3 grey box with a glyph in it
 * — spent a whole photographic slot saying "there is no photograph here". Six
 * cells for five bookable sectors also left the row's last cell reading as a
 * load failure.
 *
 * It now gets a FULL-WIDTH row of its own, under everything else, on ALL SIX
 * cities (closing review A2). Islamabad landed there first because five tiles
 * left exactly one row over; the other five cities were putting a
 * three-sentence landmark list into one cell of a three-column grid beside two
 * four-word lines, which is the ragged grid the review named. One sentence that
 * runs the measure is not a grid cell — the row is the only shape that fits it,
 * and it is the same shape on every city now rather than a consequence of how
 * many sectors happen to be photographed.
 *
 * The landmark glyph rides WITH the note and nowhere else: its job is to say
 * "this one is not a place you book", which is a distinction only the note
 * draws. It used to be gated on `tiles.length > 0`, which put it on Islamabad's
 * note and on none of the other five — the same row, marked on one page and
 * bare on five.
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

/**
 * 16/600 (§7: card titles 16/500-600). At 14 a sector name sat at the same size
 * as the line under it and the row read as ten equal labels rather than as five
 * named places with a line each.
 */
const tileName = "mt-2.5 truncate text-bodyMd font-semibold text-primary";

/**
 * Two lines, so a longer line stays in the HTML without stretching the row.
 *
 * 14, matching `AreaRow`'s line below. It is the SAME FIELD — `area.line` — and
 * it was set at 12 in the tile and 14 in the row, which meant one city page
 * printed the same sentence at two sizes depending only on whether a
 * photograph existed for that sector. §7 also puts 12 below the floor for a
 * line a reader is expected to read.
 */
const tileLine = "mt-1 line-clamp-2 text-bodySm text-tertiary";

/**
 * The photo row's column count follows the number of PHOTOGRAPHED areas, not a
 * house number. Islamabad ships five, and a fixed six-across left the sixth
 * cell empty — a hole at the end of a row reads as a failed load, not as
 * spacing. Static strings, because Tailwind scans source text.
 */
const TILE_COLS: Record<number, string> = {
  1: "lg:grid-cols-3",
  2: "lg:grid-cols-3",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

/**
 * `sizes` per column count: (1232 content box − (n−1) × 16 gap) ÷ n at the
 * 1280 cap, then the fluid steps below it. Stated here rather than read from
 * the discovery shell's `TILE_SIZES`, which is the arithmetic of a fixed
 * six-across row this grid no longer always is.
 */
const TILE_SIZES_BY_COLS: Record<number, string> = {
  1: "(min-width: 1024px) 100vw, (min-width: 768px) 31vw, 45vw",
  2: "(min-width: 1024px) 50vw, (min-width: 768px) 31vw, 45vw",
  3: "(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 31vw, 45vw",
  4: "(min-width: 1280px) 296px, (min-width: 1024px) 25vw, (min-width: 768px) 31vw, 45vw",
  5: "(min-width: 1280px) 236px, (min-width: 1024px) 20vw, (min-width: 768px) 31vw, 45vw",
  6: "(min-width: 1280px) 192px, (min-width: 1024px) 17vw, (min-width: 768px) 31vw, 45vw",
};

const cols = (n: number): string => TILE_COLS[n] ?? "lg:grid-cols-6";
const tileSizes = (n: number): string => TILE_SIZES_BY_COLS[n] ?? TILE_SIZES_BY_COLS[6]!;

/** An area with a photograph and a page of its own: the tile. */
function AreaTile({
  area,
  sizes,
}: {
  readonly area: CityArea & { readonly image: NonNullable<CityArea["image"]> };
  readonly sizes: string;
}) {
  const img = image(area.image);
  const media = (
    <>
      <span className={mediaFrame}>
        <Image
          src={img.file}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          sizes={sizes}
          className={mediaImage}
        />
      </span>
      <h3 className={tileName}>{area.name}</h3>
      <p className={tileLine}>{area.line}</p>
    </>
  );

  if (!area.href) return <div className="group">{media}</div>;

  return (
    <Link
      href={area.href}
      {...(area.linkLabel ? { "aria-label": area.linkLabel } : {})}
      className={`${tileLink} ${focusRing}`}
    >
      {media}
    </Link>
  );
}

/**
 * An area with NO photograph: an open text row, never an empty media frame.
 *
 * Five of the six beta cities have no verified sector photography, and the
 * fallback this replaces drew each of their areas as a 4:3 grey box with a
 * glyph in it — six per page, which reads as six broken images rather than as
 * six places. A row that has no photograph simply has no photograph: name,
 * one line, open space (§1 — content carries neither shadow nor border).
 *
 * `glyph` marks the WAYFINDING NOTE and nothing else. The mark means "this one
 * is not a place you book", so it belongs to the one entry that answers to that
 * description; on the sector rows there is nothing for it to distinguish, and
 * five identical glyphs down a column would be wallpaper.
 */
function AreaRow({
  area,
  glyph = false,
}: {
  readonly area: CityArea;
  readonly glyph?: boolean;
}) {
  const body = (
    <>
      {/* Underlined at rest when it is an action (§8), plain when it is a
          note. Ink either way — §2 keeps green off links. */}
      <h3
        className={
          area.href
            ? "text-bodyMd font-semibold text-primary underline underline-offset-4 transition-colors duration-instant ease-decelerate group-hover:text-secondary motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate"
            : "text-bodyMd font-semibold text-primary"
        }
      >
        {area.name}
      </h3>
      <p className="mt-1 text-bodySm text-secondary">{area.line}</p>
    </>
  );

  return (
    <div className="flex items-start gap-2.5">
      {glyph ? (
        <span aria-hidden="true" className="grid h-6 shrink-0 place-items-center">
          <LandmarkIcon className="size-5 text-secondary" />
        </span>
      ) : null}
      <div className="min-w-0">
        {area.href ? (
          <Link
            href={area.href}
            {...(area.linkLabel ? { "aria-label": area.linkLabel } : {})}
            className={`group block rounded-sm ${focusRing}`}
          >
            {body}
          </Link>
        ) : (
          body
        )}
      </div>
    </div>
  );
}

export function CityAreas({ city }: { readonly city: CityContent }) {
  const { areas } = city;

  /* Three shapes, in this order: photographed areas draw tiles, unphotographed
     areas draw open rows in a grid, and the ONE declared wayfinding note draws
     a full-width row of its own beneath both. Islamabad is five tiles + the
     note; the other five cities are five rows + the note, until their sector
     photography is verified. */
  const tiles = areas.items.filter(
    (a): a is CityArea & { image: NonNullable<CityArea["image"]> } => Boolean(a.image),
  );
  const rows = areas.items.filter((a) => !a.image && !a.wayfinding);
  const note = areas.items.find((a) => a.wayfinding);

  return (
    <section aria-labelledby="areas-h" className={`${shell} ${rhythm}`}>
      <h2 id="areas-h" className={sectionH2}>
        {areas.heading}
      </h2>
      {/* The one prose run outside the FAQ. It is how the city is laid out,
          which a reader needs before a row of sector names means anything. */}
      <p className="mt-2 max-w-[76ch] text-bodySm text-secondary">{areas.intro}</p>

      {tiles.length > 0 ? (
        <ul
          className={`${headingGap} grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 ${cols(tiles.length)}`}
        >
          {tiles.map((area) => (
            <li key={area.name}>
              <AreaTile area={area} sizes={tileSizes(tiles.length)} />
            </li>
          ))}
        </ul>
      ) : null}

      {rows.length > 0 ? (
        <ul
          className={`${tiles.length > 0 ? "mt-6" : headingGap} grid grid-cols-1 gap-x-8 gap-y-5 ${
            rows.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : ""
          }`}
        >
          {rows.map((area) => (
            <li key={area.name}>
              <AreaRow area={area} />
            </li>
          ))}
        </ul>
      ) : null}

      {/* The note, on its own line, at the reading measure rather than in a
          grid cell — its sentence is three clauses long and a third of a row is
          not where a sentence goes. `max-w-[76ch]` is the section intro's own
          measure, so the two prose runs on this section line up. */}
      {note ? (
        <div
          className={`${tiles.length > 0 || rows.length > 0 ? "mt-6 border-t border-hairline pt-5" : headingGap} max-w-[76ch]`}
        >
          <AreaRow area={note} glyph />
        </div>
      ) : null}
    </section>
  );
}

export default CityAreas;
