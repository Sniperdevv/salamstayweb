import type { Metadata } from "next";
import Link from "next/link";

import { MessageIcon } from "@/components/icons";
import { HostEmpty } from "@/components/host/host-empty";
import { btnSecondary } from "@/components/ui";

/**
 * `/host/messages` — HA-052 at web width.
 *
 * The surface that closes the hole the guest side opened this morning: a guest
 * can write to a host at `/messages/host-margalla-view`, and until this folder
 * existed the host had nowhere the words could land. Nothing here can send a
 * reply — there is no transport — but a product where one side has an inbox and
 * the other has no such page at all is a product that has decided hosts do not
 * read.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE PAGE RENDERS EMPTY. THAT IS THE STATE, NOT AN UNFINISHED BRANCH.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * There is no message store — no auth, no host account, no threads table, no
 * transport. So this page has nothing to read, and `HOST-SHELL.md` §0.2 puts the
 * `ha-052` card's populated draw out of reach besides: its list panel ships four
 * threads across three homes, two of them unread, one mid-request, with a
 * `2` on the Unread filter and a `1` on Requests. Rendering that would tell a
 * host who has never been messaged that four people are waiting on them, and it
 * would do it with three separately-forbidden inventions at once — **unread
 * counts nothing can compute**, a **`Request` state** `BUILD-DECISIONS.md` #10
 * rules out of existence on web, and a **`Thu` / `Yesterday`** relative stamp,
 * which is a claim computed against a clock this page does not read
 * (`../reservations/reservations.ts` records the same ruling for
 * `respondBy`: absolute, never relative).
 *
 * `/host/today` and `/host/listings` already ship their first-run empties, and
 * `hw-007` names the reason in one line: *"calm, one next step, never a zero
 * shouted at anyone."* An inbox is the third.
 *
 * WHY THE ONE REAL THREAD IS NOT LISTED HERE
 * ------------------------------------------
 * `/host/messages/host-margalla-view` renders a real conversation, labelled as a
 * worked example on its own screen. It is deliberately absent from this list,
 * and `app/trips/page.tsx` settled why for the identical guest pair: *"a
 * sentence saying 'these are examples' under a heading that says 'Your trips' is
 * a page arguing with itself."* **A list is a claim about everything the reader
 * has; a worked example is a page that says what it is.** `/messages` is empty
 * while `/messages/host-margalla-view` renders, and this is the same seam in the
 * same shape — which is what stops the two sides of the product teaching a
 * reader two different things.
 *
 * It is also the only reading that survives the accounts. `lib/mode.ts` fixes
 * the signed-in person as Aqib Khan and `../reservations/reservations.ts` gives
 * that account Gulberg 2 Residence and Cantt View Residence; the conversation
 * belongs to Margalla View Apartment, hosted by Ayesha. Listing it as a row
 * under "Your messages" would assert it is this host's, which it is not.
 *
 * WHAT ELSE `ha-052` DRAWS THAT THIS DOES NOT SHIP
 * ------------------------------------------------
 *  · **The All / Unread / Requests filter strip.** With one list and no rows in
 *    it, three tabs are three ways to reach the same empty — the reasoning
 *    `/host/reservations` already records when it drops its own four tabs on the
 *    first-run branch: *"four empty states is not an empty state, it is a broken
 *    one."* `Requests` is struck regardless (#10), and `Unread` needs a count
 *    nothing can compute.
 *  · **The unread dot, the bolded unread row and the unread accessible name.**
 *    `ha-052` carries unread three ways at once, which is the right design and
 *    needs a read state to be right about.
 *  · **The listing chip and the status chip on a row.** Both are correct
 *    grammar — `ListingChip` and `StatusChip` already ship in
 *    `../reservations/reservation-parts.tsx` — and both need a row.
 *  · **The search action in the title bar.** `/host/messages/search` is not in
 *    `lib/seo/route-registry.ts`, and G37 fails the build on an href that does
 *    not resolve. A search control over zero conversations describes nothing
 *    either way.
 *  · **The `⋯` row menu** (View the request, Mark as unread, Report a problem,
 *    Block). Its two safety destinations are `ga-132` / `ga-133`, neither
 *    registered nor built; `Mark as unread` needs a store; and there is no row
 *    to hang the menu off. Reporting and blocking are boundaries that matter and
 *    they are unbuilt, not quietly dropped.
 *  · **The bottom tab bar.** §2b: a *mobile* component, drawn in a phone frame
 *    with a home-indicator safe area. The web shell's section nav is one row up.
 *  · **The brand-filled avatar disc and the brand unread dot.** §7: the app
 *    surface is already over TASTE §2's budget through `ha-046`'s own language,
 *    and the ruling is **"Add nothing to it."**
 *
 * NO SAMPLE-DATA STRIP ON THIS BRANCH. `/host/reservations` states the rule when
 * it renders `SampleDataStrip` only beside its fixture: *"the empty branch above
 * has nothing to be honest about."* An empty inbox invents nothing, so there is
 * nothing for a strip to qualify — the same call `/host/insights` makes.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1), none of it restated below: `noindex,
 * follow` from `app/host/layout.tsx`; no canonical; no hreflang; no JSON-LD; no
 * breadcrumb; `<main class="co-main">` from `HostAppShell`; exactly one `<h1>`.
 * The title is written out rather than read through `pageMetadata` because that
 * helper throws on a path the registry does not carry yet, and the registry is
 * updated centrally — the same shape `/host/today`, `/host/listings` and
 * `/host/reservations` each use.
 *
 * MOTION: none. `HOST-SHELL.md` §10 — no entrance animation on a surface the
 * host will revisit — and an inbox is revisited more than anything else here.
 */
