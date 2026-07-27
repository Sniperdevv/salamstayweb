"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { btnSecondaryMd, btnSecondaryOnTint, focusRing, inlineAction, pressableCircle } from "@/components/ui";
import { Segment, Segmented } from "@/components/ui/segmented";
import { CheckMark } from "@/components/ui/marks";
import { ToastProvider, useToast } from "@/components/ui/toast";
import {
  dateRange,
  daysInMonth,
  shiftMonth,
  startOfMonth,
  weekdayIndex,
} from "@/components/booking/calendar-model";
import { addDays, daysBetween } from "@/lib/booking/booking";

import { SampleDataStrip } from "../reservations/reservation-parts";
import {
  LISTINGS,
  blockedNights,
  earliestStayMonth,
  nightsHeld,
  type HostListing,
} from "./calendar-data";
import { Legend, MonthGrid } from "./calendar-grid";
import { buildHostMonth, nightsBetween, selectionSummary } from "./month";

/**
 * `/host/calendar` at web width — `ha-041` translated out of its 340px phone
 * frame, against `HOST-SHELL.md` §2b's app chrome.
 *
 * THE CHROME IS THE LAYOUT'S, NOT THIS FILE'S. The header, the section nav and
 * `<main class="co-main">` all arrive from `app/host/(app)/layout.tsx`. Nothing
 * here draws a header, a breadcrumb or a footer, and §1 forbids all three on
 * every host route.
 *
 * WHAT THE PHONE CARD DID THAT THIS DOES NOT, EACH WITH ITS REASON
 * ---------------------------------------------------------------
 *  · **No Hijri numeral, no Ramadan band, no Eid dot, no moon-sighting note.**
 *    The founder's 2026-07-26 ruling drops the Hijri layer from the web build —
 *    `date-range-picker.tsx` and `calendar-day.tsx` already ship without it and
 *    the conversion module was deleted rather than left unused — and
 *    `REPOSITIONING.md` retires the observance model the card was drawn against.
 *    `HOST-SHELL.md` §0.2 is explicit that `ha-*` content is not copied forward
 *    unchecked. This is the check, and the answer is no.
 *  · **No `Set price`, and no price-override state.** `ha-042` owns per-date
 *    price and this brief scopes to the month view. An override the host can
 *    neither create nor clear here would imply an editor that does not exist,
 *    and a weekend rate would be a number nobody has given (`HOST-SHELL.md` §6).
 *    Every open night prints the one rate this home's stays are booked at.
 *  · **No min-stay strip, no seasonal-pricing strip.** `ha-045` and `ha-044` own
 *    those, both are undrawn on web, and the card's `Edit →` links point at
 *    routes that would 404 today. A read-only strip whose only affordance is a
 *    dead link is worse than its absence.
 *
 * WHAT IS HERE THAT NO CARD DRAWS: the listing switcher as a segmented control
 * (the phone card uses a full-width chip that opens a listbox; at 1072px two
 * homes fit in `HOST-SHELL.md` §5's own `.seg`, and §5 caps that control at four
 * segments, which is the number of homes this build can have), and the
 * selection action bar as a fixed slot in the flow rather than a sticky footer.
 *
 * GREEN: NONE, ANYWHERE IN THIS BODY. `HOST-SHELL.md` §7 says the host app
 * surface is already over TASTE §2's four-role budget through `ha-046`'s chip,
 * nav underline and avatar, and that the correct response is "Add nothing to
 * it." So the one action on this page is the §5 gray-fill secondary, `Clear` is
 * an §8 inline text action, selection is ink, and the nav's own green
 * `Create a listing` keeps it on every branch of this route.
 */

/* ───────────────────────────── month paging ─────────────────────────────── */

/**
 * Prev / next. TASTE §11.7: a control at a bound stays exactly where it is,
 * loses its edge rather than its place, and never shifts the row.
 *
 * `date-range-picker.tsx`'s `MonthNav`, at the same 40px and with the same
 * disabled treatment. It is re-expressed rather than imported because that one
 * is private to the picker; the recipe is the shared thing, not the function.
 */
function MonthNav({
  direction,
  disabled = false,
  onClick,
}: {
  readonly direction: "prev" | "next";
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  const Chevron = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous month" : "Next month"}
      className={`flex size-10 flex-none items-center justify-center rounded-full border bg-canvas text-primary disabled:border-hairline disabled:bg-raised disabled:text-disabled ${
        disabled ? "border-hairline" : "border-border-default hover:border-border-strong"
      } ${focusRing} ${pressableCircle}`}
    >
      <Chevron className="size-4 rtl:-scale-x-100" />
    </button>
  );
}

