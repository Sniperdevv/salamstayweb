"use client";

import Link from "next/link";
import { useState } from "react";

import { inlineAction } from "@/components/ui";
import { Select, type SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { sendDisabled } from "../help-chrome";

/**
 * `ha-071`'s compose panel, told the truth.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THERE IS NO SEND, AND THE BUTTON SAYS SO RATHER THAN PRETENDING
 * ═══════════════════════════════════════════════════════════════════════════
 * Nothing is behind this form: no ticket store, no queue, no support inbox, no
 * person at the other end. A green **Send ticket** that swallowed a host's
 * problem would be the worst control on the host side of this product — worse
 * than the message composer's, because a host who believed they had reported a
 * payout shortfall would sit and wait for an answer that was never coming.
 *
 * So the control is **disabled, visible, in place, keeping its own label, and
 * explaining itself**, which is the shipped grammar for exactly this:
 *
 *  · TASTE §1: *"Disabled floating controls stay visible, lose the shadow, keep
 *    their place: flat gray fill, no layout shift."*
 *  · TASTE §11.7 / `HOST-SHELL.md` §5: a disabled primary is *"same size, same
 *    place, same label"*, and §3's `.capnote` rule puts the blocking reason in a
 *    fixed slot beside it rather than in a note that appears and disappears.
 *  · `HOST-SHELL.md` §12: *"Every error names its next action; every disabled
 *    control explains itself."*
 *
 * `aria-disabled`, NOT `disabled`. A `disabled` button leaves the tab order, so
 * a keyboard or screen-reader user reaches the last field, finds no way forward
 * and is never told why. `aria-disabled` keeps it focusable and announces it as
 * dimmed, and one `aria-describedby` id reads the reason out at the moment it
 * matters — the same id describes the textarea, so the truth arrives whichever
 * of the two a reader lands on first. **There is no `onClick`**: the button is
 * inert by construction, not by an early return somebody could delete later.
 *
 * THE FIELDS STAY LIVE. Choosing a category and writing the problem out costs
 * nothing and shows what the surface is for; the strip above and the sentence
 * below say where the words stop. Disabling them would take away the only
 * honest thing here — that a host can see how their own report would read — in
 * exchange for a truth the copy already tells.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT `ha-071` DRAWS AROUND THIS THAT IS NOT HERE
 * ═══════════════════════════════════════════════════════════════════════════
 *  · **Attachments** — a staged `payout-screenshot.png` row and an "Add an
 *    attachment" control. There is no upload endpoint and nowhere to put a
 *    file; the host message composer refused the same paperclip for the same
 *    reason and said so.
 *  · **The related-listing chip.** It reads a listing off an account this build
 *    does not have, and a chip naming a property that is not yours is the
 *    fixture problem without the fixture's honesty strip.
 *  · **The character counter** (`158 / 1500`). A budget invented for prose
 *    nobody is spending — and `hw-004`'s counter exists for a listing
 *    description, where length is a real editorial aim. A problem has no aim.
 *  · **"A person reads every ticket."** The card's lead, and it is the sentence
 *    this page most wants to say. It cannot: there is no ticket and nobody
 *    reads it. It goes back the day a support desk exists.
 *  · **A ticket reference, the submitted/with-our-team/replied timeline, and the
 *    support reply bubble.** Four readings off a record that does not exist,
 *    including a name and a timestamp for a person who has not written anything.
 *  · **"Support is reachable 24/7, in Urdu or English"** — SEO-RULES §5 claim 8,
 *    which is live and ships byte-exact on `/become-a-host` and
 *    `/help/cantonment-stays` where it describes the platform.
 *    `verify/verification-strip.tsx` recorded why it is wrong HERE: a platform
 *    claim printed beside a control that cannot run reads as a claim about this
 *    host's own case. No availability line, in either language.
 *  · **"Replies may pause briefly around prayer times."** `REPOSITIONING.md`
 *    retires religious framing across the product and SEO-RULES §5's FORBIDDEN
 *    list bans it by name in English and in Urdu. It is not softened, it is not
 *    here.
 *  · **"Routed to our safety team with priority."** A routing promise with no
 *    routing behind it. The category survives, because the vocabulary is real
 *    and a host should see it; the promise does not.
 */

/**
 * `ha-071`'s six, host-shaped. Labels only — an `<option>` holds text, so the
 * card's second line per option ("A payout, fee line, or withholding-tax
 * question") cannot ride inside one. `components/ui/select.tsx` states the
 * trade and takes it deliberately: a native `<select>` buys arrow keys,
 * typeahead, Escape, correct announcement and the OS wheel picker on a
 * mid-range Android, and none of that is re-implementable to the same standard.
 * The labels are written to stand alone as a result.
 *
 * "Licence" and not the card's "License": `/host/verify` ships "Tourism
 * licence", and one product does not spell one word two ways.
 */
const CATEGORIES: readonly SelectOption[] = [
  { value: "payout", label: "Payout, fees or tax" },
  { value: "compliance", label: "Licence, NOC or guest registration" },
  { value: "guest", label: "Something about a guest or a reservation" },
  { value: "listing", label: "Editing, photos, pricing or publishing a listing" },
  { value: "safety", label: "A safety concern" },
  { value: "other", label: "Something else" },
];

const REASON_ID = "host-support-not-connected";

export function ContactForm() {
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="mt-8">
      <Select
        id="host-support-category"
        label="What is this about?"
        value={category}
        onChange={setCategory}
        options={CATEGORIES}
        /* `""` until the host chooses — `select.tsx`: never seed a plausible
           default. A pre-selected "Payout, fees or tax" would file half the
           product's problems under the first row in the list. */
        placeholder="Choose one"
      />

      <Textarea
        className="mt-6"
        id="host-support-message"
        label="What happened?"
        value={message}
        onChange={setMessage}
        rows={6}
        placeholder="Describe it in your own words. There is no wrong way to say it."
        describedBy={REASON_ID}
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

        {/*
          The reason and the next step in one line — §12's "never a dead end".
          `/trust-and-safety` is a built page and it is where SalamStay actually
          sets out what it does when something goes wrong, so the way onward
          lands on something real rather than on another form.

          Nothing here says how fast anyone answers, in either direction. An SLA
          nobody measures is an invented statistic, and a support page is exactly
          where that temptation lives.

          Ink, underlined at rest (TASTE §8). Not green: `HOST-SHELL.md` §7 caps
          this shell's brand roles at what `ha-046` already spends. This page
          spends none at all — its one button is disabled, and a disabled primary
          spends nothing.
        */}
        <p id={REASON_ID} className="text-bodySm font-regular leading-relaxed text-secondary">
          Sending is not connected yet, so nothing you write here leaves this page.{" "}
          <Link href="/trust-and-safety" className={inlineAction}>
            What SalamStay does when something goes wrong
          </Link>{" "}
          is written out in full.
        </p>
      </div>
    </div>
  );
}

export default ContactForm;
