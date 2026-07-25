"use client";

import { useCallback, useEffect, useState } from "react";
import { focusRing, pressable } from "@/components/ui";

/**
 * "Was this article helpful?" — two buttons that actually answer a press.
 *
 * WHAT THIS DOES AND, MORE IMPORTANTLY, WHAT IT DOES NOT
 * -----------------------------------------------------
 * It records the reader's answer in `localStorage`, on this device, and says
 * so. There is no network call, no counter, no percentage, no "94% found this
 * helpful". SalamStay has no helpfulness data, so any figure printed here would
 * be invented (TASTE §12), and a button that posts to an endpoint that does not
 * exist is worse than one that does nothing — it lies twice.
 *
 * It shipped as two dead `<button>`s. A control that answers a press by doing
 * nothing is the one thing an interface must never be: the reader presses, gets
 * no feedback, and presses again. The honest minimum is a control that (a)
 * changes state, (b) says what it did, and (c) is truthful about the scope of
 * what it did — hence the wording, which claims nothing beyond the device.
 *
 * ANATOMY
 *  · The pair is the §5 gray-fill secondary button, both at the same size and
 *    the same weight — neither answer is promoted.
 *  · The answer the reader gave takes the §3 INK selected fill (never green:
 *    §2 spends brand on four roles and a feedback control is not one). The
 *    other stays gray and both disable, so the row keeps its shape and the
 *    reader can still see what they said.
 *  · The confirmation is a `role="status"` line, so a screen-reader user hears
 *    the result without hunting for it. It is the only thing that moves.
 *
 * MOTION: one 180ms fade on the confirmation line, no transform on the buttons
 * beyond the shared press. The row does not reflow — the line's box is not
 * reserved because it lands BELOW the pair, where growth pushes nothing the
 * reader is looking at.
 *
 * HYDRATION: nothing device-specific renders until the effect has read storage,
 * so the server HTML and the first client render agree. A reader who returns to
 * the page sees the recorded answer rather than a fresh pair.
 */

const STORAGE_KEY = "salamstay.help-vote";

type Vote = "yes" | "no";

function readVote(slug: string): Vote | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const value = (parsed as Record<string, unknown>)[slug];
    return value === "yes" || value === "no" ? value : null;
  } catch {
    /* Blocked storage, private mode, or a corrupted record: ask again. */
    return null;
  }
}

function writeVote(slug: string, vote: Vote): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const next = typeof parsed === "object" && parsed !== null ? { ...parsed } : {};
    (next as Record<string, string>)[slug] = vote;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Nothing to do: the answer is still acknowledged in this session. */
  }
}

/**
 * The two states of one button, written out whole rather than composed.
 *
 * `${btnSecondary} bg-selected` does NOT work: Tailwind emits `.bg-selected`
 * and `.bg-raised` in token order, so the base fill wins over the append
 * regardless of the order of the classes in the attribute. `ui.ts` records the
 * same finding for `btnSecondaryOnTint`. Both strings below are `btnSecondary`
 * to the letter apart from the fill and the label colour.
 *
 * The chosen answer takes the §3 INK selected fill — never green: §2 spends
 * brand on four roles and a feedback control is not one of them.
 */
const voteBase =
  "inline-flex h-12 w-24 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md px-6 text-bodyMd font-medium disabled:pointer-events-none";
const voteRest = "bg-raised text-primary hover:bg-hairline disabled:opacity-70";
const voteChosen = "bg-selected text-selected-fg";

export interface HelpfulVoteProps {
  /** Article key, so two help pages do not share one answer. */
  readonly slug: string;
}

export function HelpfulVote({ slug }: HelpfulVoteProps) {
  const [vote, setVote] = useState<Vote | null>(null);

  useEffect(() => setVote(readVote(slug)), [slug]);

  const answer = useCallback(
    (next: Vote) => {
      writeVote(slug, next);
      setVote(next);
    },
    [slug],
  );

  const answered = vote !== null;

  return (
    <>
      <div className="mt-3 flex gap-3">
        {(["yes", "no"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => answer(value)}
            disabled={answered}
            aria-pressed={vote === value}
            className={`${voteBase} ${vote === value ? voteChosen : voteRest} ${focusRing} ${pressable}`}
          >
            {value === "yes" ? "Yes" : "No"}
          </button>
        ))}
      </div>

      {/* Always in the tree so the live region exists before it has anything to
          announce — a `role="status"` inserted at the same moment as its text
          is unreliably announced across screen readers. */}
      <p
        role="status"
        className={`mt-3 text-bodySm text-secondary transition-opacity duration-fast ease-decelerate motion-reduce:transition-none ${
          answered ? "opacity-100" : "opacity-0"
        }`}
      >
        {answered ? "Thanks, noted on this device." : ""}
      </p>
    </>
  );
}

export default HelpfulVote;
