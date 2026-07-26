import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ActionList,
  ActionRow,
  Acts,
  CANONICAL,
  Hint,
  InlineLink,
  Reference,
} from "@/components/booking/post-flow";
import { ShieldCheckIcon } from "@/components/home-icons";
import { CalendarIcon, LockIcon, PinIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { GUEST_STUB_LINKS, RegistryStub, stubMetadata } from "@/components/registry-stub";
import { btnSecondary, btnSecondaryMd, inlineAction } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { QUOTE } from "@/lib/booking/quote";
import {
  TRIP,
  formatStayRange,
  formatTripDateTime,
  isTripId,
  tripPath,
} from "@/lib/booking/trip-record";
import { formatPkr } from "@/lib/money";
import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import {
  ExampleBookingStrip,
  TripBackLink,
  TripMain,
  TripPageHead,
  TripSection,
} from "./trip-chrome";

/**
 * GA-071 — `/trips/{id}`, one booked stay, at web width.
 *
 * The page a booking lives on. `/book/{slug}/confirmation` links here, and until
 * this route existed that link went to a registry stub — a guest paid and the
 * product had nowhere to put what they had bought.
 *
 * `GUEST-SHELL.md` §4b's detail frame, in ONE column: `.backrow` → `.pagehead` →
 * labelled `<section>`s. **No summary rail.** §4b refuses it outright and
 * `HOST-SHELL.md` §8 refuses it for the same reason — a trip has already been
 * booked, so there is nothing to summarise into a decision, and the rail's
 * border-and-shadow is TASTE §1's one sanctioned exception, already spent on
 * checkout.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE ID GUARD, AND THE ONE ID THAT IS NEITHER A TRIP NOR A 404
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §12 lifts `GO-LIVE` A11 into a hard rule: *"A surface keyed to a record that
 * does not exist **refuses to render** — 404, or a redirect to its index. It
 * never renders a fixture."* `isTripId()` is that refusal, asked on the SERVER
 * in both `generateMetadata` and the route body, so an unknown id never emits a
 * byte of trip document — no flash, nothing for a client guard to undo. The
 * reader lands on `app/not-found.tsx`, whose copy already answers this exact
 * case: *"Nothing has happened to your account, your trip, or a booking in
 * progress."*
 *
 * ONE EXCEPTION, AND IT IS A ROUTING FACT RATHER THAN A DESIGN ONE. This file
 * matches `/trips/requests` — a registered stub that `app/book/{slug}/status`
 * links as its back destination — and takes it away from
 * `app/[...registered]/page.tsx`, the least specific route in the tree. Left
 * alone, shipping this page would have turned a 200 into a 404 on a link that is
 * live today, and `validate-pages --all` fetches only `page` routes, so no gate
 * would have said so. A registered STUB id therefore renders the stub; anything
 * else 404s. Nothing here renders a trip for an id that is not the trip.
 *
 * This is not the requests surface being designed — §1d forbids that outright
 * (*"`BUILD-DECISIONS.md` #10 rules Instant Book only … do not design the
 * request lifecycle on web"*). It is the "being written" page that URL already
 * served yesterday, still being served.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ga-071` DRAWS THAT THIS DOES NOT SHIP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §0.2 is load-bearing: the card predates `REPOSITIONING.md`, the `ga-*` sweep
 * has not run, and its content is stale in named ways.
 *
 *  · **The Hijri secondary date line and the moon-sighting note.** Dates are
 *    plain Gregorian — `BUILD-DECISIONS.md` #21, founder. §7 records that this
 *    knowingly diverges from `ga-071` and that the ruling supersedes the card.
 *  · **The "nearest masjid" row.** §1c: `/trips/{id}/nearby/masjid` ships as
 *    *"nothing. masjid distance is not modelled."*
 *  · **The rest of the local-help block.** The hospital row carries a named
 *    facility and a `~4 km` distance no data source in this build produces (§14:
 *    no invented distances, no ETA, no map route), and `Safety toolkit` points
 *    into a `/safety` tree `GUEST-SHELL.md` lists under Unresolved. What would
 *    survive the cut is two nationwide emergency numbers that are not facts
 *    about THIS booking. Shipping a quarter of a block because a quarter of it
 *    is true is worse than not shipping it.
 *  · **The map preview.** The card builds one out of coloured `<span>`s labelled
 *    "Margalla Rd". There is no map, and a picture of one assembled from divs is
 *    a fabricated screenshot of a feature that does not exist. `Getting there
 *    and arrival` is the honest affordance and it is a registered route.
 *  · **The trip timeline.** Its three rows restate check-in, check-out and the
 *    payment, all already in the facts group above it, and its one added claim —
 *    which step is NEXT — is a computation against today that this page would
 *    have to go dynamic to keep true. §7's *"proximity is a fact, not a
 *    counter"* permits a sentence computed at render; it does not ask for one.
 *  · **The `Confirmed` badge burnt onto the photo.** TASTE §9: no text ever sits
 *    directly on a photograph — and §6's two treatments collide there anyway, a
 *    badge over a photo being opaque white with an ink label while a status chip
 *    is the muted success register. On web the page head carries the status in
 *    flow, which needs neither exception. TASTE §11.16: a chip may sit
 *    baseline-aligned inside a heading row.
 *  · **A rating, a review count, a response time, "usually replies within…".**
 *    §14, and `ga-097`/`ga-098` draw all of them.
 *
 * ROUTE CONTRACT (§2), none of it restated below: `noindex, follow` — inherited
 * from `../layout.tsx` and re-stated by `pageMetadata` off the registry row; no
 * canonical; no hreflang; no JSON-LD; no breadcrumb; `<main class="co-main">`
 * from `TripMain`; exactly one `<h1>`, paired with the registered title for G43.
 */

const TRIP_PATH = tripPath();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isTripId(id)) {
    const entry = routeByPath.get(`/trips/${id}`);
    if (entry?.status === "stub") return stubMetadata(entry);
    notFound();
  }
  return pageMetadata(TRIP_PATH);
}

