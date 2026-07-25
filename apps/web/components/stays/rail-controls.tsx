"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";

/**
 * RailControls — the rail's previous / next affordance, and the only client
 * code the rail ships.
 *
 * It talks to the scroller by id rather than by ref, which is what lets the
 * rail itself, and every card in it, stay a server component. The cost is one
 * `getElementById` in an effect; the saving is thirty-six card trees that never
 * cross the client boundary.
 *
 * End-state detection is an IntersectionObserver rooted on the scroller,
 * watching two zero-size markers at the ends of the track. There is deliberately
 * no `scroll` listener: the disabled state changes twice over a whole rail, and
 * paying for it on every frame of every fling to find that out is the trade
 * this pattern exists to avoid.
 */

const arrowButton =
  "grid size-8 place-items-center rounded-full border border-border-default bg-canvas text-primary " +
  "transition-[transform,border-color,color,opacity] duration-instant ease-decelerate " +
  "hover:border-border-strong active:scale-[0.92] " +
  "disabled:pointer-events-none disabled:border-hairline disabled:text-disabled disabled:opacity-40 " +
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
    if (!first || !last) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === first) setAtStart(entry.isIntersecting);
          if (entry.target === last) setAtEnd(entry.isIntersecting);
        }
      },
      { root, threshold: 0 },
    );
    io.observe(first);
    io.observe(last);
    return () => io.disconnect();
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

  return (
    <div className="hidden shrink-0 items-center gap-2 lg:flex">
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
  );
}

export default RailControls;