/** Same day-of-month one month away, clamped to that month's length. */
function sameDayInMonth(iso: string, delta: number): string {
  const target = shiftMonth(iso, delta);
  const dayOfMonth = Number(iso.slice(8, 10));
  return addDays(target, Math.min(dayOfMonth, daysInMonth(target)) - 1);
}

/* ────────────────────────────── the surface ─────────────────────────────── */

export interface HostCalendarProps {
  /** `YYYY-MM-DD`, in Asia/Karachi. Supplied by the page; never read from the clock here. */
  readonly today: string;
}

function HostCalendarSurface({ today }: HostCalendarProps) {
  const { toast } = useToast();

  const firstListing = LISTINGS[0];
  if (firstListing === undefined) {
    throw new Error("HostCalendarSurface rendered with no listings; page.tsx owns that branch.");
  }

  const [listingId, setListingId] = useState(firstListing.id);
  const [monthIso, setMonthIso] = useState(() => startOfMonth(today));
  const [focusedIso, setFocusedIso] = useState(today);
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set());
  /** Where a shift-click measures from: the last night touched on its own. */
  const [anchorIso, setAnchorIso] = useState<string | null>(null);

  /**
   * Blocked nights, per home, seeded from the fixture and edited in memory.
   *
   * Client state and nothing else, because there is no availability store to
   * write to. The action bar says so in words rather than leaving a host to
   * discover it on the next reload, and `SampleDataStrip` above says the whole
   * surface runs on example data.
   */
  const [blocked, setBlocked] = useState<ReadonlyMap<string, ReadonlySet<string>>>(
    () => new Map(LISTINGS.map((l) => [l.id, new Set(blockedNights(l.id))])),
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const cells = useRef(new Map<string, HTMLElement>());
  const moveByKey = useRef(false);

  const registerCell = useCallback((iso: string, element: HTMLElement | null) => {
    if (element === null) cells.current.delete(iso);
    else cells.current.set(iso, element);
  }, []);

  // Focus follows the roving tabindex, but only when a key moved it — clicking a
  // night must not yank focus back after the browser has already placed it.
  useEffect(() => {
    if (!moveByKey.current) return;
    moveByKey.current = false;
    cells.current.get(focusedIso)?.focus();
  }, [focusedIso, monthIso]);

  const listing: HostListing =
    LISTINGS.find((l) => l.id === listingId) ?? firstListing;

  const held = useMemo(() => nightsHeld(listing.id), [listing.id]);
  /* Memoised, not read inline: a bare `?? new Set()` would mint a new identity
     on every render and make the month below it rebuild for nothing. */
  const currentBlocked = useMemo(
    () => blocked.get(listing.id) ?? new Set<string>(),
    [blocked, listing.id],
  );

  const month = useMemo(
    () =>
      buildHostMonth({
        monthIso,
        today,
        listing,
        held,
        blocked: currentBlocked,
      }),
    [monthIso, today, listing, held, currentBlocked],
  );

  /**
   * How far back paging may go: the month the host is standing in, or the month
   * of their earliest stay if that is further back. Derived rather than chosen —
   * a bound picked out of the air would either hide real history or offer a
   * decade of empty grids.
   *
   * There is no forward bound. No booking horizon exists anywhere in the corpus
   * and BUILD-DECISIONS §16 names it as a product decision nobody may invent, so
   * `next` never disables. Same rule the guest picker follows.
   */
  const earliestMonth = useMemo(() => {
    const thisMonth = startOfMonth(today);
    const stay = earliestStayMonth();
    if (stay === null) return thisMonth;
    const stayMonth = startOfMonth(stay);
    return stayMonth < thisMonth ? stayMonth : thisMonth;
  }, [today]);

  const atEarliestMonth = monthIso <= earliestMonth;
  const atCurrentMonth = monthIso === startOfMonth(today);

  /**
   * The one cell holding `tabIndex={0}`, DERIVED rather than stored.
   *
   * Paging with the nav buttons deliberately does not move `focusedIso` — focus
   * belongs to the button the host just pressed. But a roving tabindex pointing
   * at a month that is no longer rendered is a grid with no tab stop at all, and
   * Tab would skip the whole calendar. Deriving it means the two cannot
   * disagree, and the host lands on the same day-of-month in the month they
   * paged to, which is where they were looking. `date-range-picker.tsx`'s
   * reasoning, unchanged.
   */
  const tabbableIso =
    startOfMonth(focusedIso) === monthIso
      ? focusedIso
      : addDays(
          monthIso,
          Math.min(Number(focusedIso.slice(8, 10)), daysInMonth(monthIso)) - 1,
        );

  const pageMonths = useCallback(
    (delta: number) => {
      setMonthIso((current) => {
        const next = shiftMonth(current, delta);
        return next < earliestMonth ? earliestMonth : next;
      });
    },
    [earliestMonth],
  );

  const moveFocus = useCallback(
    (target: string) => {
      const clamped = target < earliestMonth ? earliestMonth : target;
      setMonthIso(startOfMonth(clamped));
      moveByKey.current = true;
      setFocusedIso(clamped);
    },
    [earliestMonth],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Under RTL the whole grid mirrors, so the arrow that means "the night to
      // my left" is the one that means "tomorrow".
      const rtl =
        gridRef.current !== null && getComputedStyle(gridRef.current).direction === "rtl";

      let target: string | null = null;
      switch (event.key) {
        case "ArrowLeft":
          target = addDays(tabbableIso, rtl ? 1 : -1);
          break;
        case "ArrowRight":
          target = addDays(tabbableIso, rtl ? -1 : 1);
          break;
        case "ArrowUp":
          target = addDays(tabbableIso, -7);
          break;
        case "ArrowDown":
          target = addDays(tabbableIso, 7);
          break;
        case "Home":
          target = addDays(tabbableIso, -weekdayIndex(tabbableIso));
          break;
        case "End":
          target = addDays(tabbableIso, 6 - weekdayIndex(tabbableIso));
          break;
        case "PageUp":
          target = sameDayInMonth(tabbableIso, -1);
          break;
        case "PageDown":
          target = sameDayInMonth(tabbableIso, 1);
          break;
        case "Escape":
          if (selected.size === 0) return;
          event.preventDefault();
          setSelected(new Set());
          setAnchorIso(null);
          return;
        default:
          return;
      }
      event.preventDefault();
      moveFocus(target);
    },
    [tabbableIso, moveFocus, selected.size],
  );

  /* ─────────────────────────── selection ────────────────────────────────── */

  /**
   * A tap toggles one night. Shift takes the run between it and the last night
   * touched on its own, which is how a host closes a fortnight without fourteen
   * clicks. The modifier arrives on the click event whether the button was
   * pressed with a pointer or with Enter, so the keyboard gets the same reach.
   *
   * A run only ever ADDS. A shift-click that removed nights would make the same
   * gesture mean two opposite things depending on where it landed, and a host
   * dragging across a month would watch their selection flicker.
   */
  /** Every night in the month a host is allowed to close or reopen. */
  const selectableNights = useMemo(() => {
    const set = new Set<string>();
    for (const week of month.weeks) {
      for (const night of week.nights) {
        if (night !== null && night.selectable) set.add(night.iso);
      }
    }
    return set;
  }, [month]);

  const toggleNight = useCallback(
    (iso: string, extend: boolean) => {
      /*
       * A run needs both ends on screen. An anchor left behind in a month the
       * host has since paged away from would silently add a stretch of nights
       * they cannot see, so it falls back to a plain toggle and re-anchors.
       */
      const canExtend =
        extend && anchorIso !== null && startOfMonth(anchorIso) === month.firstIso;

      setSelected((current) => {
        const next = new Set(current);
        if (canExtend && anchorIso !== null) {
          for (const night of nightsBetween(anchorIso, iso)) {
            if (selectableNights.has(night)) next.add(night);
          }
          return next;
        }
        if (next.has(iso)) next.delete(iso);
        else next.add(iso);
        return next;
      });

      if (!canExtend) setAnchorIso(iso);
    },
    [anchorIso, month.firstIso, selectableNights],
  );

  const selectedNights = useMemo(() => [...selected].sort(), [selected]);
  const allSelectedBlocked =
    selectedNights.length > 0 && selectedNights.every((iso) => currentBlocked.has(iso));

  /** The sentence beside the count, when the run is one unbroken stretch. */
  const selectedRange = ((): string | null => {
    const first = selectedNights[0];
    const last = selectedNights[selectedNights.length - 1];
    if (first === undefined || last === undefined) return null;
    if (first === last) return dateRange(first, first);
    return daysBetween(first, last) + 1 === selectedNights.length
      ? dateRange(first, last)
      : null;
  })();

  const commit = useCallback(() => {
    if (selectedNights.length === 0) return;

    const targetId = listing.id;
    const previous = currentBlocked;
    const opening = allSelectedBlocked;

    const next = new Set(previous);
    for (const iso of selectedNights) {
      if (opening) next.delete(iso);
      else next.add(iso);
    }

    const write = (value: ReadonlySet<string>) => {
      setBlocked((current) => new Map(current).set(targetId, value));
    };

    write(next);
    setSelected(new Set());
    setAnchorIso(null);

    const count = selectedNights.length;
    const noun = count === 1 ? "night" : "nights";
    toast({
      message: (
        <span dir="auto">
          <Num>{`${String(count)} ${noun} ${opening ? "opened" : "blocked"}`}</Num>
          {selectedRange === null ? null : (
            <>
              {" · "}
              <span className="num">{selectedRange}</span>
            </>
          )}
        </span>
      ),
      icon: <CheckMark className="size-5" />,
      action: {
        label: "Undo",
        onClick: () => {
          write(previous);
          setSelected(new Set(selectedNights));
        },
      },
    });
  }, [selectedNights, listing.id, currentBlocked, allSelectedBlocked, selectedRange, toast]);

  /* ─────────────────────────────── render ───────────────────────────────── */

  const hasSelection = selectedNights.length > 0;
  const actionLabel = allSelectedBlocked ? "Open these nights" : "Block these nights";

  return (
    <>
      <h1 className="text-h5 font-semibold text-primary">Your calendar</h1>

      {/* Not decoration and not fine print: the one sentence standing between a
          host and reading an invented name as somebody who is coming to their
          home. Same component, same reason, as `/host/reservations`. */}
      <SampleDataStrip className="mt-4" />

      <div className="mt-6">
        {LISTINGS.length > 1 ? (
          <Segmented
            name="host-calendar-listing"
            value={listing.id}
            onChange={(value) => {
              setListingId(value);
              setSelected(new Set());
              setAnchorIso(null);
            }}
            label="Which home"
            hint={
              <span dir="auto">
                {`${listing.city}. Blocked nights belong to one home at a time.`}
              </span>
            }
            /*
             * `w-fit` so the track hugs its labels instead of spanning 1072px.
             * The segments keep `flex-1` and so stay equal to each other, which
             * is the whole reason this control is a segmented one rather than a
             * select: two homes read as two facing choices, not a list.
             */
            className="w-fit max-w-full"
          >
            {LISTINGS.map((option) => (
              <Segment key={option.id} value={option.id}>
                {option.name}
              </Segment>
            ))}
          </Segmented>
        ) : (
          <p className="text-bodyMd font-medium text-primary">
            {listing.name}
            <span className="font-regular text-secondary"> · {listing.city}</span>
          </p>
        )}

      </div>

      {/*
        The month name sits WITH the controls that change it, at the reading
        start, with the pair at the reading end. Not centred between them:
        `HOST-SHELL.md` §3 had to reach for a grid to centre one caption between
        two buttons of unequal width, and here there is no reason to try — a
        left-aligned heading is what every other section on this shell does, and
        it means the arrows never move when September follows May.
      */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {/*
          `dir="auto"` on an INLINE span, and it is load-bearing under RTL.
          "August 2026" is one label whose two halves must not swap, but `.num`
          isolates the year into its own bidi run, so in an RTL container the two
          reorder and the heading reads "2026 August". `dir="auto"` resolves the
          span from its first strong character — Latin here, Arabic on the Urdu
          route — so the label keeps its own word order in either language while
          the heading itself still hugs the page's reading start. It is on a
          span rather than the `h2` for exactly that reason: a block would take
          its text-align from the resolved direction and pull the month to the
          wrong edge of an RTL page.
        */}
        <h2 className="text-h6 font-semibold text-primary">
          <span dir="auto">
            <Num>{month.title}</Num>
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthIso(startOfMonth(today))}
            disabled={atCurrentMonth}
            className={`${btnSecondaryMd} px-4 disabled:text-disabled disabled:hover:bg-raised`}
          >
            This month
          </button>
          <MonthNav direction="prev" disabled={atEarliestMonth} onClick={() => pageMonths(-1)} />
          <MonthNav direction="next" onClick={() => pageMonths(1)} />
        </div>
      </div>

      <MonthGrid
        month={month}
        listingName={listing.name}
        selected={selected}
        focusedIso={tabbableIso}
        onToggle={toggleNight}
        onFocusNight={setFocusedIso}
        registerCell={registerCell}
        onKeyDown={onKeyDown}
        gridRef={gridRef}
      />

      {/* A multi-select whose whole state lives in a ring is a set a screen
          reader user builds blind. This is how they hear it. */}
      <p className="sr-only" role="status">
        {selectionSummary(selected, allSelectedBlocked)}
      </p>

      <Legend />

      <p className="mt-4 flex max-w-[62ch] items-start gap-2 text-label font-regular leading-relaxed text-secondary">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-tertiary" />
        <span dir="auto">
          Prices are per night, in PKR. A booked night cannot be blocked, so a guest who has
          already paid can never be shut out of the home.
        </span>
      </p>

      {/*
        THE ACTION BAR IS A FIXED SLOT, and that is `HOST-SHELL.md` §3's own
        answer to this exact problem: a bar that appears and disappears shoves
        the page every time the host answers a question. So it is always drawn,
        the primary is always in place, and the second line changes from the
        instruction to the caveat rather than arriving and leaving.

        `bg.raised` is TASTE §6's info-strip job, which means the §5 gray-fill
        button on it has to invert to `bg.canvas` — `btnSecondaryOnTint`, the
        recipe `components/ui.ts` already spells out for a plate sitting on the
        one tinted band.
      */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md bg-raised px-4 py-3">
        <div className="min-w-0">
          {/* Same `dir="auto"` isolate as the month heading, for the same
              reason: the count and the range are one sentence and `.num` would
              otherwise let an RTL container reorder them past each other. */}
          <p className="text-bodyMd font-semibold text-primary">
            {hasSelection ? (
              <span dir="auto">
                <Num>{`${String(selectedNights.length)} ${
                  selectedNights.length === 1 ? "night" : "nights"
                } selected`}</Num>
                {selectedRange === null ? null : (
                  <>
                    {" · "}
                    <span className="num font-regular text-secondary">{selectedRange}</span>
                  </>
                )}
              </span>
            ) : (
              "Block nights you need for yourself"
            )}
          </p>
          <p className="mt-1 text-label font-regular text-secondary">
            {hasSelection
              ? "Nothing is saved yet. A block lasts until you reload this page."
              : "Choose nights above. Hold Shift to take a whole run."}
          </p>
        </div>

        <div className="flex flex-none items-center gap-4">
          <button
            type="button"
            onClick={commit}
            disabled={!hasSelection}
            /*
             * Disabled keeps its PLATE and loses only its label, which is
             * `HOST-SHELL.md` §4's rule read correctly for this ground. §4 says
             * a disabled control is a `bg.raised` fill plus `text.disabled`,
             * same size, same place, same label — but `bg.raised` IS this
             * strip, so taking it here would erase the button into the band and
             * leave three words floating. The relationship §5 actually
             * specifies is "one neutral step off the surface it sits on", so
             * the step stays `bg.canvas` and the label dims.
             */
            className={`${btnSecondaryOnTint} disabled:text-disabled disabled:hover:bg-canvas`}
          >
            {actionLabel}
          </button>
          {hasSelection ? (
            <button
              type="button"
              onClick={() => {
                setSelected(new Set());
                setAnchorIso(null);
              }}
              className={inlineAction}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <p className="mt-4 text-bodySm font-regular text-secondary">
        <Link href="/host/reservations" className={inlineAction}>
          See who is coming, in Reservations
        </Link>
      </p>
    </>
  );
}

/**
 * `placement="top"`, and the prop's own doc names this case: the bottom edge of
 * this page is the action bar, and a toast reporting on a block that landed on
 * top of the control that made it would cover the thing it is talking about.
 *
 * The provider is mounted here rather than in the root layout because nothing
 * else on the site uses it yet and a provider is a client boundary. If a second
 * surface needs one, it belongs above both, not twice.
 */
export function HostCalendar({ today }: HostCalendarProps) {
  return (
    <ToastProvider placement="top" label="Calendar updates">
      <HostCalendarSurface today={today} />
    </ToastProvider>
  );
}

export default HostCalendar;
