"use client";

import Link from "next/link";
import { useState } from "react";

import { focusRing, inlineAction } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";

/**
 * `ga-098`'s composer, told the truth.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO SEND, AND THE BUTTON SAYS SO RATHER THAN PRETENDING
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Nothing is behind this page: no transport, no store, no host on the other
 * end. A green Send that swallows a message is the single worst thing this
 * surface could ship — a guest would believe their host had been asked about
 * check-in, and would find out at a gate in Islamabad that nobody had. So the
 * control is **disabled, visible, in place, and explaining itself**, which is
 * the shipped grammar for exactly this, three times over:
 *
 *  · TASTE §1: *"Disabled floating controls stay visible, lose the shadow, keep
 *    their place: flat gray fill, no layout shift."*
 *  · TASTE §11.7 and `post-flow.tsx`'s `ActionRow`: *"visible, in place, and
 *    explaining itself in its own sub … a row that lifts under the pointer and
 *    then does nothing is a worse failure than one that never offered."*
 *  · `GUEST-SHELL.md` §12: *"Never a dead end. Every empty state, every error
 *    and every **disabled control** names its next action."* Its next action is
 *    the help centre, which is a real, built page.
 *
 * THE FIELD ITSELF STAYS LIVE. Writing into it costs nothing and reveals what
 * the surface is for; the sentence under it and the button beside it both say
 * where the words stop. A disabled textarea would take away the only honest
 * thing here — that a guest can see how their own reply would read — in
 * exchange for a truth the copy already tells.
 *
 * `aria-disabled`, NOT `disabled`. A `disabled` button leaves the tab order, so
 * a keyboard or screen-reader user reaches the field, finds no way forward, and
 * is never told why: the explanation is a paragraph they would have to go
 * hunting for. `aria-disabled` keeps the control focusable, announces it as
 * dimmed, and `aria-describedby` reads the reason out at the moment it matters.
 * The same id describes the textarea, so the truth arrives whichever of the two
 * a reader lands on first. There is no `onClick`: the button is inert by
 * construction rather than by an early return somebody could delete.
 */

/**
 * `btnPrimaryPill`'s geometry wearing `checkout-step.tsx`'s disabled skin.
 *
 * Spelled out rather than composed, for the reason `components/ui.ts` records
 * against `btnSecondaryMd` and `btnSecondaryOnTint`: Tailwind emits utilities in
 * token order, so appending `bg-raised` to a class string that already carries
 * `bg-interactive` is decided by the stylesheet, not by the order written here.
 * A state is a whole recipe.
 *
 * THE BORDER IS NOT DECORATION, and `checkout-step.tsx` measured it: `bg.raised`
 * against `bg.canvas` is 1.06:1 in light and 1.08:1 in dark, so without an edge
 * a disabled primary is dim text floating with no shape at all. `text.disabled`
 * is the house token for disabled text everywhere; its contrast is a
 * system-level question logged at `GO-LIVE` C7.
 *
 * No `pressable`. A control that cannot be pressed does not answer a press —
 * that absence IS the signal (TASTE §1: shadow, and here the press, is the
 * enabled signal).
 */
const sendDisabled =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 " +
  "whitespace-nowrap rounded-full border border-border-default bg-raised px-6 text-bodyMd " +
  `font-semibold text-disabled ${focusRing}`;

const REASON_ID = "reply-not-connected";

export function Composer({ host }: { readonly host: string }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="mt-4 max-w-[62ch]">
      {/*
        §15's `components/ui/textarea.tsx`, imported rather than redrawn. Its
        label is visible and stays that way: a composer whose only label is a
        placeholder is `CHECKOUT-SHELL` §5's banned shape ("no placeholder-as-
        label, ever"), and here the label is also the one line that names who is
        being written to.

        NO COUNTER. `TextareaCounter` exists for a host writing a listing
        description, where length is a real editorial aim. A message has no aim,
        and a number under it would be a budget invented for prose nobody is
        spending.

        `dir` is deliberately unset, so the field inherits the document's
        direction and a guest writing Urdu on an Urdu page gets an Urdu caret —
        the same reason `hw-004` DECISION 3 makes it explicit on host prose
        fields, applied to the case where the document already knows.
      */}
      <Textarea
        id="reply"
        label={`Your reply to ${host}`}
        value={draft}
        onChange={setDraft}
        rows={4}
        placeholder="Say salam, ask about check-in"
        describedBy={REASON_ID}
      />

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          aria-disabled="true"
          aria-describedby={REASON_ID}
          className={sendDisabled}
        >
          Send
        </button>

        {/*
          The reason, and the next step, in one line — §12's "never a dead end".
          `/help` is a built page, not a stub, so the way onward actually goes
          somewhere. Nothing here says how fast anyone answers: §13 makes claim 8
          the only permitted statement about support availability, and anything
          else is an invented SLA (§14).

          Underlined at rest, in ink (TASTE §8). Not green — §8 keeps links ink
          on every signed-in guest surface, and this surface spends no green at
          all: its one button is disabled, and a disabled primary spends nothing.
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
