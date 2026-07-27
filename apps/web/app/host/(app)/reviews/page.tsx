import type { Metadata } from "next";
import Link from "next/link";

import { iconStroke } from "@salamstay/design-tokens/icons";

import { HostEmpty } from "@/components/host/host-empty";
import { Num, Phrase } from "@/components/numerals";
import { btnSecondary, inlineAction } from "@/components/ui";

/**
 * `/host/reviews` — `HA-062` at web width, and `HA-077` is the page that is not
 * here.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THIS PRODUCT HAS ZERO REVIEWS. NOT AN EMPTY TABLE — NO TABLE.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * There is no review model, no review store, no review fixture and no rating
 * anywhere in this build. `/host/insights` already recorded the same fact when
 * it deleted `ha-066`'s "What guests mention" block outright:
 *
 *   > **This product has zero reviews.** Not a thin set, not an unrendered set:
 *   > no review model, no review route, no review fixture. […] Counting themes
 *   > across twenty reviews that do not exist is the same fabrication one layer
 *   > down.
 *
 * That page also names this route as one of the two `ha-066` links that "do not
 * exist". This is the file that changes that, and the honest version of it is a
 * single empty state. Everything below is subtraction, and the subtraction is
 * the deliverable.
 *
 * WHAT `ha-062` DRAWS THAT CANNOT SHIP
 * ------------------------------------
 *  · **Every review card.** Fatima's five stars, Ali Raza's four, Bilal Khan's,
 *    Sana Malik's — guests, ratings, category tracks, quoted sentences and
 *    stay dates, all written into a phone card as a populated future. A list is
 *    the sharpest case of the no-invention rule because a list is a claim about
 *    everything the reader has; `app/trips/page.tsx` states that argument in
 *    full and it transfers here without a word changed.
 *  · **The star rating in any aggregate or displayed form.** `GO-LIVE` §E calls
 *    a rendered rating "a fabricated rating in production", `/host/today`
 *    declined `ha-046`'s `4.9 · 128 reviews` for it, and the listing fixture
 *    says the same thing to guests in its own words: *"we never show a rating a
 *    home has not earned."* No average, no count, no breakdown, no "0 reviews".
 *  · **The listing filter chip row** (All listings · Gulberg 2 Residence ·
 *    Cantt View Residence · F-6 Studio). Chips that filter nothing are four
 *    ways to reach one empty — the reasoning `/host/reservations` recorded for
 *    its own first-run branch and `/trips` repeated for its.
 *  · **The `Awaiting your reply` / `Replied` chips and the `Respond publicly`
 *    action.** Both are per-review states; there are no reviews to be in one.
 *  · **"or after 14 days — whichever comes first".** The card attaches 14 to
 *    the REVEAL of a blind review. `GUEST-SHELL.md` §14 is precise that the
 *    14-day figure `DESIGN.md` §9-J sets is the PUBLIC-RESPONSE window and that
 *    "any other number is invented" — so the reveal ships without a day count,
 *    which is the shape the guest composer already ships
 *    (`app/trips/[id]/review/step.tsx`). The response window itself, below, is
 *    the sanctioned one.
 *  · **The Qibla / prayer-space sentence** in the card's quoted review.
 *    `REPOSITIONING.md` retires that vocabulary outright and `HOST-SHELL.md`
 *    §0.2 forbids carrying `ha-*` content forward without checking it. Moot
 *    here — the review it sits in is gone — but recorded so it is not restored
 *    with the first real review row.
 *
 * `HA-077` — RESPOND TO A REVIEW — IS DELIBERATELY NOT A ROUTE
 * ------------------------------------------------------------
 * `ha-077` is a composer for a public reply to Fatima's review of Gulberg 2
 * Residence. There is no Fatima's review. A reply composer for a review nobody
 * wrote is the same object as the five-star composer for a stay nobody took,
 * one step further removed: the guest composer at least stands on a real
 * booking with a real check-out date to gate on, so `/trips/{id}/review` could
 * ship a date gate and be a true page in both branches. Here there is no record
 * and no date that would ever open one.
 *
 * A `/host/reviews/{id}/respond` folder whose only behaviour is `notFound()`
 * was considered and rejected: it reimplements what Next already does for an
 * unmatched path, and a route file is itself a claim that a surface exists.
 * `GUEST-SHELL.md` §12's cold-deep-link rule — *"a surface keyed to a record
 * that does not exist refuses to render"* — presumes the surface is real for
 * records that ARE real, and none can be here.
 *
 * What survives from `ha-077` is the one sentence in it that is a fact about
 * the product rather than about a review: the public-response window, stated
 * with `DESIGN.md` §9-J's figure. It is in the closing paragraph, phrased as a
 * mechanism ("stays open for 14 days") rather than as an offer, because a page
 * with nothing to reply to must not read as an invitation to reply now. Also
 * cut with the composer: the three-line reply guidance (real advice, but advice
 * about writing a reply nobody can write), the 700-character counter, and the
 * flag affordance — flagging a review needs a review and a report route, and
 * neither exists.
 *
 * NO `SampleDataStrip`. `/host/insights` set the test and this page passes it
 * the same way: the strip stands between a host and reading written-in figures
 * as their own, and this page shows no figure, no guest, no date and no rating.
 * A disclaimer about content that is not on the page would imply the reviews it
 * disclaims. The day a real review lands here, the strip lands with it.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1, not restated): `robots: noindex, follow`
 * from `app/host/layout.tsx`; no canonical, no hreflang, no JSON-LD, no
 * breadcrumb; `<main class="co-main">` from `HostAppShell` via the `(app)`
 * route group, so this file draws no chrome.
 *
 * THE METADATA TRAP NEVER OPENS. The page holds no state — no chips, no tabs,
 * no composer — so it follows `/host/earnings` and `/host/insights`: one Server
 * Component with `metadata` declared here, not a thin wrapper over a
 * `"use client"` sibling. G41 is a HARD gate comparing the served `<title>` to
 * the registry byte for byte and rejecting duplicates across a run; the string
 * below is the one this route asks to be registered under, and it is written
 * out rather than read through `pageMetadata` because that helper throws on a
 * path the registry does not yet carry and the registry is edited centrally.
 *
 * ONE `<h1>`: "Reviews from guests". Named in that direction on purpose — this
 * surface is only what guests wrote about the host's homes (`ha-062`: *"only
 * Aqib's own received reviews"*), and unlike the six sections in the nav one
 * row up, nothing in the chrome says where the host is, because reviews is not
 * one of `HOST-SHELL.md` §2b's six tabs. At the `h5` rung, the rung every
 * sibling section heading takes.
 *
 * GREEN: none. `HOST-SHELL.md` §7 rules the host app surface already over
 * TASTE §2's four-role budget through `ha-046`'s inherited chip, nav underline
 * and avatar, and says what to do about it — **"Add nothing to it."** So the
 * actions are the §5 gray-fill secondary and the §8 inline action beside it, a
 * ranked pair rather than two plates of equal weight. Because the body spends
 * no green, this route does NOT belong in `host-nav.tsx`'s `CTA_OWNED_BY_PAGE`:
 * the nav's `Create a listing` keeps its green here, correctly.
 */
