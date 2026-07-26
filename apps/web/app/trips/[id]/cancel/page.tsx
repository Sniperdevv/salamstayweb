import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Num } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import {
  TRIP,
  formatStayRange,
  formatTripDateTime,
  isTripId,
  refundIfCancelledAt,
  tripPath,
} from "@/lib/booking/trip-record";
import { pageMetadata } from "@/lib/seo/metadata";

import CancelFlow from "./step";
import { ExampleBookingStrip, TripBackLink, TripPageHead } from "../trip-chrome";

/**
 * GA-105 — `/trips/{id}/cancel`, at web width.
 *
 * WHAT THE ROUTE DOES BEFORE THE CLIENT SEES ANYTHING
 * ---------------------------------------------------
 * Two decisions are taken here, on the server, and handed down as facts:
 *
 * 1. **Does this booking exist?** GUEST-SHELL.md §12 / GO-LIVE A11 — any id but
 *    the canonical one is a 404, never a cancellation screen improvised around
 *    a slug.
 * 2. **What comes back TODAY?** `/legal/guest-refund-policy` is the canonical
 *    source and it closes on a promise this screen has to keep: *"you see this
 *    ledger, for today's date, before you confirm."* So the ledger is computed
 *    once from one clock and passed to the step as a prop. A client that
 *    recomputed would disagree with the server for a hydration frame, and the
 *    figure in question is what a guest is about to accept as final.
 *
 * `refundIfCancelledAt` reads the listing's own published policy — `is-f7-2bed`
 * ships *"Cancellation: Flexible — Free cancellation up to 48 hours before
 * check-in"* on the indexable page this guest booked from — and the after-window
 * ledger is the worked example on the refund page, which is written against
 * this exact booking.
 *
 * ROUTE CONTRACT (GUEST-SHELL.md §2): `noindex, follow` from the registry entry;
 * no canonical, no hreflang, no JSON-LD, no breadcrumb; `<main class="co-main">`.
 *
 * The `<h1>` moves with the flow's state, so it lives in the client body — the
 * served HTML carries the first step's, which is the one G30/G41/G43 read.
 */

const CANCEL_PATH = tripPath("cancel");

/**
 * Per request, never frozen at build. The whole screen is an answer to "what
 * happens if I cancel *now*", and a build-time date would answer for a day that
 * has passed. `noindex`, so no caching is being given up.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isTripId(id)) notFound();
  return pageMetadata(CANCEL_PATH);
}

export default async function TripCancelRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isTripId(id)) notFound();

  const outcome = refundIfCancelledAt(new Date());
  const stayRange = formatStayRange();

  /*
    The stay is over, so there is nothing to cancel and no ledger to show.
    Rendered on the server as a terminal state rather than passed to the flow:
    a wizard whose first step is "you cannot do this" is not a wizard.

    GUEST-SHELL.md §12's no-dead-ends rule still binds — the state names the two
    things that ARE available on a finished stay.
  */
  if (outcome.stage === "over") {
    return (
      <>
        <TripBackLink href={tripPath()}>Your trip</TripBackLink>

        <TripPageHead
          className="mt-5"
          title="Cancel your booking"
          sub={
            <>
              This stay has already ended, so there is nothing left to cancel. Your receipt stays
              available, and you can still write about how it went.
            </>
          }
        />

        <ExampleBookingStrip className="mt-6">
          Nothing here changes a real reservation.
        </ExampleBookingStrip>

        <p className="mt-6 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary">
          <span>
            <Num>{`${TRIP.home}, ${stayRange}`}</Num>
          </span>{" "}
          finished on{" "}
          <span>
            <Num>{formatTripDateTime(TRIP.checkOut)}</Num>
          </span>
          .
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={tripPath("receipt")} className={`${btnSecondary} no-underline`}>
            See your receipt
          </Link>
          <Link href={tripPath()} className={`${inlineAction} text-bodySm font-medium`}>
            Back to your trip
          </Link>
        </div>
      </>
    );
  }

  return (
    <CancelFlow
      outcome={outcome}
      stayRange={stayRange}
      freeUntilLabel={formatTripDateTime(TRIP.freeCancellationUntil)}
    />
  );
}
