import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActionList, ActionRow } from "@/components/booking/post-flow";
import { CalendarIcon } from "@/components/icons";
import { Num, Phrase } from "@/components/numerals";
import { GUEST_STUB_LINKS, RegistryStub, stubMetadata } from "@/components/registry-stub";
import { inlineAction } from "@/components/ui";
import { TRIP, formatStayRange, tripPath } from "@/lib/booking/trip-record";
import { pageMetadata } from "@/lib/seo/metadata";
import { routeByPath } from "@/lib/seo/route-registry";

import { Composer } from "./composer";
import { THREAD, THREAD_DAY, isThreadId, threadPath } from "./thread";
import { ConfirmedChip, MessagesMain } from "../messages-chrome";
import {
  ExampleBookingStrip,
  TripBackLink,
  TripPageHead,
  TripSection,
} from "../../trips/[id]/trip-chrome";

/**
 * GA-098 — `/messages/{threadId}`, one conversation, at web width.
 *
 * `GUEST-SHELL.md` §4b's detail frame in ONE column: `.backrow` → `.pagehead` →
 * labelled `<section>`s. §4 settles the shape of this route outright —
 * *"**Messages is two pages, not a split pane.** `/messages` is 4a,
 * `/messages/{id}` is 4b. The corpus draws two screens and the registry reserves
 * two routes. A desktop two-pane inbox is drawn nowhere — see Unresolved."* So
 * there is no split pane here, and building one would be answering a product
 * question the contract deliberately left open.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE ROUTING SHADOW THIS FILE CASTS, AND THE THREE LINES THAT CANCEL IT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `app/[...registered]/page.tsx` is the LEAST specific route in the tree, so
 * every dynamic segment added above it takes paths away from it — silently, and
 * in a way no gate reports, because `validate-pages --all` fetches only routes
 * whose status is `page`. `components/registry-stub.tsx` was written the day
 * `app/trips/[id]/page.tsx` did this to `/trips/requests`, and its comment names
 * this file as the next one: *"The same collision is waiting for
 * `/messages/[threadId]` over `/messages/search`."*
 *
 * So the id guard has three outcomes, not two, and the order matters:
 *
 *  1. **The thread id** → the conversation below.
 *  2. **A registered STUB id** → that stub's "being written" body, exactly what
 *     `app/[...registered]/page.tsx` would have served. `/messages/search`
 *     (`ga-096`) is the case this is written for; anything else registered under
 *     `/messages/` later — `report`, `block`, `attach` — is covered the same day
 *     it is registered, with no edit here.
 *  3. **Anything else** → 404. §12 lifts `GO-LIVE` A11 into a hard rule: *"A
 *     surface keyed to a record that does not exist **refuses to render** — 404,
 *     or a redirect to its index. It never renders a fixture."* Asked on the
 *     SERVER, in both `generateMetadata` and the route body, so an unknown id
 *     never emits a byte of conversation — no flash, nothing for a client guard
 *     to undo.
 *
 * The stub branch is not this file designing `/messages/search`. §1a lists that
 * route and `ga-096` is its card; it is the page that URL already served,
 * still being served.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ga-098` DRAWS THAT THIS DOES NOT SHIP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The content cuts and their grounds are recorded per message in `thread.ts`.
 * The chrome cuts:
 *
 *  · **The `Request sent` header state and the whole request stage.** §6 and
 *    §1d: Instant Book only, so it does not exist on web.
 *  · **The one-tap translation bar, the per-message toggle and the mirrored
 *    "this is what Ayesha receives" bubble.** There is no translation service.
 *    A first-class, symmetric translation is the right feature and it is
 *    unbuilt; a toggle that does nothing is the thing this whole screen is
 *    written to avoid.
 *  · **The offline banner and the `Will send` queue chip.** §12 lists offline as
 *    a register every surface ships, and it is honest only where there is
 *    something to queue. With no transport, a "we'll send it when you're back
 *    online" promise is the same lie as a working Send.
 *  · **The `⋯` sheet** — translate, view the stay, Report a problem
 *    (`ga-132`), Block (`ga-133`). *View the stay* survives as a real row below;
 *    the other three have no registered route and no store. Blocking and
 *    reporting are boundaries that matter and they are unbuilt, not dropped.
 *  · **The attachment control.** `/messages/{id}/attach` is unregistered, and
 *    G37 fails the build on an href that does not resolve.
 *  · **The phone-number system caption.** `ga-098` writes *"Your phone number is
 *    now shared with Ayesha, as stated when you sent the request"* — a mechanism
 *    nothing implements, hung on a request stage that does not exist.
 *  · **A response time, "usually replies within…", a read receipt, an online
 *    dot, a typing indicator, a host rating.** §14, by name.
 *
 * ROUTE CONTRACT (§2), none of it restated below: `noindex, follow` — from
 * `../layout.tsx` and again off the registry row; no canonical; no hreflang; no
 * JSON-LD; no breadcrumb; `<main class="co-main">` from `MessagesMain`; exactly
 * one `<h1>`, paired with the registered title for G43.
 *
 * REGISTRY (central edit, not made here): this path is a `stub()` today and its
 * title still reads *"Message your host — Margalla View Apartment"*, which is an
 * instruction rather than the name of a page. It wants
 * `page("/messages/host-margalla-view", "ga-098", "Messages with Ayesha — Margalla View Apartment", "noindex,follow", null)`
 * so G43's first-word check lands on the `<h1>` below.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadId: string }>;
}): Promise<Metadata> {
  const { threadId } = await params;
  if (!isThreadId(threadId)) {
    const entry = routeByPath.get(`/messages/${threadId}`);
    if (entry?.status === "stub") return stubMetadata(entry);
    notFound();
  }
  return pageMetadata(threadPath());
}

/* ─── Page-local parts ───────────────────────────────────────────────────── */

