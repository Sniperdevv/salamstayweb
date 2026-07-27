import type { Metadata } from "next";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { btnSecondary } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";

import { AccountBackLink, AccountPageHead, ExampleAccountStrip } from "../../account-chrome";

/**
 * `/account/profile/reviews` — `GA-101` at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  BOTH HALVES OF THIS PAGE ARE EMPTY, AND THAT IS THE PAGE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` §12 names this surface in its opening sentence: *"No guest
 * has a trip, a message, a wishlist, a **review**, a receipt or a completed
 * verification. Empty is what every one of these surfaces renders on day one,
 * so it is specified first and built first, not folded in at the end."* And §14
 * names this card by number for what must never be invented on it:
 *
 *   > `ga-101`, `ga-131`, `ga-128` — **star ratings and review counts.** There
 *   > are zero real reviews.
 *
 * There is no review model, no review store and no review fixture anywhere in
 * this build. So the four review cards `ga-101` draws — Ayesha's, Yusuf's, and
 * the two Fatima wrote back — are not unrendered rows; they are a populated
 * future drawn on a phone card, and rendering them would tell every reader that
 * four hosts have written about them. `app/trips/page.tsx` argues that at
 * length for a list of bookings and the argument transfers unchanged.
 *
 * WHAT `ga-101` DRAWS THAT IS DELIBERATELY ABSENT
 * -----------------------------------------------
 *  · **The `tablist`.** The card's two tabs — "About you" / "Written by you" —
 *    are the surface's whole structure, and with nothing in either they become
 *    a control that switches between two nothings, hiding half the truth behind
 *    a click. §3 refuses the collapsed search pill on these surfaces in exactly
 *    those words (*"a pill summarising nothing is a control that describes
 *    nothing"*), `/trips` refuses a tab strip over one empty list, and
 *    `/host/reservations` recorded the same call for its own first-run branch.
 *    Both halves are named in the closing paragraph instead, where they cost a
 *    sentence rather than a state machine.
 *  · **Amber stars.** `ga-101` and `ga-131` fill them `--warning-fg`.
 *    TASTE §11.4 — stars are ink, never gold — postdates the corpus and wins
 *    (§0.3). Moot in the end: no rating is displayed anywhere on this page. The
 *    one star on it is a section mark, and it argues for itself below.
 *  · **The inline reply composer.** `ga-101` opens one under a review on the
 *    "About you" tab as a preview of `ga-131`'s depth surface. A composer for a
 *    reply to a review nobody wrote is `ga-099`'s problem one step further
 *    removed — and `app/trips/[id]/review/page.tsx` already refused the
 *    lighter version of it, gating the composer shut behind a real check-out
 *    date because *"a five-star composer for a stay nobody has taken is the
 *    review-shaped version of the fabricated receipt."*
 *  · **The 14-day public-response window.** `DESIGN.md` §9-J's figure may be
 *    stated (§14) and the host side of this loop does state it, because
 *    `HA-077` is the screen that owns it. Here it would be a third mechanism on
 *    a page with nothing to reply to; it belongs to `ga-131`, the About-you
 *    depth surface, which is not this route.
 *  · **Any count, average or "0 reviews".** Suppressed, not zeroed and not
 *    dashed (TASTE §12).
 *
 * WHY THIS PAGE HOLDS NO STATE, AND WHY THAT MATTERS HERE
 * -------------------------------------------------------
 * Dropping the `tablist` is a content decision, but it has a build consequence
 * worth stating: with no state there is no `"use client"` boundary, so this is
 * one Server Component exporting `metadata` directly rather than a thin
 * `page.tsx` over a client sibling. G41 — a HARD gate comparing the served
 * `<title>` to the registry byte for byte AND rejecting duplicates across a run
 * — is what makes that split necessary when state exists (`app/account/layout.tsx`
 * records the nine wizard steps that failed eight HARD gates inheriting one
 * title from a layout). It never opens here. `pageMetadata` is not used because
 * it throws on a path the registry does not yet carry, and the registry is
 * edited centrally; the string below is the one this route asks for.
 *
 * ROUTE CONTRACT (§2, not restated): `noindex, follow` from
 * `app/account/layout.tsx`; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` and the 640 column from that same
 * layout, so this file returns a fragment. The marketing `SiteHeader` stays and
 * the footer does not — §3, and `guest-chrome.tsx` already lists `/account` in
 * `NO_FOOTER_ROOTS`, so this route inherits both without an edit.
 *
 * ONE `<h1>`: "Your reviews", paired with the registered title for G43.
 *
 * GREEN (§8): **none in the body.** Two roles on this page and both are chrome
 * — the wordmark dot and the header avatar's fill. The `/account` tree spends
 * zero brand green across all eleven of its files, which is why no row of it
 * appears in `components/header-cta.ts`, and this page keeps that true: its one
 * action is the §5 gray-fill secondary, not a green pill. That is not
 * timidity — role 3 is "the surface's one **primary CTA**", and a page whose
 * only move is "go and look at your trips" has no call to make. It is left
 * structurally unspent, the way §3 leaves role 2 unspent by removing the search
 * pill. Nothing outside this folder needs changing as a result.
 */
