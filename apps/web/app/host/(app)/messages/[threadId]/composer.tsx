"use client";

import Link from "next/link";
import { useState } from "react";

import { focusRing, inlineAction } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";

/**
 * `ha-053`'s composer, told the truth — and the host half of the asymmetry this
 * whole folder exists to close.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO SEND, AND THE BUTTON SAYS SO RATHER THAN PRETENDING
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Nothing is behind this page: no transport, no store, no guest on the other
 * end. A green Send that swallows a message is the single worst thing this
 * surface could ship, and it is worse here than on the guest side: a host who
 * believed they had confirmed a check-in time would not turn up, and somebody
 * would be standing outside a building in Islamabad. So the control is
 * **disabled, visible, in place, and explaining itself**, which is the shipped
 * grammar for exactly this, three times over:
 *
 *  · TASTE §1: *"Disabled floating controls stay visible, lose the shadow, keep
 *    their place: flat gray fill, no layout shift."*
 *  · TASTE §11.7 / `HOST-SHELL.md` §5: a disabled primary is *"same size, same
 *    place, same label"*, and §3's `.capnote` rule puts the blocking reason in a
 *    fixed slot beside it rather than in a note that appears and disappears.
 *  · `HOST-SHELL.md` §12: *"Every error names its next action; every disabled
 *    control explains itself."* Its next action is the help centre, which is a
 *    real, built page.
 *
 * THE FIELD ITSELF STAYS LIVE. Writing into it costs nothing and reveals what
 * the surface is for; the sentence beside it and the button under it both say
 * where the words stop. A disabled textarea would take away the only honest
 * thing here — that a host can see how their own reply would read — in exchange
 * for a truth the copy already tells.
 *
 * `aria-disabled`, NOT `disabled`. A `disabled` button leaves the tab order, so
 * a keyboard or screen-reader user reaches the field, finds no way forward, and
 * is never told why: the explanation becomes a paragraph they would have to go
 * hunting for. `aria-disabled` keeps the control focusable, announces it as
 * dimmed, and `aria-describedby` reads the reason out at the moment it matters.
 * The same id describes the textarea, so the truth arrives whichever of the two
 * a reader lands on first. **There is no `onClick`**: the button is inert by
 * construction rather than by an early return somebody could delete.
 * `../../reservations/[id]/detail.tsx` reaches for the same `aria-disabled` on
 * its blocked `Confirm decline`, for the same stated reason.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ha-053` DRAWS AROUND THE COMPOSER THAT IS NOT HERE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  · **The attachment control and the staged-attachment row.** The card sends a
 *    `House rules — Gulberg 2.pdf` and a `gate-entrance.jpg`. There is no
 *    upload endpoint and no `/host/messages/{id}/attach` route; G37 fails the
 *    build on an href that does not resolve, and a paperclip that opens nothing
 *    is the thing this screen is written to avoid.
 *  · **The offline banner and the `Will send` queue chip.** Offline is a
 *    register every surface ships, and it is honest only where there is
 *    something to queue. With no transport, *"we'll send your reply the moment
 *    you're back online"* is the same lie as a working Send, in a calmer voice.
 *  · **The `Sent` mark under an outgoing bubble.** Nothing was sent, and a
 *    delivery mark is one step from the read receipts the honesty rules ban by
 *    name.
 *  · **The translation toggle**, thread-level and per-message. There is no
 *    translation service. A first-class symmetric translation is the right
 *    feature and it is unbuilt; a control that does nothing is worse than an
 *    absent one. See `../page.tsx` for what ships instead.
 *  · **A response time, "usually replies within…", a typing indicator, an
 *    online dot, a guest rating.** None is computed, stored or displayed
 *    anywhere in this product, and a fixture is not a licence to invent one.
 */

