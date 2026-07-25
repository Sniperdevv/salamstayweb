"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { duration } from "@salamstay/design-tokens/motion";
import { btnSecondary, focusRing, inlineAction } from "./ui";

/**
 * GW-014 — the root-layout consent banner.
 *
 * `EXTENDED-GATES.md:201` rules that a legally-required, reasonably-sized
 * cookie-consent overlay is permitted and is NOT an interstitial violation, so
 * this is the one overlay the site mounts on every route.
 *
 * THE ANTI-DARK-PATTERN RULE, WHICH IS THE WHOLE DESIGN
 * ----------------------------------------------------
 * "Accept all" and "Only what's needed" are the SAME COMPONENT at the SAME
 * SIZE with the SAME emphasis — both the TASTE §5 gray-fill secondary button.
 * The card states the reason twice: declining has to be exactly as easy as
 * accepting, and promoting accept to the primary would contradict the
 * marketing-OFF-by-default doctrine the rest of the product ships. There is no
 * pre-selected option and no reject route hidden behind a second screen.
 *
 * This is also why neither button is green. TASTE §2 allows brand green in four
 * roles per surface and exactly one primary CTA among them; the doctrine is
 * that the header CTA yields to a PAGE-OWNED primary, and a consent bar is
 * chrome on every route rather than any page's own call. Promoting Accept would
 * therefore not demote the header — it would add a second green CTA on top of
 * whatever the route already owns, and re-introduce the visual hierarchy the
 * rule above exists to remove.
 *
 * ELEVATION (§1): the bar floats over the page the reader scrolls, so it casts
 * `elevation.floating` and carries NO border. `radius.xl`, the overlay rung.
 *
 * MOTION: one transition, on transform and opacity only, so it composites off
 * the main thread. Enter is `duration.slow` decelerating (the bar is arriving
 * and should settle, not snap); exit is `duration.fast` (the system answering a
 * press the reader already made — TASTE/Emil: slow where the user decides, fast
 * where the system responds). Under `prefers-reduced-motion` the translate is
 * dropped and only the opacity crossfade survives, per the reduced-motion
 * contract in the motion tokens.
 *
 * RENDERING: nothing renders until the effect has read `localStorage`, so the
 * server HTML and the first client render agree (no hydration mismatch) and the
 * banner never appears in the initial HTML the SEO gates parse (G61).
 */

const STORAGE_KEY = "salamstay.cookie-consent";
const RESET_EVENT = "salamstay:cookie-consent-reset";

type Choice = "all" | "essential";

/** Storage can throw (private mode, blocked cookies). A choice we cannot record is a choice we ask for again. */
function readChoice(): Choice | null {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

function writeChoice(choice: Choice): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* Nothing to do: the banner will ask again next visit, which is the honest failure. */
  }
}

/**
 * Exit duration. Read from the token rather than typed: the panel's exit is
 * `duration-fast`, and a hand-copied 180 here is a number that silently stops
 * matching the CSS the day the ladder moves.
 */
