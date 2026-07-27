import type { Metadata } from "next";
import Link from "next/link";

import { CertificateIcon } from "@/components/booking/verification-copy";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import type { DocumentId } from "@/lib/booking/booking";
import { pageMetadata } from "@/lib/seo/metadata";

import {
  AccountBackLink,
  AccountPageHead,
  AccountSection,
  ExampleAccountStrip,
} from "../account-chrome";
import { AccountIdentity } from "../account-identity";

/**
 * GA-049 — `/account/verification`, at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PAGE ANSWERS ONE QUESTION AND REFUSES TO ANSWER A SECOND ONE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * "Am I verified?" is the question a CNIC-first launch is asked most, and until
 * now the guest had nowhere to look. This page answers it in the first block and
 * then stops: it says where this account STANDS, and it does not restate the
 * RULES, which live on `/verification` and are linked from here twice at most.
 *
 * HOW THE MATRIX IS NOT DUPLICATED
 * --------------------------------
 * `/verification` carries the party-type → document matrix as a real four-column
 * `<table>` (party type · required verification · issuing authority · why it is
 * asked), plus what each document IS. Reproducing any of that here would give
 * the site two copies of a §5-claim-bearing table, which is the drift
 * `components/booking/verification-copy.tsx` was written to prevent one level
 * down. So this page names what lives over there and links it — *"See what a
 * booking asks for"* — and the only document vocabulary it uses is the three
 * names in the privacy sentence, where they are the subject of a promise rather
 * than rows of a requirement. Which documents THIS account owes is not knowable
 * anyway: it is a function of a booking's party type, and there is no booking.
 *
 * WHAT STATE IS DRAWN, AND WHERE EVERY BIT OF IT COMES FROM
 * ---------------------------------------------------------
 * Two facts, both labelled as a fixture by `ExampleAccountStrip`:
 *
 *  1. **`SESSION_ACCOUNT.verification`** ("CNIC verified") and the name beside
 *     it, drawn by `AccountIdentity` — the one record `lib/mode.ts` holds, read
 *     and never retyped. See the boundary note below.
 *  2. **`DOCUMENTS_IN_REVIEW`**, which is empty. `GUEST-SHELL.md` §12: *"No
 *     guest has … a completed verification. Empty is what every one of these
 *     surfaces renders on day one, so it is specified first and built first."*
 *
 * THE CLIENT BOUNDARY, WHICH IS THE BUG THIS FILE WAS TOLD ABOUT
 * --------------------------------------------------------------
 * `SESSION_ACCOUNT` is exported from `lib/mode.ts`, which carries `"use client"`.
 * Under RSC every export of a client module reaches the server as a client
 * *reference* rather than a value, so a Server Component writing
 * `SESSION_ACCOUNT.verification` renders nothing at all — which is exactly how
 * `/account` first shipped, with an empty avatar disc and no name.
 *
 * This page therefore never touches `SESSION_ACCOUNT`. It renders
 * `<AccountIdentity>`, which is already `"use client"` and reads it inside its
 * own module. That keeps the boundary drawn around the one block that needs it,
 * which is the argument `account-chrome.tsx` and `account-identity.tsx` both
 * make, and it is why this file is a plain Server Component with no `step.tsx`
 * sibling: there is no state here beyond that one read, so there is nothing for
 * a `"use client"` page body to hold, and `export const metadata` stays where
 * G41 needs it without a split.
 *
 * THE FOUNDER RULING (2026-07-26) AND `GO-LIVE` E3
 * ------------------------------------------------
 * Anyone books, and the marriage certificate at booking is the only document
 * requirement SalamStay imposes; hosts do not set document requirements. No
 * string below attributes a document to a host. E3 is open — read strictly the
 * ruling would retire claim 3 the way claim 5 was retired — and the **narrow**
 * reading is what is applied and shipped everywhere else, so it is what is built
 * here: FRC and B-Form are still real documents the flow collects, and they are
 * named as such in the privacy sentence. The page does not argue E3 on screen.
 *
 * WHAT `ga-049` DRAWS THAT IS DELIBERATELY ABSENT (§14, and the brief's list)
 * --------------------------------------------------------------------------
 *  · **"Verified since March 2026"** and **"expires 12 Aug 2026"** — a
 *    verification date and an expiry date. Nothing holds either.
 *  · **"2 of 3 verified"** and its progress bar — a fraction of a document set
 *    this account has no basis to owe, and TASTE §12 forbids shipping the zero
 *    or the dash that would stand in for it. The bar goes with it.
 *  · **"In review — usually within a few hours"** — an invented turnaround, and
 *    §14's own example of one. There is no review queue, so there is no position
 *    in it either.
 *  · **"Couldn't read the last photo"** — a rejection reason, from a review
 *    nobody has built. `lib/booking/booking.ts` is explicit that "Verified" and
 *    "Needs one more" are verdicts a session cannot honestly hold.
 *  · **A NADRA reference number, a trust score, a badge count.** None exists.
 *  · **The expiry re-prompt banner and the "Renew now" primary.** Both are
 *    driven entirely by a date that is not held. A re-prompt with nothing behind
 *    it is worse than none.
 *  · **`/verify/resume`.** `ga-049` routes its banner and its row actions there;
 *    §GUEST-SHELL Unresolved records that whether a document can be uploaded
 *    with no booking attached, and at what route, is **undrawn**. It is not
 *    invented here, which is also why the empty state's action is a page to read
 *    rather than a flow to enter.
 *
 * GREEN (§8). Two roles on this page, both chrome: the wordmark dot and the
 * header avatar's fill. The body spends none. The verification mark is INK
 * (§6, TASTE §2 role 4 is a mark, not a fill), the one action is the §5 gray
 * secondary, and every link is ink and underlined at rest (§8/TASTE §8).
 *
 * ELEVATION (§9). The identity block carries a border and no shadow; the empty
 * state carries neither; sections are separated by a hairline and a heading,
 * never by a card (TASTE §1's "carries NEITHER" column).
 *
 * MOTION (§11). None. This is a page a guest opens to read one word, and §11
 * budgets press feedback only — which the links and the button already carry
 * from `inlineAction` and `btnSecondary`. Nothing here enters, reveals or
 * animates.
 *
 * ROUTE CONTRACT (§2): `noindex, follow` from `../layout.tsx` and again off the
 * registry row; no canonical, no hreflang, no JSON-LD, no breadcrumb;
 * `<main class="co-main">` from the layout, never `indexable`; one `<h1>`,
 * paired with the registered title for G43 — title `Your verification —
 * SalamStay`, `<h1>` `Your verification`.
 *
 * The registry row is still `stub("/account/verification", …)`. Flipping it to
 * `page()` is a central edit and is reported, not made here — `pageMetadata`
 * reads the same title either way, so nothing about this file changes when it
 * happens.
 */