export const metadata: Metadata = {
  title: { absolute: "Your messages — SalamStay hosting" },
};

export default function HostMessagesPage() {
  return (
    <>
      {/*
        `h5`, matching `Your listings` and `Your reservations`: the section nav
        one row above already states where the host is, so this heading names the
        region rather than shouting a page title at a surface that has one. The
        thread underneath takes `h4`, because "Messages" in a nav does not tell
        you which conversation.
      */}
      <h1 className="text-h5 font-semibold text-primary">Your messages</h1>

      <HostEmpty
        className="mt-4"
        glyph={<MessageIcon className="size-6" />}
        title="No messages yet"
        /*
          Two jobs in one body, both required.

          It states what this surface will HOLD rather than apologising for what
          it does not (`hw-007`'s "never a zero shouted at anyone").

          And it RESTATES THE PRIVACY BOUNDARY, which is `ha-052`'s own reason
          for existing — the card puts *"Phone numbers stay private until a
          booking is confirmed"* above the list as the host mirror of `ga-061`.
          That exact sentence cannot ship: it hangs the guarantee on a booking
          REQUEST stage, and #10 rules Instant Book only on web, so the half of
          the sentence carrying the promise describes a state this product does
          not have. What survives is the design the boundary rests on — the
          conversation happens inside SalamStay — said from the host's side.
          `app/messages/page.tsx` says the guest's half as "Messages stay inside
          SalamStay, so a host never needs your phone number", and this is the
          same fact turned around, so one product does not describe one boundary
          two ways.

          `../reservations/[id]/detail.tsx` already ships the request-stage form
          of it — "Contact details stay private until the booking is confirmed" —
          on the one surface where a request genuinely exists. Neither sentence
          contradicts the other; each is said where it is true.
        */
        body="When a guest writes to you about one of your homes, the conversation lands here. Messages stay inside SalamStay, so you never have to give out your phone number."
        actions={
          /*
            ONE next step, naming the exact one — and it is the honest
            destination rather than the obvious one.

            `ha-052`'s empty points at `See your reservations`, and on web that
            is right for a second reason the card did not have: a conversation
            here starts from a booking, and `/host/reservations` is the built,
            registered surface where a host's bookings actually are. The obvious
            alternative — "Create a listing" — would assert this account has no
            listing, which this route cannot know, and would duplicate the nav's
            own CTA.

            NO GREEN ON THIS PAGE. TASTE §2 role 3 is ONE primary CTA per
            surface, and on `/host/*` that role is spent by the section nav's
            `＋ Create a listing` unless the route is on `host-nav.tsx`'s yield
            list. `/host/messages` is not on it and a page cannot ask to be at
            runtime, so a green primary here would be the second green on screen
            — the exact duplicate `hw-007` panel E exists to correct. The §5
            gray-fill secondary instead, which is the same resolution
            `/host/reservations`'s own empty reached ("Go to your listings").

            `no-underline` because `btnSecondary` is a button: TASTE §8's
            underline-at-rest governs inline text actions, not filled controls.
          */
          <Link href="/host/reservations" className={`${btnSecondary} no-underline`}>
            See your reservations
          </Link>
        }
      />
    </>
  );
}
