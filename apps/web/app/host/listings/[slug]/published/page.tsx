import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { iconStroke } from "@salamstay/design-tokens/icons";
import { Phrase } from "@/components/numerals";
import {
  FactRow,
  FactRows,
  postFlowNote,
  postFlowPrimary,
  postFlowSection,
  postFlowSectionTitle,
  WizardPostFlow,
} from "@/components/host/wizard-post-flow";
import { btnSecondaryMd, inlineAction, pressable } from "@/components/ui";
import {
  CANTONMENT_NOC_HREF,
  CANTONMENT_NOC_LABEL,
  HOST_LISTING_DRAFT as L,
} from "@/lib/content/host-listing-draft-fixture";
import { image } from "@/lib/content/image-manifest";
import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

/**
 * `/host/listings/{slug}/published` — the listing is live.
 * `hw-007-publish-and-host.html` **panel C**, under `HOST-SHELL.md` §15.
 *
 * THE CALM PAYOFF, AND EVERY WORD OF THAT IS A CONSTRAINT
 * ------------------------------------------------------
 * `hw-007`'s note on this panel: "no confetti, no counting spinner, and no
 * animation on the tick — it states an outcome that has already happened."
 * There is therefore no entrance transition, no stagger, no number that counts
 * up and no `motion-reduce` clause anywhere on this page: not a reduced-motion
 * concession, an absence. Emil's first question is how often a user sees an
 * animation; the answer here is once per listing, and the answer to what it
 * would communicate is nothing the tick does not already say by being there.
 *
 * The tick takes the SEMANTIC `success` roles rather than
 * `interactive.primary`, so it is a status mark and not a third brand-green
 * role on a surface that already spends the wordmark dot and one primary (§7).
 * The `Live` chip below it is the same carve-out for the same reason.
 *
 * NOTHING INVENTED, WHICH IS MOST OF WHAT THIS PAGE IS NOT
 * -------------------------------------------------------
 *  · **No rating and no review count.** `ha-046` ships `4.9 · 128 reviews`;
 *    zero real reviews exist and it is copied nowhere.
 *  · **No projected bookings, no view counter, no response-rate target, no
 *    "hosts like you earn" line.** A listing published thirty seconds ago has
 *    none of those numbers, and rendering them at zero would be inventing a
 *    measurement rather than reporting one.
 *  · **No SLA.** `What happens next` says only what genuinely happens, and the
 *    payout row describes the behaviour rather than paraphrasing a §5 claim.
 *  · **No date or time strip** (TASTE §11.20).
 *
 * `Back` GOES TO LISTINGS, AND THAT IS THE RULING RATHER THAN A PREFERENCE
 * -----------------------------------------------------------------------
 * §15's 2026-07-26 amendment: "`Back` returns to the last state that still
 * exists. Where the previous state has been superseded by an irreversible
 * action, `Back` becomes the route to wherever the result of that action now
 * lives — never a re-entry into a state the system has left." The step behind a
 * live listing is "not published yet", so the honest destination is the place
 * the listing now lives. The preview's `Back` is the other half of that ruling
 * and goes to step 9; see that file.
 *
 * THE LISTING IS A FIXTURE. Nothing here is the reader's data — see
 * `lib/content/host-listing-draft-fixture.tsx`, which says exactly what that
 * means and what deletes it.
 *
 * WHY THE SEGMENT IS DYNAMIC WHEN ONE SLUG RESOLVES
 * ------------------------------------------------
 * Because the URL shape is the product's and the registry is the gate. G37
 * compares literal hrefs, so `/host/listings/cantt-view-residence/published` is
 * a literal key like any other path and every other slug 404s here — the same
 * call `/book/{slug}/{step}` made, and the same reason: a pattern would let
 * `/host/listings/{anything}/published` resolve against a listing nobody owns.
 * The day drafts are real, the guard stays and the registry grows a factory.
 *
 * SEMANTICS (§1): `noindex, follow` inherited from `app/host/layout.tsx`;
 * `<main class="co-main">`, never `indexable`; ONE `<h1>`; no canonical, no
 * hreflang pair, no JSON-LD, no breadcrumb.
 */

const pathFor = (slug: string): string => `/host/listings/${slug}/published`;

