"use client";

import Link from "next/link";
import { useState } from "react";

import { CalendarIcon, ChevronRightIcon, ClockIcon, HomeIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { HostEmpty } from "@/components/host/host-empty";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tab-strip";
import {
  btnSecondary,
  btnSecondaryOnTint,
  focusRing,
  pressableSurface,
  tintTransition,
} from "@/components/ui";
import { formatPkr } from "@/lib/money";

import {
  GuestAvatar,
  ListingChip,
  StatusChip,
  VerifiedChip,
} from "./reservation-parts";
import {
  RESERVATION_TABS,
  ROW_STATUS_LABEL,
  STATUS_LABEL,
  reservationHref,
  reservationsIn,
  type Reservation,
  type ReservationStatus,
} from "./reservations";

/**
 * HA-047's four buckets, at web width.
 *
 * WHY `Tabs` + `TabList` AND NOT `TabStrip` — the choice `tab-strip.tsx` says is
 * a real defect to get wrong.
 * ---------------------------------------------------------------------------
 * That file ships both variants and draws the line precisely: *"a tablist
 * announces 'tab, 3 of 6' and promises a panel below it. If the click loads a
 * page, it is a link."* Requests / Upcoming / Current / Past load no page. All
 * four buckets come from the same fixture, all four panels are already in the
 * DOM, and switching is a filter on data that is already here — which is the
 * textbook in-page tablist, and is why this takes the roving-tabindex variant
 * with `role="tab"` / `role="tabpanel"` and Arrow-key movement that reads the
 * strip's computed direction so Right Arrow means "previous" under RTL.
 *
 * The host section nav one row above — Today / Calendar / Listings /
 * Reservations — is the other variant, and correctly so: those DO load pages.
 * Two controls, one skin, two semantics, on one screen.
 *
 * NO `?tab=` IN THE URL, and it is a trade rather than an oversight. `ha-047`'s
 * empty state links `/host/reservations?tab=upcoming`, which on the phone is a
 * navigation. Reading it here would mean `useSearchParams` and a Suspense
 * boundary around a control that resolves in a keystroke, and it would make
 * Arrow-key movement between tabs push four entries into browser history. When
 * a real store lands and a bucket has to be linkable from an email, the four
 * buckets become four routes and this becomes `TabStrip` — that is the moment
 * to change it, not before.
 *
 * NO PANEL TRANSITION. A host switches these tabs tens of times a day; an
 * animation on a control at that frequency reads as lag, not polish, and
 * `automatic` activation means arrowing across the strip would fire four of
 * them in a second.
 */

/** Where an empty bucket sends the host — one label per destination, no counts. */
const GO_TO_LABEL: Readonly<Record<ReservationStatus, string>> = {
  request: "See your requests",
  upcoming: "See your upcoming stays",
  current: "See who is staying now",
  past: "See your past stays",
};

/** Attention order: a request is waiting on the host, a completed stay is not. */
const ATTENTION_ORDER: readonly ReservationStatus[] = ["request", "current", "upcoming", "past"];

export default function ReservationTabs() {
  /*
   * Requests is the landing tab, always — including when it is empty. It is the
   * one bucket that is waiting on the host, so a page that opened somewhere
   * else would bury the only thing on it with a deadline. Its empty is a good
   * empty ("No requests waiting"), and the count beside the label tells the
   * host at a glance whether there is anything to open.
   */
  const [tab, setTab] = useState<ReservationStatus>("request");

  const requestCount = reservationsIn("request").length;

  return (
    /* `Tabs` renders no element of its own — the strip and the four panels stay
       the siblings `role="tablist"` requires, in the page's own flow. */
    <Tabs value={tab} onChange={(next) => setTab(next as ReservationStatus)}>
      <TabList label="Reservation status" className="mt-6">
        {RESERVATION_TABS.map((entry) => (
          <Tab key={entry.value} value={entry.value}>
            {entry.label}
            {/*
              A COUNT ON REQUESTS AND NOWHERE ELSE.

              `ha-047` puts a brand-filled counter on whichever tab has rows.
              Two changes here. The colour is neutral, because `HOST-SHELL.md`
              §7 rules the app surface already over TASTE §2's green budget and
              says to add nothing to it — and a count is not a selection either,
              so §3's ink fill is not its language. And it appears only on
              Requests, because that is the only bucket where the number is an
              ASK: three upcoming stays is a fact the rows already state, while
              three waiting requests is three people expecting an answer. A zero
              never renders — `hw-007` deletes a whole KPI row rather than show
              one, and a badge reading `0` is the same mistake in miniature.
            */}
            {entry.value === "request" && requestCount > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-raised px-1.5 py-0.5 text-caption font-semibold text-secondary">
                <span className="num">{requestCount}</span>
              </span>
            ) : null}
          </Tab>
        ))}
      </TabList>

      {RESERVATION_TABS.map((entry) => {
        const rows = reservationsIn(entry.value);

        return (
          <TabPanel key={entry.value} value={entry.value} className="pt-6">
            {rows.length === 0 ? (
              <EmptyBucket tab={entry.value} onGo={setTab} />
            ) : (
              <ul className="flex flex-col gap-3">
                {rows.map((r) =>
                  r.status === "request" ? (
                    <RequestCard key={r.id} reservation={r} />
                  ) : (
                    <ReservationRow key={r.id} reservation={r} />
                  ),
                )}
              </ul>
            )}
          </TabPanel>
        );
      })}
    </Tabs>
  );
}