/* ─── Page-local parts ───────────────────────────────────────────────────── */

/**
 * The status chip, in §6's muted success register — `success.fg` on
 * `success.bg` with a `success.border`, shaped as a pill per §6's shape system.
 *
 * NOT a fourth brand-green role: `feedback.success` is a different semantic axis
 * from `interactive.primary`, which is why `post-flow.tsx`'s `Outcome` may paint
 * its tick with it. §8's mechanical check greps `bg-interactive` /
 * `text-interactive`; this matches neither. Colour is never the only signal —
 * the tick and the word both carry the state.
 *
 * Only `Confirmed` is written. §6 fixes the full set at five (`Confirmed`,
 * `Current stay`, `Completed`/`Past stay`, `Refunding`, `Cancelled`) and a
 * component shipping four registers no surface can reach teaches the next author
 * that those states exist. It moves to `components/ui/` when a second surface
 * needs a second one.
 */
function ConfirmedChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-3 py-1 text-bodySm font-semibold text-success">
      <CheckMark className="size-3.5" />
      Confirmed
    </span>
  );
}

/**
 * One row of the booking facts — §5's form-group anatomy borrowed for content,
 * which is the same borrow `Facts`, `ActionList` and `TripSection`'s neighbours
 * make, so everything down this column reads as one family.
 *
 * Border, no shadow (§9). The divider is FULL-BLEED, §5's word and the
 * deliberate exception to TASTE §11.9: the group carries no padding of its own,
 * the rows do, so the hairline IS the row edge and stopping it short would draw
 * a floating stroke.
 *
 * Written here rather than imported from `post-flow.tsx` for one reason: `Fact`
 * pins its label column at `w-28 sm:w-32` for a 520px group, and this page's
 * group sits in a 720 column beside values like "Wed 12 Aug 2026, 2:00 PM". The
 * anatomy, the type roles and the divider are identical; only the measure moves.
 */
