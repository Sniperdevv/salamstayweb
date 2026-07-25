import Image from "next/image";
import Link from "next/link";
import { PinIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import { image } from "@/lib/content/image-manifest";
import type { StayCardContent } from "@/lib/content/stays";
import { ATTRIBUTES } from "./attributes";
import { attributePill, cardLift } from "./styles";

/**
 * One listing tile — the `.lcard` both the city card (gw-002) and the area card
 * (gw-003) draw identically: photograph with an area pin, the stay's name, the
 * line beneath it, the attribute pills, and the nightly-price row.
 *
 * What is deliberately NOT here, and must not be "completed":
 * - no star rating and no review count. Pre-launch, no real review exists, and
 *   an invented one is the single fastest way to lose the page (§5/§6).
 * - no PKR figure. "PKR —" is the cards' own placeholder and stays a
 *   placeholder until live pricing ships (G14). No "from", no "avg", no range.
 * - no wishlist heart. Saving a stay is an authenticated action and these pages
 *   are served to logged-out crawlers and visitors alike.
 *
 * The card titles are `<span>`, not headings: the tiles are one list under the
 * section's `<h2>`, and promoting them to `<h3>` would put six competing
 * subheads into the outline for no reader benefit (G78).
 */

export function StayCard({
  stay,
  sizes,
  newChip = false,
}: {
  readonly stay: StayCardContent;
  /**
   * Required, not defaulted: the tile is the same, the column widths are not,
   * and a wrong `sizes` is a silently oversized download rather than a visible
   * bug. Each grid states its own.
   */
  readonly sizes: string;
  /**
   * The "New" chip, meaning: no two-way review has been published for this home
   * yet. A page-level switch rather than a per-listing flag, because pre-launch
   * that is true of every listing and there is no review data to read. gw-003
   * draws the chip and explains it in the note under the grid; gw-002 draws
   * neither, so the city page leaves it off.
   */
  readonly newChip?: boolean;
}) {
  const img = image(stay.image);

  return (
    <Link
      href={stay.href}
      className={`group flex w-full flex-col rounded-lg ${cardLift} ${focusRing}`}
    >
      <span className="relative block overflow-hidden rounded-lg border border-hairline transition-shadow duration-fast ease-decelerate group-hover:shadow-card motion-reduce:transition-none">
        <Image
          src={img.file}
          alt={img.alt}
          width={img.width}
          height={img.height}
          loading="lazy"
          sizes={sizes}
          className="aspect-[4/3] w-full object-cover"
        />
        {/* Area pin, as the cards draw it: the sector or the block, not a
            marketing badge. */}
        <span className="absolute left-3 top-3 rounded-full border border-hairline bg-canvas px-3 py-1 text-overline font-semibold text-primary shadow-subtle">
          {stay.areaPin}
        </span>
      </span>

      <span className="mt-3 flex items-center gap-2">
        <span className="min-w-0 text-bodyMd font-semibold text-primary">{stay.title}</span>
        {newChip ? (
          <span className="shrink-0 rounded-full bg-brand-subtle px-2 py-0.5 text-overline font-semibold text-interactive">
            New
          </span>
        ) : null}
      </span>
      <span className="mt-1 flex items-center gap-2 text-bodySm text-secondary">
        <PinIcon className="size-4 shrink-0 text-tertiary" />
        {stay.location}
      </span>

      <span className="mt-3 flex flex-wrap gap-2">
        {stay.attributes.map((id) => {
          const { label, Icon } = ATTRIBUTES[id];
          return (
            <span key={id} className={attributePill}>
              <Icon className="size-3 text-secondary" />
              {label}
            </span>
          );
        })}
      </span>

      {/* `mt-auto` pins the price to the bottom of the tile, so the price line
          reads across a row even when one tile's attribute pills wrap onto a
          second line. */}
      <span className="mt-auto flex items-baseline gap-2 pt-3 text-bodySm text-secondary">
        <span className="num text-bodyMd font-bold text-primary">PKR —</span>
        <span>/ night</span>
        <span className="text-caption text-tertiary">· live pricing</span>
      </span>
    </Link>
  );
}

/** Three-up listing grid, collapsing 3 → 2 → 1, as both cards' media queries do. */
export function StayGrid({
  stays,
  sizes,
  newChip = false,
}: {
  readonly stays: readonly StayCardContent[];
  readonly sizes: string;
  readonly newChip?: boolean;
}) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stays.map((stay) => (
        <li key={stay.href} className="flex">
          <StayCard stay={stay} sizes={sizes} newChip={newChip} />
        </li>
      ))}
    </ul>
  );
}

export default StayCard;
