"use client";

import type { ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { fieldGroupInvalid, focusRing, hostFieldLabel, hostFieldSub } from "@/components/ui";

/**
 * The host wizard's one-of-N field — hw-003's `.sel` / `.selv`, drawn as
 * HOST-SHELL §5 specifies it: "same shell as the text field, chevron trailing,
 * `aria-haspopup="listbox"`."
 *
 * IT IS A NATIVE `<select>`, AND THAT IS THE WHOLE DESIGN DECISION
 * ---------------------------------------------------------------
 * The cards draw `<button type="button" aria-haspopup="listbox">` with the
 * chosen value inside a `.selv` span. They have to: a card is one static file
 * with no script, so it cannot ship a popup, and it renders the trigger and
 * leaves the list to the build. That is a card constraint, not a component
 * ruling — and the ARIA it hand-writes is exactly what a native `<select>`
 * already exposes. A `<select>` maps to `combobox` with `haspopup="listbox"`
 * and an owned listbox of `option`s, for free and correctly.
 *
 * What a native control buys, none of which is re-implementable to the same
 * standard in a primitive: the arrow keys, Home/End, typeahead, the single tab
 * stop, Escape, the correct announcement ("Quiet hours start, combo box,
 * 10:00 PM, 1 of 24"), the popup's own positioning and viewport flipping, RTL
 * ordering of the list, and — on the market this ships to first — the OS wheel
 * picker rather than a scrolling div on a mid-range Android. This is the same
 * argument `RadioGroup` already makes for hiding native radios instead of
 * rebuilding a roving-tabindex group, and it is the stronger one here, because
 * a hand-rolled listbox also owes a portal, a focus trap and a positioner that
 * this repo has nowhere to put yet.
 *
 * THE COST, STATED
 * ----------------
 * An `<option>` holds TEXT, so a `.num` span cannot go inside one — the same
 * wall hw-004 DECISION 3 hits with the textarea, and the same answer: a field
 * whose values are numeric carries `.num` on the ELEMENT (`numeric` below,
 * hw-001's `class="finput num"` pattern), and prose options are left to the
 * bidi algorithm with an explicit `dir` on the control. A value that mixes Urdu
 * prose with several separate digit runs is the one case this cannot isolate
 * per-run; no `<select>` anywhere can, and the alternative costs everything in
 * the paragraph above.
 *
 * THE LABEL IS ALWAYS REAL TEXT
 * -----------------------------
 * hw-003 gives the check-in selects a visible `.flabel` and the quiet-hours
 * sub-fields an `aria-label` instead, because they sit under the switch that
 * reveals them and a second label would be noise. Both go through `label` here;
 * `labelHidden` moves it to `sr-only` rather than swapping in an `aria-label`
 * string, so the accessible name is the same node as the visible copy and the
 * two cannot drift apart in translation.
 */

/* -------------------------------------------------------------------------- */

/**
 * `.flabel` / `.fsub` — HOST-SHELL §5's field label and note, hoisted to
 * `components/ui.ts` as `hostFieldLabel` / `hostFieldSub` on 2026-07-26. They
 * were private copies here and in `textarea.tsx`, which was the right call while
 * both files were being written in parallel and the wrong one to leave standing.
 */
const fieldLabelBlock = hostFieldLabel;
const fieldSub = hostFieldSub;

/**
 * The trailing chevron — hw-003's `.sel svg`, the corpus path.
 *
 * It is here and not in `components/icons.tsx` for the same reason `marks.tsx`
 * exists: that file is owned by another agent in this wave and there is no
 * `ChevronDownIcon` in it yet. Merge candidate, flagged, not a design decision.
 * It does not mirror under RTL — it points down, and down is not directional.
 */
function ChevronDown({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export interface SelectOption {
  readonly value: string;
  /**
   * Plain text — an `<option>` cannot hold markup. Compose the whole value here
   * ("From 10:00 PM"), not a fragment the shell completes.
   */
  readonly label: string;
  readonly disabled?: boolean;
}

export interface SelectProps {
  /** Required, not `useId()` — the step needs it for `htmlFor` and for focus. */
  readonly id: string;
  /** The `.flabel` — "Quiet hours start". 13/600 ink. */
  readonly label: ReactNode;
  /**
   * Renders the label `sr-only`. For a sub-field the revealing control already
   * names — hw-003's quiet-hours pair under the switch.
   */
  readonly labelHidden?: boolean;
  /** `""` until the host chooses. Never seed a plausible default. */
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly SelectOption[];
  /**
   * The unchosen state, rendered as a disabled first `<option>` so it can be
   * shown but never re-chosen. `text.secondary`, never tertiary — §5 is explicit
   * that an empty value is secondary.
   */
  readonly placeholder?: string;
  readonly name?: string;
  /** `.fsub` under the field — 13/400 tertiary. */
  readonly hint?: ReactNode;
  /**
   * For a field whose every option is numeric — an hour, a year, a count.
   * Puts `.num` on the control so the run is tabular and, under RTL, isolated
   * back to LTR. Do NOT set it on a field whose options are prose: it would
   * force the whole list LTR.
   */
  readonly numeric?: boolean;
  readonly invalid?: boolean;
  /** `id` of the `fieldErrorLine` below, when there is one. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function Select({
  id,
  label,
  labelHidden = false,
  value,
  onChange,
  options,
  placeholder,
  name,
  hint,
  numeric = false,
  invalid = false,
  describedBy,
  className = "",
}: SelectProps) {
  const unchosen = value === "";

  return (
    <div className={className}>
      <label htmlFor={id} className={labelHidden ? "sr-only" : fieldLabelBlock}>
        {label}
      </label>

      {/*
        `relative` only so the chevron can be pinned. The BOX is the select
        itself — border, radius, `bg.sunken`, the 48px `space-12` minimum and
        the focus ring all sit on the one focusable node, which is what
        `TextInput` has to fake with an overlay because its input is borderless
        inside a cell. Nothing here is a box in a box.
      */}
      <div className={`relative ${labelHidden ? "" : "mt-2"}`}>
        <select
          id={id}
          name={name}
          value={value}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
          /*
            `pe-12` clears the chevron: `space-4` inset + `space-5` glyph +
            `space-3` of air. `appearance-none` removes the UA's own arrow, which
            would otherwise sit beside ours.

            `active:scale-[0.995]` is HOST-SHELL §10's press depth for a field-
            sized surface, not `pressable`'s 0.97 — scale is optical, and 0.97 on
            a 640px-column control is a 20px lurch where the same factor on a
            44px circle is barely 1px.

            The transition list is spelled out rather than composed from
            `tintTransition` + `transition-transform`: both set
            `transition-property`, and which one wins depends on the order
            Tailwind happens to emit them in, not on the order they are written
            here. One declaration, no coin-toss.
          */
          className={`block min-h-12 w-full appearance-none rounded-md border bg-sunken ps-4 pe-12 text-bodyMd transition-[background-color,border-color,color,transform] duration-instant ease-decelerate hover:border-border-strong active:scale-[0.995] motion-reduce:active:scale-100 ${
            numeric ? "num" : ""
          } ${unchosen ? "text-secondary" : "text-primary"} ${
            invalid ? fieldGroupInvalid : "border-border-default"
          } ${focusRing}`}
        >
          {placeholder !== undefined ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* `pointer-events-none` so the whole field, chevron included, opens the
            list. `end-4` is logical, so it moves to the left edge under RTL with
            no rule of its own. */}
        <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-5 -translate-y-1/2 text-secondary" />
      </div>

      {hint ? <span className={fieldSub}>{hint}</span> : null}
    </div>
  );
}

export default Select;
