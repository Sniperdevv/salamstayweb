import Image from "next/image";
import Link from "next/link";
import { spaceBase } from "@salamstay/design-tokens/spacing";
import { focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { FeaturedStay } from "@/lib/content/featured-stays";
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
 *   listing today.
 * - **Three tight rows.** Name (one line, truncated — a card title that wraps
 *   ragged onto a second line breaks the rail's baseline grid), area line,
 *   price line. 4px between them; they read as one block, not three fields.
 * - **"PKR — night".** The `PKR —` placeholder is the shipped G14 canon,
 *   carried verbatim from `StayCard` rather than reworded, and `.num` sits on
 *   it now so the digits that replace the dash are already tabular and already
 *   bidi-isolated for Urdu.
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
const RAIL_CARD_SIZES = `${spaceBase * 46}px`;

/** Chip treatment shared with the shipped card's area pin: reads on any photo. */
const overlayChip =
  "absolute left-2 top-2 rounded-full border border-hairline bg-canvas px-2 py-0.5 text-overline font-semibold text-interactive shadow-subtle";

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
          {newChip && stay.isNew ? <span className={overlayChip}>New</span> : null}
        </span>

        <span className="mt-2.5 block truncate text-bodySm font-semibold text-primary">
          {stay.name}
        </span>
        <span className="mt-1 block truncate text-caption text-tertiary">{stay.area}</span>
        <span className="mt-1 block text-caption text-secondary">
          <span className="num font-semibold text-primary">PKR —</span> night
        </span>
      </Link>

      <WishlistHeart stayName={stay.name} />
    </div>
  );
}

export default StayCardCompact;
