import { Num } from "@/components/numerals";
import type { BandRole, CalendarDay, ResolvedDay } from "./calendar-model";

/**
 * One day cell — `gw-021`'s `.day`, rebuilt in Tailwind against the token
 * preset (BUILD-DECISIONS ruling 0: the card is the specification, its CSS is
 * not the implementation).
 *
 * ONE NUMERAL. The card draws a Gregorian numeral over a secondary Hijri one;
 * the founder's 2026-07-26 ruling drops the Hijri layer, so the cell carries a
 * single centred numeral and the card is to be updated to match rather than
 * this file corrected back. The 44px circle inside a 48px cell is unchanged —
 * it is a touch target before it is a container, and it was never sized by how
 * many lines of text it held.
 *
 * THREE THINGS THIS FILE IS CAREFUL ABOUT
 * ---------------------------------------
 * **The band is a box, not a gradient.** The card paints the endpoint's inner
 * half with `linear-gradient(to right, transparent 50%, …)` and then mirrors it
 * with a second `.rtl` rule for the other direction. Here the band is an
 * absolutely-positioned element inset with the LOGICAL properties
 * `inset-inline-start` / `inset-inline-end` (`start-1/2`, `end-1/2`), so it
 * mirrors under `dir="rtl"` with no second rule and no chance of the two
 * drifting apart. Same rendering, half the surface area for a bug. It stays a
 * flat rectangle at zero radius — TASTE §3 is explicit that the in-range band
 * is a connector and not a shape.
 *
 * **Press feedback scales the circle, not the cell.** `pressable` from
 * `components/ui.ts` puts `active:scale-[0.97]` on the element it is applied
 * to; on a day cell that would scale the range band with it, and the band would
 * visibly pull away from its neighbours mid-press. So the same recipe is
 * re-expressed as a `group-active:` on the inner circle: identical duration
 * role (`duration-instant`), identical easing role (`ease-decelerate` — never
 * accelerate, an ease-in press reads as lag), identical reduced-motion
 * collapse, at `gw-021`'s 0.94 for a control this small.
 *
 * **A day that cannot be picked is a `<span>`, not a disabled `<button>`.** It
 * keeps its place in the roving tab order so a keyboard user reaches it and
 * hears the reason, which is the entire point of TASTE §11.5 striking days
 * through instead of hiding them. A `<button disabled>` would be skipped by the
 * tab order and silent.
 */

/**
 * `focus-visible:outline-none` belongs on the CELL, which is the element that
 * actually takes focus. Left off, Chrome draws its own outline around the 48px
 * box while the token ring draws around the 44px circle inside it, and the day
 * gets two focus indicators of different shapes.
 */
const CELL =
  "relative flex h-12 items-center justify-center p-0 font-sans focus-visible:outline-none";

const INNER =
  "relative z-10 flex h-11 w-11 items-center justify-center rounded-full transition-[transform,background-color,border-color] duration-instant ease-decelerate motion-reduce:transition-[background-color,border-color] motion-reduce:duration-instant";

/**
 * The DESIGN.md §8 focus treatment, re-expressed for a 44px circle inside a
 * 48px cell.
 *
 * `focusRing` in `components/ui.ts` carries `ring-offset-4`, which on this
 * geometry pushes the ring 4px outside the cell and straight over the two days
 * either side. The role is the one that matters and it is named unchanged —
 * `ring-focus-ring`, the dedicated token, not the `interactive` one it happens
 * to equal — at the same `borderWidthRole.focusRing` weight. Only the offset is
 * dropped, and the ring lands on the circle it belongs to.
 */
const DAY_FOCUS = "group-focus-visible:ring-2 group-focus-visible:ring-focus-ring";

export interface CalendarDayCellProps {
  readonly day: CalendarDay;
  readonly resolved: ResolvedDay;
  /** The one cell in the whole picker holding `tabIndex={0}`. */
  readonly focused: boolean;
  readonly onSelect: (iso: string) => void;
  readonly onPreview: (iso: string | null) => void;
  readonly onFocus: (iso: string) => void;
  readonly registerCell: (iso: string, element: HTMLElement | null) => void;
}

export function CalendarDayCell({
  day,
  resolved,
  focused,
  onSelect,
  onPreview,
  onFocus,
  registerCell,
}: CalendarDayCellProps) {
  const endpoint = resolved.band === "start" || resolved.band === "end";
  const struck = resolved.blockedReason !== null;

  const numeral = endpoint
    ? "text-selected-fg"
    : struck
      ? "text-disabled line-through"
      : "text-primary";

  const inner = [
    INNER,
    DAY_FOCUS,
    endpoint ? "bg-selected" : "",
    day.isToday && !endpoint ? "border border-border-strong" : "",
    resolved.selectable && !endpoint ? "group-hover:bg-raised" : "",
    resolved.selectable
      ? "group-active:scale-[0.94] motion-reduce:group-active:scale-100"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <RangeBand role={resolved.band} />
      <span className={inner}>
        {/* `Num` splits a string into several nodes. The span keeps them one
            child of a flex parent — bare, a `gap` on that parent would land
            between the digits of a run. */}
        <span className={`text-bodyMd leading-none ${numeral}`}>
          <Num>{String(day.dayOfMonth)}</Num>
        </span>
      </span>
    </>
  );

  const shared = {
    role: "gridcell" as const,
    "aria-label": resolved.label,
    tabIndex: focused ? 0 : -1,
    ref: (element: HTMLElement | null) => registerCell(day.iso, element),
    onFocus: () => onFocus(day.iso),
    onPointerEnter: () => onPreview(day.iso),
    className: `group ${CELL} ${resolved.selectable ? "cursor-pointer" : "cursor-default"}`,
  };

  if (!resolved.selectable) {
    return (
      <span {...shared} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <button {...shared} type="button" onClick={() => onSelect(day.iso)}>
      {content}
    </button>
  );
}

/**
 * The in-range connector. `middle` fills the cell edge to edge so consecutive
 * days form one unbroken rectangle; the endpoints fill only the half that faces
 * the rest of the stay, which is what makes the ink circle read as a cap on the
 * band rather than a disc sitting on top of it.
 */
function RangeBand({ role }: { readonly role: BandRole }) {
  if (role === "none") return null;
  const inset =
    role === "middle"
      ? "inset-x-0"
      : role === "start"
        ? "start-1/2 end-0"
        : "start-0 end-1/2";
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 ${inset} bg-raised`}
    />
  );
}

/** A leading or trailing pad. Present so every `role="row"` counts seven. */
export function CalendarPadCell() {
  return <span role="gridcell" className="h-12" />;
}