const EXIT_MS = duration.fast;

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  /** Drives the enter/exit transition. False on the first painted frame so the transition has somewhere to travel from. */
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (readChoice() === null) setOpen(true);

    const onReset = () => setOpen(true);
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, []);

  /**
   * Flip to the resting state one frame after mount, so the browser has a
   * "from" style to interpolate out of.
   *
   * The timer is not belt-and-braces, it is the correctness case: browsers
   * suspend `requestAnimationFrame` entirely in a hidden tab, so a rAF-only
   * flip leaves the banner mounted at `opacity: 0` — invisible, but present
   * and focusable — for anyone who opens the site in a background tab
   * (cmd-click, a restored session, "open link in new tab"). Verified in
   * Chrome: `document.visibilityState === "hidden"` yields zero rAF ticks in
   * two seconds. Timers still fire there, clamped, so the banner reaches its
   * resting state either way and the tab is simply already settled when the
   * reader arrives — which is right, since nothing should animate in front of
   * someone who was not watching.
   */
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(() => setVisible(true), 80);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [open]);

  const choose = useCallback((choice: Choice) => {
    writeChoice(choice);
    setVisible(false);
    window.setTimeout(() => setOpen(false), EXIT_MS);
  }, []);

  if (!open) return null;

  return (
    <aside
      aria-label="Cookie choices"
      data-visible={visible ? "true" : "false"}
      className={`fixed inset-x-0 bottom-0 z-toast mx-auto max-w-wide px-0 pb-0 sm:px-4 sm:pb-4 md:px-6 md:pb-6
        translate-y-3 opacity-0 transition-[transform,opacity] duration-slow ease-decelerate
        data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100
        data-[visible=false]:pointer-events-none data-[visible=false]:duration-fast
        motion-reduce:translate-y-0 motion-reduce:transition-[opacity] motion-reduce:duration-instant`}
    >
      {/*
        MOBILE IS A FLUSH BOTTOM SHEET, not a floating card in a gutter.

        Below `sm` the inset card spent 32px of a 375px screen on a page gutter
        it did not need — the banner is not in the page's column, it is over it —
        and every pixel it gave back went into a third and fourth line of body
        copy. Flush, the measure is 343 instead of 279 and the same sentence
        fits in two lines instead of four. `rounded-t-xl` only, because the
        bottom corners are off-screen and rounding a corner nobody can see is
        two pixels of nothing. From `sm` up the floating card returns unchanged.

        §1 is satisfied either way: this floats over the page the reader
        scrolls, so it casts `elevation.floating` and draws no border.
      */}
      <div className="flex flex-col gap-3 rounded-t-xl bg-canvas p-4 shadow-floating sm:gap-5 sm:rounded-xl sm:p-5 md:flex-row md:items-center md:gap-8 md:p-6">
        <div className="flex-1">
          <p className="text-bodyMd font-semibold text-primary">
            What SalamStay stores in your browser
          </p>
          {/*
            Two sentences, down from three (closing review). What went: the
            worked example of what "essential" buys ("so you can sign in and
            finish a booking" → "keep you signed in"), and the enumeration of
            the three optional categories.

            The enumeration is not a loss — "the rest" is a STRONGER statement
            than a list of three, because a list invites the question of what
            the fourth thing is, and the four categories are named in full on
            the page this links to. Nothing here nudges: the two sentences say
            what runs and what does not, in that order, and the control below is
            still one pair at one weight.

            Measured, not eyeballed: 28 words to 18, and at a flush 375 the
            paragraph is two lines rather than four.
          */}
          <p className="mt-1.5 max-w-[62ch] text-bodySm text-secondary">
            Essentials keep you signed in and booking. The rest stays{" "}
            <strong className="font-semibold text-primary">off</strong> until you turn it on.{" "}
            <Link href="/legal/cookie-policy" className={inlineAction}>
              Cookie policy
            </Link>
          </p>
        </div>

        {/*
          Identical weight, identical size. Decline sits first: the reader meets
          the quieter choice before the broader one.

          A two-column grid rather than a flex row, because the page's own copy
          says "the two buttons are the same size" and flex would size each to
          its own label — 200px next to 124px, which is a visible hierarchy the
          anti-dark-pattern rule exists to remove. `grid-cols-2` on an auto-width
          track makes both columns the width of the longer label, so the pair is
          matched by construction.

          THEY STACK BELOW `sm`, AND THAT IS ARITHMETIC RATHER THAN TASTE.
          "Only what's needed" measures 152px at the §5 button role (16/500) in
          Inter; half of a flush 375px sheet, less the gap, is 167px, which
          leaves 15px for the button's own horizontal padding — against the §5
          plate's 24px each side. Side by side, the label wraps to two lines,
          and a wrapped CTA is a defect of its own. The pair therefore stacks,
          on a `gap-2` rather than the `gap-3` it used to carry: tighter, since
          the two are read as one choice.

          The labels are card canon (gw-014 §banner: "rendered at identical
          visual weight") and are not ours to shorten to make a row fit.
        */}
        <div className="grid w-full shrink-0 grid-cols-1 gap-2 sm:w-auto sm:grid-cols-2 sm:gap-3">
          <button
            type="button"
            onClick={() => choose("essential")}
            className={`${btnSecondary} w-full`}
          >
            {"Only what's needed"}
          </button>
          <button type="button" onClick={() => choose("all")} className={`${btnSecondary} w-full`}>
            Accept all
          </button>
        </div>
      </div>
    </aside>
  );
}

/**
 * The one real control behind GW-014 §3's "Change it here": it drops the stored
 * choice and brings the banner back, in place, without a reload. Nothing on the
 * cookie page pretends to be a switch — the banner is the control, and this is
 * the way back to it.
 */
export function ConsentResetButton() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* Nothing stored means nothing to clear; the event below still reopens the banner. */
        }
        window.dispatchEvent(new Event(RESET_EVENT));
      }}
      className={`${btnSecondary} ${focusRing} disabled:opacity-60`}
    >
      Change your choice
    </button>
  );
}

export default ConsentBanner;
