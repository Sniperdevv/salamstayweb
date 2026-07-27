import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronLeftIcon } from "@/components/icons";
import { Num } from "@/components/numerals";
import { RegistryStubBody, stubLayout } from "@/components/registry-stub";
import { inlineAction } from "@/components/ui";
import { CheckMark } from "@/components/ui/marks";
import { TRIP, formatStayRange } from "@/lib/booking/trip-record";
import { routeByPath } from "@/lib/seo/route-registry";
import { THREAD, THREAD_DAY, isThreadId } from "@/app/messages/[threadId]/thread";

import { Composer } from "./composer";
import { ExampleThreadStrip } from "../messages-parts";
import { StatusChip } from "../../reservations/reservation-parts";

/**
 * HA-053 — `/host/messages/{threadId}`, the host's side of the one conversation
 * this build has, at web width.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  ONE SCRIPT, TWO SCREENS — WHY NOTHING BELOW IS WRITTEN OUT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `THREAD`, `THREAD_DAY`, `THREAD_ID` and `isThreadId` are **imported from
 * `app/messages/[threadId]/thread.ts` verbatim** — the guest side's own module,
 * not a copy of it and not a host-flavoured rewrite. `TRIP` and
 * `formatStayRange()` come from `lib/booking/trip-record.ts` for the same
 * reason, so the two screens cannot disagree about the home, the city or the
 * dates either.
 *
 * That is the whole design of this file. A conversation written twice is two
 * chances to say two different things about what a host promised a guest, and
 * the day they drift there is no way for a reader to tell which one lied. So the
 * roles are read the other way round and NOTHING else changes: `from: "host"` is
 * this page's OWN side and takes the trailing edge; `from: "guest"` is incoming
 * and takes the leading one. Add a message to `thread.ts` and it appears on both
 * screens in the same breath; edit one here and there is nothing to edit.
 *
 * Every content cut `thread.ts` records — the dropped request note, the masjid
 * question, the load-shedding exchange, the parking claim, the per-message
 * `Sent` mark, the translate control — is inherited with the array, along with
 * its reasoning. Read that file's header; it is not restated here.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHOSE CONVERSATION THIS IS, STATED RATHER THAN IMPLIED
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `lib/mode.ts` fixes the signed-in person as **Aqib Khan**, and
 * `../../reservations/reservations.ts` gives that account two homes, Gulberg 2
 * Residence and Cantt View Residence. This booking is **Margalla View Apartment
 * in F-7, hosted by Ayesha** — a different host, on the guest side of the same
 * account's product. `lib/seo/route-registry.ts` states the standing rule
 * against blurring that: a page carrying another fictional host's figures would
 * "put two fictional accounts in one product … A host who noticed would be right
 * to stop trusting both screens."
 *
 * The resolution is the guest side's own, applied symmetrically:
 *
 *  · **`/host/messages` renders EMPTY** — a list is a claim about what the
 *    reader has, and this account has no conversations.
 *  · **This route is a worked example, and says so on screen** — the strip
 *    below, which is where the claim is made and qualified in the same
 *    paragraph. `/messages` and `/messages/host-margalla-view` are exactly this
 *    pair on the guest side, and `app/trips/page.tsx` wrote the rule both
 *    obey.
 *
 * The strip is therefore not a disclaimer bolted on afterwards. It is the only
 * thing that makes this page legal to render, and deleting it deletes the page.
 *
 * THE GUEST IS NOT NAMED. Nothing in this build names them: `TRIP` names the
 * home, the city and the host; `thread.ts` labels its two speakers by side;
 * every guest surface writes "You". The single name available is the account
 * holder's, and printing it here would render one person messaging himself.
 * `/host/today` already ruled the general case when it dropped `hw-007`'s
 * "Welcome back, Aqib" — *"the name is data this build does not have"* — so the
 * `<h1>` names the conversation by the stay instead, which is also what
 * `/messages/host-margalla-view` argues for on its own heading: *"a page title
 * that is only a first name tells a reader what they are looking AT and not what
 * they are looking at it FOR."*
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ha-053` DRAWS THAT THIS DOES NOT SHIP
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `HOST-SHELL.md` §0.2 is load-bearing: the card predates `REPOSITIONING.md`,
 * the `ha-*` sweep has not run, and parts of it are superseded by name. Its own
 * thread is Aqib and Fatima at Gulberg 2 and turns on a masjid question and a
 * load-shedding question — the first retired outright by the repositioning, the
 * second the flagship claim, which `thread.ts` explains is disclosed on the
 * listing page and must not be restated inside a scripted conversation. The
 * chrome cuts:
 *
 *  · **The `Request` header state, the request context block and `Review
 *    request`.** #10 rules Instant Book only on web, so there is no request
 *    stage to open on; the thread opens on a CONFIRMED booking.
 *  · **The one-tap translation bar, the per-message toggle and the mirrored
 *    "this is what Fatima receives" bubble.** There is no translation service. A
 *    first-class, symmetric translation is the right feature and it is unbuilt;
 *    a toggle that does nothing is the thing this screen is written to avoid.
 *    Ayesha writes in Urdu and it renders as Urdu, which is the actual
 *    requirement — and a reader who has no Urdu cannot read it, which is the
 *    honest state and is said in the section's own support line.
 *  · **The offline banner and the `Will send` queue.** Nothing to queue.
 *  · **The attachment bubbles and the composer's attach control.** No upload
 *    endpoint, no registered route; G37 fails on an href that does not resolve.
 *  · **The `⋯` sheet** — translate, view the reservation, `Mark as unread`,
 *    Report a problem (`ga-132`), Block (`ga-133`). None has a registered route
 *    or a store. Blocking and reporting are boundaries that matter and they are
 *    unbuilt, not dropped.
 *  · **`View the request` / `View the reservation`.** The guest's thread ships
 *    the equivalent row to `/trips/{id}`, and it resolves. The host equivalent
 *    would be `/host/reservations/{id}` — and this booking is **not in that
 *    fixture**, because it is not on this account. A row pointing at a
 *    reservation nobody has is a dead end wearing a next step, so there is none.
 *  · **A response time, a read receipt, a typing indicator, an online dot, a
 *    guest rating.** Never invented, here or anywhere.
 *
 * ROUTE CONTRACT (`HOST-SHELL.md` §1), none of it restated below: `noindex,
 * follow` from `app/host/layout.tsx`; no canonical; no hreflang; no JSON-LD; no
 * breadcrumb; `<main class="co-main">` from `HostAppShell`; exactly one `<h1>`,
 * paired with the registered title for G43. The strings are written out rather
 * than read through `pageMetadata` because that helper throws on a path the
 * registry does not carry, and the registry is updated centrally — the shape
 * `../../reservations/[id]/page.tsx` documents.
 *
 * MOTION: none. §10 — no entrance animation on a surface the host will revisit —
 * and no stagger on the log either: a conversation is not a reveal, and
 * animating four bubbles in would make a record of what was said look like
 * something arriving now.
 */