export const metadata: Metadata = {
  title: { absolute: "Your reviews — SalamStay" },
};

/**
 * The section's mark: **one outline star, and it is not a rating.**
 *
 * This is `ga-101`'s own empty-state glyph, at `ga-101`'s own path, and it is
 * the one place a star survives on a page built to prove no rating exists — so
 * it takes the justification TASTE §11.4 asks for.
 *
 * `/host/insights` states the governing principle for an empty section's glyph:
 * *"It names the SECTION, not the missing content: a bar chart is what
 * 'Insights' is about […] It promises no chart."* A star is what "Reviews" is
 * about in the same way. A rating is five of these in a row with some of them
 * filled and a number beside it; this is one of them, alone, in a 64px disc,
 * directly above a heading that says there are none.
 *
 * **Outline, ink, never gold, never filled, never five.** §11.4 supersedes
 * `ga-101`/`ga-131`'s `--warning-fg` amber. §11.3 sanctions the SOLID star as
 * one of only two meaningful solid marks on the site — that one is a rating
 * control and it already ships, in `app/trips/[id]/review/step.tsx`, where a
 * guest chooses a value. This is not that glyph and deliberately not built from
 * it: reaching for `StarGlyph` would import a filled/unfilled rating primitive
 * into a page that has no value to show, and its own note ("flagged for
 * hoisting the moment a second surface renders a star") is about a surface that
 * renders a RATING. This one does not.
 *
 * The alternative considered was the speech bubble `ha-062` draws for the same
 * empty. It was rejected on both sides of the loop for one reason: a bubble
 * reads as "messages" first, and Messages is a real adjacent destination in the
 * account menu and on `/account` itself — where `MessageIcon`, a bubble, is
 * already that row's mark. `app/host/(app)/reviews/page.tsx` draws the twin of
 * this function so the two halves of the review loop carry one mark; merge
 * candidate, flagged, for whoever owns a shared guest/host glyph module.
 *
 * Decorative — it always sits above a real heading — so `aria-hidden`.
 */
function StarOutlineGlyph({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.regular}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 3l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 6 20.4l1.4-6.8L2.3 10.6l6.9-.7z" />
    </svg>
  );
}

