"use client";

import type { ReactNode } from "react";

import {
  fieldGroupInvalid,
  focusRing,
  hostFieldLabel,
  hostFieldSub,
  tintTransition,
} from "@/components/ui";
import { Phrase } from "@/components/numerals";
import { CheckMark } from "@/components/ui/marks";

/**
 * The host wizard's multi-line field and the counter under it — hw-004's `.fta`
 * plus `.cmeta` / `.ccount` / `.cguide`, the second shape HOST-SHELL §16.2 adds
 * to the contract.
 *
 * THE FIELD IS THE SHELL
 * ----------------------
 * A single-line value sits inside `.fwrap` because it has a unit suffix or a
 * currency prefix to sit BESIDE. A multi-line value has nothing to sit beside,
 * so the textarea carries the border, the radius and the `bg.sunken` fill
 * itself and there is no wrapper. That also puts the focus ring on the only
 * focusable node, which is where `TextInput` has to work to get it: there the
 * ring goes on the cell because a 2px ring hugging a borderless text line reads
 * as a second, smaller field inside the first. Here the field and the cell are
 * the same element, so the ring is simply on it.
 *
 * THE COUNTER DOES NOT SCOLD
 * --------------------------
 * Three rules, all of them the same rule said three ways:
 *
 *   · THERE IS NO DENOMINATOR. It reads "39 characters", never "39 / 60". The
 *     range is encouragement and never a gate (ha-028: the step's primary stays
 *     enabled purely on non-empty), and a denominator is a budget you can
 *     overspend. Nothing here can be overspent — which is also why this ships
 *     no `maxLength`. A hard cap would be the gate the corpus refused.
 *   · THE COLOUR NEVER CHANGES. Not to red, and — the part that is easy to get
 *     wrong — not to green either. ha-028/ha-029 flip their pill to a success
 *     tint once the value lands in range; that is a fourth brand role on a
 *     surface HOST-SHELL §7 caps at three, and it turns the counter into a small
 *     judge. Colour is not a signal here at all.
 *   · THE SETTLED STATE CHANGES THE WORD and reveals a check glyph. The glyph's
 *     box is reserved at `opacity-0` in the rest state, so the guidance never
 *     shifts sideways the moment the host earns it — the same "nothing moves"
 *     discipline `CheckMark` already ships with inside a radio disc. The
 *     `text.tertiary` → `text.secondary` step is a step within the neutral ramp,
 *     which is emphasis, not a verdict.
 *
 * The counter never animates. It changes on keystroke, and a 120ms tint on
 * every keystroke is a stutter, not feedback.
 *
 * THE ROW EXISTS AT ZERO
 * ----------------------
 * `.cmeta` renders as soon as a `counter` is configured, before there is
 * anything to count, so typing the first character does not push the helper line
 * — and everything below it — down the page.
 *
 * `.num` AND A FIELD THE HOST TYPED
 * ---------------------------------
 * BUILD-DECISIONS #2 puts `.num` on every digit run, and a `<textarea>` holds
 * TEXT — a span cannot go inside it — so the rule physically cannot reach the
 * host's own prose. hw-004 DECISION 3 settles what to do instead: a prose field
 * carries an explicit `dir` and no `.num`, and every figure rendered OUTSIDE the
 * field is isolated normally. Hence the `dir` prop here, and hence `countLabel`
 * receiving an already-isolated node rather than a bare number.
 */

/* -------------------------------------------------------------------------- */

/**
 * `.flabel` — HOST-SHELL §5's field label: 13/600 ink, ABOVE the field.
 *
 * Not `fieldLabel` from `components/ui`. That one is the checkout shell's
 * `overline` (11/600/uppercase/tertiary, CHECK-IN / GUESTS / PROMO CODE) sitting
 * INSIDE a bordered cell above its value; this is the host shell's own label
 * sitting outside the field, in ink, at reading weight. Two labels, two shells.
 *
 * The pair now lives in `components/ui` as `hostFieldLabel` / `hostFieldSub`
 * (hoisted 2026-07-26, under exactly the names this file and `select.tsx` each
 * independently proposed for it).
 */
const fieldLabelBlock = hostFieldLabel;

/** `.fsub` — the note under a field: 13/400 TERTIARY, not `fieldHint`'s secondary. */
const fieldSub = hostFieldSub;

/** What a field's counter is spending. Two units, and they differ on purpose. */
export type CountUnit = "characters" | "words";

/**
 * The count, as the counter renders it — exported because the STEP needs the
 * same number the field is showing.
 *
 * Characters are counted as code points (`Array.from`), not UTF-16 units, so a
 * title written in Urdu is not billed twice for a single letter. Words are
 * whitespace-separated runs, which is as true of Urdu prose as of English.
 *
 * A title counts CHARACTERS because a title is truncated by layout at a width,
 * so characters are the thing the host is actually spending. A description
 * counts WORDS because a character count on prose is a number no writer can act
 * on (ha-028 / ha-029).
 */
export function countUnits(value: string, unit: CountUnit): number {
  if (unit === "words") {
    const trimmed = value.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/u).length;
  }
  return Array.from(value).length;
}

