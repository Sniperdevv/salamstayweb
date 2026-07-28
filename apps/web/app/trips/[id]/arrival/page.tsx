import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";

import { NoAlcoholIcon } from "@/components/home-icons";
import {
  ClockIcon,
  GuestsIcon,
  NoPartiesIcon,
  NoSmokingIcon,
  QuietHoursIcon,
} from "@/components/listing/icons";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import {
  TRIP,
  formatStayRange,
  formatTripDateTime,
  isTripId,
  tripPath,
} from "@/lib/booking/trip-record";
import { isF72Bed, type RuleId } from "@/lib/content/listings/is-f7-2bed";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  ExampleBookingStrip,
  TripBackLink,
  TripFactRow,
  TripFacts,
  TripPageHead,
  TripSection,
  TripSlot,
} from "../trip-chrome";

/**
 * GA-072 + GA-073 — `/trips/{id}/arrival`, at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHY TWO CARDS ARE ONE ROUTE, AND WHY THIS ROUTE EXISTS AT ALL
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` §1a already routes `ga-072` here (`/trips/{bookingId}/arrival`)
 * and `/trips/{id}` already LINKS it — the row has been live since the trip page
 * shipped, serving `lib/seo/route-registry.ts`'s stub. So the claim that this
 * surface exists was made days ago; this file is that claim being kept.
 *
 * `ga-073` is not a second destination. It answers "where is it" and `ga-072`
 * answers "how do I get in", and a guest standing on a street in F-7 at ten at
 * night is asking both at once, on one screen, in one breath. Two routes would
 * make them navigate between two halves of one question.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT IS REAL HERE, AND WHERE EVERY WORD OF IT COMES FROM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Nothing on this page is typed twice and nothing is estimated. Five facts, five
 * sources, all of them already published:
 *
 *  · **The area** — `isF72Bed.location.sub`, the line the indexable listing
 *    prints under "Where you'll be".
 *  · **Check-in and check-out** — `formatTripDateTime(TRIP.checkIn/checkOut)`,
 *    the same call `/trips/{id}` makes, off the same record, through the same
 *    formatter. The instants themselves are the listing's own house rules
 *    ("Check-in after 2:00 PM", "Check-out before 11:00 AM") pinned to this
 *    booking's dates in `lib/booking/trip-record.ts`.
 *  · **Self check-in** — `isF72Bed.amenities.items`, the published amenity, read
 *    by id and rendered with its own label and detail rather than paraphrased.
 *  · **The house rules** — `isF72Bed.rules.items`, all six, in the listing's own
 *    order, with the same glyphs `components/listing/listing-rules.tsx` gives
 *    them. Same host, same rules, same drawing.
 *  · **The stay range** — `formatStayRange()`.
 *
 * The reconciliation is asserted at module load rather than trusted: this page
 * joins a booking record to a listing record, and the join is only sound if the
 * booking points at the listing being read.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THE TWO CARDS DRAW THAT THIS DOES NOT SHIP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` §0.2 and §14: a phone card may draw a populated future, and
 * every one of these needs a record this build does not have. Where a card draws
 * one, suppress the element — never substitute a dash, never ship a zero.
 *
 *  · **`ga-072`'s four access steps** — gate code `4471`, "third floor",
 *    "Apartment 3B", lockbox code `8290`. There is no host-supplied access
 *    record, and this is the sharpest case in the whole guest tree of why that
 *    matters: an invented rating is read, shrugged at and forgotten, while an
 *    invented gate code is TYPED INTO A KEYPAD by someone standing in the dark
 *    with luggage. The failure is physical. So the codes are a named absence
 *    with the one person who has them named beside it.
 *  · **`ga-072`'s "Saved to your phone — works without internet" banner and its
 *    whole offline state.** There is no service worker and no cache in this
 *    build. The banner is not a description of a screen, it is a promise about a
 *    capability, and it would be read exactly when it could not be checked.
 *  · **`ga-073`'s map.** `/trips/{id}` already refused one, in these words: *"The
 *    card builds one out of coloured `<span>`s labelled 'Margalla Rd'. There is
 *    no map, and a picture of one assembled from divs is a fabricated screenshot
 *    of a feature that does not exist."* Nothing has changed except that the
 *    fabrication would now be load-bearing rather than decorative.
 *  · **`ga-073`'s turn-by-turn** — "Head north on Jinnah Avenue", "left at the
 *    F-7 Markaz signal", "the building is beside the pharmacy, on the corner".
 *    Landmark directions are the right idiom for Pakistan and the wrong content
 *    for this build: they are navigation TO an address nobody has supplied,
 *    written by a host who has no way to write them.
 *  · **`ga-073`'s `~15 min by car`** — an ETA, from nowhere, against no origin.
 *    §14's plainest case.
 *  · **`ga-073`'s `Street 12, F-7, Islamabad`.** An address the build does not
 *    hold — and in this corpus "Street 12" is the name of a DIFFERENT home
 *    (`quiet-1-bed-street-12`), so the fixture is not even internally free of
 *    consequence.
 *  · **`ga-073`'s "Open in Maps app".** The only coordinates in the build are
 *    `isF72Bed.schema` (33.7167, 73.05) — the centre of the approximate-area
 *    circle the listing draws expressly to withhold the address. A Maps link
 *    built from them opens a pin that is not the home, which is worse than no
 *    link: a guest would drive to it.
 *  · **"Call Ayesha" / "Call host", on both cards.** No phone number exists in
 *    this build, and a `tel:` with nothing behind it is a control that fails at
 *    the moment it is needed most.
 *  · **`ga-093`'s checkout steps** — keys, gate, rubbish, the optional meter
 *    photo, the note from the host. All host-supplied, none of it held. Its one
 *    real fact is the check-out hour, which is a row in `Getting in` below and a
 *    fact row on `/trips/{id}`. Its one real action is the review, which is
 *    already `/trips/{id}/review` and already gates on the real check-out date.
 *  · **Hijri dates**, drawn by `ga-094` and `ga-067` — plain Gregorian only,
 *    `BUILD-DECISIONS.md` #21, founder.
 *
 * ROUTE CONTRACT (`GUEST-SHELL.md` §2), none of it restated below: `noindex,
 * follow` — inherited from `../../layout.tsx` and restated by `pageMetadata` off
 * the registry row; no canonical; no hreflang; no JSON-LD; no breadcrumb;
 * `<main class="co-main">` from the layout; exactly one `<h1>`, paired with the
 * registered title for G43.
 *
 * NOTHING ON THIS PAGE IS GREEN (§8). A stay already booked has no primary call:
 * `Message Ayesha` is TASTE §5's gray-fill secondary — the component §5 names
 * "Message host" in its own list — and every link is ink, underlined at rest.
 * `components/header-cta.ts` therefore needs no row for this route.
 */