function FactRow({
  label,
  sub,
  children,
}: {
  readonly label: string;
  readonly sub?: React.ReactNode;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline gap-4 border-t border-hairline px-4 py-3 first:border-t-0">
      <dt className="w-32 max-w-[40%] shrink-0 text-label font-regular text-secondary">{label}</dt>
      <dd className="min-w-0 flex-1 text-bodyMd text-primary">
        {children}
        {sub === undefined ? null : (
          <span className="mt-0.5 block text-label font-regular leading-normal text-secondary">
            {sub}
          </span>
        )}
      </dd>
    </div>
  );
}

/**
 * The host block — `ga-071`'s `.host` row.
 *
 * THE AVATAR IS INITIALS, and initials are a first-class treatment rather than a
 * fallback (§6, `ga-129`, DESIGN §9-J): declining a photo is never a lesser
 * state. `interactive.subtle` is §6's own fill for an avatar — a pale brand tint
 * rather than a brand fill, so it is outside §8's three-role budget and outside
 * the grep that checks it. `AK` is the listing content's initials for this host
 * (`lib/content/listings/is-f7-2bed.ts`), not a second derivation: §6 requires
 * the same avatar and the same initials wherever the person appears.
 *
 * THE VERIFICATION MARK IS INK, never green (§6, TASTE §11.4), and the label is
 * the listing's own `Verified host`. `ga-071` writes "CNIC-verified host", which
 * is neither the shipped string nor §5's claim 1 (`CNIC-verified guests and
 * hosts via NADRA Verisys`) — a paraphrase near enough to a claim to read as
 * one, which §13 rules out: claims are byte-exact or absent.
 */
function HostRow() {
  return (
    <div className="mt-4 flex max-w-[62ch] items-center gap-3.5 rounded-md border border-border-default bg-canvas px-4 py-3">
      <span
        aria-hidden="true"
        className="grid size-10 flex-none place-items-center rounded-full bg-brand-subtle text-bodySm font-semibold text-primary"
      >
        AK
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-bodyMd font-medium text-primary">{TRIP.host}</span>
        <span className="mt-0.5 flex items-center gap-1.5 text-label font-regular text-secondary">
          <ShieldCheckIcon className="size-4 flex-none text-primary" />
          Verified host
        </span>
      </span>

      {/*
        TASTE §5's gray-fill secondary at the `md` rung — `Message host` is named
        in §5's own list of the actions this one button carries. It states its own
        `px-4`, which `btnSecondaryMd` deliberately omits so a call site can
        collapse it to a square.
      */}
      <Link href="/messages/host-margalla-view" className={`${btnSecondaryMd} px-4 no-underline`}>
        Message
      </Link>
    </div>
  );
}

/* ─── The route ──────────────────────────────────────────────────────────── */

