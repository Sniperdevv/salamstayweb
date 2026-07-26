"use client";

import type { ReactNode } from "react";

import {
  controlRing,
  fieldGroupInvalid,
  hostFieldLabel,
  hostFieldSub,
  tintTransition,
} from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { countUnits, type TextareaCounter } from "@/components/ui/textarea";

/**
 * The host wizard's SINGLE-LINE field — `HOST-SHELL.md` §5's `.fwrap` +
 * `.finput` + `.funit`, drawn by `hw-001` panel A, `hw-004` panels B/C and
 * `hw-006` panel A with the same rule block in all three.
 *
 * IT IS NOT `components/ui/text-input.tsx`, AND THE DIFFERENCE IS THE LABEL
 * ------------------------------------------------------------------------
 * That primitive is the CHECKOUT shell's promo cell (`gw-024`): an `overline`
 * label — 11/600/uppercase/tertiary — sitting INSIDE a `bg.canvas` box above its
 * value, which is a caption over data a guest is reading back. §5 gives the host
 * form a different shell for a different job: a 13/600 INK label ABOVE a
 * `bg.sunken` cell, because a host working through nine screens is answering
 * questions, not reading a summary. That label role is `hostFieldLabel`, and
 * `Textarea` and `Select` already draw the same shell under it. This is the
 * third and last member of that set.
 *
 * WHY THIS ONE HAS A WRAPPER AND THE TEXTAREA DOES NOT
 * ----------------------------------------------------
 * `textarea.tsx` states the rule from the other side and it is worth reading
 * both ways round: a single-line value sits inside `.fwrap` because it has
 * something to sit BESIDE — a unit suffix (`hours`, `Mbps`), a currency prefix —
 * and a multi-line value has nothing beside it, so the textarea carries the
 * border, the radius and the fill itself.
 *
 * That decides where the focus ring goes, which is the only part of this that
 * looks arbitrary until it is drawn. The focusable node here is a BORDERLESS
 * input inside the cell, and a 2px ring hugging a bare text line reads as a
 * second, smaller field inside the first. So the ring is the `controlRing`
 * overlay on the CELL, inset, exactly as `TextInput` answers the identical
 * shape — and NOT `focusRing`, whose 2px-offset ring sits outside the element it
 * is on. `Textarea` uses `focusRing` for the opposite reason: there the field and
 * the cell are the same element, so the ring is simply on it.
 *
 * THE COUNTER IS `Textarea`'s COUNTER, IMPORTED, NOT A SECOND ONE
 * ---------------------------------------------------------------
 * `TextareaCounter` and `countUnits` come from `textarea.tsx` unchanged, so a
 * counted single-line field and a counted multi-line field are ONE idea with one
 * set of rules: no denominator, no colour change (not to red and — the part that
 * is easy to get wrong — not to green), a settled state that swaps the WORD and
 * reveals a check whose box is reserved at `opacity-0` from the first render.
 * Read the ruling where it lives, in `textarea.tsx`; it is not restated here,
 * because two copies of a rule are two chances to edit one of them.
 *
 * A title cannot simply BE a `<textarea rows={1}>`, which is what makes this
 * field necessary rather than convenient: Enter inside a textarea puts a newline
 * in the value, and a listing name with a line break in it is a name no layout
 * on the site can render.
 *
 * `.num` AND A FIELD THE HOST TYPED
 * ---------------------------------
 * BUILD-DECISIONS #2 puts `.num` on every digit run, and an `<input>` holds TEXT
 * — a span cannot go inside it — which is the same wall `hw-004` DECISION 3 hits
 * with the textarea and `select.tsx` hits with `<option>`. The same answer:
 * `numeric` puts `.num` on the CONTROL (`hw-001`'s `class="finput num"`), which
 * makes the run tabular and, under RTL, isolates it back to LTR. Do NOT set it on
 * a field whose value is prose — it would force the whole field LTR. A prose
 * field carries an explicit `dir` instead and no `.num`.
 *
 * `numeric` also filters the value to digits and a single decimal point on the
 * way out, and that is not tidiness: a measured figure is the only thing such a
 * field is for, and letting prose in would put an un-isolatable string inside a
 * `.num` run.
 *
 * REPLACES THREE INLINE COPIES (2026-07-26): `location`'s `fieldShell` /
 * `fieldInput` pair, `practical-facts`'s `UnitField`, and `title-description`'s
 * hand-written title input and counter row. Each of the three authors flagged
 * their own copy as a merge candidate waiting on this file.
 */

/* -------------------------------------------------------------------------- */

/** `.flabel` — §5's field label: 13/600 ink, ABOVE the field. Shared with `Textarea`. */
const fieldLabelBlock = hostFieldLabel;

/** `.fsub` — the note under a field: 13/400 TERTIARY, not `fieldHint`'s secondary. */
const fieldSub = hostFieldSub;

