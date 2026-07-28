"use client";

import Link from "next/link";
import { useState } from "react";

import { focusRing, inlineAction } from "@/components/ui";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { routeByPath } from "@/lib/seo/route-registry";

/**
 * GA-109's compose form, told the truth — and made to do the one thing it
 * actually can.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO TICKET STORE, AND SEND SAYS SO RATHER THAN PRETENDING
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `app/messages/[threadId]/composer.tsx` shipped this exact problem first and
 * its reasoning transfers word for word: nothing is behind this page, so a
 * green Send that swallows a message would leave a guest believing support had
 * been told about a rejected document, and finding out at a gate in Islamabad
 * that nobody had. The control is therefore **disabled, visible, in place, and
 * explaining itself**:
 *
 *  · TASTE §1 — "Disabled floating controls stay visible, lose the shadow, keep
 *    their place: flat gray fill, no layout shift."
 *  · `GUEST-SHELL.md` §12 — "Never a dead end. Every empty state, every error
 *    and every **disabled control** names its next action."
 *
 * `aria-disabled`, NOT `disabled`, for the composer's reason: a `disabled`
 * button leaves the tab order, so a keyboard or screen-reader user reaches the
 * field, finds no way forward, and is never told why. `aria-disabled` keeps the
 * control focusable and `aria-describedby` reads the reason at the moment it
 * matters. The same id describes the textarea, so the truth arrives whichever
 * of the two a reader lands on first. There is no `onClick`: the button is
 * inert by construction rather than by an early return somebody could delete.
 *
 * THE CATEGORY SELECT IS NOT DECORATION, AND THIS IS THE POINT OF THE PAGE
 * -----------------------------------------------------------------------
 * GA-109's select exists to route a ticket, and there is nothing to route to.
 * What it CAN do is route the reader: every category on the card maps to help
 * that is either written or openly not written yet, and choosing one shows that
 * list. So the control that cannot file a ticket still answers a question, and
 * the page stops being a form with nothing behind it.
 *
 * The "Being written" mark reads each row's status out of the route registry
 * rather than a hand list — the same mechanism `app/help/page.tsx` uses — so it
 * cannot drift from what the link opens, and it clears itself the day the
 * article lands.
 *
 * FOUR THINGS THE CARD DRAWS THAT ARE DELIBERATELY NOT BUILT
 * ---------------------------------------------------------
 *  · The **attachment rows** and "Add an attachment". There is nowhere for a
 *    file to go. An upload affordance that accepts a file and drops it is worse
 *    than the disabled Send, because the reader would believe evidence had been
 *    delivered.
 *  · The **related-booking context chip** ("About: Margalla View Apartment ·
 *    Booking SS-7F3K9Q"). That is a booking record, and `GUEST-SHELL.md` §12's
 *    cold deep-link rule is unambiguous: a surface keyed to a record that does
 *    not exist renders no fixture.
 *  · The **ticket timeline** (submitted → with our team → replied) and the
 *    **replied conversation**. Both are states of a ticket, and there are no
 *    tickets.
 *  · The card's safety-category description, *"Routed to our safety team with
 *    priority"*. Nothing routes anywhere yet, so that sentence would be a
 *    promise about a mechanism rather than a description of one.
 *
 * NO RESPONSE-TIME PROMISE, ANYWHERE — the card is explicit about it and
 * `GUEST-SHELL.md` §14 makes it law: any statement about how fast anyone
 * answers is an invented SLA. "A person reads every ticket" is shipped copy
 * (`/trust-and-safety`, `/help`) and says nothing about a clock.
 */

interface CategoryLink {
  readonly href: string;
  readonly label: string;
}

interface Category {
  readonly value: string;
  readonly label: string;
  /** What this category covers, in the reader's words. Never a routing promise. */
  readonly covers: string;
  readonly links: readonly CategoryLink[];
}

/**
 * GA-109's six categories, unchanged in name and order. What changed is what
 * sits under each one: the card puts a routing description there, this puts the
 * help that answers it.
 */
const CATEGORIES: readonly Category[] = [
  {
    value: "booking",
    label: "Booking issue",
    covers: "Something about a reservation or a stay.",
    links: [
      { href: "/help/cancellation", label: "Cancellation options and what they refund" },
      { href: "/help/house-rules", label: "House rules on a listing" },
      { href: "/help/cantonment-stays", label: "How cantonment rules work" },
    ],
  },
  {
    value: "payment",
    label: "Payment issue",
    covers: "A charge, a refund, or a question about a receipt.",
    links: [
      { href: "/help/payments/how-money-is-held", label: "How your money is held until check-in" },
      { href: "/help/payments/how-fees-and-taxes-work", label: "How fees and taxes work" },
      { href: "/help/payments/refund-status", label: "Where your refund is" },
      { href: "/legal/guest-refund-policy", label: "Guest refund policy" },
    ],
  },
  {
    value: "verification",
    label: "Verification help",
    covers: "Trouble with a CNIC, a Nikah Nama, an FRC or another document.",
    links: [
      { href: "/verification", label: "How verification works" },
      { href: "/help/verification", label: "Verification and documents" },
      {
        href: "/help/verification/how-cnic-verification-works",
        label: "How CNIC verification works",
      },
      { href: "/help/verification/what-is-an-frc", label: "What is an FRC, and how do I get one?" },
    ],
  },
  {
    value: "safety",
    label: "Safety concern",
    covers:
      "Something about a stay, a home or a person that worries you. If anyone is in immediate danger, contact local emergency services first.",
    links: [
      { href: "/help/report", label: "Report a problem" },
      { href: "/trust-and-safety", label: "Trust and safety" },
      { href: "/help/trip-safety", label: "Staying safe on a trip" },
    ],
  },
  {
    value: "report-person",
    label: "Report a person",
    covers: "Concerned about how a guest or a host has behaved.",
    links: [
      { href: "/help/report", label: "Report a problem" },
      { href: "/legal/community-standards", label: "Community standards" },
    ],
  },
  {
    value: "other",
    label: "Something else",
    covers: "Anything not covered above.",
    links: [
      { href: "/help", label: "Browse the help centre" },
      { href: "/legal/corrections", label: "Corrections — if a page here is wrong" },
    ],
  },
];

