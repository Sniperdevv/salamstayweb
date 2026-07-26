"use client";

import { bodyText } from "@/components/editorial/prose";
import { useConsent } from "@/lib/consent";

/**
 * GW-014 §3 — the one line on the site that reports a value read out of the
 * reader's own browser.
 *
 * WHAT IT REPLACED, AND WHY THAT MATTERED MORE HERE THAN ANYWHERE
 * --------------------------------------------------------------
 * The consent record shipped as static server HTML reading "Essential only.
 * Analytics, Marketing and Preferences are off." — printed identically to every
 * reader, including everyone who had pressed **Accept all**. On the page whose
 * entire job is disclosing what is stored and what the reader chose, a fixed
 * sentence about a per-reader value is not a rough edge; it is the page failing
 * at the only thing it does.
 *
 * IT REPORTS THE CHOICE, NOT AN EFFECT
 * ------------------------------------
 * "You chose Accept all" is verifiable — it is the string in storage, echoed in
 * the banner's own words. "Analytics is on" would not be: no analytics,
 * marketing or preferences storage exists on SalamStay today (§5 says so), so a
 * line claiming a category is now running would invent behaviour to match a
 * button. The record is what exists, so the record is what this states.
 *
 * THE PRE-HYDRATION FRAME IS A SENTENCE, NOT A SHIMMER
 * ----------------------------------------------------
 * `useConsent` starts at `pending`, so the server HTML and the first client
 * frame agree and no wrong answer is ever painted. What renders there says why
 * it is empty rather than guessing or shimmering: a skeleton bar is right for a
 * value that is arriving over a request, and this one is arriving from the
 * reader's own machine — the honest thing to show a person, and the honest
 * thing to leave in the HTML a crawler reads, is the reason.
 *
 * `aria-live="polite"` because the line changes after load without the reader
 * acting, and changes again when the banner behind them is answered. Politely:
 * it is a disclosure, never an interruption.
 */
export function ConsentStateLine() {
  const state = useConsent();

  return (
    // `min-h-[2lh]` reserves the taller of the two states. The pending sentence
    // wraps to two lines at this strip's measure while every resolved answer is
    // one, so without the reservation the block collapsed 26px the instant
    // hydration landed — a jump on the one element the page exists for, on every
    // load. Same device as `stays/stay-card-compact.tsx`'s price skeleton.
    <p aria-live="polite" className={`mt-1.5 min-h-[2lh] ${bodyText}`}>
      {state === "pending" ? (
        "This line reads the record kept in your own browser, so it fills in once the page has loaded."
      ) : state === "unset" ? (
        <>
          <Payload>No choice is recorded yet</Payload> in this browser — which is why the banner is
          still asking.
        </>
      ) : state === "all" ? (
        <>
          You chose <Payload>Accept all</Payload>.
        </>
      ) : (
        <>
          You chose <Payload>Only what&rsquo;s needed</Payload> — the essentials, and nothing else.
        </>
      )}
    </p>
  );
}

/** TASTE §7: the payload word, and only the payload word. Matches the prose template's bold run. */
function Payload({ children }: { readonly children: React.ReactNode }) {
  return <strong className="font-semibold text-primary">{children}</strong>;
}

export default ConsentStateLine;
