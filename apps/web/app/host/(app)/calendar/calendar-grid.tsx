"use client";

import { Num } from "@/components/numerals";
import { WEEKDAYS } from "@/components/booking/calendar-model";
import { formatPkr } from "@/lib/money";

import type { HostMonth, HostNight } from "./month";
import { nightLabel } from "./month";

/**
 * The month grid at web width, and the one object on this route with no card
 * behind it.
 *
 * `ha-041` draws this surface in a 340px phone frame and no `hw-` card draws a
 * calendar at all, so the grammar below is invented against `HOST-SHELL.md`'s
 * rules rather than translated from a drawing. Three decisions carry it, and
 * each one is the phone card's intent re-answered for a 1072px column:
 *
 * **A LATTICE, NOT A FIELD OF DISCS.** The guest picker is 44px circles floating
 * in open space, because a guest is pointing at two dates. A host is reading a
 * ledger: every night carries a price, a person's name or the word Blocked, and
 * a cell that has to hold a line of text is a cell, not a disc. So the grid is
 * a hairline lattice — `border.hairline` on every cell's block-end and
 * inline-end edge, the container closing the other two, `radius.md` clipping
 * the corners. TASTE §1 puts a border and no shadow on exactly this: a boundary
 * that does not float over anything.
 *
 * **THE STAY IS ONE OBJECT, NOT THREE IDENTICAL CELLS.** `ha-041`'s `.bookbar`
 * is inset 9px inside each booked cell, so a three-night stay reads as three
 * separate marks. Here the bar runs edge to edge through the middle of a run and
 * insets only at its two ends, so Omar & Sana's 1–3 August reads as one bar with
 * two caps. That is `calendar-day.tsx`'s `RangeBand` idea — and, like it, the
 * insets are the LOGICAL properties `start-*` / `end-*`, so the run mirrors
 * under `dir="rtl"` with no second rule to keep in step.
 *
 * **EVERY STATE CARRIES AT LEAST TWO SIGNALS, NEVER COLOUR ALONE.** Booked is a
 * `bg.raised` fill AND a solid bar AND a person's name. Asked-for is a lighter
 * bar AND the sentence "{name} asked". Blocked is a `bg.sunken` fill AND a
 * struck numeral AND the word Blocked. Past is a struck numeral AND no price.
 * Below `sm` the text lines drop and the cells hold the numeral alone — the
 * marks stay, and the accessible name never abbreviated in the first place.
 */

/* ─────────────────────────────── one night ──────────────────────────────── */

/**
 * `focus-visible:outline-none` belongs on the CELL, which is the element that
 * takes focus — otherwise Chrome draws its own outline around the box while the
 * token ring draws inside it, and one night gets two focus indicators of two
 * different shapes. `calendar-day.tsx` records the same trap.
 */
const CELL =
  "relative flex h-12 w-full flex-col border-b border-e border-hairline p-1 text-start " +
  "sm:h-20 sm:p-2 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-inset focus-visible:ring-focus-ring";

/**
 * Press feedback is on the CELL and it is the shallowest rung.
 *
 * `HOST-SHELL.md` §10 budgets three depths by size, and a 153px tile is at the
 * top of the range: `pressable`'s 0.97 would travel 4.5px and read as the grid
 * lurching, so `.995` — the value §10 gives large surfaces — is the rung. It is
 * written out rather than imported from `pressableSurface` because that recipe
 * also transitions `background-color`, and a cell whose fill is deciding
 * between four states does not want a 120ms crossfade every time the month
 * pages.
 */
const PRESS =
  "transition-transform duration-instant ease-decelerate active:scale-[0.995] " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";

function fillFor(night: HostNight): string {
  if (night.isPast) return "bg-canvas";
  if (night.state === "booked") return "bg-raised";
  if (night.state === "blocked") return "bg-sunken";
  return "bg-canvas";
}

function numeralFor(night: HostNight): string {
  if (night.isPast) return "text-disabled line-through";
  if (night.state === "blocked") return "text-primary line-through";
  if (night.state === "booked") return "text-secondary";
  return "text-primary";
}

