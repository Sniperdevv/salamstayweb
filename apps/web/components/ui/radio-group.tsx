"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
  controlRing,
  controlRingSelected,
  fieldGroup,
  fieldGroupInvalid,
  fieldHint,
  fieldName,
  fieldRow,
  tintTransition,
} from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";

/**
 * The checkout's one-of-N chooser — gw-022's party ladder and gw-025's payment
 * rails, which the cards draw as `.pgroup`/`.prow` and `.paygroup`/`.payrow`
 * and which are the same control twice.
 *
 * NATIVE RADIOS, HIDDEN, NOT REBUILT
 * ----------------------------------
 * Each row is a `<label>` wrapping an `sr-only` `<input type="radio">`, and the
 * inputs share a `name`. That one attribute is what buys arrow-key navigation,
 * Home/End, the single tab stop, the wrap-around at the ends, and the correct
 * announcement ("Family, radio button, 4 of 6") — all of it from the browser,
 * all of it already correct in RTL, none of it re-implemented with `onKeyDown`
 * and a roving `tabIndex` that will be subtly wrong. `sr-only` is deliberate
 * over `display:none` or `opacity:0`: a hidden-by-display input is not
 * focusable, and an opacity-0 one is still hit-testable and would swallow
 * clicks meant for the row.
 *
 * The visible disc is `aria-hidden` decoration drawn beside it.
 *
 * SELECTION IS INK, AND IT IS SAID TWICE
 * --------------------------------------
 * A 2px inset ink ring on the row (TASTE §3) plus a solid ink disc carrying a
 * white check. Neither is a fill change — §11.18 is explicit that choosing must
 * not move or re-tint the row's contents — and the check is the non-colour half
 * of the pair, so the state survives a monochrome screen. Green appears
 * nowhere: CHECKOUT-SHELL §7 spends brand on exactly three roles per checkout
 * surface (the wordmark dot, the one enabled CTA, the verification shield) and
 * a chosen row is not one of them.
 *
 * WHAT THIS DOES NOT COVER
 * ------------------------
 * gw-022's NATIONALITY pair (`.natgroup` / `.natcell`) is a different anatomy —
 * two side-by-side option cards, no disc at all, icon-led, selection carried by
 * the ring and the glyph moving gray → ink. It is a radiogroup semantically and
 * an option card visually, and forcing it through `RadioRow` would either
 * invent a disc the card does not draw or strip the disc from the rails that do.
 * It is not built here; it needs its own component and a look at the card.
 */

interface RadioGroupContextValue {
  readonly name: string;
  readonly value: string | null;
  readonly onChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  /**
   * The shared `name` for every input inside. Not cosmetic — this is the string
   * the browser groups the radios by, and two groups on one page sharing a name
   * become one group with one selection.
   */
  readonly name: string;
  /** `null` until the guest chooses. Never seed a plausible default. */
  readonly value: string | null;
  readonly onChange: (value: string) => void;
  /** `id` of the `<h2>` the group answers — §5's heading, never a fresh label. */
  readonly labelledBy: string;
  /** `id` of the `fieldErrorLine` below, when there is one. */
  readonly describedBy?: string;
  readonly invalid?: boolean;
  readonly children: ReactNode;
  readonly className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid = false,
  children,
  className = "",
}: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ name, value, onChange }}>
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={`${fieldGroup} ${invalid ? fieldGroupInvalid : ""} ${className}`}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioRowProps {
  /** The value this row selects. Must be unique within the group. */
  readonly value: string;
  /** The row's name — "Family", "JazzCash". 16/500 ink. */
  readonly label: ReactNode;
  /** The line under it — "Adults with children on the booking". 13/400 gray. */
  readonly hint?: ReactNode;
  /**
   * A leading glyph between the disc and the label — gw-025's `.payic`.
   * Decorative; the row's name is already its accessible name.
   */
  readonly icon?: ReactNode;
  /**
   * A trailing column — gw-022's `.pdoc` ("FRC and B-Form"). Renders 13/500 ink
   * and never wraps; wrap it in `font-regular text-secondary` for the demoted
   * "No extra document" variant.
   */
  readonly aside?: ReactNode;
  readonly className?: string;
}

export function RadioRow({ value, label, hint, icon, aside, className = "" }: RadioRowProps) {
  const group = useContext(RadioGroupContext);
  if (!group) {
    throw new Error("RadioRow must be rendered inside a RadioGroup.");
  }

  const checked = group.value === value;

  return (
    <label
      className={`${fieldRow} relative cursor-pointer items-start ${
        checked ? "" : "hover:bg-raised"
      } ${tintTransition} ${className}`}
    >
      <input
        type="radio"
        className="peer sr-only"
        name={group.name}
        value={value}
        checked={checked}
        onChange={() => group.onChange(value)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`. */}
      <span
        aria-hidden="true"
        className={`${controlRing} ${checked ? controlRingSelected : ""}`}
      />

      {/*
        The disc sits in a 24px box — the label's own line box at 16/1.5 — so it
        optically centres on the FIRST line of a row whose hint runs to three
        (gw-025's cash-on-arrival). Aligning to the row's centre instead would
        leave the mark floating beside the middle of a paragraph.
      */}
      <span aria-hidden="true" className="flex h-6 flex-none items-center">
        <span
          className={`flex size-5 items-center justify-center rounded-full border ${tintTransition} ${
            checked
              ? "border-selected bg-selected text-selected-fg"
              : "border-border-default bg-canvas text-transparent"
          }`}
        >
          <CheckMark className="size-3" />
        </span>
      </span>

      {icon ? (
        <span aria-hidden="true" className="flex h-6 flex-none items-center text-secondary">
          {icon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className={fieldName}>{label}</span>
        {hint ? <span className={fieldHint}>{hint}</span> : null}
      </span>

      {aside ? (
        <span className="flex h-6 flex-none items-center gap-2 whitespace-nowrap text-label font-medium text-primary">
          {aside}
        </span>
      ) : null}
    </label>
  );
}

export default RadioGroup;