/**
 * A bucket with nothing in it, on an account that has something in another one.
 *
 * Distinct from the page's first-run empty in `page.tsx`, and it has to be: a
 * host whose Past tab is empty has not failed at anything, they simply have not
 * finished a stay yet. So this states what will land here and offers the tab
 * that does have something — `HostEmpty`'s own rule that an empty never dead-
 * ends, answered with the cheapest true next step rather than a manufactured
 * one.
 */
function EmptyBucket({
  tab,
  onGo,
}: {
  readonly tab: ReservationStatus;
  readonly onGo: (next: ReservationStatus) => void;
}) {
  const entry = RESERVATION_TABS.find((t) => t.value === tab);
  const target = ATTENTION_ORDER.find((s) => s !== tab && reservationsIn(s).length > 0);

  if (entry === undefined) return null;

  return (
    <HostEmpty
      glyph={<CalendarIcon className="size-6" />}
      title={entry.emptyTitle}
      body={entry.emptyBody}
      actions={
        target === undefined ? undefined : (
          /* The §5 gray-fill secondary. A `<button>`, not a link — it moves a
             tab, and dressing a state change as a destination is how a control
             ends up in the middle-click menu doing nothing. */
          <button type="button" className={btnSecondary} onClick={() => onGo(target)}>
            {GO_TO_LABEL[target]}
          </button>
        )
      }
    />
  );
}

/* ─────────────────────────── the request card ───────────────────────────── */

/**
 * The one artifact on this screen that is not a row — `ha-047`'s `.reqcard`.
 *
 * It carries `bg.raised` where every other row is `bg.canvas`, which is the
 * card's own distinction and the honest one: this is the bucket that is waiting
 * on the host, and TASTE §6 already spends `bg.raised` on exactly this kind of
 * "this block is different from the scroll around it" job. Border, no shadow
 * (TASTE §1 — nothing here floats).
 *
 * IT IS NOT A LINK, and the rows below it are. Deliberate, and `ha-047` draws
 * it the same way: a request has a named action with a consequence attached, so
 * the action is a button-shaped control the host aims at, not a whole card that
 * navigates wherever it is clicked. `Review request` is the §5 gray-fill
 * secondary rather than the card's green fill — with two requests on screen, a
 * green CTA per card would be two "the one primary CTA on this surface" at once
 * (TASTE §2), and the surface's real green lives on the detail page where the
 * accept actually happens.
 */
