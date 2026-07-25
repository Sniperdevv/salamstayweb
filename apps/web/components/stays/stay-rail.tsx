import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { focusRing, inlineAction } from "@/components/ui";
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

/**
 * The trailing link. Hidden below `sm`, because a phone cannot hold both: at
 * 375 the row is 343px wide and "Stays in F-7, Islamabad" alone measures 266,
 * so the heading — which is the more important of the two, and the section's
 * accessible name — truncates to "Stays in F-7, Isla…" to make room for a
 * secondary link. Shortening the label does not save it; the arithmetic fails
 * for any label longer than about four characters. From `sm` up both fit with
 * room to spare. Nothing is lost on a phone: the link's destination is the
 * city page, which the city grid and the footer both link to, and the anchor
 * stays in the server HTML either way (G37).
 *
 * Treatment: TASTE-RULES §8 — ink, underlined AT REST, never brand. Airbnb runs
 * both forms and so do we: a section-header link like this one is an inline
 * text action, and a section-BOTTOM action ("Show all 42 stays") is the §5
 * gray-fill secondary button. Which one an action gets is decided by where it
 * sits, not by how important it feels.
 */
const viewAllLink = `hidden sm:inline-flex items-center gap-1 text-bodySm font-medium ${inlineAction}`;

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
  /**
   * One promoted element between the heading row and the scroller — in
   * practice a `FeaturedStayCard`, the horizontal card from the TASTE-RULES
   * §10 recipe carrying the first home of the row.
   *
   * It sits OUTSIDE the scroller deliberately. The featured card is the one
   * card family on the site that genuinely floats (§1: shadow means the
   * element is above the page you are scrolling), and a floating card inside
   * an `overflow-x: auto` box has its shadow clipped on three sides by the
   * scroll port — which is the difference between a card that is lifted and a
   * card with a smudge under it. Above the track it keeps its elevation, it
   * keeps the section's single `<h2>`, and the row beneath it stays a plain
   * eight-card rail.
   */
  readonly lead?: ReactNode;
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
  lead,
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
        {/* `h5` (20), not `h4` (24) — TASTE-RULES §7 puts content-page section
            headings at ≈22, and this is the role every other section heading
            on every discovery surface reads from `components/discovery/shell`. */}
        <h2 id={headingId} className="min-w-0 truncate text-h5 text-primary">
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

      {/* `mt-5` is the shared heading-to-content gap; the scroller's own `mt-5`
          then becomes the gap from the lead card down to the row. One value,
          twice, so the promoted card sits in the section's rhythm rather than
          on a spacing of its own. */}
      {lead ? <div className="mt-5">{lead}</div> : null}

      <div id={scrollerId} className={`${scroller} ${hideScrollbar}`}>
        {/* `data-rail-item` on each card: `RailControls` observes them to derive
            the §10 "1 / N" counter. A data attribute rather than a ref array,
            for the same reason the arrows find the scroller by id — it keeps
            the rail and every card in it a server component.

            `w-max` is load-bearing: an auto-width flex container fills the
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
              data-rail-item=""
              className="w-rail-card shrink-0 snap-start"
            >
              {/* `titleSize="rail"` — §7's ONE sanctioned 14/600 title, and
                  the only place on the site that claims it: these tiles are
                  `w-rail-card` (208px), which is the exact width the exception
                  is written for. Every other call site of this card draws a
                  grid tile and gets the ladder's 16. */}
              <StayCardCompact
                stay={stay}
                titleSize="rail"
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
