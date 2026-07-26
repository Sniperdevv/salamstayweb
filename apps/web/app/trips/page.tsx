import type { Metadata } from "next";
import Link from "next/link";

import { CalendarIcon } from "@/components/icons";
import { btnPrimaryPill } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo/metadata";

/*
 * `TripMain` and `TripPageHead` live in `app/trips/[id]/trip-chrome.tsx` because
 * the three `/trips/{id}/*` children were built first and all sit beside it. The
 * import path is the honest consequence and not a preference — the alternative
 * is a second copy of §4's column string on the one page in this tree that is
 * not under `[id]`, and one authenticated content width means one declaration of
 * it. Flagged for a move up to `app/trips/trip-chrome.tsx` once the `/trips`
 * wave lands; that is a rename across four import sites, not a design decision.
 */
import { TripMain, TripPageHead } from "./[id]/trip-chrome";

/**
 * `/trips` — GA-070 at web width, in `GUEST-SHELL.md` §4a's index frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PAGE RENDERS EMPTY. THAT IS THE STATE, NOT AN UNFINISHED BRANCH.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * There is no booking store — no auth, no bookings table, and no session that
 * outlives a checkout (`lib/booking/booking-state.tsx` is React context and dies
 * when the guest leaves `/book/*`). So this page has nothing to read, and §14
 * says what to do about it, naming this card by number:
 *
 *   > `ga-070`, `ga-071`, `ga-134` — never invented: **booking references**
 *   > (`SS-7F3K9Q`), totals, dates, receipt and invoice numbers. The canonical
 *   > thread is a *card fixture*; a live surface renders the record or refuses.
 *   > Where a card draws one, suppress the element — do not substitute a dash,
 *   > and do not ship a zero.
 *
 * A LIST is the sharpest case of that rule, because a list is a claim about
 * everything the reader has. `ga-070`'s populated panel draws one upcoming stay
 * and three past ones; rendering it here would tell every visitor — including
 * one who has never booked anything — that they have four bookings, two of them
 * on dates that have passed and one mid-refund. That is `GO-LIVE` A11 one level
 * up from where it was found, and unlike `/trips/{id}` it cannot be qualified by
 * a strip: a sentence saying "these four are examples" under a heading that says
 * "Your trips" is a page arguing with itself.
 *
 * So the composition that is deliberately NOT built here: the `.upnext` trip
 * hero, the `.prow` past rows, the `Upcoming` / `Past` section labels, and the
 * `Completed` / `Refunding` status chips. Not because they are hard — because
 * every one of them needs a record, and there is one record in this build, it is
 * a worked example, and it has its own page which says so on screen
 * (`app/trips/[id]/page.tsx`).
 *
 * §12 is the other half of the same ruling and it is why this is not a
 * placeholder: *"**No guest has a trip**, a message, a wishlist, a review, a
 * receipt or a completed verification. Empty is what every one of these surfaces
 * renders on day one, so it is specified first and built first, not folded in at
 * the end."* This IS the day-one page.
 *
 * WHAT IS ALSO NOT HERE, AND WHY
 * ------------------------------
 *  · **No filter or tab strip.** §4a permits one; with one list and no rows in
 *    it, tabs would be four ways to reach the same empty — the reasoning
 *    `/host/reservations` already records for its own first-run branch.
 *  · **No `Requests` entry point**, though `/trips/requests` is a registered
 *    stub. §1d: *"Request-to-book is not built. `BUILD-DECISIONS.md` #10 rules
 *    Instant Book only. `/trips/requests*` stays a `stub()`; do not design the
 *    request lifecycle on web."* Under Instant Book a guest cannot have a
 *    request, so an entry point to their requests asserts a lifecycle the
 *    product does not have.
 *  · **No support line under the `<h1>`.** §4a allows one, but the empty
 *    state's own sentence already says what this surface will hold, and a page
 *    head that says it first makes the reader read it twice.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `./layout.tsx` and again off the
 * registry row here; no canonical, no hreflang, no JSON-LD, no breadcrumb;
 * `<main class="co-main">` from `TripMain`; one `<h1>`, paired with the
 * registered title for G43 — title `Your trips — SalamStay`, `<h1>` `Your
 * trips`, which is the pair §2 writes out as its worked example.
 */
export const metadata: Metadata = pageMetadata("/trips");

export default function TripsPage() {
  return (
    <TripMain>
      {/*
        §4a's `.pagehead` heading is 26/600; the type scale has no 26 and `h4`
        (24) is the rung below it — the rung `TripPageHead` already fixes for
        every `/trips/*` surface, so the list and the trip it opens carry one
        heading size.
      */}
      <TripPageHead title="Your trips" />

      <EmptyState
        glyph={<CalendarIcon className="size-7" />}
        title="No trips yet"
        /*
          19 words, under §12's 25. It states what this surface will HOLD rather
          than apologising for what it does not, and it names things that are
          real on the trip page it describes — the dates, the host, the receipt —
          not features nobody has written.
        */
        body="When you book a stay it appears here, with your dates, your host and your receipt in one place."
        action={
          /*
            §12.4: exactly one action, naming the exact next step. `ga-070`'s is
            "Explore stays" → `/explore`; §1b.1 strikes that route — *"the
            guest's home on web is `/`"* — because shipping `/explore` would mint
            a second homepage canonicalising away from itself, which is the
            doorway shape SEO-RULES §6 penalises.

            This is the surface's ONE primary CTA and therefore the one place
            brand green is spent on it (§8, TASTE §2 role 3). §8 is explicit that
            an empty state is where that green belongs. The header's Sign up
            yields on this route — `components/header-cta.ts`.

            `no-underline` because `btnPrimaryPill` is a button, and TASTE §8's
            underline-at-rest governs inline text actions, not filled controls.
          */
          <Link href="/" className={`${btnPrimaryPill} no-underline`}>
            Find a place to stay
          </Link>
        }
      />
    </TripMain>
  );
}
