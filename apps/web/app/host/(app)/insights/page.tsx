import type { Metadata } from "next";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { HostEmpty } from "@/components/host/host-empty";
import { btnSecondary, inlineAction } from "@/components/ui";

/**
 * `/host/insights` — `HA-066` at web width, and the honest version of it is a
 * single empty state.
 *
 * This is the last of the host nav's six tabs to stop being a registry stub. It
 * is also the only one where translating the card faithfully would have meant
 * printing figures no system in this product measures, so the work here was
 * almost entirely subtraction, and the subtraction is the deliverable.
 *
 * WHAT `ha-066` DRAWS, AND WHY EACH BLOCK CANNOT SHIP
 * --------------------------------------------------
 * The card is the largest phone card in the corpus (887 lines) and every one of
 * its blocks fails on the same fact: **occupancy, attention and reputation are
 * three measurements SalamStay does not take.**
 *
 *  · **The occupancy headline (`78%`), the per-listing rows (`91%` / `74%` /
 *    `70%`) and every delta chip (`+6%`, `+11%`, `−2%`).** Occupancy is nights
 *    booked ÷ nights AVAILABLE, and this build has no availability store —
 *    `../calendar/calendar-data.ts` opens by saying so and then refuses the same
 *    figure for the same reason ("No occupancy figure, no percentage, no 'booked
 *    through', no demand signal"). The numerator is derivable from
 *    `../reservations/reservations.ts`; the denominator does not exist, and a
 *    fraction with an invented denominator is an invented fraction. A delta
 *    needs a second period on top of that, and there is only ever one.
 *  · **The six-month trend chart and its data table.** `/host/earnings` already
 *    recorded the reasoning and it holds harder here: the one booking-shaped
 *    fixture in this product has an empty `past` bucket, so drawing six months
 *    of history would mean writing five months that contradict two sibling
 *    screens. (`SCREENS.md` §1.2's chart rule — accessible table, never
 *    chart-only — is therefore not in play. There is no chart to caption.)
 *  · **"What guests mention"** — the theme counts (`14 of 20`), the quoted
 *    guests, the "Worth a look" pair, and the `20 most recent reviews` window
 *    they are all counted across. **This product has zero reviews.** Not a thin
 *    set, not an unrendered set: no review model, no review route, no review
 *    fixture. The card's own note argues that counting themes is the honest
 *    alternative to an invented star average, and it is — but only once there
 *    are reviews to count. Counting themes across twenty reviews that do not
 *    exist is the same fabrication one layer down.
 *  · **The three improvement tasks.** Each is stated as a checkable fact about
 *    the host's own listings, and not one of the three facts is knowable here:
 *    photo counts per listing (no listings store — `LISTINGS` in
 *    `../calendar/calendar-data.ts` is derived from bookings and carries a name,
 *    a city and a rate, nothing else), a review awaiting a public reply (no
 *    reviews), and availability set past a date (no availability store, again).
 *  · **The Ramadan and Eid seasonality note.** `REPOSITIONING.md` retires the
 *    Eid-week policy and the religious framing outright, `HOST-SHELL.md` §16.3
 *    withdrew the Ramadan/Eid extension it was attached to and recorded that the
 *    product no longer ships the Hijri calendar those dates were read off, and
 *    §0.2 forbids carrying `ha-*` content forward without that check. It is not
 *    softened here; it is absent.
 *  · **The `This month / Last 6 months / This year` range control.** Identical
 *    to the one `/host/earnings` removed, removed for the identical reason: it
 *    filters a history this product does not have. Removing it is also what
 *    keeps this file a Server Component (see the metadata note below).
 *
 * WHAT SURVIVES: the link out to `/host/earnings`, which the card also carries,
 * and which resolves.
 *
 * NOT "YOU HAVE NO DATA" — AND THE DISTINCTION IS THE WHOLE COPY
 * -------------------------------------------------------------
 * The obvious empty state here says the host has done nothing yet. It would be
 * untrue and it would be insulting: this account has a guest checked in right
 * now and two more stays confirmed. The blocker is not an empty account, it is
 * that **the product takes no measurement**, so every sentence on this page is a
 * statement about SalamStay rather than about the host.
 *
 * That is also why the page has no branch. `/host/earnings` and `/host/calendar`
 * both flip to a first-run empty when `RESERVATIONS` empties; this one does not,
 * because a completed stay would not unlock occupancy, reviews or a benchmark.
 * A conditional here would need a second branch, and there is no honest second
 * branch to write.
 *
 * NO FIGURE IS RENDERED, so `SampleDataStrip` is deliberately NOT imported.
 * That strip exists to stand between a host and reading written-in figures as
 * their own money, and this page shows no figure, no name, no date and no
 * amount. Shipping it here would be a disclaimer about content that is not on
 * the page — and it would say "the reservations on this page are written into
 * it" about a page with no reservations on it. The day a real measurement lands
 * on this surface, the strip lands with it.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated)
 * -------------------------------------------------
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb. `<main class="co-main">` arrives from
 * `HostAppShell` via the `(app)` route group, so this file adds no chrome.
 *
 * THE METADATA TRAP NEVER OPENS. `/host/reservations` and `/host/calendar` are
 * thin Server wrappers over `"use client"` siblings because their tab strip and
 * their grid hold state, and `G41` — a HARD gate comparing the served `<title>`
 * to the registry byte for byte and rejecting duplicates across a run — failed
 * eight wizard steps that tried to inherit a title from a layout. **This page
 * holds no state at all**, so it follows `/host/earnings`: one Server Component,
 * `metadata` declared right here. The string is byte-identical to the one
 * `lib/seo/route-registry.ts` already carries for this route as a `stub()`, so
 * flipping that row to `page()` is the whole registry change and the title does
 * not move. Written out rather than read through `pageMetadata`, matching all
 * five sibling sections: that helper throws on a path the registry does not
 * carry as a real row, and the registry is updated centrally.
 *
 * ONE `<h1>`: "Insights", at the `h5` rung, naming the region rather than
 * shouting a page title at a surface whose nav one row up already says where the
 * host is — the reasoning `/host/earnings`, `/host/calendar`, `/host/listings`
 * and `/host/reservations` all record. It is NOT `/host/today`'s pattern of
 * letting the empty's own line be the `h1`: that empty is a welcome, and a
 * heading that reads "No figures yet" would state a condition where a landmark
 * heading has to name a place.
 */