const ARRIVAL_PATH = tripPath("arrival");

/**
 * The join, checked rather than assumed.
 *
 * This is the first surface in the tree to read the BOOKING record and the
 * LISTING record in one document, and every published fact below comes from the
 * second. If the two ever describe different homes, this page prints one home's
 * house rules under another home's dates — the class of error `quote.ts` and
 * `trip-record.ts` both chose to fail loudly on rather than ship. Same pattern,
 * same reason: at module load, in the module the surface imports.
 */
if (TRIP.listingHref !== isF72Bed.path) {
  throw new Error(
    "/trips/{id}/arrival reads the house rules, the area line and the check-in " +
      `amenity from ${isF72Bed.path}, but the booking points at ${TRIP.listingHref}. ` +
      "One of the two moved without the other.",
  );
}

/**
 * The published amenity, read by id.
 *
 * Resolved once here rather than at render so that a rename in the listing
 * content is a startup error naming this file, not a silently missing line on a
 * page a guest reads while standing at a gate.
 */
const selfCheckIn = isF72Bed.amenities.items.find((item) => item.id === "self-check-in");

if (selfCheckIn === undefined) {
  throw new Error(
    "/trips/{id}/arrival states self check-in for this home from the listing's " +
      "own amenity list, and the `self-check-in` amenity is no longer there.",
  );
}

/**
 * Re-bound after the guard rather than narrowed in place: TypeScript does not
 * carry a module-scope narrowing into a function body, so the page component
 * would see the `| undefined` again.
 */