/**
 * One message.
 *
 * §6: *"Own bubbles trailing, host's leading; incoming = `bg.raised`"* — TASTE
 * §6's fourth job for that one tint. Own bubbles take `interactive.subtle`, a
 * pale brand TINT rather than a brand fill, which is the same call
 * `app/trips/[id]/page.tsx` makes for its avatar and states the reason for: it
 * is outside §8's three-role green budget and outside the `bg-interactive` /
 * `text-interactive` grep that checks it.
 *
 * NEITHER BUBBLE CARRIES A BORDER OR A SHADOW. TASTE §1 puts content in the
 * "carries NEITHER" column and §9's table for these surfaces lists what is
 * bordered here — chevron rows, list rows, the trip hero, form groups, banners.
 * A bubble is on neither list. `ga-098` draws a hairline on both and a
 * `border.brand` on the guest's; the brand stroke is a fifth green role by any
 * reading, and once it goes the neutral hairline is drawing an edge on a shape
 * a fill already defines.
 *
 * THE SIDE IS NEVER THE ONLY SIGNAL, AND NEITHER IS THE COLOUR. `items-end` /
 * `items-start` on a column flex container resolve against the INLINE axis, so
 * the two sides swap under RTL with no rule of their own; the fills differ; and
 * an `sr-only` speaker name leads the message for anyone reading neither.
 *
 * SCRIPT. §6: *"An Urdu bubble renders **natively RTL in Nastaliq inside an LTR
 * thread**."* `dir` and `lang` are set from the message's own language, not the
 * document's, and `font-urdu` is the token stack (`Noto Nastaliq Urdu` →
 * `Noto Naskh Arabic` → serif). The face itself is not loaded yet — Urdu is
 * `GO-LIVE` C2 — so today this renders in the fallback and upgrades for free the
 * day the font ships. `leading-loose` because Nastaliq needs the descent room
 * and `ga-098` gives it 1.95 against the Latin 1.5.
 *
 * `Num` isolates every digit run inside the body, in both scripts, no caption
 * carve-out (`BUILD-DECISIONS.md` #2) — which is what stops the `2` of
 * "دوپہر 2 بجے" reordering against its own sentence.
 */
function Message({
  from,
  lang,
  body,
  time,
  speaker,
}: {
  readonly from: "guest" | "host";
  readonly lang: "en" | "ur";
  readonly body: string;
  readonly time: string;
  readonly speaker: string;
}) {
  const own = from === "guest";
  const urdu = lang === "ur";

  return (
    <li className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
      <p
        dir={urdu ? "rtl" : undefined}
        lang={urdu ? "ur" : undefined}
        className={`max-w-[84%] rounded-lg px-4 py-3 text-start text-bodyMd text-primary ${
          own ? "bg-brand-subtle" : "bg-raised"
        } ${urdu ? "font-urdu leading-loose" : "leading-relaxed"}`}
      >
        <span className="sr-only">{speaker}: </span>
        <Num>{body}</Num>
      </p>

      {/*
        The parent IS a flex container, which is exactly the case
        `BUILD-DECISIONS.md` #22 was written for: `Num` output goes inside ONE
        `<span>`, or the flex gap renders inside the word. Time only — no
        delivery mark, no read receipt (§14, and `thread.ts`).
      */}
      <span className="mt-1.5 flex items-center gap-2 px-1 text-label font-regular text-tertiary">
        <span>
          <Num>{time}</Num>
        </span>
      </span>
    </li>
  );
}

/* ─── The route ──────────────────────────────────────────────────────────── */

