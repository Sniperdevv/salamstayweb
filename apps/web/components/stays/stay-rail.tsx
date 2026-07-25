import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";
import type { FeaturedStay } from "@/lib/content/featured-stays";
import { RailControls } from "./rail-controls";
import { StayCardCompact } from "./stay-card-compact";

/**
 * StayRail — a horizontally-scrolling row of compact listing cards.
 *
 * The rail is a native scroll container, and that is the whole design:
 *
 * - **The scrolling is the browser's.** `overflow-x: auto` plus
 *   `scroll-snap-type: x mandatory` gives momentum, rubber-banding at the ends,
 *   trackpad gestures, shift-wheel, keyboard arrows and touch fling for free,
 *   at the platform's frame budget rather than ours. Every one of those is
 *   worse re-implemented in JavaScript, and a transform-based track loses the
 *   scroll range from the accessibility tree on the way.
 * - **No scroll listener anywhere.** The arrows need to know whether they are
 *   at an end, which is the usual excuse for `onScroll` state. Two zero-size
 *   markers at the ends of the track and one IntersectionObserver rooted on the
 *   scroller answer the same question with no per-frame work — the same trick
 *   the site header uses for its scrolled state.
 * - **No hijack.** Vertical scroll stays vertical. A rail that steals the wheel
 *   traps the reader between sections, which is a worse failure than a rail
 *   nobody scrolls.
 * - **Server-rendered.** The rail and its cards are server components; the only
 *   client code is `RailControls`, which finds the scroller by id. A page of
 *   six rails ships one small handler, not two hundred card trees.
 *
 * Crawlability (G37): every card is a real `<a href>` inside an `<li>`, present
 * in the server HTML. The arrows are enhancement — with JavaScript off, the
 * rail still scrolls and every listing is still reachable.
 *
 * Gutter alignment: the scroller bleeds to the screen edge with a negative
 * margin and pays it back as padding, so the first card's left edge lands on
 * the page container's gutter while the last card scrolls fully off screen.
 * `scroll-padding-inline-start` matches, so a snapped card stops on the gutter
 * rather than flush against the viewport edge.
 */

const viewAllLink =
  "inline-flex items-center gap-1 rounded-sm text-bodySm font-medium text-link underline-offset-4 " +
  "transition-colors duration-instant ease-decelerate hover:text-link-strong hover:underline " +
  "motion-reduce:transition-[background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate";

/**
 * Scrollbar suppression. Not a token question — this hides the scrollbar's
 * affordance, which the peeking card and the arrows replace. The track still
 * scrolls, still takes focus and still exposes its range to assistive tech.
 */
const hideScrollbar = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

const scroller =
  "-mx-4 mt-5 snap-x snap-mandatory scroll-pl-4 overflow-x-auto overscroll-x-contain px-4 pb-1 " +
  "md:-mx-6 md:scroll-pl-6 md:px-6";

/** Zero-size end markers. Absolutely positioned against the TRACK, so
 *  `right-0` means the end of the scrollable content, not of the visible box. */
const edgeMarker = "pointer-events-none absolute top-0 size-px";

export interface StayRailProps {
  readonly heading: string;
  /** Anchors `aria-labelledby` on the section. Must be unique on the page. */
  readonly headingId: string;
  /** Optional single line under the heading. */
  readonly sub?: string;
  readonly stays: readonly FeaturedStay[];
  /** Optional trailing link, e.g. all stays in this city. */
  readonly viewAll?: { readonly href: string; readonly label: string };
  /** Passed through to every card. */
  readonly newChip?: boolean;
  /** Marks the first card `priority`, for a rail above the fold. */
  readonly priority?: boolean;
}

export function StayRail({
  heading,
  headingId,
  sub,
  stays,
  viewAll,
  newChip,
  priority = false,
}: StayRailProps) {
  const scrollerId = `${headingId}-track`;

  return (
    <section aria-labelledby={headingId}>
      {/* The heading and the trailing controls share one row; the optional sub
          gets its own line beneath both. Putting the sub inside the left column
          instead lets it wrap under a narrow viewport and drag "View all" down
          beside its second line, which reads as a broken column rather than a
          caption. */}
      <div className="flex items-center justify-between gap-4">
        <h2 id={headingId} className="min-w-0 truncate text-h4 text-primary">
          {heading}
        </h2>

        <div className="flex shrink-0 items-center gap-4">
          {viewAll ? (
            <Link href={viewAll.href} className={`${viewAllLink} ${focusRing}`}>
              {viewAll.label}
              <ChevronRightIcon className="size-4" />
            </Link>
          ) : null}
          <RailControls scrollerId={scrollerId} label={heading} />
        </div>
      </div>
      {sub ? <p className="mt-1 text-bodySm text-secondary">{sub}</p> : null}

      <div id={scrollerId} className={`${scroller} ${hideScrollbar}`}>
        {/* `w-max` is load-bearing: an auto-width flex container fills the
            scroller's content box and lets the cards overflow it, which would
            put the end marker in the middle of the track and leave the forward
            arrow permanently disabled. Sized to its content, the track's right
            edge is the real end of the scroll range — and the scroller's
            trailing gutter is then part of the scrollable width, so the last
            card stops on the gutter instead of against the viewport. */}
        <ul className="relative flex w-max gap-3">
          <li data-rail-edge="start" aria-hidden="true" className={`${edgeMarker} left-0`} />
          {stays.map((stay, i) => (
            <li
              key={`${stay.href}-${stay.image}`}
              className="w-rail-card shrink-0 snap-start"
            >
              <StayCardCompact
                stay={stay}
                {...(newChip === undefined ? {} : { newChip })}
                priority={priority && i === 0}
              />
            </li>
          ))}
          <li data-rail-edge="end" aria-hidden="true" className={`${edgeMarker} right-0`} />
        </ul>
      </div>
    </section>
  );
}

export default StayRail;
