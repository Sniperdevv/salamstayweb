import { CANONICAL } from "@/components/booking/post-flow";

/**
 * The one conversation this build has, written out — and the guard that stops
 * any other id borrowing it.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THIS IS A FIXTURE AND EVERY SCREEN THAT RENDERS IT SAYS SO
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `GUEST-SHELL.md` §14 lists `ga-097`/`ga-098` against *"response times, 'usually
 * replies within…', read receipts, any SLA"* and §12 lifts `GO-LIVE` A11 into a
 * hard rule for anything keyed to a record. There is no message store, so this
 * file is not data — it is the worked example the confirmation, the trip page
 * and the review screen all link, kept in one place so four surfaces cannot
 * describe one conversation four ways. `ExampleBookingStrip` renders that fact
 * on screen, in the page, not in this comment.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHY THESE FOUR MESSAGES AND NOT `ga-098`'s
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * §0.2: the card predates `REPOSITIONING.md` and the `ga-*` sweep has not run,
 * so its content is checked line by line rather than copied forward.
 *
 *  · **The opening request note is gone.** `ga-098` opens on GA-061's
 *    request-to-book message and titles the thread *Request sent*.
 *    `BUILD-DECISIONS.md` #10 rules Instant Book only on web, so there is no
 *    request stage to open on. The thread opens on a CONFIRMED booking, which is
 *    the card's own panel C.
 *  · **The masjid question is gone.** §1c: masjid distance is not modelled, and
 *    `REPOSITIONING.md` retires it from the product outright.
 *  · **The load-shedding exchange is gone.** Claim 7 is the flagship and §14
 *    says the no-invented-stats rule bites hardest exactly there: backup runtime
 *    the host has not supplied is *"never estimated, rounded up, or inherited
 *    from a nearby listing"*. This host has supplied hers on the listing page;
 *    restating it inside a scripted conversation would put the same disclosure
 *    in two places with one of them unmaintained.
 *  · **Parking is gone.** The card's host offers *"parking for one car inside
 *    the gate"*. `lib/content/listings/is-f7-2bed.ts` publishes no parking
 *    amenity, so that sentence would be this file inventing a fact about a home
 *    — the plainest form of what §14 forbids.
 *  · **What is left is the arrival exchange**, and every claim in it traces to
 *    the listing's own published house rule: *"Check-in after 2:00 PM ·
 *    Check-out before 11:00 AM"*. Nothing here asserts anything about the home
 *    that a reader cannot go and check.
 *  · **No per-message `Sent` / delivered mark.** `ga-098` draws one. Nothing was
 *    sent, and a delivery mark is one step from the read receipts §14 bans by
 *    name. The time is the only meta a bubble carries.
 *  · **No translate control.** The card's one-tap translation is first-class and
 *    symmetric and there is no translation service behind this build; a control
 *    that does nothing is worse than an absent one. Ayesha writes in Urdu and it
 *    is rendered as Urdu, which is §6's actual requirement.
 */

/**
 * The registered thread id, and the one this file answers for.
 *
 * `GUEST-SHELL.md` Unresolved is explicit that *"the real shape of a … thread id
 * is a backend decision"* and that the registry hard-codes the card's fixture
 * because G37 compares literal hrefs. Three shipped surfaces already point here:
 * `app/book/[slug]/confirmation/step.tsx`, `app/trips/[id]/page.tsx` and
 * `app/trips/[id]/review/*`.
 */
export const THREAD_ID = "host-margalla-view";

/** §12's guard, as a predicate. A route calls `notFound()` on `false`. */
export function isThreadId(id: string): boolean {
  return id === THREAD_ID;
}

/** One place the path is spelled. */
export function threadPath(): string {
  return `/messages/${THREAD_ID}`;
}

/**
 * The day the conversation happened.
 *
 * `CANONICAL.paidOn` — the booking's own confirmation date — rather than a
 * literal, and emphatically rather than "Today". `ga-098` draws `Today`, which
 * on a fixture is a claim computed against a clock this page does not read: it
 * is true on the day it is written and a lie every day after. §7's *"proximity
 * is a fact, not a counter"* permits a sentence computed at render; it does not
 * ask for one, and there is no record here to compute against.
 */
export const THREAD_DAY = CANONICAL.paidOn;

export interface ThreadMessage {
  readonly id: string;
  /** `guest` sits on the trailing edge, `host` on the leading one (§6). */
  readonly from: "guest" | "host";
  /**
   * The script this message was written in.
   *
   * §6: *"An Urdu bubble renders **natively RTL in Nastaliq inside an LTR
   * thread**, and an English bubble LTR inside an Urdu thread — each snippet
   * aligns to its own script."* This field is what makes that true rather than
   * something the author remembered on three of four bubbles.
   */
  readonly lang: "en" | "ur";
  readonly body: string;
  /** Clock time as read in Pakistan. Isolated through `.num` at render. */
  readonly time: string;
}

export const THREAD: readonly ThreadMessage[] = [
  {
    id: "m1",
    from: "guest",
    lang: "en",
    body: "As-salamu alaikum Ayesha. We reach Islamabad on Friday afternoon and should be at the building by 4 PM. Is that all right for check-in?",
    time: "4:02 PM",
  },
  {
    id: "m2",
    from: "host",
    lang: "ur",
    // "Wa alaikum assalam! Absolutely. Check-in can be any time after 2 PM, so
    // 4 o'clock is completely fine." — the listing's own published house rule,
    // in the host's own language.
    body: "وعلیکم السلام! جی بالکل۔ چیک اِن دوپہر 2 بجے کے بعد کبھی بھی ہو سکتا ہے، اِس لیے 4 بجے بالکل ٹھیک ہے۔",
    time: "4:26 PM",
  },
  {
    id: "m3",
    from: "guest",
    lang: "en",
    body: "Shukriya. We'll message when we set off from Rawalpindi, so you know roughly when to expect us.",
    time: "4:31 PM",
  },
  {
    id: "m4",
    from: "host",
    lang: "ur",
    // "Alright, very good. See you on Friday."
    body: "ٹھیک ہے، بہت اچھا۔ جمعہ کو ملاقات ہوگی۔",
    time: "6:12 PM",
  },
];
