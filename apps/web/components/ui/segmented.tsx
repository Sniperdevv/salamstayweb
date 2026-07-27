"use client";

import { createContext, useContext, useId, type ReactNode } from "react";

import { Phrase } from "@/components/numerals";
import { controlRing, tintTransition } from "@/components/ui";

/**
 * The segmented control — `HOST-SHELL.md` §5's `.seg`, drawn by `hw-001` and put
 * to work by `hw-006` (how much of a listing's location is public).
 *
 * ≤ 4 SEGMENTS, ONE LINE EACH
 * ---------------------------
 * §5 caps it at four and bans two-line segment labels outright. Past four
 * choices the control is a `RadioGroup` of rows, which has room for a hint per
 * option; past one line of label it is `stack`ed (below) or it is the wrong
 * control. Neither limit is enforced in the type system — a `children` count is
 * not something a prop can honestly constrain — so it is stated here and
 * checked by eye.
 *
 * SELECTION IS INK, AND IT IS A FILL
 * ----------------------------------
 * `bg.selected` + `interactive.selectedFg` on the chosen segment, never brand
 * (TASTE §3; §5 restates it for this control by name). Unlike a `RadioRow` there
 * is no ink RING here and no white check: a segmented control is a track of
 * mutually exclusive cells where exactly one is always filled, so the filled
 * cell is unambiguous on its own and a ring would be a second sentence saying
 * the same thing. §11.18's "no fill change" governs option cards, whose contents
 * would shift; a segment's contents are one centred word.
 *
 * NATIVE RADIOS, HIDDEN, NOT REBUILT — THE ROVING TABINDEX IS THE BROWSER'S
 * ------------------------------------------------------------------------
 * Each segment is a `<label>` wrapping an `sr-only` `<input type="radio">`, and
 * the inputs share a `name`. That single attribute buys the whole keyboard
 * contract: ONE tab stop for the group, arrow keys that move focus and selection
 * together, wrap-around at both ends, Home/End, the correct announcement
 * ("City only, radio button, 2 of 2"), and — the part hand-rolled roving
 * tabindex always gets subtly wrong — arrow direction that is already mirrored
 * under RTL. `radio-group.tsx` made this call first and the reasoning is
 * unchanged; re-implementing it with `onKeyDown` and a `tabIndex` ledger would
 * be strictly more code and strictly less correct.
 *
 * `sr-only` rather than `opacity-0` over the segment, which is what the card
 * draws: a transparent hit-testable input stretched across the cell swallows
 * clicks meant for the label. The `<label>` already makes the whole cell a hit
 * target, so nothing is lost.
 *
 * WHY THE FOCUS RING IS `controlRing` AND NOT `focusRing`
 * ------------------------------------------------------
 * `focusRing` puts the ring on the element that receives focus. Here that
 * element is `sr-only` — a 1×1 clipped box — so a ring on it is invisible.
 * `controlRing` is the house answer to exactly this shape: a `peer`-driven
 * overlay drawn over the visible control, naming the same `interactive.focusRing`
 * role, and compiled to `~` rather than `:has()` so a browser without `:has()`
 * still shows focus. It carries no radius of its own, so the segment adds
 * `rounded-sm` to make the ring the segment's shape.
 */

