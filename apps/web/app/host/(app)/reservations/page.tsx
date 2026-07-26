import type { Metadata } from "next";
import Link from "next/link";

import { CalendarIcon } from "@/components/icons";
import { HostEmpty } from "@/components/host/host-empty";
import { btnSecondary } from "@/components/ui";

import { SampleDataStrip } from "./reservation-parts";
import { RESERVATIONS } from "./reservations";
import ReservationTabs from "./tabs";

/**
 * `/host/reservations` — HA-047 at web width.
 *
 * The fourth of the host nav's six sections to stop being a registry stub, and
 * the one that closes the hole the others do not: until this route existed a
 * booking could arrive and no surface in the product showed that it had.
 *
 * THIS FILE IS A SERVER COMPONENT AND `./tabs.tsx` IS THE CLIENT ONE
 * ------------------------------------------------------------------
 * The tab strip holds state, so it is `"use client"`, and a Client Component
 * cannot export `metadata`. Inheriting a title from a layout instead is exactly
 * what the nine wizard steps did, and G41 — a HARD gate that compares the
 * served `<title>` to the registry byte for byte AND rejects duplicates across
 * a run — failed eight of them for it. So the route is this thin wrapper and
 * the page is its one client sibling, the shape
 * `app/host/listings/new/photos/page.tsx` documents.
 *
 * The title is written out rather than read through `pageMetadata`, matching
 * `/host/today` and `/host/listings`: that helper throws on a path the registry
 * does not carry, and the registry is updated centrally after these folders
 * exist. It matches the registry string this route already had as a stub.
 *
 * `robots: noindex, follow` comes from `app/host/layout.tsx`. No canonical, no
 * hreflang, no JSON-LD, no breadcrumb, `<main class="co-main">` from
 * `HostAppShell` — `HOST-SHELL.md` §1, none of it restated here.
 *
 * ONE `<h1>`: "Your reservations", at the `h5` rung. Same reasoning
 * `/host/listings` records — the section nav one row above already states where
 * the host is, so this heading names the region rather than shouting a page
 * title at a surface that has one. The detail page underneath takes `h4`,
 * because "Reservations" in the nav does not tell you WHICH reservation.
 */
export const metadata: Metadata = {
  title: { absolute: "Your reservations — SalamStay hosting" },
};

export default function HostReservationsPage() {
  /*
   * THE FIRST-RUN CONDITION, AND WHY IT REPLACES THE TABS RATHER THAN FILLING
   * THEM.
   *
   * A host with no listing has no reservations, so an empty account is the
   * state this route really ships in on day one. Rendering the tab strip for it
   * would give a host four tabs, four zeroes and four empty panels to click
   * through to learn the same thing once — four empty states is not an empty
   * state, it is a broken one. So the strip is not drawn at all and a single
   * empty says it, which is also what `hw-007` does on `/host/today` and
   * `ha-035` on `/host/listings`.
   *
   * `RESERVATIONS` is a hand-written fixture (see its header). Emptying that
   * array is the whole change needed to see this branch.
   */
  if (RESERVATIONS.length === 0) {
    return (
      <>
        <h1 className="text-h5 font-semibold text-primary">Your reservations</h1>

        <HostEmpty
          className="mt-4"
          glyph={<CalendarIcon className="size-6" />}
          title="No reservations yet"
          body="A booking lands here the moment a guest asks to stay — with their dates, what you would earn, and how long you have to answer. If you have not listed a place yet, that is where it starts."
          actions={
            /*
             * NO GREEN ON THIS PAGE, IN EITHER BRANCH — and the destination is
             * the honest one rather than the obvious one.
             *
             * The obvious action here is `Create a listing`, and it would be
             * wrong twice. This route cannot know whether the host already has
             * a listing and is simply waiting for a first booking, so offering
             * to create one asserts something about their account that nothing
             * here knows. And it would be a second green primary beside the
             * nav's identical `Create a listing`, which is the duplicate
             * `hw-007` panel E exists to correct — resolved there by making the
             * nav yield, which a page cannot ask for at runtime.
             *
             * `/host/listings` answers both: it is the page that DOES know
             * whether a listing exists, and it already carries the green
             * `Create a listing` for the case where one does not. So this is
             * the §5 gray-fill secondary pointing at it, the nav keeps its
             * green on every branch of this route, and the host reaches the
             * same wizard one honest step later.
             */
            <Link href="/host/listings" className={`${btnSecondary} no-underline`}>
              Go to your listings
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <h1 className="text-h5 font-semibold text-primary">Your reservations</h1>

      {/* Not decoration and not a disclaimer in fine print: the one sentence
          standing between a host and reading an invented name as a person who
          is coming to their home. It renders only where there is sample data to
          qualify — the empty branch above has nothing to be honest about. */}
      <SampleDataStrip className="mt-4" />

      <ReservationTabs />
    </>
  );
}
