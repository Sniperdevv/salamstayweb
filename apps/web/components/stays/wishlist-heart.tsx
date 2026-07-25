"use client";

import { useRouter } from "next/navigation";
import { HeartIcon } from "@/components/icons";
import { focusRing } from "@/components/ui";

/**
 * Wishlist heart — the pre-auth affordance on a listing card.
 *
 * Two things about this component are structural rather than cosmetic:
 *
 * 1. It is a SIBLING of the card's anchor, never a child. A `<button>` inside
 *    an `<a>` is invalid HTML, and browsers recover from it by moving the
 *    button out of the link, which silently changes the DOM the card was built
 *    against. The card gives it a positioning context instead (ga-016 draws it
 *    the same way: `.lcard` is the relative box, `.lcard-link` and `.heart` are
 *    siblings inside it).
 * 2. It navigates rather than toggling. There is no signed-in state on the web
 *    yet, so a heart that filled in on click would be claiming a saved list
 *    that does not exist. `aria-pressed="false"` is therefore always false and
 *    always honest: nothing is saved, and the press takes you to sign-up, which
 *    is the only place saving can begin.
 *
 * The hit area is 44px per the corpus redline; the visible bubble is 32px, so
 * the target is comfortably larger than the mark, which is what stops a thumb
 * aimed at the heart from opening the listing instead.
 *
 * This is the only client component in the card. The card itself stays a server
 * component so a rail of thirty-six of them ships one small handler, not
 * thirty-six card trees.
 */

const heartBase =
  "absolute right-0 top-0 z-raised grid size-11 place-items-center rounded-full " +
  "transition-transform duration-instant ease-decelerate active:scale-[0.88] " +
  "motion-reduce:transition-[opacity,background-color,border-color,color] motion-reduce:duration-instant " +
  "motion-reduce:ease-decelerate motion-reduce:active:scale-100";

/**
 * TASTE-RULES §10 gives the heart exactly two forms, chosen by what it sits on:
 *
 * - `media` — a NAKED white stroke over a photograph. No plate. The
 *   `drop-shadow` traces the glyph's own alpha (a `box-shadow` would trace its
 *   bounding rectangle), which is the only way a stroke survives an unknowable
 *   image without a scrim — and §9 forbids scrims on photography outright.
 * - `chrome` — a circular neutral-fill button, and ONLY on white chrome, where
 *   there is no photograph to survive and a shadowed stroke would be a shadow
 *   cast onto a flat surface for no reason. The featured card is the one place
 *   this form is correct.
 *
 * `chromeFromSm` is the third because the featured card is the one card on the
 * site whose LAYOUT changes which of those two surfaces the heart lands on: it
 * stacks below `sm` (photograph across the top, so the heart is on the
 * photograph) and runs horizontal from `sm` (photograph on the left, so the
 * heart is on the card's own white padding). It is not a third treatment — it
 * is the same rule answering the same question twice, on one button rather than
 * two, because two hearts in the DOM is two controls to a screen reader.
 */
export type WishlistHeartVariant = "media" | "chrome" | "chromeFromSm";

const glyph: Record<WishlistHeartVariant, string> = {
  media: "size-5 text-slate-0 drop-shadow-on-media",
  chrome: "size-5 text-primary",
  chromeFromSm: "size-5 text-slate-0 drop-shadow-on-media sm:text-primary sm:drop-shadow-none",
};

const plate: Record<WishlistHeartVariant, string> = {
  media: "grid size-8 place-items-center",
  chrome: "grid size-8 place-items-center rounded-full bg-raised",
  chromeFromSm: "grid size-8 place-items-center sm:rounded-full sm:bg-raised",
};

export function WishlistHeart({
  stayName,
  variant = "media",
}: {
  readonly stayName: string;
  readonly variant?: WishlistHeartVariant;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={false}
      aria-label={`Save ${stayName} to a wishlist. Sign up to save.`}
      onClick={() => router.push("/signup")}
      className={`${heartBase} ${focusRing}`}
    >
      <span className={plate[variant]}>
        <HeartIcon className={glyph[variant]} />
      </span>
    </button>
  );
}

export default WishlistHeart;