/**
 * The registered title, and the one id this route answers for.
 *
 * `isThreadId` — and therefore `THREAD_ID` — is reused rather than minted, so
 * ONE conversation carries ONE id across both sides of the product and the
 * route it resolves at is `/host/messages/host-margalla-view`. That slug reads a
 * little oddly under `/host/`, having been named from the guest's point of view,
 * and it is the cheaper of the two costs available: a second id for one thread
 * is exactly the drift this file's whole design argues against, and `thread.ts`
 * records that the real shape of a thread id is a backend decision nobody has
 * taken yet.
 *
 * The title names the stay rather than a person, for the reason the heading does
 * — and it is distinct from the guest side's "Messages with Ayesha — Margalla
 * View Apartment", which G41 requires: it rejects duplicate titles across a run.
 * G43 checks the `<h1>`'s words appear in it, and they do.
 */
const TITLE = "Messages about Margalla View Apartment — SalamStay hosting";

/**
 * THE ROUTING SHADOW THIS FILE CASTS, AND THE BRANCH THAT CANCELS IT.
 *
 * `app/[...registered]/page.tsx` is the LEAST specific route in the tree, so
 * every dynamic segment added above it takes paths away from it — silently, and
 * in a way no gate reports, because `validate-pages --all` fetches only routes
 * whose status is `page`. `components/registry-stub.tsx` was written the day
 * `app/trips/[id]/page.tsx` did this to `/trips/requests`.
 *
 * Nothing is registered under `/host/messages/` today, so this is insurance
 * rather than a fix — but the insurance costs three lines and the bug it
 * prevents is invisible. `RegistryStubBody` (not `RegistryStub`) exists for
 * exactly this case and says so: *"the caller supplies `<main>`, because a host
 * stub renders inside `HostAppShell`'s"*. The links are the host pair
 * `app/[...registered]/page.tsx` already uses for a `/host/*` stub, so a host who
 * lands on one is offered hosting rather than the guest homepage.
 */
