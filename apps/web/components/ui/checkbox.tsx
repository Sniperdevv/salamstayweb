"use client";

import type { ReactNode } from "react";

import { controlRing, tintTransition } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";

/**
 * The consent gate — gw-023's `.consent`, and the reason the Verify step exists.
 *
 * IT SHIPS UNCHECKED, AND THE CTA STAYS VISIBLE
 * ---------------------------------------------
 * ga-075's ruling, carried into gw-023 whole: the box is never pre-ticked,
 * because a pre-ticked consent is not consent — it is a claim the product makes
 * on the guest's behalf about handing their CNIC, name and date of birth to
 * NADRA Verisys. This component is controlled, so "unchecked" is the caller's
 * initial state to hold; there is no `defaultChecked` here precisely so nobody
 * can seed it to `true` in a props default and have it read as a design.
 *
 * The pairing on the step: while it is unticked the primary CTA is DISABLED BUT
 * VISIBLE AND IN PLACE (§5, TASTE §11.7) — flat `bg.raised` fill,
 * `text.disabled` label, no shadow, no layout shift — and a `.ctanote` names
 * what to do next. A CTA that vanished until consent would leave the guest with
 * no evidence the flow continues. Declining is stated plainly beside it as the
 * §5 gray-fill secondary (`btnSecondary`), never hidden.
 *
 * ANATOMY
 * -------
 * A bordered `radius.md` box — a form boundary, so TASTE §1 gives it a border
 * and no shadow — wrapping an `sr-only` native `<input type="checkbox">`. The
 * visible square is `aria-hidden`; the sentence is the input's label, so a
 * screen reader announces the whole consent, not "checkbox".
 *
 * Unlike a `RadioRow` the BOX takes no ink selection ring: there is nothing to
 * choose between, so a ring would be saying "this one" where there is no other
 * one. The square filling ink with a white check is the entire state change,
 * and the box keeps its `border.default` throughout — nothing moves, nothing
 * re-tints, §11.18 holds.
 */

export interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  /** The consent sentence. It is the input's accessible name — keep it whole. */
  readonly children: ReactNode;
  readonly name?: string;
  readonly value?: string;
  /** `id` of a `fieldErrorLine` or a note the sentence depends on. */
  readonly describedBy?: string;
  readonly className?: string;
}

export function Checkbox({
  checked,
  onChange,
  children,
  name,
  value,
  describedBy,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3 rounded-md border border-border-default p-4 ${tintTransition} ${className}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.checked)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`. It
          carries focus only; there is no selected ring on a consent gate. */}
      <span aria-hidden="true" className={controlRing} />

      {/* 24px box = the sentence's own line box at 16/1.5, so the square sits on
          the first line of a consent that runs to two. */}
      <span aria-hidden="true" className="flex h-6 flex-none items-center">
        <span
          className={`flex size-5 items-center justify-center rounded-sm border ${tintTransition} ${
            checked
              ? "border-selected bg-selected text-selected-fg"
              : "border-border-default bg-canvas text-transparent"
          }`}
        >
          <CheckMark className="size-3" />
        </span>
      </span>

      <span className="min-w-0 flex-1 text-bodyMd text-primary">{children}</span>
    </label>
  );
}

export default Checkbox;
