"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { focusRing, pressable } from "@/components/ui";
import { shell } from "@/components/discovery/shell";
import { priceSkeleton, stickyUnderHeader } from "./shell";

/**
 * Sticky anchor bar — TASTE-RULES §10: "tabs 16/500 ink, hairline bottom, NO
 * shadow ever; price + CTA cluster fades in only after the booking card scrolls
 * away."
 *
 * Every clause of that is load-bearing:
 *
 * - **Hairline, never a shadow.** §1 governs: a shadow means the element floats
 *   over content the reader scrolls. This bar does not float — it IS the page,
 *   pinned. The header above it takes `elevation.subtle` once scrolled because
 *   it is chrome over the document; a second shadowed bar eight pixels under it
 *   would read as two floating planes stacked, which is the exact "layered
 *   dashboard" look quiet-modern does not have.
 * - **Tabs at 16/500 ink, no underline at rest.** §8's underline-at-rest binds
 *   inline text ACTIONS inside prose (Share, Save, Show more). These are
 *   navigation tabs in their own chrome, and §10 states their treatment
 *   exactly. The underline arrives on hover, as it does in the footer, which is
 *   the site's other deliberate suspension of the same rule.
 * - **The cluster fades in only after the card is gone.** Two identical CTAs on
 *   screen at once is two primary actions competing; the bar's copy of it
 *   exists precisely for the scroll positions where the card is not there.
 *
 * ── No scroll listener ───────────────────────────────────────────────────
 * One IntersectionObserver, rooted on the viewport, watching the booking card
 * itself. `onScroll` would run this arithmetic on every frame of every scroll
 * for one boolean; the observer runs it when the answer changes and nowhere
 * else. The same trick the site header uses for its scrolled state and the
 * stay rail uses for its arrow-disabled state — three surfaces, one technique,
 * zero per-frame work on the main thread.
 *
 * `rootMargin` shortens the viewport from the top by the sticky chrome's own
 * height, so "the card scrolled away" means "the card is behind the header and
 * this bar", not "the card's last pixel left the window". Without it the CTA
 * arrives late by exactly the height of the two bars.
 *
 * On mobile the booking card stacks at the foot of the body, so it is off
 * screen from the first paint and the cluster is simply present — which is the
 * behaviour a phone wants anyway, and it costs no extra code path.
 *
 * ── Motion ───────────────────────────────────────────────────────────────
 * Opacity plus a 4px rise, 180ms, decelerating. It is an entrance, so it eases
 * OUT; `ease-in` on an element the eye is already tracking reads as lag. Under
 * `motion-reduce` the rise goes and the crossfade stays — reduced motion means
 * gentler, not absent. Hidden state is `pointer-events-none` AND `tabIndex=-1`
 * on the link, because a faded-out CTA that still takes a tab stop is a
 * keyboard trap that no sighted user can see.
 */

const tab =
  "-mx-1 rounded-md px-1 py-1 text-bodyMd font-medium text-primary underline-offset-8 " +
  "transition-colors duration-instant ease-decelerate hover:underline " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant motion-reduce:ease-decelerate";

const cta =
  "inline-flex h-10 select-none items-center justify-center rounded-full bg-interactive px-5 text-bodySm font-semibold text-on-brand hover:bg-interactive-hover";

export interface ListingAnchorBarProps {
  readonly anchors: readonly { readonly href: string; readonly label: string }[];
  readonly per: string;
  readonly cta: { readonly href: string; readonly label: string };
  /** DOM id of the booking card this bar mirrors. */
  readonly watchId: string;
}

export function ListingAnchorBar({ anchors, per, cta: action, watchId }: ListingAnchorBarProps) {
  const [cardAway, setCardAway] = useState(false);

  useEffect(() => {
    const card = document.getElementById(watchId);
    if (!card) return;

    const io = new IntersectionObserver(
      ([entry]) => setCardAway(entry ? !entry.isIntersecting : false),
      // 64px header + 56px bar: the card counts as away once it is behind them.
      { rootMargin: "-120px 0px 0px 0px", threshold: 0 },
    );
    io.observe(card);
    return () => io.disconnect();
  }, [watchId]);

  return (
    <div className={`sticky ${stickyUnderHeader} z-sticky border-b border-hairline bg-canvas`}>
      <div className={`${shell} flex h-14 items-center justify-between gap-4`}>
        <nav aria-label="On this page" className="flex min-w-0 items-center gap-4 sm:gap-6 md:gap-7">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className={`${tab} ${focusRing}`}>
              {a.label}
            </a>
          ))}
        </nav>

        <div
          aria-hidden={!cardAway}
          className={
            "flex shrink-0 items-center gap-4 transition-[opacity,transform] duration-fast ease-decelerate " +
            "motion-reduce:transition-[opacity] motion-reduce:duration-instant motion-reduce:translate-y-0 " +
            (cardAway ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0")
          }
        >
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span aria-hidden="true" className={priceSkeleton} />
            <span className="text-bodySm text-secondary">{per}</span>
          </span>
          <Link
            href={action.href}
            tabIndex={cardAway ? undefined : -1}
            className={`${cta} ${focusRing} ${pressable}`}
          >
            {action.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingAnchorBar;