const HOST_STUB_LINKS = [
  { href: "/host/today", label: "Back to hosting" },
  { href: "/host/listings", label: "Your listings" },
] as const;

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ threadId: string }>;
}): Promise<Metadata> {
  const { threadId } = await params;

  if (!isThreadId(threadId)) {
    const entry = routeByPath.get(`/host/messages/${threadId}`);
    if (entry?.status === "stub") {
      return { title: { absolute: entry.title }, robots: { index: false, follow: true } };
    }
    /* An id nobody has is answered by `notFound()` in the route body. Returning
       nothing here lets that 404 render instead of throwing on the way to it. */
    return {};
  }

  return { title: { absolute: TITLE } };
}

/* ─── Page-local parts ───────────────────────────────────────────────────── */

/** `hw-001`'s `.fsec` — hairline top, `space-7` above and below. */
const section = "mt-7 border-t border-hairline pt-7";
const sectionHeading = "text-h5 font-semibold text-primary";

/**
 * One message.
 *
 * SIDES. The host's own bubbles take the trailing edge and the guest's the
 * leading one — the mirror of `/messages/host-margalla-view`, where the same two
 * messages sit on the opposite sides. `items-end` / `items-start` on a column
 * flex container resolve against the INLINE axis, so both swap under RTL with no
 * rule of their own.
 *
 * FILLS. Incoming is `bg.raised` — TASTE §6's fourth job for that one tint, and
 * the same tint `../../reservations/[id]/detail.tsx` already puts under the
 * guest's request note. Own bubbles take `interactive.subtle`, a pale brand TINT
 * rather than a brand fill.
 *
 * ═══ THE ONE PLACE THIS SURFACE ARGUES WITH `HOST-SHELL.md` §7 ═══════════════
 * §7's app-surface ruling is **"Add nothing to it"**, and
 * `../../reservations/reservation-parts.tsx` honours it by stripping the card's
 * brand tint off the guest avatar. So `bg-brand-subtle` here is a decision, not
 * an oversight, and the grounds are:
 *
 *  1. §7's mechanical check is `grep -c 'var(--int-primary)'`. `interactive.
 *     subtle` is a different variable and matches neither it nor TASTE §2's
 *     `bg-interactive` / `text-interactive` grep, which is the same reasoning
 *     `app/trips/[id]/page.tsx` records for its avatar and
 *     `app/messages/[threadId]/page.tsx` for these exact bubbles.
 *  2. The alternative is worse. `bg.raised` and `bg.sunken` differ by roughly
 *     one percent of luminance in light, so a two-neutral thread is a thread
 *     where the two speakers are told apart by side alone — and side alone is
 *     precisely what a colour-blind or low-vision reader does not get from a
 *     screenshot, a narrow viewport or a reflowed line.
 *  3. **The two sides of one conversation must not use two bubble grammars.**
 *     The guest screen ships this pair today. Shipping a different one here
 *     would make the mirror unreadable as a mirror.
 *
 * Neither bubble carries a border or a shadow. TASTE §1 puts content in the
 * "carries NEITHER" column; `ha-053` draws a hairline on both and a
 * `border.brand` on the host's, and the brand stroke is a fifth green role by
 * any reading. Once it goes, the neutral hairline is drawing an edge on a shape
 * a fill already defines.
 *
 * COLOUR IS NEVER THE ONLY SIGNAL: the fills differ, the sides differ, and an
 * `sr-only` speaker leads the message for anyone reading neither.
 *
 * SCRIPT. `dir` and `lang` are set from the MESSAGE's own language, not the
 * document's, so an Urdu bubble renders natively RTL in Nastaliq inside an LTR
 * thread and an English bubble LTR inside an Urdu one — each snippet aligns to
 * its own script. Both are stated explicitly rather than only the Urdu one: with
 * `dir` unset, an English bubble on the future `/ur/` route would inherit RTL
 * and align to the wrong edge. `font-urdu` is the token stack (`Noto Nastaliq
 * Urdu` → `Noto Naskh Arabic` → serif); the face is not loaded yet, so this
 * renders in the fallback today and upgrades for free the day it ships.
 * `leading-loose` because Nastaliq needs the descent room.
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
  const own = from === "host";
  const urdu = lang === "ur";

  return (
    <li className={`flex flex-col ${own ? "items-end" : "items-start"}`}>
      <p
        dir={urdu ? "rtl" : "ltr"}
        lang={urdu ? "ur" : "en"}
        className={`max-w-[84%] rounded-lg px-4 py-3 text-start text-bodyMd text-primary ${
          own ? "bg-brand-subtle" : "bg-raised"
        } ${urdu ? "font-urdu leading-loose" : "leading-relaxed"}`}
      >
        <span className="sr-only">{speaker}: </span>
        <Num>{body}</Num>
      </p>

      {/*
        Time only — no delivery mark, no read receipt (`thread.ts`).

        `dir="auto"` because "4:02 PM" is a `.num` isolate followed by English
        prose, and inside an RTL container an isolate reorders past the words
        beside it — the defect `/host/calendar` shipped as "2026 August" and
        `/host/earnings` as "nights 3 × PKR 9,500" (GO-LIVE A17). `auto` resolves
        from the first strong character, which is the `P`, so the pair stays
        together in both directions. It goes on this inline span and never on a
        block: a block would take its text-align from the resolved direction and
        pull the line to the wrong edge.
      */}
      <span dir="auto" className="mt-1.5 px-1 text-label font-regular text-tertiary">
        <Num>{time}</Num>
      </span>
    </li>
  );
}