/** True when the route this row points at is a thin stub, not a written page. */
const isBeingWritten = (href: string) => routeByPath.get(href)?.status === "stub";

/**
 * `btnPrimaryPill`'s geometry wearing the checkout step's disabled skin,
 * spelled out rather than composed — `components/ui.ts` records why: Tailwind
 * emits utilities in token order, so appending `bg-raised` to a string that
 * already carries `bg-interactive` is decided by the stylesheet, not by the
 * order written here. A state is a whole recipe.
 *
 * The border is not decoration: `bg.raised` against `bg.canvas` is 1.06:1, so
 * without an edge a disabled primary is dim text floating with no shape. No
 * `pressable` — a control that cannot be pressed does not answer a press, and
 * that absence IS the signal (TASTE §1).
 *
 * Byte-identical to `app/messages/[threadId]/composer.tsx`'s `sendDisabled`.
 * Two copies of one state, both local, is the shape `example-strip.ts` argued
 * against; unlike that strip the DIFFERENCE here is nothing at all, so this is
 * flagged for the same fold rather than folded unilaterally from a help page.
 */
const sendDisabled =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 " +
  "whitespace-nowrap rounded-full border border-border-default bg-raised px-6 text-bodyMd " +
  `font-semibold text-disabled ${focusRing}`;

const REASON_ID = "ticket-not-connected";
const CATEGORY_PANEL_ID = "ticket-category-help";

export function ContactForm() {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const chosen = CATEGORIES.find((c) => c.value === category) ?? null;

  return (
    <div className="mt-6 max-w-[62ch]">
      <Select
        id="ticket-category"
        label="What is this about?"
        placeholder="Choose a category"
        value={category}
        onChange={setCategory}
        options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
        describedBy={CATEGORY_PANEL_ID}
        hint="Choosing one shows the help written about it."
      />

      {/*
        The panel is a live region so a screen-reader user hears the list change
        when the category does — the change is the whole behaviour of this
        control, and a silent one would leave a keyboard user with no idea the
        page had answered them. `aria-live="polite"` waits for a pause rather
        than interrupting, which is right for a list nobody is racing.

        It renders in place rather than appearing and disappearing: the
        unchosen state carries the same block with the same sentence, so
        choosing a category re-writes a panel instead of pushing the form down
        the page. `.ctanote`'s fixed-slot rule, applied to a disclosure.
      */}
      <div
        id={CATEGORY_PANEL_ID}
        aria-live="polite"
        className="mt-6 rounded-md bg-raised px-4 py-4"
      >
        {chosen === null ? (
          <p className="text-bodySm leading-relaxed text-secondary">
            Choose a category and the help we have written about it appears here, before you
            write anything.
          </p>
        ) : (
          <>
            <p className="text-bodySm leading-relaxed text-secondary">{chosen.covers}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {chosen.links.map((l) => (
                <li key={l.href} className="flex flex-wrap items-baseline gap-x-3">
                  <Link href={l.href} className={`text-bodySm ${inlineAction} ${focusRing}`}>
                    {l.label}
                  </Link>
                  {/* `label` (13), not `caption` (12) — §7's ladder bottoms out
                      at 13, and this is the word that tells a reader the link
                      they are about to follow is not finished. It has to be
                      read, not skimmed past. */}
                  {isBeingWritten(l.href) ? (
                    <span className="text-label text-secondary">Being written</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/*
        The field stays live, exactly as the messages composer's does: writing
        into it costs nothing and shows what the surface is for, and the sentence
        beside the button says where the words stop. A disabled textarea would
        take away the only honest thing here in exchange for a truth the copy
        already tells.

        NO COUNTER. `TextareaCounter` exists for a host writing a listing
        description, where length is a real editorial aim. A support message has
        no aim, and a number under it would be a budget invented for prose
        nobody is spending. (The card draws `96 / 1500`; 1500 is a limit the
        product has not set.)

        `dir` is deliberately unset, so the field inherits the document's
        direction and a guest writing Urdu on an Urdu page gets an Urdu caret.
      */}
      <Textarea
        id="ticket-message"
        label="What happened?"
        value={message}
        onChange={setMessage}
        rows={5}
        placeholder="Describe it in your own words."
        hint="Share as much detail as helps. There is nothing you have to prove here."
        describedBy={REASON_ID}
        className="mt-6"
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          aria-disabled="true"
          aria-describedby={REASON_ID}
          className={sendDisabled}
        >
          Send ticket
        </button>

        <p id={REASON_ID} className="text-bodySm font-regular leading-relaxed text-secondary">
          Sending is not connected yet, so nothing you write here reaches anyone. The answers we
          have written are in the{" "}
          <Link className={inlineAction} href="/help">
            help centre
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default ContactForm;