interface SegmentedContextValue {
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

const SegmentedContext = createContext<SegmentedContextValue | null>(null);

export interface SegmentedProps {
  /**
   * The shared `name` the browser groups the radios by. Two segmented controls
   * on one page sharing a name become one control with one selection.
   */
  readonly name: string;
  /**
   * The chosen segment. **Not nullable**, unlike `RadioGroup`'s.
   *
   * `RadioGroup` refuses a seeded default because the guest's party type is an
   * answer only the guest has. A segmented control is a SETTING, and `hw-006`
   * ships it with `Neighbourhood` already chosen — every state of that control
   * is a real, honest answer, and an empty track would be a state the card never
   * draws and the listing could not represent.
   */
  readonly value: string;
  readonly onChange: (value: string) => void;
  /** `aria-label` for the group. Use `labelledBy` instead when a visible label exists. */
  readonly label?: string;
  /** `id` of the visible label or heading the group answers. */
  readonly labelledBy?: string;
  /**
   * §5's `.seghint` — the line under the track that says what the choice
   * changes. Wired to the group with `aria-describedby`, so it is read as part
   * of the control rather than stranded as nearby prose.
   */
  readonly hint?: ReactNode;
  /**
   * Turn the track vertical below `md`.
   *
   * `hw-006`'s narrow panel stacks its two segments rather than shrinking them,
   * because "Neighbourhood" wraps at that width and §5 bans a two-line segment
   * label. It is a prop and not automatic: a `Yes / No` pair has no width
   * problem, and stacking it would turn a precision control into a list for
   * nothing. Turn it on when a label is long enough to wrap.
   *
   * The card's breakpoint is 820px; `md` is 768. 820 is not a rung and an
   * arbitrary `max-[820px]:` variant would be raw px in app code. Flagged.
   */
  readonly stack?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function Segmented({
  name,
  value,
  onChange,
  label,
  labelledBy,
  hint,
  stack = false,
  children,
  className = "",
}: SegmentedProps) {
  const hintId = useId();

  return (
    <SegmentedContext.Provider value={{ name, value, onChange }}>
      <div className={className}>
        {/*
          The track: `bg.sunken` behind a hairline, `radius.md`, 4px of padding
          so the filled segment sits inside the boundary rather than on it.
          TASTE §1 decides both — a track is a form boundary, so it draws a
          border and casts nothing.

          `radius.sm` on the segment against `radius.md` on the track is TASTE
          §4's concentric rule at its smallest: inner radius = outer − padding
          (8 − 4 = 4, and `sm` is the rung that reads as that).
        */}
        <div
          role="radiogroup"
          aria-label={label}
          aria-labelledby={labelledBy}
          aria-describedby={hint ? hintId : undefined}
          className={`flex gap-1 rounded-md border border-hairline bg-sunken p-1 ${
            stack ? "flex-col md:flex-row" : ""
          }`}
        >
          {children}
        </div>

        {hint ? (
          <p
            id={hintId}
            className="mt-2 max-w-[62ch] text-label font-regular leading-normal text-tertiary"
          >
            {/*
              `Phrase` around the whole hint — GO-LIVE A17, and it belongs to
              this component rather than to the sixteen call sites that write
              one. A hint is a SENTENCE, and the sentences that need it are the
              ones a step author naturally writes: `.seghint` on the wizard's
              gas field ends "…finding out at 7 AM in January", whose `.num`
              isolate sat at the end of the run and under RTL took the paragraph
              direction with it, so the line opened `AM in January.`. Isolating
              here means a hint author writes prose and is right by default.
            */}
            <Phrase>{hint}</Phrase>
          </p>
        ) : null}
      </div>
    </SegmentedContext.Provider>
  );
}

export interface SegmentProps {
  /** The value this segment selects. Unique within the control. */
  readonly value: string;
  /** One line. §5 bans a segment label that wraps — shorten it or `stack` the track. */
  readonly children: ReactNode;
  readonly className?: string;
}

export function Segment({ value, children, className = "" }: SegmentProps) {
  const group = useContext(SegmentedContext);
  if (!group) {
    throw new Error("Segment must be rendered inside a Segmented.");
  }

  const checked = group.value === value;

  return (
    <label className={`relative flex-1 cursor-pointer ${className}`}>
      <input
        type="radio"
        className="peer sr-only"
        name={group.name}
        value={value}
        checked={checked}
        onChange={() => group.onChange(value)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`. */}
      <span aria-hidden="true" className={`${controlRing} rounded-sm`} />

      {/*
        `tintTransition` and no press scale. §10 budgets press feedback to the
        CTA, the ± stepper and the calendar's controls; a segment is a selection
        that stays made, and scaling it under the finger would make choosing a
        setting feel like pressing a button. The hover tint is the same
        gray → ink move `.hostnav a.tab:hover` makes on this shell, and Tailwind's
        `hoverOnlyWhenSupported` keeps it off touch devices.
      */}
      <span
        className={`flex min-h-10 items-center justify-center rounded-sm px-2 text-center text-label leading-snug ${tintTransition} ${
          checked
            ? "bg-selected font-semibold text-selected-fg"
            : "font-medium text-secondary hover:text-primary"
        }`}
      >
        {children}
      </span>
    </label>
  );
}

export default Segmented;
