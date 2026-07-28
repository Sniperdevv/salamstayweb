import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronLeftIcon } from "@/components/icons";
import { Num, Phrase } from "@/components/numerals";
import { inlineAction } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { exampleStrip } from "@/components/ui/example-strip";

import { GuestAvatar } from "../../reservation-parts";
import { canOpenCase, findReservation, reservationHref } from "../../reservations";
import { CaseForm } from "./case-form";

/**
 * `/host/reservations/{id}/case` — HA-072, panels A and B.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHY THIS IS NOT A `/host/help/*` ROUTE
 * ═══════════════════════════════════════════════════════════════════════════
 * `ha-072` sits in the help block of the screen registry, and it does not
 * belong there. Every panel is scoped to one booking — a named guest, a booking
 * reference, a set of dates — and the card's own hrefs say so: its back chevron
 * goes to `/host/reservations/{id}` and panel B's goes to
 * `/host/reservations/{id}/case`. A case has no subject without the stay it is
 * about. The help tree holds what is true of hosting; this holds what is true of
 * one stay, so it hangs off the stay. `../../reservations.ts` carries the
 * ruling and the eligibility rule beside it.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  A ROUTE, NOT A SECTION ON THE RESERVATION — AND THE REASON IS TONE
 * ═══════════════════════════════════════════════════════════════════════════
 * `./detail.tsx` collapses HA-048 and HA-049 into one page and argues it well:
 * two phone screens exist because a phone cannot hold the request and the
 * decision at once, and at web width there is nothing to push. That argument
 * does not extend here. Accepting a request is the reservation page's own job;
 * opening a case is a different task about the same object, and a subject
 * select plus a statement field sitting permanently under every completed stay
 * would tell a host, on every reservation they open, that the product expects
 * something to have gone wrong. The card spends its whole first panel making
 * the opposite point.
 *
 * So the reservation carries one quiet inline entrance and the case has its own
 * page. Panels A and B collapse onto it, because at web width they are one
 * task: read what this is for, then say what happened.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  PANELS C AND D DO NOT SHIP, IN ANY FORM
 * ═══════════════════════════════════════════════════════════════════════════
 * "Under mediation" and "Resolved" are readings off a case record, and there is
 * no case store. Refused in detail:
 *
 *  · **A case reference** (`CASE-2026-0818-114`) and **a status pill**. Both
 *    read a record.
 *  · **The dated mediation track.** The four STAGES are real and stated below
 *    as process, because `/trust-and-safety` publishes them live. The dates
 *    against them, and which one is current, are not.
 *  · **The resolution outcome.** `PKR 6,500 released to you, PKR 8,500 returned
 *    to Fatima` is an invented remedy: an outcome from a review nobody has run,
 *    split out of money nothing holds.
 *  · **THE DEPOSIT, ENTIRELY.** The card rests its whole trust story on a
 *    `PKR 15,000` refundable deposit held on the booking. **This product has no
 *    security-deposit concept** — no field, no fixture, no copy, nowhere. Every
 *    sentence about it goes with it, including the custody language, which is
 *    also the retired vocabulary `REPOSITIONING.md` replaces.
 *  · **"The payment stays held until the case resolves."** True on
 *    `/trust-and-safety`, where it is written for a guest whose money has not
 *    been released. It is NOT carried here: this surface only opens on a stay
 *    that has been checked into, and the reservations fixture is explicit that
 *    a check-in is exactly what releases the payout. Saying it to a host whose
 *    money has already moved would be the page contradicting the two screens
 *    either side of it.
 *
 * ROUTE CONTRACT: `noindex, follow` from `app/host/layout.tsx`; no canonical, no
 * hreflang, no JSON-LD, no breadcrumb (`HOST-SHELL.md` §1). `<main
 * class="co-main">` from `HostAppShell`. Not registered yet — the registry is
 * landed centrally once the folder exists — so `metadata` is written out rather
 * than read through `pageMetadata`, which throws on an unregistered path.
 *
 * The title carries the guest's name for the reason `./page.tsx` gives: G41
 * rejects duplicate titles across a run, and a dynamic segment is the easiest
 * place in a Next app to ship one title for many pages. Deriving it from the
 * name makes it unique by construction.
 *
 * Server Component with one client leaf, because a Client Component cannot
 * export `metadata` and only the two fields hold state.
 */

interface CaseParams {
  readonly id: string;
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<CaseParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const reservation = findReservation(id);

  /* An ineligible or unknown id is answered by `notFound()` below. Returning
     nothing here lets that 404 render instead of throwing on the way to it. */
  if (reservation === undefined || !canOpenCase(reservation)) return {};

  return {
    title: { absolute: `Get help with this stay — ${reservation.guest}, SalamStay hosting` },
  };
}

/**
 * `ha-072`'s "What this is for" list, which is also `./case-form.tsx`'s subject
 * options one for one. Seeing the whole vocabulary before committing to a
 * category is the card's point and it is kept.
 */
const SUBJECTS = [
  "Property damage during the stay",
  "A house rule that was not followed",
  "A disagreement about a charge or a refund",
  "Something else about the stay you would like SalamStay to look into",
] as const;

