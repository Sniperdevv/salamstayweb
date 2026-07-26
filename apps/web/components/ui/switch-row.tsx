"use client";

import type { ReactNode } from "react";

import { controlRing, fieldHint, fieldName } from "@/components/ui";

/**
 * The host wizard's policy toggle — hw-003's `.swrow` / `.sw`, and the shape
 * HOST-SHELL §16.2 adds to a contract that never had one.
 *
 * THE ON-STATE IS INK, NEVER BRAND GREEN
 * --------------------------------------
 * `interactive.selectedFill` on the track, `interactive.selectedFg` on the knob
 * — exactly `.seg`'s selected segment, which is what this is: the segmented
 * control at switch scale. ha-022 and ha-030 both fill the on-state with
 * `interactive.primary` and that is NOT carried forward. HOST-SHELL §7 budgets
 * the wizard three brand roles (the wordmark dot, the nine-bar `done`/`now`
 * state, the one enabled primary); a green switch would be a fourth, and the
 * house-rules step draws eight of them down one page.
 *
 * THREE SIGNALS, ONLY ONE OF THEM COLOUR
 * --------------------------------------
 *   1. the knob's POSITION — reading-start edge, or reading-end edge
 *   2. the track's WEIGHT — a hairline outline over `bg.sunken`, or a solid ink
 *      fill with the outline removed because the fill has replaced it
 *   3. the row's SECOND LINE, which is rewritten by state
 *
 * (3) is the one that actually matters, and it is why `descriptionOn` and
 * `descriptionOff` are BOTH REQUIRED. The second line is not a description of
 * the control — it is the sentence the GUEST will read, so a host never has to
 * work out what a toggle means. A row that goes silent when it is off is a row
 * whose off-state the host has to infer, so the type does not allow one.
 *
 * NATIVE INPUT, NOT A REBUILT BUTTON
 * ----------------------------------
 * `<input type="checkbox" role="switch">`, `sr-only`, inside the `<label>` that
 * draws the row — the same construction as `Checkbox` and `RadioRow`. The whole
 * row is therefore the hit target, Space toggles it, the browser owns the state
 * and announces "switch, on"/"off" without a line of `onKeyDown`. ha-030 uses a
 * `<button role="switch">` on the phone; on web the input is strictly better and
 * the ARIA is identical. The `<label>` swallows the second line into the
 * accessible name, which is verbose and is exactly what the card intends: the
 * sentence is the point of the row.
 *
 * Controlled, like `Checkbox`, and for the same two reasons: nothing can seed a
 * policy to `true` in a props default, and the step needs the value anyway — it
 * gates the primary, writes the `.capnote` blocking reason, and reveals the
 * quiet-hours sub-field. A `peer-checked:`-driven, script-free variant is
 * possible and was rejected on that second point, not the first.
 *
 * MOTION — THE ONE HONEST ANIMATION ON A WIZARD STEP
 * --------------------------------------------------
 * The knob travels because the host just moved it: an in-place state change they
 * caused, not a page navigation dressed up as one (which is why the nine
 * progress bars still never animate, HOST-SHELL §3). `duration.fast` /
 * `easing.standard`, transform and colour only. Reduced motion DAMPENS to
 * `duration.instant` rather than removing the travel — the knob's position is
 * one of the three signals, so it still has to arrive; it just stops being a
 * journey (CHECKOUT-SHELL §10, "dampen, never remove").
 */

/* -------------------------------------------------------------------------- */

/**
 * THE RTL RULE, WHICH IS NOT OPTIONAL — VERIFIED IN A BROWSER, NOT REASONED ABOUT
 *
 * The knob is pinned with `inset-inline-start`, so it already starts at the
 * correct edge in both directions: left under LTR, right under RTL. The TRAVEL
 * is where it breaks. `translateX` is a PHYSICAL axis — it does not mirror with
 * `direction` the way a logical inset does — so the same `+20px` that carries
 * the knob from the left edge to the right edge under LTR carries it from the
 * right edge OFF THE END OF THE TRACK under RTL. Checked, in Chrome, with
 * `dir="rtl"` on the document: without the `rtl:` override the knob renders at
 * `x = track_width` and is clipped away by the row; with it, it lands flush on
 * the reading-end (left) edge, 2px inset, identical to the LTR mirror image.
 *
 * `rtl:` compiles to `:where([dir="rtl"], [dir="rtl"] *)`, so it keys off the
 * `dir` on `<html>` that the `/ur/` routes already set. Same class of bug, same
 * fix, as `date-range-picker`'s `rtl:-scale-x-100` chevron.
 *
 * The 20px is `space-5` and it is NOT a free number: it is
 * `track (space-11 = 44) − knob (space-5 = 20) − inset (2) − inset (2)`. Change
 * any one of those and this constant is wrong in both directions at once.
 */