function RequestCard({ reservation: r }: { readonly reservation: Reservation }) {
  return (
    <li className="rounded-lg border border-hairline bg-raised p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <GuestAvatar initials={r.initials} ground="raised" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-bodyMd font-semibold text-primary">{r.guest}</span>
            {r.verified ? <VerifiedChip /> : null}
          </div>
          {/* Party only. `ha-047` appends "docs verified"; the chip above
              already states verification, and saying it twice turns a fact into
              a boast. */}
          <p className="mt-0.5 text-bodySm font-regular text-secondary">{r.party}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-start gap-2 text-bodySm font-regular text-secondary">
            <HomeIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            <span>
              <b className="font-semibold text-primary">{r.listing}</b>, {r.city}
            </span>
          </p>
          <p className="mt-2 flex items-start gap-2 text-bodySm font-regular text-secondary">
            <CalendarIcon className="mt-0.5 size-4 flex-none text-tertiary" />
            <span>
              <Num>{r.dates}</Num> · <Num>{String(r.nights)}</Num>{" "}
              {r.nights === 1 ? "night" : "nights"}
            </span>
          </p>
          <p className="mt-2 text-bodySm font-regular text-secondary">
            {/* No underline: TASTE §8 underlines a price only where the price
                itself opens a breakdown. This one does not — `Review request`
                does, and it says so in words. */}
            <span className="num">{formatPkr(r.money.nightly)}</span> a night
          </p>

          {r.respondBy === undefined ? null : (
            <div className="mt-3">
              {/*
                A DEADLINE, NOT A COUNTDOWN. `ha-047` is explicit that this line
                is calm — a date and a time the host can plan around, never a
                ticking clock and never red. The `info` register says "this has
                a shape" without saying "you are late".
              */}
              <StatusChip tone="info" icon={<ClockIcon className="size-4" />}>
                <span>
                  Respond by <Num>{r.respondBy}</Num>
                </span>
              </StatusChip>
            </div>
          )}
        </div>

        <div className="flex-none">
          {/*
            `btnSecondaryOnTint`, not `btnSecondary`. This card is `bg.raised`
            and the §5 gray-fill button IS `bg.raised` — the same class here
            produces a label with no plate under it, which reads as neither a
            button nor an §8 inline action. `components/ui.ts` ships the
            inverted step for exactly this ground.
          */}
          <Link
            href={reservationHref(r.id)}
            className={`${btnSecondaryOnTint} w-full no-underline sm:w-auto`}
          >
            Review request
          </Link>
        </div>
      </div>
    </li>
  );
}

/* ──────────────────────────── the plain row ─────────────────────────────── */

/**
 * Upcoming, current and past — `hw-001` panel D's `.lrow` at reservation scale:
 * flex, `space-4` gap, `space-4` padding, hairline border, `radius.lg`,
 * `bg.canvas`, no shadow.
 *
 * The whole row is the link, because the row has exactly one destination and
 * nothing else to press. `pressableSurface` (`scale(.995)`) rather than the
 * standard `.97` — `components/ui.ts` documents why: at row width `.97` travels
 * far enough to read as the list lurching rather than the row answering.
 */
function ReservationRow({ reservation: r }: { readonly reservation: Reservation }) {
  const status = STATUS_LABEL[r.status];

  return (
    <li>
      <Link
        href={reservationHref(r.id)}
        className={`flex items-center gap-4 rounded-lg border border-hairline bg-canvas p-4 no-underline hover:border-border-strong ${tintTransition} ${pressableSurface} ${focusRing}`}
      >
        <GuestAvatar initials={r.initials} />

        <span className="min-w-0 flex-1">
          <span className="block text-bodyMd font-semibold text-primary">{r.guest}</span>
          <span className="mt-0.5 block text-bodySm font-regular text-secondary">
            {r.party} · <Num>{r.datesShort}</Num>
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <StatusChip tone={status.tone}>{ROW_STATUS_LABEL[r.status]}</StatusChip>
            <ListingChip>{r.listing}</ListingChip>
          </span>
        </span>

        {/* Mirrors under RTL. A chevron that keeps pointing right in an
            right-to-left document points back at where the host came from. */}
        <ChevronRightIcon className="size-5 flex-none text-tertiary rtl:-scale-x-100" />
      </Link>
    </li>
  );
}
