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

export function WishlistHeart({ stayName }: { readonly stayName: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={false}
      aria-label={`Save ${stayName} to a wishlist. Sign up to save.`}
      onClick={() => router.push("/signup")}
      className={`${heartBase} ${focusRing}`}
    >
      <span className="grid size-8 place-items-center rounded-full bg-scrim dark: -dark">
        <HeartIcon className="text-white drop-shadow-[0_1px_2px_rgba(16,25,27,0.45)] size-4 text-slate-0" />
      </span>
    </button>
  );
}

export default WishlistHeart;