export const metadata: Metadata = {
  title: { absolute: "Reviews from guests — SalamStay hosting" },
};

/**
 * The section's mark: **one outline star, and it is not a rating.**
 *
 * A star on a page whose whole argument is that no rating exists deserves the
 * justification TASTE §11.4 asks for, so here it is. `/host/insights` states
 * the governing principle for an empty section's glyph — *"It names the
 * SECTION, not the missing content: a bar chart is what 'Insights' is about […]
 * It promises no chart"* — and a star is what "Reviews" is about in the same
 * way. A rating is five of these in a row with some of them filled; this is one
 * of them, alone, in a 48px disc, above a heading that says there are none.
 *
 * The alternative considered was `ha-062`'s speech bubble, which is also the
 * card's own empty glyph. It was rejected because a bubble reads as "messages"
 * first, and `/host/messages` is a real adjacent destination on this side of
 * the product — a mark that sends a host to the wrong surface costs more than
 * the one it saves.
 *
 * **Outline, ink, never gold, never filled.** TASTE §11.4 supersedes
 * `ga-101`/`ga-131`'s `--warning-fg` amber; §11.3 sanctions the SOLID star as a
 * meaningful mark, and this is not that — it is an ordinary outline glyph at
 * the ordinary thin stroke, taking its colour from `HostEmpty`'s
 * `text.tertiary` disc like every other empty-state glyph on this side.
 *
 * The path is `ga-101`'s own. Drawn here rather than imported for the reason
 * `/host/insights` records for `InsightsGlyph`: the three shared glyph modules
 * are each a closed set with a stated scope, and `components/icons.tsx` is
 * chrome-shared and owned elsewhere in this wave. `app/account/profile/reviews`
 * draws the twin of this function against the same path — merge candidate,
 * flagged, the moment someone owns a shared guest/host glyph module.
 *
 * Decorative: it always sits above a real heading, so `aria-hidden`.
 */
