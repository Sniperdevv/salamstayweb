import type { Metadata } from "next";
import Link from "next/link";

import { CalendarIcon } from "@/components/icons";
import { HostEmpty } from "@/components/host/host-empty";
import { btnSecondary } from "@/components/ui";

import { LISTINGS } from "./calendar-data";
import { HostCalendar } from "./calendar";

/**
 * `/host/calendar` — `HA-041` at web width.
 *
 * The fifth of the host nav's six sections to stop being a registry stub, and
 * the one that closes the hole with the worst consequence: until this route
 * existed a host could not see which nights were already taken, and a double
 * booking is the one mistake on this product that cannot be walked back.
 *
 * THIS FILE IS A SERVER COMPONENT AND `./calendar.tsx` IS THE CLIENT ONE
 * ---------------------------------------------------------------------
 * The grid holds selection, month and blocked-night state, so it is
 * `"use client"`, and a Client Component cannot export `metadata`. Inheriting a
 * title from a layout instead is exactly what the nine wizard steps did, and
 * `G41` — a HARD gate that compares the served `<title>` to the registry byte
 * for byte AND rejects duplicates across a run — failed eight of them for it.
 * So the route is this thin wrapper and the page is its one client sibling, the
 * shape `../reservations/page.tsx` documents.
 *
 * The title is written out rather than read through `pageMetadata`, matching
 * `/host/today`, `/host/listings` and `/host/reservations`: that helper throws
 * on a path the registry does not carry as a real row, and the registry is
 * updated centrally. It is byte-identical to the string
 * `lib/seo/route-registry.ts` already holds for this route as a `stub()`.
 *
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb, `<main class="co-main">` from
 * `HostAppShell` — `HOST-SHELL.md` §1, none of it restated here.
 *
 * ONE `<h1>`: "Your calendar", at the `h5` rung, same reasoning the three
 * sibling sections record — the section nav one row above already says where
 * the host is, so the heading names the region rather than shouting a page
 * title at a surface that has one. The month below it takes `h6`.
 *
 * WHY `force-dynamic`
 * -------------------
 * The one thing this page reads that a build cannot know is the day. Rendered
 * once at build time, "today" would be frozen to whenever the deploy ran and the
 * grid would strike the wrong nights out from the next morning onward. Same
 * reason `app/book/[slug]/dates/page.tsx` carries it.
 */
export const metadata: Metadata = {
  title: { absolute: "Your calendar — SalamStay hosting" },
};

export const dynamic = "force-dynamic";

/**
 * Today, in the zone the host is standing in.
 *
 * `Asia/Karachi` is pinned rather than read from the machine, for the same
 * reason `lib/money.ts` pins `en-PK`: the answer must not depend on which server
 * rendered it. A box in Virginia is nine hours behind Karachi, so between
 * midnight and 09:00 PKT an unpinned `new Date()` would call yesterday "today"
 * and hand a host a calendar with a night already gone from it.
 *
 * `en-CA` is the locale whose short date format IS `YYYY-MM-DD`, which is the
 * shape every date function in `lib/booking/booking.ts` takes. This is the only
 * place on the route that reads a clock, and it reads it on the server so the
 * server HTML and the first client frame agree by construction.
 *
 * Lifted verbatim from `app/book/[slug]/dates/page.tsx`. Two pages now hold the
 * same three lines; the day a third needs them they belong in `lib/booking/`.
 */
const KARACHI_TODAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default function HostCalendarPage() {
  /*
   * THE FIRST-RUN CONDITION, AND WHY IT REPLACES THE GRID RATHER THAN FILLING IT.
   *
   * A host with no listing has no calendar. Not an empty one — none: a month of
   * nights with no home behind them is a grid of thirty-one cells that mean
   * nothing, and drawing it would ask a host to read a price for a property they
   * have not created. So the grid is not rendered at all and a single empty says
   * it, which is what `hw-007` does on `/host/today` and `ha-035` on
   * `/host/listings`.
   *
   * `LISTINGS` is derived from the reservations fixture (see `calendar-data.ts`),
   * so emptying `RESERVATIONS` empties this surface, `/host/reservations` and
   * `/host/earnings` in one edit — the single lever those two files already
   * promise. It is worth being plain about the join: this build has no listings
   * store, so "which homes exist" is answered by "which homes have stays", and
   * a real store would replace that line and nothing else on the page.
   */
  if (LISTINGS.length === 0) {
    return (
      <>
        <h1 className="text-h5 font-semibold text-primary">Your calendar</h1>

        <HostEmpty
          className="mt-4"
          glyph={<CalendarIcon className="size-6" />}
          title="No calendar yet"
          /*
           * The two facts a host needs before they have one, and no third. The
           * first is the promise the whole surface rests on and it is `ha-041`'s
           * own open-by-default sentence, reworded to the future tense because
           * nothing is open yet. The second says what a calendar is FOR, so the
           * empty is an explanation rather than a locked door.
           */
          body="Once you have a listing, every night starts open and bookable, and this is where you close the ones you need for yourself."
          actions={
            /*
             * NO GREEN ON THIS PAGE, IN EITHER BRANCH — and the destination is
             * the honest one rather than the obvious one.
             *
             * `Create a listing` is the obvious action and it would be wrong
             * twice, exactly as `/host/reservations` records. This route cannot
             * know whether the host already has a home and is simply between
             * bookings, so offering to create one asserts something about their
             * account that nothing here knows. And it would be a second green
             * primary beside the nav's identical `Create a listing`.
             *
             * `/host/listings` answers both: it is the page that DOES know, and
             * it already carries the green CTA for the case where no listing
             * exists. So this is the §5 gray-fill secondary pointing at it, the
             * nav keeps its green on every branch of this route, and the host
             * reaches the same wizard one honest step later.
             */
            <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
              Go to your listings
            </Link>
          }
        />
      </>
    );
  }

  return <HostCalendar today={KARACHI_TODAY.format(new Date())} />;
}