const KNOB_TRAVEL = "translate-x-5 rtl:-translate-x-5";

/**
 * 44×24 track, 20px knob, 2px optical inset.
 *
 * The card draws 44×26 with a 3px inset and an 18px travel, and then pushes the
 * track down 5px to sit on the row's first text line. 26 and 3 are not rungs on
 * our spacing scale; 24 is (`space-6`), and it is the row title's own line box
 * at 16/1.5 — so the track lands ON the first line with no margin at all, which
 * is the same alignment reasoning `Checkbox` and `RadioRow` already use for
 * their 24px mark boxes. The knob keeps `space-5`, and the inset drops to the
 * 2px `0.5` rung `fieldHint` already spends. Optically: a 20px knob in a 24px
 * track, which is the proportion the card is after.
 */
const trackBase =
  "relative h-6 w-11 flex-none rounded-full transition-[background-color,box-shadow,transform] duration-fast ease-standard group-active:scale-[0.97] motion-reduce:duration-instant motion-reduce:group-active:scale-100";

/** `bg.sunken` under a 1px `border.default` outline — `.seg`'s resting track. */
const trackOff = "bg-sunken ring-1 ring-inset ring-border-default group-hover:ring-border-strong";

/**
 * Ink fill, outline removed. The removal is deliberate and not tidiness: in dark
 * mode `bg.sunken` is nearly the canvas colour, which is what the outline is
 * FOR, so it may only go once a fill has arrived to do its job.
 */
const trackOn = "bg-selected";

const knobBase =
  "absolute start-0.5 top-0.5 block size-5 rounded-full transition-[transform,background-color] duration-fast ease-standard motion-reduce:duration-instant";

export interface SwitchRowProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  /** The rule's name — "No smoking inside". 16/500 ink. */
  readonly label: ReactNode;
  /**
   * The second line while the switch is ON — the sentence a guest will read.
   * "Guests see: smoking is not permitted indoors."
   */
  readonly descriptionOn: ReactNode;
  /**
   * The second line while the switch is OFF — what a guest reads INSTEAD, never
   * a restatement of the control. "Off, any verified guest can book."
   */
  readonly descriptionOff: ReactNode;
  /**
   * A leading glyph in a `bg.raised` disc. Decorative; the row's name and its
   * sentence are already the accessible name. Size it `size-5`.
   */
  readonly icon?: ReactNode;
  readonly name?: string;
  readonly value?: string;
  /** `id` of a note the row depends on. The sentence itself is not one. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function SwitchRow({
  checked,
  onChange,
  label,
  descriptionOn,
  descriptionOff,
  icon,
  name,
  value,
  describedBy,
  className = "",
}: SwitchRowProps) {
  return (
    /*
      `first:border-t-0` rather than a wrapper rule, exactly as `fieldRow` does:
      the divider belongs to the row that draws it, so a list of these needs no
      component of its own — a `flex flex-col` and nothing else.

      2px of horizontal padding is the focus ring's breathing room. The ring is
      inset (see `controlRing`), so without it the ring would sit flush against
      the row's text on both edges.
    */
    <label
      className={`group relative flex cursor-pointer items-start gap-3 border-t border-hairline px-0.5 py-4 first:border-t-0 ${className}`}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`. The
          card rounds the focused row to `radius.md`; a switch row has no resting
          radius of its own, so the ring carries it. There is no selected ring:
          the track IS the state, and a second ink outline round the whole row
          would say "chosen" about a control that is never one of a set. */}
      <span aria-hidden="true" className={`${controlRing} rounded-md`} />

      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-10 flex-none items-center justify-center rounded-full bg-raised text-secondary"
        >
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className={fieldName}>{label}</span>
        {/* Only the live sentence is rendered. Both would land in the label's
            accessible name, and a screen reader would read the state and its
            opposite back to back. */}
        <span className={fieldHint}>{checked ? descriptionOn : descriptionOff}</span>
      </span>

      <span aria-hidden="true" className={`${trackBase} ${checked ? trackOn : trackOff}`}>
        {/* A `<span>`, where the card writes `<i>` and then has to reset
            `font-style` on it. Nothing here is text. */}
        <span
          className={`${knobBase} ${
            checked ? `bg-selected-fg ${KNOB_TRAVEL}` : "bg-border-strong"
          }`}
        />
      </span>
    </label>
  );
}

export default SwitchRow;
