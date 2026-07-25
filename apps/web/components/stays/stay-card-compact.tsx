import Image from "next/image";
import Link from "next/link";
import { RAIL_CARD_SIZES } from "./rail-metrics";
import { Num } from "@/components/numerals";
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
 * - **Three tight rows.** Name (see `titleSize` below), clamped to TWO lines
 *   per the closing review: a title cut mid-word at a card's width tells the
 *   reader less than a second line costs the grid, and "Whole apartment in DHA
 *   Phase 5" is the normal length here rather than the exception, with the box
 *   for BOTH lines reserved so a one-line card's area line does not start a
 *   line above its neighbour's. Then the area line and the attribute line, 4px
 *   apart; the three read as one block, not three fields.
 * - **Meta rows at 13, not 12.** `label` (13) is the site's micro rung; §7's
 *   ladder bottoms out there and `caption` (12) is below the floor for a line
 *   a reader is expected to actually read. The area and attribute lines are
 *   information, not fine print.
 * - **Digits isolated on the area line.** "Clifton Block 2", "DHA Phase 5",
 *   "F-10, Islamabad" — every one of these carries a digit run, and an
 *   unisolated run reverses under RTL. `Num` wraps the runs and leaves the
 *   prose in the text flow (the shipped `.num` canon).
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
 * not arrived rather than as a rule.
 *
 * STATIC, not pulsing (closing-review ruling). The bar used to breathe on
 * Tailwind's `animate-pulse`, on the argument that a pulse communicates
 * loading. It does not, here: nothing is in flight. Pricing is unpublished,
 * not pending, so a perpetual animation on every card of every rail was
 * decoration claiming to be state — and twelve of them cycling at once is the
 * loudest thing on a quiet page.
 *
 * `aria-hidden`: a screen reader gets the name and the area and no price,
 * which is the honest reading. A skeleton announced as "loading" would promise
 * a number that is not on its way over this request.
 */
const skeletonBar =
  "inline-block h-3 w-16 rounded-sm bg-slate-100 align-middle dark:bg-raised";

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
   * Page-level gate for the "New" chip, ANDed with the stay's own flag.
   *
   * OFF by default, which is the closing-review ruling and the opposite of the
   * shipped default. Pre-launch every listing is unreviewed, so the chip is
   * true on all of them and therefore distinguishes none of them; a row where
   * every card carries the same mark is a texture, and a reader who learns to
   * ignore it will still be ignoring it on the day one home earns a review and
   * drops it. A surface that genuinely mixes reviewed and unreviewed homes
   * opts in explicitly.
   */
  readonly newChip?: boolean;
  /** LCP escape hatch for a first, above-the-fold rail. */
  readonly priority?: boolean;
  /**
   * Which title rung this instance draws (TASTE-RULES §7, founder-ruled
   * 2026-07-25).
   *
   * §7's ladder puts every card title on the site at 16/500-600 and grants ONE
   * exception: **rail cards at 208px carry their title at 14/600**. A
   * horizontally-scrolling rail is a browsing surface, not a reading one, and
   * at `w-rail-card` a normal Pakistani listing name turns into two clamped
   * lines on most cards — so the exception buys back the row's baseline rhythm
   * rather than saving a pixel.
   *
   * The same component also draws a 296px search tile, a 400px guide tile and
   * the homepage's lead pair, and at those widths 16 fits and the exception has
   * nothing to buy. `"grid"` is therefore the DEFAULT: the exception has to be
   * asked for, so a new grid call site lands on the ladder rather than
   * inheriting a rail's compensation.
   */
  readonly titleSize?: "rail" | "grid";
}

/**
 * `line-clamp-2` sets `display: -webkit-box`, so neither rung may carry
 * `block` — a `block` emitted after it in the cascade kills the clamp.
 */
const TITLE_SIZE = {
  rail: "text-bodySm font-semibold",
  grid: "text-bodyMd font-semibold",
} as const;

export function StayCardCompact({
  stay,
  sizes = RAIL_CARD_SIZES,
  newChip = false,
  priority = false,
  titleSize = "grid",
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

        {/* Two lines, with the box for both reserved whether or not the second
            is used. `truncate` shipped first and cut real names mid-word; a
            bare `line-clamp-2` fixed that but let a one-line card's area line
            start a whole line above its two-line neighbour's, so a rail of six
            read as a ragged staircase. `2lh` is the element's OWN computed
            line-height, so the reserve is the type token's value rather than a
            pixel guess, and a browser without the unit ignores the rule and
            gets the clamp alone.

            No `block`: `line-clamp-2` sets `display: -webkit-box`, and a
            `block` emitted after it in the cascade would kill the clamp. */}
        <span
          className={`mt-2.5 line-clamp-2 min-h-[2lh] text-primary ${TITLE_SIZE[titleSize]}`}
        >
          {stay.name}
        </span>
        <span className="mt-1 block truncate text-label text-tertiary">
          <Num>{stay.area}</Num>
        </span>
        {stay.attributes ? (
          <span className="mt-1 block truncate text-label text-secondary">
            {stay.attributes[0]} &middot; {stay.attributes[1]}
          </span>
        ) : null}
        <span className="mt-1 block text-label">
          <span aria-hidden="true" className={skeletonBar} />
        </span>
      </Link>

      <WishlistHeart stayName={stay.name} />
    </div>
  );
}

export default StayCardCompact;