const SELF_CHECK_IN = selfCheckIn;

type IconComponent = (props: { readonly className?: string }) => ReactElement;

/**
 * The same six glyphs `components/listing/listing-rules.tsx` gives the same six
 * rules — imported, not redrawn. That file's note is the reason: *"same fact,
 * same glyph. Two drawings of one idea on one page is the drift the shared icon
 * sets exist to prevent."* Here it is two SURFACES rather than one page, and a
 * guest who read the rules before booking should meet the identical block after.
 *
 * The MAP is duplicated and the icons are not, which is the right way round: the
 * map is six lines that a `RuleId` change turns into a type error in both files,
 * while a second drawing of a wine glass would drift silently and forever. It
 * belongs beside the `<ul>` recipe in a shared listing-rules part; that is an
 * edit to the listing components, which this wave does not own.
 */
const RULE_ICONS: Record<RuleId, IconComponent> = {
  "check-in": ClockIcon,
  guests: GuestsIcon,
  smoking: NoSmokingIcon,
  parties: NoPartiesIcon,
  alcohol: NoAlcoholIcon,
  quiet: QuietHoursIcon,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isTripId(id)) notFound();
  return pageMetadata(ARRIVAL_PATH);
}

export default async function TripArrivalRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isTripId(id)) notFound();

  const { location, rules } = isF72Bed;

  return (
    <>
      <TripBackLink href={tripPath()}>Your trip</TripBackLink>

      <TripPageHead
        className="mt-5"
        title="Getting there and getting in"
        sub={`Where the home is, when you can let yourself in, and what ${TRIP.host} asks while you are there.`}
      />

      {/*
        The build fact lives HERE, in the removable slot, and not in the body —
        a sentence about what SalamStay cannot do yet is a sentence a future
        release turns into a lie wherever it is welded into prose. The strip goes
        with the gap; the paragraphs below stay true after it.
      */}
      <ExampleBookingStrip className="mt-6">
        The house rules below are the ones the listing publishes. The address and the door code
        are nowhere in this build, because a host has no way to send them yet.
      </ExampleBookingStrip>

      {/*
        The stay's identity, the same shape `/trips/{id}/review` opens with: the
        home links to its own indexable listing, the range comes from the one
        formatter. `Phrase` closes the sentence, not the number in it (A17).
      */}
      <p className="mt-6 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
        <Phrase>
          <Link className={inlineAction} href={TRIP.listingHref}>
            {TRIP.home}
          </Link>{" "}
          · <Num>{formatStayRange()}</Num>
        </Phrase>
      </p>

      <TripSection id="where" heading="Where you're going" className="mt-8">
        {/*
          `location.sub` verbatim — "F-7, Islamabad · near F-7 Markaz and Jinnah
          Super Market". `Num` isolates the sector digits and the phrase around
          them in one pass; the `·` is the listing's, one per gap (TASTE §7).
        */}
        <p className="mt-4 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-primary">
          <Num>{location.sub}</Num>
        </p>

        {/*
          DURABLE PROSE, deliberately: every clause is true today and stays true
          the day an address channel ships and a host has not filled it in. The
          listing's own privacy note says the exact address is shared once a
          booking is confirmed; this states who it comes from, which is the part
          a guest needs in order to know who to ask.
        */}
        <p className="mt-3 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          The listing shows an approximate area, for the host&rsquo;s privacy. The exact address is
          shared once a booking is confirmed, and it comes from {TRIP.host} rather than from
          SalamStay.
        </p>
      </TripSection>

      <TripSection
        id="in"
        heading="Getting in"
        sub="When you can let yourself in, and when you need to be out."
        className="mt-8"
      >
        {/*
          Two rows, not the whole booking. `/trips/{id}` owns the full facts
          group; this page needs the two hours a guest is standing outside a
          building thinking about, and a group padded with the reference and the
          guest count would be a group padded to look substantial.

          Both strings are `formatTripDateTime` off `TRIP`, so they are byte-
          identical to the same two rows on `/trips/{id}` — four surfaces
          describing one record cannot disagree about an hour somebody is
          timing a taxi against.
        */}
        <TripFacts className="mt-4">
          <TripFactRow label="Check-in">
            <Num>{formatTripDateTime(TRIP.checkIn)}</Num>
          </TripFactRow>
          <TripFactRow label="Check-out">
            <Num>{formatTripDateTime(TRIP.checkOut)}</Num>
          </TripFactRow>
        </TripFacts>

        {/*
          The published amenity, in its own words — label and detail as the
          listing writes them, so a guest who read "Self check-in · Lockbox on
          arrival" before booking meets the identical pair after. "Bold the
          payload only" (TASTE §7): the amenity name, and nothing else.
        */}
        <p className="mt-4 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          {/*
            A17: `Num` draws an isolate around the amenity detail whether or not
            that string happens to carry a digit today, and a bare isolate inside
            an RTL paragraph is free to reorder past the words either side of it.
            `Phrase` closes the sentence around it — first word to full stop.
          */}
          <Phrase>
            <b className="font-semibold text-primary">{SELF_CHECK_IN.label}</b> ·{" "}
            <Num>{SELF_CHECK_IN.detail}</Num>. What you need is the code that opens it.
          </Phrase>
        </p>
      </TripSection>

      <TripSection
        id="rules"
        heading={rules.listHeading}
        sub={`What ${TRIP.host} asks of everyone who stays. These are the rules published on the listing you booked from — the same ones, in the same order.`}
        className="mt-8"
      >
        {/*
          TASTE §1's third clause, and the block the rule names: a "things to
          know" section is icon + title + body in OPEN SPACE — no box, no card,
          no plate. The facts group above carries a border because it is a
          bounded block of this booking's own figures; the host's published rules
          are content, and content carries neither.

          `listing-rules.tsx`'s row anatomy exactly: `flex gap-3.5`, a `size-5`
          `text.secondary` outline glyph at a uniform thin stroke (§11.3), title
          at 14/500 ink over an optional 14/400 gray detail. Times carry `.num`
          isolation like every other digit run.
        */}
        <ul className="mt-4 flex max-w-[62ch] flex-col gap-4">
          {rules.items.map((rule) => {
            const Icon = RULE_ICONS[rule.id];
            return (
              <li key={rule.id} className="flex gap-3.5">
                <Icon className="mt-0.5 size-5 shrink-0 text-secondary" />
                <span className="min-w-0">
                  <span className="block text-bodySm font-medium text-primary">
                    <Num>{rule.title}</Num>
                  </span>
                  {rule.detail === undefined ? null : (
                    <span className="mt-0.5 block text-bodySm text-secondary">
                      <Num>{rule.detail}</Num>
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </TripSection>

      <TripSection id="pending" heading={`Still to come from ${TRIP.host}`} className="mt-8">
        {/*
          ONE slot for both missing things, not one each. `tax-parts.tsx` settled
          that for its two undownloadable documents: they are missing for a
          single reason, and a reason repeated under each row reads as two
          separate problems. The address and the code arrive together, from one
          person, in one message — so they are named together, once, with that
          message directly under them.

          The sentence inside is durable: nothing has arrived is true today and
          true on the first day of the real feature. The reason it has not — that
          there is nowhere to send it — is in the strip at the top of the page,
          which is the part that gets deleted.
        */}
        <TripSlot
          className="mt-4"
          lead="Not shared yet"
          title="The exact address, the lockbox code and the door"
        >
          Nothing has arrived for this stay. Ask {TRIP.host} for all of it in one message, before
          you travel rather than at the gate.
        </TripSlot>

        {/*
          TASTE §5's gray-fill secondary beside an §8 inline action — never two
          buttons; the pair has a rank and the rank is what says which one a
          guest is expected to reach for. `Message host` is named in §5's own
          list of the actions this one button carries.

          No "Call Ayesha". `ga-072` and `ga-073` both close on one, and there is
          no phone number in this build to put behind it.
        */}
        <div className="mt-4 flex max-w-[62ch] flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/messages/host-margalla-view" className={`${btnSecondary} no-underline`}>
            Message {TRIP.host}
          </Link>
          <Link href={tripPath()} className={`${inlineAction} text-bodySm font-medium`}>
            Back to your trip
          </Link>
        </div>
      </TripSection>
    </>
  );
}
