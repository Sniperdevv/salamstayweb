import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import {
  TRIP,
  formatStayRange,
  formatTripDate,
  isTripId,
  tripPath,
} from "@/lib/booking/trip-record";
import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import ReviewComposer from "./step";
import { ExampleBookingStrip, TripBackLink, TripPageHead } from "../trip-chrome";

/**
 * GA-099 / GA-100 — `/trips/{id}/review`, at web width.
 *
 * THE DATE GATE, WHICH IS THE HONEST HALF OF THIS SCREEN
 * ------------------------------------------------------
 * A review is a report on a stay that happened. This booking runs 14–17 Aug
 * 2026, so for now there is nothing to report on, and a five-star composer for
 * a stay nobody has taken is the review-shaped version of the fabricated
 * receipt GUEST-SHELL.md §12 forbids. So the route asks the calendar first: the
 * composer renders once check-out has passed, and before that the page says
 * plainly when it opens and what to do meanwhile.
 *
 * Both branches are real, shipped code paths — the gate is not a placeholder
 * standing in for unfinished work. It is what this URL correctly renders today.
 *
 * WHAT THE CARDS DRAW THAT THIS DOES NOT SHIP
 * -------------------------------------------
 *  · **The "Cultural fit" dimension.** `ga-099` frames it around "prayer space,
 *    privacy, and similar details". `REPOSITIONING.md` retires prayer space
 *    outright — not softened, removed — and SEO-RULES §5 slot 6 makes the whole
 *    family banned strings on every surface, in English and in Urdu. It is not
 *    re-framed or renamed; it is gone, and nothing replaces it.
 *  · **Amber stars.** `ga-099`/`ga-100` fill them `--warning-fg`. TASTE §11.4 —
 *    stars are ink, never gold — postdates the cards and wins (GUEST-SHELL §0.3).
 *  · **"or after 14 days — whichever comes first".** GUEST-SHELL.md §14 is
 *    precise about this number: the 14-day PUBLIC-RESPONSE window is DESIGN.md
 *    §9-J verbatim and may be stated; any OTHER number is invented. The cards
 *    reuse 14 for a different mechanism — when a blind review is revealed — and
 *    no document sets that window. So the both-sides rule ships without a day
 *    count, which is the part that is true.
 *  · **Photo upload tiles.** There is no upload path and no store; a picker that
 *    accepts a file and drops it is worse than no picker.
 *  · **Any aggregate.** No rating average, no review count, no "your review
 *    helps N travellers". Zero real reviews exist — `is-f7-2bed.ts` says so on
 *    the listing itself: "nothing appears here until a real guest has written
 *    one. We never show a rating a home has not earned."
 *
 * ROUTE CONTRACT (GUEST-SHELL.md §2): `noindex, follow`; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb; `<main class="co-main">`.
 */

const REVIEW_PATH = tripPath("review");

/**
 * The title this route asks to be registered under, matching its siblings'
 * shape (`Receipt — Margalla View Apartment`, `Cancel your booking — …`).
 *
 * `lib/seo/route-registry.ts` is edited centrally, so until `/trips/{id}/review`
 * lands there this string is declared here and the lookup below prefers the
 * registry the moment it exists. G41 compares the served `<title>` to the
 * registry byte for byte; written this way the two cannot diverge on the day it
 * is registered, because the registered string is this one.
 */
const REVIEW_TITLE = "Write a review — Margalla View Apartment";

/** Per request: whether the composer or the gate renders is a fact about today. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isTripId(id)) notFound();

  return routeByPath.has(REVIEW_PATH)
    ? pageMetadata(REVIEW_PATH)
    : { title: { absolute: REVIEW_TITLE }, robots: { index: false, follow: true } };
}

export default async function TripReviewRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isTripId(id)) notFound();

  const stayEnded = Date.now() >= Date.parse(TRIP.checkOut);

  if (stayEnded) {
    return <ReviewComposer stayRange={formatStayRange()} />;
  }

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      {/*
        The `<h1>` is still "Write a review" — this IS that page, it is simply
        not open yet, and G43 wants the heading's first word in the registered
        title. Changing the heading to "Not yet" would rename the page after its
        state.
      */}
      <TripPageHead
        className="mt-5"
        title="Write a review"
        sub={
          <>
            Reviews open when a stay ends, so there is nothing to write about yet. Yours will be
            waiting here after you check out.
          </>
        }
      />

      <ExampleBookingStrip className="mt-6">
        No review written here is stored or sent.
      </ExampleBookingStrip>

      <div className="mt-8 max-w-[62ch] border-t border-hairline pt-6">
        <p className="text-bodyMd font-regular leading-relaxed text-secondary">
          {/* A17: two date isolates in one sentence put the closing clause at
              the head of the line. The isolate is the whole sentence. */}
          <Phrase>
            You are staying at{" "}
            <Link className={inlineAction} href={TRIP.listingHref}>
              {TRIP.home}
            </Link>{" "}
            from <Num>{formatStayRange()}</Num>. This page opens on{" "}
            <b className="font-semibold text-primary">
              <Num>{formatTripDate(TRIP.checkOut)}</Num>
            </b>
            , the day you check out.
          </Phrase>
        </p>

        <p className="mt-3 text-bodySm font-regular leading-relaxed text-secondary">
          Reviews are two-way. Yours and {TRIP.host}&rsquo;s stay hidden until you have both
          written one, so neither of you is writing in answer to the other.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={tripPath()} className={`${btnSecondary} no-underline`}>
            Back to your trip
          </Link>
          <Link
            href="/messages/host-margalla-view"
            className={`${inlineAction} text-bodySm font-medium`}
          >
            Message {TRIP.host}
          </Link>
        </div>
      </div>
    </>
  );
}
