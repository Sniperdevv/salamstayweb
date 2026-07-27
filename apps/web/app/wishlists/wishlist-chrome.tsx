import type { ReactNode } from "react";

/**
 * Wishlist-surface furniture.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  WHAT THIS FILE DELIBERATELY DOES NOT DEFINE
 * ────────────────────────────────────────────────────────────────────────────
 *
 * `.backrow`, `.pagehead`, the labelled `<section>` and the `<main>` column are
 * all §4a/§4b furniture and they already exist — as `TripBackLink`,
 * `TripPageHead` and `TripSection` in `app/trips/[id]/trip-chrome.tsx`, and as
 * the landmark in `app/wishlists/layout.tsx`. Both wishlist pages import them
 * rather than re-drawing a heading, a chevron link and a hairline rule under new
 * names. §15: *"These primitives exist and are the vocabulary. Adding a parallel
 * one is the defect."* `app/messages/messages-chrome.tsx` makes the same call
 * and flags the same thing: the `Trip` prefix is wrong for guest-shell
 * furniture, and the hoist to `components/guest/guest-frame.tsx` belongs to
 * whoever moves the tree, not to the wishlists wave.
 *
 * So this file holds one thing.
 */

/**
 * The sentence standing between a reader and mistaking a fixture for a record.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  THE FOURTH INSTANCE OF ONE PATTERN — NOT A FOURTH PATTERN, AND NOT A CHOICE
 *  MADE LIGHTLY. READ THIS BEFORE DELETING IT IN FAVOUR OF AN IMPORT.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Three of these ship already, and the third one wrote down the rule the fourth
 * follows. `app/account/account-chrome.tsx`'s `ExampleAccountStrip`:
 *
 *   > `ExampleBookingStrip` (`app/trips/[id]/trip-chrome.tsx`) and
 *   > `SampleDataStrip` (`app/host/(app)/reservations/reservation-parts.tsx`)
 *   > are the two shipped instances of this one strip, each worded for what its
 *   > own surface claims. **This is the third instance and NOT a third
 *   > pattern**: same TASTE §6 `bg.raised` info strip, same payload-only bold,
 *   > same neutral register — nothing has gone wrong and nobody is being
 *   > cautioned, so it is not the warning register. […] **The wording differs
 *   > because the lie differs.**
 *
 * The classes below are byte-identical to all three. The lead is not, and cannot
 * be, because `ExampleBookingStrip`'s lead is fixed text — *"**Example booking.**
 * SalamStay has no booking store yet, so this stay is written into the site
 * rather than made by anyone."* — and on a wishlist there is **no booking at
 * all**, and there is not one stay but five. Rendering it here would put a
 * sentence about a booking on a page that has none, which is the exact failure
 * the strip exists to prevent, committed by the strip itself. SalamStay honesty
 * law wins over reuse; §15's rule is about not coining a parallel *component
 * family*, and this coins none — it is the same `<p>`, the same tint, the same
 * bold-the-payload, the same 68ch measure.
 *
 * `/messages` is the precedent for the other direction and it holds: the thread
 * DOES hang off the example booking, so `ExampleBookingStrip` is true there and
 * is what that surface imports.
 *
 * WHAT THIS SURFACE WOULD BE CLAIMING IF IT WERE REAL: that somebody pressed a
 * heart. Nobody has — `components/stays/wishlist-heart.tsx` navigates to sign-up
 * instead of toggling, precisely because *"a heart that filled in on click would
 * be claiming a saved list that does not exist."* So the hearts on the cards
 * below this strip are UNFILLED and read "Sign up to save", and that is not a
 * contradiction with the page around them — it is the same fact stated twice, by
 * the strip in words and by the control in its own state.
 *
 * It is NOT a substitute for suppressing invented values. Nothing on either
 * wishlist surface renders a rating, a review count, a nightly price, a save
 * count, a date saved or an availability line. This stops the one list that DOES
 * render being read as somebody's.
 */
export function ExampleWishlistStrip({
  children,
  className = "",
}: {
  /** What this particular screen would be claiming if it were real. */
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <p
      className={`max-w-[68ch] rounded-md bg-raised px-4 py-3 text-bodySm font-regular leading-relaxed text-secondary ${className}`}
    >
      <b className="font-semibold text-primary">Example wishlist.</b> SalamStay has no wishlist
      store yet, so nothing here was saved by anyone. {children}
    </p>
  );
}