export default async function TripRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isTripId(id)) {
    const entry = routeByPath.get(`/trips/${id}`);
    if (entry?.status === "stub") {
      return <RegistryStub entry={entry} links={GUEST_STUB_LINKS} />;
    }
    notFound();
  }

  const stayRange = formatStayRange();
  const freeUntil = formatTripDateTime(TRIP.freeCancellationUntil);

  return (
    <TripMain>
      {/*
        §4b's `.backrow`, and §15's general form of `CHECKOUT-SHELL` §15: `Back`
        returns to the last state that still exists. From a trip that is `/trips`.
      */}
      <TripBackLink href="/trips">Your trips</TripBackLink>

      {/*
        `items-baseline` puts the chip on the heading's baseline rather than its
        optical centre (TASTE §11.16); `flex-wrap` drops it to its own line on a
        narrow viewport instead of squeezing the heading.
      */}
      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <TripPageHead title="Your trip" />
        <ConfirmedChip />
      </div>

      {/*
        The stay's identity. `·` exactly once per gap with spaces both sides,
        never chained past what it separates (TASTE §7). `Num` isolates the `7`
        of `F-7` so a sector number cannot be reordered by the bidi algorithm
        under RTL — the run must START with a digit, which is why `F-` stays in
        the text flow where it belongs. The home links to its own listing, which
        is a real indexable page rather than a stub.
      */}
      <p className="mt-2 max-w-[56ch] text-bodyMd font-regular leading-relaxed text-secondary">
        <Link className={inlineAction} href={TRIP.listingHref}>
          {TRIP.home}
        </Link>{" "}
        · Entire apartment · <Num>{TRIP.where}</Num>
      </p>

      {/*
        The sentence standing between a reader and mistaking a fixture for a
        record — §12's cold-deep-link case, mitigated the way the host side
        already mitigates it (`reservations.ts`: *"both surfaces say so on
        screen"*). Delete this strip and the fixture in the same commit, or
        neither.
      */}
      <ExampleBookingStrip className="mt-6">
        Nothing on this page charges, changes or cancels anything.
      </ExampleBookingStrip>

      {/*
        The home, once. TASTE §9: photographs are content and carry no scrim, no
        overlay and no text — the frame is where premium lives, not a filter.
        `radius.lg` is the ladder's rung for photos (§4). Aspect-boxed at 3:2,
        §9's widest crop for anything but a mosaic composition, which is also
        what makes this a CLS of 0: the box is reserved before the bytes land.
        `priority` because it is this page's LCP element.
      */}
      <figure className="mt-6 overflow-hidden rounded-lg bg-sunken">
        <Image
          src="/images/is-f7-living.jpg"
          alt="Sunlit living room of the Margalla View Apartment in F-7, Islamabad"
          width={720}
          height={480}
          sizes="(min-width: 768px) 720px, 100vw"
          priority
          className="aspect-[3/2] w-full object-cover"
        />
      </figure>

      <TripSection
        id="booking"
        heading="Your booking"
        sub="The stay as it now stands. Your host sees the same facts."
        className="mt-8"
      >
        {/*
          Gregorian dates lead and there is no second calendar under them
          (#21). The home and the host are NOT rows here — the page head names
          the first and the section below owns the second, and a facts group that
          repeats both is a group padded to look substantial.

          Every date is `formatTripDate*` off `TRIP`, never a typed string: four
          surfaces describe this one record, and a night count or a deadline
          written twice is two chances to disagree about something a guest is
          counting money against.
        */}
        <dl className="mt-4 max-w-[62ch] overflow-hidden rounded-md border border-border-default bg-canvas">
          <FactRow label="Dates" sub={<Num>{`${TRIP.nights} nights`}</Num>}>
            <Num>{stayRange}</Num>
          </FactRow>
          <FactRow label="Check-in">
            <Num>{formatTripDateTime(TRIP.checkIn)}</Num>
          </FactRow>
          <FactRow label="Check-out">
            <Num>{formatTripDateTime(TRIP.checkOut)}</Num>
          </FactRow>
          {/*
            Guests is the one fact `trip-record.ts` does not carry, so it comes
            from `CANONICAL` — the same object the confirmation this page is
            reached from already prints. Reading it from there rather than
            retyping "6 guests" is the whole reason that constant exists: the two
            screens cannot describe one party two ways.
          */}
          <FactRow label="Guests" sub={<Num>{CANONICAL.guestBreakdown}</Num>}>
            <Num>{CANONICAL.guests}</Num>
          </FactRow>
          {/*
            The reference the guest read on their confirmation, and the one
            string on this page they would quote to support. `Reference` keeps it
            one selectable, LTR-isolated unit with `tnum` cancelled — Inter's
            tabular figures widen the hyphen into a figure slot and render this
            as `SS - 7F3K9Q`, which someone reading it down a phone line says
            wrong.

            FLAGGED, NOT SETTLED: `/trips/{id}/receipt` suppresses this same
            reference, reading §14's first row as covering it. The two surfaces
            should agree — either both carry it under the example-booking
            disclosure or neither does — and which way is a call above this file.
          */}
          <FactRow label="Booking reference">
            <Reference>{CANONICAL.reference}</Reference>
          </FactRow>
        </dl>
      </TripSection>

      <TripSection id="host" heading="Your host" className="mt-8">
        <HostRow />
      </TripSection>

      <TripSection
        id="before"
        heading="Before you go"
        sub="Directions and a calendar file for these dates."
        className="mt-8"
      >
        <ActionList>
          <ActionRow
            href={tripPath("arrival")}
            icon={<PinIcon className="size-5" />}
            title="Getting there and arrival"
            sub="Directions, check-in time and house rules"
          />
          {/*
            No `download` attribute, for the reason the confirmation records: the
            route is a registry stub serving the "being written" page, and a
            download would save that page to disk under an `.ics` name — a file
            claiming to be a calendar and not being one. Restore it the day the
            route emits a real calendar file.
          */}
          <ActionRow
            href={tripPath("booking.ics")}
            icon={<CalendarIcon className="size-5" />}
            title="Add to your calendar"
            sub={<Num>Saves 14–17 Aug as a calendar file</Num>}
          />
        </ActionList>
      </TripSection>

      <TripSection id="payment" heading="Payment" className="mt-8">
        {/*
          §7, verbatim: *"On `/trips/{id}` the paid total underlines and opens
          `/trips/{id}/receipt`; nothing else on the page does."* TASTE §8 is the
          general form — a price underlines exactly where it opens a breakdown,
          and only there. This is this page's one price underline.

          `.num` wraps the WHOLE money string rather than running it through
          `withNumerals`, so `PKR` and its digits stay one LTR-isolated unit under
          RTL instead of the code drifting loose in the Urdu text flow
          (`lib/money.ts`). The parent IS a flex container, which is precisely the
          case `BUILD-DECISIONS.md` #22 was written for: one span, or the gap
          renders inside the word.
        */}
        <div className="mt-4 flex max-w-[62ch] flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="text-bodyMd font-regular text-secondary">Total paid</span>
          <Link href={tripPath("receipt")} className={`${inlineAction} text-h5 font-semibold`}>
            <span className="num">{formatPkr(QUOTE.total)}</span>
          </Link>
        </div>
        <p className="mt-1 max-w-[62ch] text-label font-regular text-secondary">
          Itemised on your receipt and tax invoice.
        </p>

        {/*
          The custody sentence, byte-identical to the confirmation's. §7's
          post-repositioning lexicon: `Service fee`, never "wakala"; held in
          TRUST, never "amanah" (`ga-134` is stale here; BUILD-DECISIONS #23 is
          the ruling). Two surfaces describing one custody arrangement in two
          sentences is two arrangements to a reader.
        */}
        <Hint icon={<LockIcon className="size-4" />}>
          Your payment is held in trust until you check in. It sits in a custody account at
          Meezan Bank — not spent, not lent out, no interest earned on it.{" "}
          <InlineLink href="/help/payments/how-money-is-held">
            How your payment is held
          </InlineLink>
        </Hint>
      </TripSection>

      <TripSection
        id="change"
        heading="If your plans change"
        sub={
          <>
            Free cancellation up to{" "}
            <b className="font-semibold text-primary">
              <Num>{`${TRIP.freeCancellationHours} hours`}</Num>
            </b>{" "}
            before check-in — that is until{" "}
            <b className="font-semibold text-primary">
              <Num>{freeUntil}</Num>
            </b>
            . After that the first night is non-refundable and the rest is refunded.
          </>
        }
        className="mt-8"
      >
        {/*
          §5's gray-fill secondary beside an §8 inline action. Never two buttons:
          the pair has a rank, and the rank is what says which one a guest is
          expected to reach for.

          NOTHING ON THIS PAGE IS GREEN. A stay that is already booked has no
          primary call, so §8's role 3 goes unspent — which is why
          `components/header-cta.ts` does NOT demote Sign up on this route the
          way it does on `/trips`. Green here is the wordmark dot and, once a
          session exists, the header avatar.
        */}
        <Acts>
          <Link href={tripPath("cancel")} className={`${btnSecondary} no-underline`}>
            Cancel this booking
          </Link>
          <InlineLink href={tripPath("change")}>Change your dates instead</InlineLink>
        </Acts>
      </TripSection>
    </TripMain>
  );
}