/** Digits and one decimal point. See the `.num` note above. */
const NON_NUMERIC = /[^0-9.]/g;

export interface TextFieldProps {
  /** Required, not `useId()` — the step needs the string for `htmlFor`, for an
   *  error line's `aria-describedby`, and to move focus back here from a banner. */
  readonly id: string;
  /** The `.flabel` — "Listing title", "Wi-Fi speed". 13/600 ink. */
  readonly label: ReactNode;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly name?: string;
  readonly placeholder?: string;
  /**
   * `.funit` — 14/400 secondary, INSIDE the field, trailing. §5: "Never a second
   * control." A unit is a fact about the field, not a thing to choose, so it is
   * `aria-hidden` and the label carries the meaning.
   */
  readonly unit?: ReactNode;
  /** `.fsub` under the field — 13/400 tertiary. */
  readonly hint?: ReactNode;
  /**
   * Explicit direction on a prose field the host types into (hw-004 DECISION 3),
   * so the caret and the first character behave in the language being written
   * rather than in the document's. Leave unset to inherit.
   */
  readonly dir?: "ltr" | "rtl";
  /**
   * For the three fields that make up one postal address. Grouping them for the
   * browser's own address autofill is the difference between one tap and three
   * on the phones this market runs.
   */
  readonly autoComplete?: string;
  /** See the `.num` note above. Puts `.num` on the control, sets `inputMode`,
   *  and filters the value to a measured figure. Never on a prose field. */
  readonly numeric?: boolean;
  readonly counter?: TextareaCounter;
  readonly invalid?: boolean;
  /** `id` of the `fieldErrorLine` below, when there is one. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  name,
  placeholder,
  unit,
  hint,
  dir,
  autoComplete,
  numeric = false,
  counter,
  invalid = false,
  describedBy,
  className = "",
}: TextFieldProps) {
  const count = counter ? countUnits(value, counter.unit) : 0;
  const settled = counter ? count >= counter.settledFrom : false;

  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabelBlock}>
        {label}
      </label>

      {/*
        `relative` only so the ring overlay can be pinned. Everything the eye
        reads as the field — the 48px `space-12` minimum, `radius.md`,
        `border.default`, `bg.sunken` — is on this cell, and the input inside it
        is bare. `Select` puts the same properties on its own focusable node
        because a `<select>` is not borderless; this one cannot.
      */}
      <div
        className={`relative mt-2 flex min-h-12 items-center gap-3 rounded-md border bg-sunken px-4 ${tintTransition} hover:border-border-strong ${
          invalid ? fieldGroupInvalid : "border-border-default"
        }`}
      >
        <input
          id={id}
          name={name}
          type="text"
          dir={dir}
          autoComplete={autoComplete}
          inputMode={numeric ? "numeric" : undefined}
          className={`peer min-w-0 flex-1 border-none bg-transparent p-0 text-bodyMd text-primary outline-none placeholder:text-secondary ${
            numeric ? "num" : ""
          }`}
          value={value}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) =>
            onChange(numeric ? event.target.value.replace(NON_NUMERIC, "") : event.target.value)
          }
        />

        {unit === undefined ? null : (
          <span aria-hidden="true" className="flex-none text-bodySm text-secondary">
            {unit}
          </span>
        )}

        {/* The ring must be a LATER SIBLING of the `peer` input — see
            `controlRing`, which compiles to `~` rather than `:has()` so a
            browser without `:has()` still shows a focus state. */}
        <span aria-hidden="true" className={`${controlRing} rounded-md`} />
      </div>

      {counter ? (
        /*
          `.cmeta` — `Textarea`'s row, byte for byte, because it is the same row.
          `items-baseline` so the fact and the aim sit on one line however the two
          strings wrap, and `justify-between`, which mirrors under RTL for free:
          the count keeps the reading-start edge and the guidance the reading-end
          edge in both directions, with no rule of its own.
        */
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <span className="whitespace-nowrap text-label font-regular text-tertiary">
            {counter.countLabel(<span className="num">{count}</span>)}
          </span>

          <span
            className={`inline-flex items-center gap-2 text-end text-label font-regular ${
              settled ? "text-secondary" : "text-tertiary"
            }`}
          >
            {/*
              In the DOM at rest and simply not painted. Adding the glyph on
              settle would reflow the guidance sideways at the exact moment the
              host earns it; reserving the box means the only thing that changes
              is the word beside it.
            */}
            <CheckMark className={`size-4 flex-none ${settled ? "opacity-100" : "opacity-0"}`} />
            {settled ? counter.guideSettled : counter.guide}
          </span>
        </div>
      ) : null}

      {hint ? <span className={fieldSub}>{hint}</span> : null}
    </div>
  );
}

export default TextField;