/**
 * The title is the registry's, looked up rather than retyped — G41 compares the
 * served string byte for byte and the nine wizard steps already paid for one
 * shared title. An unregistered slug returns `{}` and never reaches a render:
 * the page 404s below, and `pageMetadata` would throw rather than 404.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const path = pathFor((await params).slug);
  return routeByPath.has(path) ? pageMetadata(path) : {};
}

/* ——— Glyphs ——————————————————————————————————————————————————————————————
 *
 * `hw-007` panel C's own paths, local to this surface. Each sits beside a real
 * text label, so each is `aria-hidden`.
 */

function Glyph({
  stroke = iconStroke.thin,
  className = "size-4",
  children,
}: {
  readonly stroke?: number;
  readonly className?: string;
  readonly children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/** The outcome mark. `bold` stroke: it is reversed out of a filled disc. */
function TickGlyph() {
  return (
    <Glyph stroke={iconStroke.bold} className="size-6">
      <path d="M5 12l5 5L20 7" />
    </Glyph>
  );
}

function CheckGlyph() {
  return (
    <Glyph stroke={iconStroke.bold}>
      <path d="M5 12l5 5L20 7" />
    </Glyph>
  );
}

/** Pending, not failed. A minus and never a cross. */
function PendingGlyph() {
  return (
    <Glyph stroke={iconStroke.bold}>
      <path d="M8 12h8" />
    </Glyph>
  );
}

function SearchGlyph() {
  return (
    <Glyph>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </Glyph>
  );
}

function InboxGlyph() {
  return (
    <Glyph>
      <path d="M4 5h16v11H9l-5 4z" />
    </Glyph>
  );
}

function PayoutGlyph() {
  return (
    <Glyph>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 15h3" />
    </Glyph>
  );
}

/* ——— Page ———————————————————————————————————————————————————————————————— */

export default async function ListingPublishedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!routeByPath.has(pathFor(slug))) notFound();

  const thumb = image(L.hero);

  return (
    <WizardPostFlow
      ctxNow="Published"
      headerActions={
        <Link href="/host/today" className={`${btnSecondaryMd} px-4`}>
          Go to Today
        </Link>
      }
      backHref="/host/listings"
      backLabel="Back to listings"
      primary={
        /*
          `Done` ends the flow at the host's home, where the header's `Go to
          Today` also points. That is the card's own pairing and it is not a
          duplicated call: the header button is the escape hatch every wizard
          surface carries at the top (it is `Save & exit`'s slot), and the
          primary is the flow's terminator. `Back` covers Listings, so the two
          exits are two places and not one.
        */
        <Link
          href="/host/today"
          className={`${postFlowPrimary} justify-self-end bg-interactive text-on-brand hover:bg-interactive-hover ${pressable}`}
        >
          Done
        </Link>
      }
    >
      <div className="pt-11">
        {/*
          `.donewrap` — the tick, the outcome, the sentence. 48px where the card
          draws 52: 52 is a rung on neither the token scale nor Tailwind's, 48 is
          `space-12`, and the glyph steps with it so the proportion holds.
        */}
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-success-bg text-success"
        >
          <TickGlyph />
        </span>

        <h1 className="mt-4 text-h3 font-semibold text-primary">Your listing is live</h1>
        <p className="mt-2 max-w-[56ch] text-bodyMd font-regular text-secondary">
          <b className="font-semibold text-primary">{L.name}</b> is now findable by guests
          searching {L.city}.
        </p>
      </div>

      {/*
        The listing row — `.lrow`: border, no shadow (TASTE §1: it bounds
        content, it does not float over it). `radius.lg` outer with 16px padding
        holding a `radius.md` thumbnail, which is §4.1's concentric nesting
        rather than two equal radii nested.

        No heading above it: the `h1` two lines up names this listing, and a
        section heading over a single row restating it would be a label for a
        thing the reader is already looking at.
      */}
      <section className={postFlowSection} aria-label={L.name}>
        <div className="flex items-center gap-4 rounded-lg border border-hairline bg-canvas p-4">
          <span className="relative block h-16 w-20 flex-none overflow-hidden rounded-md bg-sunken">
            <Image
              src={thumb.file}
              alt={thumb.alt}
              width={thumb.width}
              height={thumb.height}
              sizes="80px"
              className="size-full object-cover"
            />
          </span>

          <span className="min-w-0 flex-1">
            <b className="block text-bodyMd font-semibold text-primary">{L.title}</b>
            <span className="mt-0.5 block text-bodySm font-regular text-secondary">
              {/* A17: the count closes the line, so under RTL the isolate took
                  the paragraph direction and led — `6 · sleeps Rawalpindi
                  Cantonment · Entire place · sleeps`. Inside the block span,
                  never on it (`components/numerals.tsx`). */}
              <Phrase>
                {L.area} · {L.stayType} · sleeps <span className="num">{L.sleeps}</span>
              </Phrase>
            </span>
            <span className="mt-2 flex flex-wrap items-center gap-2.5">
              {/*
                SEMANTIC success, not brand — the same carve-out as the tick, and
                the reason the surface still spends only two green roles.
              */}
              <span className="inline-flex items-center rounded-full border border-success-border bg-success-bg px-2.5 py-0.5 text-caption font-semibold text-success">
                Live
              </span>
              <span className="text-bodySm font-regular text-secondary">
                <b className="font-semibold text-primary">
                  PKR <span className="num">{L.nightly}</span>
                </b>{" "}
                a night
              </span>
            </span>
          </span>

          {/*
            TASTE §5's gray-fill secondary at the chrome rung — the one component
            behind every secondary action on the site. It drops below `sm`, where
            the row has no width for it and the listing is one tap away in
            Listings either way.

            AND THE REGISTRY DECIDES WHETHER IT EXISTS AT ALL. `hw-007` sends
            this at the listing's public URL, which no registry backs, because
            the listing is a fixture and its guest page was never built. G37
            fails the build on an href that resolves nowhere, and a `View it as
            a guest` that lands on "This page is being written" is a worse
            payoff than no button. So the link renders only while the route is
            registered — register `L.guestHref` and it appears, leave it out and
            it does not, and neither outcome is a broken page. The condition
            comes out the day the listing is real, because then so is the route.
          */}
          {routeByPath.has(L.guestHref) ? (
            <Link href={L.guestHref} className={`${btnSecondaryMd} hidden px-4 sm:inline-flex`}>
              View it as a guest
            </Link>
          ) : null}
        </div>
      </section>

      {/*
        The same two gating rows the preview showed, restated because it is the
        first thing a host will want to check after pressing the button. Only
        the tense moves: on the preview these described what publishing would
        do, here they describe what is true.
      */}
      <section className={postFlowSection} aria-labelledby="who-h">
        <h2 id="who-h" className={postFlowSectionTitle}>
          Who can book right now
        </h2>

        <FactRows>
          <FactRow
            tone="done"
            icon={<CheckGlyph />}
            title="Guests travelling on a CNIC"
            detail="Can find and book you from now."
          />
          <FactRow
            tone="pending"
            icon={<PendingGlyph />}
            title="Guests travelling on a foreign passport"
            detail={
              <>
                Opens once your cantonment NOC is verified.{" "}
                <Link href={CANTONMENT_NOC_HREF} className={`text-label ${inlineAction}`}>
                  {CANTONMENT_NOC_LABEL}
                </Link>
              </>
            }
          />
        </FactRows>
      </section>

      {/*
        `What happens next` — three rows, all `neutral`. Not one of them is
        `done`: every row here is a future fact, and a green tick on each would
        spend three success marks to distinguish nothing (`gw-023`'s rule, and
        the reason `tone` is rationed in `FactRow`).
      */}
      <section className={postFlowSection} aria-labelledby="next-h">
        <h2 id="next-h" className={postFlowSectionTitle}>
          What happens next
        </h2>

        <FactRows>
          <FactRow
            icon={<SearchGlyph />}
            title="Guests find you in search"
            detail={`Your listing appears in ${L.city} results and on your own listing page.`}
          />
          <FactRow
            icon={<InboxGlyph />}
            title="Requests arrive in your inbox"
            detail="You are notified for each one, and you answer from Reservations."
          />
          <FactRow
            icon={<PayoutGlyph />}
            title="You are paid after each stay"
            detail="Your payout is shown line by line, with the fee and the tax on it, before it is sent."
          />
        </FactRows>

        <p className={postFlowNote}>
          Nothing is locked. Editing a live listing keeps it live, and you can pause it from{" "}
          <b className="font-semibold text-primary">Listings</b> whenever you need to.
        </p>
      </section>
    </WizardPostFlow>
  );
}
