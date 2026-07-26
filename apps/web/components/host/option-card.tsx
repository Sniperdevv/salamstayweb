"use client";

import type { ReactNode } from "react";

import { controlRing, controlRingSelected, pressableSurface, tintTransition } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";

/**
 * `HOST-SHELL.md` §5's `.ocard` — the host wizard's chooseable card, and the one
 * component behind every one of them.
 *
 * `hw-001`, `hw-002` and `hw-003` ship the same forty lines of CSS for it, byte
 * for byte: 36px icon disc on `bg.raised`, title, description, mark trailing,
 * `radius.lg`, one `border.default`, `bg.canvas`, **no shadow** (§8 puts no
 * shadow on any host surface, and TASTE §1 gives a form control a border and
 * nothing to cast).
 *
 * ONE SHAPE, ONE DIFFERENCE: THE MARK'S RADIUS
 * --------------------------------------------
 * `hw-003` adds exactly one rule to the block the other two cards already had —
 * `.omark.sq { border-radius: var(--radius-sm) }` — and that is the whole of
 * multi-select. **Circle = one of these. Square = any of these.** It is the only
 * shape convention in interface design users already know, it costs one token,
 * and it means a multi-select needs no second component. Everything else — the
 * ring, the ink fill, the white check, the no-fill-change rule — is identical on
 * both sides, which is the point: a host meets both on the same nine screens.
 *
 * The `mark` prop therefore takes `radio` or `checkbox` and sets BOTH the input
 * type and the mark's radius, because those two are never independently true.
 *
 * SELECTION IS A RING, NOT A FILL — AND THE RING IS INSET
 * -------------------------------------------------------
 * `inset 0 0 0 2px interactive.selected`: INK, never brand (TASTE §3 / §11.18;
 * §7 budgets this surface three greens and a chosen card is not one of them),
 * drawn as `ring-2 ring-inset` because a real 2px border would shift the card's
 * contents by 1px on every selection (`CHECKOUT-SHELL.md` §5's `.editing`
 * reasoning, which §5 cites by name). `ha-019`'s brand border and `int-subtle`
 * tint predate all of that and are not copied forward.
 *
 * The same overlay carries FOCUS, because the focusable node is an `sr-only`
 * input. See `controlRing`: it compiles to `~` rather than `:has()`, so a browser
 * without `:has()` still shows a focus state instead of a 1×1 clipped input with
 * the UA outline on it.
 *
 * NATIVE INPUTS, HIDDEN, NOT REBUILT
 * ----------------------------------
 * The same call `radio-group.tsx`, `segmented.tsx` and `select.tsx` each made and
 * stated. A shared `name` on real radios buys the single tab stop, arrow-key
 * navigation, wrap-around, Home/End, the correct announcement ("House, radio
 * button, 2 of 7") and RTL-correct arrow direction — all from the browser, none
 * of it re-implemented with a roving `tabIndex` that will be subtly wrong.
 * `sr-only` rather than an `opacity-0` input stretched over the card, which would
 * be hit-testable and swallow clicks meant for the label.
 *
 * THE CARD OWNS NO LAYOUT
 * -----------------------
 * `.ocards` is a column and `.ocards.two` is a 2-up grid, and which one a
 * question takes is a judgement about that question, not about this component:
 * seven property types are PEERS answered by recognising an icon, so they grid;
 * two privacy options are chosen by reading a sentence, so they run full width.
 * The card is a block-level flex row, so it stretches to whatever cell it is put
 * in — a grid track or a flex column — and the caller writes the container and
 * the gap.
 *
 * MOTION
 * ------
 * `pressableSurface` alone — §10's `.ocard:active {scale(.995)}`, the shallowest
 * of the three press depths, because 0.97 on a card this wide reads as the grid
 * lurching under the pointer rather than as a press. Never `pressableSurface` +
 * `tintTransition`: both set `transition-property`, so which one won would be
 * decided by the order Tailwind happens to emit them in rather than by the order
 * they are written here (`host-ui.ts` documents the same trap for `rounded-*`).
 * `pressableSurface` already carries background, border and colour.
 *
 * METRICS, AND THE ONE PLACE THIS DIVERGES FROM THE CARDS — FLAGGED
 * -----------------------------------------------------------------
 * The cards draw `padding:14px 15px`, a 36px disc, a 22px mark and `scale(.7)`.
 * Of those, 14, 15, 36 and 22 are all off the `space` scale, which runs
 * 12 → 16 → 20 → 24 and 32 → 40. This file takes the nearest rungs — `p-4` (16),
 * `size-10` (40, the rung `SwitchRow` already rounded the same disc to),
 * `size-5` (20, the rung `Checkbox` and `RadioRow` use for the same idiom) — and
 * §5's 15/600 title becomes 16/600, TASTE §7's "card titles 16/500-600", since 15
 * is on the type scale in neither direction. `scale-75` is likewise the nearest
 * rung to §10's `.7`; it is invisible either way (the glyph is `opacity-0` at
 * rest and `scale-100` once chosen, so the value only exists mid-transition on a
 * 12px mark), and it is left alone here rather than corrected in a refactor.
 *
 * `app/host/listings/new/property-type` deliberately does NOT use this component
 * and keeps a private copy at the cards' own px (`py-3.5`, `size-9`) via
 * Tailwind's default rungs. Two readings of §5 are in circulation — card-exact
 * px versus the token scale — and they differ by 4px on the disc and 2px on the
 * card's height. That is a founder call, not a consolidation call, and until it
 * is made the page that would MOVE is the one that stays put. Fold it in the
 * moment the ruling lands; nothing else has to change.
 */

