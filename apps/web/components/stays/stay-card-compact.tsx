import Image from "next/image";
import Link from "next/link";
import { RAIL_CARD_SIZES } from "./rail-metrics";
import { focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { FeaturedStay } from "@/lib/content/featured-stays";
import { SparkIcon } from "./icons";
import { WishlistHeart } from "./wishlist-heart";

/**
 * StayCardCompact — the inventory-first listing tile.
 *
 * The shipped `StayCard` is a reading tile: 4:3 photograph, attribute pills, a
 * price row with a live-pricing note. Three of them fill a viewport. This one
 * is a browsing tile, built to the proportions a marketplace rail actually
 * uses: a near-square photograph, one line of name, one line of place, one
 * price line, and nothing else. Six and a half of them fit across a desktop
 * rail, which is the whole point — the page has to look like it has inventory
 * before it can look like it has anything.
 *
 * Anatomy, and why each piece is where it is:
 *
 * - **20:19 photograph.** Near-square, not 4:3. A taller frame shows more of
 *   the room at the same card width, and at rail scale that is the difference
 *   between reading a photograph and recognising a shape.
 * - **Wishlist heart, sibling of the anchor.** See `wishlist-heart.tsx`. This
 *   component's only job for it is the relative box and the hover group.
 * - **"New" chip, over the image top-left.** Our honest stand-in for the badge
 *   a mature marketplace puts there. "Guest favourite" and any rating,
 *   review count or "popular" claim is banned outright: no review exists yet,
 *   so any such badge would be invented. "New" means one checkable thing —
 *   this home has no published two-way review — and that is true of every
 *   listing today. Drawn to the TASTE-RULES §10 badge recipe: an OPAQUE white
 *   pill, glyph, 14/600 ink, `elevation.onMedia`, inset 12px. Opaque and
 *   shadowed rather than tinted or scrimmed, because §9 is absolute that
 *   nothing darkens a photograph — chrome on an image earns its legibility
 *   from its own container, never by degrading what is underneath.
 * - **Three tight rows.** Name (one line, truncated — a card title that wraps
 *   ragged onto a second line breaks the rail's baseline grid), area line,
 *   attribute line. 4px between them; they read as one block, not three fields.
 * - **The attribute line.** Two real attributes from the home's own list, in
 *   the shipped `ATTRIBUTES` wording, joined by ONE `·` (§7: one separator per
 *   gap, never chained). It replaced a third line that said "PKR — night", and
 *   that is the point: a row of six cards each reading "PKR —" told a visitor
 *   nothing six times over, where "Halal kitchen · Backup power" is six
 *   different true sentences about six different homes.
 * - **The price row is a skeleton, not a dash.** §12: null data is never
 *   rendered as an em-dash on the live site — it is suppressed or it ships a
 *   `backgrounds.skeleton` placeholder. Pricing is real and coming; the bar
 *   says "a number belongs here and is not published yet", which is exactly
 *   true, and it does it without asking the reader to parse a dash as a value.
 *
 * Motion: the photograph scales 1.03 under the pointer, 240ms, decelerating.
 * The card does NOT lift. A lift on a rail item is worse than useless — the
 * neighbour is 12px away, so a lifting card overlaps its own row and the eye
 * reads it as a glitch rather than as depth. The press answers on the whole
 * card at 0.99. Both collapse to nothing under reduced motion, and hover is
 * behind `hover:hover` globally via the Tailwind config.
 */

/**
 * Default `sizes` for the rail: the card is a fixed `w-rail-card`, so the
 * intrinsic width is known and the browser never has to guess. Derived from the
 * same spacing base as the Tailwind bridge so the two cannot drift.
 */

/**
 * TASTE-RULES §10 badge pill. Opaque surface, `rounded-full`, glyph + 14/600
 * INK label (never brand — §2 spends green on four roles and a status badge is
 * not one of them), `elevation.onMedia` for legibility against unknowable
 * image content, and a 12px inset from the photograph's corner. No border: the
 * shadow is doing the separating, and drawing both says neither.
 */
const overlayChip =
  "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-canvas px-3 py-1 text-bodySm font-semibold text-primary shadow-on-media";

/**
 * The price placeholder (§12). `backgrounds.skeleton.base` is `slate-100` in
 * light and `darkSurface.raised` in dark; the preset ships no `bg-skeleton`
 * role yet, so those two are named directly — the values are byte-identical to
 * the token, not picked. Flagged for a `bg-skeleton` role in the next cut.
 *
 * `w-16` is `space-16` (64px), the nearest step to the ~60px the recipe asks
 * for; `h-3` is the caption size, so the bar reads as a line of type that has
 * not arrived rather than as a rule. The breath is Tailwind's `animate-pulse`
 * — a 2s opacity cycle, the one perpetual animation Emil sanctions outright
 * because it communicates state (loading) rather than decorating. It stops
 * dead under `motion-reduce`, where the bar alone still says "not yet".
 *
 * `aria-hidden`: a screen reader gets the name and the area and no price,
 * which is the honest reading. A skeleton announced as "loading" would promise
 * a number that is not on its way over this request.
 */
const skeletonBar =
  "inline-block h-3 w-16 rounded-sm bg-slate-100 align-middle animate-pulse motion-reduce:animate-none dark:bg-raised";

const mediaFrame =
  "relative block overflow-hidden rounded-lg border border-hairline";

const mediaImage =
  "aspect-[20/19] w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

const cardLink =
  "block rounded-lg transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export interface StayCardCompactProps {
  readonly stay: FeaturedStay;
  /**
   * Intrinsic display width for the responsive image. Defaults to the rail
   * card's fixed width; a grid that stretches the card must state its own.
   */
  readonly sizes?: string;
  /**
   * Page-level gate for the "New" chip, ANDed with the stay's own flag. On by
   * default because the chip is the only badge we can honestly draw; a surface
   * that would otherwise show six identical chips in one row can pass `false`
   * and lose nothing true.
   */
  readonly newChip?: boolean;
  /** LCP escape hatch for a first, above-the-fold rail. */
  readonly priority?: boolean;
}

export function StayCardCompact({
  stay,
  sizes = RAIL_CARD_SIZES,
  newChip = true,
  priority = false,
}: StayCardCompactProps) {
  const img = image(stay.image);

  return (
    // The group is the outer box, not the anchor, so crossing onto the heart
    // does not interrupt the photograph's hover scale mid-transition.
    <div className="group relative w-full">
      <Link href={stay.href} className={`${cardLink} ${focusRing}`}>
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
          {newChip && stay.isNew ? (
            <span className={overlayChip}>
              <SparkIcon className="size-3.5 shrink-0" />
              New
            </span>
          ) : null}
        </span>

        <span className="mt-2.5 block truncate text-bodySm font-semibold text-primary">
          {stay.name}
        </span>
        <span className="mt-1 block truncate text-caption text-tertiary">{stay.area}</span>
        {stay.attributes ? (
          <span className="mt-1 block truncate text-caption text-secondary">
            {stay.attributes[0]} &middot; {stay.attributes[1]}
          </span>
        ) : null}
        <span className="mt-1 block text-caption">
          <span aria-hidden="true" className={skeletonBar} />
        </span>
      </Link>

      <WishlistHeart stayName={stay.name} />
    </div>
  );
}

export default StayCardCompact;