/**
 * `btnPrimaryPill`'s geometry wearing the disabled skin — `hostPrimaryPill` and
 * `btnPrimaryPill` are the same string (`components/host/host-ui.ts`), so the
 * host shell's pill and the guest shell's are one control and this is one
 * disabled state for it.
 *
 * ═══ DUPLICATION, DECLARED ═══════════════════════════════════════════════════
 * `app/messages/[threadId]/composer.tsx` holds a byte-identical `sendDisabled`.
 * It is the same button in the same state on the two sides of one conversation,
 * and it should end up in `components/ui.ts` beside `btnPrimaryPill` — the same
 * fold-up `messages-chrome.tsx` already flags for its `ConfirmedChip`. Not made
 * here: `components/ui.ts` is outside this wave's blast radius and other authors
 * are in the tree.
 *
 * Spelled out rather than composed, for the reason `components/ui.ts` records
 * against `btnSecondaryMd` and `host-ui.ts` repeats for the pill: Tailwind emits
 * utilities in token order, so appending `bg-raised` to a string that already
 * carries `bg-interactive` is decided by the stylesheet, not by the order
 * written here. A state is a whole recipe.
 *
 * THE BORDER IS NOT DECORATION, and `checkout-step.tsx` measured it: `bg.raised`
 * against `bg.canvas` is 1.06:1 in light and 1.08:1 in dark, so without an edge
 * a disabled primary is dim text floating with no shape at all.
 *
 * No `pressable`. A control that cannot be pressed does not answer a press —
 * that absence IS the signal (TASTE §1: the press, like the shadow, is the
 * enabled signal).
 */
const sendDisabled =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 " +
  "whitespace-nowrap rounded-full border border-border-default bg-raised px-6 text-bodyMd " +
  `font-semibold text-disabled ${focusRing}`;

const REASON_ID = "host-reply-not-connected";

export function Composer() {
  const [draft, setDraft] = useState("");

  return (
    <div className="mt-4">
      {/*
        `components/ui/textarea.tsx`, imported rather than redrawn — the host
        shell's own multi-line field (`hw-004`), which is where this component
        came from. Its label is visible and stays that way: a composer whose only
        label is a placeholder is `CHECKOUT-SHELL` §5's banned shape ("no
        placeholder-as-label, ever").

        NO COUNTER. `TextareaCounter` exists for a host writing a listing
        description, where length is a real editorial aim. A message has no aim,
        and a number under it would be a budget invented for prose nobody is
        spending.

        NO `dir`. `hw-004` DECISION 3 makes it explicit on host prose fields so
        the caret behaves in the language being written; here the document
        already knows, and inheriting is what gives a host writing on the future
        `/ur/` route an Urdu caret without this file deciding for them.

        "the guest" rather than a name: nothing in this build names the guest on
        this booking, and the one name available is the account holder's. See
        `../messages-parts.tsx`.
      */}
      <Textarea
        id="host-reply"
        label="Your reply to the guest"
        value={draft}
        onChange={setDraft}
        rows={4}
        placeholder="Answer their question, or confirm when you can let them in"
        describedBy={REASON_ID}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="button" aria-disabled="true" aria-describedby={REASON_ID} className={sendDisabled}>
          Send
        </button>

        {/*
          The reason and the next step, in one line — §12's "never a dead end".
          `/help` is a built page, and it is where the host header's own help
          control already points, so the way onward goes somewhere a host has
          been before.

          THE FIRST SENTENCE IS BYTE-SHARED with the guest composer, deliberately.
          It is one boundary, described once, on both sides of one conversation.

          Nothing here says how fast anyone answers, in either direction: an SLA
          nobody measures is an invented statistic, and this is exactly the
          surface where that temptation lives.

          Underlined at rest, in ink (TASTE §8). Not green — §7 caps this shell's
          brand roles and links are ink on every host surface. This page spends
          no green at all: its one button is disabled, and a disabled primary
          spends nothing.
        */}
        <p id={REASON_ID} className="text-bodySm font-regular leading-relaxed text-secondary">
          Sending is not connected yet, so nothing you write here leaves this page.{" "}
          <Link className={inlineAction} href="/help">
            Reach the SalamStay team through the help centre
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Composer;