/* ─── The route ──────────────────────────────────────────────────────────── */

export default async function HostThreadRoute({
  params,
}: {
  readonly params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  if (!isThreadId(threadId)) {
    const entry = routeByPath.get(`/host/messages/${threadId}`);
    if (entry?.status === "stub") {
      return (
        <div className={stubLayout}>
          <RegistryStubBody entry={entry} links={HOST_STUB_LINKS} />
        </div>
      );
    }
    /*
      GO-LIVE A11, as a hard rule: *"A surface keyed to a record that does not
      exist refuses to render — 404, or a redirect to its index. It never renders
      a fixture."* Asked on the SERVER, in both `generateMetadata` and here, so an
      unknown id never emits a byte of conversation — no flash, nothing for a
      client guard to undo.
    */
    notFound();
  }

  return (
    /*
      `container.prose` (720). `../../reservations/[id]/detail.tsx` caps itself
      the same way, and on a thread it is the single most important translation
      decision on the screen: a chat log alternating across the shell's full
      1120px column would put the two speakers a third of a metre apart and make
      the alternation unreadable as a conversation. The frame is the shell's; the
      conversation is a reading measure inside it.
    */
    <div className="max-w-prose">
      {/*
        An inline text action, ink and underlined at rest, never brand (TASTE
        §8); the chevron mirrors under RTL. `HOST-SHELL.md` §1 rules out a
        breadcrumb on any host route, so this is a single Back and not a trail —
        and §15's general rule applies: Back returns to the last state that still
        exists, which from a thread is the inbox. The inbox renders its first-run
        empty, the same seam `/host/reservations/{id}` → `/host/reservations`
        already ships.
      */}
      <Link href="/host/messages" className={`inline-flex items-center gap-1 ${inlineAction}`}>
        <ChevronLeftIcon className="size-4 rtl:-scale-x-100" />
        Back to messages
      </Link>

      {/*
        `success` register with the tick — the same pair `../../reservations/`
        uses for `Confirmed`, imported rather than redrawn (a second chip would
        be the defect, not the saving). NOT a brand role: `feedback.success` is a
        different semantic axis from `interactive.primary`, and colour is not the
        only signal because the tick and the word both carry the state.
      */}
      <div className="mt-5">
        <StatusChip tone="success" icon={<CheckMark className="size-3.5" />}>
          Confirmed
        </StatusChip>
      </div>

      {/*
        `h4`, one rung above the inbox's `h5`, and for the reason
        `../../reservations/[id]/detail.tsx` records: the nav says where the host
        is but not WHICH conversation, so this heading is a real page title.
      */}
      <h1 className="mt-3 text-h4 font-semibold text-primary">
        Messages about {TRIP.home}
      </h1>

      {/*
        The stay, once, from `TRIP` — so this line and the guest's introduce one
        booking identically. `·` appears once, spaces both sides (TASTE §7).

        `dir="auto"` on the inline span, not on the `<p>`: the phrase mixes
        `.num` runs (the `7` of F-7, and the whole date range) with English
        prose, which is the exact shape GO-LIVE A17 was raised for.

        The home is NOT linked to its public listing page. It resolves, but a
        bare `<a>` out of the host chrome into the traveller side leaves the
        session saying `hosting` on a guest surface — the one-way-switch defect
        `components/host/host-account-control.tsx` was written to fix, and this
        page has no reason to reopen it.
      */}
      <p className="mt-1 text-bodyMd font-regular text-secondary">
        <span dir="auto">
          <Num>{TRIP.where}</Num> · <Num>{formatStayRange()}</Num>
        </span>
      </p>

      <ExampleThreadStrip className="mt-5" />

      {/* ────────────────────── the conversation ────────────────────────── */}
      <section className={section} aria-labelledby="thread">
        <h2 id="thread" className={sectionHeading}>
          The conversation
        </h2>

        {/*
          The support line says the one thing about this thread a host cannot see
          for themselves, and it is the honest replacement for the translation
          toggle rather than an apology for its absence: Ayesha wrote in Urdu,
          it is rendered as Urdu, and a reader without Urdu cannot read it. 62ch,
          the measure `HOST-SHELL.md` §5 gives a section's support line.
        */}
        <p className="mt-2 max-w-[62ch] text-bodySm font-regular leading-relaxed text-secondary">
          Everything the guest wrote, and everything you wrote back, each in the language it was
          written in. Nothing here is translated, so an Urdu message stays Urdu and an English one
          stays English.
        </p>

        <div className="mt-6">
          {/*
            The day, and what opened the thread. Centred over the log, because
            that is what a date separator is for; `text-label` tertiary with no
            pill, no uppercase and no tracking — `ha-053` draws its day separator
            as a tracked uppercase pill, and `overline` is a FORM-LABEL token
            TASTE §7 allows in exactly three places, none of them here.

            The date is `THREAD_DAY` — the booking's own confirmation date, never
            "Today", which `ha-053` draws and which on a fixture is a claim
            computed against a clock this page does not read: true on the day it
            is written and a lie every day after.
          */}
          <p className="text-center text-label font-regular text-tertiary">
            <span dir="auto">
              <Num>{THREAD_DAY}</Num>
            </span>
          </p>
          <p className="mx-auto mt-1 max-w-[46ch] text-center text-label font-regular leading-normal text-tertiary">
            This conversation opened when the booking was confirmed.
          </p>

          <ol aria-label="Messages, oldest first" className="mt-6 flex list-none flex-col gap-5">
            {THREAD.map((message) => (
              <Message
                key={message.id}
                from={message.from}
                lang={message.lang}
                body={message.body}
                time={message.time}
                /*
                  "You" is the host reading their own thread; the guest is named
                  by role because no record names them. The strip above says so.
                */
                speaker={message.from === "host" ? "You" : "The guest"}
              />
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────────── the reply ──────────────────────────── */}
      {/*
        NO SUPPORT LINE ON THIS SECTION, DELIBERATELY. The strip above already
        says the conversation is written into the site, and the composer's own
        status line says where the words stop; a third sentence between them
        would say the same thing a third time, which reads as a product
        apologising rather than a product being clear. §12 puts the explanation
        on the disabled control itself, which is where it is.
      */}
      <section className={section} aria-labelledby="reply">
        <h2 id="reply" className={sectionHeading}>
          Write a reply
        </h2>
        <Composer />
      </section>
    </div>
  );
}
