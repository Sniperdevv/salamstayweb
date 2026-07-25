import Link from "next/link";
import { MessageIcon } from "@/components/icons";
import { FeesReceiptIcon, ShieldCheckIcon } from "@/components/home-icons";
import { focusRing, inlineAction, pressable } from "@/components/ui";
import type { ListingContent } from "@/lib/content/listings/is-f7-2bed";
import { Copy, Plain, priceSkeleton, stickyUnderAnchorBar } from "./shell";

/**
 * Booking card — TASTE-RULES §10, in the recipe's own order: total → form group
 * → info strip → primary CTA → reassurance line.
 *
 * **Border AND shadow.** §1's governing rule says shadow means "floats over
 * scrolling content" and border means "form boundary", and this card is
 * genuinely both: it is pinned above a scrolling page AND it is a form. §1
 * names it as the one sanctioned exception on the site, and it is the only
 * element on this page carrying both.
 *
 * **`radius.lg`, with a `radius.md` form group inside it.** §4.1's concentric
 * rule — inner radius = outer minus padding — so 12 outside and 8 inside, never
 * two equal radii nested.
 *
 * **The total is a skeleton, not "PKR —".** §12: null data is suppressed or it
 * ships a skeleton, and a dash is neither. Nor is the bar underlined: §8 puts
 * underlines on prices THAT OPEN A BREAKDOWN and only those, and there is no
 * breakdown behind a number that does not exist yet. When live pricing lands,
 * the bar becomes an underlined `PKR n,nnn total` and nothing else on this card
 * changes.
 *
 * **The form-group cells are links, not dead buttons.** There is no date picker
 * on the web yet; the picker lives in the flow the CTA opens. A `<button>` that
 * answers a press by doing nothing is worse than a link that says where it
 * goes, and "Add dates" pointing at the reservation flow is exactly true.
 * Interior corners stay square — `overflow-hidden` on the group clips the four
 * outer corners and the cells carry no radius of their own — and the dividers
 * are hairlines, so the group reads as one control with three fields rather
 * than three controls in a row.
 *
 * **One green thing.** The CTA. Not the trust glyphs, which the card draws in
 * brand: §2 spends green on the wordmark dot, the search-submit circle, ONE
 * primary CTA per surface, and verification marks — and this page's single
 * verification mark is the shield on the host's avatar, twenty lines up the
 * page, where it means a specific person has been verified. Three green ticks
 * beside three sentences would spend the whole budget on reassurance and leave
 * the CTA competing with its own footnotes.
 *
 * Sticky from `lg` only. Below that the column collapses and the card lands at
 * the foot of the body, which is why the anchor bar carries a copy of the CTA
 * from the first paint on a phone.
 */

const overline = "block text-overline uppercase text-secondary";

const field =
  "block px-4 py-2.5 text-left transition-colors duration-instant ease-decelerate hover:bg-raised " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

const cta =
  "flex h-12 w-full select-none items-center justify-center rounded-full bg-interactive text-bodyMd font-semibold text-on-brand hover:bg-interactive-hover";

export interface ListingBookingCardProps {
  readonly listing: ListingContent;
  /** Watched by the sticky anchor bar's IntersectionObserver. */
  readonly id: string;
}

export function ListingBookingCard({ listing, id }: ListingBookingCardProps) {
  const { booking } = listing;
  const [checkIn, checkOut, guests] = booking.fields;

  return (
    <aside aria-label="Check availability" className="pb-10 pt-8 lg:pb-0 lg:pt-10">
      <div
        id={id}
        className={`rounded-lg border border-border-default bg-canvas p-6 shadow-floating lg:sticky ${stickyUnderAnchorBar}`}
      >
        <p className="flex items-baseline gap-2">
          <span aria-hidden="true" className={priceSkeleton} />
          <span className="text-bodySm text-secondary">{booking.per}</span>
        </p>
        <p className="mt-1.5 text-caption text-secondary">
          <Plain>{booking.live}</Plain>
        </p>

        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-md border border-border-default">
          {checkIn ? (
            <Link
              href={booking.cta.href}
              className={`${field} border-b border-r border-border-default ${focusRing}`}
            >
              <span className={overline}>{checkIn.label}</span>
              <span className="mt-0.5 block text-bodySm text-primary">{checkIn.value}</span>
            </Link>
          ) : null}
          {checkOut ? (
            <Link
              href={booking.cta.href}
              className={`${field} border-b border-border-default ${focusRing}`}
            >
              <span className={overline}>{checkOut.label}</span>
              <span className="mt-0.5 block text-bodySm text-primary">{checkOut.value}</span>
            </Link>
          ) : null}
          {guests ? (
            <Link href={booking.cta.href} className={`${field} col-span-2 ${focusRing}`}>
              <span className={overline}>{guests.label}</span>
              <span className="mt-0.5 block text-bodySm text-primary">{guests.value}</span>
            </Link>
          ) : null}
        </div>

        {/* §6 job three: an info strip on `bg.raised` at `radius.md`, with only
            the payload bolded (§7/§11.12) — the number the sentence is about,
            never the sentence. */}
        <p className="mt-4 rounded-md bg-raised px-4 py-3 text-caption text-secondary">
          <Copy {...booking.strip} />
        </p>

        <Link href={booking.cta.href} className={`mt-4 ${cta} ${focusRing} ${pressable}`}>
          {booking.cta.label}
        </Link>

        <p className="mt-3 text-center text-caption text-secondary">
          <Plain>{booking.note}</Plain>
        </p>

        <div className="mt-5 flex flex-col gap-3 border-t border-hairline pt-5">
          {booking.trust.map((claim, i) => (
            <p key={claim.text} className="flex gap-2.5 text-caption text-secondary">
              {i === 0 ? (
                <ShieldCheckIcon className="mt-px size-4 shrink-0 text-secondary" />
              ) : (
                <FeesReceiptIcon className="mt-px size-4 shrink-0 text-secondary" />
              )}
              <span>
                <Copy {...claim} />
              </span>
            </p>
          ))}
          <p className="flex gap-2.5 text-caption text-secondary">
            <MessageIcon className="mt-px size-4 shrink-0 text-secondary" />
            <span>
              {booking.help.lead}{" "}
              <Link href={booking.help.href} className={`${inlineAction} ${focusRing}`}>
                {booking.help.label}
              </Link>
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}

export default ListingBookingCard;
