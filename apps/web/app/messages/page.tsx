import type { Metadata } from "next";
import Link from "next/link";

import { MessageIcon } from "@/components/icons";
import { btnPrimaryPill } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo/metadata";

import { MessagesMain } from "./messages-chrome";
import { TripPageHead } from "../trips/[id]/trip-chrome";

/**
 * `/messages` — GA-097 at web width, in `GUEST-SHELL.md` §4a's index frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PAGE RENDERS EMPTY. THAT IS THE STATE, NOT AN UNFINISHED BRANCH.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §12 opens on this exact page: *"**No guest has a trip, a message**, a
 * wishlist, a review, a receipt or a completed verification. Empty is what every
 * one of these surfaces renders on day one, so it is specified first and built
 * first, not folded in at the end."*
 *
 * There is no message store — no auth, no threads table, no transport. So this
 * page has nothing to read, and §14 names this card among the ones whose
 * populated draw is a fabrication until a record exists. `ga-097`'s list panel
 * draws four threads: two unread, one mid-request, one from a stay two weeks
 * ago. Rendering that here would tell a visitor who has never messaged anybody
 * that four people are waiting on them, one of whom they have already stayed
 * with. It also drags in three of §14's named inventions at once — unread counts
 * nothing can compute, a `Request sent` state `BUILD-DECISIONS.md` #10 rules out
 * of existence, and a "2 weeks ago" that is a claim about a past nobody has.
 *
 * WHY THE ONE REAL THREAD IS NOT LISTED HERE
 * ------------------------------------------
 * `/messages/host-margalla-view` renders a real conversation — the example
 * booking's, labelled as an example on its own screen. It is deliberately absent
 * from this list, and `app/trips/page.tsx` already settled why for its identical
 * pair: *"a sentence saying 'these are examples' under a heading that says 'Your
 * trips' is a page arguing with itself."* A list is a claim about everything the
 * reader has; a worked example is a page that says what it is. `/trips` is empty
 * while `/trips/is-f7-2bed-aug2026` renders, and this is the same seam in the
 * same shape, so the two surfaces cannot teach a reader two different things.
 *
 * WHAT `ga-097` DRAWS THAT THIS DOES NOT SHIP, AND WHY
 * ----------------------------------------------------
 * §0.2 is load-bearing: the card predates `REPOSITIONING.md`, the `ga-*` sweep
 * has not run, and parts of it are superseded by name.
 *
 *  · **The All / Unread / Requests filter strip.** §4a permits one; with one
 *    list and no rows in it, tabs are three ways to reach the same empty — the
 *    reasoning `/trips` and `/host/reservations` each already record. `Requests`
 *    is struck outright regardless: §1d, *"Request-to-book is not built …
 *    `/trips/requests*` stays a `stub()`; do not design the request lifecycle on
 *    web."* And `Unread` needs a count nothing can compute (§14).
 *  · **The `Request sent` chip and its brand-subtle accent.** §6 rules it moot
 *    rather than resolved: Instant Book only, so the state does not exist.
 *  · **The search action in the title bar.** `/messages/search` (`ga-096`) is
 *    not in `lib/seo/route-registry.ts`, and G37 fails the build on an href that
 *    does not resolve. A search control over zero conversations would be a
 *    control that describes nothing either way.
 *  · **The `⋯` row menu** (Report a problem, Block, Mark as unread). Its two
 *    destinations are unregistered, its third needs a store, and there is no row
 *    to hang it off. Safety entry points matter and they are not being quietly
 *    dropped — they are unbuilt, and `ga-132`/`ga-133` are their cards.
 *  · **The bottom tab bar.** §3: a *mobile* component, drawn in a phone frame
 *    with a home-indicator safe area. Its five destinations already sit in the
 *    account menu the shared header ships.
 *  · **The brand-filled empty glyph.** §8 corrects the card outright: the disc
 *    is `text.secondary` on `bg.raised`, because TASTE §2 lists four roles for
 *    brand green and a decorative glyph is none of them.
 *
 * ROUTE CONTRACT (§2), none of it restated below: `noindex, follow` — from
 * `./layout.tsx` and again off the registry row here; no canonical; no hreflang;
 * no JSON-LD; no breadcrumb; `<main class="co-main">` from `MessagesMain`;
 * exactly one `<h1>`, paired with the registered title for G43 — title `Your
 * messages — SalamStay`, `<h1>` `Your messages`.
 *
 * MOTION: none. §11 — *"No entrance animation on a list the guest will
 * revisit"* — and the empty state stands where the list would.
 */
export const metadata: Metadata = pageMetadata("/messages");

export default function MessagesPage() {
  return (
    <MessagesMain>
      {/*
        §4a's `.pagehead` heading is 26/600; the type scale has no 26 and `h4`
        (24) is the rung below it — the rung `TripPageHead` already fixes for
        every signed-in guest surface, so the inbox and the thread it opens carry
        one heading size.

        NO SUPPORT LINE. §4a allows one, but the empty state's own sentence
        already says what this surface will hold, and a page head that says it
        first makes the reader read it twice.
      */}
      <TripPageHead title="Your messages" />

      <EmptyState
        glyph={<MessageIcon className="size-7" />}
        title="No messages yet"
        /*
          24 words, under §12's 25. Two jobs in one sentence, both required.

          It states what this surface will HOLD rather than apologising for what
          it does not — §12.2/§12.3.

          And it RESTATES THE PRIVACY BOUNDARY, which §12 asks for by name:
          *"Where a boundary matters, the empty state restates it in plain words
          rather than leaving the reader to infer it — `ga-097`'s empty inbox
          restates the privacy boundary; that is the pattern, not an
          exception."*

          The card's own sentence is GA-061's and it cannot ship as drawn: it
          hangs the promise on a booking REQUEST, and #10 rules Instant Book
          only, so the half of the sentence that carries the guarantee describes
          a state the web product does not have. What survives is the fact the
          boundary rests on and the one this build can actually stand behind —
          conversations happen inside SalamStay — phrased so it claims a design,
          not a mechanism nobody has written. "Messages stay inside SalamStay" is
          byte-shared with the confirmation's own row
          (`app/book/[slug]/confirmation/step.tsx`), so one product does not
          describe one boundary two ways.
        */
        body="When you ask a host about their home, the conversation lands here. Messages stay inside SalamStay, so a host never needs your phone number."
        action={
          /*
            §12.4: exactly one action, naming the exact next step.

            `ga-126` is §12's model — *not "Browse", but tap the heart on any
            stay* — and the honest reading of it here is the reason this says
            "Find a place to stay" and not "Message a host": there is no
            `Message the host` control on a listing page today, and an empty
            state that names a button nobody has written is a dead end wearing a
            next step. Browsing IS the first move, so that is what it says.

            `ga-097`'s own action points at `/explore`; §1b.1 strikes that route
            — the guest's home on web is `/`, and shipping `/explore` would mint
            a second homepage canonicalising away from itself.

            This is the surface's ONE primary CTA and therefore the one place
            brand green is spent (§8 role 3, TASTE §2 role 3). §8 is explicit
            that an empty state is where that green belongs. `header-cta.ts` must
            demote the header's Sign up on this route — see `messages-chrome.tsx`.

            `no-underline` because `btnPrimaryPill` is a button, and TASTE §8's
            underline-at-rest governs inline text actions, not filled controls.
          */
          <Link href="/" className={`${btnPrimaryPill} no-underline`}>
            Find a place to stay
          </Link>
        }
      />
    </MessagesMain>
  );
}