/* -------------------------------------------------------------------------- */

/** Circle = one of these. Square = any of these. Sets the input type too. */
export type OptionMarkKind = "radio" | "checkbox";

/**
 * `.omark` — the 20px disc or square, its ring at rest, its ink fill once
 * chosen, and the white check inside it (BUILD-DECISIONS #20: the check is the
 * NON-COLOUR signal, on every radiogroup on this shell).
 *
 * Exported because two steps draw this mark on a row that is NOT an option card
 * — step 4's `None of these apply to this place` and step 5's `My area's
 * schedule is not predictable enough to state`. Both are §6/§11.2 escape
 * hatches: a plain checkbox row with a sentence beside it, no disc, no border,
 * no card. Same mark, different row, so the mark travels and the card does not.
 *
 * §10: it fades AND scales in, never from `0` — nothing in the real world
 * appears from nothing. Reduced motion drops the transform and keeps the fade.
 * The glyph is in the DOM at rest and simply unpainted, so choosing something
 * reflows nothing.
 */
export function OptionMark({
  kind,
  checked,
}: {
  readonly kind: OptionMarkKind;
  readonly checked: boolean;
}) {
  return (
    <span
      className={`flex size-5 items-center justify-center border ${
        kind === "radio" ? "rounded-full" : "rounded-sm"
      } ${tintTransition} ${
        checked
          ? "border-selected bg-selected text-selected-fg"
          : "border-border-default bg-canvas text-selected-fg"
      }`}
    >
      <CheckMark
        className={`size-3 transition-[opacity,transform] duration-instant ease-standard motion-reduce:scale-100 ${
          checked ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      />
    </span>
  );
}

/**
 * The box the mark sits in: 24px tall, which is the TITLE's own line box at
 * 16/1.5, so a 20px mark optically centres on the FIRST line of a card whose
 * description wraps to two rather than floating beside the middle of it.
 *
 * Exported with the mark, because the two escape-hatch rows above need the same
 * alignment against the same 16px first line.
 */
export const optionMarkSlot = "flex h-6 flex-none items-center";

export interface OptionCardProps {
  /**
   * `radio` groups by the shared `name` and gives the browser one tab stop and
   * the arrow keys; `checkbox` is independently toggleable. The prop also
   * decides the mark's radius — see the note above, the two are never
   * independently true.
   */
  readonly mark: OptionMarkKind;
  /** The shared `name` for a radio group; the field name for a checkbox. */
  readonly name: string;
  readonly value: string;
  readonly checked: boolean;
  /**
   * The card's NEW checked state. What that means is the caller's business: a
   * checkbox step toggles a set, a radio step closes over `value` and sets it —
   * a radio only ever reports `true`, since the browser clears its siblings.
   */
  readonly onChange: (checked: boolean) => void;
  /** Decorative — the title is already the option's accessible name. */
  readonly icon: ReactNode;
  /** 16/600 ink. §5 draws 15; TASTE §7 puts card titles at 16, which is the rung. */
  readonly title: string;
  /**
   * 13/400 secondary. Optional on purpose: a description appears only where the
   * label is genuinely ambiguous. "TV — guests can watch television" is padding,
   * and padding on twelve rows is a screenful of nothing. Grid cells stretch, so
   * the rows stay level regardless.
   */
  readonly description?: string;
}

export function OptionCard({
  mark,
  name,
  value,
  checked,
  onChange,
  icon,
  title,
  description,
}: OptionCardProps) {
  return (
    <label
      className={`relative flex min-h-16 cursor-pointer items-start gap-3 rounded-lg border border-border-default bg-canvas p-4 hover:border-border-strong ${pressableSurface}`}
    >
      <input
        type={mark}
        className="peer sr-only"
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      {/* Ring overlay — later sibling of the peer input, see `controlRing`.
          `rounded-lg` because the recipe carries no radius of its own. */}
      <span
        aria-hidden="true"
        className={`${controlRing} rounded-lg ${checked ? controlRingSelected : ""}`}
      />

      <span
        aria-hidden="true"
        className="flex size-10 flex-none items-center justify-center rounded-full bg-raised text-secondary"
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-semibold text-primary">{title}</span>
        {description === undefined ? null : (
          <span className="mt-1 block text-label font-regular leading-snug text-secondary">
            {description}
          </span>
        )}
      </span>

      <span aria-hidden="true" className={optionMarkSlot}>
        <OptionMark kind={mark} checked={checked} />
      </span>
    </label>
  );
}

export default OptionCard;
