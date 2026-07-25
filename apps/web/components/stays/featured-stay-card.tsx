import Image from "next/image";
import Link from "next/link";
import { focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { FeaturedStay } from "@/lib/content/featured-stays";
import { WishlistHeart } from "./wishlist-heart";

/**
 * FeaturedStayCard — the horizontal card from the TASTE-RULES §10 recipe.
 *
 * It is the ONE card family on the site that genuinely floats: a promoted home
 * lifted out of the rail's rhythm and set on its own. That single fact decides
 * every choice below, and none of them are decoration:
 *
 * - **`2xl` radius, `elevation.floating`, NO border.** §1's governing rule:
 *   shadow means "this is above the page you are scrolling", border means "this
 *   is a form boundary or an unselected choice". A floating card that also
 *   draws a border is hedging, and the eye reads a hedge as a mistake. The
 *   booking panel is the one sanctioned both-at-once surface on the site.
 * - **12px padding, `lg` image inside.** §4's concentric-nesting rule: the
 *   inner radius follows from the outer one and the padding rather than being
 *   picked. Equal radii nested inside each other is the tell that a card was
 *   assembled instead of drawn.
 * - **~40% of the width, 3:2, from `sm`.** The photograph is the identifying
 *   element, not the content; the reading half is where the card does its work.
 *   Below `sm` it STACKS — photograph across the top, text under it. Kept
 *   horizontal on a 375 phone the frame measures 128 × 85, which is a third of
 *   the photograph the ordinary 208px rail tile shows eight pixels below it,
 *   and a promoted card that shows LESS home than the tile it is promoting has
 *   the hierarchy backwards. Stacked, it shows 319 × 213 and leads properly.
 * - **Four text rows at ~22px pitch, then ONE deliberate 16px break.** The
 *   break is the whole typographic idea. Title / meta / meta run as one block
 *   at the type's natural leading; the price row is a different KIND of
 *   statement, and one extra step of space says so more clearly than a rule, a
 *   tint or a weight change would.
 * - **The text column is centred against the photograph, from `sm`.** Four
 *   honest rows come to about 100px and the 3:2 photograph to about 185, so
 *   top-aligning them leaves eighty pixels of void under the price row and the
 *   card reads as unfinished rather than as spare. Airbnb's version of this
 *   card fills that height with a rating, a review count and a nightly rate;
 *   §12 says we do not have those and will not invent them, so the honest fix
 *   is to centre what we do have rather than to pad it out.
 * - **Circular neutral-fill heart, from `sm`.** §10 gives the naked
 *   stroke-plus-drop-shadow heart to hearts sitting on a photograph and the
 *   plated circular one to hearts sitting on white chrome. Which of those this
 *   heart is depends on the layout, because the card's top-right corner is the
 *   card's own padding when it runs horizontal and the photograph's corner when
 *   it stacks. `chromeFromSm` is that one rule, answered at the one breakpoint
 *   where the answer changes.
 *
 * Honesty (§12): no price, no rating, no review count, no "featured" superlative
 * burnt into the card. The price row is the shared skeleton placeholder — a
 * number belongs there and is not published yet — and the badge, if the caller
 * turns it on, is the same "New" the rail card draws, meaning the same one
 * checkable thing.
 *
 * Motion is the compact card's, verbatim: the photograph scales 1.03 under the
 * pointer, the card presses to 0.99, nothing lifts. Two card families that move
 * differently on the same page read as two design systems — and this one in
 * particular must not lift, because it is already the thing that is up.
 *
 * Placed by `app/page.tsx`, leading rail 1: one Islamabad home lifted out of
 * the row, the other eight running as the ordinary rail beneath it.
 */

const cardShell =
  "relative rounded-2xl bg-canvas p-3 shadow-floating " +
  "transition-shadow duration-fast ease-decelerate hover:shadow-popover " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate";

const cardLink =
  "group flex flex-col items-start gap-3 rounded-xl transition-transform duration-instant ease-decelerate active:scale-[0.99] " +
  "sm:flex-row sm:items-center sm:gap-4 " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/** Concentric with the `2xl` shell at `space-3` padding (§4 rule 1). */
const mediaFrame = "relative block w-full shrink-0 overflow-hidden rounded-lg sm:w-2/5";

const mediaImage =
  "aspect-[3/2] w-full object-cover transition-transform duration-normal ease-decelerate group-hover:scale-[1.03] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:group-hover:scale-100";

/**
 * See `stay-card-compact.tsx` for why this is a skeleton and not a dash, and
 * why the two colour classes are named rather than a `bg-skeleton` role.
 */
const skeletonBar =
  "inline-block h-3 w-16 rounded-sm bg-slate-100 align-middle animate-pulse motion-reduce:animate-none dark:bg-raised";

export interface FeaturedStayCardProps {
  readonly stay: FeaturedStay;
  /** Intrinsic display width for the responsive image. Required — the card is
   *  fluid inside whatever column places it, and a wrong `sizes` is an
   *  oversized download rather than a visible bug. */
  readonly sizes: string;
  readonly priority?: boolean;
}

export function FeaturedStayCard({ stay, sizes, priority = false }: FeaturedStayCardProps) {
  const img = image(stay.image);

  return (
    <div className={cardShell}>
      {/* The heart is a SIBLING of the anchor, never a child: a <button> inside
          an <a> is invalid, and browsers recover by moving it out. Same rule as
          the compact card. */}
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
        </span>

        {/* `sm:pr-11` reserves the heart's 44px target so a long title cannot
            run under it. Reserved space, not a truncation guess — and only from
            `sm`, because in the stacked layout the heart is up on the
            photograph and the text column owns its full width. */}
        <span className="flex w-full min-w-0 flex-1 flex-col sm:pr-11">
          <span className="truncate text-bodyMd font-semibold text-primary">{stay.name}</span>
          <span className="truncate text-bodySm text-secondary">{stay.area}</span>
          {stay.attributes ? (
            <span className="truncate text-bodySm text-secondary">
              {stay.attributes[0]} &middot; {stay.attributes[1]}
            </span>
          ) : null}

          {/* The one deliberate break: the price row is a different kind of
              statement from the three above it. */}
          <span className="mt-4 block text-bodySm">
            <span aria-hidden="true" className={skeletonBar} />
          </span>
        </span>
      </Link>

      {/* `size-11` makes this a real 44px box so the heart's own
          `absolute right-0 top-0` lands on the card's 12px padding edge rather
          than on a zero-size anchor. */}
      <span className="absolute right-3 top-3 size-11">
        <WishlistHeart stayName={stay.name} variant="chromeFromSm" />
      </span>
    </div>
  );
}

export default FeaturedStayCard;
