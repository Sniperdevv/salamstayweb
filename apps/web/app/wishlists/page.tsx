import type { Metadata } from "next";
import Link from "next/link";

import { HeartIcon } from "@/components/icons";
import { btnPrimaryPill } from "@/components/ui";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMetadata } from "@/lib/seo/metadata";

import { TripPageHead } from "../trips/[id]/trip-chrome";

/**
 * `/wishlists` — GA-126 at web width, in `GUEST-SHELL.md` §4a's index frame.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PAGE RENDERS EMPTY. THAT IS THE STATE, NOT AN UNFINISHED BRANCH.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §12 names this surface in its opening sentence: *"No guest has a trip, a
 * message, **a wishlist**, a review, a receipt or a completed verification.
 * Empty is what every one of these surfaces renders on day one, so it is
 * specified first and built first, not folded in at the end."*
 *
 * There is no wishlist store — no auth, no saved-homes table, and
 * `components/stays/wishlist-heart.tsx` says so at the affordance itself: the
 * heart on every card in the product *navigates to sign-up rather than
 * toggling*, because *"a heart that filled in on click would be claiming a saved
 * list that does not exist."* Nothing has ever been saved by anybody, so a list
 * of lists here has nothing to read.
 *
 * A LIST IS A CLAIM ABOUT EVERYTHING THE READER HAS, which is why `ga-126`'s
 * populated panel cannot ship on this route. It draws two lists — *Islamabad —
 * August, 3 saved* and *Family trip ideas, 5 saved* — under a title that says
 * "Wishlists". Rendering that would tell a visitor who has never pressed a heart
 * that they have two lists and eight saved homes, and §14 lists exactly this
 * class of number among the fabrications: counts nothing can compute, about a
 * record nobody has.
 *
 * WHY THE ONE EXAMPLE LIST IS NOT LINKED FROM HERE
 * ------------------------------------------------
 * `/wishlists/islamabad-in-august` renders a worked example, labelled as one on
 * its own screen. It is deliberately absent from this page, and `/trips` settled
 * why for its identical pair: *"a sentence saying 'these four are examples'
 * under a heading that says 'Your trips' is a page arguing with itself."*
 * `/messages` then repeated the seam in the same shape. Three guest indexes, one
 * rule: **the index is the reader's own list and it is empty; the worked example
 * is a page that says what it is.**
 *
 * WHAT `ga-126` DRAWS THAT THIS DOES NOT SHIP, AND WHY
 * ----------------------------------------------------
 * §0.2 is load-bearing: the `ga-*` corpus predates `REPOSITIONING.md`, the sweep
 * has not run, and parts of this card are superseded by name.
 *
 *  · **The two list cards and their cover collages.** See above — and the
 *    covers' `3 saved` / `5 saved` counts are §14 numbers twice over.
 *  · **The brand-filled empty glyph.** `ga-126` draws `int-primary` on
 *    `int-subtle`; §8 corrects it outright — `text.secondary` on `bg.raised` —
 *    and gives the reason in full: on web the header avatar already spends a
 *    green, so a decorative glyph would be a fifth role, and TASTE §2 lists four
 *    of which "decorative glyph" is none. `EmptyState` bakes the correction in,
 *    so this page cannot get it wrong.
 *  · **The bottom tab bar.** §3: a *mobile* component, drawn inside a phone
 *    frame with a home-indicator safe area. Its five destinations already sit in
 *    the account menu the shared header ships, and a second persistent nav would
 *    put two navigations on one page for one set of destinations.
 *  · **`/explore` as the action's destination.** §1b.1 strikes the route — *"the
 *    guest's home on web is `/`"* — because shipping `/explore` would mint a
 *    second homepage canonicalising away from itself, the doorway shape
 *    SEO-RULES §6 penalises.
 *  · **No filter or tab strip.** §4a permits one; with one list and no rows in
 *    it, tabs are two ways to reach the same empty — the reasoning `/trips`,
 *    `/messages` and `/host/reservations` each already record.
 *  · **No `New wishlist` action.** `ga-103` (create/edit) has no registered
 *    route, G37 fails the build on an href that does not resolve, and a create
 *    control over a store that cannot keep what it creates is a dead end wearing
 *    a next step.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PRIVATE-vs-COLLABORATIVE CONTRADICTION: BUILT PRIVATE, AND SAID SO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md`'s **Unresolved** records it: *"`ga-126` says wishlists are
 * private with no 'public' affordance; `ga-095` draws a collaborative wishlist
 * with invitees. Both are `app+web`. The two cannot both be true and no later
 * ruling picks."*
 *
 * `ga-126` owns this route, so the private reading is what ships. **Nothing
 * here shares, invites or collaborates** — no Share control, no invitee row, no
 * avatar stack, no "public" toggle, on either wishlist surface.
 *
 * And the boundary is STATED rather than left to be inferred, which is §12's
 * own instruction: *"Where a boundary matters, the empty state restates it in
 * plain words rather than leaving the reader to infer it — `ga-097`'s empty
 * inbox restates the privacy boundary; that is the pattern, not an exception."*
 * The second clause of the sentence below is that restatement. It is not a
 * resolution of the contradiction — that needs an owner — it is this build
 * refusing to be silently ambiguous about which half it implemented.
 *
 * ROUTE CONTRACT (§2), none of it restated below: `noindex, follow` — from
 * `./layout.tsx` and again off the registry row here; no canonical; no hreflang;
 * no JSON-LD; no breadcrumb; `<main class="co-main">` from `./layout.tsx`;
 * exactly one `<h1>`, paired with the registered title for G43 — title `Your
 * wishlists — SalamStay`, `<h1>` `Your wishlists`.
 *
 * NO CLIENT BOUNDARY. Nothing on this page reads `SESSION_ACCOUNT` or any other
 * client-only fact, so there is no `"use client"` sibling and no split metadata
 * file. `lib/mode.ts` is unreadable on the server *and* on the first client
 * frame, and a Server Component that reached for it would render nothing at all
 * — the defect that shipped on `/account` this morning. The way not to have that
 * bug is not to need identity, and an empty state does not.
 *
 * MOTION: none. §11 — *"No entrance animation on a list the guest will
 * revisit"* — and the empty state stands where the list would.
 */