function StarOutlineGlyph({ className }: { readonly className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={iconStroke.thin}
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

export default function HostReviewsPage() {
  return (
    <>
      <h1 className="text-h5 font-semibold text-primary">Reviews from guests</h1>

      <HostEmpty
        className="mt-4"
        glyph={<StarOutlineGlyph className="size-6" />}
        title="No reviews yet"
        /*
         * `HostEmpty`'s three rules, checked: never a count of nothing (no
         * count appears at all — not "0 reviews", not a rating at zero), never
         * a dead end (both actions below render), never an apology.
         *
         * The subject is SalamStay, not this host. `/host/insights` drew the
         * distinction and it is the whole copy here too: the blocker is not
         * that the host has been reviewed badly or not at all, it is that the
         * product holds no reviews, so a sentence about the host's record would
         * be both untrue and insulting to an account with a guest checked in.
         * 24 words, three lines at the component's 46ch measure.
         */
        body="Guests write a review once a stay has ended, and SalamStay holds none yet — so there is nothing here to read, and nothing waiting on you."
        actions={
          /*
           * The ranked pair `/host/insights` and `/host/earnings` both ship: the
           * §5 gray-fill secondary, then the §8 inline action beside it. No
           * green (see the file header).
           *
           * Reservations first because a review is downstream of a completed
           * stay and that is the surface holding the stays; messages second
           * because until a review exists it is the only channel on this build
           * where a guest actually says anything to a host. Both routes render.
           */
          <>
            <Link href="/host/reservations" className={btnSecondary}>
              See your reservations
            </Link>
            <Link href="/host/messages" className={`${inlineAction} text-bodySm`}>
              Go to your messages
            </Link>
          </>
        }
      />

      {/*
        The one paragraph on the page, doing the job `/host/earnings` and
        `/host/insights` both give their closing sentence: reconciling what the
        host came looking for with what is here, so nobody has to work it out.

        It is also where `ha-077` survives. Sentence two is the two-way rule,
        worded to match `app/trips/[id]/review/step.tsx` and the listing page
        deliberately — one mechanism, one sentence, both sides of the loop.
        Sentence three is `DESIGN.md` §9-J's public-response window, the one
        number `GUEST-SHELL.md` §14 permits on a review surface, phrased as a
        fact about how a reply works rather than as an offer to write one now.

        `text.secondary`, not tertiary: this is prose a host is expected to read
        (`components/ui.ts` records the distinction, and the tertiary ramp is
        under AA review at body sizes — `GO-LIVE` C7).

        RTL: the only digit run on this page is the `14`, and it sits inside a
        `dir="auto"` isolate that wraps its whole SENTENCE. `GO-LIVE` A17 is
        exact about why the isolate cannot wrap the number alone — a bare `.num`
        run reorders past the English words beside it, which is what gave
        `/host/calendar` "2026 August" and the listing status page "Gulberg 2
        Residence Status of". `ListingPhrase` is the componentised form of the
        same fix; one sentence with one number does not need the component, but
        it needs the rule.
      */}
      <p className="mt-8 max-w-[68ch] text-bodySm font-regular leading-relaxed text-secondary">
        Every review a guest writes about one of your homes will arrive here, beside the stay it
        came from. Reviews are two-way: yours and the guest&rsquo;s stay hidden until you have both
        written one, then they appear together, so neither of you is writing in answer to the other.{" "}
        <Phrase>
          When one arrives, your public reply to it stays open for <Num>14</Num> days.
        </Phrase>
      </p>
    </>
  );
}