export const metadata: Metadata = pageMetadata("/account/verification");

/**
 * The documents this account has waiting on a review.
 *
 * It is empty, and it is a **declared constant rather than an assumed absence**
 * — the same shape `SAVED_PAYMENT_METHODS` takes on `/account/settings/payment`
 * and for the same reason: the day a real review queue arrives, the filled state
 * is a missing `else` rather than a rewrite of the page. There is no store, so
 * there is nothing to read it from; what there is, is one place to point at.
 */
const DOCUMENTS_IN_REVIEW: readonly DocumentId[] = [];

/**
 * The three fields the CNIC check matches, exactly as `ga-075` lists them and as
 * the checkout's consent section already renders them. Three, and never a
 * fourth: the whole point of naming them is that the list is short and closed.
 */
const CHECKED_FIELDS = [
  { field: "Name", what: <>As it appears on your CNIC</> },
  {
    field: "CNIC number",
    what: (
      /*
        `dir="auto"` on an INLINE span — the isolate that
        `app/host/(app)/calendar/calendar.tsx` adopted after its month heading
        rendered "2026 August" under RTL. `.num` puts `13` in its own bidi run,
        and an isolate is a neutral object to the text around it, so where that
        run sits against the paragraph boundary it takes the PARAGRAPH's
        direction and jumps to the far end of the phrase.
        `dir="auto"` resolves the span from its own first strong character, so
        the phrase keeps its word order in either language. On a span rather
        than the `<dd>`, because a block would take its text-align from the
        resolved direction and pull the whole value to the wrong edge.

        WHAT WAS ACTUALLY MEASURED HERE, rather than assumed. Forcing
        `dir="rtl"` and rendering this cell with and without the wrapper gives
        the SAME output both ways: "Your 13-digit identity number". The run is
        sandwiched between English words, so it never touches the paragraph
        boundary and never reorders. Two probes in the same `<dl>`, same forced
        RTL, show the failure the wrapper is for: `Identity number <num>13</num>`
        renders "13 Identity number" bare and "Identity number 13" wrapped, and
        `<num>13</num> digits, no more` renders "digits, no more 13" bare and
        "13 digits, no more" wrapped.

        So the wrapper is NOT load-bearing on today's string, and it stays
        anyway: it costs one span, and it makes the cell correct independently
        of where the digit lands in the sentence — which is a word-order
        question, and word order is the first thing an Urdu translation changes.
        Do not delete it on the grounds that removing it looks identical.
      */
      <Phrase>
        <Num>Your 13-digit identity number</Num>
      </Phrase>
    ),
  },
  { field: "Date of birth", what: <>Confirms the match against NADRA&apos;s record</> },
] as const;

const sectionBody = "mt-3 max-w-[62ch] text-bodyMd font-regular leading-relaxed text-secondary";