/**
 * The connector. A run's middle reaches both edges so consecutive nights form
 * one bar; its two ends inset, which is what makes the bar read as a stay with
 * a beginning and an end rather than a stripe that happens to stop.
 *
 * Weight, not hue, separates the two holds: a confirmed stay is `border.strong`,
 * a request is `border.default`, and a stay already behind today drops to
 * `border.hairline` because it is history and should not compete with the
 * nights the host can still act on.
 */
function StayBar({ night }: { readonly night: HostNight }) {
  const stay = night.stay;
  if (stay === null) return null;

  const tone = night.isPast
    ? "bg-hairline"
    : stay.hold === "booked"
      ? "bg-border-strong"
      : "bg-border-default";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 h-1 ${tone} ${
        stay.isFirstNight ? "start-1 sm:start-2" : "start-0"
      } ${stay.isLastNight ? "end-1 sm:end-2" : "end-0"}`}
    />
  );
}

/** The one line under the numeral. A night says exactly one thing about itself. */
function NightLine({ night }: { readonly night: HostNight }) {
  if (night.stay !== null) {
    return (
      <span className="mt-auto hidden truncate text-label font-medium text-secondary sm:block">
        {night.isPast || night.stay.hold === "booked"
          ? night.stay.guest
          : `${night.stay.guest} asked`}
      </span>
    );
  }

  if (night.state === "blocked") {
    return (
      <span className="mt-auto hidden truncate text-label font-regular text-secondary sm:block">
        Blocked
      </span>
    );
  }

  if (night.nightly === null) return null;

  /*
   * `.num` wraps the WHOLE money string in one span, so `PKR` and its digits
   * stay one LTR-isolated unit under RTL — `lib/money.ts`'s own instruction, and
   * the reason the amount is not run through `withNumerals`.
   */
  return (
    <span className="mt-auto hidden truncate text-label font-regular text-tertiary sm:block">
      <span className="num">{formatPkr(night.nightly)}</span>
    </span>
  );
}

export interface NightCellProps {
  readonly night: HostNight;
  readonly selected: boolean;
  /** The one cell in the grid holding `tabIndex={0}`. */
  readonly focused: boolean;
  readonly onToggle: (iso: string, extend: boolean) => void;
  readonly onFocusNight: (iso: string) => void;
  readonly registerCell: (iso: string, element: HTMLElement | null) => void;
}

export function NightCell({
  night,
  selected,
  focused,
  onToggle,
  onFocusNight,
  registerCell,
}: NightCellProps) {
  const ring = selected
    ? "ring-2 ring-inset ring-selected"
    : night.isToday
      ? "ring-1 ring-inset ring-border-strong"
      : "";

  const content = (
    <>
      <span className="flex items-start justify-between gap-1">
        <span className={`text-bodySm font-semibold sm:text-bodyMd ${numeralFor(night)}`}>
          <Num>{String(night.dayOfMonth)}</Num>
        </span>
        {/* Two signals for today: the ring above and this word. The word is the
            one that survives a monochrome screen and a 48px cell. */}
        {night.isToday ? (
          <span className="hidden text-caption font-semibold text-primary sm:block">Today</span>
        ) : null}
      </span>

      <NightLine night={night} />
      <StayBar night={night} />
    </>
  );

  const shared = {
    role: "gridcell" as const,
    "aria-label": nightLabel(night, selected),
    ...(night.isToday ? { "aria-current": "date" as const } : {}),
    tabIndex: focused ? 0 : -1,
    ref: (element: HTMLElement | null) => registerCell(night.iso, element),
    onFocus: () => onFocusNight(night.iso),
  };

  /*
   * A night that cannot be changed is a `<span>`, not a disabled `<button>`.
   *
   * It keeps its place in the roving tab order, so a keyboard host reaches a
   * booked night and hears WHO has it — which is the whole reason TASTE §11.5
   * strikes days through instead of hiding them. A `<button disabled>` would be
   * skipped and silent, and on this surface the silent thing would be the guest
   * who has already paid.
   */
  if (!night.selectable) {
    return (
      <span
        {...shared}
        aria-disabled="true"
        className={`${CELL} ${fillFor(night)} ${ring} cursor-default`}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      {...shared}
      type="button"
      onClick={(event) => onToggle(night.iso, event.shiftKey)}
      className={`${CELL} ${PRESS} ${fillFor(night)} ${ring} cursor-pointer hover:bg-raised`}
    >
      {content}
    </button>
  );
}

/** A leading or trailing pad. Present so every `role="row"` counts seven. */
function PadCell() {
  return (
    <span
      role="gridcell"
      className="h-12 border-b border-e border-hairline bg-canvas sm:h-20"
    />
  );
}

/* ──────────────────────────────── the grid ──────────────────────────────── */

export interface MonthGridProps {
  readonly month: HostMonth;
  readonly listingName: string;
  readonly selected: ReadonlySet<string>;
  readonly focusedIso: string;
  readonly onToggle: (iso: string, extend: boolean) => void;
  readonly onFocusNight: (iso: string) => void;
  readonly registerCell: (iso: string, element: HTMLElement | null) => void;
  readonly onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  readonly gridRef: React.RefObject<HTMLDivElement | null>;
}

export function MonthGrid({
  month,
  listingName,
  selected,
  focusedIso,
  onToggle,
  onFocusNight,
  registerCell,
  onKeyDown,
  gridRef,
}: MonthGridProps) {
  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={`${month.title}, availability and nightly prices for ${listingName}`}
      onKeyDown={onKeyDown}
      className="mt-4 overflow-hidden rounded-md border-s border-t border-hairline"
    >
      <div role="row" className="grid grid-cols-7">
        {WEEKDAYS.map((day) => (
          <span
            key={day.short}
            role="columnheader"
            aria-label={day.long}
            className="border-b border-e border-hairline bg-raised py-2 text-center text-overline uppercase text-tertiary"
          >
            {day.short}
          </span>
        ))}
      </div>

      {month.weeks.map((week) => (
        <div key={week.key} role="row" className="grid grid-cols-7">
          {week.nights.map((night, column) =>
            night === null ? (
              <PadCell key={`${week.key}-p${String(column)}`} />
            ) : (
              <NightCell
                key={night.iso}
                night={night}
                selected={selected.has(night.iso)}
                focused={night.iso === focusedIso}
                onToggle={onToggle}
                onFocusNight={onFocusNight}
                registerCell={registerCell}
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── the legend ─────────────────────────────── */

/**
 * Five rows, and only ever the marks the grid actually draws.
 *
 * `date-range-picker.tsx`'s legend note governs this one too: a key to a mark
 * the calendar does not draw is decoration, and TASTE §12 cuts cells rather
 * than filling them. Selection is not in here — the ink ring appears under the
 * host's own finger and needs no key — and neither is the past, which is
 * positional.
 */
export function Legend() {
  return (
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
      <LegendRow label="Open">
        <span className="size-3 flex-none border border-hairline bg-canvas" />
      </LegendRow>
      <LegendRow label="Booked">
        <span className="relative size-3 flex-none border border-hairline bg-raised">
          <span className="absolute inset-x-0 bottom-0 h-px bg-border-strong" />
        </span>
      </LegendRow>
      <LegendRow label="Asked for">
        <span className="relative size-3 flex-none border border-hairline bg-canvas">
          <span className="absolute inset-x-0 bottom-0 h-px bg-border-default" />
        </span>
      </LegendRow>
      <LegendRow label="Blocked by you">
        <span className="relative size-3 flex-none border border-hairline bg-sunken">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-disabled" />
        </span>
      </LegendRow>
      <LegendRow label="Today">
        <span className="size-3 flex-none border border-border-strong bg-canvas" />
      </LegendRow>
    </div>
  );
}

function LegendRow({
  label,
  children,
}: {
  readonly label: string;
  readonly children: React.ReactNode;
}) {
  return (
    // The label sits in ONE span: `Num` splits a string into a node per digit
    // run, and as bare children of a `gap-2` flex row each run would become its
    // own flex item with 8px of air around every numeral.
    <span className="inline-flex items-center gap-2 text-label font-regular text-secondary">
      {children}
      <span>
        <Num>{label}</Num>
      </span>
    </span>
  );
}