export interface TextareaCounter {
  readonly unit: CountUnit;
  /**
   * The fact, on the reading-start edge.
   *
   * It receives the count ALREADY WRAPPED in `.num`, so a caller writes
   * `(count) => <>{count} characters</>` and cannot ship an un-isolated digit
   * run that reverses inside Urdu prose. Reach for `countUnits()` if the step
   * needs the raw number for something else.
   *
   * Whatever the caller composes around that node is wrapped in a `Phrase` by
   * the row that renders it, so the label reads as one run under RTL rather
   * than letting the isolated digit slide past its own unit word (A17). Write
   * the label as prose and do not add a `dir` of your own.
   */
  readonly countLabel: (count: ReactNode) => ReactNode;
  /** The aim, on the reading-end edge, before it is met — "Aim for 30 to 60". */
  readonly guide: ReactNode;
  /** The aim once it is met. A different WORD — "Good length" — never a colour. */
  readonly guideSettled: ReactNode;
  /**
   * How many units settle the guidance. NEVER RENDERED: this is the threshold
   * that swaps a word, not a denominator, and it has no upper bound because
   * there is nothing here to overspend.
   */
  readonly settledFrom: number;
}

export interface TextareaProps {
  /** Required, not `useId()` — the step needs the string for `htmlFor`, for an
   *  error line's `aria-describedby`, and to move focus back here from a banner. */
  readonly id: string;
  /** The `.flabel` — "Listing description". 13/600 ink. */
  readonly label: ReactNode;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly name?: string;
  readonly placeholder?: string;
  /**
   * Height, in lines. `rows` and not a `min-height`: the card fixes one height
   * for the description step and a shorter one for the house-rules step, and the
   * honest way to say "this wants a paragraph" versus "this wants a sentence or
   * two" is the number of lines, not a pixel value that has to be re-derived
   * every time the type role moves.
   */
  readonly rows?: number;
  /** `.fsub` under the counter — 13/400 tertiary. */
  readonly hint?: ReactNode;
  /**
   * Explicit direction on a prose field the host types into (hw-004 DECISION 3),
   * so the caret and the first character behave in the language being written
   * rather than in the document's. Leave unset to inherit.
   */
  readonly dir?: "ltr" | "rtl";
  readonly counter?: TextareaCounter;
  readonly invalid?: boolean;
  /** `id` of the `fieldErrorLine` below, when there is one. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function Textarea({
  id,
  label,
  value,
  onChange,
  name,
  placeholder,
  rows = 6,
  hint,
  dir,
  counter,
  invalid = false,
  describedBy,
  className = "",
}: TextareaProps) {
  const count = counter ? countUnits(value, counter.unit) : 0;
  const settled = counter ? count >= counter.settledFrom : false;

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelBlock}>
        {label}
      </label>

      {/*
        `resize-y`: a host writing a long description may want more room, and
        `resize-none` would take that away to protect a layout that is a single
        centred column with nothing beside it to break. Horizontal resize IS
        removed — the 640 column is the reading measure and dragging past it is
        never an improvement.
      */}
      <textarea
        id={id}
        rows={rows}
        dir={dir}
        className={`mt-2 block w-full resize-y rounded-md border bg-sunken px-4 py-3 text-bodyMd text-primary placeholder:text-secondary hover:border-border-strong ${tintTransition} ${focusRing} ${
          invalid ? fieldGroupInvalid : "border-border-default"
        }`}
        name={name}
        value={value}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />

      {counter ? (
        /*
          `items-baseline`, so the fact and the aim sit on one line however the
          two strings wrap — and `justify-between`, which mirrors under RTL for
          free: the count keeps the reading-start edge and the guidance the
          reading-end edge in both directions, with no rule of its own.
        */
        <div className="mt-2 flex items-baseline justify-between gap-4">
          {/*
            `Phrase` around the RETURN of `countLabel`, and it is this file's job
            rather than the caller's — GO-LIVE A17.

            The prop hands the caller a number that is already a `.num` isolate
            and asks for prose around it: `(count) => <>{count} characters</>`.
            That shape guarantees the bug — the isolate lands on the digit and
            `characters` stays loose in the RTL flow, and this rendered
            `characters 0` on the title-description step. A contract that makes
            the wrong thing the natural thing has to carry the fix itself, so the
            isolate goes around whatever the caller composed. Every existing
            `countLabel` becomes correct without being touched, and so does the
            next one somebody writes.
          */}
          <span className="whitespace-nowrap text-label font-regular text-tertiary">
            <Phrase>{counter.countLabel(<span className="num">{count}</span>)}</Phrase>
          </span>

          <span
            className={`inline-flex items-center gap-2 text-end text-label font-regular ${
              settled ? "text-secondary" : "text-tertiary"
            }`}
          >
            {/*
              In the DOM at rest and simply not painted. Adding the glyph on
              settle would reflow the guidance sideways at the exact moment the
              host is reading it; reserving the box means the only thing that
              changes is the word beside it.
            */}
            <CheckMark className={`size-4 flex-none ${settled ? "opacity-100" : "opacity-0"}`} />
            {/* The guide is prose with a range in it — "Aim for 30 to 60" — so
                it is a `Phrase` too. Nested INSIDE the flex row rather than on
                it: `dir` on a flex container remaps `row` to the resolved
                direction, which would move the check to the other side of the
                sentence (A17's fix must never change layout). */}
            <span>
              <Phrase>{settled ? counter.guideSettled : counter.guide}</Phrase>
            </span>
          </span>
        </div>
      ) : null}

      {hint ? <span className={fieldSub}>{hint}</span> : null}
    </div>
  );
}

export default Textarea;