export const metadata: Metadata = {
  title: { absolute: "Insights — SalamStay hosting" },
};

/**
 * The section's own glyph — a baseline and three bars.
 *
 * Drawn here rather than imported because the three glyph modules that exist are
 * each a closed set with a stated scope: `components/icons.tsx` is chrome-shared,
 * `components/home-icons.tsx` is the `gw-001` set, and
 * `components/booking/pay-glyphs.tsx` opens by saying that if a mark is not in
 * `gw-024` or `gw-025` "it does not exist on these two screens" — which is
 * precisely why its `TaxBarsIcon`, the one bar-chart path already in the
 * codebase, is not reached for from a host route. One glyph on one surface is
 * the case that module's own note describes, so it duplicates the wrapper for
 * the reason it records, and the stroke comes from `iconStroke` rather than a
 * literal.
 *
 * It names the SECTION, not the missing content: a bar chart is what "Insights"
 * is about, and `HostEmpty`'s note is explicit that an empty state's illustration
 * is the least important thing in it. It promises no chart, and none is coming
 * until something is measured.
 *
 * Decorative — it always sits above a real heading — so `aria-hidden`.
 */
function InsightsGlyph({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4 20h16" />
      <path d="M7 20v-5M12 20v-9M17 20v-3" />
    </svg>
  );
}

export default function HostInsightsPage() {
  return (
    <>
      <h1 className="text-h5 font-semibold text-primary">Insights</h1>

      <HostEmpty
        className="mt-4"
        glyph={<InsightsGlyph className="size-6" />}
        title="No figures yet"
        /*
         * `HostEmpty`'s three rules, checked one by one: never a count of
         * nothing (there is no count here at all), never a dead end (both next
         * steps below go somewhere that renders), never an apology (this states
         * what the product does, and does not ask to be forgiven for it).
         *
         * Two clauses, three lines at the component's 46ch measure, and both
         * clauses are about SalamStay rather than about this host — see the
         * file header. "Reviews" and "how often a home is viewed or searched
         * for" are named specifically because they are what a host arriving at
         * a tab called Insights is most likely to be looking for, and a host who
         * cannot find them is entitled to know they are not hidden somewhere
         * else on the site.
         */
        body="SalamStay does not collect reviews yet, and it does not count how often a home is viewed or searched for. There is nothing here to summarise."
        actions={
          /*
           * NO GREEN. `HOST-SHELL.md` §7 rules the host app surface already over
           * TASTE §2's four-role budget through `ha-046`'s inherited chip, nav
           * underline and avatar, and says exactly what to do about it: **"Add
           * nothing to it."** So this is the §5 gray-fill secondary, then the §8
           * inline action beside it — a ranked pair, the shape `/host/earnings`
           * and `/host/today` both ship, rather than two identical plates with
           * no rank between them.
           *
           * Both destinations are registered routes that render, and both were
           * chosen because they hold the figures this page cannot compute:
           * earnings has what each stay paid, the calendar has which nights are
           * spoken for. `ha-066`'s own two links point at `/host/reviews` and a
           * seasonal-pricing route, neither of which exists.
           */
          <>
            <Link href="/host/earnings" className={btnSecondary}>
              Go to your earnings
            </Link>
            <Link href="/host/calendar" className={`${inlineAction} text-bodySm`}>
              See which nights are booked
            </Link>
          </>
        }
      />

      {/*
        The one paragraph on the page, and it is doing the same job
        `/host/earnings` gives its closing sentence: reconciling what the host
        expected to find with what is actually here, so nobody has to work it out
        themselves.

        Three short sentences, one per missing measurement, each naming the
        record it would need rather than the feature it would be. Then the rule
        the whole build runs on, stated in the present tense, because it is
        current behaviour and not a promise about a later release.

        `text.secondary`, not `text.tertiary`: this is prose a host is expected
        to READ, the distinction `components/ui.ts` records for `fieldHint`
        against `hostFieldSub`, and the tertiary ramp is under AA review at body
        sizes besides (GO-LIVE C7).

        No digits, deliberately — which is also why nothing on this page needs
        `.num` or a `dir="auto"` isolate. The moment a figure arrives here, both
        do.
      */}
      <p className="mt-8 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Occupancy needs a record of which nights each home was open. A summary of what guests say
        needs reviews. A comparison needs figures from other hosts. SalamStay holds none of the
        three, and it does not print a figure it cannot show you the working for.
      </p>
    </>
  );
}
