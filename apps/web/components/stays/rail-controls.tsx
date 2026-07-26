"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";

/**
 * RailControls — the rail's previous / next affordance and its position
 * counter, and the only client code the rail ships.
 *
 * It talks to the scroller by id rather than by ref, which is what lets the
 * rail itself, and every card in it, stay a server component. The cost is one
 * `getElementById` in an effect; the saving is thirty-six card trees that never
 * cross the client boundary.
 *
 * THERE IS NO SCROLL LISTENER, and the counter did not add one.
 * -----------------------------------------------------------
 * End-state detection is an IntersectionObserver rooted on the scroller,
 * watching two zero-size markers at the ends of the track. The disabled state
 * changes twice over a whole rail, and paying for that on every frame of every
 * fling is the trade this pattern exists to avoid.
 *
 * The "1 / N" counter (TASTE-RULES §10, §11.8) is the SAME observer, widened to
 * the cards: every `[data-rail-item]` is observed at a 0.9 threshold, so the
 * component always knows which cards are fully in view. The lowest visible
 * index divided by the page size is the current page. An observer fires when a
 * card crosses the edge — a handful of times per rail — where a scroll handler
 * would fire sixty times a second to answer the same question.
 *
 * Page size is geometry, not a guess: the pitch between two adjacent cards
 * (`offsetLeft` difference) divides the visible width. A `ResizeObserver` on the
 * scroller recomputes it, so a rail that shows six cards on a desktop and two on
 * a tablet counts in sixes and twos rather than in a number measured once at
 * mount.
 */

/**
 * Disabled is TWO token roles and no opacity (§1, §11.7). The redline wants a
 * control that cannot act to stay visible and in place — flat, legible, holding
 * its position — and `text.disabled` is already tuned to exactly that reading:
 * communicative, not readable-as-content. A raw `opacity-40` on top compounded
 * against an ink that had already been dimmed once, and being a whole-element
 * filter it faded the chevron independently of the ink role, so the glyph
 * disappeared faster than the border did. Faded is not the same signal as
 * disabled; `components/search/filter-chip.tsx` states the same rule with token
 * roles alone.
 */
const arrowButton =
  "grid size-8 place-items-center rounded-full border border-border-default bg-canvas text-primary " +
  "transition-[transform,border-color,color] duration-instant ease-decelerate " +
  "hover:border-border-strong active:scale-[0.92] " +
  "disabled:pointer-events-none disabled:border-hairline disabled:text-disabled " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

export interface RailControlsProps {
  /** `id` of the scroll container these arrows drive. */
  readonly scrollerId: string;
  /** Names the rail in each button's accessible label. */
  readonly label: string;
}

export function RailControls({ scrollerId, label }: RailControlsProps) {
  const scroller = useRef<HTMLElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  /** Lowest card index currently in view; drives the page number. */
  const [firstVisible, setFirstVisible] = useState(0);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const root = document.getElementById(scrollerId);
    if (!root) return;
    scroller.current = root;

    // One geometry read at mount, so the arrows are right on the first paint
    // rather than on the observer's first tick. It also keeps them honest in a
    // tab that is never visible, where the browser suspends the rendering steps
    // an IntersectionObserver runs in and the first callback never arrives.
    setAtStart(root.scrollLeft <= 1);
    setAtEnd(root.scrollLeft + root.clientWidth >= root.scrollWidth - 1);

    const first = root.querySelector('[data-rail-edge="start"]');
    const last = root.querySelector('[data-rail-edge="end"]');
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-item]"));
    if (!first || !last) return;

    setTotal(items.length);

    /**
     * Cards per view, from the real pitch between two neighbours (card width
     * plus the flex gap) rather than from a hard-coded 208. `floor`, because a
     * card the reader can only half see is not a card on this page.
     */
    const measure = () => {
      const [a, b] = items;
      const pitch = a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? 0);
      setPerPage(pitch > 0 ? Math.max(1, Math.floor(root.clientWidth / pitch)) : 1);
    };
    measure();

    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === first) {
            setAtStart(entry.isIntersecting);
            continue;
          }
          if (entry.target === last) {
            setAtEnd(entry.isIntersecting);
            continue;
          }
          const i = items.indexOf(entry.target as HTMLElement);
          if (i < 0) continue;
          if (entry.isIntersecting) visible.add(i);
          else visible.delete(i);
        }
        if (visible.size > 0) setFirstVisible(Math.min(...visible));
      },
      // Two thresholds, one observer: the edge markers are zero-size and
      // register at any ratio above 0, and the cards need "essentially whole"
      // so a two-pixel sliver at the fold does not claim the page.
      { root, threshold: [0, 0.9] },
    );
    io.observe(first);
    io.observe(last);
    for (const item of items) io.observe(item);

    const ro = new ResizeObserver(measure);
    ro.observe(root);

    return () => {
      io.disconnect();
      ro.disconnect();
    };
  }, [scrollerId]);

  /**
   * One visible width per press. Reduced motion gets an instant jump: a
   * thousand-pixel smooth scroll is exactly the large-surface travel the
   * preference exists to switch off.
   */
  const page = useCallback((direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  // Pointer affordance only, so it is hidden where there is no pointer to
  // afford. Touch flings the rail; the keyboard already pages a focused
  // scroller with the arrow keys. Neither route depends on these buttons.
  // When the track fits (atStart && atEnd) the rail is not a scroller and the
  // controls must not exist: greyed-out pairs on every wide desktop read as a
  // broken build (review B1).
  if (atStart && atEnd) return null;

  const pages = Math.max(1, Math.ceil(total / perPage));
  // The last page is pinned when the track is at its end: the final view of a
  // rail whose card count is not a multiple of the page size overlaps the one
  // before it, and counting from the first visible index alone would report
  // "2 / 3" while the reader is looking at the end of the row.
  const current = atEnd ? pages : Math.min(pages, Math.floor(firstVisible / perPage) + 1);

  return (
    <div className="hidden shrink-0 items-center gap-3 lg:flex">
      {/* §10's counter. `aria-hidden`: the buttons are already named, the rail
          is a labelled scroll region, and a position readout that re-announces
          on every fling is noise in place of information. `.num` alone sets the
          tabular figures — `font-variant-numeric: tabular-nums` is in the rule
          itself (`app/globals.css`) — so 9 → 10 does not shift the arrows
          sideways and a `tabular-nums` utility beside it would be the same
          declaration written twice. */}
      {pages > 1 ? (
        <span aria-hidden="true" className="num text-label text-secondary">
          {current} / {pages}
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label={`Scroll ${label} back`}
          className={`${arrowButton} ${focusRing}`}
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label={`Scroll ${label} forward`}
          className={`${arrowButton} ${focusRing}`}
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default RailControls;
