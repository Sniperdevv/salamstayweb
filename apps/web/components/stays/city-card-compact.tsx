import Image from "next/image";
import Link from "next/link";
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
 * Motion matches the stay card exactly: the photograph scales 1.03 under the
 * pointer, the tile presses to 0.99, nothing lifts. Two card families that move
 * differently on the same page read as two design systems.
 */

const mediaFrame =
  "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-[4/3] w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const cardLink =
  "group block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
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
      <span className="mt-1 block truncate text-caption text-tertiary">{line}</span>
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
