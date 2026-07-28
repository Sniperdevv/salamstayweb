"use client";

import Link from "next/link";
import { useState } from "react";

import {
  btnPrimaryPillInert,
  inlineAction,
} from "@/components/ui";
import { Select, type SelectOption } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


/**
 * `ha-072` panel B's compose form, told the truth.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  NOTHING OPENS A CASE, AND THE BUTTON SAYS SO
 * ═══════════════════════════════════════════════════════════════════════════
 * There is no case store, no mediation queue and no guest on the other side to
 * be asked for their view. **Send to SalamStay** is therefore disabled, visible,
 * in place, keeping its own label, with `aria-disabled` and the reason in the
 * note it is described by — the same grammar the two message composers ship and
 * the reservation's own blocked `Confirm decline` reaches for.
 *
 * The stakes here are the highest on the host side. A host who believed they had
 * opened a case about property damage would stop chasing it, and the window in
 * which anything could be done would close while they waited. So the sentence
 * beside the button is unambiguous and the strip above the form says it first.
 *
 * The fields stay live: choosing a subject and writing the account out shows
 * what the surface is for, and a host can read back how their own description
 * lands. What is missing is the sending, and only the sending.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  WHAT THE CARD DRAWS HERE THAT IS NOT SHIPPED
 * ═══════════════════════════════════════════════════════════════════════════
 *  · **Evidence rows and "Add a photo or document".** `side-table-damage.jpg`
 *    and `repair-quote.pdf` are staged files in a product with no upload
 *    endpoint and no document store. An attach control that accepts a
 *    photograph of a damaged room and drops it is worse than no control.
 *  · **The character counter.** A budget invented for prose nobody is spending.
 *  · **"Fatima will share her side too — we look at both before deciding
 *    anything."** The commitment is real and live on `/trust-and-safety`, and
 *    the page above states it as the process it is. It is NOT restated beside
 *    this button, where a promise about what happens next would attach itself to
 *    a submit that does not submit.
 */

/**
 * `ha-072`'s four subjects, which are also the four rows the page lists above
 * the form — one for one, so a host sees the whole vocabulary before choosing
 * from it, exactly as the card intends.
 *
 * Labels only: an `<option>` holds text (`components/ui/select.tsx`).
 */
const SUBJECTS: readonly SelectOption[] = [
  { value: "damage", label: "Property damage during the stay" },
  { value: "house-rules", label: "A house rule that was not followed" },
  { value: "charge", label: "A disagreement about a charge or a refund" },
  { value: "other", label: "Something else about the stay" },
];

const REASON_ID = "host-case-not-connected";

export function CaseForm({ guest }: { readonly guest: string }) {
  const [subject, setSubject] = useState("");
  const [statement, setStatement] = useState("");

  return (
    <div className="mt-6">
      <Select
        id="host-case-subject"
        label="What is this about?"
        value={subject}
        onChange={setSubject}
        options={SUBJECTS}
        /* Never seed a plausible default: pre-selecting "Property damage" would
           put an accusation in the field before the host had made one. */
        placeholder="Choose one"
      />

      <Textarea
        className="mt-6"
        id="host-case-statement"
        label="Describe what happened"
        value={statement}
        onChange={setStatement}
        rows={6}
        placeholder="Explain it in your own words. There is no wrong way to describe it."
        describedBy={REASON_ID}
      />

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          aria-disabled="true"
          aria-describedby={REASON_ID}
          className={btnPrimaryPillInert}
        >
          Send to SalamStay
        </button>

        {/*
          The reason and the next step — §12's "never a dead end". No timeline,
          no "we will get back to you", no reply-time figure in either
          direction: none is measured and this is precisely the surface where
          inventing one would be believed.

          Ink, underlined at rest (TASTE §8). This page spends no green at all —
          its one button is disabled, and a disabled primary spends nothing, so
          the nav's `Create a listing` keeps the surface's one brand role.
        */}
        <p id={REASON_ID} className="text-bodySm font-regular leading-relaxed text-secondary">
          Sending is not connected yet, so nothing you write here reaches SalamStay and no case is
          opened. Neither you nor {guest} is told anything.{" "}
          <Link href="/host/help/contact" className={inlineAction}>
            Host support
          </Link>{" "}
          is the other door, and it is not connected either.
        </p>
      </div>
    </div>
  );
}

export default CaseForm;