export default async function ThreadRoute({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  if (!isThreadId(threadId)) {
    const entry = routeByPath.get(`/messages/${threadId}`);
    if (entry?.status === "stub") {
      return <RegistryStub entry={entry} links={GUEST_STUB_LINKS} />;
    }
    notFound();
  }

  const stayRange = formatStayRange();

  return (
    <MessagesMain>
      {/*
        §4b's `.backrow`, and §15's general form of `CHECKOUT-SHELL` §15: `Back`
        returns to the last state that still exists. From a thread that is
        `/messages` — which renders its first-run empty state, the same seam
        `/trips/{id}` → `/trips` already ships.
      */}
      <TripBackLink href="/messages">Your messages</TripBackLink>

      {/*
        `items-baseline` puts the chip on the heading's baseline rather than its
        optical centre (TASTE §11.16); `flex-wrap` drops it to its own line on a
        narrow viewport instead of squeezing the heading.

        The `<h1>` names the conversation rather than the person, because a page
        title that is only a first name tells a reader what they are looking AT
        and not what they are looking at it FOR. `ga-098`'s title bar carries the
        name over a `Margalla View Apartment · Confirmed` subtitle; on web the
        support line below takes the stay and the chip takes the status.
      */}
      <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <TripPageHead title={`Messages with ${TRIP.host}`} />
        <ConfirmedChip />
      </div>

      {/*
        The stay, once. Same shape as `/trips/{id}`'s support line so the two
        screens introduce one booking identically: the home links to its own
        listing — a real indexable page rather than a stub — and `·` appears once
        per gap with spaces both sides (TASTE §7).
      */}
      <p className="mt-2 max-w-[56ch] text-bodyMd font-regular leading-relaxed text-secondary">
        {/* A17: the date isolate ends the line, so under RTL it took the
            paragraph direction and led it — `Fri 14 – Mon 17 Aug 2026 ·
            Margalla View Apartment`. `Phrase` closes the line around both. */}
        <Phrase>
          <Link className={inlineAction} href={TRIP.listingHref}>
            {TRIP.home}
          </Link>{" "}
          · <Num>{stayRange}</Num>
        </Phrase>
      </p>

      {/*
        The sentence standing between a reader and mistaking a fixture for a
        record. THE SHIPPED STRIP, not a third one: `ga-097`/`ga-098` are the
        cards, `ExampleBookingStrip` is the pattern `/trips/{id}` and the review
        screen already carry, and its child slot is where each screen says what
        IT would be claiming if it were real. On this screen that claim is the
        heaviest of the three — a conversation implies somebody read it.

        Delete this strip and `thread.ts` in the same commit, or neither.
      */}
      <ExampleBookingStrip className="mt-6">
        The conversation below was written the same way: nobody sent it, and nobody read it.
      </ExampleBookingStrip>

      {/*
        `ga-098`'s `.ctx` stay strip, as the row idiom this product already uses
        for a next step. It is a LINK to the booking rather than a second copy of
        its facts: the dates are in the line above, and the receipt, the payment
        and the cancellation window all live one page away on a surface that owns
        them. §12's "never a dead end" is satisfied by a way onward, not by
        restating what is already on screen.
      */}
      <ActionList>
        <ActionRow
          href={tripPath()}
          icon={<CalendarIcon className="size-5" />}
          title="View the stay"
          sub="Your dates, what you paid, and the receipt"
        />
      </ActionList>

      <TripSection
        id="thread"
        heading="The conversation"
        sub={`Everything ${TRIP.host} wrote, and everything you wrote back, in whichever language each of you used.`}
        className="mt-8"
      >
        {/*
          62ch, `CHECKOUT-SHELL` §5's prose measure and the one §4b gives a
          section's support line. This is the single most important translation
          decision on the screen: a chat log alternating across a 1120px column
          would put the two speakers a third of a metre apart and make the
          alternation unreadable as a conversation. The frame is 1120; the
          conversation is a reading measure inside it.
        */}
        <div className="mt-6 max-w-[62ch]">
          {/*
            The day, and what opened the thread. Centred over the log because
            that is what a date separator is for; `text-label` tertiary, with no
            pill, no uppercase and no tracking — `ga-098` draws `.daysep` as a
            tracked uppercase pill, and `overline` is a FORM-LABEL token that
            TASTE §7 allows in exactly three places, none of them here.

            The date is the booking's own confirmation date, never "Today"
            (`thread.ts`).
          */}
          <p className="text-center text-label font-regular text-tertiary">
            <Num>{THREAD_DAY}</Num>
          </p>
          <p className="mx-auto mt-1 max-w-[46ch] text-center text-label font-regular leading-normal text-tertiary">
            This conversation opened when the booking was confirmed.
          </p>

          <ol
            aria-label={`Messages with ${TRIP.host}`}
            className="mt-6 flex list-none flex-col gap-5"
          >
            {THREAD.map((message) => (
              <Message
                key={message.id}
                from={message.from}
                lang={message.lang}
                body={message.body}
                time={message.time}
                speaker={message.from === "guest" ? "You" : TRIP.host}
              />
            ))}
          </ol>
        </div>
      </TripSection>

      {/*
        NO SUPPORT LINE ON THIS SECTION, DELIBERATELY. The strip above already
        says the conversation is written into the site, and the composer's own
        status line says where the words stop — a third sentence between them
        would say the same thing a third time, which reads as a product
        apologising rather than a product being clear. §12 puts the explanation
        on the disabled control itself, which is where it is.
      */}
      <TripSection id="reply" heading="Write a reply" className="mt-8">
        <Composer host={TRIP.host} />
      </TripSection>
    </MessagesMain>
  );
}