export default function AccountVerificationPage() {
  return (
    <>
      {/* §5's general form, which `HOST-SHELL.md` §15 states: back returns to
          the last state that still exists. `/account` is where the row that
          opens this page lives. */}
      <AccountBackLink href="/account">Your account</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Your verification"
        sub="What SalamStay has confirmed, what your host is shown, and what a booking asks for."
      />

      <ExampleAccountStrip className="mt-6">
        The mark below is written into the site. No document has been uploaded, and nothing here has
        been through a review.
      </ExampleAccountStrip>

      {/*
        The answer, in the first block on the page. A statement and not a
        control: the one link to `/account/profile` in this tree belongs to the
        settings hub's identity row (§5), and doubling it here would put two
        routes into an undecided question (see `app/account/page.tsx`).

        The shield and the word are `SESSION_ACCOUNT.verification`, read by
        `AccountIdentity` inside its own client module. Ink, never green.
      */}
      <AccountIdentity
        className="mt-6"
        sub="The check every booking starts with. Later bookings skip the step."
      />

      {/*
        §12's four-part recipe from the shared component, and the second half of
        the question this page exists to answer: nothing is pending. `heading="h2"`
        because the `.pagehead` above already carries the `<h1>` (G30).

        The action names the exact next step and it is deliberately a page to
        READ, not a flow to enter: uploading a document with no booking attached
        is one of `GUEST-SHELL.md`'s own Unresolved items, and `ga-049`'s
        `/verify/resume` is not a route this build owns.

        THE HAIRLINE IS NOT DECORATION. `/account/settings/payment` renders this
        component straight under the strip, where the `.pagehead` above is enough
        to start it. Here the identity block sits in between, and without a rule
        the 48px `pt-12` reads as a gap in the page rather than as the top of a
        section — checked on screen, and it was the one thing wrong with the
        first pass. §4a/§4b: sections are separated by a hairline and a heading,
        never by a card, and the heading this one gets is its own `h2`.
      */}
      {DOCUMENTS_IN_REVIEW.length === 0 ? (
        <EmptyState
          className="mt-8 border-t border-hairline"
          glyph={<CertificateIcon className="size-7" />}
          title="Nothing is waiting on you"
          body="No document has been asked for, and nothing is in review. A booking asks for what it needs, when you book."
          action={
            <Link href="/verification" className={`${btnSecondary} no-underline`}>
              See what a booking asks for
            </Link>
          }
        />
      ) : null}

      <AccountSection
        id="covered"
        heading="What the check covers"
        sub="CNIC verification is one match against NADRA's record, and these three fields are the whole of it."
        className="mt-2"
      >
        {/*
          The same three-cell anatomy the checkout's consent section renders
          (`app/book/[slug]/verify/step.tsx`), reused rather than re-drawn: a
          hairline between rows and no container at all. TASTE §1 puts a block
          of statements in the "carries NEITHER" column, and a rule between two
          data rows is a separator, not a box.
        */}
        <dl className="mt-5 max-w-[62ch]">
          {CHECKED_FIELDS.map((row) => (
            <div
              key={row.field}
              className="flex items-baseline gap-4 border-t border-hairline py-3 first:border-t-0"
            >
              <dt className="w-32 flex-none text-bodySm font-medium text-primary">{row.field}</dt>
              <dd className="min-w-0 flex-1 text-bodySm text-secondary">{row.what}</dd>
            </div>
          ))}
        </dl>

        <p className={sectionBody}>
          Nothing beyond these three is sent, and none of it is shown to hosts or other guests.
        </p>
      </AccountSection>

      <AccountSection
        id="host-sees"
        heading="What your host sees"
        sub="Your host completes the same check, before either of you meets the other."
        className="mt-8"
      >
        <p className={sectionBody}>
          A host sees your name, your guest count and the same verification mark that is on this
          page, with your CNIC number masked. The full number goes to the police registration
          portal, and to nobody else.
        </p>
        <p className={sectionBody}>
          A host never sees a document. A Nikah Nama, an FRC or a B-Form confirms a booking type and
          is then kept encrypted. It is not shown to your host, to other guests, or on your profile.{" "}
          <Link href="/legal/data-handling" className={`${inlineAction} font-medium`}>
            How we handle your documents
          </Link>
        </p>
      </AccountSection>

      {/*
        A different intent from the empty state's action, which is why both are
        allowed to exist: that one names the rules, this one names the walk-
        throughs. One link each, and no second route to the same place.
      */}
      <AccountSection id="help" heading="Help with documents" className="mt-8">
        <p className={sectionBody}>
          How to get a document you do not have, and how the checks work for guests visiting from
          abroad, are answered in the help centre.{" "}
          <Link href="/help/verification" className={`${inlineAction} font-medium`}>
            Verification and documents
          </Link>
        </p>
      </AccountSection>
    </>
  );
}
