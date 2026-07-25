"use client";

import { ATTRIBUTES } from "@/components/stays/attributes";
import { focusRing } from "@/components/ui";
import type { FilterId } from "./filters";

/**
 * A filter chip — a `<button>`, never a link.
 *
 * That is the page's central SEO rule, not a styling preference (GATE 75/76):
 * a facet rendered as an anchor mints a crawlable URL for every combination of
 * filters, which is the crawl trap the whole `/search` contract exists to
 * prevent. A state control cannot be crawled, so browsing filters can never
 * spawn a page.
 *
 * Treatment, TASTE-RULES §10 + §3:
 * - At rest: white, `border.default`, `rounded-full`, 40px tall, ink label,
 *   gray glyph. §1 — a chip is an unselected choice, so it carries a border and
 *   casts nothing.
 * - Pressed: `interactive.selectedFill` (ink) with a white label. §3 is
 *   explicit that selection is near-black and never green: green is spent on
 *   four roles per surface and a filter is not one of them. A row of six chips
 *   that turned brand on press would put more green on this page than the
 *   wordmark, the search circle and the CTA combined.
 * - Disabled (the shell before a city is chosen): visible, in place, ink
 *   dropped to `text.disabled`. §11.7 — a control that cannot act keeps its
 *   position rather than disappearing, so the row does not reflow the moment a
 *   city arrives.
 *
 * Motion: the shared 120ms press at 0.97 and a colour interpolation on the
 * fill, both collapsing under `motion-reduce`. `background-color` is in the
 * transition list precisely because the pressed state IS a fill change; the
 * shared `chip` in components/stays/styles.ts omits it because nothing that
 * uses it has a selected state yet.
 */

const base =
  "inline-flex h-10 select-none items-center gap-2 rounded-full border px-4 text-bodySm font-medium " +
  "transition-[transform,background-color,border-color,color] duration-instant ease-decelerate " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

const rest =
  "border-border-default bg-canvas text-primary hover:border-border-strong active:scale-[0.97]";

/** Ink fill, white label, and a border that disappears into the fill (§3). */
const selected = "border-transparent bg-selected text-selected-fg active:scale-[0.97]";

const disabled = "cursor-not-allowed border-border-default bg-canvas text-disabled";

export interface FilterChipProps {
  readonly id: FilterId;
  readonly pressed: boolean;
  readonly disabled?: boolean;
  readonly onToggle: (id: FilterId) => void;
}

export function FilterChip({
  id,
  pressed,
  disabled: isDisabled = false,
  onToggle,
}: FilterChipProps) {
  const { label, Icon } = ATTRIBUTES[id];
  const state = isDisabled ? disabled : pressed ? selected : rest;

  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={isDisabled}
      onClick={() => onToggle(id)}
      className={`${base} ${state} ${focusRing}`}
    >
      {/* Gray at rest; inherits the label colour when the chip is ink-filled or
          disabled, so the glyph is never the only thing on the chip still
          drawn in the resting palette. */}
      <Icon className={pressed || isDisabled ? "size-4 shrink-0" : "size-4 shrink-0 text-secondary"} />
      {label}
    </button>
  );
}

export default FilterChip;
