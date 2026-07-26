"use client";

import type { ReactNode } from "react";

import {
  controlRing,
  fieldGroupInvalid,
  fieldLabel,
  tintTransition,
} from "@/components/ui";

/**
 * A single-cell form group with its label INSIDE it — gw-024's promo field.
 *
 * WHY THE LABEL IS AN `overline` AND WHY IT LIVES IN THE BOX
 * ----------------------------------------------------------
 * TASTE §7 makes `overline` (11/600/uppercase/+0.04em) a FORM-LABEL token and
 * nothing else — CHECK-IN, GUESTS, PROMO CODE — with zero section eyebrows
 * anywhere on the site. Sitting it above the value inside the same bordered
 * cell is the booking card's own anatomy (§10: "form group with hairline-divided
 * cells; `overline` labels; values 14/400"), so a promo field and a check-in
 * cell read as the same object rather than two ideas about what an input is.
 *
 * It is a real `<label htmlFor>`, not a placeholder doing double duty. A
 * placeholder-as-label disappears the moment the guest types, which is exactly
 * when they most need to know what the box wants — and it never reaches a
 * screen reader as a name at all. The placeholder here says "Enter a code",
 * which is an instruction, and it is `text.secondary` rather than tertiary per
 * §5's explicit note on empty values.
 *
 * `id` IS REQUIRED
 * ----------------
 * Not `useId()`. The step needs the same string for `htmlFor`, for the error
 * line's `aria-describedby`, and — on the error panel — to move focus back to
 * the field it is talking about. A generated id is unusable for the last two,
 * and a hook here would also stop this from ever being rendered on the server.
 *
 * WHAT IS NOT HERE
 * ----------------
 * The Apply button beside it. gw-024 pairs the field with the §5 gray-fill
 * secondary (`btnSecondary`, already in `ui.ts`) in a flex row, and pulling the
 * button inside would make every other text field on the site carry a slot it
 * does not want.
 */

export interface TextInputProps {
  /** Required — see above. Links label, field and any error line. */
  readonly id: string;
  /** The `overline` label — "Promo code". */
  readonly label: ReactNode;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly name?: string;
  readonly placeholder?: string;
  /**
   * `inputMode` is deliberately unset by default and typed to the real HTML
   * values. gw-024 ships `inputmode="latin"`, which was removed from the spec
   * years ago and resolves to nothing — copying it would put a dead attribute
   * on every field in the flow.
   */
  readonly inputMode?: "text" | "numeric" | "decimal" | "tel" | "email" | "url" | "search";
  readonly autoComplete?: string;
  readonly invalid?: boolean;
  /** `id` of the `fieldErrorLine` below, when there is one. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function TextInput({
  id,
  label,
  value,
  onChange,
  name,
  placeholder,
  inputMode,
  autoComplete,
  invalid = false,
  describedBy,
  className = "",
}: TextInputProps) {
  return (
    /*
      Not `fieldGroup`: this cell owns its own padding (the label and the value
      are two lines inside ONE cell, not two rows), and it stretches to whatever
      the row beside it is — the Apply button is 48px — so it takes no
      max-width of its own. Border, radius and the invalid edge are the same
      roles `fieldGroup` names.
    */
    <div
      className={`relative min-w-0 flex-1 rounded-md border bg-canvas px-4 py-3 ${tintTransition} ${
        invalid ? fieldGroupInvalid : "border-border-default"
      } ${className}`}
    >
      <label htmlFor={id} className={fieldLabel}>
        {label}
      </label>

      {/*
        Borderless and transparent: the CELL is the input's visible boundary, so
        a second border inside it would be a box in a box — the same rule that
        keeps gw-021's calendar out of a card (§5: "box-in-box is banned").
      */}
      <input
        id={id}
        type="text"
        className="peer mt-1 block w-full border-none bg-transparent p-0 text-bodyMd text-primary outline-none placeholder:text-secondary"
        name={name}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />

      {/*
        The focus ring goes on the CELL, not on the bare input — a 2px ring
        hugging a borderless text line reads as a second, smaller field inside
        the first. gw-024 draws no focus treatment at all on `.pinput`, which
        leaves it on the UA outline; this is the shell's §5 language applied to
        the gap. `outline-none` above is safe only because of this: the ring
        below replaces it, it does not remove it.

        Later sibling of the peer input, see `controlRing`. Text fields match
        `:focus-visible` on click as well as on tab, which is correct — unlike a
        radio, a clicked text field IS about to take keyboard input.
      */}
      <span aria-hidden="true" className={controlRing} />
    </div>
  );
}

export default TextInput;