export default function AccountReviewsPage() {
  return (
    <>
      {/*
        BACK GOES TO `/account`, NOT TO `/account/profile`, AND THAT IS A CHOICE.

        `ga-101`'s chevron points at `/account/profile` and §1a makes that route
        this page's parent. But `/account/profile` is a registry `stub()` with
        no folder: it resolves 200 through `app/[...registered]/page.tsx` and
        renders one line saying it is being written. `GUEST-SHELL.md` §5 and
        `HOST-SHELL.md` §15 both state the rule as *"Back returns to the last
        state that still exists"*, and §12 forbids a dead end — sending a reader
        from a real page to a placeholder is one. `/account` is the surface that
        exists, routes to everything about the person, and is where a reader
        will actually have come from. This line becomes `/account/profile` the
        day `ga-122` is built, and nothing else on the page changes.
      */}
      <AccountBackLink href="/account">Your account</AccountBackLink>

      <AccountPageHead
        className="mt-5"
        title="Your reviews"
        sub="What hosts have written about you, and what you have written about the homes you stayed in."
      />

      {/*
        The third instance of the one strip, worded for what THIS surface would
        be claiming (`account-chrome.tsx` documents the pattern and why the
        wording differs each time). The distinction it draws is the one this
        page cannot afford to leave to inference: not "SalamStay looked at your
        account and found nothing", but "there is nothing to look at, for
        anyone". Without it, an empty reviews page reads as a verdict on the
        reader.
      */}
      <ExampleAccountStrip className="mt-6">
        There is no review store either, so the state below is what this page shows anyone.
      </ExampleAccountStrip>

      <EmptyState
        glyph={<StarOutlineGlyph className="size-7" />}
        title="No reviews yet"
        /*
          22 words, under §12's 25, and it carries the two-sidedness the tabs
          would have carried: a review about you and a review by you are two
          different objects with two different authors. It states what this
          surface will HOLD rather than apologising for what it does not.
        */
        body="Reviews arrive after a stay ends: one from your host about you, one from you about the stay. Neither has happened yet."
        action={
          /*
            §12.4: exactly one action, naming the exact next step. `ga-101`'s
            "Written by you" empty names the same one — see your trips — and it
            is the right one for both halves, because a review is attached to a
            stay and `/trips/{id}/review` is where the composer lives. `/trips`
            is itself empty today and that is not a dead end: it names its own
            next step, which is a place to stay.

            The §5 gray-fill secondary, NOT a green pill. See the file header —
            this surface has no primary call, and the `/account` tree spends no
            brand green.
          */
          <Link href="/trips" className={btnSecondary}>
            Go to your trips
          </Link>
        }
      />

      {/*
        The paragraph that replaces the tab strip. Sentence one names the two
        halves the card gives two tabs, in the card's own order, so nothing is
        lost but the control. Sentence two is the two-way rule, worded to match
        `app/trips/[id]/review/step.tsx` and the listing page on purpose — one
        mechanism, one sentence, wherever it is stated.

        No day count on the reveal: §14 fixes 14 days to the PUBLIC-RESPONSE
        window only, the cards reuse the number for when a blind review is
        revealed, and no document sets that one. The composer already ships
        without it and this matches.

        No digits at all here, which is why nothing on this page needs `.num` or
        a `dir="auto"` isolate. The moment a date, a count or a window arrives on
        this surface, both do — and the isolate wraps the SENTENCE, never the
        number in it (`GO-LIVE` A17; `ListingPhrase` is the componentised form).

        THE HAIRLINE IS LOAD-BEARING, not decoration. `EmptyState` carries a
        deliberately generous bottom padding whose stated purpose is that "an
        action at the foot needs more room under it than the glyph needs above
        it, or the button reads as the start of whatever comes next" — and here
        something DOES come next, so the air is right and the boundary was
        missing. §4a's rule supplies it: sections are separated by a `border-top`
        hairline, never by a card (TASTE §1 puts content blocks in the "carries
        NEITHER" column). Same idiom `app/trips/[id]/review/page.tsx` already
        ships one screen away. Not a heading with it: this is one paragraph of
        context, and a heading over a single paragraph is chrome — which is also
        why the rule sits on a wrapper rather than on the `<p>`: `AccountSection`
        draws it across the whole 640 column with the 62ch measure held by the
        prose inside, and a rule that stopped at the text's measure would read as
        a ragged underline rather than as a boundary.
      */}
      <div className="border-t border-hairline pt-6">
        <p className="max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          This page will hold two lists: what hosts wrote about you after a stay, and what you wrote
          about the homes you stayed in. Reviews are two-way — yours and your host&rsquo;s stay
          hidden until you have both written one, then they appear together, so neither of you is
          writing in answer to the other.
        </p>
      </div>
    </>
  );
}