export default async function ReservationCasePage({
  params,
}: {
  readonly params: Promise<CaseParams>;
}) {
  const { id } = await params;
  const reservation = findReservation(id);

  if (reservation === undefined || !canOpenCase(reservation)) notFound();

  const { guest } = reservation;

  /**
   * The four stages, host-voiced. Every one is `/trust-and-safety`'s live copy
   * with the counterparty swapped — a guest reads "Your host is asked for their
   * side too", a host reads the mirror — so the two people in one case read one
   * process. `HOST-SHELL.md` §0.2 forbids carrying `ha-*` content forward
   * unchecked, and this is not carried from the card: it is carried from the
   * shipped page the card and the guest surface both agree with.
   */
  const STAGES = [
    {
      term: "Case opened",
      detail: "You describe what happened, scoped to this one booking.",
    },
    {
      term: "Both sides share their view",
      detail: `${guest} is asked for their side too. Symmetric respect — neither account is treated as the default truth.`,
    },
    {
      term: "SalamStay mediates",
      detail: "Our team reviews both statements.",
    },
    {
      term: "Resolution",
      detail:
        "The outcome is stated plainly — what is returned, to whom, and when — with no editorialising about who was right.",
    },
  ] as const;

  return (
    <div className="max-w-prose">
      {/* TASTE §8 — an inline text action, ink and underlined at rest. The
          chevron mirrors under RTL; §1 rules out a breadcrumb here and this is a
          single Back rather than a trail, exactly as `./detail.tsx` draws it. */}
      <Link href={reservationHref(id)} className={`inline-flex items-center gap-1 ${inlineAction}`}>
        <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
        Back to this reservation
      </Link>

      <h1 className="mt-5 text-h4 font-semibold text-primary">Get help with this stay</h1>
      <p className="mt-2 text-bodyMd font-regular leading-relaxed text-secondary">
        {/*
          The card's framing sentence, and `/trust-and-safety`'s, which are the
          same sentence written from the two sides. Non-adversarial by
          construction: never "a claim against your guest".
        */}
        This is for when you and {guest} see something differently and need help resolving it. It is
        not a complaint filed against your guest, and it is not a case you win.
      </p>

      {/* The booking this is about. Initials, never a face — `GuestAvatar`
          imported from the reservations surface rather than redrawn. */}
      <div className="mt-6 flex items-start gap-3">
        <GuestAvatar initials={reservation.initials} />
        <div className="min-w-0">
          <p className="text-bodyMd font-semibold text-primary">{guest}</p>
          <p className="mt-0.5 text-bodySm font-regular text-secondary">
            {/*
              A17: the isolate wraps the SENTENCE, not the date inside it — a
              bare `.num` run reorders past the Latin words around it under RTL.

              BOTH halves go through `Num`, not just the date. "Gulberg 2
              Residence" carries a digit run of its own, and BUILD-DECISIONS #2
              is "`.num` on EVERY digit run" with no carve-out: without it the
              `2` inherits Nastaliq inside an Urdu sentence. `./detail.tsx` had
              the same line with the listing left bare and has been corrected to
              match, so the two surfaces render one fact one way.
            */}
            <Phrase>
              <Num>{`${reservation.listing}, ${reservation.city}`}</Num> ·{" "}
              <Num>{reservation.dates}</Num>
            </Phrase>
          </p>
        </div>
      </div>

      {/*
        Two absences in one strip, because a host meets both on this page: the
        booking above is written into a fixture, and the form below opens
        nothing. `exampleStrip` is the shared recipe; the sentence is this
        surface's own, because the wording differs where the lie differs.
      */}
      <p className={`${exampleStrip} mt-6`}>
        <b className="font-semibold text-primary">No case is opened here.</b> SalamStay has no
        booking store and no case store, so the stay above is written into this site rather than
        booked on your account, and nothing sent from the form below is filed, reviewed or shown to
        anyone.
      </p>

      <section aria-labelledby="for-h" className="mt-8 border-t border-hairline pt-8">
        <h2 id="for-h" className="text-h5 font-semibold text-primary">
          What this is for
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {SUBJECTS.map((subject) => (
            <li key={subject} className="flex items-start gap-3">
              {/* `CheckMark` sets its own `aria-hidden` — the row's text is
                  the content and a repeated tick is not. */}
              <CheckMark className="mt-1 size-4 flex-none text-tertiary" />
              <span className="text-bodySm font-regular leading-relaxed text-secondary">
                {subject}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-h" className="mt-8 border-t border-hairline pt-8">
        <h2 id="how-h" className="text-h5 font-semibold text-primary">
          How SalamStay resolves it
        </h2>

        {/* `<ol>` because the four are genuinely ordered, and hairline-divided
            open space rather than a stepper: `HOST-SHELL.md` §3 allows exactly
            two stepper tiers in this product and forbids inventing a third, and
            neither of the two belongs on a surface with nothing to step
            through. Nothing here is `current`, because nothing is running. */}
        <ol className="mt-6 divide-y divide-hairline">
          {STAGES.map(({ term, detail }) => (
            <li key={term} className="py-5 first:pt-0 last:pb-0">
              <p className="text-bodyMd font-semibold text-primary">{term}</p>
              <p className="mt-1.5 text-bodySm font-regular leading-relaxed text-secondary">
                {detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="say-h" className="mt-8 border-t border-hairline pt-8">
        <h2 id="say-h" className="text-h5 font-semibold text-primary">
          Tell us what happened
        </h2>
        <CaseForm guest={guest} />
      </section>

      <div className="mt-8 border-t border-hairline pt-8">
        <p className="text-bodySm font-regular leading-relaxed text-secondary">
          What SalamStay does when a stay goes wrong — mediation, reporting, and what a guest is and
          is not told — is set out in{" "}
          <Link href="/trust-and-safety" className={inlineAction}>
            trust and safety
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