export const metadata: Metadata = pageMetadata("/wishlists");

export default function WishlistsPage() {
  return (
    <>
      {/*
        §4a's `.pagehead` heading is 26/600; the type scale has no 26 and `h4`
        (24) is the rung below it — the rung `TripPageHead` already fixes for
        every signed-in guest surface, so trips, messages and wishlists carry one
        heading size and the three indexes read as one product (§4b).

        Imported across the folder boundary rather than re-typed, per §15:
        *"These primitives exist and are the vocabulary. Adding a parallel one is
        the defect."* `app/trips/page.tsx` and `app/messages/page.tsx` both do
        the same, and both flag the same thing this does: the `Trip` prefix is
        wrong for guest-shell furniture and the hoist to
        `components/guest/guest-frame.tsx` belongs to whoever moves the tree.

        NO SUPPORT LINE. §4a allows one, but the empty state's own sentence
        already says what this surface will hold, and a page head that says it
        first makes the reader read it twice.
      */}
      <TripPageHead title="Your wishlists" />

      <EmptyState
        glyph={<HeartIcon className="size-7" />}
        title="Nothing saved yet"
        /*
          23 words, under §12's 25, doing the two jobs §12 asks of this sentence.

          It states what the surface will HOLD rather than apologising for what
          it does not (§12.2/§12.3), and it names the affordance EXACTLY — "the
          heart on its photo" is where `WishlistHeart` actually renders on every
          card in the product, top-right, over the image. §12.4's model is this
          card: *"not 'Browse', but tap the heart on any stay"*. "Tap" becomes
          "Save … with" here because this is the web build and a desktop reader
          does not tap; the instruction is the same one.

          Then it RESTATES THE PRIVACY BOUNDARY — see the contradiction note in
          the file header. This is the only place on either wishlist surface
          where privacy is mentioned, which is the point: it is stated once,
          plainly, where a first-time reader is standing, and never re-argued.
        */
        body="Save a home with the heart on its photo and it lands here. Wishlists are private: only you can see what you saved."
        action={
          /*
            §12.4: exactly one action, naming the exact next step. The body has
            already named the heart, so the button names where the hearts are.

            "Find a place to stay" is byte-shared with `/trips` and `/messages`:
            one label per intent across the guest shell, so a reader who has seen
            it once does not have to work out whether "Browse homes" is a
            different door. `ga-126`'s own action reads "Explore stays" and
            points at `/explore`; §1b.1 strikes that route.

            This is the surface's ONE primary CTA and therefore the one place
            brand green is spent here (§8 role 3, TASTE §2 role 3). §8 is
            explicit that on an empty state *"the green belongs on the one action
            the empty state exists to offer"*.

            `components/header-cta.ts` MUST gain `"/wishlists"` in
            `CTA_OWNED_BY_PAGE`, for the reason `/trips` and `/messages` each
            carry a row: `lib/mode.ts` opens at `pending`, so the SERVER render
            of this page draws the LOGGED-OUT header — a green Sign up beside
            this green pill, two primaries on one surface, §8's budget broken in
            the first frame. That file is outside this folder; it is reported
            rather than edited.

            `no-underline` because `btnPrimaryPill` is a button, and TASTE §8's
            underline-at-rest governs inline text actions, not filled controls.
          */
          <Link href="/" className={`${btnPrimaryPill} no-underline`}>
            Find a place to stay
          </Link>
        }
      />
    </>
  );
}
