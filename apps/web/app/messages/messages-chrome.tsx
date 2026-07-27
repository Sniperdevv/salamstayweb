import type { ReactNode } from "react";

import { CheckMark } from "@/components/ui/marks";

/**
 * The frame `/messages` and `/messages/{threadId}` share.
 *
 * Two files, one column — `GUEST-SHELL.md` §4: *"`max-w-page` is
 * `container.page` (1120) with `px-6 pb-10 pt-7` — **the same column
 * `HostAppShell` renders**. One authenticated content width across both sides of
 * the product; do not re-coin it, and do not import checkout's 1100 `.wrap`."*
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  WHAT THIS FILE DELIBERATELY DOES NOT DEFINE
 * ────────────────────────────────────────────────────────────────────────────
 *
 * `.backrow`, `.pagehead`, the labelled `<section>` and the example-booking
 * strip are all §4a/§4b furniture, and they already exist — as `TripBackLink`,
 * `TripPageHead`, `TripSection` and `ExampleBookingStrip` in
 * `app/trips/[id]/trip-chrome.tsx`. Both pages here import them from there
 * rather than re-drawing a heading, a chevron link and a hairline rule under
 * new names. §15: *"These primitives exist and are the vocabulary. Adding a
 * parallel one is the defect."* — and §4b's stated goal is that the guest flows
 * *"read as one product"*, which two independently-typed page heads cannot
 * guarantee.
 *
 * THE `Trip` PREFIX IS WRONG FOR THEM AND IS FLAGGED, NOT FIXED HERE. Those
 * four are guest-shell furniture that happens to have been written when the
 * first guest surface was a trip; `app/trips/page.tsx` already imports them
 * across a folder boundary for the same reason. The rename/hoist —
 * `components/guest/guest-frame.tsx`, say — touches every `/trips/*` import
 * site and belongs to whoever moves the tree, not to the messages wave.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  TWO CENTRAL EDITS THESE PAGES NEED AND CANNOT MAKE
 * ────────────────────────────────────────────────────────────────────────────
 *
 *  1. **`components/guest-chrome.tsx` → `NO_FOOTER_ROOTS`** must gain
 *     `"/messages"`. §2's row for the footer on an authenticated guest surface
 *     is one word — `none` — and that file says so itself: *"§2 also says to add
 *     each new authenticated prefix here as it is built … `/messages`,
 *     `/wishlists` and `/account` join this list when their folders land."*
 *     Until it does, these two routes are `noindex, follow` pages trailing ~20
 *     marketing hrefs a crawler is invited to follow out of a leaf.
 *  2. **`components/header-cta.ts` → `CTA_OWNED_BY_PAGE`** must gain
 *     `"/messages"`, and only that one. The inbox's empty state owns this
 *     surface's single green primary (§8 role 3), and `lib/mode.ts` opens at
 *     `pending`, so the SERVER render of `/messages` is the logged-out header —
 *     a green Sign up beside a green *Find a place to stay*. `/trips` carries
 *     exactly this row for exactly this reason. The THREAD needs no row: its one
 *     button is disabled, and §8 is explicit that *"a disabled one spends
 *     nothing"*.
 */

/**
 * §4's authenticated column, and the `<main>` landmark itself.
 *
 * `class="co-main"`, **never** `class="indexable"` (§2). The gates read that
 * class off the served HTML: `indexable` is the marker for a document meant for
 * search, and a signed-in inbox is not one.
 *
 * No breadcrumb, no footer, no JSON-LD below this node — §2's table. These are
 * app surfaces, not a document hierarchy.
 */
export function MessagesMain({ children }: { readonly children: ReactNode }) {
  return <main className="co-main mx-auto w-full max-w-page px-6 pb-10 pt-7">{children}</main>;
}

/**
 * The `Confirmed` status chip — `GUEST-SHELL.md` §6's register table, first row:
 * *"success, muted: `success.fg` on `success.bg` + `success.border`"*, shaped as
 * a pill per §6's shape system.
 *
 * NOT a fourth brand-green role. `feedback.success` is a different semantic axis
 * from `interactive.primary`; §8's mechanical check greps `bg-interactive` /
 * `text-interactive` and this matches neither. Colour is never the only signal
 * either — the tick and the word both carry the state.
 *
 * ═══ DUPLICATION, DECLARED ═══════════════════════════════════════════════════
 * `app/trips/[id]/page.tsx` ships a byte-identical `ConfirmedChip` and its own
 * note says what to do about it: *"It moves to `components/ui/` when a second
 * surface needs a second one."* This IS that second surface. The move was not
 * made here because `components/ui/` is outside this wave's blast radius and
 * three other authors are in the tree; it is the first thing to fold up
 * afterwards. Only `Confirmed` is written, for the reason that note also gives:
 * §6 fixes the full set at five, and a component shipping four registers no
 * surface can reach teaches the next author that those states exist.
 */
export function ConfirmedChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-bg px-3 py-1 text-bodySm font-semibold text-success">
      <CheckMark className="size-3.5" />
      Confirmed
    </span>
  );
}
