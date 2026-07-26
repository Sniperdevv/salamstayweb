import Image from "next/image";
import Link from "next/link";
import { Num } from "@/components/numerals";
import { focusRing } from "@/components/ui";
import { image, type ImageId } from "@/lib/content/image-manifest";

/**
 * CityCardCompact — the dense city tile.
 *
 * The homepage today gives six cities three-across at 3:2 with a body
 * paragraph each, which reads as six essays and takes a full screen to say
 * "six cities". This tile says the same thing in a sixth of the height: a 4:3
 * frame, the city name, and one line of where in it. Six of them fit on one
 * row at `lg`, which is the point — the city set should be a glance, not a
 * section.
 *
 * The one-liner is a truncated single line by design. If a city needs two lines
 * to be understood, it needs its own page, and it has one.
 *
 * That line is `label` (13), not `caption` (12). §7's ladder bottoms out at 13,
 * and this is the same slot the stay tile fills one grid over — one line under
 * a card title, on the same page, at the same reading distance. It is where a
 * reader finds out that Islamabad means "F-6, F-7, Margalla foothills", which
 * is information rather than fine print, and two tiles in one scroll drawing
 * the same slot at two sizes reads as a mistake even to someone who could not
 * name the pixel.
 *
 * Its digits are isolated (§12): "F-6, F-7, Margalla foothills" and "D-Ground,
 * Clock Tower" are sector strings, and an unwrapped run reverses under RTL.
 *
 * Motion matches the stay card exactly: the photograph scales 1.03 under the
 * pointer, the tile presses to 0.99, nothing lifts. Two card families that move
 * differently on the same page read as two design systems.
 */

const mediaFrame =
  "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-[4/3] w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const cardLink =
  "group block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export interface CityCardCompactProps {
  readonly href: string;
  readonly name: string;
  /** One line. Truncated, never wrapped. */
  readonly line: string;
  readonly image: ImageId;
  /**
   * Intrinsic display width for the responsive image. Required, not defaulted:
   * the tile is fluid inside its grid, and a wrong `sizes` is an oversized
   * download rather than a visible bug.
   */
  readonly sizes: string;
  readonly priority?: boolean;
}

export function CityCardCompact({
  href,
  name,
  line,
  image: imageId,
  sizes,
  priority = false,
}: CityCardCompactProps) {
  const img = image(imageId);

  return (
    <Link href={href} className={`${cardLink} ${focusRing}`}>
      <span className={mediaFrame}>
        <Image
          src={img.file}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          {...(priority ? { priority: true } : { loading: "lazy" as const })}
          className={mediaImage}
        />
      </span>
      <span className="mt-2.5 block truncate text-bodySm font-semibold text-primary">
        {name}
      </span>
      {/* `secondary`, not `tertiary`: the tertiary role is documented in
          `packages/design-tokens/src/colors.ts` as AA-large only, "use ≥18.66px",
          and this line is 13. Same correction applied to the identical field in
          `city/city-areas.tsx` on 2026-07-25 — one field, one legible ink. */}
      <span className="mt-1 block truncate text-label text-secondary">
        <Num>{line}</Num>
      </span>
    </Link>
  );
}

/**
 * The tile's grid: 2 across on a phone, 3 from `md`, all six on one row from
 * `lg`. The `sizes` string below is the grid's own arithmetic, stated once so
 * every consumer of the grid inherits the right one.
 */
export const CITY_GRID = "grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-6";

export const CITY_GRID_SIZES =
  "(min-width: 1024px) 172px, (min-width: 768px) 30vw, 45vw";

export default CityCardCompact;
