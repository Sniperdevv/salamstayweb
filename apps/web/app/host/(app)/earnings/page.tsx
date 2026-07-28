import type { Metadata } from "next";
import Link from "next/link";

import { inlineAction } from "@/components/ui";

import { SampleDataStrip } from "../reservations/reservation-parts";
import {
  DeductionGlossary,
  EarningsEmpty,
  MoneySubpages,
  PayoutSection,
} from "./earnings-parts";
import { hasUnansweredRequests, payoutGroups } from "./earnings";

/**
 * `/host/earnings` — HA-055 at web width.
 *
 * The fifth of the host nav's six sections to stop being a registry stub, and
 * one of only five `HA-` cards in a 78-card namespace drawn at web width rather
 * than in a phone frame — so the layout question was already answered and the
 * work here was the honesty pass on top of it.
 *
 * WHY THIS FILE EXPORTS `metadata` AND HAS NO CLIENT SIBLING
 * ----------------------------------------------------------
 * `/host/reservations` is a thin Server wrapper over a `"use client"` sibling
 * because its tab strip holds state, and G41 — a HARD gate comparing the served
 * `<title>` to the registry byte for byte and rejecting duplicates across a run
 * — failed eight wizard steps that had tried to inherit a title from a layout
 * instead. **This page holds no state at all**, so the trap never opens: it is
 * one Server Component and the title is declared right here.
 *
 * It holds no state because both candidates for it were removed rather than
 * built. `ha-055`'s date-range segmented control (This month / Last 6 months /
 * This year / Custom) filters a history this product does not have, and tabbing
 * released money away from held money would hide half of a host's money behind
 * a click on the one screen where they came to see all of it.
 *
 * WHAT THE CARD DRAWS THAT THIS PAGE DOES NOT, AND WHY
 * ---------------------------------------------------
 *  · **The six-month gross-vs-net chart** and its data table. The chart is not
 *    the problem — the six months are. The only booking-shaped fixture in this
 *    product is `../reservations/reservations.ts`, its `past` bucket is empty on
 *    purpose, and one released stay is one point. Drawing a trend line through
 *    it would mean writing five months of history that contradicts the sibling
 *    screen. (`SCREENS.md` §1.2's chart rule — accessible table, never
 *    chart-only — is therefore not in play: there is no chart to caption.)
 *  · **Every percentage.** `−3%`, `−1.8%`, `−1%`, `94.2% of gross`. No fee rate,
 *    commission rate or withholding rate is published on this surface, so the
 *    deductions are amounts and the totals are sums.
 *  · **The next-payout tile** — a named date, a named bank and a masked account
 *    number. Nothing schedules a payout in this build.
 *  · **The tax-documents tile** — a withholding certificate, an FBR e-invoice
 *    reference and a downloadable receipt for a tax year. None of the three
 *    exists as a record or a route.
 *  · **`Service fee (wakala)`** → `Service fee`, and `held in amanah` → `held in
 *    trust` (`REPOSITIONING.md`; `HOST-SHELL.md` §0.2).
 *
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb, and `<main class="co-main">` arrives from
 * `HostAppShell` via the `(app)` route group — `HOST-SHELL.md` §1, not restated
 * here.
 *
 * ONE `<h1>`: "Your earnings", at the `h5` rung, for the reason
 * `/host/reservations` and `/host/listings` both record — the section nav one
 * row above already states where the host is, so the heading names the region
 * instead of shouting a title at a surface that has one.
 */
export const metadata: Metadata = {
  title: { absolute: "Your earnings — SalamStay hosting" },
};

export default function HostEarningsPage() {
  /*
   * Groups with nothing in them are dropped, not drawn empty.
   *
   * `HostEmpty`'s own rule is "never a count of nothing", and on a money screen
   * that is the sharpest version of it: a host with two confirmed stays and
   * nobody checked in yet must not read `Released to you · PKR 0` set in 24px
   * beside a real figure. `PKR 0` is a true sentence and a false metric —
   * TASTE §12 says null money is a skeleton or an absence, never a rendered
   * zero — so the heading leaves with its rows.
   */
  const groups = payoutGroups().filter((group) => group.stays.length > 0);

  /*
   * THE FIRST-RUN CONDITION, AND IT IS THE ONE THAT REALLY SHIPS ON DAY ONE.
   *
   * A host who has never had a guest check in has earned nothing. Not a zero,
   * not a flat line, not an empty table with four column headings — nothing. So
   * this branch replaces the whole page rather than filling it, exactly as
   * `/host/reservations` replaces its tab strip and `hw-007` replaces
   * `ha-046`'s KPI row.
   *
   * Emptying `RESERVATIONS` is the whole change needed to see it, on this page
   * and on the reservations pages at once, because all three read one fixture.
   */
  if (groups.length === 0) {
    return (
      <>
        <h1 className="text-h5 font-semibold text-primary">Your earnings</h1>
        <EarningsEmpty />
      </>
    );
  }

  return (
    <>
      <h1 className="text-h5 font-semibold text-primary">Your earnings</h1>

      {/* The same strip `/host/reservations` ships, imported rather than
          re-coined — one sentence standing between a host and reading invented
          figures as their own money. It is literally true of this page: every
          amount below is one of those written-in reservations, itemised. */}
      <SampleDataStrip className="mt-4" />

      {groups.map((group) => (
        <PayoutSection key={group.key} group={group} />
      ))}

      {/*
        WHY A REQUEST IS NOT ON THIS PAGE, said out loud.
        A host arriving from `/host/reservations` has just seen two requests
        worth real-looking money. Neither is earnings — nobody has agreed to
        anything — and counting them would be a projection. Leaving them out
        silently invites the exact question this surface exists to answer, so
        the absence is stated and the sentence only renders when there is an
        absence to state.

        `text.secondary`, not `text.tertiary`: this is prose the host is expected
        to READ — the same distinction `components/ui.ts` records for `fieldHint`
        against `hostFieldSub` — and the tertiary ramp is already under AA review
        at body sizes (GO-LIVE C7). A sentence that reconciles two screens' money
        is not a caption.
      */}
      {hasUnansweredRequests() ? (
        <p className="mt-8 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
          A request you have not answered is not earnings, so nothing here counts one. You will
          find requests with{" "}
          <Link href="/host/reservations" className={inlineAction}>
            your reservations
          </Link>
          .
        </p>
      ) : null}

      <DeductionGlossary />

      {/*
        The two surfaces behind this one, at the foot rather than the head.

        A host arrives here for the figure and the itemisation, and both are
        above. Where has it gone, and what about tax, are the questions they ask
        NEXT — so the links sit after the glossary has answered the one about
        deductions, not competing with the money for the top of the page.

        Both are `page()` routes with folders under this one; neither is a stub.
      */}
      <MoneySubpages />
    </>
  );
}
